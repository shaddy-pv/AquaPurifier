import express from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { authenticate, isAdmin, AuthRequest } from '../middleware/auth';
import { sendOrderConfirmationEmail } from '../services/email';
import { sendOrderSMS } from '../services/sms';
import { createPaymentOrder, verifyPaymentSignature } from '../services/payment';

const router = express.Router();

// Create new order
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, tax, shipping, discount, total } = req.body;

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Generate unique order number
    const orderNumber = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Verify product availability and update stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }
    }

    // Create order
    const order = await Order.create({
      orderNumber,
      user: req.user?.id,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending'
    });

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name slug images');

    // Send notifications (don't wait for them)
    sendOrderConfirmationEmail(populatedOrder).catch(err => 
      console.error('Email send failed:', err)
    );
    sendOrderSMS(populatedOrder).catch(err => 
      console.error('SMS send failed:', err)
    );

    res.status(201).json({
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      message: 'Failed to create order', 
      error: error.message 
    });
  }
});

// Create Razorpay payment order
router.post('/create-payment', authenticate, async (req: AuthRequest, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ message: 'Amount and order ID are required' });
    }

    const paymentOrder = await createPaymentOrder(amount, orderId);

    res.json({
      orderId: paymentOrder.id,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency
    });
  } catch (error: any) {
    console.error('Create payment error:', error);
    res.status(500).json({ 
      message: 'Failed to create payment order', 
      error: error.message 
    });
  }
});

// Verify payment and update order
router.post('/verify-payment', authenticate, async (req: AuthRequest, res) => {
  try {
    const { orderNumber, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Verify signature
    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update order
    const order = await Order.findOneAndUpdate(
      { orderNumber },
      {
        paymentStatus: 'completed',
        paymentId: razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        status: 'confirmed'
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Payment verified successfully',
      order
    });
  } catch (error: any) {
    console.error('Verify payment error:', error);
    res.status(500).json({ 
      message: 'Failed to verify payment', 
      error: error.message 
    });
  }
});

// Get user's orders
router.get('/my-orders', authenticate, async (req: AuthRequest, res) => {
  try {
    const orders = await Order.find({ user: req.user?.id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name slug images');

    res.json(orders);
  } catch (error: any) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch orders', 
      error: error.message 
    });
  }
});

// Get single order by order number
router.get('/:orderNumber', authenticate, async (req: AuthRequest, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('user', 'name email phone')
      .populate('items.product', 'name slug images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error: any) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch order', 
      error: error.message 
    });
  }
});

// Get all orders (Admin only)
router.get('/', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const { status, page = '1', limit = '20' } = req.query;

    let query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('user', 'name email phone')
        .populate('items.product', 'name slug'),
      Order.countDocuments(query)
    ]);

    res.json({
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Get all orders error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch orders', 
      error: error.message 
    });
  }
});

// Update order status (Admin only)
router.patch('/:id/status', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const { status, trackingNumber, notes } = req.body;

    const updateData: any = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (notes) updateData.notes = notes;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error: any) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      message: 'Failed to update order status', 
      error: error.message 
    });
  }
});

// Cancel order
router.post('/:id/cancel', authenticate, async (req: AuthRequest, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Can only cancel pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ 
        message: 'Order cannot be cancelled at this stage' 
      });
    }

    order.status = 'cancelled';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error: any) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      message: 'Failed to cancel order', 
      error: error.message 
    });
  }
});

export default router;
