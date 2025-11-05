# Resend Email Setup Guide for AJ STUDIOZ

This guide will help you configure the Resend email service to enable email functionality in your AJ STUDIOZ application.

## 📧 What is Resend?

Resend is a modern transactional email service designed for developers. Your application uses Resend to send:
- **Welcome Emails** - When new users sign up
- **Security Alerts** - When users log in from new devices/locations
- **Lookout Notifications** - When background search tasks complete

---

## 🎯 Quick Setup Steps

### 1. Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Click **Sign Up** or **Get Started**
3. You can sign up with:
   - GitHub account (recommended for developers)
   - Google account
   - Email address
4. Verify your email address if required

### 2. Get Your API Key

1. After signing in, go to the [Resend Dashboard](https://resend.com/home)
2. Navigate to **API Keys** section in the sidebar
3. Click **Create API Key**
4. Configure your API key:
   - **Name**: `AJ STUDIOZ Production` (or any name you prefer)
   - **Permission**: Select **Sending access**
   - **Domain**: Select **All Domains** (or specific domain if you've verified one)
5. Click **Add**
6. **IMPORTANT**: Copy the API key immediately! It will look like:
   ```
   re_123abc456def789ghi012jkl345mno678
   ```
7. Save it securely - you won't be able to see it again!

### 3. Add API Key to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Select your project: **meowihh**
3. Go to **Settings** tab
4. Click **Environment Variables** in the sidebar
5. Add new variable:
   - **Key**: `RESEND_API_KEY`
   - **Value**: Your Resend API key (starts with `re_`)
   - **Environments**: Check all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
6. Click **Save**
7. **Redeploy your application**:
   - Go to **Deployments** tab
   - Click the three dots (⋯) on your latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger deployment

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variable
vercel env add RESEND_API_KEY
# When prompted, enter your Resend API key
# Select all environments: production, preview, development
```

### 4. Verify Configuration

After redeploying, test the email functionality:

1. **Test Welcome Email**:
   - Create a new user account
   - Check the email inbox for welcome message

2. **Test Security Alert**:
   - Log in from a new device or browser
   - Check inbox for "We've noticed a new login" message

3. **Check Logs** in Vercel:
   - Go to your project dashboard
   - Click **Deployments** > Latest deployment > **Logs**
   - Look for:
     - ✅ Success: `✅ Welcome email sent successfully: [email-id]`
     - ❌ Error: `⚠️ RESEND_API_KEY not configured` (means key not loaded)

---

## 🆓 Pricing & Free Tier

### Free Plan (Perfect for Getting Started)
- **3,000 emails per month** - FREE
- **100 emails per day** - FREE
- 1 domain verification
- Email logs for 3 days
- No credit card required

### Paid Plans (When You Scale)
- **Pro Plan**: $20/month
  - 50,000 emails/month
  - $1 per 1,000 additional emails
  - Email logs for 30 days
  - Priority support

- **Enterprise**: Custom pricing
  - Unlimited emails
  - Dedicated IP
  - Custom log retention
  - SLA guarantee

**For most applications, the free tier is more than sufficient!**

---

## 📨 Email Configuration Details

### Email Addresses Used by Your App

Your application sends emails from these addresses:
- `noreply@ajstudioz.co.in` - Lookout completion notifications
- `security@ajstudioz.co.in` - Security alerts and new login notifications
- `welcome@ajstudioz.co.in` - Welcome emails for new users

### Domain Verification (Optional but Recommended)

#### Why Verify Your Domain?

Without domain verification, Resend uses their default domain and emails may:
- Have lower deliverability
- Be marked as spam
- Show "via resend.dev" in email clients

**With verification**, you get:
- ✅ Better deliverability rates
- ✅ Professional appearance
- ✅ Custom "From" addresses
- ✅ DKIM/SPF authentication

#### How to Verify Your Domain

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Click **Add Domain**
3. Enter your domain: `ajstudioz.co.in`
4. Resend will provide DNS records to add:

```
TXT Record:
Name: @ (or ajstudioz.co.in)
Value: resend-verify=[unique-token]

DKIM Record:
Name: resend._domainkey
Value: [provided-value]

SPF Record (add to existing TXT):
v=spf1 include:spf.resend.com ~all
```

5. Add these records to your DNS provider (Cloudflare, Namecheap, etc.)
6. Wait 5-10 minutes for DNS propagation
7. Click **Verify** in Resend dashboard
8. Status will change to ✅ **Verified**

#### Testing Without Domain Verification

**⚠️ Important Limitation:**
Without domain verification, you can ONLY send emails to:
- Your own email address (the one you signed up with)
- Example: If you signed up with `kamesh6592@gmail.com`, you can only send test emails to that address

**Why this limitation?**
- Prevents spam and abuse
- Protects Resend's email reputation
- Forces proper domain verification for production use

**For Testing:**
```bash
# This will WORK (send to your own email):
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "kamesh6592@gmail.com",
    "subject": "Test",
    "text": "Works!"
  }'

# This will FAIL with 403 error (send to other email):
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "someone-else@example.com",
    "subject": "Test",
    "text": "Will fail!"
  }'
