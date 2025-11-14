import { NextRequest, NextResponse } from 'next/server';
import { getComprehensiveUserData } from '@/lib/user-data-server';

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
    const { returnUrl } = body;

    // Generate unique reference ID for test payment
    const referenceId = `TEST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Use better-auth DodoPayments integration to create checkout
    // Note: This requires a product with slug 'pro-plan-dodo' in your DodoPayments dashboard
    const testProductSlug = process.env.NEXT_PUBLIC_TEST_PREMIUM_SLUG || process.env.NEXT_PUBLIC_PREMIUM_SLUG || 'pro-plan-dodo';
    
    const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout?test=true&ref=${referenceId}`;

    return NextResponse.json({
      success: true,
      referenceId,
      checkoutUrl,
      amount: 2,
      currency: 'INR',
      isTestPayment: true,
      provider: 'dodopayments',
      message: 'Redirecting to checkout page with DodoPayments',
    });
  } catch (error) {
    console.error('DodoPayments test checkout error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create test payment session';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        provider: 'dodopayments-test',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'DodoPayments test checkout endpoint',
    supportedMethods: ['POST'],
    testAmount: '₹2 INR',
  });
}
