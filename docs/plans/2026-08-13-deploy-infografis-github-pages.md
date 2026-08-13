# Deploy Infografis Keharmonisan Pasangan ke GitHub Pages

> **Untuk Agent:** Sub-skill wajib saat eksekusi: `executing-plans` — jalankan task-by-task, commit di tiap gate.

**Goal:** Meng-hardening `infografis_keharmonisan_pasangan.html` menjadi situs statis single-file (Tailwind pre-built + inline, CDN di-pin, meta/OG tags, aksesibilitas, fallback noscript) lalu deploy ke GitHub Pages.

**Architecture:** 1 file `index.html` self-contained — semua CSS hasil build Tailwind CLI di-inline ke `<head>`, Chart.js & Google Fonts dari CDN yang di-pin versinya, asset PNG/PDF ditautkan sebagai sumber riset. Deploy dari branch `main`, source di root repo. Repo PUBLIK (Pages gratis = repo publik).

**Tech Stack:** HTML/CSS/JS vanilla, Tailwind CSS v3 (CLI build, sekali pakai), Chart.js v4 (CDN pinned), Google Fonts Plus Jakarta Sans, GitHub Pages, `gh` CLI (opsional).

**Konteks:** Folder saat ini BUKAN git repo (belum ada `.git`/remote). Isi folder: `infografis_keharmonisan_pasangan.html` (39KB), `Panduan_Harmoni_Hubungan_Beda_Usia.png` (5.9MB), `Dinamika Age-Sex Gap....pdf` (247KB). Verifikasi headless Chrome: halaman load tanpa console error; 2 chart Chart.js render; tab Gottman, slider Emotional Bank Account, dan kalkulator finansial semuanya berfungsi.

---

## Task 1: Prasyarat & Setup Tooling Build

**Files:**
- Create: `package.json` (via `npm init -y`)
- Create: `tailwind.config.js`
- Create: `input.css`
- Create: `.gitignore`

**Step 1: Cek tooling tersedia**

```bash
node -v && npm -v
```
Expected: `v18+` dan `10+`. Jika node/npm tidak ada, skip Task 1 & 4 (fallback: biarkan Play CDN, tandai sebagai tech-debt).

**Step 2: Init npm + install Tailwind v3 (bukan v4 — class yang dipakai kompatibel v3)**

```bash
npm init -y
npm install -D tailwindcss@^3.4.0
npx tailwindcss --version
```
Expected: `3.4.x`.

**Step 3: Buat `tailwind.config.js`** (replikasi config yang tadinya inline di HTML — warna brand & font; class arbitrari `text-[#...]` tetap jalan otomatis):

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },
      colors: {
        brand: {
          teal: '#0F4C5C', coral: '#E36414', amber: '#FB8B24',
          crimson: '#9A031E', cream: '#FDFBF7', softgray: '#F1F5F9', dark: '#1E293B'
        }
      }
    }
  },
  plugins: []
};
```

**Step 4: Buat `input.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 5: Buat `.gitignore`**

```
node_modules/
tailwind.out.css
```

**Step 6: Commit**

```bash
git init -b main 2>/dev/null || true
git add .gitignore package.json package-lock.json tailwind.config.js input.css
git commit -m "chore: setup tooling build tailwind untuk deploy statis"
```

---

## Task 2: Restrukturisasi Folder & Rename File

**Files:**
- Rename: `infografis_keharmonisan_pasangan.html` → `index.html`
- Rename: `Dinamika Age-Sex Gap....pdf` → `sumber-riset.pdf`
- Move: `Panduan_Harmoni_Hubungan_Beda_Usia.png` → `assets/panduan-lengkap.png`

**Step 1: Eksekusi**

```bash
mv "infografis_keharmonisan_pasangan.html" index.html
mkdir -p assets
mv "Panduan_Harmoni_Hubungan_Beda_Usia.png" assets/panduan-lengkap.png
mv "Dinamika Age-Sex Gap dalam Hubungan Romantis dan Strategi Menjaga Keharmonisan (Konteks Utama  Indonesia).pdf" sumber-riset.pdf
```

**Step 2: Verifikasi struktur**

