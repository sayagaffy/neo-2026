# neo — Design System Spec (untuk Claude Design)

Dipakai di `design.claude.ai` → tab **Design systems** → **Create new design system** → "Teach Claude your brand and product". Paste isi blok-blok di bawah, lalu **Set as default**, baru jalankan prompt pack per layar.

> **Strategi inti:** KUNCI brand (warna + logo, milik klien), BANGUN ULANG sisanya (tipografi, spacing, komponen). Jangan auto-ekstrak komponen dari situs lama — itu mewarisi kelemahannya.

---

## 0. Setup di Claude Design (urutan benar)

```
1. Create new design system → mode "teach manually" (JANGAN link codebase lama untuk
   ekstraksi komponen — itu akan menyalin pola lama yang ingin kita perbaiki).
   Boleh ambil warna/logo mentah dari aset brand, tapi komponen didefinisikan fresh.
2. Paste seksi 1–7 di bawah.
3. Set as default.
4. Buat prototype baru → pilih design system "neo" → jalankan prompt pack 7 layar.
```

---

## 1. Brand atoms — DIKUNCI (jangan diubah)

Warna terukur dari screenshot (anti-aliasing pada elemen tipis bikin sebagian noisy — **konfirmasi hex final dari CSS/brand guide klien sebelum produksi**). [Measured, perlu konfirmasi]

```
Brand Indigo (identitas navigasi, gradient navy→indigo): #3E468D → #44549C
Primary Cyan-Blue (aksi/CTA/state aktif, gradient):       #0BAAF4 → #40B8F6
Logo Cyan (wordmark "neo"):                               ~#29B6E8  (ambil nilai pasti dari file logo)
Amber (khusus rating bintang):                            #FFBF5F

Logo: wordmark lowercase "neo". Aturan: jangan diubah bentuk/warna/proporsi.
Sediakan varian di atas latar terang (default) & latar indigo (versi terang/putih).
Clear space minimal = tinggi huruf "n". Ukuran minimal terbaca: 24px tinggi.
```

## 2. Color system — DIBANGUN ULANG (hue tetap, peran diperjelas)

Mempertahankan warna brand TIDAK berarti mempertahankan cara pakainya. Tambahkan tangga netral & peran semantik yang sekarang tidak ada — ini sumber utama perbaikan rasa "rapi". [High — prinsip token semantik]

```
Neutral ramp (BARU — untuk teks, border, surface; ini yang hilang sekarang):
  neutral-900 #1F2A44  (teks utama/heading)
  neutral-700 #3F4A60
  neutral-500 #6B7280  (teks sekunder)
  neutral-300 #C7CFDA  (border)
  neutral-100 #E8EDF4  (divider/surface alt)
  neutral-50  #F4F7FB
  surface     #ECF2F9  (background app)
  card        #FFFFFF

Peran semantik (pakai brand hue di atas):
  --color-primary        Primary Cyan-Blue   → tombol utama, link, state aktif, slot terpilih
  --color-nav            Brand Indigo        → bottom nav / app bar
  --color-text           neutral-900
  --color-text-muted     neutral-500
  --color-border         neutral-300
  --color-bg             surface
  --color-card           card
  --color-rating         Amber (HANYA untuk bintang, jangan dipakai elemen lain)

State (BARU):
  success #16A34A   warning #D97706   danger #EE5A5A   info = primary
  badge "Booked" = success; debit token = danger; credit token = success

Aturan: maksimal 1 warna aksi dominan per layar (primary). Indigo hanya untuk navigasi.
Hindari menumpuk indigo + cyan + amber dalam satu blok tanpa hierarki — itu bagian dari
kenapa versi lama terasa ramai.
```

## 3. Typography — DIBANGUN ULANG (proposal, bukan font lama)

Aku tidak tahu font brand saat ini, jadi ini **rekomendasi**, bukan klaim. Untuk produk edukasi yang ramah & modern: humanist/geometric sans. [Proposal]

```
Rekomendasi: heading & UI = "Plus Jakarta Sans" atau "Figtree";
             body = "Inter" (atau satu typeface saja untuk konsistensi).
(Final terserah brand guide klien — kalau sudah ada font brand, pakai itu.)

Type scale (mobile-first, rem @16px base):
  display  28/34  bold     (judul halaman)
  h1       24/30  semibold
  h2       20/26  semibold
  h3       17/24  semibold
  body     16/24  regular  (MINIMAL untuk body & input — cegah auto-zoom iOS)
  small    14/20  regular  (metadata)
  caption  12/16  medium   (label, badge)
Angka besar dashboard (Balance "90", dst): 32/36 bold.
Tracking heading sedikit ketat (-0.01em); body normal.
```

## 4. Spacing & layout — DIBANGUN ULANG

Grid spacing yang konsisten = penyebab terbesar UI terasa rapi vs berantakan. [High]

