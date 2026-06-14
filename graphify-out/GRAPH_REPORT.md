# Graph Report - neo-2026  (2026-06-15)

## Corpus Check
- 34 files · ~8,503 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 182 nodes · 153 edges · 31 communities (26 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dd9b24fc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 19|Community 19]]

## God Nodes (most connected - your core abstractions)
1. `scripts` - 12 edges
2. `neo Frontend — Prompt Sequence untuk Claude Code (Vue 3, responsif)` - 12 edges
3. `neo — Design System Spec (untuk Claude Design)` - 10 edges
4. `Prompt per layar (urut mudah → sulit)` - 10 edges
5. `neo — Masterplan End-to-End` - 8 edges
6. `Fase per fase` - 8 edges
7. `vue-scaffold` - 6 edges
8. `neo — Desktop / Responsive Prompt Pack (untuk Claude Design)` - 6 edges
9. `compilerOptions` - 5 edges
10. `Project Setup` - 5 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (31 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (25): devDependencies, eslint, eslint-config-prettier, eslint-plugin-oxlint, eslint-plugin-vue, jiti, jsdom, npm-run-all2 (+17 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (15): Artefak (file index), Batas scope (baca dulu — ini menentukan ekspektasi), Decision gates (ringkas), F0 — Fondasi brand & keputusan, F1 — Design System  ·  `neo-design-system-spec.md`, F2 — Prototype Mobile  ·  `neo-mobile-prompt-pack.md`, F3 — Prototype Desktop  ·  `neo-desktop-prompt-pack.md`  ◄ KAMU DI SINI, F4 — Frontend Vue  ·  `neo-frontend-vue-prompt-pack.md` (+7 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (14): 1. Help — mudah (accordion sudah mobile-friendly), 2. Precall Test — mudah (stack + perjelas status), 3. MyRecords — mudah-sedang (stack + WAJIB benahi state rusak), 4. Coaches (list & filter) — sedang, 5. Book A Coach — sedang, 6. Coach Schedule / Detail booking — sulit (drawer → full-screen sheet), 7. Token (saldo + history) — sulit (tabel 9 kolom → list kartu), Aturan mobile-first global (berlaku ke SEMUA layar) [High — Apple HIG & Material] (+6 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (12): Catatan & risiko (transparan), neo Frontend — Prompt Sequence untuk Claude Code (Vue 3, responsif), Prinsip yang dipegang di SEMUA prompt, Prompt 0 — Scaffold & fondasi proyek, Prompt 1 — Design tokens + komponen UI dasar (dari Design System), Prompt 2 — App Shell responsif + routing (REKONSILIASI mobile & desktop), Prompt 3 — Data layer (types + mock + store) terpisah dari UI, Prompt 4 — Halaman statis (easy): Help, Profile, Settings (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.17
Nodes (12): scripts, build, build-only, dev, format, lint, lint:eslint, lint:oxlint (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.18
Nodes (10): 0. Setup di Claude Design (urutan benar), 1. Brand atoms — DIKUNCI (jangan diubah), 2. Color system — DIBANGUN ULANG (hue tetap, peran diperjelas), 3. Typography — DIBANGUN ULANG (proposal, bukan font lama), 4. Spacing & layout — DIBANGUN ULANG, 5. Radius & elevation — DIBANGUN ULANG, 6. Komponen — DIBANGUN ULANG (inti perbaikan), 7. Ikonografi (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.18
Nodes (10): dependencies, pinia, vue, vue-router, engines, node, name, private (+2 more)

### Community 7 - "Community 7"
Cohesion: 0.18
Nodes (10): Compile and Hot-Reload for Development, Customize configuration, Lint with [ESLint](https://eslint.org/), Project Setup, Recommended Browser Setup, Recommended IDE Setup, Run Unit Tests with [Vitest](https://vitest.dev/), Type-Check, Compile and Minify for Production (+2 more)

### Community 8 - "Community 8"
Cohesion: 0.20
Nodes (9): compilerOptions, noUncheckedIndexedAccess, paths, strict, tsBuildInfoFile, exclude, extends, include (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (7): compilerOptions, lib, tsBuildInfoFile, types, exclude, extends, include

### Community 10 - "Community 10"
Cohesion: 0.29
Nodes (6): Aturan global desktop (≥1024px) — reverse transforms, neo — Desktop / Responsive Prompt Pack (untuk Claude Design), Per halaman (≥1024px) — reverse transform, Prompt 0 — Shell responsif (jalankan dulu), Risiko, Verifikasi (jangan diasumsikan jalan)

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (6): categories, correctness, env, browser, plugins, $schema

### Community 13 - "Community 13"
Cohesion: 0.40
Nodes (4): printWidth, $schema, semi, singleQuote

## Knowledge Gaps
- **130 isolated node(s):** `$schema`, `plugins`, `browser`, `correctness`, `$schema` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 0` to `Community 6`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `scripts` connect `Community 4` to `Community 6`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `$schema`, `plugins`, `browser` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._