# Error: "You can only send testing emails to your own email address"
```

**To send to ANY email address:**
- You MUST verify your domain `ajstudioz.co.in` (see section above)
- Free tier allows 1 domain verification
- Takes 5-10 minutes after adding DNS records

---

## 🔧 Troubleshooting

### Problem: Emails Still Not Sending

**Check 1: API Key Added Correctly?**
```bash
# Check if environment variable is set in Vercel
vercel env ls
# Should show RESEND_API_KEY in the list
```

**Check 2: Redeployed After Adding Key?**
- Environment variables require a redeploy to take effect
- Go to Vercel Dashboard > Deployments > Redeploy

**Check 3: API Key is Valid?**
- Test your API key using curl (replace with YOUR email address):
```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_API_KEY_HERE' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your-actual-email@gmail.com",
    "subject": "Test Email from AJ STUDIOZ",
    "text": "This is a test email from Resend. Your API key works!"
  }'
```
- **IMPORTANT**: Replace `your-actual-email@gmail.com` with YOUR email (the one you signed up with)
- Should return: `{"id":"[email-id]"}` ✅
- Common errors:
  - `403 validation_error` - You can only test with YOUR email until you verify a domain
  - `401 unauthorized` - Invalid API key, regenerate in Resend dashboard
  - `422 unprocessable_entity` - Check JSON syntax

**Check 4: View Logs in Resend Dashboard**
1. Go to [Resend Logs](https://resend.com/logs)
2. Filter by time period
3. Check status of recent emails:
   - ✅ Sent
   - ⏳ Pending
   - ❌ Failed
4. Click on failed emails to see error details

### Problem: Emails Going to Spam

**Solution 1: Verify Your Domain** (see above)

**Solution 2: Add SPF/DKIM Records**
```
Add to your DNS:

TXT Record:
Name: @
Value: v=spf1 include:spf.resend.com ~all

DKIM provided by Resend after domain verification
```

**Solution 3: Warm Up Your Sending**
- Start with low volume (10-20 emails/day)
- Gradually increase over 2-3 weeks
- This builds sender reputation

**Solution 4: Use Email Best Practices**
- Include unsubscribe link
- Use clear subject lines
- Don't use spammy keywords
- Maintain clean recipient lists

### Problem: "Domain not verified" Error

**Solution:**
- You can still send emails using Resend's default domain
- For production, follow "Domain Verification" section above
- Free tier allows 1 domain verification

### Problem: Rate Limit Exceeded

**Check Your Limits:**
- Free tier: 100 emails per day, 3,000 per month
- If exceeded, emails will queue or fail

**Solutions:**
- Upgrade to Pro plan ($20/month for 50k emails)
- Optimize email sending (batch notifications, digest emails)
- Implement email preferences for users

---

## 📊 Monitoring Email Delivery

### Via Resend Dashboard

1. Go to [Resend Logs](https://resend.com/logs)
2. See real-time delivery status:
   - Total emails sent
   - Delivery rate
   - Bounce rate
   - Open rate (if tracking enabled)
3. Filter by:
   - Date range
   - Email status
   - Recipient
   - Subject

### Via Application Logs

Check your Vercel deployment logs for:
```
✅ Success messages:
✅ Welcome email sent successfully: re_abc123...
✅ New login email sent successfully: re_def456...
✅ Lookout completion email sent successfully: re_ghi789...

