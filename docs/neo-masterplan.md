# neo — Masterplan End-to-End

Peta tunggal dari nol sampai produk. Menyatukan 4 prompt pack yang sudah ada + menandai apa yang BELUM direncanakan. Posisi kamu sekarang: **akhir Fase 3, mulai Fase 4.**

---

## Batas scope (baca dulu — ini menentukan ekspektasi)

```
"End-to-end" yang SUDAH terencana = pipeline DESAIN → FRONTEND TER-DEPLOY (staging).
Itu BUKAN produk produksi penuh. Untuk jadi produk nyata, butuh fase yang BELUM kita rencanakan:
autentikasi, backend/API + data asli, QA sungguhan, analytics/monitoring, dan launch.
Masterplan ini menandai keduanya — jangan kira "deploy ke Vercel = selesai".
```

In-scope (sudah detail): Design System, Prototype Mobile, Prototype Desktop, Frontend Vue, Deploy staging.
Out-of-scope (ditandai sebagai gap, belum detail): Auth, Backend/API, data asli, QA mendalam, i18n, monitoring, launch.

---

## Peta fase & ketergantungan

```
[F0] Fondasi brand & keputusan
        │  (GATE 0: brand atoms dikonfirmasi klien)
        ▼
[F1] Design System ──────────── pack: neo-design-system-spec.md
        │  (GATE 1: DS disetujui & Set as default)
        ▼
[F2] Prototype Mobile ───────── pack: neo-mobile-prompt-pack.md
        │
        ▼
[F3] Prototype Desktop ──────── pack: neo-desktop-prompt-pack.md
        │  (GATE 2: shell mobile+desktop + semua layar disetujui)        ◄── KAMU DI SINI
        ▼
[F4] Frontend Vue ───────────── pack: neo-frontend-vue-prompt-pack.md
        │  (GATE 3: fondasi—token/komponen/shell/data—di-review sebelum lanjut ke halaman)
        ▼
[F5] Deploy staging (Vercel/Netlify)
        │  (GATE 4: kontrak API disepakati dengan backend)
        ▼
[F6] PRODUKSI (BELUM direncanakan): Auth ▸ Backend/API ▸ data asli ▸ QA ▸ launch ▸ iterate
```

Jalur kritis: F0→F1→F3 berurutan ketat (tidak bisa dilompati). **Bisa paralel:** kontrak API & desain Auth bisa digarap backend/tim lain SELAGI F4 jalan pakai mock.

---

## Fase per fase

### F0 — Fondasi brand & keputusan
- **Tujuan:** kunci yang tidak boleh berubah, putuskan yang ambigu.
- **GATE 0 (mungkin masih terbuka):** ambil hex warna PERSIS + file logo + font dari CSS/brand guide klien — bukan hasil ukur dari screenshot. Kalau ini dilewati, semua fase mewarisi warna yang *mirip*, bukan *persis*. [Tutup utang ini sebelum produksi.]
- **Selesai bila:** brand atoms terverifikasi tertulis; mandat jelas ("warna+logo dikunci, sisanya boleh diperbaiki").

### F1 — Design System  ·  `neo-design-system-spec.md`
- **Alat:** Claude Design → Create new design system (mode manual, JANGAN auto-ekstrak situs lama).
- **Isi:** token (warna terkunci + neutral ramp + semantic roles), tipografi, spacing, radius, elevation, komponen, states.
- **GATE 1:** DS direview, di-Set as default.
- **Selesai bila:** DS jadi sumber kebenaran tunggal; semua prototype merujuknya.

### F2 — Prototype Mobile  ·  `neo-mobile-prompt-pack.md`
- **Alat:** Claude Design, satu prototype interaktif, mobile 390px.
- **Isi:** App shell (bottom nav) + 9 halaman + Account Menu + Notifications, urut mudah→sulit.
- **Selesai bila:** semua layar mobile + navigasi antar-tab berfungsi & konsisten dengan DS.

