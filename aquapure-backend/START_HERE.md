# 🚀 QUICK START GUIDE

## ✅ Backend Setup Complete!

All files have been created. Follow these steps to get started:

## 📋 STEP 1: Configure Environment Variables

Edit the `.env` file and update these values:

### Required (Minimum to run):
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
```

### Optional (For full functionality):
```env
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=your_email
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

## 🗄️ STEP 2: Setup Database

### Option A: MongoDB Atlas (FREE - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create FREE cluster
3. Create database user
4. Whitelist your IP (or allow all: 0.0.0.0/0)
5. Get connection string
6. Update `MONGODB_URI` in `.env`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/aquapure
```

### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/aquapure`

## 🏃 STEP 3: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running on port 5000
📍 Health check: http://localhost:5000/health
```

## 🧪 STEP 4: Test the API

Open browser or use curl:

**Health Check:**
```
http://localhost:5000/health
```

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'
```

**Get Products:**
```
http://localhost:5000/api/products
```

## 📊 STEP 5: Add Sample Data (Optional)

You can add products manually through the API or directly in MongoDB.

### Create Admin User:

1. Register a user through API
2. In MongoDB, find the user
3. Change `role` from `customer` to `admin`

### Add Sample Product:

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "AquaPure RO+UV Purifier",
    "slug": "aquapure-ro-uv-purifier",
    "description": "Advanced water purification system",
    "price": 15999,
    "category": "ro",
    "stock": 50,
    "features": ["RO+UV", "7 Stage Purification", "8L Storage"],
    "images": ["/placeholder.svg"]
  }'
```

## 🔗 STEP 6: Connect Frontend

Update frontend `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 STEP 7: Deploy (When Ready)

### Deploy to Render:

1. Push code to GitHub
2. Go to https://render.com/
3. Create new Web Service
4. Connect repository
5. Add environment variables
6. Deploy!

## 📝 Common Issues

### "Cannot connect to database"
- Check MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Check internet connection

### "Port 5000 already in use"
- Change PORT in `.env` to 5001 or another port
- Or stop the process using port 5000

### "Module not found"
- Run `npm install` again
- Delete `node_modules` and run `npm install`

## 📚 API Documentation

See `README.md` for complete API documentation.

## 🎉 You're Ready!

Your backend is now running and ready to handle requests from the frontend!

**Next Steps:**
1. Configure third-party services (Razorpay, SendGrid, Twilio)
2. Add sample products
3. Test complete order flow
4. Deploy to production

Good luck! 🚀
