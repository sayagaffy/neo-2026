# neo Frontend — Architecture & Build Handoff (F4)

> **Peran dokumen ini:** spec arsitektur tunggal untuk fase **F4 (Frontend Vue)**. Ditulis oleh sesi *arsitek*. Yang **mengerjakan** adalah sesi terpisah (model Sonnet) yang menjalankan Work Orders di §11 satu per satu. Semua keputusan lintas-potong (token, kontrak data, pola responsif, konvensi) sudah dikunci di sini supaya 9 layar konsisten dan TIDAK jadi "dua app".
>
> Implementer: baca §1–§10 sekali di awal, lalu kerjakan §11 berurutan. Jangan menafsir ulang keputusan yang sudah dikunci — kalau ada yang janggal, angkat ke orchestrator (dartstudio), jangan diam-diam menyimpang.

---

## 0. Cara pakai (workflow arsitek → implementer)

1. Orchestrator buka chat baru (Sonnet) di repo ini.
2. Tempel **Work Order** dari §11 satu per satu (Prompt 1 → 8). Tiap Work Order menunjuk ke seksi arsitektur yang relevan ("ikuti §5", dst).
3. Setelah **Work Order 3 selesai → STOP di GATE 3** (§11). Orchestrator review fondasi (token/komponen/shell/data) SEBELUM lanjut ke halaman. Kalau shell terasa seperti dua app → ulang, jangan lanjut.
4. Tiap Work Order = satu (atau beberapa) commit dengan pesan yang sudah ditentukan. Conventional Commits.

---

## 1. Context anchors (sumber kebenaran — dari graph report)

Graph report (`graphify-out/GRAPH_REPORT.md`) **fresh** per HEAD `dd9b24fc`. God nodes-nya = dokumen di bawah; itu yang jadi rujukan kanonik. Jangan kehilangan konteks: tiap kali ragu soal sebuah layar/komponen, balik ke file yang tepat di tabel ini.

| Concern | Sumber kanonik | Catatan |
|---|---|---|
| Orkestrasi, gates, scope | `docs/neo-masterplan.md` | Kita di **akhir F3 → mulai F4**. Prompt 0 (scaffold) **SUDAH** selesai (commit `af12b23`). |
| Token, warna, tipografi, komponen, states | `docs/neo-design-system-spec.md` | Brand DIKUNCI, sisanya DIBANGUN ULANG. |
| Spec layar **< lg** (mobile 390px) | `docs/neo-mobile-prompt-pack.md` | Aturan mobile-first global ada di sini. |
| Spec layar **≥ lg** (desktop, reverse transform) | `docs/neo-desktop-prompt-pack.md` | Desktop = kebalikan transform mobile. |
| Urutan build F4 + prinsip | `docs/neo-frontend-vue-prompt-pack.md` | Prompt 0–8. Dokumen ini mengikat & memperketatnya. |
| Prototype visual (di-fetch saat implement) | DS / Mobile / Desktop URLs di §11 | URL `api.anthropic.com/v1/design/...` — fetch di Work Order 1 & 2. |

**Jaga graph tetap fresh:** setelah perubahan kode besar, jalankan `graphify update .` (tanpa biaya API), lalu bandingkan `git rev-parse HEAD` dengan freshness di report.

### Status sekarang (terverifikasi)
- Scaffold lengkap & lulus build/lint/test (Vue 3.5, Router 5, Pinia 3, Vite 8, TS 6 strict, Vitest 4, Tailwind v4.3, ESLint+oxlint+Prettier).
- Alias `@`→`src` aktif. `vite.config.ts` sudah daftarkan plugin `@tailwindcss/vite`. `src/styles/main.css` = `@import 'tailwindcss';`.
- Struktur folder sudah ada: `src/{assets,styles,components/{ui,layout},composables,stores,services,types,mocks,views,router}`.
- Deploy config `vercel.json` + `netlify.toml` (SPA fallback) sudah ada.
- **Masih ada demo bawaan** (`HomeView`, `AboutView`, `TheWelcome`, `HelloWorld`, `components/icons/*`, `assets/base.css`, demo `assets/main.css`) → **dihapus di Work Order 1**.
- `src/styles/tokens.css` **belum ada** → dibuat di Work Order 1.

---

## 2. Prinsip arsitektur (NON-NEGOTIABLE)

