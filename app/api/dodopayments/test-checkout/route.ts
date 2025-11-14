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

    // For test payments, just redirect to the main checkout page
    // DodoPayments will handle the ₹1299 payment
    // Admin can test the full payment flow
    const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout`;

    return NextResponse.json({
      success: true,
      checkoutUrl,
      message: 'Test DodoPayments checkout - Use your main product (₹1299)',
      note: 'This will use your configured DodoPayments product. For ₹2 test, you need to create a separate test product in DodoPayments dashboard with slug "test-product"',
      provider: 'dodopayments',
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
