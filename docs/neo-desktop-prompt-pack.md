# neo — Desktop / Responsive Prompt Pack (untuk Claude Design)

Lanjutan dari versi mobile yang sudah jadi. Prinsip: **tambah breakpoint desktop ke prototype yang ADA**, jangan bikin desain baru. Komponen & DS dipakai ulang; hanya komposisi yang berubah per lebar layar.

> Inti: desktop = **kebalikan** transformasi mobile. Buka kembali yang tadi dimampatkan. JANGAN melebarkan kolom HP.

---

## Aturan global desktop (≥1024px) — reverse transforms

```
- Bottom nav  → SIDEBAR kiri (8 item asli: Dashboard, Coaches, Book A Coach, MyRecords,
  Precall Test, Token, Help, Logout). Logo neo di atas sidebar.
- Top bar: notifikasi + avatar tetap di kanan atas area konten.
- Konten: multi-kolom, max-width ~1200px, margin nyaman. JANGAN full-bleed kolom sempit.
- Bottom sheet → kembali ke panel/bar inline (filter bar, side panel).
- Full-screen sheet → SLIDE-IN PANEL kanan.
- List kartu (yang tadi pengganti tabel) → TABEL boleh kembali untuk data padat.
- Breakpoint: mobile <768 (JANGAN diubah), tablet 768–1023 (2-kolom), desktop ≥1024.
- DS, warna, tipografi, komponen: sama persis dengan mobile. Hanya layout yang berubah.
```

---

## Prompt 0 — Shell responsif (jalankan dulu)

```
Pakai neo Design System. Buat APP SHELL ini RESPONSIF di file yang sama.
JANGAN ubah tampilan <768px yang sudah ada.
Tambahkan layout DESKTOP (≥1024px):
- Bottom nav diganti SIDEBAR kiri tetap: Dashboard, Coaches, Book A Coach, MyRecords,
  Precall Test, Token, Help, Logout. Logo neo di puncak sidebar. Item aktif disorot Primary.
- Konten utama di kanan sidebar, max-width ~1200px, padding 24–32px.
- Top bar konten: judul halaman kiri, notifikasi + avatar kanan.
- Tablet (768–1023): sidebar boleh jadi ikon-only/collapsible.
Pastikan semua halaman berikutnya memakai shell responsif yang sama.
```

---

## Per halaman (≥1024px) — reverse transform

**Dashboard**
```
Pakai neo Design System. Buat Dashboard responsif (jangan ubah mobile).
Desktop: layout 2-kolom. Kolom kiri (lebar): kartu "Sesi coaching berikutnya" sebagai hero
+ ringkasan minggu (poin vs 6000, hari x/4, streak) sebagai grid. Kolom kanan (rail):
progress level + saldo token + CTA "Book a Coach". Pertahankan semua state.
```

**Help**
```
Pakai neo Design System. Help responsif (jangan ubah mobile).
Desktop: accordion tetap satu kolom tapi DIBATASI max-width ~760px, di tengah area konten
(jangan diregang penuh). Search bar FAQ di atas.
```

**Precall Test**
```
Pakai neo Design System. Precall Test responsif (jangan ubah mobile).
Desktop: kembalikan layout 2-kolom seperti aslinya — pengaturan device + Camera/Speaker test
di kiri, Microphone + Network test di kanan. Badge status tetap. Preview kamera lebih besar.
```

**MyRecords**
```
Pakai neo Design System. MyRecords responsif (jangan ubah mobile).
Desktop: kartu metrik jadi baris 4-kolom (seperti aslinya), chart full-width di bawah,
section Certificates di antaranya. Toolbar (course + Print) di kanan atas. Fallback "—",
skeleton, empty state tetap.
```

**Coaches**
```
Pakai neo Design System. Coaches responsif (jangan ubah mobile).
Desktop: filter kembali jadi FILTER BAR horizontal (Coach Name, Country, Language, Recurring,
tanggal, tombol Search) — bukan bottom sheet. Card coach jadi GRID 3–4 kolom. Card tetap
fully tappable, placeholder inisial, sembunyikan lokasi "-".
```

**Book A Coach**
```
Pakai neo Design System. Book A Coach responsif (jangan ubah mobile).
Desktop: layout 2-kolom — kalender di kiri, daftar Available Coach di kanan (seperti aslinya).
Mode (Upcoming/History/Create) sebagai tab/segmented di atas. Label timezone dekat kalender.
```

**Coach Schedule / Detail booking**
```
Pakai neo Design System. Detail Schedule responsif (jangan ubah mobile-nya yang full-screen sheet).
Desktop: tampilkan sebagai SLIDE-IN PANEL kanan (overlay konten redup), seperti screenshot asli.
Isi: jadwal mingguan (tabel Day/Start/End) + grid slot + footer sticky (ringkasan slot terpilih,
Confirm Primary, Cancel coral). Label tanggal + timezone di atas grid.
```

**Token**
```
Pakai neo Design System. Token responsif (jangan ubah mobile-nya yang list kartu).
Desktop: history kembali jadi TABEL penuh (#, Coach, Status, Debit, Credit, Date, Time,
Certification Level, Recording) — lebih efisien di lebar besar. Ringkasan Balance/Used/Refunded
jadi baris 3-kolom; kartu per-jenis token jadi baris/grid. Status badge & warna debit/credit tetap.
Filter sebagai bar/inline, bukan bottom sheet.
```

---

## Verifikasi (jangan diasumsikan jalan)

```
[ ] Resize preview / pakai Present di lebar desktop — pastikan breakpoint benar berpindah
[ ] Tampilan <768px TIDAK berubah dari versi mobile yang sudah disetujui
[ ] Sidebar muncul ≥1024px, bottom nav hilang; sebaliknya di mobile
[ ] Konten tidak jadi kolom sempit melayang — mengisi lebar dengan margin wajar
[ ] Tabel yang kembali tetap terbaca; aksi (Check Availability/Recording) berfungsi
```

## Risiko

- Responsif dalam satu file di research preview belum teruji olehku; ada kemungkinan mobile ikut berubah. Instruksi "jangan ubah <768px" mengurangi risiko, tapi cek manual tiap halaman. [Low–Medium]
- Kalau tetap kacau: fallback ke prototype "neo Desktop" terpisah yang memakai DS yang sama (satu sumber kebenaran tetap di DS).