```bash
ls -R .
```
Expected (plus `docs/plans/...` dan file tooling):
```
.
├── index.html
├── assets/panduan-lengkap.png
├── sumber-riset.pdf
```

> Alasan: `index.html` → URL bersih `https://user.github.io/repo/`. Rename PDF → hilangkan spasi ganda yang berisiko di URL.

**Step 3: Commit**

```bash
git add -A && git commit -m "chore: rename ke index.html dan restrukturisasi assets"
```

---

## Task 3: Hardening `index.html`

**Files:**
- Modify: `index.html`

### Step 3a: Pin versi CDN

Ganti `<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>` dengan versi pin:

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.9"></script>
```

Cek versi stabil terbaru dulu: `npm view chart.js version` (pakai versi 4.x terbaru yang dikeluarkan). Google Fonts: biarkan (css2 API, stabil), opsional pin.

### Step 3b: Tambah meta description, OG tags, favicon, theme-color

Sisipkan tepat setelah tag `<title>...</title>`:

```html
<meta name="description" content="Harmoni Relasi Pasangan & Dinamika Komunikasi — visualisasi interaktif berbasis riset empiris age-gap, kerangka klinik Gottman, dan strategi komunikasi untuk pasangan di Indonesia.">
<meta property="og:type" content="website">
<meta property="og:title" content="Harmoni Relasi Pasangan & Dinamika Komunikasi">
<meta property="og:description" content="Infografis interaktif: dinamika age-gap, kerangka Gottman, kalkulator finansial proporsional, dan strategi komunikasi berbasis bukti.">
<meta property="og:image" content="assets/og-preview.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://<USER>.github.io/<REPO>/">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0F4C5C">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%230F4C5C' d='M12 21s-7.5-4.7-9.8-9C.6 8.6 2.5 5 6 5c2 0 3.3 1 4 2.3C10.7 6 12 5 14 5c3.5 0 5.4 3.6 3.8 7-2.3 4.3-9.8 9-9.8 9z'/%3E%3C/svg%3E">
```

Ganti `<USER>`/`<REPO>` dengan akun & nama repo target (diketahui di Task 7).

### Step 3c: Aksesibilitas — tabs

Grid tombol (Bagian 2): tambah `role="tablist"` + `aria-label` pada container, `role="tab"` + `aria-selected` + `aria-controls` pada tiap `<button>`, `role="tabpanel"` pada `#horseman-display`:

```html
<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4" role="tablist" aria-label="Empat Penunggang Gottman">
  <button onclick="switchHorseman('criticism')" id="tab-criticism" role="tab" aria-selected="true" aria-controls="horseman-display" class="tab-btn active ...">1. Criticism</button>
  <!-- button lain: aria-selected="false" -->
</div>
<div id="horseman-display" role="tabpanel" class="bg-[#FDFBF7] p-6 rounded-xl border border-slate-200 transition-all"></div>
```

Update fungsi `switchHorseman`:

```js
function switchHorseman(key) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    const activeTab = document.getElementById('tab-' + key);
    activeTab.classList.add('active');
    activeTab.setAttribute('aria-selected', 'true');
    // ...sisa kode sama
}
```

### Step 3d: Aksesibilitas — slider & status

Ubah blok slider (Bagian 2, Emotional Bank Account) dari `<span>` menjadi `<label for>` + `<output>`:

```html
<div class="flex justify-between text-xs font-bold mb-1">
    <label for="positive-range">Setoran Positif (Pujian, Sentuhan, Apresiasi)</label>
    <output id="positive-val" class="text-[#0F4C5C]">15</output>
</div>
<input type="range" id="positive-range" min="1" max="30" value="15" class="w-full accent-[#0F4C5C]" oninput="updateBankSimulator()">
```

(Lakukan hal sama untuk `negative-range`. Catatan: `<label>` menampung teks; tidak perlu `for` jika membungkus — gunakan `for`.)

Tambah `aria-live="polite"` pada `#ratio-result` dan `#ratio-status` agar hasil simulasi dibacakan screen reader.

### Step 3e: Aksesibilitas — canvas chart

