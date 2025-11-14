import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderDetails {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerPhone?: string;
  paymentMethod: string;
  timestamp: Date;
  status: 'success' | 'failed';
}

export class EmailService {
  static async sendOrderConfirmation(orderDetails: OrderDetails) {
    try {
      // Send confirmation to customer
      const customerEmail = await resend.emails.send({
        from: 'AJ STUDIOZ <noreply@ajstudioz.com>',
        to: [orderDetails.customerEmail],
        subject: `Payment Confirmation - Order #${orderDetails.orderId}`,
        html: this.generateCustomerEmailHTML(orderDetails),
      });

      // Send notification to admin
      const adminEmail = await resend.emails.send({
        from: 'AJ STUDIOZ <noreply@ajstudioz.com>',
        to: ['kamesh6592@gmail.com'],
        subject: `New Order Alert - ₹${orderDetails.amount} Payment Received`,
        html: this.generateAdminEmailHTML(orderDetails),
      });

      console.log('Emails sent successfully:', { customerEmail, adminEmail });
      return { success: true, customerEmail, adminEmail };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error };
    }
  }

  private static generateCustomerEmailHTML(order: OrderDetails): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .success { color: #28a745; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Payment Successful!</h1>
          <p>Thank you for your purchase</p>
        </div>
        <div class="content">
          <p>Dear Valued Customer,</p>
          <p>Your payment has been processed successfully. Here are your order details:</p>
          
          <div class="order-details">
            <h3>Order Summary</h3>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Amount:</strong> <span class="success">₹${order.amount}</span></p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Date:</strong> ${order.timestamp.toLocaleString('en-IN')}</p>
            <p><strong>Status:</strong> <span class="success">✅ Confirmed</span></p>
          </div>

          <p>🚀 <strong>Your premium access has been activated!</strong></p>
          <p>You can now enjoy all premium features of AJ STUDIOZ platform.</p>
          
          <p>If you have any questions, feel free to contact our support team.</p>
          
          <div class="footer">
            <p>Best regards,<br><strong>AJ STUDIOZ Team</strong></p>
            <p><small>This is an automated email. Please do not reply.</small></p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  private static generateAdminEmailHTML(order: OrderDetails): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Alert</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .amount { font-size: 24px; color: #28a745; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>💰 New Payment Received!</h2>
        </div>
        <div class="content">
          <p><strong>Admin Alert:</strong> A new payment has been processed successfully.</p>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Amount:</strong> <span class="amount">₹${order.amount}</span></p>
            <p><strong>Customer Email:</strong> ${order.customerEmail}</p>
            <p><strong>Customer Phone:</strong> ${order.customerPhone || 'Not provided'}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Timestamp:</strong> ${order.timestamp.toLocaleString('en-IN')}</p>
            <p><strong>Status:</strong> ✅ Success</p>
          </div>

          <p><strong>Action Required:</strong> Premium access should be automatically activated for this user.</p>
          
          <p>Check the admin panel for more details: <a href="https://meowihh.vercel.app/admin">Admin Dashboard</a></p>
        </div>
      </div>
    </body>
    </html>
    `;
  }
}