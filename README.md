[![NusaData — Statistik Indonesia](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/hermansto/best-national-statistics-site-20261126-0539-v2/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/hermansto/best-national-statistics-site-20261126-0539-v2/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

# NusaData — Statistik Indonesia

Situs statistik nasional Indonesia yang berjalan sepenuhnya offline dari file statisnya sendiri, tahun jangkar 2024. Dashboard 8 KPI utama, halaman Penduduk, Ekonomi, Kesehatan, Pendidikan, dan Provinsi, plus Sumber & Metode.

Angka resmi dari BPS, Kemenkes (SSGI), dan World Bank — setiap angka memakai sumber dan tahun yang tertulis di sampingnya. Angka bertanda “derived” adalah aritmetika turunan yang diberi label.

Fitur: grafik SVG tanpa pustaka, pencarian angka/provinsi/halaman, tab ekonomi (PDB, inflasi, pengangguran, kemiskinan), unduh CSV tabel ekonomi, tabel provinsi yang bisa dicari/diurutkan, bandingkan sampai 3 provinsi, dan detail tiap provinsi. Semua kontrol bekerja; tidak ada placeholder.

Jalankan lokal: `node serve.ts` lalu buka http://localhost:4173/ — atau jalankan `node main.ts` dengan `MAKEFUN_OUTPUT_DIR` untuk menghasilkan `dossier.json` beserta salinan `app/` dan `screenshots/`.

## Struktur

- `app/index.html` — halaman dan navigasi hash
- `app/style.css` — tampilan (sistem font saja, tanpa unduhan luar)
- `app/data.js` — semua angka dan sumber
- `app/charts.js` — grafik SVG garis dan batang
- `app/views.js` — satu fungsi render per halaman
- `app/main.js` — router, pencarian, tab, sortir, banding, CSV
- `main.ts` — program penyerahan: menyalin `app/` + `screenshots/` dan menulis `dossier.json`
- `serve.ts` — server statis lokal untuk pengujian
- `vendor/makefun-frontend.ts` — salinan kit, tidak diubah
