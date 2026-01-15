# 🚀 AquaPure Deployment Guide

## Quick Overview

**What you'll deploy:**
- Frontend → Vercel (FREE)
- Backend → Render (FREE tier available)
- Database → MongoDB Atlas (FREE 512MB)

**Time needed:** 30-60 minutes

---

## 📋 Prerequisites

Before starting, create accounts on:
1. **GitHub** - https://github.com (for code hosting)
2. **Vercel** - https://vercel.com (for frontend)
3. **Render** - https://render.com (for backend)
4. **MongoDB Atlas** - https://mongodb.com/cloud/atlas (for database)

---

## STEP 1: Push Code to GitHub

### 1.1 Commit Your Changes
In GitHub Desktop:
- Add commit message: "Initial commit - AquaPure project"
- Click "Commit to main"

### 1.2 Publish to GitHub
- Click "Publish repository" button
- Repository name: `aquapure`
- Description: "AquaPure E-Commerce Platform"
- Keep it Private or Public (your choice)
- Click "Publish repository"

✅ Your code is now on GitHub!

---

## STEP 2: Setup MongoDB Database

### 2.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/GitHub (easiest)
3. Choose **FREE** tier (M0 Sandbox)

### 2.2 Create Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0)
3. Select region closest to you:
   - For India: Mumbai (ap-south-1)
   - For US: Virginia (us-east-1)
4. Cluster name: `aquapure`
5. Click "Create"

### 2.3 Create Database User
1. Click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Authentication: Password
4. Username: `aquapure_admin`
5. Password: Click "Autogenerate Secure Password" (SAVE THIS!)
6. Database User Privileges: "Atlas admin"
7. Click "Add User"

### 2.4 Allow Network Access
1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 2.5 Get Connection String
1. Click "Database" (left sidebar)
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `aquapure`

**Example:**
```
mongodb+srv://aquapure_admin:YOUR_PASSWORD@aquapure.xxxxx.mongodb.net/aquapure
```

**SAVE THIS CONNECTION STRING!** You'll need it later.

---

## STEP 3: Deploy Backend to Render

### 3.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 3.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select `aquapure` repository
4. Click "Connect"

### 3.3 Configure Service

**Basic Settings:**
- Name: `aquapure-backend`
- Region: Choose closest to you
- Branch: `main`
- Root Directory: `aquapure-backend`
- Environment: `Node`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

**Instance Type:**
- Choose **Free** (for testing)
- Or **Starter** ($7/month for production)

### 3.4 Add Environment Variables

Click "Advanced" → "Add Environment Variable"

Add these variables one by one:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://aquapure_admin:YOUR_PASSWORD@aquapure.xxxxx.mongodb.net/aquapure
JWT_SECRET=your-super-secret-random-key-here-change-this-to-something-secure
FRONTEND_URL=https://aquapure.vercel.app
```

**Optional (for full features):**
```
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXX
SENDGRID_API_KEY=SG.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
FROM_EMAIL=noreply@yourdomain.com
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
```

**Generate JWT_SECRET:**
Use this command in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.5 Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. You'll get a URL like: `https://aquapure-backend.onrender.com`

### 3.6 Test Backend
Open in browser:
```
https://aquapure-backend.onrender.com/health
```

You should see:
```json
{"status":"OK","message":"AquaPure API is running"}
```

✅ Backend is live!

**SAVE YOUR BACKEND URL!** You'll need it for frontend.

---

## STEP 4: Deploy Frontend to Vercel

### 4.1 Update Frontend Configuration

Before deploying, update the API URL in your frontend:

