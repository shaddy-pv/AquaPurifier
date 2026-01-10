export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  shippingAddress: string;
  estimatedDelivery: string;
}

export const orderConfirmationEmail = (data: OrderEmailData): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0EA5E9, #3B82F6); color: white; padding: 30px; text-align: center; }
    .content { background: #f9fafb; padding: 30px; }
    .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .item { border-bottom: 1px solid #e5e7eb; padding: 10px 0; }
    .total { font-size: 20px; font-weight: bold; color: #0EA5E9; margin-top: 20px; }
    .footer { text-align: center; padding: 20px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmed!</h1>
      <p>Thank you for your purchase</p>
    </div>
    
    <div class="content">
      <p>Hi ${data.customerName},</p>
      <p>Your order has been confirmed and will be delivered soon.</p>
      
      <div class="order-details">
        <h2>Order #${data.orderNumber}</h2>
        
        <h3>Items:</h3>
        ${data.items.map(item => `
          <div class="item">
            <strong>${item.name}</strong><br>
            Quantity: ${item.quantity} × ₹${item.price.toLocaleString()}
          </div>
        `).join('')}
        
        <div class="total">
          Total: ₹${data.total.toLocaleString()}
        </div>
        
        <h3>Shipping Address:</h3>
        <p>${data.shippingAddress}</p>
        
        <h3>Estimated Delivery:</h3>
        <p>${data.estimatedDelivery}</p>
      </div>
      
      <p>Track your order: <a href="https://aquapure.com/profile/orders">View Order Status</a></p>
    </div>
    
    <div class="footer">
      <p>AquaPure - Pure Water, Pure Health</p>
      <p>Contact: 1800-123-AQUA | support@aquapure.com</p>
    </div>
  </div>
</body>
</html>
  `;
};

export const shippingUpdateEmail = (orderNumber: string, trackingNumber: string, customerName: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0EA5E9, #3B82F6); color: white; padding: 30px; text-align: center; }
    .content { background: #f9fafb; padding: 30px; }
    .tracking { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
    .tracking-number { font-size: 24px; font-weight: bold; color: #0EA5E9; margin: 20px 0; }
    .button { display: inline-block; background: #0EA5E9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Order is On Its Way!</h1>
    </div>
    
    <div class="content">
      <p>Hi ${customerName},</p>
      <p>Great news! Your order #${orderNumber} has been shipped.</p>
      
      <div class="tracking">
        <h3>Tracking Number:</h3>
        <div class="tracking-number">${trackingNumber}</div>
        <a href="#" class="button">Track Your Order</a>
      </div>
      
      <p>You'll receive another email when your order is delivered.</p>
    </div>
  </div>
</body>
</html>
  `;
};

export const deliveryConfirmationEmail = (orderNumber: string, customerName: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; }
    .content { background: #f9fafb; padding: 30px; }
    .success { background: white; padding: 30px; margin: 20px 0; border-radius: 8px; text-align: center; }
    .checkmark { font-size: 60px; color: #10b981; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Delivered!</h1>
    </div>
    
    <div class="content">
      <div class="success">
        <div class="checkmark">✓</div>
        <h2>Your order has been delivered</h2>
        <p>Order #${orderNumber}</p>
      </div>
      
      <p>Hi ${customerName},</p>
      <p>We hope you're enjoying your new water purifier!</p>
      <p>Please take a moment to rate your experience and leave a review.</p>
      
      <p>Need help? Contact our support team at 1800-123-AQUA</p>
    </div>
  </div>
</body>
</html>
  `;
};