1. **Satu app, dua rendering.** Ada tepat SATU sumber navigasi, SATU router, SATU store per domain. Mobile dan desktop hanya beda *presentasi per breakpoint*, bukan beda logika/komponen/data. Kalau mulai menduplikasi logika layar untuk mobile vs desktop → STOP, itu gejala "dua app".
2. **Prototype = referensi visual, bukan kode.** Ekstrak *intent* (token, struktur, komponen) lalu **tulis ulang idiomatik** di Vue 3 `<script setup lang="ts">`. JANGAN transpile/copy-paste HTML `.dc.html`.
3. **Data dipisah dari UI.** `types` → `mocks` → `services` (async, swappable) → `stores` (Pinia) → komponen. Komponen **tidak** hardcode data dan **tidak** memanggil service langsung (selalu lewat store).
4. **Defensif by default.** Tidak ada `NaN`, `null` mentah, `"-"`, atau dump data yang bocor ke user. Setiap angka dari data layer = number valid ATAU `null`; UI memetakan `null` → `—` / `Not set` / EmptyState.
5. **Tiga state wajib** di SETIAP tampilan data: `loading` (Skeleton) · `empty` (EmptyState) · `error` (ErrorState).
6. **Responsif CSS-first.** Pakai utility Tailwind untuk beda layout. `useBreakpoint()` (JS) HANYA dipakai bila struktur DOM benar-benar harus berbeda (sheet vs dropdown/panel).
7. **UI English semua.** Aksesibel: focus ring, aria benar, target sentuh ≥44px, kontras AA. Timezone selalu tampil di setiap waktu/booking.
8. **Stabil saja.** Vue 3.x stabil, BUKAN Vapor/3.6. Cek API terkini via **Context7** sebelum implement (Vue/Router/Pinia/Tailwind v4/Vite).

---

## 3. Konvensi teknis

- **Komponen:** `PascalCase.vue`, `<script setup lang="ts">`. UI primitives prefix `Base*` di `components/ui/`. Layout di `components/layout/`. Views: `*View.vue` di `views/`.
- **Composables:** `useThing.ts` (camelCase, prefix `use`) di `composables/`.
- **Stores:** `useXStore` (Pinia *setup store*) di `stores/x.ts`.
- **Services:** `x.service.ts`, ekspor fungsi async bertipe. **Tidak** menyentuh Pinia/Vue — pure async functions.
- **Types:** satu domain per file di `types/` (mis. `coach.ts`), di-`export` ulang dari `types/index.ts`.
- **Mocks:** `x.mock.ts` di `mocks/`, termasuk **kasus rusak** (null/empty) untuk uji fallback.
- **Helper murni** (format tanggal/timezone/angka, inisial avatar): tambahkan folder **`src/utils/`** (ekstensi sah dari struktur dasar — flag di §13). Tidak ada state, mudah dites.
- **Icons:** satu set line icons konsisten — **Lucide** (`lucide-vue-next`), stroke 1.5–2, ukuran 20–24. Jangan campur set lain.
- Import internal pakai alias `@/…`.

---

## 4. Design token contract (`src/styles/tokens.css`)

Implementer **buat `src/styles/tokens.css`** berisi blok `@theme` di bawah, lalu **`@import './tokens.css';`** di `src/styles/main.css` (setelah `@import 'tailwindcss';`). **TIDAK ada `tailwind.config.js`** (v4 = CSS-first). Ini SATU sumber kebenaran; semua komponen merujuk role semantik (`--color-primary`, dst), bukan hex mentah.

> Hex = **terukur dari screenshot** → utang GATE 0: cross-check dengan file DS live + brand guide klien sebelum produksi. `--color-cyan-50` = **derived**, konfirmasi.