```html
<canvas id="divorceRiskChart" role="img" aria-label="Grafik batang: peningkatan risiko perceraian relatif berdasarkan selisih usia pasangan"></canvas>
<canvas id="satisfactionTrajectoryChart" role="img" aria-label="Grafik garis: trajektori kepuasan hubungan pasangan sebaya versus beda usia besar"></canvas>
```

### Step 3f: Fallback noscript

Sisipkan tepat sebelum `</body>` (menggantikan area kosong `#horseman-display` saat JS mati):

```html
<noscript>
    <div class="max-w-6xl mx-auto px-4 my-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900">
        JavaScript nonaktif — grafik dan simulasi interaktif (tab Gottman, Emotional Bank Account, kalkulator finansial) tidak dapat ditampilkan. Aktifkan JavaScript untuk pengalaman lengkap.
    </div>
</noscript>
```

### Step 3g: Footer — tautan sumber riset

Di dalam `<footer>`, tambah baris tautan:

```html
<div class="flex justify-center gap-4">
    <a href="sumber-riset.pdf" class="underline hover:text-slate-500" target="_blank" rel="noopener">Unduh Sumber Riset (PDF)</a>
    <a href="assets/panduan-lengkap.png" class="underline hover:text-slate-500" target="_blank" rel="noopener">Lihat Panduan Lengkap (Gambar)</a>
</div>
```

**Step 4: Verifikasi edit**

```bash
grep -c "og:image" index.html        # ≥ 1
grep -c 'role="tablist"' index.html  # 1
grep -c "sumber-riset.pdf" index.html # ≥ 1
grep -c "cdn.jsdelivr.net/npm/chart.js@" index.html  # 1 (versi ter-pin)
```

**Step 5: Commit**

```bash
git add index.html && git commit -m "feat: hardening index.html — pin CDN, meta/OG, a11y, fallback noscript, tautan sumber riset"
```

---

## Task 4: Build Tailwind CSS & Inline ke HTML

**Files:**
- Create: `inline-css.mjs`
- Modify: `index.html`

**Step 1: Build CSS (scan class dari index.html)**

```bash
npx tailwindcss -i input.css -o tailwind.out.css --minify --content ./index.html
ls -la tailwind.out.css
```
Expected: file CSS ter-generate (biasanya 15–40KB) dan berisi rule `.bg-gradient-to-r`:

```bash
grep -c "bg-gradient-to-r" tailwind.out.css  # ≥ 1
```

> Catatan: semua class di JS template literal (`switchHorseman`, status warna slider) berupa string literal — ikut ter-scan. Tidak ada class yang dibangun dinamis.

**Step 2: Buat `inline-css.mjs`** (hapus Play CDN + config script, sisipkan CSS hasil build):

```js
import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const css = readFileSync('tailwind.out.css', 'utf8');

const cleaned = html
  .replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>\s*/, '')
  .replace(/<script>\s*tailwind\.config\s*=\s*\{[\s\S]*?<\/script>\s*/, '')
  .replace('</head>', `<style id="tailwind">${css}</style>\n</head>`);

writeFileSync('index.html', cleaned);
console.log('OK: CSS inline; Play CDN & tailwind.config dihapus.');
```

**Step 3: Jalankan & verifikasi**

```bash
node inline-css.mjs
grep -c "cdn.tailwindcss.com" index.html   # 0 → Play CDN hilang
grep -c "tailwind.config" index.html      # 0 → config script hilang
grep -o '<style id="tailwind">' index.html # 1 → CSS inline ada
rm tailwind.out.css
```

**Step 4: Sanity check render** — jalankan server lokal & buka via Chrome headless (lihat Task 6 untuk detail command; jika Task 6 belum dieksekusi, cukup pastikan tidak ada class yang hilang dengan membandingkan screenshot sebelum/sesudah).

**Step 5: Commit**

```bash
git add inline-css.mjs index.html && git commit -m "perf: replace Tailwind Play CDN dengan CSS pre-built inline"
```

---

## Task 5: Kompres PNG → og-image

**Files:**
- Create: `assets/og-preview.jpg`

**Step 1: Cek tool yang tersedia**

