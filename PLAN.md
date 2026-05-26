# Plan: Full Migrasi ke Supabase (DB + Auth + Storage)

## Kenapa

SQLite (`file:./dev.db`) tidak persistent di Vercel (serverless, read-only). Data hilang tiap deploy. Migrasi ke Supabase sekaligus menyelesaikan: database persistent, file storage persistent, dan auth yang lebih aman.

---

## Current State → Target State

| Layer | Saat Ini | Setelah |
|---|---|---|
| Database | SQLite `file:./dev.db` via Prisma | Supabase PostgreSQL via Prisma |
| Auth | Custom JWT (`jose` + `bcryptjs`), login numeric ID + password | Supabase Auth, login **username/email + password** |
| Storage | Local `public/uploads/` | Supabase Storage (`avatars` bucket) |
| Session | Custom cookie (jose SignJWT, 7 hari) | Supabase managed session |

---

## Login UX

**Form:** satu input "Username atau Email" + input "Password"

**Logic:**
- Input mengandung `@` → treat as email → authenticate langsung via Supabase Auth
- Input tanpa `@` → treat as username → lookup `email` di tabel User → authenticate via Supabase Auth
- Register: butuh **username + email + password** (email wajib untuk Supabase Auth)

---

## Schema Changes

### User Model

```prisma
model User {
  id            String   @id        // UUID dari Supabase Auth (was: Int autoincrement)
  username      String   @unique    // BARU — untuk login & display
  email         String   @unique    // BARU — dari Supabase Auth
  name          String
  tiktokName    String
  // password DIHAPUS — ditangani Supabase Auth
  bio           String?
  profilePhoto  String?
  tiktokLink    String?
  role          String   @default("MEMBER")
  createdAt     DateTime @default(now())

  scores        Score[]
  achievements  Achievement[]
  createdGames  Game[]         @relation("GameCreator")
  createdEvents Event[]        @relation("EventCreator")
  votesGiven    Vote[]         @relation("Voter")
  votesReceived Vote[]         @relation("Target")
}
```

### Foreign Key Changes (Int → String/UUID)

| Model | Field | Lama | Baru |
|---|---|---|---|
| Score | `userId` | `Int` | `String` |
| Game | `createdByUser` | `Int` | `String` |
| Event | `createdByUser` | `Int` | `String` |
| Vote | `voterId` | `Int` | `String` |
| Vote | `targetAdminId` | `Int` | `String` |
| Achievement | `userId` | `Int` | `String` |

### Prisma Datasource

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## Execution Steps

### Phase 1: Setup Supabase (~10 menit)

1. Buat project di https://supabase.com
2. Dapatkan:
   - `NEXT_PUBLIC_SUPABASE_URL` — Settings → API → Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Settings → API → anon public
   - `DATABASE_URL` — Settings → Database → Connection string (Transaction mode, port 6543)
3. Supabase Dashboard → Authentication → Settings:
   - **Disable** "Enable email confirmations" (biar register langsung bisa login)
4. Supabase Dashboard → Storage → Create bucket `avatars` (public)

### Phase 2: Install Dependencies (~2 menit)

```bash
npm install @supabase/supabase-js @supabase/ssr
```

(nanti hapus `jose` dan `bcryptjs` setelah migrasi selesai)

### Phase 3: Supabase Client Setup (~5 menit)

**File baru: `app/lib/supabase/server.ts`**
- Server-side Supabase client pakai `@supabase/ssr`
- Baca cookies untuk session

**File baru: `app/lib/supabase/client.ts`**
- Client-side Supabase client (untuk components)

### Phase 4: Update Prisma Schema (~10 menit)

1. Update `prisma/schema.prisma`:
   - Provider: `sqlite` → `postgresql`
   - User.id: `Int @id @default(autoincrement())` → `String @id`
   - Tambah `username String @unique`
   - Tambah `email String @unique`
   - Hapus `password`
   - Update semua FK dari `Int` → `String`
2. Push schema ke Supabase:
   ```bash
   npx prisma db push
   ```

### Phase 5: Rewrite Auth System (~20 menit)

**Hapus:** `app/lib/session.ts` (custom JWT)

**Rewrite `app/lib/dal.ts`:**
```ts
export const getUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) { redirect('/login'); return }

  const profile = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { ... }
  })
  return profile
})
```

**Rewrite `app/actions/auth.ts`:**

- `register(state, formData)`:
  - Validasi: username, email, name, tiktokName, password
  - `supabase.auth.signUp({ email, password })`
  - `prisma.user.create({ id: authUser.id, username, email, name, tiktokName, ... })`
  - Return success

- `login(state, formData)`:
  - Ambil input "usernameOrEmail" + "password"
  - Jika mengandung `@` → email langsung
  - Jika tidak → `prisma.user.findUnique({ where: { username } })` → ambil email
  - `supabase.auth.signInWithPassword({ email, password })`
  - Redirect ke `/beranda`