```css
@theme {
  /* ── Brand (LOCKED — verifikasi hex vs DS live / brand guide, GATE 0) ── */
  --color-indigo-700: #3E468D;   /* nav base (gradient navy→indigo) */
  --color-indigo-600: #44549C;   /* nav gradient end */
  --color-cyan-500:   #0BAAF4;   /* primary / CTA base (gradient) */
  --color-cyan-400:   #40B8F6;   /* primary gradient end */
  --color-cyan-50:    #E6F6FE;   /* primary soft fill (DERIVED — confirm) */
  --color-logo:       #29B6E8;   /* wordmark "neo" */
  --color-amber-400:  #FFBF5F;   /* rating ONLY */

  /* ── Neutral ramp ── */
  --color-neutral-900: #1F2A44;
  --color-neutral-700: #3F4A60;
  --color-neutral-500: #6B7280;
  --color-neutral-300: #C7CFDA;
  --color-neutral-100: #E8EDF4;
  --color-neutral-50:  #F4F7FB;
  --color-surface:     #ECF2F9;  /* app background */
  --color-card:        #FFFFFF;

  /* ── State ── */
  --color-success: #16A34A;
  --color-warning: #D97706;
  --color-danger:  #EE5A5A;

  /* ── Semantic roles — PAKAI INI di komponen ── */
  --color-primary:      var(--color-cyan-500);
  --color-primary-soft: var(--color-cyan-50);
  --color-nav:          var(--color-indigo-700);
  --color-text:         var(--color-neutral-900);
  --color-text-muted:   var(--color-neutral-500);
  --color-border:       var(--color-neutral-300);
  --color-bg:           var(--color-surface);
  --color-rating:       var(--color-amber-400);
  --color-info:         var(--color-cyan-500);

  /* ── Typography ── */
  --font-sans:    "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Plus Jakarta Sans", var(--font-sans);   /* proposal — konfirmasi brand */

  --text-display: 1.75rem;    --text-display--line-height: 2.125rem;  /* 28/34 bold */
  --text-h1:      1.5rem;      --text-h1--line-height: 1.875rem;       /* 24/30 semibold */
  --text-h2:      1.25rem;     --text-h2--line-height: 1.625rem;       /* 20/26 semibold */
  --text-h3:      1.0625rem;   --text-h3--line-height: 1.5rem;         /* 17/24 semibold */
  --text-body:    1rem;        --text-body--line-height: 1.5rem;       /* 16/24 — MIN body & input */
  --text-small:   0.875rem;    --text-small--line-height: 1.25rem;     /* 14/20 */
  --text-caption: 0.75rem;     --text-caption--line-height: 1rem;      /* 12/16 medium */
  --text-stat:    2rem;        --text-stat--line-height: 2.25rem;      /* 32/36 angka besar */

  /* ── Radius ── */
  --radius-card:   14px;
  --radius-button: 10px;
  --radius-input:  10px;
  --radius-sheet:  20px;   /* pill = rounded-full */

  /* ── Elevation (shadow halus; lebih suka border tipis utk pemisah ringan) ── */
  --shadow-e1: 0 1px 2px rgba(16,24,40,.06);
  --shadow-e2: 0 2px 12px rgba(16,24,40,.08);
  --shadow-e3: 0 -4px 24px rgba(16,24,40,.12);
}
```

**Spacing:** JANGAN bikin token spacing custom. Grid 4px DS = skala default Tailwind (`--spacing` = 0.25rem). Mapping: `4/8/12/16/20/24/32/40/48px` = `p-1/2/3/4/5/6/8/10/12`. Padding konten halaman mobile = `px-4` (16). Gap antar-card `gap-3` (12), padding dalam card `p-4`. Section vertikal `space-y-6` (24).

**Gradient:** nav = `bg-linear-to-b from-indigo-700 to-indigo-600`. Primary button boleh solid `bg-primary` (default, paling aman utk kontras) ATAU gradient cyan sebagai aksen — pilih satu, konsisten.

**Aturan pemakaian warna:** maks 1 warna aksi dominan per layar (primary). Indigo HANYA navigasi. Amber HANYA bintang rating.

---

## 5. UI component contracts (`src/components/ui/`)

Semua: bertipe (`defineProps<…>()`), aksesibel, target ≥44px, rujuk token semantik. Tulis unit test sanity utk **BaseButton** & **Avatar** (wajib), sisanya opsional.

| Komponen | Props (inti) | Emits / Slots | Catatan |
|---|---|---|---|
| `BaseButton` | `variant: 'primary'\|'secondary'\|'danger'\|'ghost'`, `size?: 'md'\|'lg'`, `disabled?`, `loading?`, `block?`, `type?` | `@click`; slot default | h-12 (48) di footer, h-11 (44) default. `loading`→spinner+disable. Label sentence case. |
| `BaseInput` | `modelValue`, `label?`, `type?`, `placeholder?`, `error?`, `hint?`, `disabled?` | `v-model` | h-12, radius-input, border-border; fokus → border-primary + ring primary 20%. Body 16px. Label = caption di atas. |
| `BaseSelect` | `modelValue`, `options: {label,value}[]`, `label?`, `placeholder?`, `disabled?` | `v-model` | Sama anatomi dgn input. |
| `BaseCard` | `as?: string`, `padding?: boolean`, `interactive?: boolean` | slot default | radius-card, bg-card, shadow-e1. `interactive`→hover+seluruh card tappable (role/button semantics). |
| `StatusBadge` | `tone: 'success'\|'warning'\|'danger'\|'info'\|'neutral'`, `label` | — | pill, caption medium. Booked=success, dst (mapping di store/util, bukan di komponen). |
| `Avatar` | `src?: string\|null`, `name: string`, `size?: number` | — | `src` null/gagal → **inisial** di lingkaran warna brand (hash nama → warna). Ganti "No Image Available". |
| `Chip` | `label`, `variant?: 'soft'\|'outline'`, `tone?` | — | token chip, language chip, dll. pill. |
| `StarRating` | `value: number\|null`, `max?: 5`, `readonly?: true` | — | `null` → **tidak render** (sembunyikan, bukan 0 bintang). Warna amber. |
| `Skeleton` | `variant: 'text'\|'card'\|'metric'\|'avatar'\|'line'`, `lines?`, `width?`, `height?` | — | shimmer. |
| `EmptyState` | `title`, `message?`, `icon?`, `ctaLabel?` | `@cta`; slot | ilustrasi ringkas + 1 kalimat + CTA. |
| `ErrorState` | `message?`, `retrying?` | `@retry` | ikon + pesan + tombol coba lagi. |

