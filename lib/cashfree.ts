// Cashfree SDK utilities for payment processing
import crypto from 'crypto';

// Cashfree API configuration
const CASHFREE_CONFIG = {
  appId: process.env.CASHFREE_APP_ID!,
  secretKey: process.env.CASHFREE_SECRET_KEY!,
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.cashfree.com/pg' 
    : 'https://sandbox.cashfree.com/pg',
  checkoutUrl: process.env.NODE_ENV === 'production'
    ? 'https://checkout.cashfree.com'
    : 'https://sandbox.cashfree.com',
};

export interface CashfreePaymentData {
  orderId: string;
  orderAmount: number;
  orderCurrency: string;
  customerDetails: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
  orderMeta?: {
    returnUrl: string;
    notifyUrl: string;
  };
}

export interface CashfreePaymentSession {
  cfToken: string;
  orderId: string;
  paymentSessionId: string;
}

export class CashfreePaymentService {
  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-api-version': '2023-08-01',
      'x-client-id': CASHFREE_CONFIG.appId,
      'x-client-secret': CASHFREE_CONFIG.secretKey,
    };
  }

  static async createPaymentOrder(paymentData: CashfreePaymentData): Promise<CashfreePaymentSession> {
    try {
      const orderRequest = {
        order_id: paymentData.orderId,
        order_amount: paymentData.orderAmount,
        order_currency: paymentData.orderCurrency,
        customer_details: {
          customer_id: paymentData.customerDetails.customerId,
          customer_name: paymentData.customerDetails.customerName,
          customer_email: paymentData.customerDetails.customerEmail,
          customer_phone: paymentData.customerDetails.customerPhone,
        },
        order_meta: paymentData.orderMeta || {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?provider=cashfree`,
          notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/cashfree`,
        },
      };

      const response = await fetch(`${CASHFREE_CONFIG.baseUrl}/orders`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(orderRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Cashfree API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          requestUrl: `${CASHFREE_CONFIG.baseUrl}/orders`,
          headers: this.getHeaders(),
          requestBody: orderRequest
        });
        
        // Provide specific error messages based on status code
        if (response.status === 401) {
          throw new Error(`Cashfree authentication failed. Check your CASHFREE_APP_ID and CASHFREE_SECRET_KEY in Vercel environment variables.`);
        } else if (response.status === 403) {
          throw new Error(`Cashfree access denied. Verify your API credentials and account permissions.`);
        } else if (response.status === 400) {
          throw new Error(`Cashfree request error: ${errorData.message || 'Invalid request parameters'}`);
        } else {
          throw new Error(`Cashfree API error (${response.status}): ${errorData.message || response.statusText}`);
        }
      }

      const responseData = await response.json();
      
      console.log('Cashfree Success Response:', {
        status: response.status,
        responseData,
        hasToken: !!responseData.cf_token,
        hasPaymentSessionId: !!responseData.payment_session_id
      });
      
      // Cashfree API returns payment_session_id, not cf_token in newer versions
      if (responseData && (responseData.cf_token || responseData.payment_session_id)) {
        return {
          cfToken: responseData.cf_token || responseData.payment_session_id, // Use payment_session_id as fallback
          orderId: responseData.order_id,
          paymentSessionId: responseData.payment_session_id,
        };
      } else {
        console.error('Cashfree response missing required fields:', responseData);
        throw new Error(`Failed to create Cashfree payment session. Response: ${JSON.stringify(responseData)}`);
      }
    } catch (error) {
      console.error('Cashfree order creation failed:', error);
      throw error;
    }
  }

  static async getOrderStatus(orderId: string) {
    try {
      const response = await fetch(`${CASHFREE_CONFIG.baseUrl}/orders/${orderId}/payments`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch order status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch Cashfree order status:', error);
      throw error;
    }
  }

  static async verifyWebhookSignature(
    rawBody: string,
    signature: string,
    timestamp: string
  ): Promise<boolean> {
    try {
      // Cashfree webhook signature verification
      const expectedSignature = crypto
        .createHmac('sha256', process.env.CASHFREE_WEBHOOK_SECRET!)
        .update(timestamp + rawBody)
        .digest('base64');
      
      return expectedSignature === signature;
    } catch (error) {
      console.error('Cashfree webhook verification failed:', error);
      return false;
    }
  }

  static generateOrderId(): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    return `CF_ORDER_${timestamp}_${randomString}`;
  }
}

export { CASHFREE_CONFIG };