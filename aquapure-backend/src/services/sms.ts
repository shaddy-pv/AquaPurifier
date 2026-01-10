import twilio from 'twilio';

// Create Twilio client
const createTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    console.warn('⚠️  Twilio credentials not configured. SMS sending will be skipped.');
    return null;
  }

  return twilio(accountSid, authToken);
};

// Send order confirmation SMS
export const sendOrderSMS = async (order: any) => {
  try {
    const client = createTwilioClient();
    if (!client) {
      console.log('📱 SMS skipped: Twilio not configured');
      return;
    }

    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    const toNumber = order.shippingAddress?.phone;

    if (!fromNumber || !toNumber) {
      console.warn('⚠️  Phone numbers not configured for SMS');
      return;
    }

    // Format phone number (ensure it has country code)
    const formattedPhone = toNumber.startsWith('+') ? toNumber : `+91${toNumber}`;

    await client.messages.create({
      body: `AquaPure: Your order ${order.orderNumber} has been confirmed. Total: ₹${order.total}. Track: ${process.env.FRONTEND_URL}/track-order?order=${order.orderNumber}`,
      from: fromNumber,
      to: formattedPhone
    });

    console.log('✅ Order SMS sent to:', formattedPhone);
  } catch (error: any) {
    console.error('❌ SMS send failed:', error.message);
  }
};

// Send order status update SMS
export const sendOrderStatusSMS = async (phone: string, orderNumber: string, status: string, trackingNumber?: string) => {
  try {
    const client = createTwilioClient();
    if (!client) {
      console.log('📱 SMS skipped: Twilio not configured');
      return;
    }

    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!fromNumber) {
      console.warn('⚠️  Twilio phone number not configured');
      return;
    }

    // Format phone number
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    const statusMessages: any = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      processing: 'Your order is being processed.',
      shipped: `Your order has been shipped! ${trackingNumber ? `Tracking: ${trackingNumber}` : ''}`,
      delivered: 'Your order has been delivered. Thank you!',
      cancelled: 'Your order has been cancelled.'
    };

    const message = `AquaPure Order ${orderNumber}: ${statusMessages[status] || `Status updated to ${status}`}`;

    await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedPhone
    });

    console.log('✅ Status SMS sent to:', formattedPhone);
  } catch (error: any) {
    console.error('❌ SMS send failed:', error.message);
  }
};

// Send OTP SMS
export const sendOTPSMS = async (phone: string, otp: string) => {
  try {
    const client = createTwilioClient();
    if (!client) {
      console.log('📱 SMS skipped: Twilio not configured');
      return;
    }

    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!fromNumber) {
      console.warn('⚠️  Twilio phone number not configured');
      return;
    }

    // Format phone number
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    await client.messages.create({
      body: `Your AquaPure verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`,
      from: fromNumber,
      to: formattedPhone
    });

    console.log('✅ OTP SMS sent to:', formattedPhone);
  } catch (error: any) {
    console.error('❌ SMS send failed:', error.message);
  }
};

// Send welcome SMS
export const sendWelcomeSMS = async (phone: string, name: string) => {
  try {
    const client = createTwilioClient();
    if (!client) {
      console.log('📱 SMS skipped: Twilio not configured');
      return;
    }

    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!fromNumber) {
      console.warn('⚠️  Twilio phone number not configured');
      return;
    }

    // Format phone number
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    await client.messages.create({
      body: `Welcome to AquaPure, ${name}! Thank you for joining us. Explore our range of water purifiers at ${process.env.FRONTEND_URL}`,
      from: fromNumber,
      to: formattedPhone
    });

    console.log('✅ Welcome SMS sent to:', formattedPhone);
  } catch (error: any) {
    console.error('❌ SMS send failed:', error.message);
  }
};