---

## 6. Arsitektur reconciliation responsif (INTI F4)

### 6.1 Breakpoints
- **mobile** `< 768` (base, JANGAN diubah dari prototype mobile)
- **tablet** `768–1023` (`md`) → 2-kolom, sidebar boleh icon-only/collapsible
- **desktop** `≥ 1024` (`lg`) → sidebar penuh, multi-kolom, max-width konten ~1200px

Tailwind: `lg:` = switch utama mobile↔desktop. `md:` = penyesuaian tablet.

### 6.2 Navigasi satu sumber
Buat `src/composables/useNavigation.ts` (atau `src/config/navigation.ts`) — **SATU** array yang di-render BottomNav, SidebarNav, dan MoreSheet:

```ts
export interface NavItem {
  name: string            // = route name
  label: string           // English
  to: string              // path
  icon: Component          // Lucide icon
  placement: {
    bottomNav?: boolean | 'center'  // 'center' = tab tengah ditonjolkan (Book)
    sidebar?: boolean
    moreSheet?: boolean             // muncul di sheet "More" (<lg)
  }
}
```

Placement final (lihat keputusan Logout di §13):

| Item | route | bottomNav | sidebar | moreSheet |
|---|---|---|---|---|
| Dashboard | `/dashboard` | ✓ | ✓ | — |
| Coaches | `/coaches` | ✓ | ✓ | — |
| Book A Coach | `/book` | `center` | ✓ | — |
| MyRecords | `/records` | ✓ | ✓ | — |
| Precall Test | `/precall` | — | ✓ | ✓ |
| Token | `/token` | — | ✓ | ✓ |
| Help | `/help` | — | ✓ | ✓ |
| More | (aksi sheet) | ✓ | — | — |

- **< lg:** `BottomNav` render item `bottomNav` (5: Dashboard, Coaches, Book*, MyRecords, More). Tab **More** buka `MoreSheet` berisi item `moreSheet` (Precall, Token, Help).
- **≥ lg:** `SidebarNav` render item `sidebar` (7 item). Logo neo di puncak. Item aktif disorot primary.
- **Logout BUKAN NavItem** (bukan route) → hidup di Account Menu saja (§6.4, §13).

### 6.3 AppShell (satu komponen, dua presentasi)
`components/layout/AppShell.vue` membungkus semuanya: `TopBar` + nav + `<RouterView>` (lazy) + host overlay. SATU pohon komponen; BottomNav & SidebarNav ditampilkan/disembunyikan via CSS (`lg:hidden` / `hidden lg:flex`), **bukan** dua AppShell.

```
AppShell
├─ TopBar (logo · NotificationsBell · AccountMenu trigger)
├─ SidebarNav        (hidden lg:flex)        ← ≥lg
├─ <main> <RouterView/> </main>              (max-w-[1200px] mx-auto px-4 lg:px-8)
├─ BottomNav         (lg:hidden)             ← <lg
└─ <OverlayHost/>    (MoreSheet, AccountMenu, NotificationsPanel, CoachSchedulePanel)
```

### 6.4 Overlay: satu state, presentasi per breakpoint
Komponen yang **struktur DOM-nya berbeda** mobile vs desktop dibungkus SATU primitive `ResponsiveOverlay` (atau pasangan `BottomSheet`/`SlideOverPanel` yang diberi makan satu state):

| Fitur | `< lg` | `≥ lg` | State |
|---|---|---|---|
| Account Menu | bottom sheet | dropdown anchored | `useAccountMenu` / local |
| Notifications | bottom sheet | dropdown/panel kanan | `useNotificationsStore` open flag |
| Coach Schedule | full-screen sheet | slide-in panel kanan + overlay redup | `useBookingStore` (coachId terbuka) |
| Filter (Coaches/Token) | bottom sheet | bar inline | local state per view |

Aturan: **logika & data identik**, hanya wrapper presentasi yang beda (pilih via `useBreakpoint().isDesktop`). Header sticky + cara tutup jelas + **focus trap** + klik-luar menutup + `Esc` menutup.

### 6.5 `useBreakpoint()` contract
```ts
export function useBreakpoint(): {
  width: Readonly<Ref<number>>
  isMobile: ComputedRef<boolean>    // < 768
  isTablet: ComputedRef<boolean>    // 768–1023
  isDesktop: ComputedRef<boolean>   // >= 1024
}
```
Satu listener `resize` (atau `matchMedia`), di-share (module singleton) supaya tidak banyak listener. SSR-safe guard (`typeof window`).

---

