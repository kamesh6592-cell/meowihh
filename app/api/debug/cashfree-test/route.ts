import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    environment: process.env.NODE_ENV,
    hasAppId: !!process.env.CASHFREE_APP_ID,
    hasSecretKey: !!process.env.CASHFREE_SECRET_KEY,
    appIdPrefix: process.env.CASHFREE_APP_ID?.substring(0, 8) + '...' || 'NOT_SET',
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://api.cashfree.com/pg' 
      : 'https://sandbox.cashfree.com/pg',
  };

  // Test API connectivity
  let apiTest = null;
  try {
    const testResponse = await fetch(`${config.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': process.env.CASHFREE_APP_ID!,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
      },
      body: JSON.stringify({
        order_id: 'DEBUG_TEST_' + Date.now(),
        order_amount: 1,
        order_currency: 'INR',
        customer_details: {
          customer_id: 'debug_customer',
          customer_name: 'Debug Test',
          customer_email: 'debug@test.com',
          customer_phone: '9999999999',
        }
      }),
    });

    const testData = await testResponse.json().catch(() => ({}));
    
    apiTest = {
      status: testResponse.status,
      success: testResponse.ok,
      response: testData,
      headers: Object.fromEntries(testResponse.headers.entries())
    };
  } catch (error) {
    apiTest = {
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    };
  }

  return NextResponse.json({
    config,
    apiTest,
    message: config.hasAppId && config.hasSecretKey 
      ? 'Testing Cashfree API connectivity...' 
      : 'Cashfree credentials missing',
    timestamp: new Date().toISOString(),
  });
}