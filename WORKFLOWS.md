# MAE - Workflows

## Development

```bash
# Install dependencies
npm install --ignore-scripts

# Setup database
npx prisma generate
npx prisma db push
node prisma/seed.js

# Run development server
npm run dev
```

## Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Seed admin user
npm run db:seed

# Reset database (hapus + seed ulang)
npm run db:reset
```

## Akun Default

| Role | ID | Sandi |
|------|----|-------|
| Admin | 1 | admin123 |

## Struktur Halaman

### Public (butuh login)
- `/login` - Login dengan ID + sandi
- `/register` - Daftar dengan nama, nama TikTok, sandi

### Member
- `/beranda` - Homepage, profil admin aktif
- `/games` - Daftar mini-game
- `/games/[id]` - Main game
- `/events` - Daftar event
- `/leaderboard` - Papan peringkat bulanan
- `/profile` - Edit profil sendiri
- `/profile/[id]` - Lihat profil orang lain

### Admin
- `/admin/members` - Kelola member, promote/demote
- `/admin/games` - Buat/hapus game
- `/admin/games/[id]/questions` - Kelola pertanyaan
- `/admin/events` - Buat/hapus event
- `/admin/votes` - Vote hapus admin

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/logout` | Member | Logout |
| GET | `/api/games` | Member | List game |
| POST | `/api/games` | Admin | Buat game |
| GET | `/api/games/[id]` | Member | Detail game + soal |
| DELETE | `/api/games/[id]` | Admin | Hapus game |
| GET | `/api/games/[id]/questions` | Admin | List soal |
| POST | `/api/games/[id]/questions` | Admin | Tambah soal |
| DELETE | `/api/games/[id]/questions?questionId=X` | Admin | Hapus soal |
| POST | `/api/games/[id]/submit` | Member | Submit jawaban |
| GET | `/api/events` | Member | List event |
| POST | `/api/events` | Admin | Buat event |
| DELETE | `/api/events/[id]` | Admin | Hapus event |
| GET | `/api/leaderboard` | Member | Data leaderboard |
| GET | `/api/users` | Admin | List semua user |
| GET | `/api/users/[id]` | Member | Detail user |
| PUT | `/api/users/[id]` | Member/Admin | Update profil/role |
| DELETE | `/api/users/[id]` | Admin | Hapus user |
| GET | `/api/votes` | Admin | Status vote |
| POST | `/api/votes` | Admin | Cast vote |

## Mini-Game Types

### Quiz
Admin buat pertanyaan pilihan ganda (A/B/C/D). Member pilih jawaban. Skor = jumlah benar.

### Teka-Teki
Admin buat pertanyaan + clue. Member ketik jawaban. Skor = jumlah benar.

## Leaderboard

- Reset otomatis setiap tanggal 1
- Top 5 sebelum reset masuk profil sebagai achievement bulanan
- Skor dihitung per bulan

## Vote System

- Admin bisa vote untuk menghapus admin lain
- Butuh mayoritas (50% + 1) dari total admin
- Jika terpenuhi, admin di-demote jadi member
- Vote dihapus setelah eksekusi
