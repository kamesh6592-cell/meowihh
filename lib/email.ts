import { Resend } from 'resend';
import { serverEnv } from '@/env/server';
import SearchCompletedEmail from '@/components/emails/lookout-completed';
import NewLoginEmail from '@/components/emails/new-login';
import WelcomeEmail from '@/components/emails/welcome';

const resend = serverEnv.RESEND_API_KEY ? new Resend(serverEnv.RESEND_API_KEY) : null;

interface SendLookoutCompletionEmailParams {
  to: string;
  chatTitle: string;
  assistantResponse: string;
  chatId: string;
}

export async function sendLookoutCompletionEmail({
  to,
  chatTitle,
  assistantResponse,
  chatId,
}: SendLookoutCompletionEmailParams) {
  if (!resend) {
    console.warn('⚠️ RESEND_API_KEY not configured. Email not sent.');
    return {
      success: false,
      error: 'Email service not configured',
    };
  }
  
  try {
    const data = await resend.emails.send({
      from: 'AJ STUDIOZ <noreply@ajstudioz.co.in>',
      to: [to],
      subject: `Lookout Complete: ${chatTitle}`,
      react: SearchCompletedEmail({
        chatTitle,
        assistantResponse,
        chatId,
      }),
    });

    console.log('✅ Lookout completion email sent successfully:', data.data?.id);
    return { success: true, id: data.data?.id };
  } catch (error) {
    console.error('❌ Failed to send lookout completion email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

interface SendNewLoginEmailParams {
  to: string;
  userName: string;
  loginTime: string;
  ipAddress: string;
  location: string;
  browser: string;
}

export async function sendNewLoginEmail({
  to,
  userName,
  loginTime,
  ipAddress,
  location,
  browser,
}: SendNewLoginEmailParams) {
  if (!resend) {
    console.warn('⚠️ RESEND_API_KEY not configured. Email not sent.');
    return {
      success: false,
      error: 'Email service not configured',
    };
  }
  
  try {
    const data = await resend.emails.send({
      from: 'AJ STUDIOZ Security <security@ajstudioz.co.in>',
      to: [to],
      subject: "We've noticed a new login",
      react: NewLoginEmail({
        userName,
        loginTime,
        ipAddress,
        location,
        browser,
      }),
    });

    console.log('✅ New login email sent successfully:', data.data?.id);
    return { success: true, id: data.data?.id };
  } catch (error) {
    console.error('❌ Failed to send new login email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

interface SendWelcomeEmailParams {
  to: string;
  userName: string;
}

export async function sendWelcomeEmail({ to, userName }: SendWelcomeEmailParams) {
  if (!resend) {
    console.warn('⚠️ RESEND_API_KEY not configured. Email not sent.');
    return {
      success: false,
      error: 'Email service not configured',
    };
  }
  
  try {
    const data = await resend.emails.send({
      from: 'AJ STUDIOZ <welcome@ajstudioz.co.in>',
      to: [to],
      subject: 'Welcome to AJ STUDIOZ!',
      react: WelcomeEmail({
        userName,
      }),
    });

    console.log('✅ Welcome email sent successfully:', data.data?.id);
    return { success: true, id: data.data?.id };
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
