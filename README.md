# New Nikhil Electrical — Full-Stack Business Website

Production-ready website for **New Nikhil Electrical** (Tikona Park, Lalganj, Rae Bareli, Uttar
Pradesh) — an electrical shop, repair center, and wholesale supplier. Built with Next.js 15,
TypeScript, Tailwind CSS, Framer Motion, and PostgreSQL (via Prisma ORM).

---

## 1. Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| Backend    | Next.js API Routes (Node.js runtime) |
| Database   | PostgreSQL + Prisma ORM |
| Auth       | Custom JWT session (httpOnly cookie) + bcrypt password hashing |
| File Storage | Vercel Blob (production) / local filesystem (development) |
| Hosting    | Vercel |

---

## 2. Folder Structure

```
new-nikhil-electrical/
├── prisma/
│   ├── schema.prisma          # Database schema (Admin, Service, Product, Gallery, Testimonial, Enquiry)
│   └── seed.ts                # Seeds admin user + real starter content
├── public/
│   ├── images/                # Static images (hero/OG image, README with instructions)
│   ├── manifest.json
│   └── uploads/                # Local-dev-only image upload fallback (gitignored)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, fonts, SEO metadata, JSON-LD
│   │   ├── page.tsx            # Homepage (server component, fetches live DB content)
│   │   ├── globals.css         # Design tokens, theme, utility classes
│   │   ├── sitemap.ts / robots.ts
│   │   ├── loading.tsx / not-found.tsx / global-error.tsx
│   │   ├── api/                # REST API routes
│   │   │   ├── auth/{login,logout,me}/route.ts
│   │   │   ├── gallery/route.ts + [id]/route.ts
│   │   │   ├── services/route.ts + [id]/route.ts
│   │   │   ├── products/route.ts + [id]/route.ts
│   │   │   ├── testimonials/route.ts + [id]/route.ts
│   │   │   ├── enquiries/route.ts + [id]/route.ts
│   │   │   └── upload/route.ts
│   │   └── admin/
│   │       ├── login/page.tsx           # Admin login (public)
│   │       └── (dashboard)/             # Protected route group
│   │           ├── layout.tsx           # Sidebar + mobile nav shell
│   │           ├── page.tsx             # Overview / stats
│   │           ├── gallery/page.tsx
│   │           ├── services/page.tsx
│   │           ├── products/page.tsx
│   │           ├── testimonials/page.tsx
│   │           └── enquiries/page.tsx
│   ├── components/
│   │   ├── layout/              # Navbar, Footer
│   │   ├── home/                # Hero, Services, Products, Gallery, About, Testimonials, Contact, CTA
│   │   ├── shared/               # WhatsAppButton, CallButton
│   │   └── admin/                # Sidebar, Modal, ImageUploader, StatCard
│   ├── lib/
│   │   ├── prisma.ts            # Prisma client singleton
│   │   ├── auth.ts              # Session creation/verification, password hashing
│   │   ├── api-auth.ts          # requireAdmin() guard for API routes
│   │   ├── validation.ts        # Shared zod schemas
│   │   └── utils.ts             # Business constants, WhatsApp link builder, etc.
│   └── middleware.ts            # Protects /admin/* routes at the edge
├── .env.example
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 3. Database Schema (Prisma)

Defined in `prisma/schema.prisma`:

- **Admin** — dashboard login (email, bcrypt password hash, role)
- **GalleryImage** — title, category, imageUrl, altText, featured flag, sort order
- **Service** — title, slug, description, icon (lucide-react name), active flag
- **Product** — name, slug, category, description, priceNote, stock/featured flags
- **Testimonial** — name, location, message, rating (1–5), approval flag
- **Enquiry** — name, phone, message, source, status (`NEW` / `CONTACTED` / `CLOSED`)

All models use `cuid()` IDs and automatic `createdAt` / `updatedAt` timestamps.

---

## 4. Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
AUTH_SECRET="generate with: openssl rand -base64 32"
NEXT_PUBLIC_SITE_URL="https://newnikhilelectrical.com"
BLOB_READ_WRITE_TOKEN=""              # optional locally; required in production for uploads
SEED_ADMIN_EMAIL="admin@newnikhilelectrical.com"
SEED_ADMIN_PASSWORD="ChangeMe@123"    # only used once by the seed script
```

