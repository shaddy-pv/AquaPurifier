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

/**
 * Send New Order Alert to Admin / Store Owner's Phone
 * Target Numbers: Given numbers (+919140967681, +917007055725, +916391833820)
 */
export const sendAdminOrderNotification = async (order: any) => {
  try {
    const rawPhones = process.env.ADMIN_NOTIFICATION_PHONES || '+919140967681,+917007055725,+916391833820';
    const adminPhones = rawPhones
      .split(',')
      .map((p: string) => p.trim())
      .filter(Boolean);

    if (adminPhones.length === 0) {
      console.warn('⚠️ No admin notification phone numbers configured.');
      return;
    }

    const customerName = order.shippingAddress?.name || order.user?.name || 'Customer';
    const customerPhone = order.shippingAddress?.phone || order.user?.phone || 'N/A';
    const customerCity = order.shippingAddress?.city || 'N/A';
    const totalAmount = order.total || 0;
    const paymentMode = (order.paymentMethod || 'COD').toUpperCase();
    const itemsSummary = (order.items || [])
      .map((i: any) => `${i.name || 'Product'} (x${i.quantity || 1})`)
      .join(', ');

    const alertText = `🚨 [PRAYAG RO] Naya Order Aaya Hai!\n` +
      `Order #: ${order.orderNumber}\n` +
      `Customer: ${customerName} (${customerPhone})\n` +
      `Items: ${itemsSummary}\n` +
      `Amount: ₹${Number(totalAmount).toLocaleString('en-IN')} [${paymentMode}]\n` +
      `Delivery: ${customerCity}\n` +
      `Admin Link: ${process.env.ADMIN_URL || 'https://admin-prayagro.vercel.app'}/orders`;

    console.log('\n==================================================');
    console.log('📢 [ADMIN ORDER ALERT DISPATCHED TO STORE OWNER]');
    console.log(`📱 Recipient Number(s): ${adminPhones.join(', ')}`);
    console.log(alertText);
    console.log('==================================================\n');

    // 1. Send via Twilio (if credentials configured)
    const client = createTwilioClient();
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (client && fromNumber && !fromNumber.includes('XXXX')) {
      for (const phone of adminPhones) {
        const formatted = phone.startsWith('+') ? phone : `+91${phone}`;
        client.messages.create({
          body: alertText,
          from: fromNumber,
          to: formatted
        }).then(() => {
          console.log(`✅ Admin alert SMS delivered via Twilio to ${formatted}`);
        }).catch((err: any) => {
          console.warn(`⚠️ Twilio delivery failed for ${formatted}:`, err.message);
        });
      }
    }

    // 2. Send via Indian Fast2SMS Gateway (if FAST2SMS_API_KEY is configured)
    if (process.env.FAST2SMS_API_KEY) {
      const cleanNumbers = adminPhones
        .map((p: string) => p.replace(/\D/g, '').slice(-10))
        .join(',');
      
      const fast2smsUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST2SMS_API_KEY}&route=q&message=${encodeURIComponent(alertText)}&language=english&flash=0&numbers=${cleanNumbers}`;
      
      fetch(fast2smsUrl)
        .then((res) => res.json())
        .then((data) => console.log('✅ Fast2SMS response:', data))
        .catch((err) => console.warn('⚠️ Fast2SMS request error:', err.message));
    }

    // 3. Send via Free WhatsApp (CallMeBot API - if CALLMEBOT_API_KEY is configured)
    if (process.env.CALLMEBOT_API_KEY) {
      for (const phone of adminPhones) {
        const cleanPhone = phone.replace(/\D/g, '');
        const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodeURIComponent(alertText)}&apikey=${process.env.CALLMEBOT_API_KEY}`;
        fetch(url)
          .then((res) => res.text())
          .then((data) => console.log(`✅ WhatsApp alert delivered to ${cleanPhone}:`, data))
          .catch((err) => console.warn(`⚠️ WhatsApp alert error for ${cleanPhone}:`, err.message));
      }
    }

    // 4. Send via Custom Webhook (if NOTIFICATION_WEBHOOK is configured)
    if (process.env.NOTIFICATION_WEBHOOK) {
      fetch(process.env.NOTIFICATION_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'new_order',
          orderNumber: order.orderNumber,
          customerName,
          customerPhone,
          total: totalAmount,
          items: itemsSummary,
          message: alertText
        })
      }).catch((err) => console.warn('⚠️ Webhook notification error:', err.message));
    }

    // Notice when no cellular gateway is configured
    const hasActiveProvider = (client && fromNumber && !fromNumber.includes('XXXX')) ||
      !!process.env.FAST2SMS_API_KEY ||
      !!process.env.CALLMEBOT_API_KEY ||
      !!process.env.NOTIFICATION_WEBHOOK;

    if (!hasActiveProvider) {
      console.warn('ℹ️ [SMS Notice] Cellular SMS / WhatsApp gateway key is not set yet in .env.');
      console.warn('   Add FAST2SMS_API_KEY (for SMS) or CALLMEBOT_API_KEY (for WhatsApp) to receive alerts directly on the physical phone.');
    }
  } catch (error: any) {
    console.error('❌ Failed to dispatch admin order alert:', error.message);
  }
};

