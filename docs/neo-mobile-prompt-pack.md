# neo — Mobile-First Prompt Pack untuk Claude Design

Tujuan paket ini: mengubah 7 layar desktop neo menjadi versi **mobile-first responsive**, dengan mandat **"perbaiki masalah UX yang jelas, pertahankan brand"** (bukan redesign total). Dipakai di `design.claude.ai`.

> Status alat: Claude Design masih **research preview** (Anthropic Labs), akun berbayar, kuota terpisah, ada bug komentar inline & save di mode compact. Sumber: help center & blog peluncuran Anthropic, diverifikasi Juni 2026. [High]

---

## Cara pakai (3 langkah)

1. Buka `design.claude.ai`, buat proyek baru. **Upload ke-7 screenshot** sekaligus.
2. **Paste "Blok Konteks" di bawah satu kali** di pesan pertama, lalu minta Claude Design mengekstrak design system dari screenshot (fitur bawaannya). Cross-check hasil ekstraksinya dengan token terukur di Blok Konteks.
3. Jalankan **prompt per layar** (sudah urut mudah→sulit). Iterasi pakai komentar inline / slider. Kalau komentar inline hilang (bug yang diakui Anthropic), tempel ulang teksnya ke chat.

---

## Blok Konteks (paste sekali di awal)

```
Produk: "neo" — platform belajar bahasa / coaching live (CEFR, neoPrep+, level A2–C1).
User memesan sesi 1-on-1 dengan coach lintas negara, pakai sistem token.
Aku ingin versi MOBILE-FIRST (target 390px) dari layar-layar yang ada di screenshot.
Mandat: PERTAHANKAN brand & gaya visual yang sudah ada. Hanya PERBAIKI masalah UX yang jelas.
JANGAN redesign total, jangan ganti identitas visual.

DESIGN TOKENS (terukur dari screenshot; verifikasi via ekstraksi-mu sendiri):
- Brand Indigo (sidebar/nav, gradient navy→indigo): #3E468D → #44549C
- Primary Blue (CTA & state aktif, gradient cyan-blue): #0BAAF4 → #40B8F6
- Logo Cyan: ~#29B6E8
- Amber (rating bintang): #FFBF5F
- Danger (Cancel): coral red ~#EE5A5A
- Surface / background: #ECF2F9
- Card: #FFFFFF, radius ~14px, shadow lembut (y=2, blur=12, hitam ~6%)
- Teks heading: slate gelap ~#1F2A44; teks sekunder ~#6B7280
- Tipografi: sans-serif geometris (mirip yang dipakai sekarang). Body min 16px.

Komponen yang sudah ada & harus dipertahankan polanya:
- Card coach (avatar bulat, nama, rating bintang, lokasi, "x tokens")
- Tombol primary (biru penuh) & secondary (biru muda / outline)
- Status badge ("Booked" hijau), chips token, slot waktu grid
- Drawer detail (di mobile jadi full-screen sheet)
```

---

## Aturan mobile-first global (berlaku ke SEMUA layar) [High — Apple HIG & Material]

```
Terapkan ke setiap layar:
- Breakpoint dasar 390px (mobile). Layout single-column secara default.
- Touch target minimal 44x44px (iOS) / 48dp (Material). Jarak antar-target ≥8px.
- Body text min 16px (mencegah auto-zoom iOS pada input). Caption min 12px.
- Kontras teks WCAG AA (≥4.5:1).
- Hormati safe area (notch & home indicator): padding bawah ekstra untuk konten & footer sticky.
- BOTTOM NAVIGATION (ganti sidebar 8-item): maksimal 5 tab.
  Rekomendasi: [Dashboard] [Coaches] [Book — tab tengah ditonjolkan] [MyRecords] [More].
  "More" memuat: Precall Test, Token, Help, Logout.
  Alasan: 8 item tidak muat di bottom bar; "Book A Coach" adalah aksi inti → diberi penekanan.
- Aksi utama (Confirm, Select, Search) pakai tombol full-width di FOOTER STICKY (zona ibu jari).
- Setiap tampilan data WAJIB punya 3 state: loading (skeleton), empty (ilustrasi + 1 kalimat + CTA), error.
- Filter/opsi yang banyak → sembunyikan dalam BOTTOM SHEET, jangan dibariskan horizontal.
- Tabel >4 kolom → ubah jadi LIST KARTU, bukan tabel yang diciutkan.
- Karena coach lintas zona waktu, SELALU tampilkan label timezone pada slot & jadwal.
```

---

# Prompt per layar (urut mudah → sulit)

## 1. Help — mudah (accordion sudah mobile-friendly)