```
Grid 4px. Skala: 4, 8, 12, 16, 20, 24, 32, 40, 48.
Padding konten halaman (mobile): 16px kiri-kanan.
Gap antar-card: 12px. Padding dalam card: 16px.
Container maks: mobile 100% (base 390px), lalu sm 640 / md 768 / lg 1024 untuk responsif.
Section vertikal: 24px antar kelompok.
Safe area: padding bawah ekstra 16px + inset home indicator untuk footer sticky.
```

## 5. Radius & elevation — DIBANGUN ULANG

```
Radius: card 14px, button 10px, input 10px, chip/pill 999px, sheet atas 20px.
Elevation (shadow halus, hindari shadow tebal "murah"):
  e1 (card)   0 1px 2px rgba(16,24,40,.06)
  e2 (raised) 0 2px 12px rgba(16,24,40,.08)
  e3 (sheet/drawer) 0 -4px 24px rgba(16,24,40,.12)
Border tipis neutral-300 lebih disukai daripada shadow tebal untuk pemisah ringan.
```

## 6. Komponen — DIBANGUN ULANG (inti perbaikan)

```
Button
  primary:   fill Primary Cyan-Blue, teks putih, radius 10, tinggi 48, full-width di footer
  secondary: outline primary / fill primary-50, teks primary
  danger:    fill danger (untuk Cancel)
  ghost:     teks primary tanpa fill
  disabled:  neutral-100 fill, neutral-300 teks
  Touch target ≥44px. Label sentence case.

Input / Select
  tinggi 48, radius 10, border neutral-300, fokus border primary + ring primary 20%.
  Label di atas (caption), placeholder neutral-500. Body 16px.

Card (3 varian)
  coach-card:   avatar bulat 40 (atau placeholder inisial berwarna brand bila no image),
                nama h3, rating bintang amber, lokasi small (sembunyikan kalau "-"),
                "x tokens" chip. SELURUH card tappable.
  metric-card:  label caption (muted) di atas, angka besar di bawah; punya state
                skeleton (loading) & "—" (kosong) — JANGAN tampilkan "NaN".
  transaction-card (pengganti tabel token):
                baris1 nama coach (semibold) + status badge
                baris2 tanggal • jam (small muted)
                baris3 −2 token (danger) / +n (success) • level
                aksi opsional full-width di bawah.

Badge / Status: pill, caption medium. Booked=success, dst.
Chip token: pill outline/soft, jumlah token.

Bottom Navigation (pengganti sidebar 8-item; maks 5)
  [Dashboard][Coaches][Book*][MyRecords][More]   *tab tengah ditonjolkan
  More memuat: Precall Test, Token, Help, Logout.
  fill nav = Brand Indigo, ikon aktif = putih/primary.

Segmented control: untuk mode (Upcoming/History/Create) & filter cepat.

Bottom Sheet / Drawer: full-screen di mobile, header sticky (judul + close X),
  konten scroll, footer sticky untuk aksi utama. Shadow e3.

Calendar: tanggal terpilih lingkaran Primary, hari ini outline, lampau disabled.

Slot grid (booking): 3 kolom, slot terpilih Primary, penuh/lampau disabled abu.
  Selalu tampilkan label tanggal + TIMEZONE di atas grid (coach lintas zona waktu).

Avatar placeholder: inisial di lingkaran berwarna brand (ganti "No Image Available").

States (WAJIB di setiap tampilan data):
  loading = skeleton shimmer; empty = ilustrasi ringkas + 1 kalimat + CTA;
  error = ikon + pesan + tombol coba lagi.
```

## 7. Ikonografi

```
Satu set ikon line konsisten (mis. Lucide / Phosphor), stroke 1.5–2px, ukuran 20–24.
Jangan campur beberapa gaya ikon (penyebab umum tampilan "tidak rapi").
```

---

## Catatan & risiko (transparan)

- **Warna = terukur dari screenshot, bukan dari brand guide resmi.** Sampel pada logo/teks tipis noisy. Konfirmasi hex final dari CSS klien (`:root` variables) atau brand guide sebelum produksi. [Measured, perlu verifikasi]
- **Font = rekomendasi, bukan font brand kamu.** Aku tidak punya datanya; kalau brand sudah punya typeface, pakai itu. [Proposal]
- **"Warna harus tetap" aku tafsirkan sebagai hue/hex dikunci, bukan cara pemakaian.** Kalau klien juga mengunci pemakaian warna (mis. sidebar harus indigo penuh), beberapa perbaikan di seksi 2 perlu dinegosiasi. [Asumsi — konfirmasi]
- **Auto-ekstraksi DS dari situs lama = jangan.** Itu menyalin pola yang ingin diperbaiki. Pakai mode manual + spec ini.
- **Claude Design research preview**: DS bisa di-publish & set default (terlihat di screenshot-mu), tapi fitur/limit bisa berubah; ada bug komentar inline & save di mode compact. [High]