## 7. Data layer contract (`types` → `mocks` → `services` → `stores`)

### 7.1 Pola async seragam (WAJIB — sumber konsistensi 3-state)
```ts
// types/async.ts
export type Status = 'idle' | 'loading' | 'success' | 'error'
export interface AsyncState<T> {
  data: T | null
  status: Status
  error: string | null
}
```
Setiap store ekspos resource sebagai `AsyncState<T>` + action `loadX()`. Komponen render:
`status==='loading'`→Skeleton · `status==='error'`→ErrorState(@retry=loadX) · `success && isEmpty(data)`→EmptyState · else konten.
(Boleh dibungkus composable `useAsync<T>(fn)` agar tidak berulang — opsional tapi disarankan.)

### 7.2 Interfaces (`src/types/`)
```ts
// coach.ts
export interface Coach {
  id: string
  name: string
  avatarUrl: string | null        // null → Avatar inisial
  rating: number | null           // 0–5; null → sembunyikan bintang
  location: string | null         // null/"-" → sembunyikan baris
  country: string | null
  languages: string[]             // ['English','Indonesian']
  tokenCost: number               // "x tokens"
  recurring: boolean
}

// schedule.ts
export type SlotStatus = 'available' | 'selected' | 'booked' | 'past' | 'full'
export interface ScheduleSlot {
  id: string
  coachId: string
  start: string                   // ISO 8601 + offset
  end: string
  timezone: string                // IANA, mis. 'Asia/Jakarta'
  status: SlotStatus
  tokenCost: number
}
export interface DaySchedule { day: string; start: string; end: string } // tabel mingguan

// appointment.ts
export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled'
export interface Appointment {
  id: string
  coachId: string
  coachName: string
  start: string; end: string; timezone: string
  status: AppointmentStatus
  level: string | null            // 'A2 neoPrep+'
  joinUrl: string | null
  recordingUrl: string | null
}

// token.ts
export interface TokenSummary { balance: number; used: number; refunded: number }
export interface TokenType { id: string; label: string; available: number; total: number | null }
export type TransactionStatus = 'booked' | 'completed' | 'cancelled' | 'refunded'
export interface Transaction {
  id: string
  index: number                   // kolom '#'
  coachName: string
  status: TransactionStatus
  debit: number | null            // −n token (danger)
  credit: number | null           // +n token (success)
  date: string                    // ISO
  certificationLevel: string | null
  recordingUrl: string | null
}

// profile.ts
export interface Profile {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
  phone: string | null
  country: string | null
  nativeLanguage: string | null   // chip; null → 'Not set'
  timezone: string | null
  currentLevel: string | null
}

// notification.ts
export type NotificationGroup = 'today' | 'yesterday' | 'earlier'
export interface NotificationItem {
  id: string; title: string; body: string
  createdAt: string               // ISO → derive group
  read: boolean
}

// records.ts
export interface WeeklyPoint { weekLabel: string; points: number }
export interface Certificate { id: string; title: string; awardedAt: string | null }
export interface RecordsMetrics {
  pointsEarned: number | null
  pointsToComplete: number | null
  studyTimeMinutes: number | null // null → '—' / '0:00', JANGAN NaN
  masteryTests: number | null
  coachingSessions: number | null
  progressToCertificate: number | null  // 0–100
  currentCourse: string | null
  currentLevelGoal: string | null
  weeklyPoints: WeeklyPoint[]     // [] → chart empty state
  certificates: Certificate[]     // [] → empty state
}

// precall.ts
export type PrecallStatus = 'not-tested' | 'running' | 'ok' | 'failed'
export interface PrecallTest { id: 'camera'|'microphone'|'speaker'|'network'; label: string; status: PrecallStatus }
```

### 7.3 Services (`src/services/`) — async, swappable
Semua balikan `Promise<…>`, baca dari `mocks/`, simulasi latency kecil. Berinterface seperti API asli (mudah ganti ke `fetch`/`axios` di F6). **Normalisasi defensif di sini** (mapper): paksa `NaN`/`undefined`/`''` → `null`; pastikan array selalu array.

```ts
// coaches.service.ts
export function fetchCoaches(filter?: CoachFilter): Promise<Coach[]>
export function fetchCoach(id: string): Promise<Coach | null>
export function fetchCoachSchedule(coachId: string): Promise<{ week: DaySchedule[]; slots: ScheduleSlot[] }>
// booking.service.ts
export function fetchAppointments(mode: 'upcoming' | 'history'): Promise<Appointment[]>
export function createAppointment(input: { coachId: string; slotId: string }): Promise<Appointment>
// tokens.service.ts
export function fetchTokenSummary(): Promise<TokenSummary>
export function fetchTokenTypes(): Promise<TokenType[]>
export function fetchTransactions(filter?: TxFilter): Promise<Transaction[]>
// profile.service.ts
export function fetchProfile(): Promise<Profile>
export function updateProfile(patch: Partial<Profile>): Promise<Profile>
// notifications.service.ts
export function fetchNotifications(): Promise<NotificationItem[]>
export function markAllRead(): Promise<void>
// records.service.ts
export function fetchRecords(courseId?: string): Promise<RecordsMetrics>
```

