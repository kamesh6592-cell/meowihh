import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { serverEnv } from '@/env/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Check if API key is configured
    if (!serverEnv.RESEND_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'RESEND_API_KEY not configured in environment variables',
          configured: false,
        },
        { status: 500 }
      );
    }

    const resend = new Resend(serverEnv.RESEND_API_KEY);

    // Send a test email
    console.log('📧 Sending test email from health check endpoint...');
    
    const { data, error } = await resend.emails.send({
      from: 'AJ STUDIOZ <noreply@ajstudioz.co.in>',
      to: ['kamesh6592@gmail.com'], // Change this to your email
      subject: '✅ Email Health Check - AJ STUDIOZ',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                          ✅ Email System Working!
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 20px; font-weight: 600;">
                          Health Check Successful
                        </h2>
                        <p style="margin: 0 0 15px 0; color: #4a5568; font-size: 16px; line-height: 1.5;">
                          This is a test email from your <strong>AJ STUDIOZ</strong> application.
                        </p>
                        <p style="margin: 0 0 15px 0; color: #4a5568; font-size: 16px; line-height: 1.5;">
                          If you're seeing this, your Resend email configuration is working correctly! 🎉
                        </p>
                        
                        <div style="background-color: #f7fafc; border-left: 4px solid #667eea; padding: 15px 20px; margin: 25px 0;">
                          <p style="margin: 0; color: #2d3748; font-size: 14px; line-height: 1.6;">
                            <strong>Test Details:</strong><br>
                            Timestamp: ${new Date().toLocaleString()}<br>
                            Domain: www.meow.ajstudioz.co.in<br>
                            API: Resend<br>
                            Status: ✅ Active
                          </p>
                        </div>
                        
                        <p style="margin: 25px 0 0 0; color: #718096; font-size: 14px; line-height: 1.5;">
                          Your email notification system is now ready to send welcome emails, login alerts, and more.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                          <strong>AJ STUDIOZ</strong>
                        </p>
                        <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                          Powered by AI • <a href="https://www.meow.ajstudioz.co.in" style="color: #667eea; text-decoration: none;">www.meow.ajstudioz.co.in</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Test email failed:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to send test email',
          configured: true,
          details: error,
        },
        { status: 500 }
      );
    }

    console.log('✅ Test email sent successfully:', data?.id);

    return NextResponse.json(
      {
        success: true,
        message: 'Test email sent successfully!',
        configured: true,
        emailId: data?.id,
        recipient: 'kamesh6592@gmail.com',
        timestamp: new Date().toISOString(),
        details: {
          apiKey: serverEnv.RESEND_API_KEY.substring(0, 10) + '...',
          domain: 'ajstudioz.co.in',
          from: 'noreply@ajstudioz.co.in',
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Email health check failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error occurred',
        configured: !!serverEnv.RESEND_API_KEY,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
