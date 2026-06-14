# neo Frontend — Prompt Sequence untuk Claude Code (Vue 3, responsif)

Tujuan: ubah prototype Claude Design (1 design system + 2 shell: mobile & desktop) menjadi **satu app Vue 3 responsif** yang harmonis mobile↔desktop, siap deploy ke Vercel/Netlify, dan rapi untuk di-handoff ke frontend developer.

> Prasyarat: kamu sudah init repo GitHub + folder lokal kosong, dan Claude Code dijalankan di folder itu.

## Prinsip yang dipegang di SEMUA prompt
```
- Dua prototype = dua RENDERING dari SATU app. Bukan dua app. Rekonsiliasi, jangan jejerkan.
- Prototype = referensi visual. EKSTRAK intent (token, struktur, komponen), TULIS ULANG idiomatik
  di Vue 3 <script setup> + TypeScript. JANGAN copy-paste HTML hasil generate.
- Data dipisah dari UI: TS interfaces + fixture mock + service/store yang bisa ditukar API asli.
  Komponen tidak hardcode data. Fallback desain (Not set / skeleton / empty / error) = state komponen.
- Pakai Context7 (MCP) untuk doc TERKINI sebelum implement: Vue 3, Vue Router, Pinia, Tailwind v4,
  Vite. Jangan mengandalkan ingatan untuk versi/API.
- Stabil saja: Vue 3.x stabil. JANGAN pakai Vapor Mode (3.6, masih alpha).
- Bahasa UI: Inggris semua (konsisten dengan prototype final).
```

---

## Prompt 0 — Scaffold & fondasi proyek
```
Pakai Context7 untuk konfirmasi setup terkini create-vue, Tailwind v4 (@tailwindcss/vite), Pinia, Vue Router.
Scaffold proyek Vue 3 di folder ini dengan create-vue: TypeScript (strict), Vue Router, Pinia, Vitest, ESLint + Prettier.
Lalu:
- Pasang Tailwind v4: `tailwindcss` + `@tailwindcss/vite`, daftarkan plugin di vite.config.ts,
  `@import "tailwindcss";` di src/styles/main.css. JANGAN buat tailwind.config.js (v4 pakai @theme di CSS).
- tsconfig strict; alias `@` → `src`.
- Struktur folder:
  src/{assets,styles,components/{ui,layout},composables,stores,services,types,mocks,views,router}
- Deploy config: vercel.json + netlify.toml dengan SPA fallback (rewrite semua route ke /index.html),
  supaya refresh di route dalam tidak 404.
- Script: dev, build, preview, lint, test.
- Commit awal: "chore: scaffold Vue 3 + Vite + TS + Pinia + Router + Tailwind v4".
Belum bikin halaman dulu — ini hanya fondasi.
```

## Prompt 1 — Design tokens + komponen UI dasar (dari Design System)
```
Fetch design file ini, baca README-nya:
https://api.anthropic.com/v1/design/h/_PZUmdGmIAAdAYCdbwTtPg
Implement aspek design system-nya sebagai FONDASI, bukan menyalin HTML.

1. Terjemahkan token DS ke src/styles/tokens.css memakai blok Tailwind v4 `@theme`:
   warna (brand indigo, primary cyan-blue, amber rating, neutral ramp, surface, state success/warning/danger),
   skala tipografi, spacing (grid 4px), radius, shadow. Ini SATU sumber kebenaran; semua komponen merujuk ke sini.
2. Bangun komponen UI dasar di src/components/ui/ (idiomatik, aksesibel, props bertipe):
   BaseButton (primary/secondary/danger/ghost, disabled), BaseInput, BaseSelect, BaseCard,
   StatusBadge, Avatar (placeholder inisial berwarna saat tanpa gambar), Chip, StarRating,
   Skeleton, EmptyState, ErrorState.
3. Tiap komponen aksesibel: focus ring, aria yang benar, target sentuh ≥44px.
Tulis sedikit unit test sanity dengan Vitest untuk BaseButton & Avatar.
Commit: "feat(ui): design tokens + base components from neo DS".
```