### 7.4 Stores (`src/stores/`, Pinia setup store)
`coaches`, `booking`, `tokens`, `profile`, `notifications`, `records`. Tiap store: simpan `AsyncState<T>`, action `loadX()` (set loading→panggil service→success/error), getters turunan (mis. `unreadCount`, `groupedNotifications`, status→tone mapping). Komponen HANYA bicara ke store, tidak ke service langsung.

**Mock WAJIB sertakan kasus rusak** (studyTime null, coach tanpa avatar/lokasi, transaksi kosong, notifikasi kosong) supaya fallback teruji — prototype lama menampilkan `NaN` & dump bahasa; UI harus tahan banting.

---

## 8. Routing (`src/router/`)
Semua view **lazy-loaded**. Coach Schedule = **overlay**, bukan route.

| Path | Name | View |
|---|---|---|
| `/` | — | redirect → `/dashboard` |
| `/dashboard` | dashboard | `DashboardView` |
| `/coaches` | coaches | `CoachesView` |
| `/book` | book | `BookView` |
| `/records` | records | `MyRecordsView` |
| `/precall` | precall | `PrecallTestView` |
| `/token` | token | `TokenView` |
| `/help` | help | `HelpView` |
| `/profile` | profile | `ProfileView` |
| `/settings` | settings | `SettingsView` |
| `/:pathMatch(.*)*` | not-found | `NotFoundView` (minimal) |

Auth/login = **out of scope** (F6). Tinggalkan `// TODO(F6): auth guard` di router, jangan implement.

---

## 9. Aksesibilitas & state (berlaku semua view)
- Keyboard penuh untuk dropdown/sheet/menu; **focus trap** di overlay; `Esc` & klik-luar menutup; kembalikan fokus ke trigger saat tutup.
- `aria-label`/`aria-current`/`role` benar; ikon-only button punya label.
- Target sentuh ≥44px; jarak ≥8px; kontras AA (≥4.5:1).
- Body & input ≥16px (cegah auto-zoom iOS).
- Timezone label di SEMUA tampilan waktu/slot/booking.
- Tidak ada `NaN`/`-`/null mentah bocor ke user.

## 10. Testing (Vitest, sanity-level)
Wajib: `BaseButton` (varian, disabled, loading), `Avatar` (fallback inisial). Disarankan: `useBreakpoint` (ambang), normalisasi service (NaN→null, []), satu action store (loading→success/error). Bukan full coverage — cukup cegah regresi fondasi.

---

## 11. Build sequence — Work Orders (tempel ke chat Sonnet, berurutan)

> Tiap Work Order: implementer pakai **Context7** utk API terkini, ikuti seksi arsitektur yang ditunjuk, JANGAN copy HTML prototype, commit dgn pesan persis. Pisah commit per fitur bila diminta.

### WO‑1 — Tokens + UI components (ikuti §3, §4, §5, §10)
```
Bersihkan demo scaffold dulu: hapus components/HelloWorld.vue, TheWelcome.vue, WelcomeItem.vue,
components/icons/*, views/AboutView.vue & HomeView.vue (akan diganti), assets/base.css, dan
import demo di main.ts. Pasang lucide-vue-next.
Fetch design system, baca README-nya: https://api.anthropic.com/v1/design/h/_PZUmdGmIAAdAYCdbwTtPg
Implement sebagai FONDASI (bukan menyalin HTML):
1. Buat src/styles/tokens.css = blok @theme di neo-frontend-architecture.md §4 PERSIS;
   import di main.css setelah tailwindcss. Cross-check hex dgn DS live; flag beda ke orchestrator.
2. Bangun komponen ui/ sesuai tabel kontrak §5 (BaseButton, BaseInput, BaseSelect, BaseCard,
   StatusBadge, Avatar, Chip, StarRating, Skeleton, EmptyState, ErrorState). Idiomatik, bertipe, aksesibel.
3. Unit test sanity: BaseButton & Avatar.
Commit: "feat(ui): design tokens + base components from neo DS"
```

