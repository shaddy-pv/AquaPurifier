# 🚀 AquaPure - Complete Deployment Guide

## 📋 Table of Contents
1. [Frontend Deployment](#frontend-deployment)
2. [Backend Setup](#backend-setup)
3. [Database Setup](#database-setup)
4. [Third-Party Integrations](#third-party-integrations)
5. [Environment Variables](#environment-variables)
6. [Testing Before Launch](#testing-before-launch)
7. [Post-Launch Checklist](#post-launch-checklist)

---

## 1. 🎨 Frontend Deployment

### Current Status
✅ Frontend is 100% complete and ready to deploy

### Deployment Options

#### Option A: Vercel (Recommended - Easiest)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd aquapure/AquaPure
vercel

# Follow prompts:
# - Link to your Vercel account
# - Set project name: aquapure
# - Deploy!
```

#### Option B: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### Option C: Your Own Server (VPS/AWS/DigitalOcean)
```bash
# Build the project
npm run build

# Upload the 'dist' folder to your server
# Configure Nginx/Apache to serve the files
```

### Frontend Configuration Needed
Update these files before deployment:

**1. Google Analytics ID**
File: `src/lib/analytics.ts`
```typescript
export const GA_TRACKING_ID = "G-XXXXXXXXXX"; // Replace with your real GA4 ID
```

**2. Razorpay Key**
File: `src/lib/razorpay.ts`
```typescript
export const RAZORPAY_KEY = "rzp_live_XXXXXXXXXX"; // Replace with live key
```

**3. Domain URLs**
Update all `https://aquapure.com` references with your actual domain

---

## 2. 🔧 Backend Setup

### What You Need to Build

The frontend is complete, but you need a backend API for:

#### Required Backend APIs

**A. Authentication APIs**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/verify-email
GET  /api/auth/me
PUT  /api/auth/profile
```

**B. Product APIs**
```
GET    /api/products              # List all products
GET    /api/products/:id          # Get single product
POST   /api/products              # Create product (admin)
PUT    /api/products/:id          # Update product (admin)
DELETE /api/products/:id          # Delete product (admin)
GET    /api/products/search       # Search products
```

**C. Order APIs**
```
POST   /api/orders                # Create order
GET    /api/orders                # Get user orders
GET    /api/orders/:id            # Get order details
PUT    /api/orders/:id/status     # Update order status (admin)
GET    /api/orders/track/:id      # Track order
```

**D. Review APIs**
```
POST   /api/reviews               # Submit review
GET    /api/reviews/product/:id   # Get product reviews
PUT    /api/reviews/:id/approve   # Approve review (admin)
POST   /api/reviews/:id/helpful   # Mark review helpful
```

**E. Service Booking APIs**
```
POST   /api/services/book         # Book service (WhatsApp integration)
GET    /api/services/bookings     # Get bookings (admin)
PUT    /api/services/:id/status   # Update booking status
```

**F. Payment APIs**
```
POST   /api/payment/create-order  # Create Razorpay order
POST   /api/payment/verify        # Verify payment
POST   /api/payment/webhook       # Razorpay webhook
```

**G. Newsletter API**
```
POST   /api/newsletter/subscribe  # Subscribe to newsletter
```

**H. Contact API**
```
POST   /api/contact               # Submit contact form
```

### Backend Technology Stack (Recommended)

#### Option 1: Node.js + Express + MongoDB
```bash
# Create backend folder
mkdir backend
cd backend
npm init -y

# Install dependencies
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
npm install nodemailer razorpay twilio
npm install express-validator express-rate-limit helmet
npm install -D nodemon typescript @types/node @types/express
```

#### Option 2: Node.js + NestJS + PostgreSQL
```bash
npm i -g @nestjs/cli
nest new aquapure-backend
cd aquapure-backend
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install bcryptjs razorpay nodemailer
```

#### Option 3: Python + FastAPI + PostgreSQL
```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary
pip install python-jose passlib bcrypt
pip install python-multipart pydantic-settings
pip install razorpay sendgrid twilio
```

### Backend File Structure (Node.js Example)
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── razorpay.js
│   │   └── email.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   └── ServiceBooking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── reviews.js
│   │   └── services.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── email.js
│   │   ├── sms.js
│   │   └── whatsapp.js
│   └── server.js
├── .env
└── package.json
```

---

## 3. 💾 Database Setup

### Database Schema Required

#### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar VARCHAR(500),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Products Table
```sql
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  image VARCHAR(500),
  category VARCHAR(100),
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  stock INT DEFAULT 0,
  features JSON,
  specifications JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Orders Table
```sql
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_status VARCHAR(50),
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  shipping_address JSON,
  tracking_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Order Items Table
```sql
CREATE TABLE order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

#### Reviews Table
```sql
CREATE TABLE reviews (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  verified BOOLEAN DEFAULT FALSE,
  approved BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Service Bookings Table
```sql
CREATE TABLE service_bookings (
  id VARCHAR(36) PRIMARY KEY,
  service_name VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  notes TEXT,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Newsletter Subscribers Table
```sql
CREATE TABLE newsletter_subscribers (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Setup Commands

#### MongoDB (if using MongoDB)
```javascript
// Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/aquapure');

// Models are defined in code, no SQL needed
```

#### PostgreSQL
```bash
# Install PostgreSQL
# Create database
createdb aquapure

# Run migrations
psql aquapure < schema.sql
```

#### MySQL
```bash
# Create database
mysql -u root -p
CREATE DATABASE aquapure;
USE aquapure;

# Run schema
source schema.sql;
```

---

## 4. 🔌 Third-Party Integrations

### A. Razorpay (Payment Gateway)

**Setup Steps:**
1. Go to https://razorpay.com/
2. Sign up for account
3. Get API Keys from Dashboard
4. Enable payment methods (Cards, UPI, Net Banking, Wallets)
5. Set up webhooks for payment verification

**Configuration:**
```javascript
// Backend
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
const order = await razorpay.orders.create({
  amount: amount * 100, // amount in paise
  currency: 'INR',
  receipt: orderNumber
});
```

### B. Email Service (SendGrid/AWS SES/SMTP)

**Option 1: SendGrid**
```bash
npm install @sendgrid/mail

# Get API key from sendgrid.com
```

**Option 2: Nodemailer (SMTP)**
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

### C. SMS Service (Twilio/MSG91)

**Twilio Setup:**
```bash
npm install twilio

# Get credentials from twilio.com
```

```javascript
const twilio = require('twilio');
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

await client.messages.create({
  body: 'Your order has been shipped!',
  from: process.env.TWILIO_PHONE_NUMBER,
  to: customerPhone
});
```

### D. WhatsApp Business API

**For Service Bookings:**
```javascript
// Option 1: Use Twilio WhatsApp API
// Option 2: Use official WhatsApp Business API
// Option 3: Use wa.me links (current implementation - no API needed)
```

### E. Google Analytics

**Already integrated in frontend!**
Just replace the tracking ID in `src/lib/analytics.ts`

### F. Image Storage (Cloudinary/AWS S3)

**Cloudinary Setup:**
```bash
npm install cloudinary multer

# Get credentials from cloudinary.com
```

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
```

---

## 5. 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://api.aquapure.com
VITE_RAZORPAY_KEY=rzp_live_XXXXXXXXXX
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

### Backend (.env)
```env
# Server
NODE_ENV=production
PORT=5000
API_URL=https://api.aquapure.com
FRONTEND_URL=https://aquapure.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/aquapure
# OR for MongoDB
MONGODB_URI=mongodb://localhost:27017/aquapure

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# Razorpay
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email (SendGrid)
SENDGRID_API_KEY=SG.XXXXXXXXXX
FROM_EMAIL=noreply@aquapure.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=ACXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# WhatsApp
WHATSAPP_NUMBER=919140967681

# Cloudinary (for images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Analytics
GA_TRACKING_ID=G-XXXXXXXXXX
```

---

## 6. ✅ Testing Before Launch

### Checklist

**Frontend Testing:**
- [ ] Test all pages load correctly
- [ ] Test responsive design on mobile/tablet
- [ ] Test cart add/remove/update
- [ ] Test checkout flow
- [ ] Test user registration/login
- [ ] Test service booking (WhatsApp link)
- [ ] Test product search and filters
- [ ] Test all forms (contact, newsletter, etc.)
- [ ] Check all images load
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)

**Backend Testing:**
- [ ] Test all API endpoints with Postman
- [ ] Test authentication flow
- [ ] Test payment integration (use test mode first)
- [ ] Test email sending
- [ ] Test SMS sending
- [ ] Test database connections
- [ ] Test error handling
- [ ] Load testing with 100+ concurrent users

**Integration Testing:**
- [ ] Complete a test purchase end-to-end
- [ ] Book a service and verify WhatsApp message
- [ ] Test order tracking
- [ ] Test admin panel functionality
- [ ] Verify email notifications
- [ ] Verify SMS notifications

---

## 7. 🎯 Post-Launch Checklist

### Immediate (Day 1)
- [ ] Monitor error logs
- [ ] Check payment gateway transactions
- [ ] Verify email delivery
- [ ] Monitor server performance
- [ ] Check Google Analytics data

### Week 1
- [ ] Review customer feedback
- [ ] Fix any reported bugs
- [ ] Monitor conversion rates
- [ ] Check SEO rankings
- [ ] Review order fulfillment

### Month 1
- [ ] Analyze sales data
- [ ] Review customer reviews
- [ ] Optimize slow pages
- [ ] A/B test key pages
- [ ] Plan feature updates

---

## 8. 📦 Quick Start Commands

### Development
```bash
# Frontend
cd aquapure/AquaPure
npm install
npm run dev

# Backend (create this)
cd backend
npm install
npm run dev
```

### Production Build
```bash
# Frontend
npm run build

# Backend
npm run build
npm start
```

### Deploy
```bash
# Frontend to Vercel
vercel --prod

# Backend to your server
pm2 start server.js --name aquapure-api
```

---

## 9. 🆘 Support & Resources

### Documentation
- React: https://react.dev
- Vite: https://vitejs.dev
- Razorpay: https://razorpay.com/docs
- Tailwind CSS: https://tailwindcss.com

### Need Help?
- Check console for errors
- Review network tab for API issues
- Check backend logs
- Test with Postman
- Review this guide again

---

## 🎉 Congratulations!

Your AquaPure website is ready for production. Follow this guide step by step, and you'll have a fully functional e-commerce platform with home services!

**Good luck with your launch! 🚀**
