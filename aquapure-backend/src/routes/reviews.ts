import express, { Response } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';
import Order from '../models/Order';
import { authenticate, isAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { sort = '-createdAt', page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let sortOption: any = {};
    switch (sort) {
      case 'rating-high':
        sortOption = { rating: -1 };
        break;
      case 'rating-low':
        sortOption = { rating: 1 };
        break;
      case 'helpful':
        sortOption = { helpful: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const [reviews, total] = await Promise.all([
      Review.find({ 
        product: req.params.productId,
        status: 'approved'
      })
        .populate('user', 'name')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Review.countDocuments({ 
        product: req.params.productId,
        status: 'approved'
      })
    ]);

    res.json({
      reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Get reviews error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch reviews', 
      error: error.message 
    });
  }
});

// Create review
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { product, rating, title, comment, images } = req.body;

    // Validation
    if (!product || !rating || !title || !comment) {
      return res.status(400).json({ 
        message: 'Product, rating, title, and comment are required' 
      });
    }

    // Check if product exists
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      product,
      user: req.user?.id
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this product' 
      });
    }

    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      user: req.user?.id,
      'items.product': product,
      status: { $in: ['delivered', 'confirmed'] }
    });

    // Create review
    const review = await Review.create({
      product,
      user: req.user?.id,
      rating,
      title,
      comment,
      images: images || [],
      verified: !!hasPurchased,
      status: 'pending' // Reviews need admin approval
    });

    // Update product rating
    await updateProductRating(product);

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name');

    res.status(201).json({
      message: 'Review submitted successfully. It will be visible after approval.',
      review: populatedReview
    });
  } catch (error: any) {
    console.error('Create review error:', error);
    res.status(500).json({ 
      message: 'Failed to create review', 
      error: error.message 
    });
  }
});

// Update review
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { rating, title, comment, images } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update review
    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    review.images = images || review.images;
    review.status = 'pending'; // Reset to pending after edit

    await review.save();

    // Update product rating
    await updateProductRating(review.product);

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error: any) {
    console.error('Update review error:', error);
    res.status(500).json({ 
      message: 'Failed to update review', 
      error: error.message 
    });
  }
});

// Delete review
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Update product rating
    await updateProductRating(productId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    console.error('Delete review error:', error);
    res.status(500).json({ 
      message: 'Failed to delete review', 
      error: error.message 
    });
  }
});

// Mark review as helpful
router.post('/:id/helpful', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({
      message: 'Marked as helpful',
      review
    });
  } catch (error: any) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ 
      message: 'Failed to mark review as helpful', 
      error: error.message 
    });
  }
});

// Get all reviews (Admin only)
router.get('/', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = '1', limit = '20' } = req.query;

    let query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('user', 'name email')
        .populate('product', 'name slug'),
      Review.countDocuments(query)
    ]);

    res.json({
      reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch reviews', 
      error: error.message 
    });
  }
});

// Approve review (Admin only)
router.patch('/:id/approve', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update product rating
    await updateProductRating(review.product);

    res.json({
      message: 'Review approved successfully',
      review
    });
  } catch (error: any) {
    console.error('Approve review error:', error);
    res.status(500).json({ 
      message: 'Failed to approve review', 
      error: error.message 
    });
  }
});

// Reject review (Admin only)
router.patch('/:id/reject', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({
      message: 'Review rejected successfully',
      review
    });
  } catch (error: any) {
    console.error('Reject review error:', error);
    res.status(500).json({ 
      message: 'Failed to reject review', 
      error: error.message 
    });
  }
});

// Helper function to update product rating
async function updateProductRating(productId: any) {
  try {
    const reviews = await Review.find({ 
      product: productId,
      status: 'approved'
    });

    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, {
        rating: 0,
        reviewCount: 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      reviewCount: reviews.length
    });
  } catch (error) {
    console.error('Update product rating error:', error);
  }
}

export default router;