```
Buat versi mobile (390px) layar Help dari screenshot.
Pertahankan: pola accordion FAQ, urutan item, ikon +/− expand.
Perbaiki: 
- Tinggi setiap baris accordion ≥56px (touch target).
- Hanya satu item terbuka pada satu waktu (atau biarkan multi — pilih satu, konsisten).
- Beri search bar FAQ di atas (banyak item, scroll panjang).
- Judul "Help" sticky di atas saat scroll.
Bottom nav: posisi "More" aktif.
```

## 2. Precall Test — mudah (stack + perjelas status)

```
Buat versi mobile (390px) layar Precall Test dari screenshot.
Pertahankan: dropdown Camera/Microphone/Speaker/Resolution, panel test.
Perbaiki:
- Stack vertikal: pengaturan device dulu, lalu Camera Test, Microphone Test, Speaker Test, Network Quality Test.
- Tiap test punya STATUS jelas (badge: Belum dites / Berjalan / OK / Gagal) — bukan cuma tombol.
- Preview kamera hitam → tambah state "Tidak ada sinyal / izin kamera diblokir" dengan tombol "Izinkan akses".
- Tombol Start/Stop jadi full-width, Start hijau, Stop netral.
- Tambah ringkasan "Kesiapan: X/4 test lulus" di atas + CTA "Lanjut ke sesi" yang disable sampai test inti lulus.
```

## 3. MyRecords — mudah-sedang (stack + WAJIB benahi state rusak)

```
Buat versi mobile (390px) layar MyRecords (dashboard progres) dari screenshot.
Pertahankan: kartu metrik (Points Earned, Points to Complete, Study Time, Mastery Tests,
Coaching Sessions, Progress to Level Certificate, Current Course, Current Level Goal),
section "Certificates Awarded to Date", chart "Earned Study Points - Last 4 Weeks", dropdown course + Print.

PERBAIKI (ini penting — di screenshot layar ini menampilkan data RUSAK):
- "NaN:NaN" pada Study Time → ganti fallback "—" atau "0:00" saat data kosong/invalid.
- Kartu metrik kosong → beri SKELETON saat loading dan EMPTY STATE ("Belum ada data") saat memang kosong.
- "Certificates Awarded" yang cuma lingkaran biru menggantung → buat legenda/empty state yang jelas.
- Chart kosong → tampilkan empty state "Belum ada poin minggu ini", bukan area kosong.
Layout: metrik jadi grid 2-kolom yang stack; chart full-width di bawah; dropdown course + Print jadi
toolbar atas yang ringkas (Print bisa masuk menu kebab).
```

> Catatan dev (di luar desain): NaN & kartu kosong itu **bug data/parsing**, bukan masalah layout. Desain hanya bisa menyediakan fallback yang anggun; akar masalahnya harus dibetulkan di kode. [Medium — disimpulkan dari screenshot]

## 4. Coaches (list & filter) — sedang

```
Buat versi mobile (390px) layar Coaches dari screenshot.
Pertahankan: card coach (avatar, nama, rating bintang amber, lokasi, "x tokens"), warna brand.
Perbaiki:
- 4 filter (Coach Name, Country, Language, Recurring) + tanggal → pindah ke BOTTOM SHEET "Filter".
  Bar atas cukup: search field + tombol "Filter" (badge jumlah filter aktif).
- Card jadi LIST 1-kolom (atau 2-kolom kompak), SELURUH card tappable (bukan cuma sebagian).
- Avatar "No Image Available" → ganti placeholder inisial nama berwarna brand.
- Lokasi yang "-" → sembunyikan baris itu, jangan tampilkan tanda hubung kosong.
- Hasil terpilih (highlight border biru) tetap dipertahankan.
- Tambah empty state "Tidak ada coach yang cocok" + reset filter.
Bottom nav: "Coaches" aktif.
```

## 5. Book A Coach — sedang

```
Buat versi mobile (390px) layar Book A Coach dari screenshot.
Pertahankan: kalender pemilih tanggal, list "Available Coach" dengan tombol "Select Coach",
tiga mode (Upcoming Appointment / History / Create Appointment).
Perbaiki:
- 3 mode jadi SEGMENTED CONTROL di atas (bukan tombol terpisah).
- Stack: kalender dulu (full-width), lalu daftar coach yang tersedia di tanggal itu.
- Tanggal terpilih jelas (lingkaran biru brand), tanggal lampau di-disable.
- Card coach tampilkan bahasa (English, Indonesian, dst) + rating + token.
- "Select Coach" full-width per card.
- Tampilkan label timezone user di dekat kalender.
Bottom nav: "Book" (tab tengah) aktif.
```

