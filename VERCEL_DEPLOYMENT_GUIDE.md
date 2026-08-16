# 🚀 Deploying Executive Mochi (emochipk) on Vercel

Executive Mochi is a Next.js 16 app with Prisma PostgreSQL, NextAuth, and tRPC. It is 100% compatible with Vercel zero-configuration deployments.

---

## 1. Database Setup (PostgreSQL)

Vercel is serverless, so you need a cloud PostgreSQL database:

| Recommended Provider | Setup URL | Notes |
|----------------------|-----------|-------|
| **Neon** (Recommended) | [neon.tech](https://neon.tech) | Instant serverless Postgres, official Vercel integration, generous free tier |
| **Vercel Postgres** | Vercel Dashboard -> Storage | Built-in single click setup in Vercel |
| **Supabase** | [supabase.com](https://supabase.com) | Enable connection pooling (`pgbouncer` port 6543) |

---

## 2. Deploying on Vercel Dashboard

1. Push your `emochipk` directory to GitHub / GitLab.
2. Go to **[Vercel Dashboard](https://vercel.com/new)** $\rightarrow$ **Import Git Repository**.
3. Select your **`emochipk`** repository.
4. Framework Preset will automatically detect **Next.js**. Keep all default settings:
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` *(runs `prisma generate` via `postinstall` script)*
   - **Output Directory**: `.next`

---

## 3. Environment Variables to Set on Vercel

Under **Project Settings > Environment Variables**, add the following:

### 🔑 Essential Core Variables
```env
# Database connection string (Neon / Supabase / Vercel Postgres)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"

# NextAuth Authentication
AUTH_SECRET="[Generate a random 32-char secret]"
NEXTAUTH_SECRET="[Same secret as AUTH_SECRET]"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Application Brand Config
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
NEXT_PUBLIC_BRAND_NAME="Executive Mochi"
NEXT_PUBLIC_BRAND_PHONE="+92-300-XXXXXXX"
```

### 📦 Image Storage (S3 / Cloudflare R2)
```env
S3_ENDPOINT="https://c678cf5c0fc5ef3806edacc18e6a762d.r2.cloudflarestorage.com"
S3_REGION="auto"
S3_BUCKET_NAME="emochipk"
S3_ACCESS_KEY_ID="[your-r2-access-key-id]"
S3_SECRET_ACCESS_KEY="[your-r2-secret-access-key]"
```

### 🚚 Courier APIs & Payments (Optional / Production)
```env
# Leopards / PostEx / Trax Courier APIs
LEOPARDS_API_KEY=""
POSTEX_API_TOKEN=""
TRAX_USERNAME=""

# Payment Gateways (Safepay / JazzCash)
SAFEPAY_API_KEY=""
JAZZCASH_MERCHANT_ID=""

# Meta Pixel (Facebook Ads CAPI)
META_PIXEL_ID="2488482501579231"
META_CAPI_ACCESS_TOKEN=""
```

---

## 4. Run Prisma Database Schema Push

Once your database is provisioned (e.g. on Neon or Supabase), apply the database migrations/schema from your local machine:

```bash
# In your local emochipk folder:
npx prisma db push
```

Or seed initial admin data:
```bash
npm run db:seed
```

---

## 5. Done! 🎉

Vercel will build the project, run `prisma generate` during `postinstall`, and deploy Executive Mochi globally with automatic SSL certificate management!