### WO‑2 — Responsive AppShell + routing (ikuti §6, §8) — REKONSILIASI
```
Fetch KEDUA design file, baca README masing-masing (simpan sbg referensi semua halaman):
- Mobile:  https://api.anthropic.com/v1/design/h/9X67_4IjZDPoDdreFx4T1w?open_file=neo+App+Shell.dc.html
- Desktop: https://api.anthropic.com/v1/design/h/KzD9Y_e_f12qR2Tiik93Mg?open_file=neo+Desktop.dc.html
Bangun SATU AppShell responsif (§6.3), navigasi SATU sumber (§6.2 useNavigation + tabel placement),
overlay satu-state-dua-presentasi (§6.4), useBreakpoint (§6.5).
- <lg: BottomNav (Dashboard,Coaches,Book*,MyRecords,More) + MoreSheet (Precall,Token,Help).
- ≥lg: SidebarNav 7 item + logo. TopBar: logo, NotificationsPanel (bell), AccountMenu (avatar).
- AccountMenu: Profile, Settings, Logout(danger) — Logout HANYA di sini. Notifications: grup
  Today/Yesterday, unread dot, "Mark all as read". Keduanya: <lg sheet, ≥lg dropdown/panel; focus trap.
- Router (§8): semua route lazy; Coach Schedule = overlay, bukan route; NotFoundView minimal.
Commit: "feat(layout): responsive AppShell + router (reconcile mobile/desktop nav)"
```

### WO‑3 — Data layer (ikuti §7)
```
Bangun data layer swappable (frontend-only):
- types/ (§7.2 semua interface + async.ts), mocks/ (fixture realistis + KASUS RUSAK: null/empty/NaN),
- services/ (§7.3 signatures; normalisasi defensif: NaN/''/undefined → null, array selalu array),
- stores/ Pinia (§7.4: coaches, booking, tokens, profile, notifications, records; pola AsyncState + loadX).
Komponen nanti hanya lewat store, tak panggil service langsung.
Commit: "feat(data): typed mock services + Pinia stores (swappable for real API)"
```

> ## ⛔ GATE 3 — STOP & REVIEW (masterplan)
> Setelah WO‑3, orchestrator review fondasi: **token konsisten? komponen aksesibel? shell BENAR satu app (satu nav/router/store, beda presentasi saja)? data layer defensif (3-state jalan)?** Kalau shell terasa "dua app" → ULANG WO‑2. Jangan lanjut ke halaman sebelum lulus gate ini.

### WO‑4 — Static pages: Help, Profile, Settings (ikuti §7 store, §9)
```
Implement HelpView, ProfileView, SettingsView (route, responsif, pakai ui + store; 3-state).
- Help: accordion search FAQ, satu item terbuka; ≥lg max-w ~760px center.
- Profile: header card + Personal/Additional Info; field kosong → "Not set" (italic redup);
  Native Language → chip; ≥lg 2-kolom label–value, <lg stack; primary "Update Profile".
- Settings: Change Password (current/new/confirm, show/hide, meter kekuatan, "Passwords match",
  submit disable sampai valid); ≥lg kartu max-w 640px, jangan melayang.
Commit per fitur.
```

### WO‑5 — Records & utility: Dashboard, MyRecords, Precall (ikuti §7, §9)
```
Implement DashboardView, MyRecordsView, PrecallTestView (responsif, 3-state, fallback "—" bukan NaN).
- Dashboard: <lg single-column (hero "Next session" + ringkasan minggu + token + CTA Book);
  ≥lg 2-kolom (konten kiri + rail kanan). Countdown sesi; Join disable sampai dekat waktu.
- MyRecords: kartu metrik (≥lg baris 4-kolom, <lg grid 2-kolom), chart "Last 4 Weeks" full-width,
  Certificates. Empty/skeleton tiap blok.
- Precall: <lg stack, ≥lg 2-kolom; tiap test badge status (§7 PrecallStatus); preview kamera +
  state "No signal/permission blocked"; ringkasan "Readiness X/4".
Commit per fitur.
```

### WO‑6 — Booking core: Coaches, Book, Coach Schedule (ikuti §6.4, §7) — TERSULIT
```
Implement CoachesView, BookView, CoachSchedulePanel (responsif).
- Coaches: <lg filter bottom sheet + list 1-kolom; ≥lg filter bar + grid 3–4 kolom. Card fully
  clickable, Avatar inisial, sembunyikan lokasi kosong, EmptyState bila kosong.
- Book: <lg stack (kalender→coach), ≥lg 2-kolom; mode segmented (Upcoming/History/Create); timezone.
- Coach Schedule: SATU panel (§6.4) — <lg full-screen sheet, ≥lg slide-in kanan+overlay. Isi: jadwal
  mingguan (accordion), grid slot 3-kolom (selected=primary, past/full=disabled), label tanggal+timezone,
  footer sticky (ringkasan slot, Confirm primary disable-sampai-pilih, Cancel danger). Picu dari card coach.
Commit per fitur.
```