**Option A: Using Environment Variable (Recommended)**
Create file: `AquaPure-frontend/.env.production`
```env
VITE_API_URL=https://aquapure-backend.onrender.com/api
VITE_RAZORPAY_KEY=rzp_test_XXXXXXXXXXXX
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

**Option B: Direct Update**
Edit `AquaPure-frontend/src/store/authStore.ts` and other store files:
```typescript
const API_URL = 'https://aquapure-backend.onrender.com/api';
```

Commit these changes:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

### 4.2 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### 4.3 Import Project
1. Click "Add New..." → "Project"
2. Import your `aquapure` repository
3. Click "Import"

### 4.4 Configure Project
**Framework Preset:** Vite
**Root Directory:** `AquaPure-frontend`
**Build Command:** `npm run build`
**Output Directory:** `dist`

### 4.5 Add Environment Variables
Click "Environment Variables" and add:

```
VITE_API_URL=https://aquapure-backend.onrender.com/api
VITE_RAZORPAY_KEY=rzp_test_XXXXXXXXXXXX
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

### 4.6 Deploy
1. Click "Deploy"
2. Wait 2-5 minutes
3. You'll get a URL like: `https://aquapure.vercel.app`

### 4.7 Update Backend CORS

Go back to Render dashboard:
1. Open your backend service
2. Go to "Environment"
3. Update `FRONTEND_URL` to your Vercel URL:
```
FRONTEND_URL=https://aquapure.vercel.app
```
4. Save changes (backend will redeploy)

✅ Frontend is live!

---

## STEP 5: Setup Third-Party Services (Optional)

### 5.1 Razorpay (Payment Gateway)

**For Testing:**
1. Go to https://dashboard.razorpay.com/signup
2. Sign up
3. Go to Settings → API Keys
4. Generate Test Keys
5. Copy Key ID and Secret

**For Production:**
1. Complete KYC verification
2. Generate Live Keys
3. Update environment variables with live keys

### 5.2 SendGrid (Email Service)

1. Go to https://signup.sendgrid.com/
2. Sign up (FREE 100 emails/day)
3. Verify your email
4. Go to Settings → API Keys
5. Create API Key with "Full Access"
6. Copy the key (shown only once!)
7. Go to Settings → Sender Authentication
8. Verify a sender email
9. Add to backend environment variables

### 5.3 Twilio (SMS Service)

1. Go to https://www.twilio.com/try-twilio
2. Sign up ($15 free credit)
3. Verify your phone
4. Go to Console Dashboard
5. Copy Account SID and Auth Token
6. Go to Phone Numbers → Buy a number
7. Add to backend environment variables

### 5.4 Google Analytics

1. Go to https://analytics.google.com/
2. Create account
3. Create property: "AquaPure"
4. Create Web data stream
5. Copy Measurement ID (G-XXXXXXXXXX)
6. Update in frontend: `src/lib/analytics.ts`

---

## STEP 6: Test Your Deployment

### 6.1 Test Frontend
Visit your Vercel URL: `https://aquapure.vercel.app`

Check:
- ✅ Homepage loads
- ✅ Products page works
- ✅ Can add to cart
- ✅ Cart page works
- ✅ All pages accessible

### 6.2 Test Backend API
```bash
# Health check
curl https://aquapure-backend.onrender.com/health

# Register user
curl -X POST https://aquapure-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'
```

### 6.3 Test Complete Flow
1. Register a new account
2. Browse products
3. Add items to cart
4. Go to checkout
5. Fill shipping details
6. Test payment (use test card: 4111 1111 1111 1111)
7. Check if order is created
8. Check if email/SMS received (if configured)

---

## STEP 7: Custom Domain (Optional)

### 7.1 Buy Domain
Buy from:
- Namecheap: https://www.namecheap.com
- GoDaddy: https://www.godaddy.com
- Google Domains: https://domains.google

Example: `aquapure.com`

### 7.2 Add Domain to Vercel
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Domains
4. Add domain: `aquapure.com` and `www.aquapure.com`
5. Follow DNS configuration instructions

### 7.3 Add Subdomain for Backend (Optional)
1. Go to Render dashboard
2. Select your backend service
3. Go to Settings → Custom Domain
4. Add: `api.aquapure.com`
5. Update DNS records

### 7.4 Update Environment Variables
Update `FRONTEND_URL` in backend to your custom domain.

---

## 🎯 Quick Reference

### Your Deployment URLs
```
Frontend: https://aquapure.vercel.app
Backend:  https://aquapure-backend.onrender.com
Database: MongoDB Atlas (cloud)
```

