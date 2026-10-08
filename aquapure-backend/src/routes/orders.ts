import express from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import Settings from '../models/Settings';
import { authenticate, isAdmin, optionalAuth, AuthRequest } from '../middleware/auth';
import { sendOrderConfirmationEmail } from '../services/email';
import { sendOrderSMS } from '../services/sms';
import { createPaymentOrder, verifyPaymentSignature } from '../services/payment';
import { orderLimiter } from '../middleware/rateLimiter';

const router = express.Router();

const VALID_COUPONS: Record<string, { discount: number; type: 'percentage' | 'fixed' }> = {
  'AQUA10': { discount: 10, type: 'percentage' },
  'SAVE500': { discount: 500, type: 'fixed' },
  'FIRST20': { discount: 20, type: 'percentage' },
};

// Create new order
router.post('/', orderLimiter, authenticate, async (req: AuthRequest, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }

    if (!['razorpay', 'cod', 'upi'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Valid payment method is required' });
    }

    // Verify product availability and compute prices strictly on server
    const verifiedItems: any[] = [];
    let serverSubtotal = 0;

    for (const item of items) {
      const productId = item.product || item.id;
      const quantity = Math.max(1, parseInt(item.quantity) || 1);

      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        return res.status(404).json({ message: `Product "${item.name || productId}" is not available` });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }

      verifiedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images?.[0] || item.image || '/placeholder.svg'
      });

      serverSubtotal += product.price * quantity;
    }

    // Server-side discount calculation
    let serverDiscount = 0;
    if (couponCode && VALID_COUPONS[couponCode.toUpperCase()]) {
      const coupon = VALID_COUPONS[couponCode.toUpperCase()];
      if (coupon.type === 'percentage') {
        serverDiscount = Math.round((serverSubtotal * coupon.discount) / 100);
      } else {
        serverDiscount = coupon.discount;
      }
    }

    // Fetch store settings for shipping and GST/Tax rate (0% if unregistered)
    const settings = await Settings.findOne();
    const gstRate = settings?.taxRateGst ?? 0;
    const freeShippingMin = settings?.freeShippingThreshold ?? 0;
    const standardFee = settings?.standardDeliveryFee ?? 0;
    const serverShipping = (freeShippingMin === 0 || serverSubtotal >= freeShippingMin) ? 0 : standardFee;

    // Server-side tax calculation
    const taxableAmount = Math.max(0, serverSubtotal - serverDiscount + serverShipping);
    const serverTax = gstRate > 0 ? Math.round(taxableAmount * (gstRate / 100)) : 0;
    const serverTotal = taxableAmount + serverTax;

    // Generate unique order number
    const orderNumber = 'AQP' + Date.now().toString().slice(-8).toUpperCase();

    // Create order
    const order = await Order.create({
      orderNumber,
      user: req.user?.id,
      items: verifiedItems,
      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        email: shippingAddress.email || req.user?.email,
        street: shippingAddress.street || shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state || '',
        pincode: shippingAddress.pincode
      },
      paymentMethod,
      subtotal: serverSubtotal,
      tax: serverTax,
      shipping: serverShipping,
      discount: serverDiscount,
      total: serverTotal,
      status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
      paymentStatus: 'pending'
    });

    // Update product stock
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name slug images');

    // Send notifications if confirmed (COD)
    if (order.status === 'confirmed') {
      sendOrderConfirmationEmail(populatedOrder).catch(err => 
        console.error('Email send failed:', err)
      );
      sendOrderSMS(populatedOrder).catch(err => 
        console.error('SMS send failed:', err)
      );
    }

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

// Create Razorpay payment order for an existing database order
router.post('/create-payment', authenticate, async (req: AuthRequest, res) => {
  try {
    const { orderNumber, orderId } = req.body;

    if (!orderNumber && !orderId) {
      return res.status(400).json({ message: 'Order number or order ID is required' });
    }

    const orderQuery = orderNumber ? { orderNumber } : { _id: orderId };
    const order = await Order.findOne(orderQuery);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify ownership
    if (order.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Use server-verified order total
    const paymentOrder = await createPaymentOrder(order.total, order.orderNumber);

    order.razorpayOrderId = paymentOrder.id;
    await order.save();

    res.json({
      orderId: paymentOrder.id,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      orderNumber: order.orderNumber
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

    if (!razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Payment details are required' });
    }

    // Verify signature
    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update order
    const order = await Order.findOneAndUpdate(
      { 
        $or: [
          { orderNumber },
          { razorpayOrderId }
        ]
      },
      {
        paymentStatus: 'completed',
        paymentId: razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        status: 'confirmed'
      },
      { new: true }
    ).populate('user', 'name email phone').populate('items.product', 'name slug images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Send notifications
    sendOrderConfirmationEmail(order).catch(err => 
      console.error('Email send failed:', err)
    );
    sendOrderSMS(order).catch(err => 
      console.error('SMS send failed:', err)
    );

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

// Admin Statistics Summary
router.get('/stats/summary', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.status !== 'cancelled' ? ord.total : 0), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => ['pending', 'processing'].includes(o.status)).length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

    const statusBreakdown = {
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: deliveredOrders,
      cancelled: cancelledOrders,
    };

    res.json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      statusBreakdown
    });
  } catch (error: any) {
    console.error('Stats summary error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
});

// Get single order by order number (or ID)
router.get('/:orderNumber', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const identifier = req.params.orderNumber;
    let order = await Order.findOne({ orderNumber: identifier })
      .populate('user', 'name email phone')
      .populate('items.product', 'name slug images');

    if (!order && identifier.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(identifier)
        .populate('user', 'name email phone')
        .populate('items.product', 'name slug images');
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If order has a user, check permission if auth is present
    if (req.user && req.user.role !== 'admin' && order.user && (order.user as any)._id?.toString() !== req.user.id) {
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
        .populate('items.product', 'name slug images'),
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

    const updateData: any = {};
    if (status) updateData.status = status;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (notes !== undefined) updateData.notes = notes;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('user', 'name email phone').populate('items.product', 'name slug images');

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
