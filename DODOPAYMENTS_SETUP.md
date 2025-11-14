# 🦤 DodoPayments Setup Guide

Complete guide to set up DodoPayments for AJ STUDIOZ with test and production modes.

---

## 📋 Table of Contents
- [Getting API Keys](#getting-api-keys)
- [Test Mode vs Live Mode](#test-mode-vs-live-mode)
- [Environment Variables](#environment-variables)
- [Product Configuration](#product-configuration)
- [Testing Payments](#testing-payments)
- [Webhook Setup](#webhook-setup)

---

## 🔑 Getting API Keys

### Step 1: Create DodoPayments Account
1. Go to **[DodoPayments.com](https://dodopayments.com/)**
2. Sign up or log in
3. Complete your business profile

### Step 2: Get Test API Keys
1. In DodoPayments Dashboard, toggle to **Test Mode** (top right)
2. Navigate to **Settings** → **API Keys**
3. You'll see two keys:
   - **Test API Key** (starts with `dodo_test_...`)
   - **Test Webhook Secret** (for webhook verification)
4. Copy both keys

### Step 3: Get Live API Keys
1. Toggle to **Live Mode** (top right)
2. Navigate to **Settings** → **API Keys**
3. You'll see:
   - **Live API Key** (starts with `dodo_live_...`)
   - **Live Webhook Secret**
4. Copy both keys

---

## 🧪 Test Mode vs Live Mode

### Test Mode (Development)
- Use **Test API Key** in `.env.local`
- No real money transactions
- Use test card numbers
- Perfect for development and testing

### Live Mode (Production)
- Use **Live API Key** in production (Vercel environment variables)
- Real money transactions
- Real customer cards
- For actual business operations

**Recommendation**: Always use test keys during development!

---

## ⚙️ Environment Variables

### Local Development (.env.local)
```env
# DodoPayments Test Configuration (Safe for development)
DODO_PAYMENTS_API_KEY=dodo_test_your_test_api_key_here
DODO_PAYMENTS_TEST_API_KEY=dodo_test_your_test_api_key_here
DODO_PAYMENTS_WEBHOOK_SECRET=your_test_webhook_secret_here
```

### Production (Vercel Environment Variables)
```env
# DodoPayments Live Configuration (Real transactions)
DODO_PAYMENTS_API_KEY=dodo_live_your_live_api_key_here
DODO_PAYMENTS_WEBHOOK_SECRET=your_live_webhook_secret_here
```

**To add in Vercel:**
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add each variable with Production scope

---

## 🏷️ Product Configuration

### Create Your Product in DodoPayments Dashboard

#### Main Product (₹1299/month)
1. Navigate to **Products** → **Create New Product**
2. Fill in details:
   ```
   Name: AJ STUDIOZ Pro Plan
   Price: ₹1299 (or $15.99 USD)
   Currency: INR
   Type: Subscription (Monthly)
   Slug: pro-plan-dodo
   Description: Access to premium AI models and features
   ```
3. Save the product
4. Copy the **slug** (`pro-plan-dodo`)

#### Optional: Test Product (₹2 for testing)
1. Create another product:
   ```
   Name: Test Payment
   Price: ₹2 (or $0.02 USD)
   Currency: INR
   Type: One-time Payment
   Slug: test-product
   Description: For testing payment integration
   ```
2. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_TEST_PREMIUM_SLUG=test-product
   ```

### Add Product Slug to Environment
```env
NEXT_PUBLIC_PREMIUM_SLUG=pro-plan-dodo
```

---

## 🧪 Testing Payments

### Method 1: Test via Admin Panel
1. Log in as admin (`kamesh6592@gmail.com`)
2. Go to `/admin` → **Payment Testing** tab
3. Click **"Test ₹2 Payment"** button
4. Complete checkout flow

### Method 2: Test via Checkout Page
1. Go to `/checkout`
2. Use test card numbers (provided by DodoPayments)
3. Complete payment

### Test Card Numbers (DodoPayments Test Mode)
Check DodoPayments documentation for current test cards. Common ones:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **CVV**: Any 3 digits
- **Expiry**: Any future date

---

## 🔗 Webhook Setup

### Configure Webhook Endpoint

1. In DodoPayments Dashboard → **Webhooks**
2. Add endpoint:
   ```
   URL: https://meow.ajstudioz.co.in/api/webhooks/dodopayments
   Events: 
     - payment.succeeded
     - payment.failed
     - subscription.created
     - subscription.updated
     - subscription.canceled
   ```
3. Save and copy the **Webhook Secret**

### Add Webhook Secret to Environment
```env
DODO_PAYMENTS_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Test Webhook (Local Development)
Use **ngrok** or **Cloudflare Tunnel** to expose localhost:
```bash
ngrok http 3000
# Then use: https://your-ngrok-url.ngrok.io/api/webhooks/dodopayments
```

---

## ✅ Verification Checklist

- [ ] Created DodoPayments account
- [ ] Obtained Test API Key
- [ ] Obtained Live API Key
- [ ] Added Test API Key to `.env.local`
- [ ] Added Live API Key to Vercel environment variables
- [ ] Created main product with slug `pro-plan-dodo`
- [ ] Added product slug to environment variables
- [ ] Configured webhook endpoint
- [ ] Added webhook secret to environment
- [ ] Tested payment flow in test mode
- [ ] Verified webhook receives events

---

## 🆘 Troubleshooting

### Payment Not Processing
- ✅ Check API key is correct (test vs live)
- ✅ Verify product slug matches dashboard
- ✅ Check webhook secret is set
- ✅ Look at Vercel logs for errors

### Webhook Not Receiving Events
- ✅ Verify webhook URL is accessible
- ✅ Check webhook secret matches dashboard
- ✅ Enable webhook event types in dashboard
- ✅ Check Vercel function logs

### Pro Status Not Updating
- ✅ Verify webhook is processing correctly
- ✅ Check database for payment records
- ✅ Clear user cache (logout/login)
- ✅ Check admin grants panel

---

## 📚 Additional Resources

- **DodoPayments Docs**: https://docs.dodopayments.com/
- **Better-Auth DodoPayments Plugin**: https://www.better-auth.com/docs/plugins/dodopayments
- **Your Webhook Logs**: Check in DodoPayments Dashboard → Webhooks → Recent Events

---

## 💡 Pro Tips

1. **Always use Test Mode during development** to avoid accidental charges
2. **Test webhook locally** using ngrok before deploying
3. **Monitor webhook events** in DodoPayments dashboard
4. **Set up email notifications** for failed payments
5. **Keep API keys secure** - never commit to git

---

## 🎯 Quick Start Commands

```bash
# Local development with test keys
pnpm dev

# Deploy to production (uses live keys from Vercel)
git push origin main

# Test webhook locally
ngrok http 3000
```

---

**Need Help?** Check the [DodoPayments Discord](https://discord.gg/dodopayments) or contact support@dodopayments.com