### WO‑7 — Token (satu data, dua presentasi) (ikuti §6.4, §7)
```
Implement TokenView dari SATU sumber transaksi.
- Summary Balance/Used/Refunded: kartu (≥lg 3-kolom). Token-type cards: ≥lg baris/grid, <lg scroll horizontal.
- Riwayat SATU dataset: <lg list TransactionCard (coach+badge, tanggal•jam, −/+ token berwarna, level,
  aksi full-width); ≥lg TABEL (#,Coach,Status,Debit,Credit,Date,Time,Cert Level,Recording).
- Filter (status/tanggal/coach): <lg bottom sheet, ≥lg bar inline. EmptyState bila kosong.
Commit: "feat(token): responsive token summary + history (cards <lg, table >=lg)"
```

### WO‑8 — QA, a11y, deploy, handoff (ikuti §9; Context7 bila perlu)
```
1. Responsif QA tiap halaman di 390/768/1280 — tak ada layout pecah; <lg mobile, ≥lg desktop.
2. A11y: keyboard dropdown/sheet/menu, focus trap overlay, aria-label, kontras AA, target ≥44px.
3. Performa: lazy route, audit bundle (rollup-plugin-visualizer), code-split yang berat.
4. npm run build + preview BERSIH; perbaiki error TS/ESLint.
5. README.md: cara jalan (dev/build/test), struktur folder, DI MANA ganti mock→API (services/+stores/),
   token desain (styles/tokens.css), catatan deploy Vercel/Netlify (SPA fallback).
6. Commit + push; pastikan preview deploy hijau.
```

---

## 12. Definition of Done & guardrails

**"Apakah ini SATU app?" — cek tiap akhir WO:**
- [ ] Hanya ada SATU array navigasi (`useNavigation`); BottomNav & SidebarNav meng-import-nya.
- [ ] Hanya ada SATU router, SATU store per domain. Tidak ada `*Mobile.vue`/`*Desktop.vue` kembar.
- [ ] Beda mobile↔desktop = utility Tailwind / wrapper presentasi; logika & data identik.
- [ ] Coach Schedule = satu komponen panel, dua presentasi; bukan dua komponen.

**Defensif & state:**
- [ ] Tidak ada `NaN`/`null`/`-` bocor; angka null → `—`/`Not set`/empty.
- [ ] Tiap view data punya loading/empty/error nyata (uji via mock rusak).

**Idiomatik & a11y:**
- [ ] `<script setup lang="ts">`, props bertipe, tidak ada HTML transpile dari `.dc.html`.
- [ ] Keyboard + focus trap + kontras AA + target ≥44px + timezone tampil.

**Build:** `npm run lint && npm run build && npm run test` hijau sebelum commit tiap WO.

---

## 13. Keputusan & asumsi yang di-flag (orchestrator boleh override)

1. **Logout — DEDUP.** Spec sumber kontradiktif (sidebar desktop daftarkan Logout, tapi Prompt 2 "Logout HANYA di Account Menu"). **Keputusan arsitek:** Logout = aksi di **Account Menu saja**, BUKAN NavItem; sidebar tampil 7 item nav. Alasan: aturan "jangan dobel" eksplisit + single-source. → override bila klien minta Logout tetap di dasar sidebar.
2. **Hapus demo scaffold di WO‑1.** Home/About/HelloWorld/TheWelcome/icons/base.css dibuang utk blank slate bersih. (Disetujui implisit oleh "ini hanya fondasi".)
3. **Folder `src/utils/`** ditambah utk helper murni (format tanggal/timezone/angka, inisial). Ekstensi dari struktur dasar di pack.
4. **Font** Inter (body) + Plus Jakarta Sans (display) = **proposal**, bukan font brand. Ganti bila brand guide punya typeface. [GATE 0]
5. **Hex brand** terukur dari screenshot; `--color-cyan-50` derived. Konfirmasi semua vs DS live + brand guide sebelum produksi. [GATE 0]
6. **Icon set = Lucide.** Bila DS live menentukan set lain (mis. Phosphor), ikuti DS.

---

## 14. Risiko (gabungan packs + graph)
1. **Dua layout tak harmonis (utama).** Mitigasi: GATE 3 + checklist §12 "satu app".
2. **Claude Code ingin transpile HTML `.dc.html`.** Awasi: minta Vue idiomatik, bukan div dump.
3. **Bug data warisan (NaN/dump bahasa).** Bukan tugas memperbaiki sumber; UI defensif (data layer + fallback). Akar = backend (F6).
4. **Brand "mirip" bukan "persis".** Utang GATE 0 — konfirmasi hex/font.
5. **Fetch `.dc.html` bisa meleset** (research preview). Bila ekstraksi salah, suplai screenshot per halaman sbg referensi tambahan; pecah sesi bila konteks besar.
6. **Auth absen** — by design (F6). Jangan implement di F4; sisakan TODO guard saja.
```

---

**Ringkas:** mulai dari WO‑1, berhenti di GATE 3, jangan biarkan jadi "dua app".