```bash
which ffmpeg convert magick 2>/dev/null; python3 -c "import PIL; print('PIL OK')" 2>/dev/null
```

**Step 2: Kompres ke ≤1200px lebar, kualitas web**

Prioritas (pakai yang tersedia pertama):
- ffmpeg (tersedia via cache playwright jika ada): `ffmpeg -y -i assets/panduan-lengkap.png -vf "scale=1200:-1" -q:v 4 assets/og-preview.jpg`
- ImageMagick: `convert assets/panduan-lengkap.png -resize 1200x -quality 82 assets/og-preview.jpg`
- Python PIL: script singkat resize + save quality=82

**Step 3: Verifikasi ukuran**

```bash
ls -la assets/og-preview.jpg
```
Expected: **≤ 300KB** (WhatsApp & Facebook og:image aman di bawah ~5MB; target ideal <200KB). Jika masih besar, turunkan kualitas/lebar ke 900px.

Jika tidak ada tool sama sekali: minta user kompres manual via https://squoosh.app lalu taruh hasilnya sebagai `assets/og-preview.jpg`.

**Step 4: Commit**

```bash
git add assets/og-preview.jpg && git commit -m "assets: tambah og-preview terkompres untuk social sharing"
```

---

## Task 6: Verifikasi Lokal (gate sebelum deploy)

**Step 1: Serve via HTTP** (mirip environment GitHub Pages):

```bash
setsid python3 -m http.server 8123 --bind 127.0.0.1 > /tmp/httpserver.log 2>&1 < /dev/null &
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8123/index.html   # 200
```

**Step 2: Screenshot + cek console error (Chrome headless)**

```bash
google-chrome --headless=new --disable-gpu --no-sandbox --no-proxy-server \
  --screenshot=/tmp/verify_desktop.png --window-size=1280,2400 --hide-scrollbars \
  --virtual-time-budget=15000 --enable-logging=stderr --v=0 \
  "http://127.0.0.1:8123/index.html" 2>/tmp/verify_err.log
```
Expected: screenshot ter-generate; `grep -icE "net::ERR|Uncaught|Failed to load resource" /tmp/verify_err.log` = `0`.

**Step 3: Verifikasi interaktivitas via dump-dom**

```bash
google-chrome --headless=new --disable-gpu --no-sandbox --no-proxy-server \
  --dump-dom --virtual-time-budget=15000 "http://127.0.0.1:8123/index.html" 2>/dev/null > /tmp/dom_verify.html
grep -o '<canvas[^>]*style=' /tmp/dom_verify.html | wc -l          # 2 → Chart.js render
grep -o 'Perilaku Destruktif' /tmp/dom_verify.html | wc -l          # ≥1 → tab Gottman terisi
grep -o 'Kontribusi Pasangan A' /tmp/dom_verify.html | wc -l        # ≥1 → kalkulator jalan
grep -o 'Rasio Aktual Anda' /tmp/dom_verify.html | wc -l            # ≥1 → slider jalan
grep -o '<style id="tailwind">' /tmp/dom_verify.html | wc -l        # 1 → CSS inline aktif
```

**Step 4: Cek mobile (tidak overflow horizontal)**

```bash
google-chrome --headless=new --disable-gpu --no-sandbox --no-proxy-server \
  --screenshot=/tmp/verify_mobile.png --window-size=375,812 --hide-scrollbars \
  --virtual-time-budget=15000 "http://127.0.0.1:8123/index.html"
```
Expected: layout menumpuk (grid → 1 kolom), tidak ada konten terpotong.

**Step 5: Matikan server**

```bash
pkill -f "http.server 8123" || true
```

**Gate:** Semua langkah lolos → lanjut Task 7. Ada error → perbaiki sebelum deploy.

---

## Task 7: Git Init, Buat Repo GitHub, Push

> **Ganti `<USER>` dan `<REPO>`** dengan akun & nama repo milik user. Repo harus **PUBLIC** (GitHub Pages gratis).

**Step 1: Commit akhir + cek status**

```bash
git status            # pastikan hanya file yang diinginkan
git add -A
git commit -m "chore: finalisasi aset dan plan deploy"
```

