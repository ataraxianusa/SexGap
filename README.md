# Harmoni Relasi Pasangan — Infografis Interaktif

> *Merajut harmoni di antara dua usia.*

Satu halaman infografis interaktif berbahasa Indonesia tentang **harmoni hubungan pasangan beda usia (age gap)**: dinamika age-sex gap, kerangka klinik Gottman (The Four Horsemen), protokol *reflective listening*, kalkulator finansial proporsional, hingga navigasi stigma sosio-kultural di Indonesia.

**🌐 Live:** https://ataraxianusa.github.io/SexGap/

---

## Fitur

- **2 grafik interaktif** (Chart.js): proyeksi risiko perceraian relatif & trajektori kepuasan pernikahan
- **Tab 4 "Four Horsemen" Gottman** — kritik, penghinaan, defensif, stonewalling + penawar klinisnya
- **Simulator Emotional Bank Account** — geser slider untuk melihat rasio interaksi positif/negatif (ambang 5:1)
- **Kalkulator alokasi finansial proporsional** — hitung kontribusi rumah tangga berbasis persentase pendapatan
- **Poster infografis** (klik untuk ukuran penuh) + **sumber riset PDF** yang bisa diunduh
- **Navigasi lintas perangkat** — masthead sticky dengan nav 5 bagian, daftar isi sidebar, progress bar baca, tombol "kembali ke atas"
- **Aksesibel** — ARIA tabs, label form, `aria-live`, keyboard focus, hormati `prefers-reduced-motion`, fallback `noscript`
- **SEO & social sharing** — meta description, Open Graph, Twitter Card, favicon

## Struktur Folder

```
.
├── index.html            # Satu-satunya file publik (CSS Tailwind sudah di-inline)
├── assets/
│   ├── panduan-lengkap.png   # Poster infografis (2.752 × 1.536)
│   └── og-preview.jpg        # Thumbnail social sharing (terkompres)
├── sumber-riset.pdf      # Riset empiris sumber konten
├── tailwind.config.js    # Konfigurasi build Tailwind (di-repo agar mudah rebuild)
├── input.css             # Entry point Tailwind
├── inline-css.mjs        # Script: inline hasil build CSS ke index.html
├── docs/plans/           # Rencana implementasi
├── LICENSE               # Lisensi MIT
└── README.md
```

## Menjalankan Lokal

Tidak butuh build — cukup serve statis:

```bash
python3 -m http.server 8123
# buka http://localhost:8123
```

## Rebuild CSS Tailwind (jika mengubah class)

CSS Tailwind di-build sekali lalu di-inline ke `<head>` (bukan Play CDN). Jika menambah/mengubah class Tailwind di `index.html`:

```bash
npm install
npx tailwindcss -i input.css -o tailwind.out.css --minify --content ./index.html
node inline-css.mjs
rm tailwind.out.css
```

Kustomisasi desain (palet, tipografi, komponen seperti `benang merah`) ada di blok `<style>` dalam `index.html` — tidak perlu rebuild untuk mengubah itu.

## Deploy ke GitHub Pages

Sudah aktif. Konfigurasi: **Settings → Pages → Build and deployment → Deploy from a branch → Branch `main` / `(root)`**.

Push ke `main` otomatis memicu redeploy (±1 menit):

```bash
git add -A && git commit -m "perubahan" && git push origin main
```

## Teknologi

| Bagian | Teknologi |
|---|---|
| Markup & style | HTML/CSS vanilla + Tailwind CSS v3 (pre-built, inline) |
| Grafik | Chart.js 4.5.1 (CDN, ter-pin) |
| Tipografi | Fraunces (display) + Plus Jakarta Sans (body) via Google Fonts |
| Hosting | GitHub Pages (HTTPS otomatis) |

## Lisensi

MIT — lihat [LICENSE](LICENSE). Konten bersifat **edukatif** dan tidak menggantikan konseling atau terapi profesional.