## 6. Coach Schedule / Detail booking — sulit (drawer → full-screen sheet)

```
Buat versi mobile (390px) untuk panel "Detail Schedule" coach dari screenshot.
Di desktop ini drawer kanan; di mobile jadikan FULL-SCREEN SHEET yang muncul dari bawah.
Pertahankan: tabel jadwal mingguan (Day / Start / End), grid slot waktu 30-menit, tombol Confirm & Cancel.
Perbaiki:
- Header sheet: nama coach + tombol close (X), sticky.
- Jadwal mingguan jadi accordion yang bisa diciutkan (default tertutup) agar grid slot langsung terlihat.
- Grid slot tetap (3 kolom enak di mobile). Slot terpilih = Primary Blue. Slot lampau/penuh = disabled abu.
- Tampilkan label tanggal + TIMEZONE di atas grid ("Senin, 15 Jun 2026 • WIB").
- FOOTER STICKY: ringkasan slot terpilih ("15 Jun, 03:30–04:00 • 2 token") + tombol "Confirm Appointment"
  (Primary Blue, full-width) dan "Cancel" (coral, sekunder). Confirm disable sampai ada slot dipilih.
```

## 7. Token (saldo + history) — sulit (tabel 9 kolom → list kartu)

```
Buat versi mobile (390px) layar Token dari screenshot.
Pertahankan: ringkasan Balance / Used / Refunded, kartu per-jenis token (B1, B1 Plus, B2, dst),
dan riwayat transaksi.
Perbaiki:
- Ringkasan Balance/Used/Refunded jadi 3 kartu yang stack atau scroll horizontal.
- Kartu per-jenis token (6+ item) jadi SCROLL HORIZONTAL (chip/card), bukan grid yang mengecil.
- Tabel history 9 kolom (#, Coach, Status, Debit, Credit, Date, Time, Cert Level, Recording)
  → ubah jadi LIST KARTU. Tiap kartu:
    baris 1: nama coach (tebal) + status badge ("Booked" hijau)
    baris 2: tanggal • jam
    baris 3: −2 token (debit, merah) / +token (credit, hijau) • level (A2 neoPrep+)
    aksi: tombol "Check Availability" / "Recording" bila ada, full-width di bawah kartu.
- Tambah filter (status, tanggal, coach) via bottom sheet, dan empty state.
Bottom nav: "More" → "Token" aktif.
```

> Catatan data: di screenshot, Refunded (76) > Used (60) terlihat janggal secara logika bisnis. Bukan urusan desain, tapi worth dicek tim. [Low — kemungkinan data uji]

---

## Checklist QA mobile (sebelum handoff ke Claude Code / dev)

```
[ ] Semua touch target ≥44px, jarak antar-target ≥8px
[ ] Tidak ada teks <12px; body ≥16px; kontras lolos AA
[ ] Bottom nav ≤5 item; aksi utama di footer sticky (zona ibu jari)
[ ] Setiap layar data punya 3 state: loading / empty / error
[ ] Tidak ada "NaN", "-", atau placeholder mentah yang bocor ke user
[ ] Tabel >4 kolom sudah jadi list kartu
[ ] Label timezone muncul di semua tampilan waktu/booking
[ ] Sheet & drawer full-screen, header sticky, ada cara tutup yang jelas
[ ] Konsistensi warna brand (Indigo nav, Primary Blue CTA, Amber rating)
```

---

## Risiko & batas (transparan)

- **Token warna terukur dari screenshot**, tapi sampel pada elemen tipis (logo, teks) kena anti-aliasing. Andalkan ekstraksi Claude Design dari screenshot sebagai sumber utama; token di sini sebagai cross-check. [Measured, sebagian noisy]
- **NaN & kartu kosong di MyRecords adalah bug data**, bukan masalah desain. Mobile redesign hanya menambah fallback; akar masalah harus diperbaiki di kode. [Medium]
- **Tabel→kartu bukan transformasi otomatis.** Claude Design akan butuh iterasi manual (komentar inline/slider) supaya hierarki kartu pas. Sediakan waktu untuk ini.
- **Claude Design research preview**: fitur/limit bisa berubah, kuota terpisah, ada bug komentar & save. Jangan andalkan untuk deadline ketat tanpa cadangan. [High]
- **Mandat "perbaiki UX jelas, pertahankan brand"** artinya beberapa kelemahan struktural (mis. arsitektur navigasi 8-item) hanya ditangani secukupnya, bukan dirombak. Kalau nanti ingin lebih jauh, itu keputusan terpisah.
