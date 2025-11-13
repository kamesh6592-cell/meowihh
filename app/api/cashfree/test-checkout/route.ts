import { NextRequest, NextResponse } from 'next/server';
import { getComprehensiveUserData } from '@/lib/user-data-server';
import { CashfreePaymentService, CashfreePaymentData } from '@/lib/cashfree';

export async function POST(request: NextRequest) {
  try {
    const userData = await getComprehensiveUserData();
    
    if (!userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { customerPhone, returnUrl } = body;

    // Generate unique order ID for test
    const orderId = `TEST_${CashfreePaymentService.generateOrderId()}`;
    
    // Test payment data - ₹2 only
    const paymentData: CashfreePaymentData = {
      orderId,
      orderAmount: 2, // ₹2 test payment
      orderCurrency: 'INR',
      customerDetails: {
        customerId: userData.id,
        customerName: userData.name,
        customerEmail: userData.email,
        customerPhone: customerPhone || '9999999999',
      },
      orderMeta: {
        returnUrl: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/success?provider=cashfree&test=true&order=${orderId}`,
        notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/cashfree`,
      },
    };

    // Create test payment session with Cashfree
    const paymentSession = await CashfreePaymentService.createPaymentOrder(paymentData);

    return NextResponse.json({
      success: true,
      orderId: paymentSession.orderId,
      cfToken: paymentSession.cfToken,
      paymentSessionId: paymentSession.paymentSessionId,
      orderAmount: paymentData.orderAmount,
      orderCurrency: paymentData.orderCurrency,
      isTestPayment: true,
    });
  } catch (error) {
    console.error('Cashfree test checkout error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create test payment session';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        provider: 'cashfree-test',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Cashfree test checkout endpoint',
    supportedMethods: ['POST'],
    testAmount: '₹2 INR',
  });
}