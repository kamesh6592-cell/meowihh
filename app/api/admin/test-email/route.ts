import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email-service';
import { getComprehensiveUserData } from '@/lib/user-data-server';

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const userData = await getComprehensiveUserData();
    
    if (!userData || userData.email !== 'kamesh6592@gmail.com') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { testEmail } = body;

    if (!testEmail) {
      return NextResponse.json(
        { error: 'Test email address is required' },
        { status: 400 }
      );
    }

    // Send test email notification
    const result = await EmailService.sendOrderConfirmation({
      orderId: 'TEST_' + Date.now(),
      amount: 249,
      currency: 'INR',
      customerEmail: testEmail,
      customerPhone: '9999999999',
      paymentMethod: 'Test Payment',
      timestamp: new Date(),
      status: 'success'
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test emails sent successfully',
        details: result
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send test emails',
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Admin test email endpoint',
    description: 'POST with { testEmail: "user@example.com" } to send test notification'
  });
}