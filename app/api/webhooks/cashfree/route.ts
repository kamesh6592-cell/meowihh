import { NextRequest, NextResponse } from 'next/server';
import { CashfreePaymentService } from '@/lib/cashfree';
import { EmailService } from '@/lib/email-service';
import { db } from '@/lib/db';
import { payment, user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { invalidateUserCaches } from '@/lib/performance-cache';
import { clearUserDataCache } from '@/lib/user-data-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-webhook-signature') || '';
    const timestamp = request.headers.get('x-webhook-timestamp') || '';

    console.log('🔔 Received Cashfree webhook');

    // Verify webhook signature
    const isValidSignature = await CashfreePaymentService.verifyWebhookSignature(
      body,
      signature,
      timestamp
    );

    if (!isValidSignature) {
      console.error('❌ Invalid Cashfree webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const webhookData = JSON.parse(body);
    console.log('📦 Cashfree webhook data:', JSON.stringify(webhookData, null, 2));

    // Handle different webhook events
    if (webhookData.type === 'PAYMENT_SUCCESS_WEBHOOK') {
      await handlePaymentSuccess(webhookData.data);
    } else if (webhookData.type === 'PAYMENT_FAILED_WEBHOOK') {
      await handlePaymentFailure(webhookData.data);
    } else if (webhookData.type === 'PAYMENT_USER_DROPPED_WEBHOOK') {
      await handlePaymentDropped(webhookData.data);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('💥 Cashfree webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentData: any) {
  try {
    console.log('✅ Processing successful Cashfree payment:', paymentData.order.order_id);

    // Extract user information from order metadata or customer details
    const customerEmail = paymentData.customer_details?.customer_email;
    let validUserId = null;

    if (customerEmail) {
      const userRecord = await db.query.user.findFirst({
        where: eq(user.email, customerEmail),
        columns: { id: true },
      });
      validUserId = userRecord?.id || null;
    }

    // Store payment record
    const paymentRecord = {
      id: paymentData.cf_payment_id || paymentData.order.order_id,
      createdAt: new Date(paymentData.payment_time || Date.now()),
      updatedAt: new Date(),
      status: 'succeeded',
      totalAmount: parseFloat(paymentData.order.order_amount),
      currency: paymentData.order.order_currency || 'INR',
      paymentMethod: paymentData.payment_method || 'cashfree',
      paymentMethodType: paymentData.payment_method || 'unknown',
      userId: validUserId,
      // Store additional Cashfree-specific data
      metadata: {
        provider: 'cashfree',
        orderId: paymentData.order.order_id,
        cfPaymentId: paymentData.cf_payment_id,
        paymentGroup: paymentData.payment_group,
        paymentMethod: paymentData.payment_method,
      },
      customer: {
        email: customerEmail,
        name: paymentData.customer_details?.customer_name,
        phone: paymentData.customer_details?.customer_phone,
      },
    };

    await db
      .insert(payment)
      .values(paymentRecord)
      .onConflictDoUpdate({
        target: payment.id,
        set: {
          updatedAt: new Date(),
          status: 'succeeded',
          metadata: paymentRecord.metadata,
        },
      });

    console.log('💾 Stored Cashfree payment record:', paymentRecord.id);

    // Send email notifications for successful payment
    if (customerEmail) {
      try {
        await EmailService.sendOrderConfirmation({
          orderId: paymentData.order.order_id,
          amount: parseFloat(paymentData.order.order_amount),
          currency: paymentData.order.order_currency || 'INR',
          customerEmail: customerEmail,
          customerPhone: paymentData.customer_details?.customer_phone,
          paymentMethod: 'Cashfree',
          timestamp: new Date(paymentData.payment_time || Date.now()),
          status: 'success'
        });
        console.log('📧 Email notifications sent successfully for order:', paymentData.order.order_id);
      } catch (emailError) {
        console.error('📧 Failed to send email notifications:', emailError);
      }
    }

    // Invalidate user caches for Pro status update
    if (validUserId) {
      invalidateUserCaches(validUserId);
      clearUserDataCache(validUserId);
      console.log('🗑️ Invalidated caches for user:', validUserId);
    }
  } catch (error) {
    console.error('💥 Error processing successful Cashfree payment:', error);
  }
}

async function handlePaymentFailure(paymentData: any) {
  try {
    console.log('❌ Processing failed Cashfree payment:', paymentData.order.order_id);

    const customerEmail = paymentData.customer_details?.customer_email;
    let validUserId = null;

    if (customerEmail) {
      const userRecord = await db.query.user.findFirst({
        where: eq(user.email, customerEmail),
        columns: { id: true },
      });
      validUserId = userRecord?.id || null;
    }

    // Store failed payment record
    const paymentRecord = {
      id: paymentData.cf_payment_id || paymentData.order.order_id,
      createdAt: new Date(paymentData.payment_time || Date.now()),
      updatedAt: new Date(),
      status: 'failed',
      totalAmount: parseFloat(paymentData.order.order_amount),
      currency: paymentData.order.order_currency || 'INR',
      paymentMethod: paymentData.payment_method || 'cashfree',
      errorCode: paymentData.payment_message || 'payment_failed',
      errorMessage: paymentData.payment_message || 'Payment failed',
      userId: validUserId,
      metadata: {
        provider: 'cashfree',
        orderId: paymentData.order.order_id,
        cfPaymentId: paymentData.cf_payment_id,
        failureReason: paymentData.payment_message,
      },
    };

    await db
      .insert(payment)
      .values(paymentRecord)
      .onConflictDoUpdate({
        target: payment.id,
        set: {
          updatedAt: new Date(),
          status: 'failed',
          errorCode: paymentRecord.errorCode,
          errorMessage: paymentRecord.errorMessage,
        },
      });

    console.log('💾 Stored failed Cashfree payment record:', paymentRecord.id);
  } catch (error) {
    console.error('💥 Error processing failed Cashfree payment:', error);
  }
}

async function handlePaymentDropped(paymentData: any) {
  try {
    console.log('🚪 Processing dropped Cashfree payment:', paymentData.order.order_id);
    // Handle user dropping out of payment flow
    // This is mainly for analytics, no payment record needed
  } catch (error) {
    console.error('💥 Error processing dropped Cashfree payment:', error);
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Cashfree webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}