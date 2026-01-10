import express from 'express';
import Product from '../models/Product';
import { authenticate, isAdmin, optionalAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all products with filters
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      search, 
      sort = '-createdAt',
      page = '1',
      limit = '12'
    } = req.query;
    
    let query: any = { isActive: true };
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { features: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    let sortOption: any = {};
    switch (sort) {
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query)
    ]);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch products', 
      error: error.message 
    });
  }
});

// Get single product by slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ 
      slug: req.params.slug,
      isActive: true 
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error: any) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch product', 
      error: error.message 
    });
  }
});

// Create product (Admin only)
router.post('/', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const product = await Product.create(req.body);
    
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error: any) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      message: 'Failed to create product', 
      error: error.message 
    });
  }
});

// Update product (Admin only)
router.put('/:id', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error: any) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      message: 'Failed to update product', 
      error: error.message 
    });
  }
});

// Delete product (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ 
      message: 'Product deleted successfully' 
    });
  } catch (error: any) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      message: 'Failed to delete product', 
      error: error.message 
    });
  }
});

// Update product stock (Admin only)
router.patch('/:id/stock', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({ message: 'Invalid stock value' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Stock updated successfully',
      product
    });
  } catch (error: any) {
    console.error('Update stock error:', error);
    res.status(500).json({ 
      message: 'Failed to update stock', 
      error: error.message 
    });
  }
});

export default router;