### Important Credentials to Save
```
MongoDB URI: mongodb+srv://...
JWT Secret: [your-secret]
Razorpay Keys: [test/live keys]
SendGrid API Key: [your-key]
Twilio Credentials: [your-credentials]
```

---

## 🆘 Troubleshooting

### Frontend Issues

**Build fails on Vercel:**
- Check build logs
- Verify all dependencies in package.json
- Check environment variables
- Try building locally: `npm run build`

**API calls fail:**
- Check VITE_API_URL is correct
- Check browser console for errors
- Verify CORS settings in backend

### Backend Issues

**Deployment fails on Render:**
- Check build logs
- Verify Root Directory is `aquapure-backend`
- Check all environment variables
- Verify MongoDB connection string

**Database connection fails:**
- Check MongoDB URI is correct
- Verify IP whitelist (0.0.0.0/0)
- Check username/password
- Test connection locally first

**API returns 500 errors:**
- Check Render logs
- Verify all environment variables
- Check MongoDB connection
- Test endpoints locally

### Payment Issues

**Razorpay not working:**
- Verify API keys are correct
- Check if using test/live keys correctly
- Test with test card: 4111 1111 1111 1111
- Check browser console for errors

---

## 💰 Cost Summary

### FREE Tier (Perfect for Testing)
- Frontend (Vercel): **FREE**
- Backend (Render): **FREE** (sleeps after 15 min inactivity)
- Database (MongoDB): **FREE** (512MB)
- Email (SendGrid): **FREE** (100 emails/day)
- SMS (Twilio): **$15 free credit**
- **Total: $0/month**

### Production Tier (Recommended)
- Frontend (Vercel Pro): **$20/month**
- Backend (Render Starter): **$7/month**
- Database (MongoDB): **$9/month** (2GB)
- Email (SendGrid): **$15/month** (40k emails)
- SMS (Twilio): **Pay per SMS** (~₹0.50/SMS)
- Domain: **~$15/year**
- **Total: ~$50-60/month**

---

## ✅ Post-Deployment Checklist

### Immediate (Day 1)
- [ ] Test all pages load correctly
- [ ] Test user registration/login
- [ ] Test complete purchase flow
- [ ] Test payment with test card
- [ ] Check error logs in Render
- [ ] Verify email notifications work
- [ ] Test on mobile devices
- [ ] Test on different browsers

### Week 1
- [ ] Monitor error logs daily
- [ ] Check payment gateway transactions
- [ ] Review Google Analytics data
- [ ] Gather user feedback
- [ ] Fix any reported bugs
- [ ] Monitor server performance

### Before Going Live
- [ ] Switch Razorpay to live keys
- [ ] Complete Razorpay KYC
- [ ] Add real product data
- [ ] Update company information
- [ ] Update legal pages
- [ ] Set up custom domain
- [ ] Configure SSL (automatic on Vercel/Render)
- [ ] Set up backup system
- [ ] Create admin user
- [ ] Test everything again!

---

## 🎉 Congratulations!

Your AquaPure e-commerce platform is now live!

### What You've Achieved:
✅ Deployed frontend to Vercel
✅ Deployed backend to Render
✅ Connected to MongoDB database
✅ Configured payment gateway
✅ Set up email/SMS notifications
✅ Production-ready e-commerce platform

### Next Steps:
1. Add real products to database
2. Test with real customers
3. Monitor analytics
4. Gather feedback
5. Iterate and improve

**Good luck with your business! 🚀**

---

## 📞 Need Help?

### Documentation
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
- MongoDB: https://docs.mongodb.com/atlas
- Razorpay: https://razorpay.com/docs

### Common Commands

**Redeploy Frontend:**
```bash
git add .
git commit -m "Update"
git push
# Vercel auto-deploys
```

**Redeploy Backend:**
```bash
git add .
git commit -m "Update"
git push
# Render auto-deploys
```

**View Logs:**
- Vercel: Dashboard → Project → Deployments → View Logs
- Render: Dashboard → Service → Logs

---

**Last Updated:** January 2026
**Status:** Production Ready ✅