## Prompt 2 — App Shell responsif + routing (REKONSILIASI mobile & desktop)
```
Fetch KEDUA design file ini, baca README masing-masing. Keduanya berisi SEMUA layar (mobile vs desktop):
- Mobile:  https://api.anthropic.com/v1/design/h/9X67_4IjZDPoDdreFx4T1w?open_file=neo+App+Shell.dc.html
- Desktop: https://api.anthropic.com/v1/design/h/KzD9Y_e_f12qR2Tiik93Mg?open_file=neo+Desktop.dc.html
Simpan keduanya sebagai referensi untuk semua halaman berikutnya.

Bangun SATU AppShell responsif (bukan dua) di src/components/layout/:
- Navigasi adalah SATU sumber (daftar route sama). Render berbeda per breakpoint:
  < lg  → BottomNav (dari prototype mobile) + sheet "More" (Precall, Token, Help).
  ≥ lg  → SidebarNav tetap (dari prototype desktop: Dashboard, Coaches, Book A Coach, MyRecords,
           Precall Test, Token, Help, Logout).
- TopBar: logo neo, lonceng (NotificationsPanel), avatar (AccountMenu). Keduanya responsif:
  < lg = bottom sheet; ≥ lg = dropdown. Klik-luar menutup; keyboard accessible.
- Account Menu: Profile, Settings, Logout(danger). Notifications: grup Today/Yesterday, unread dot,
  "Mark all as read". Logout HANYA di Account Menu (jangan dobel).
- Buat composable useBreakpoint() di src/composables/ untuk kasus yang strukturnya beda;
  utamakan responsif via CSS/Tailwind dulu, JS breakpoint hanya bila struktur DOM harus berbeda.
- Vue Router: daftarkan semua route (dashboard, coaches, book, token, records, precall, profile,
  settings, help). Lazy-load view. Coach Schedule = overlay/panel, bukan route halaman penuh.
Commit: "feat(layout): responsive AppShell + router (reconcile mobile/desktop nav)".
```

## Prompt 3 — Data layer (types + mock + store) terpisah dari UI
```
Bangun data layer yang BISA DITUKAR API asli nanti (ini frontend-only):
- src/types/: interface untuk Coach, ScheduleSlot, Session/Appointment, TokenSummary, Transaction,
  TokenType, Profile, NotificationItem, RecordsMetrics.
- src/mocks/: fixture realistis (termasuk kasus kosong/null untuk menguji fallback).
- src/services/: fungsi async (mis. coaches.service.ts) yang sekarang balikkan fixture via Promise,
  tapi berinterface seperti API call asli (mudah diganti fetch/axios).
- src/stores/ (Pinia): coaches, booking, tokens, profile, notifications, records.
- DEFENSIF: tangani null/NaN/array kosong → kembalikan nilai yang men-drive EmptyState/Skeleton/"Not set".
  (Prototype lama menampilkan "NaN" & dump semua bahasa — itu bug data; UI harus tahan banting.)
Commit: "feat(data): typed mock services + Pinia stores (swappable for real API)".
```

## Prompt 4 — Halaman statis (easy): Help, Profile, Settings
```
Implement view Help, Profile, Settings sebagai route, responsif, pakai komponen dasar + store.
Referensi: layout mobile dari prototype mobile, desktop dari prototype desktop (sudah di-fetch).
- Help: accordion (search FAQ, satu item terbuka). ≥lg max-width ~760px di tengah.
- Profile: header card + Personal/Additional Information. Field kosong → "Not set" (italic redup).
  Native Language → chip bahasa terpilih. ≥lg section 2-kolom label–value; <lg stack. Update Profile primary.
- Settings: Change Password (current/new/confirm + show/hide, meter kekuatan, "Passwords match/don't match",
  tombol disable sampai valid). ≥lg kartu max-width 640px, jangan melayang di ruang kosong.
Semua via data layer; ada state loading/empty/error. Commit per fitur.
```

## Prompt 5 — Records & utility: Dashboard, MyRecords, Precall Test
```
Implement view Dashboard, MyRecords, Precall Test, responsif.
- Dashboard: <lg single-column (kartu "Next coaching session" hero + ringkasan minggu + token + CTA Book);
  ≥lg 2-kolom (konten kiri + rail kanan). Hitung mundur sesi; Join disable sampai dekat waktu.
- MyRecords: kartu metrik (≥lg baris 4-kolom, <lg grid 2-kolom stack), chart "Last 4 Weeks" full-width,
  Certificates section. Fallback "—"/skeleton/empty — JANGAN "NaN".
- Precall Test: <lg stack; ≥lg 2-kolom. Tiap test badge status (Not tested/Running/OK/Failed);
  preview kamera + state "No signal / permission blocked"; ringkasan "Readiness X/4".
Commit per fitur.
```