- `logout()`:
  - `supabase.auth.signOut()`
  - Redirect ke `/login`

**Rewrite `app/api/auth/logout/route.ts`:**
- Pakai `supabase.auth.signOut()` (bukan manual deleteSession)

### Phase 6: Update Login & Register Pages (~10 menit)

**Login page (`app/login/page.tsx`):**
- Input "ID" → input "Username atau Email" (`name="usernameOrEmail"`)
- Update labels, placeholder

**Register page (`app/register/page.tsx`):**
- Tambah input "Email" (`name="email"`, `type="email"`)
- Hapus tampilan "ID Kamu" setelah register (ganti: "Cek email untuk verifikasi" atau "Akun berhasil dibuat!")
- Update labels

### Phase 7: Upload → Supabase Storage (~10 menit)

**Rewrite `app/api/upload/route.ts`:**
```ts
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  const ext = path.extname(file.name) || '.jpg'
  const filePath = `${user.id}/${Date.now()}${ext}`

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { contentType: file.type, upsert: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
  return NextResponse.json({ url: publicUrl })
}
```

**Hapus:** `public/uploads/` dari git

### Phase 8: Update next.config.ts (~2 menit)

Tambah domain Supabase Storage ke allowed image domains (kalau pakai `next/image`):
```ts
images: {
  remotePatterns: [
    { hostname: '*.supabase.co' }
  ]
}
```

### Phase 9: Data Migration (~15 menit)

**Tulis script `scripts/migrate-to-supabase.ts`:**

1. Baca semua data dari SQLite (via Prisma lama)
2. Untuk setiap user:
   - Buat Supabase Auth user: `supabase.auth.admin.createUser({ email: '${username}@mae.local', password: temporaryPassword, email_confirm: true })`
   - Simpan mapping: `{ oldId: Int, newId: UUID }`
3. Insert users ke Supabase PostgreSQL dengan UUID baru
4. Insert games, questions, scores, events, votes, achievements dengan FK yang sudah di-map
5. Simpan mapping ke file (untuk referensi)

**Catatan:** Password existing TIDAK bisa dimigrasi. User perlu:
- Reset password via "Lupa Password" (kalau diaktifkan)
- Atau admin set temporary password dan user ganti sendiri

### Phase 10: Cleanup (~5 menit)

**Hapus:**
- `prisma/dev.db` — `git rm`
- `public/uploads/` — `git rm`
- `app/lib/session.ts` — hapus (tidak perlu lagi)
- `scripts/migrate-to-supabase.ts` — hapus setelah migrasi selesai

**Dependencies:**
```bash
npm uninstall jose bcryptjs
```

### Phase 11: Environment Variables (~3 menit)

`.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

Vercel → Settings → Environment Variables (Production, Preview, Development):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`

### Phase 12: Testing (~10 menit)

1. `npm run build` — pastikan kompilasi aman
2. Deploy ke Vercel
3. Test flow:
   - Register akun baru (username + email + password)
   - Login dengan username
   - Login dengan email
   - Upload foto profil
   - Play game, cek score di leaderboard
   - Admin: create game, create event

---

## Risks & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Password tidak bisa dimigrasi | Admin set temporary password, atau user register ulang |
| User.id Int→UUID bikin FK error | Migration script handle mapping dengan benar |
| Supabase free tier limit (500MB DB, 1GB storage) | Cukup untuk community app ini |
| Email confirmation mengganggu flow | Disable di Supabase Auth settings |
| `username@mae.local` sebagai placeholder email | Bisa login, tapi tidak bisa reset password via email |

---

## Summary File Changes

| File | Action |
|---|---|
| `prisma/schema.prisma` | Rewrite — postgresql, UUID, hapus password, tambah username+email |
| `prisma/dev.db` | Hapus |
| `app/lib/supabase/server.ts` | Baru |
| `app/lib/supabase/client.ts` | Baru |
| `app/lib/session.ts` | Hapus |
| `app/lib/dal.ts` | Rewrite — pakai Supabase session |
| `app/lib/db.ts` | Minor update (tetap Prisma, ganti datasource) |
| `app/lib/definitions.ts` | Update tipe userId → string |
| `app/actions/auth.ts` | Rewrite — Supabase Auth |
| `app/api/auth/logout/route.ts` | Rewrite — Supabase signOut |
| `app/api/upload/route.ts` | Rewrite — Supabase Storage |
| `app/api/users/[id]/route.ts` | Update userId type |
| `app/login/page.tsx` | Ganti input ID → username/email |
| `app/register/page.tsx` | Tambah email field |
| `app/components/ProfileAvatarUpload.tsx` | Minor (upload logic di API) |
| `app/components/Navbar.tsx` | Minor |
| `next.config.ts` | Tambah Supabase Storage domain |
| `public/uploads/` | Hapus |
| `scripts/migrate-to-supabase.ts` | Baru (hapus setelah migrasi) |
