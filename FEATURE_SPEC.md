# MAE - Manga Anime Edits - Feature Specification

## Overview
Web application dengan sistem mini-games, events, leaderboard, dan role-based access control (Admin & Member).

---

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite + Prisma ORM
- **Auth**: JWT (jose) + cookies
- **Styling**: Tailwind CSS v4
- **Validation**: Zod
- **Password Hashing**: bcryptjs

---

## Roles

### Admin
- Melihat semua member (profil + skor)
- Menghapus atau menjadikan member sebagai admin
- Menghapus akun admin lain dengan **vote mayoritas (50%+1)**
- Menambah, mengedit, menghapus **mini-game** dan **pertanyaan**
- Menambah, mengedit, menghapus **event**

### Member
- Menyelesaikan mini-game dan mendapatkan skor
- Melihat event yang ditambahkan admin
- Melihat profil member lain
- Mengedit profil sendiri

---

## Database Schema (Prisma + SQLite)

### User
| Field | Type | Description |
|-------|------|-------------|
| id | Int (auto-increment) | ID unik, digunakan untuk login |
| name | String | Nama user |
| tiktokName | String | Nama TikTok |
| password | String | Password (hashed) |
| bio | String? | Bio profil |
| profilePhoto | String? | Path foto profil |
| tiktokLink | String? | Link akun TikTok |
| role | Enum (ADMIN, MEMBER) | Role user |
| createdAt | DateTime | Tanggal registrasi |

### Game
| Field | Type | Description |
|-------|------|-------------|
| id | Int | ID game |
| title | String | Judul game |
| type | Enum (QUIZ, TEKATEKI) | Tipe game |
| createdBy | Int | ID admin pembuat |
| createdAt | DateTime | Tanggal dibuat |

### Question
| Field | Type | Description |
|-------|------|-------------|
| id | Int | ID pertanyaan |
| gameId | Int | Relasi ke Game |
| questionText | String | Teks pertanyaan |
| options | JSON | Array pilihan jawaban (untuk quiz) |
| correctAnswer | String | Jawaban yang benar |
| clue | String? | Clue/hint (untuk tekateki) |

### Score
| Field | Type | Description |
|-------|------|-------------|
| id | Int | ID score |
| userId | Int | Relasi ke User |
| gameId | Int | Relasi ke Game |
| score | Int | Skor yang didapat |
| completedAt | DateTime | Tanggal selesai |

### Event
| Field | Type | Description |
|-------|------|-------------|
| id | Int | ID event |
| title | String | Judul event |
| image | String? | Gambar event |
| description | String | Deskripsi event |
| startDate | DateTime | Tanggal mulai |
| endDate | DateTime | Tanggal selesai |
| createdBy | Int | ID admin pembuat |

### Vote
| Field | Type | Description |
|-------|------|-------------|
| id | Int | ID vote |
| voterId | Int | ID admin yang vote |
| targetAdminId | Int | ID admin yang di-vote untuk dihapus |
| createdAt | DateTime | Tanggal vote |

### Achievement
| Field | Type | Description |
|-------|------|-------------|
| id | Int | ID achievement |
| userId | Int | Relasi ke User |
| month | Int | Bulan (1-12) |
| year | Int | Tahun |
| position | Int | Posisi di leaderboard (1-5) |

---

## Halaman & Route

### Auth Pages

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/register` | Register | Form: nama, nama tiktok, sandi. Menampilkan ID setelah registrasi berhasil |
| `/login` | Login | Form: ID, sandi |

### Member Pages

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/beranda` | Beranda | Homepage - menampilkan semua profil admin yang aktif |
| `/games` | Games | Daftar semua mini-game yang tersedia |
| `/games/[id]` | Play Game | Halaman bermain game - jawab pertanyaan, dapat skor |
| `/events` | Events | Daftar event dengan judul, gambar, deskripsi, periode |
| `/leaderboard` | Leaderboard | Peringkat skor, auto-reset setiap tanggal 1 |
| `/profile` | Profil Saya | Lihat/edit profil sendiri |
| `/profile/[id]` | Profil User | Lihat profil member lain |

