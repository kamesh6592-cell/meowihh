import { NextRequest, NextResponse } from 'next/server';
import { CashfreePaymentService, CashfreePaymentData } from '@/lib/cashfree';
import { getComprehensiveUserData } from '@/lib/user-data-server';
import { PRICING } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const userData = await getComprehensiveUserData();
    
    if (!userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user already has Pro access
    if (userData.isProUser) {
      return NextResponse.json(
        { error: 'User already has Pro access' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { customerPhone, returnUrl } = body;

    // Generate unique order ID
    const orderId = CashfreePaymentService.generateOrderId();
    
    // Prepare payment data
    const paymentData: CashfreePaymentData = {
      orderId,
      orderAmount: PRICING.PRO_MONTHLY_INR, // ₹1299 base price
      orderCurrency: 'INR',
      customerDetails: {
        customerId: userData.id,
        customerName: userData.name,
        customerEmail: userData.email,
        customerPhone: customerPhone || '9999999999', // Default if not provided
      },
      orderMeta: {
        returnUrl: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/success?provider=cashfree&order=${orderId}`,
        notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/cashfree`,
      },
    };

    // Create payment session with Cashfree
    const paymentSession = await CashfreePaymentService.createPaymentOrder(paymentData);

    return NextResponse.json({
      success: true,
      orderId: paymentSession.orderId,
      cfToken: paymentSession.cfToken,
      paymentSessionId: paymentSession.paymentSessionId,
      // Return order details for frontend processing
      orderAmount: paymentData.orderAmount,
      orderCurrency: paymentData.orderCurrency,
    });
  } catch (error) {
    console.error('Cashfree checkout error:', error);
    
    // Return more specific error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to create payment session';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        provider: 'cashfree',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Cashfree checkout endpoint',
    supportedMethods: ['POST'],
  });
}