**Getting a free PostgreSQL database** — any of these work well with Prisma + Vercel:
- [Supabase](https://supabase.com) (free tier, includes a Postgres DB)
- [Neon](https://neon.tech) (serverless Postgres, generous free tier)
- [Vercel Postgres](https://vercel.com/storage/postgres)

**Getting Vercel Blob storage token:**
Vercel Dashboard → your project → **Storage** → **Create Database** → **Blob** →
copy the `BLOB_READ_WRITE_TOKEN`.

---

## 5. Installation (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# then edit .env with your real DATABASE_URL and AUTH_SECRET

# 3. Push the schema to your database
npm run db:push

# 4. Seed the database (creates admin login + starter services/products/testimonials)
npm run db:seed

# 5. Start the dev server
npm run dev
```

Visit:
- **Website:** http://localhost:3000
- **Admin login:** http://localhost:3000/admin/login
  - Email: value of `SEED_ADMIN_EMAIL`
  - Password: value of `SEED_ADMIN_PASSWORD`
  - ⚠️ **Change this password immediately** — see Section 8.

---

## 6. Deployment to Vercel

1. **Push this project to a GitHub repository.**

2. **Import into Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new) → Import your GitHub repo.
   - Framework preset: Next.js (auto-detected).

3. **Add Environment Variables** in Vercel → Project → Settings → Environment Variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (your production domain)
   - `BLOB_READ_WRITE_TOKEN` (from Vercel Blob storage)
   - `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` (only needed once for seeding)

4. **Deploy.** Vercel runs `prisma generate && next build` automatically (defined in
   `package.json` → `build` script).

5. **Push the schema & seed the production database** (run locally, pointed at prod `DATABASE_URL`,
   or via Vercel's CLI):
   ```bash
   DATABASE_URL="<production-url>" npm run db:push
   DATABASE_URL="<production-url>" npm run db:seed
   ```

6. **Connect your custom domain** (e.g. `newnikhilelectrical.com`) under
   Vercel → Project → Settings → Domains.

7. **Change the admin password** immediately after first login in production.

---

## 7. Adding Real Business Images

The site ships with clean empty states instead of stock photos — replace them with real photos:

1. **Log in to `/admin`.**
2. **Gallery tab:** upload real photos of the shop front, motor binding workstation,
   completed wiring jobs, and product shelves. Categorize each (Workshop / Motor Binding /
   Wiring / Products / Store).
3. **Products tab:** upload a photo for each wholesale item (wires, switches, MCB, LED
   lights, fans, accessories).
4. **Services tab:** optionally attach an image per service.
5. **Hero/OG image:** replace `public/images/hero/storefront.jpg` with a real 1200×630px shop
   photo (used for social sharing previews) and redeploy.

**Photo tips for a premium look:**
- Shoot in good daylight or with the shop's shutter lighting on.
- Keep the frame tidy — clear the counter of clutter before photographing products.
- Take a few wide shots of the storefront (for the About/Hero sections) and close-ups of
  the motor binding workstation (a strong trust-building visual for this trade).

---

## 8. Security Notes

- Admin sessions use httpOnly, sameSite cookies signed with `AUTH_SECRET` — never commit this
  value or reuse the example secret in production.
- Passwords are hashed with bcrypt (cost factor 12).
- Login and contact-form endpoints are rate-limited per-IP (in-memory; for high-traffic
  production use, swap in Redis/Upstash — see comments in `src/app/api/auth/login/route.ts`
  and `src/app/api/enquiries/route.ts`).
- `/admin/*` routes are protected by `src/middleware.ts` at the edge, in addition to
  per-route `requireAdmin()` checks in API handlers.
- **First thing after deploying:** log into `/admin`, and update the seeded admin
  password (create a new admin via Prisma Studio or a script, then remove/disable the
  seeded one — there is currently no in-app "change password" UI, which is intentional to
  keep the scope focused; ask your developer to add one if needed).

---

## 9. SEO

Configured for local search intent around:
`Electrical shop in Lalganj Rae Bareli`, `Motor binding Lalganj`, `Fan repair Rae Bareli`,
`Electrical wholesale Rae Bareli`.

- `src/app/layout.tsx` sets title templates, meta description, keywords, Open Graph/Twitter
  tags, and JSON-LD `ElectricianAndElectricalStore` structured data with the real address.
- `src/app/sitemap.ts` and `src/app/robots.ts` are generated dynamically.
- Homepage uses ISR (`revalidate = 60`) so admin content updates reflect on the live site
  within a minute without a full redeploy.

---

## 10. Useful Commands

```bash
npm run dev          # Start local dev server
npm run build         # Production build (also runs prisma generate)
npm run start         # Start production server (after build)
npm run db:push       # Push Prisma schema to the database (no migration history)
npm run db:migrate    # Create a tracked migration (recommended once live)
npm run db:seed       # Seed admin user + starter content
npm run db:studio     # Open Prisma Studio (visual DB browser)
npm run lint           # Run ESLint
```

---

## 11. Support / Handover Notes

- All business details (name, address, phone, WhatsApp number, map query) live in one place:
  `src/lib/utils.ts` → `BUSINESS` object. Update there if the phone number or address changes.
- The WhatsApp floating button and all "Enquire Now" links use `whatsappLink()` from the same
  file, pre-filling a relevant message per section/service/product.
- Google Maps embed uses a simple `output=embed` query URL (no API key required) — swap for a
  Places API embed if you want a verified pin later.