### Admin Pages

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/admin/members` | Kelola Member | Lihat semua member (profil + skor), promote/demote admin |
| `/admin/games` | Kelola Game | Buat/edit/hapus game |
| `/admin/games/[id]/questions` | Kelola Pertanyaan | Tambah/edit/hapus pertanyaan untuk game |
| `/admin/events` | Kelola Event | Buat/edit/hapus event |
| `/admin/votes` | Vote System | Vote untuk menghapus admin (butuh mayoritas 50%+1) |

---

## API Routes

### Auth
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Games
- `GET /api/games` - List semua game
- `POST /api/games` - Buat game baru (admin)
- `GET /api/games/[id]` - Detail game
- `PUT /api/games/[id]` - Edit game (admin)
- `DELETE /api/games/[id]` - Hapus game (admin)

### Questions
- `GET /api/games/[id]/questions` - List pertanyaan game
- `POST /api/games/[id]/questions` - Tambah pertanyaan (admin)
- `PUT /api/questions/[id]` - Edit pertanyaan (admin)
- `DELETE /api/questions/[id]` - Hapus pertanyaan (admin)

### Game Submit
- `POST /api/games/[id]/submit` - Submit jawaban, hitung skor

### Events
- `GET /api/events` - List event
- `POST /api/events` - Buat event baru (admin)
- `GET /api/events/[id]` - Detail event
- `PUT /api/events/[id]` - Edit event (admin)
- `DELETE /api/events/[id]` - Hapus event (admin)

### Leaderboard
- `GET /api/leaderboard` - Ambil data leaderboard
- Logic auto-reset: cek jika tanggal 1 dan belum reset bulan ini → reset

### Users
- `GET /api/users` - List semua member (admin)
- `GET /api/users/[id]` - Detail profil user
- `PUT /api/users/[id]` - Update profil sendiri

### Votes
- `GET /api/votes` - Status vote saat ini
- `POST /api/votes` - Cast vote untuk hapus admin

---

## Fitur Khusus

### Navbar
- Setiap halaman memiliki navbar
- Bagian atas navbar: **"MAE - Manga Anime Edits"**
- Link navigasi berdasarkan role (admin vs member)

### Leaderboard Auto-Reset
- Reset otomatis setiap tanggal 1 tiap bulan
- Top 5 sebelum reset → masuk ke profil sebagai **Achievement Bulanan**

### Mini-Game Types
1. **Quiz (Pilihan Ganda)**: Pertanyaan dengan opsi A/B/C/D, admin tentukan jawaban benar
2. **Teka-Teki (Tebak Kata)**: Clue diberikan, user menebak kata

### Vote System
- Admin bisa vote untuk menghapus admin lain
- Butuh **mayoritas (50%+1)** dari total admin untuk menyetujui
- Jika vote terpenuhi → admin tersebut di-demote menjadi member

### Profil
- Foto profil, nama, bio, nama TikTok, link TikTok, ID
- Achievement bulanan (jika masuk top 5)

---

## File Structure

```
app/
├── layout.tsx
├── page.tsx
├── globals.css
├── favicon.ico
├── components/
│   ├── Navbar.tsx
│   ├── GameCard.tsx
│   ├── EventCard.tsx
│   ├── ProfileCard.tsx
│   └── LeaderboardTable.tsx
├── actions/
│   ├── auth.ts
│   ├── games.ts
│   ├── events.ts
│   └── users.ts
├── lib/
│   ├── session.ts
│   ├── dal.ts
│   ├── db.ts
│   └── definitions.ts
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── beranda/page.tsx
├── games/
│   ├── page.tsx
│   └── [id]/page.tsx
├── events/page.tsx
├── leaderboard/page.tsx
├── profile/
│   ├── page.tsx
│   └── [id]/page.tsx
├── admin/
│   ├── members/page.tsx
│   ├── games/
│   │   ├── page.tsx
│   │   └── [id]/questions/page.tsx
│   ├── events/page.tsx
│   └── votes/page.tsx
├── api/
│   ├── auth/
│   │   ├── register/route.ts
│   │   ├── login/route.ts
│   │   └── logout/route.ts
│   ├── games/
│   │   ├── route.ts
│   │   └── [id]/
│   │       ├── route.ts
│   │       ├── questions/route.ts
│   │       └── submit/route.ts
│   ├── events/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── leaderboard/route.ts
│   ├── users/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── votes/route.ts
prisma/
├── schema.prisma
└── seed.ts
public/
├── icon.png
└── uploads/
middleware.ts
```
