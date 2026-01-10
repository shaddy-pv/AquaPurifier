import Razorpay from 'razorpay';
import crypto from 'crypto';

// Create Razorpay instance
const createRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.warn('⚠️  Razorpay credentials not configured. Payment processing will be limited.');
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
};

// Create payment order
export const createPaymentOrder = async (amount: number, orderId: string) => {
  try {
    const razorpay = createRazorpayInstance();
    
    if (!razorpay) {
      throw new Error('Razorpay not configured');
    }

    // Amount should be in paise (smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: orderId,
      notes: {
        orderId: orderId
      }
    };

    const order = await razorpay.orders.create(options);
    
    console.log('✅ Razorpay order created:', order.id);
    
    return order;
  } catch (error: any) {
    console.error('❌ Razorpay order creation failed:', error);
    throw new Error(`Payment order creation failed: ${error.message}`);
  }
};

// Verify payment signature
export const verifyPaymentSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean => {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      console.error('❌ Razorpay key secret not configured');
      return false;
    }

    // Create signature
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    const isValid = generatedSignature === razorpaySignature;

    if (isValid) {
      console.log('✅ Payment signature verified');
    } else {
      console.error('❌ Payment signature verification failed');
    }

    return isValid;
  } catch (error: any) {
    console.error('❌ Signature verification error:', error);
    return false;
  }
};

// Fetch payment details
export const fetchPaymentDetails = async (paymentId: string) => {
  try {
    const razorpay = createRazorpayInstance();
    
    if (!razorpay) {
      throw new Error('Razorpay not configured');
    }

    const payment = await razorpay.payments.fetch(paymentId);
    
    console.log('✅ Payment details fetched:', paymentId);
    
    return payment;
  } catch (error: any) {
    console.error('❌ Fetch payment details failed:', error);
    throw new Error(`Failed to fetch payment details: ${error.message}`);
  }
};

// Initiate refund
export const initiateRefund = async (paymentId: string, amount?: number) => {
  try {
    const razorpay = createRazorpayInstance();
    
    if (!razorpay) {
      throw new Error('Razorpay not configured');
    }

    const refundOptions: any = {
      payment_id: paymentId
    };

    // If amount is specified, do partial refund
    if (amount) {
      refundOptions.amount = Math.round(amount * 100); // Convert to paise
    }

    const refund = await razorpay.payments.refund(paymentId, refundOptions);
    
    console.log('✅ Refund initiated:', refund.id);
    
    return refund;
  } catch (error: any) {
    console.error('❌ Refund initiation failed:', error);
    throw new Error(`Refund failed: ${error.message}`);
  }
};

// Capture payment (for authorized payments)
export const capturePayment = async (paymentId: string, amount: number) => {
  try {
    const razorpay = createRazorpayInstance();
    
    if (!razorpay) {
      throw new Error('Razorpay not configured');
    }

    const amountInPaise = Math.round(amount * 100);

    const payment = await razorpay.payments.capture(paymentId, amountInPaise, 'INR');
    
    console.log('✅ Payment captured:', paymentId);
    
    return payment;
  } catch (error: any) {
    console.error('❌ Payment capture failed:', error);
    throw new Error(`Payment capture failed: ${error.message}`);
  }
};

// Verify webhook signature
export const verifyWebhookSignature = (
  webhookBody: string,
  webhookSignature: string
): boolean => {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      console.error('❌ Razorpay key secret not configured');
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(webhookBody)
      .digest('hex');

    const isValid = expectedSignature === webhookSignature;

    if (isValid) {
      console.log('✅ Webhook signature verified');
    } else {
      console.error('❌ Webhook signature verification failed');
    }

    return isValid;
  } catch (error: any) {
    console.error('❌ Webhook verification error:', error);
    return false;
  }
};
