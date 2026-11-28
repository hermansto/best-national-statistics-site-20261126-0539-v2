# NusaData — Statistik Indonesia

[![NusaData](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/hermansto/best-national-statistics-site-20261126-0539-v2/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/hermansto/best-national-statistics-site-20261126-0539-v2/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

Portal statistik nasional Indonesia: penduduk, ekonomi, pekerjaan, harga, dan kemiskinan — 38 provinsi dalam satu tempat. Semua angka terverifikasi dari BPS, Bank Indonesia, dan Kementerian Keuangan (data 2024).

## Isi

- **Ringkasan** — 5 KPI utama: penduduk 281,6 juta, PDB Rp 22.139 triliun, pertumbuhan 5,03%, inflasi 1,57%, kemiskinan 9,03%.
- **Ekonomi** — grafik PDB & pertumbuhan 2019–2024 (dengan toggle mode), inflasi 2019–2024 dengan pita sasaran BI, struktur sektoral 2024.
- **Penduduk** — 10 provinsi terpadat (bisa diurutkan), struktur umur, tren penduduk 2020–2024.
- **Ketenagakerjaan** — angkatan kerja 152,11 juta, TPT 4,91% (Sakernas Agustus 2024), TPT menurut provinsi dengan filter wilayah.
- **Harga & Kemiskinan** — tren kemiskinan Maret 2019–2024, kemiskinan kota–desa, rasio Gini 0,379.
- **Jelajahi Provinsi** — tabel 38 provinsi dengan pencarian langsung, filter wilayah, dan pengurutan di semua kolom, plus unduhan ringkasan CSV.
- **Sumber & Metode** — setiap angka menyebut sumber dan tahunnya.

## Menjalankan

Buka `app/index.html` langsung di browser — tanpa build step dan tanpa koneksi jaringan (semua aset lokal, grafik SVG/CSS buatan sendiri, tanpa library).

Untuk serve lokal: `node serve.ts`, lalu buka alamat lokal yang ditampilkan.

Untuk membangun dossier: `MAKEFUN_OUTPUT_DIR=/tmp/ns-out1 node main.ts`.

## Data

Penduduk 281,6 juta (BPS, proyeksi pertengahan 2024); PDB Rp 22.139 triliun (BPS, ADHB 2024); pertumbuhan 5,03% (BPS, c-to-c); inflasi 1,57% (BPS/BI, IHK Desember yoy); TPT 4,91% (BPS Sakernas Agustus 2024); kemiskinan 9,03% Maret 2024 dan 8,57% September 2024 (BPS Susenas). PDRB enam provinsi hasil pemekaran Papua belum terpisah dalam publikasi BPS yang dikutip, sehingga ditampilkan "—". Lihat bagian Sumber & Metode di situs untuk daftar lengkap.
