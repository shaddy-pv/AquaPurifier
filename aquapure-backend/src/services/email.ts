import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️  SENDGRID_API_KEY not configured. Email sending will be skipped.');
    return null;
  }

  return nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: apiKey
    }
  } as any);
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (order: any) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('📧 Email skipped: SendGrid not configured');
      return;
    }

    const fromEmail = process.env.FROM_EMAIL || 'noreply@aquapure.com';
    const toEmail = order.shippingAddress?.email || order.user?.email;

    if (!toEmail) {
      console.warn('⚠️  No recipient email found for order:', order.orderNumber);
      return;
    }

    const itemsList = order.items
      .map((item: any) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
        </tr>
      `)
      .join('');

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; }
            .total { font-size: 18px; font-weight: bold; color: #0ea5e9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Order!</h1>
            </div>
            <div class="content">
              <p>Dear ${order.shippingAddress?.name || 'Customer'},</p>
              <p>Your order has been successfully placed and is being processed.</p>
              
              <div class="order-details">
                <h2>Order Details</h2>
                <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                
                <h3>Items Ordered:</h3>
                <table>
                  <thead>
                    <tr style="background: #f0f0f0;">
                      <th style="padding: 10px; text-align: left;">Product</th>
                      <th style="padding: 10px; text-align: center;">Quantity</th>
                      <th style="padding: 10px; text-align: right;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsList}
                  </tbody>
                </table>
                
                <div style="margin-top: 20px; text-align: right;">
                  <p>Subtotal: ₹${order.subtotal}</p>
                  <p>Tax: ₹${order.tax}</p>
                  <p>Shipping: ₹${order.shipping}</p>
                  ${order.discount > 0 ? `<p>Discount: -₹${order.discount}</p>` : ''}
                  <p class="total">Total: ₹${order.total}</p>
                </div>
                
                <h3>Shipping Address:</h3>
                <p>
                  ${order.shippingAddress.name}<br>
                  ${order.shippingAddress.street}<br>
                  ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}<br>
                  Phone: ${order.shippingAddress.phone}
                </p>
              </div>
              
              <p>We'll send you shipping updates as your order progresses.</p>
              <p>Track your order: <a href="${process.env.FRONTEND_URL}/track-order?order=${order.orderNumber}">Click here</a></p>
              
              <p>Thank you for choosing AquaPure!</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('✅ Order confirmation email sent to:', toEmail);
  } catch (error) {
    console.error('❌ Email send failed:', error);
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('📧 Email skipped: SendGrid not configured');
      return;
    }

    const fromEmail = process.env.FROM_EMAIL || 'noreply@aquapure.com';
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: 'Password Reset Request - AquaPure',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background: #0ea5e9; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Reset Your Password</h1>
            <p>You requested to reset your password for your AquaPure account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${resetUrl}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </body>
        </html>
      `
    });

    console.log('✅ Password reset email sent to:', email);
  } catch (error) {
    console.error('❌ Email send failed:', error);
  }
};

// Send order status update email
export const sendOrderStatusEmail = async (order: any, newStatus: string) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('📧 Email skipped: SendGrid not configured');
      return;
    }

    const fromEmail = process.env.FROM_EMAIL || 'noreply@aquapure.com';
    const toEmail = order.shippingAddress?.email || order.user?.email;

    if (!toEmail) return;

    const statusMessages: any = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      processing: 'Your order is being processed.',
      shipped: `Your order has been shipped! Tracking number: ${order.trackingNumber || 'N/A'}`,
      delivered: 'Your order has been delivered. Thank you for shopping with us!',
      cancelled: 'Your order has been cancelled.'
    };

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject: `Order Update - ${order.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1>Order Status Update</h1>
            <p>Order Number: <strong>${order.orderNumber}</strong></p>
            <p>Status: <strong>${newStatus.toUpperCase()}</strong></p>
            <p>${statusMessages[newStatus] || 'Your order status has been updated.'}</p>
            <p>Track your order: <a href="${process.env.FRONTEND_URL}/track-order?order=${order.orderNumber}">Click here</a></p>
          </div>
        </body>
        </html>
      `
    });

    console.log('✅ Order status email sent to:', toEmail);
  } catch (error) {
    console.error('❌ Email send failed:', error);
  }
};