❌ Error messages:
❌ Failed to send welcome email: [error details]
⚠️ RESEND_API_KEY not configured. Email not sent.
```

---

## 🔐 Security Best Practices

### Protect Your API Key

✅ **DO:**
- Store API key in environment variables only
- Never commit API key to Git
- Regenerate key if accidentally exposed
- Use different keys for dev/staging/prod

❌ **DON'T:**
- Hard-code API key in source code
- Share API key in public channels
- Use production key in development
- Store in client-side code

### API Key Rotation

Rotate your API key periodically (every 3-6 months):
1. Create new API key in Resend dashboard
2. Add new key to Vercel environment variables
3. Redeploy application
4. Test email functionality
5. Delete old API key from Resend dashboard

### Monitor Usage

- Check Resend dashboard weekly for unusual activity
- Set up email alerts for:
  - High bounce rates
  - Spam complaints
  - API errors
- Review email logs for suspicious patterns

---

## 🎓 Email Templates Used

Your application includes three email templates:

### 1. Welcome Email (`welcome@ajstudioz.co.in`)
- Sent when new users sign up
- Includes: Username, getting started tips
- Template: `components/emails/welcome.tsx`

### 2. Security Alert (`security@ajstudioz.co.in`)
- Sent on new device/location login
- Includes: Login time, IP address, location, browser
- Template: `components/emails/new-login.tsx`

### 3. Lookout Completion (`noreply@ajstudioz.co.in`)
- Sent when background search completes
- Includes: Chat title, AI response summary, chat link
- Template: `components/emails/lookout-completed.tsx`

### Customizing Email Templates

Templates are built with React Email:
```bash
# Install React Email CLI for local preview
npm install @react-email/cli -D

# Preview emails locally
npm run email:dev
# Opens http://localhost:3000 with email previews
```

Edit templates in `components/emails/` directory.

---

## 📚 Additional Resources

### Official Documentation
- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [React Email Documentation](https://react.email/docs)

### Helpful Guides
- [Domain Verification Guide](https://resend.com/docs/dashboard/domains/introduction)
- [Email Best Practices](https://resend.com/docs/knowledge-base/best-practices)
- [Troubleshooting Guide](https://resend.com/docs/knowledge-base/troubleshooting)

### Support
- [Resend Community](https://resend.com/community)
- [Resend Status Page](https://status.resend.com)
- Email: support@resend.com

---

## ✅ Verification Checklist

Before going to production, ensure:

- [ ] Signed up for Resend account
- [ ] Generated API key with sending access
- [ ] Added `RESEND_API_KEY` to Vercel environment variables
- [ ] Redeployed application after adding key
- [ ] Tested welcome email (create new account)
- [ ] Tested security alert (new device login)
- [ ] Checked Vercel logs for success messages
- [ ] Verified emails arriving in inbox (not spam)
- [ ] (Optional) Verified custom domain in Resend
- [ ] (Optional) Added SPF/DKIM DNS records
- [ ] Set up monitoring/alerts for email delivery

---

## 🚀 Quick Reference

### Environment Variable
```bash
# Add this to Vercel
RESEND_API_KEY=re_123abc456def789ghi012jkl345mno678
```

### Test API Key
```bash
# Test with YOUR email (the one you signed up with)
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"from":"onboarding@resend.dev","to":"YOUR-EMAIL@gmail.com","subject":"Test","text":"Works!"}'

# Note: Without domain verification, you can ONLY send to your own email
# To send to other users, verify ajstudioz.co.in domain first
```

### Check Logs
```bash
# Vercel logs
vercel logs [deployment-url]

# Or in dashboard: Deployments > [deployment] > Logs
# Look for: ✅ email sent successfully
```

### Free Tier Limits
- 100 emails/day
- 3,000 emails/month
- 1 domain verification

---

## 🎉 You're All Set!

Once you've completed these steps, your AJ STUDIOZ application will be able to send:
- Welcome emails to new users
- Security alerts for new logins
- Lookout completion notifications

**Need help?** Check the troubleshooting section above or contact Resend support.

**Next Steps:**
- Set up Vercel Blob for file uploads (see `VERCEL_BLOB_SETUP.md`)
- Configure DNS for apex domain (see `DNS_SETUP_GUIDE.md`)
- Update OAuth callbacks with apex domain

---

*Last Updated: January 2025*
*For: AJ STUDIOZ (meow.ajstudioz.co.in)*
