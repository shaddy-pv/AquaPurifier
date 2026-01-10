# AquaPure Backend API

Complete Node.js + Express + MongoDB backend for AquaPure E-Commerce platform.

## 🚀 Features

- ✅ User Authentication (JWT)
- ✅ Product Management
- ✅ Order Processing
- ✅ Review System
- ✅ Payment Integration (Razorpay)
- ✅ Email Notifications (SendGrid)
- ✅ SMS Notifications (Twilio)
- ✅ Admin Panel APIs
- ✅ RESTful API Design

## 📋 Prerequisites

- Node.js v18 or higher
- MongoDB Atlas account (or local MongoDB)
- Razorpay account
- SendGrid account (optional)
- Twilio account (optional)

## 🛠️ Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
```

3. **Update `.env` with your credentials:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
FRONTEND_URL=http://localhost:5173
```

## 🏃 Running the Server

### Development Mode:
```bash
npm run dev
```

### Production Mode:
```bash
npm run build
npm start
```

Server will start on: `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:slug` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `PATCH /api/products/:id/stock` - Update stock (Admin)

### Orders
- `POST /api/orders` - Create order
- `POST /api/orders/create-payment` - Create Razorpay order
- `POST /api/orders/verify-payment` - Verify payment
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:orderNumber` - Get single order
- `GET /api/orders` - Get all orders (Admin)
- `PATCH /api/orders/:id/status` - Update order status (Admin)
- `POST /api/orders/:id/cancel` - Cancel order

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/helpful` - Mark review helpful
- `GET /api/reviews` - Get all reviews (Admin)
- `PATCH /api/reviews/:id/approve` - Approve review (Admin)
- `PATCH /api/reviews/:id/reject` - Reject review (Admin)

### Health Check
- `GET /health` - Server health check

## 🔐 Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🧪 Testing API

### Using cURL:

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

**Get Products:**
```bash
curl http://localhost:5000/api/products
```

### Using Postman:

1. Import the API endpoints
2. Set Authorization header with JWT token
3. Test all endpoints

## 📁 Project Structure

```
src/
├── config/
│   └── database.ts       # MongoDB connection
├── models/
│   ├── User.ts          # User schema
│   ├── Product.ts       # Product schema
│   ├── Order.ts         # Order schema
│   └── Review.ts        # Review schema
├── routes/
│   ├── auth.ts          # Auth routes
│   ├── products.ts      # Product routes
│   ├── orders.ts        # Order routes
│   └── reviews.ts       # Review routes
├── middleware/
│   └── auth.ts          # Auth middleware
├── services/
│   ├── email.ts         # Email service
│   ├── sms.ts           # SMS service
│   └── payment.ts       # Payment service
└── server.ts            # Main server file
```

## 🚀 Deployment

### Deploy to Render:

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables
5. Deploy!

### Environment Variables for Production:

```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
RAZORPAY_KEY_ID=your_live_razorpay_key
RAZORPAY_KEY_SECRET=your_live_razorpay_secret
FRONTEND_URL=https://your-frontend-domain.com
```

## 🔧 Configuration

### MongoDB Indexes:

The application automatically creates indexes for:
- User email (unique)
- Product slug (unique)
- Order number (unique)
- Product search (text index)

### CORS:

CORS is configured to allow requests from the frontend URL specified in `FRONTEND_URL` environment variable.

## 📊 Database Models

### User
- name, email, password (hashed)
- phone, role (customer/admin)
- addresses array
- timestamps

### Product
- name, slug, description
- price, originalPrice, category
- images, features, specifications
- stock, rating, reviewCount
- timestamps

### Order
- orderNumber, user reference
- items array with product references
- shippingAddress object
- payment details
- status tracking
- timestamps

### Review
- product and user references
- rating (1-5), title, comment
- images, verified status
- helpful count, approval status
- timestamps

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation
- SQL injection prevention (MongoDB)
- XSS protection
- Rate limiting (recommended to add)
- CORS configuration

## 📝 Notes

- Email and SMS services are optional. The API will work without them.
- Payment integration requires Razorpay account.
- Admin users must be created manually in database with role: 'admin'
- All prices are in INR (Indian Rupees)

## 🆘 Troubleshooting

**Database connection fails:**
- Check MongoDB URI is correct
- Verify IP whitelist in MongoDB Atlas
- Check network connectivity

**Payment fails:**
- Verify Razorpay credentials
- Check if using test/live keys correctly
- Verify webhook signature

**Email/SMS not sending:**
- Check API keys are correct
- Verify sender email/phone is verified
- Check service account balance

## 📞 Support

For issues or questions, check the main project documentation.

## 📄 License

ISC
