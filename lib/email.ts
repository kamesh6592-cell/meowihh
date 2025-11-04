import { Resend } from 'resend';
import { serverEnv } from '@/env/server';
import SearchCompletedEmail from '@/components/emails/lookout-completed';

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
      from: 'AJ STUDIOZ <noreply@ajstudioz.vercel.app>',
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
