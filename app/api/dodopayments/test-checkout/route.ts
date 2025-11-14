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

    // In production, admins test with the real checkout flow
    // This ensures the production payment system is working correctly
    const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout`;

    return NextResponse.json({
      success: true,
      checkoutUrl,
      message: 'Redirecting to checkout page to test payment flow',
      note: 'This uses your production DodoPayments configuration',
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