### F3 — Prototype Desktop  ·  `neo-desktop-prompt-pack.md`  ◄ KAMU DI SINI
- **Alat:** Claude Design, shell desktop terpisah (tool terkunci di frame 390px → desktop perlu file sendiri).
- **Isi:** reverse transform (sidebar, multi-kolom, tabel kembali, slide-in panel) memakai komponen yang sama.
- **GATE 2:** mobile + desktop + semua layar (incl. Profile/Settings/Account/Notifications) disetujui & UI English semua.
- **Selesai bila:** dua prototype lengkap & setara secara fitur, siap jadi referensi slicing.

### F4 — Frontend Vue  ·  `neo-frontend-vue-prompt-pack.md`
- **Alat:** Claude Code (Vite + Vue 3 + TS + Pinia + Router + Tailwind v4), Context7 untuk doc terkini.
- **Urutan:** scaffold → token+komponen dasar → **shell responsif (rekonsiliasi 2 prototype)** → data layer → halaman (easy→hard) → QA/deploy.
- **GATE 3:** setelah Prompt 0–3, REVIEW fondasi (token, komponen, shell responsif, data layer) SEBELUM bikin halaman. Kalau shell jadi "dua app", ulang — jangan lanjut.
- **Selesai bila:** semua halaman responsif harmonis (satu sumber nav & data), build bersih, commit per langkah.

### F5 — Deploy staging
- **Alat:** Vercel/Netlify (SPA fallback wajib, sudah di pack).
- **Selesai bila:** preview deploy hidup; refresh di route dalam tidak 404; developer bisa akses repo + README handoff.

### F6 — PRODUKSI (belum direncanakan — ditandai)
- Auth/login & session • kontrak API + integrasi data asli (ganti mock di `services/`+`stores/`) • test sungguhan (bukan sekadar sanity) • analytics/monitoring • keputusan i18n • UAT • launch • iterate.
- **GATE 4:** sepakati kontrak API dengan backend sebelum wiring data asli.

---

## Decision gates (ringkas)
- **GATE 0** brand atoms terverifikasi klien → sebelum DS final.
- **GATE 1** DS disetujui → sebelum prototype.
- **GATE 2** semua layar mobile+desktop disetujui → sebelum slicing.
- **GATE 3** fondasi frontend (token/komponen/shell/data) di-review → sebelum halaman.
- **GATE 4** kontrak API disepakati → sebelum data asli.

## Risiko utama (gabungan)
1. **Dua layout tak harmonis** (F4) — paksa satu sumber nav/data, presentasi per breakpoint. Mitigasi: GATE 3.
2. **Brand "mirip" bukan "persis"** (F0) — utang yang menyebar. Mitigasi: tutup GATE 0.
3. **Auth tidak ada** — produk tak bisa dipakai nyata. Mitigasi: jadwalkan desain Auth paralel di F4.
4. **Bug data warisan** (NaN, dump bahasa) — frontend hanya menutupi; akar di backend. Mitigasi: data layer defensif + perbaikan backend di F6.
5. **Claude Design/Code research preview** — lag/error konteks besar, fetch `.dc.html` bisa meleset. Mitigasi: pecah sesi; suplai screenshot bila ekstraksi salah.
6. **English-only untuk pemula global** — keputusan produk belum sadar diambil. Mitigasi: putuskan di F6 (i18n) sejak struktur frontend masih lentur.

## Artefak (file index)
- `neo-design-system-spec.md` — F1
- `neo-mobile-prompt-pack.md` — F2
- `neo-desktop-prompt-pack.md` — F3
- `neo-frontend-vue-prompt-pack.md` — F4–F5
- `neo-masterplan.md` — dokumen ini (orkestrasi)

## Peran & handoff
- **Kamu (dartstudio):** orkestrator — jalankan Claude Design (F1–F3) & arahkan Claude Code (F4–F5).
- **Klien (pemilik brand):** sumber kebenaran GATE 0.
- **Frontend developer:** terima repo + README di F5; lanjut integrasi (F6).
- **Backend/tim lain:** kontrak API + Auth + perbaikan data (F6, bisa mulai paralel di F4).
```
