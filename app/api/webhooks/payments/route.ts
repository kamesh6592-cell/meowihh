import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // This endpoint will be handled by the better-auth webhook handler
    // We can add custom logic here if needed
    
    const body = await request.text();
    console.log('Received webhook:', body);
    
    // Let better-auth handle the webhook
    return auth.handler(request);
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook endpoint is active',
    timestamp: new Date().toISOString() 
  });
}