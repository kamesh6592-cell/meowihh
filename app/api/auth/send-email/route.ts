import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sendWelcomeEmail, sendNewLoginEmail } from '@/lib/email';
import { db } from '@/lib/db';
import { user as userTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    // Try to get session, but don't fail if not available yet
    let session;
    try {
      session = await auth.api.getSession({
        headers: req.headers,
      });
    } catch (error) {
      console.log('⚠️ Session not available yet, will retry...');
    }

    if (!session?.user) {
      // Session not ready yet after OAuth redirect
      // Return success but log that email will be skipped
      console.log('⚠️ No session available, email notification skipped');
      return NextResponse.json({ 
        success: false, 
        error: 'Session not ready',
        message: 'Will retry later' 
      }, { status: 200 });
    }

    const body = await req.json();
    const { type, isNewUser } = body;

    const user = session.user;

    // Send welcome email for new users
    if (type === 'welcome' || isNewUser) {
      try {
        console.log('📧 Sending welcome email to:', user.email);
        await sendWelcomeEmail({
          to: user.email,
          userName: user.name,
        });
        console.log('✅ Welcome email sent successfully');
      } catch (error) {
        console.error('❌ Failed to send welcome email:', error);
      }
    }

    // Send login notification
    if (type === 'login' || !isNewUser) {
      try {
        const userAgent = req.headers.get('user-agent') || 'Unknown browser';
        const ip = req.headers.get('x-forwarded-for') || 
                   req.headers.get('x-real-ip') || 
                   'Unknown IP';
        
        console.log('📧 Sending login notification to:', user.email);
        console.log('User details:', { email: user.email, name: user.name, id: user.id });
        
        const result = await sendNewLoginEmail({
          to: user.email,
          userName: user.name,
          loginTime: new Date().toUTCString(),
          ipAddress: ip,
          location: 'Unknown city, IN',
          browser: userAgent,
        });
        
        console.log('✅ Login notification sent successfully');
        console.log('Email result:', result);
      } catch (error) {
        console.error('❌ Failed to send login notification:', error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