**Step 2: Buat repo (pilih salah satu)**

Via `gh` CLI (jika terautentikasi — cek `gh auth status`):
```bash
gh repo create <REPO> --public --source . --push --description "Infografis interaktif: Harmoni Relasi Pasangan & Dinamika Komunikasi"
```

Manual (jika tanpa gh): user buat repo kosong di github.com → lalu:
```bash
git remote add origin https://github.com/<USER>/<REPO>.git
git push -u origin main
```

**Step 3: Verifikasi push**

```bash
git log --oneline -1 && git remote -v
```
Expected: commit terbaru terlihat, origin menunjuk ke `<USER>/<REPO>`.

---

## Task 8: Aktifkan GitHub Pages

**Step 1: Pilih salah satu**

Via `gh`:
```bash
gh api repos/<USER>/<REPO>/pages -f "source[branch]=main" -f "source[path]=/"
```
Expected: `201 Created`.

Manual: repo di github.com → **Settings → Pages → Build and deployment → Source: "Deploy from a branch" → Branch: `main` / `(root)` → Save**.

**Step 2: Tunggu build pertama**

```bash
sleep 120
gh api repos/<USER>/<REPO>/pages --jq '.status, .html_url' 2>/dev/null
```
Expected: `built` (atau `building` — ulangi setelah beberapa menit). Build pertama umumnya 1–5 menit.

---

## Task 9: Verifikasi Live

**Step 1: Buka URL & cek fungsional**

Buka `https://<USER>.github.io/<REPO>/` — checklist:
- [ ] Header gradient + badge + kartu statistik tampil
- [ ] 2 chart Chart.js render (bar risiko perceraian + line trajektori)
- [ ] Tab Gottman berganti (klik Criticism/Contempt/Defensiveness/Stonewalling)
- [ ] Slider Emotional Bank Account mengubah rasio & status warna
- [ ] Kalkulator finansial menghitung ulang kontribusi A/B
- [ ] Footer link `sumber-riset.pdf` & `assets/panduan-lengkap.png` bisa diunduh/dibuka (200 OK)

**Step 2: Cek aset publik**

```bash
curl -sI https://<USER>.github.io/<REPO>/assets/og-preview.jpg | head -1   # 200 OK
curl -sI https://<USER>.github.io/<REPO>/sumber-riset.pdf | head -1        # 200 OK
curl -sI https://<USER>.github.io/<REPO>/ | head -1                        # 200 OK
```

**Step 3: Cek social preview** (opsional) — tempel URL di WhatsApp/Discord debugger (`https://www.opengraph.xyz` atau card validator Twitter) — og:image harus tampil.

**Step 4: Screenshot live (desktop + mobile 375px)** — Chrome headless terhadap URL live; bandingkan dengan verifikasi lokal. Expected: identik, tanpa console error.

---

## Task 10: Opsional / Backlog

- **README.md** — judul, deskripsi, cara rebuild CSS (`npx tailwindcss ...` + `node inline-css.mjs`), tautan live.
- **Custom domain** — buat `CNAME` berisi domain (mis. `keharmonisan.example.com`) di root repo + set DNS CNAME di registrar → Settings → Pages → Custom domain. Update `og:url`.
- **Perf lanjutan** — preload Google Fonts, `fetchpriority` pada og:image; ukur ulang dengan Lighthouse.

---

## Ringkasan File yang Dibuat/Diubah

| File | Aksi |
|---|---|
| `index.html` | Rename dari `infografis_keharmonisan_pasangan.html` + hardening (CDN pin, meta/OG, a11y, noscript, footer link) + CSS inline |
| `assets/panduan-lengkap.png` | Move dari root (PNG 5.9MB asli) |
| `assets/og-preview.jpg` | Baru — kompresi untuk social sharing |
| `sumber-riset.pdf` | Rename dari PDF dengan spasi |
| `tailwind.config.js`, `input.css`, `inline-css.mjs`, `package.json`, `.gitignore` | Tooling build (dipakai sekali; tetap di-repo agar rebuild mudah) |
| `docs/plans/2026-08-13-deploy-infografis-github-pages.md` | Plan ini |
