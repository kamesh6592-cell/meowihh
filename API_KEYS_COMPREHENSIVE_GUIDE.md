# 🔑 AJ STUDIOZ API Keys & Configuration Guide

This document provides a comprehensive overview of all API keys, environment variables, and their purposes in the AJ STUDIOZ project.

## 📋 Table of Contents

- [Core Infrastructure](#core-infrastructure)
- [AI & Language Models](#ai--language-models)
- [Payment Providers](#payment-providers)
- [Authentication Providers](#authentication-providers)
- [Search & Web APIs](#search--web-apis)
- [Maps & Location Services](#maps--location-services)
- [Media & Entertainment](#media--entertainment)
- [Weather & Aviation](#weather--aviation)
- [Email Services](#email-services)
- [Memory & Storage](#memory--storage)
- [Analytics & Monitoring](#analytics--monitoring)
- [Development & Security](#development--security)
- [Public Configuration](#public-configuration)
- [Setup Priority](#setup-priority)

---

## 🏗️ Core Infrastructure

### Database & Storage
| Key | Purpose | Required | Where to Get |
|-----|---------|----------|--------------|
| `DATABASE_URL` | PostgreSQL database connection | ✅ **Critical** | [Neon](https://neon.tech/) \| [Supabase](https://supabase.com/) \| [Vercel Postgres](https://vercel.com/storage/postgres) |
| `REDIS_URL` | Caching & session storage | ⚠️ Optional | [Upstash](https://upstash.com/) \| [Redis Cloud](https://redis.com/cloud/) |
| `BLOB_READ_WRITE_TOKEN` | File storage for images/documents | ⚠️ Optional | [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob) |

### Authentication Core
| Key | Purpose | Required | Where to Get |
|-----|---------|----------|--------------|
| `BETTER_AUTH_SECRET` | Authentication encryption key | ✅ **Critical** | Generate 32+ char random string |
| `BETTER_AUTH_URL` | Base URL for auth callbacks | ✅ **Critical** | Your domain (e.g., `https://yoursite.com`) |

---

## 🤖 AI & Language Models

### Current AI/LLM Providers in AJ STUDIOZ:

**🎯 Default Model**: Gemini 2.5 Flash (Google) - Works with `GOOGLE_GENERATIVE_AI_API_KEY`

#### Free Tier Models (Requires Authentication):
| Model | Provider | Key Required | Features |
|-------|----------|-------------|----------|
| **Qwen 3 4B** | Alibaba via Groq | `GROQ_API_KEY` | Basic reasoning, 16K tokens |
| **Qwen 3 4B Thinking** | Alibaba via Groq | `GROQ_API_KEY` | Enhanced reasoning |
| **GPT-4o Mini** | OpenAI via Azure | `AZURE_API_KEY` | Vision, 16K tokens, Fast |
| **GLM 4.5 Flash** | Zhipu AI | `ZHIPUAI_API_KEY` | Fast inference, 8K tokens |
| **Grok 4 Fast Free** | xAI via Azure | `AZURE_API_KEY` | Vision, reasoning, 16K tokens |
| **GPT-5 Mini Free** | OpenAI via Azure | `AZURE_API_KEY` | Vision, reasoning, PDF, 16K tokens |
| **DeepSeek V3.1 Free** | DeepSeek via Azure | `AZURE_API_KEY` | Reasoning, 2K tokens |

#### Pro Tier Models (Requires Pro Subscription):
| Category | Models | Key Required | Features |
|----------|--------|-------------|----------|
| **Grok (xAI)** | Grok 3 Mini, Grok 3, Grok 4, Grok 4 Fast Thinking | `XAI_API_KEY` or `AZURE_API_KEY` | Vision (Grok 4), reasoning, 16K tokens |
| **GPT (OpenAI)** | GPT-4.1, GPT-5, GPT-5 Mini, GPT-5 Medium, O3, O4 Mini | `OPENAI_API_KEY` or `AZURE_API_KEY` | Vision, reasoning, PDF, 16K tokens |
| **DeepSeek** | R1, R1 Thinking, R1 0528 | `AZURE_API_KEY` | Advanced reasoning, 16K tokens |
| **Mistral** | Medium, Magistral Small, Magistral Medium | `MISTRAL_API_KEY` | Multimodal, vision, PDF, 16K tokens |
| **Qwen** | 3 Max, 3 Max Preview | `HF_TOKEN` (HuggingFace) | Advanced instruct, 10K tokens |
| **GLM (Zhipu)** | 4.5, 4.6, 4.5 Air | `HF_TOKEN` | Long context (130K tokens), reasoning |
| **Kimi (MoonShot AI)** | K2 Latest | `GROQ_API_KEY` | Fast inference, 10K tokens |
| **Cohere** | Command A, Command A Thinking | `COHERE_API_KEY` | Command models, 16K tokens |
| **Coding** | Grok Code, GPT-5 Codex | `XAI_API_KEY` / `OPENAI_API_KEY` | Specialized for coding |

#### Required API Keys:
| Key | Purpose | Priority | Where to Get |
|-----|---------|----------|--------------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini 2.5 Flash (Default) | ✅ **High** | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `AZURE_API_KEY` | Azure OpenAI models | ✅ **High** | [Azure Portal](https://portal.azure.com/) |
| `GROQ_API_KEY` | Fast Llama, Qwen & Kimi models | ⚠️ Recommended | [Groq Console](https://console.groq.com/) |
| `XAI_API_KEY` | Grok models (Pro tier) | ⚠️ Optional | [xAI Console](https://console.x.ai/) |
| `OPENAI_API_KEY` | GPT models (Pro tier) | ⚠️ Optional | [OpenAI Platform](https://platform.openai.com/api-keys) |
| `ANTHROPIC_API_KEY` | Claude models | ⚠️ Optional | [Anthropic Console](https://console.anthropic.com/) |
| `HF_TOKEN` | HuggingFace models | ⚠️ Optional | [HuggingFace](https://huggingface.co/settings/tokens) |
| `ZHIPUAI_API_KEY` | GLM models | ⚠️ Optional | [Zhipu AI](https://api.z.ai/) |
| `MISTRAL_API_KEY` | Mistral models | ⚠️ Optional | [Mistral Console](https://console.mistral.ai/) |
| `COHERE_API_KEY` | Cohere models | ⚠️ Optional | [Cohere Dashboard](https://dashboard.cohere.com/) |
| `ELEVENLABS_API_KEY` | Text-to-speech | ⚠️ Optional | [ElevenLabs](https://elevenlabs.io/) |

**Notes:**
- Default model works with just Google API key
- Azure key provides access to multiple providers (OpenAI, DeepSeek, Grok)
- Free tier models require user authentication
- Pro tier models require active Pro subscription
- Vision/PDF support varies by model (check table above)

---

## 💳 Payment Providers

### Cashfree (Primary - Indian Payments)
| Key | Purpose | Required | Where to Get |
|-----|---------|----------|--------------|
| `CASHFREE_APP_ID` | Cashfree application ID | ✅ **Critical** | [Cashfree Dashboard](https://merchant.cashfree.com/) → API Keys |
| `CASHFREE_SECRET_KEY` | Cashfree secret key | ✅ **Critical** | [Cashfree Dashboard](https://merchant.cashfree.com/) → API Keys |
| `CASHFREE_WEBHOOK_SECRET` | Webhook signature verification | ✅ **Critical** | [Cashfree Dashboard](https://merchant.cashfree.com/) → Webhooks |

### DodoPayments (Fallback - Indian Payments)
| Key | Purpose | Required | Where to Get |
|-----|---------|----------|--------------|
| `DODO_PAYMENTS_API_KEY` | DodoPayments API access | ✅ **Critical** | [DodoPayments Dashboard](https://dodopayments.com/) → API Keys |
| `DODO_PAYMENTS_WEBHOOK_SECRET` | Webhook signature verification | ✅ **Critical** | [DodoPayments Dashboard](https://dodopayments.com/) → Webhooks |

### Polar (Deprecated - Removed)
| Key | Purpose | Required | Where to Get |
|-----|---------|----------|--------------|
| `POLAR_ACCESS_TOKEN` | ❌ **Removed** | ❌ No | Previously Polar.sh |
| `POLAR_WEBHOOK_SECRET` | ❌ **Removed** | ❌ No | Previously Polar.sh |

---

## 🔐 Authentication Providers

| Key | Purpose | Required | Where to Get |
|-----|---------|----------|--------------|
| `GITHUB_CLIENT_ID` | GitHub OAuth login | ⚠️ Optional | [GitHub Developer Settings](https://github.com/settings/developers) |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret | ⚠️ Optional | [GitHub Developer Settings](https://github.com/settings/developers) |
| `GOOGLE_CLIENT_ID` | Google OAuth login | ⚠️ Optional | [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | ⚠️ Optional | [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials |
| `TWITTER_CLIENT_ID` | Twitter/X OAuth login | ⚠️ Optional | [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard) |
| `TWITTER_CLIENT_SECRET` | Twitter/X OAuth secret | ⚠️ Optional | [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard) |
| `MICROSOFT_CLIENT_ID` | Microsoft OAuth login | ⚠️ Optional | [Azure Portal](https://portal.azure.com/) → App registrations |
| `MICROSOFT_CLIENT_SECRET` | Microsoft OAuth secret | ⚠️ Optional | [Azure Portal](https://portal.azure.com/) → App registrations |

---

## 🔍 Search & Web APIs

| Key | Purpose | Required | Where to Get |
|-----|---------|----------|--------------|
| `TAVILY_API_KEY` | Real-time web search | ⚠️ Optional | [Tavily API](https://tavily.com/) |
| `EXA_API_KEY` | Semantic web search | ⚠️ Optional | [Exa Search](https://exa.ai/) |
| `FIRECRAWL_API_KEY` | Web scraping & crawling | ⚠️ Optional | [Firecrawl](https://firecrawl.dev/) |

---

## 🗺️ Maps & Location Services

| Key | Purpose | Required | Where to Get |
|-----|---------|----------|--------------|
| `GOOGLE_MAPS_API_KEY` | Maps integration | ⚠️ Optional | [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Google Maps API |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Client-side maps | ⚠️ Optional | Same as above (public version) |
| `MAPBOX_ACCESS_TOKEN` | Alternative maps provider | ⚠️ Optional | [Mapbox Account](https://www.mapbox.com/) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Client-side Mapbox | ⚠️ Optional | Same as above (public version) |
| `TRIPADVISOR_API_KEY` | Travel & location data | ⚠️ Optional | [TripAdvisor Developer](https://developer-tripadvisor.com/) |

---

## 🎬 Media & Entertainment

| Key | Purpose | Required | Where to Get |
|-----|---------|----------|--------------|
| `TMDB_API_KEY` | Movie & TV show data | ⚠️ Optional | [The Movie Database](https://www.themoviedb.org/settings/api) |
| `YT_ENDPOINT` | YouTube API endpoint | ⚠️ Optional | [Google Developers Console](https://console.developers.google.com/) → YouTube Data API |

---

## 🌤️ Weather & Aviation

| Key | Purpose | Required | Where to Get |
|-----|---------|----------|--------------|
| `OPENWEATHER_API_KEY` | Weather data & forecasts | ⚠️ Optional | [OpenWeather API](https://openweathermap.org/api) |
| `AVIATION_STACK_API_KEY` | Flight tracking data | ⚠️ Optional | [Aviation Stack](https://aviationstack.com/) |

---

## 📧 Email Services

| Key | Purpose | Required | Where to Get |
|-----|---------|----------|--------------|
| `RESEND_API_KEY` | Email notifications & order confirmations | ✅ **Critical** | [Resend Dashboard](https://resend.com/api-keys) |

---

## 🧠 Memory & Storage

| Key | Purpose | Required | Where to Get |
|-----|---------|----------|--------------|
| `SUPERMEMORY_API_KEY` | AI memory & context storage | ⚠️ Optional | [SuperMemory](https://supermemory.ai/) |
| `SMITHERY_API_KEY` | MCP server management | ⚠️ Optional | [Smithery](https://smithery.ai/) |

---

## 📊 Analytics & Monitoring

| Key | Purpose | Required | Where to Get |
|-----|---------|----------|--------------|
| `NEXT_PUBLIC_POSTHOG_KEY` | User analytics & tracking | ⚠️ Optional | [PostHog Dashboard](https://posthog.com/) |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog instance URL | ⚠️ Optional | PostHog cloud or self-hosted instance |

---

## 🔧 Development & Security

| Key | Purpose | Required | Where to Get |
|-----|---------|----------|--------------|
| `DAYTONA_API_KEY` | Development environment | ⚠️ Optional | [Daytona](https://daytona.io/) |
| `CRON_SECRET` | Secure cron job endpoints | ⚠️ Optional | Generate random string for security |

---

## 🌐 Public Configuration

These are client-side environment variables (visible in browser):

| Key | Purpose | Required | Value |
|-----|---------|----------|-------|
| `NEXT_PUBLIC_APP_URL` | Application base URL | ✅ **Critical** | `https://yourdomain.com` |
| `NEXT_PUBLIC_PREMIUM_TIER` | DodoPayments product ID | ✅ **Critical** | `aj_studioz_pro_dodo` |
| `NEXT_PUBLIC_PREMIUM_SLUG` | DodoPayments product slug | ✅ **Critical** | `pro-plan-dodo` |
| `NEXT_PUBLIC_CASHFREE_PRODUCT_ID` | Cashfree product identifier | ✅ **Critical** | `aj_studioz_pro_1299` |

---

## 🚀 Setup Priority

### 1. Essential (Project Won't Work Without These)
```bash
# Core Infrastructure
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your_32_character_random_string
BETTER_AUTH_URL=https://yourdomain.com

# Payment System
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
DODO_PAYMENTS_API_KEY=your_dodo_payments_key

# Email Notifications
RESEND_API_KEY=your_resend_api_key

# Public Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_PREMIUM_TIER=aj_studioz_pro_dodo
NEXT_PUBLIC_PREMIUM_SLUG=pro-plan-dodo
NEXT_PUBLIC_CASHFREE_PRODUCT_ID=aj_studioz_pro_1299
```

### 2. Important (Enhanced Features)
```bash
# OAuth Authentication
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Webhook Security
CASHFREE_WEBHOOK_SECRET=your_cashfree_webhook_secret
DODO_PAYMENTS_WEBHOOK_SECRET=your_dodo_webhook_secret
```

### 3. Optional (Additional Features)
```bash
# AI Models (Choose based on your needs)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GROQ_API_KEY=gsk_...

# Maps & Location
GOOGLE_MAPS_API_KEY=AIza...
NEXT_PUBLIC_MAPBOX_TOKEN=pk.ey...

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## 🔗 Quick Setup Links

### Payment Providers
- **Cashfree**: [merchant.cashfree.com](https://merchant.cashfree.com/) → Create account → Get API keys
- **DodoPayments**: [dodopayments.com](https://dodopayments.com/) → Dashboard → API Keys
- **Resend**: [resend.com](https://resend.com/) → API Keys

### Database & Infrastructure  
- **Neon (Recommended)**: [neon.tech](https://neon.tech/) → Create PostgreSQL database
- **Vercel Postgres**: [vercel.com/storage/postgres](https://vercel.com/storage/postgres)
- **Upstash Redis**: [upstash.com](https://upstash.com/) → Redis

### AI Providers
- **OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com/)
- **Groq**: [console.groq.com](https://console.groq.com/)

### OAuth Setup
- **GitHub**: [github.com/settings/developers](https://github.com/settings/developers) → New OAuth App
- **Google**: [console.cloud.google.com](https://console.cloud.google.com/) → APIs & Services → Credentials

---

## ⚠️ Security Notes

1. **Never commit API keys** to version control
2. **Use different keys** for development and production
3. **Regularly rotate** sensitive API keys
4. **Set up environment-specific** webhook URLs
5. **Use webhook secrets** for signature verification
6. **Monitor API usage** and set up billing alerts

---

## 📝 Environment Files

### Local Development (`.env.local`)
```bash
# Copy .env.local template and fill in your keys
cp .env.local.example .env.local
```

### Production (Vercel Dashboard)
```bash
# Add each key in Vercel → Project Settings → Environment Variables
# Separate values for Development, Preview, and Production
```

---

## 🆘 Getting Help

If you need help getting any of these API keys:

1. **Payment Issues**: Check [PAYMENT_SETUP.md](./PAYMENT_SETUP.md)
2. **Email Setup**: Check [RESEND_EMAIL_SETUP.md](./RESEND_EMAIL_SETUP.md)
3. **Database**: Check [database setup guides](./DATABASE_SETUP.md)
4. **Quick Reference**: Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

---

## 📈 Current Implementation Status

✅ **Working**: Cashfree, DodoPayments, Email notifications, Database, Authentication  
🔄 **In Development**: AI integrations, Advanced search features  
⏳ **Planned**: Analytics dashboard, Memory features, Advanced maps

---

*Last Updated: November 14, 2025*  
*Project: AJ STUDIOZ - AI-Powered Search Platform*