## Prompt 6 — Booking core: Coaches, Book A Coach, Coach Schedule
```
Implement Coaches, Book A Coach, dan Coach Schedule (panel), responsif. Ini bagian tersulit — hati-hati.
- Coaches: <lg filter di bottom sheet + list 1-kolom; ≥lg filter bar horizontal + grid card 3–4 kolom.
  Card fully clickable, Avatar placeholder inisial, sembunyikan lokasi kosong. EmptyState bila tak ada hasil.
- Book A Coach: <lg stack (kalender lalu daftar coach); ≥lg 2-kolom (kalender kiri, coach kanan).
  Mode = segmented (Upcoming/History/Create). Tampilkan timezone user.
- Coach Schedule: SATU komponen panel. <lg = full-screen bottom sheet; ≥lg = slide-in panel kanan + overlay.
  Isi: jadwal mingguan (accordion), grid slot 3-kolom (selected=primary, past/full=disabled),
  label tanggal+timezone, footer sticky (ringkasan slot, Confirm primary, Cancel danger; Confirm disable
  sampai slot dipilih). Picu dari card coach di Coaches & Book.
Commit per fitur.
```

## Prompt 7 — Token (kartu ↔ tabel dari data yang sama)
```
Implement view Token, responsif, dari SATU sumber data transaksi.
- Summary Balance/Used/Refunded: kartu (≥lg baris 3-kolom). Token-type cards: ≥lg baris/grid,
  <lg scroll horizontal.
- Riwayat: SATU dataset, dua presentasi —
  <lg = list TransactionCard (coach + status badge, tanggal•jam, −/+ token berwarna, level, aksi full-width).
  ≥lg = TABEL penuh (#, Coach, Status, Debit, Credit, Date, Time, Certification Level, Recording).
- Filter (status/tanggal/coach): <lg bottom sheet, ≥lg bar inline. EmptyState bila kosong.
Commit: "feat(token): responsive token summary + history (cards <lg, table >=lg)".
```

## Prompt 8 — QA, aksesibilitas, deploy, handoff
```
Pakai Context7 untuk best practice terkini bila perlu.
1. Responsif QA: cek tiap halaman di lebar 390 / 768 / 1280. Tidak ada layout pecah; <lg = mobile, ≥lg = desktop.
2. Aksesibilitas: navigasi keyboard untuk dropdown/sheet/menu, focus trap pada overlay, aria-label,
   kontras AA, target sentuh ≥44px.
3. Performa: lazy-load route, audit bundle (rollup-plugin-visualizer), code-split yang berat.
4. `npm run build` + `npm run preview` harus bersih; perbaiki error TS/ESLint.
5. README.md: cara jalan (dev/build/test), struktur folder, di mana ganti mock→API asli
   (services/ + stores/), token desain di styles/tokens.css, catatan deploy Vercel/Netlify (SPA fallback).
6. Commit + push ke GitHub. Pastikan build lolos di Vercel/Netlify (preview deploy).
```

---

## Catatan & risiko (transparan)
- Versi/tooling **terverifikasi Juni 2026** (create-vue, Pinia, Tailwind v4 config-less). Tetap minta Claude Code cross-check via Context7 saat runtime — ekosistem JS cepat berubah. [High → tapi verifikasi runtime]
- **Bahaya terbesar = dua layout tak harmonis.** Kalau hasil terasa seperti "app mobile" dan "app desktop" terpisah, itu tanda rekonsiliasi gagal — paksa satu sumber nav/data, presentasi per breakpoint.
- **Claude Code mungkin ingin menyalin HTML prototype.** Awasi: minta Vue idiomatik, bukan transpile div.
- **Bug data warisan (NaN, dump bahasa)** bukan tugas frontend untuk "memperbaiki sumbernya" — tapi UI harus defensif (data layer + fallback). Sumbernya urusan backend.
- **Deploy**: tanpa SPA fallback, refresh di route dalam akan 404 di Vercel/Netlify. Sudah dimasukkan di Prompt 0 & 8.
- Aku **belum menguji** seberapa baik Claude Code mem-fetch & menafsirkan file `.dc.html` ini. Kalau hasil ekstraksinya meleset, suplai screenshot per halaman sebagai referensi tambahan. [Medium]
