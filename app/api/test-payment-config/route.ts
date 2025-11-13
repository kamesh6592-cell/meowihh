import { NextResponse } from 'next/server';

export async function GET() {
  // Test Cashfree configuration
  const cashfreeTest = {
    hasAppId: !!process.env.CASHFREE_APP_ID,
    hasSecretKey: !!process.env.CASHFREE_SECRET_KEY,
    appIdValue: process.env.CASHFREE_APP_ID ? `${process.env.CASHFREE_APP_ID.slice(0, 8)}...` : 'NOT_SET',
    secretKeyValue: process.env.CASHFREE_SECRET_KEY ? `${process.env.CASHFREE_SECRET_KEY.slice(0, 8)}...` : 'NOT_SET',
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://api.cashfree.com/pg' 
      : 'https://sandbox.cashfree.com/pg',
    environment: process.env.NODE_ENV
  };

  // Test DodoPayments configuration
  const dodoTest = {
    hasApiKey: !!process.env.DODO_PAYMENTS_API_KEY,
    apiKeyValue: process.env.DODO_PAYMENTS_API_KEY ? `${process.env.DODO_PAYMENTS_API_KEY.slice(0, 8)}...` : 'NOT_SET',
    productSlug: process.env.NEXT_PUBLIC_PREMIUM_SLUG || 'NOT_SET'
  };

  // Overall status
  const overallStatus = {
    cashfreeReady: cashfreeTest.hasAppId && cashfreeTest.hasSecretKey,
    dodoReady: dodoTest.hasApiKey && !!process.env.NEXT_PUBLIC_PREMIUM_SLUG,
    anyProviderReady: (cashfreeTest.hasAppId && cashfreeTest.hasSecretKey) || (dodoTest.hasApiKey && !!process.env.NEXT_PUBLIC_PREMIUM_SLUG)
  };

  // Instructions based on current state
  const instructions = [];

  if (!cashfreeTest.hasAppId) {
    instructions.push('1. Set CASHFREE_APP_ID in Vercel environment variables');
  }
  if (!cashfreeTest.hasSecretKey) {
    instructions.push('2. Set CASHFREE_SECRET_KEY in Vercel environment variables');
  }
  if (!dodoTest.hasApiKey) {
    instructions.push('3. Set DODO_PAYMENTS_API_KEY in Vercel environment variables');
  }
  if (!process.env.NEXT_PUBLIC_PREMIUM_SLUG) {
    instructions.push('4. Set NEXT_PUBLIC_PREMIUM_SLUG=pro-plan-dodo in Vercel environment variables');
  }
  if (dodoTest.hasApiKey && process.env.NEXT_PUBLIC_PREMIUM_SLUG) {
    instructions.push('5. Create a product in DodoPayments dashboard with slug "pro-plan-dodo" and price ₹1299');
  }

  return NextResponse.json({
    status: overallStatus.anyProviderReady ? 'PARTIAL_READY' : 'NOT_READY',
    cashfree: cashfreeTest,
    dodoPayments: dodoTest,
    overall: overallStatus,
    nextSteps: instructions,
    timestamp: new Date().toISOString(),
    message: overallStatus.anyProviderReady 
      ? 'Some payment providers are configured, but may have issues'
      : 'Payment system needs configuration'
  });
}