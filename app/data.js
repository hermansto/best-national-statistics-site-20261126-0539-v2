// NusaData — all figures for Indonesia, anchor year 2024.
// Every number below is taken from the source named next to it.
// Shares marked "derived" are plain arithmetic on the figures shown.

export const SOURCES = [
  { id: "bps-penduduk", publisher: "BPS", title: "Jumlah penduduk menurut provinsi", year: 2024, note: "Penduduk 281,6 jt jiwa; Jawa Barat 50,35 jt; Jawa Timur 41,81 jt; Jawa Tengah 37,89 jt." },
  { id: "bps-pdb", publisher: "BPS", title: "Perekonomian Indonesia 2024", year: 2025, note: "Rilis 5 Feb 2025. PDB Rp22.139,0 triliun; PDB per kapita Rp78,6 jt (US$4.960,3); tumbuh 5,03%." },
  { id: "bps-kemiskinan", publisher: "BPS", title: "Profil Kemiskinan di Indonesia, Maret 2025", year: 2025, note: "Penduduk miskin 8,47% (23,85 jt orang); garis kemiskinan Rp609.160/kapita/bulan; gini 0,375." },
  { id: "bps-kerja", publisher: "BPS", title: "Keadaan Ketenagakerjaan Indonesia, Agustus 2024", year: 2024, note: "TPT 4,91%; bekerja 144,64 jt orang; penganggur 7,47 jt orang." },
  { id: "bps-ipm", publisher: "BPS", title: "Indeks Pembangunan Manusia 2024", year: 2024, note: "Rilis 15 Nov 2024. IPM 75,02; umur harapan hidup 74,15 tahun; harapan lama sekolah 13,21 tahun; rata-rata lama sekolah (25+) 8,85 tahun." },
  { id: "bps-pendidikan", publisher: "BPS", title: "Statistik Pendidikan 2024", year: 2024, note: "Susenas Maret 2024. Penyelesaian SD 97,84%, SMP 91,15%, SMA 67,07%; rata-rata lama sekolah (15+) 9,22 tahun." },
  { id: "kemenkes-ssgi", publisher: "Kemenkes", title: "Survei Status Gizi Indonesia (SSGI) 2024", year: 2024, note: "Stunting balita 19,8% (dari 21,5% pada 2023); wasting 7,4%; overweight 3,4%." },
  { id: "worldbank-wdi", publisher: "World Bank", title: "World Development Indicators 2024", year: 2024, note: "PDB US$1.396,3 miliar; PDB per kapita US$4.925; usia 0–14 tahun 24,6%, 65+ tahun 7,3%." },
  { id: "bps-supas", publisher: "BPS", title: "Hasil Survei Penduduk Antar Sensus (SUPAS) 2025", year: 2025, note: "Penduduk 284,67 jt jiwa; Jawa 55,65% (158,41 jt); Sumatera 21,89% (62,32 jt); rasio ketergantungan 45,05." },
];

export const KPIS = [
  { label: "Penduduk", value: "281,6 jt", unit: "jiwa", change: "+1,04% dari 2023", route: "#/penduduk", source: "BPS 2024" },
  { label: "PDB", value: "Rp22.139 T", unit: "harga berlaku", change: "tumbuh 5,03%", route: "#/ekonomi", source: "BPS 2024" },
  { label: "PDB per kapita", value: "Rp78,6 jt", unit: "US$4.960", change: "dari Rp75,0 jt pada 2023", route: "#/ekonomi", source: "BPS 2024" },
  { label: "Inflasi tahunan", value: "1,57%", unit: "Des 2024 y-on-y", change: "dari 2,61% pada 2023", route: "#/ekonomi", source: "BPS 2024" },
  { label: "Pengangguran terbuka", value: "4,91%", unit: "Agustus 2024", change: "dari 5,32% pada Agu 2023", route: "#/ekonomi", source: "BPS 2024" },
  { label: "Penduduk miskin", value: "8,47%", unit: "23,85 jt orang", change: "dari 9,03% pada Mar 2024", route: "#/ekonomi", source: "BPS, Mar 2025" },
  { label: "IPM", value: "75,02", unit: "kategori tinggi", change: "naik 0,63 poin dari 2023", route: "#/pendidikan", source: "BPS 2024" },
  { label: "Umur harapan hidup", value: "74,15 thn", unit: "saat lahir", change: "naik 0,22 tahun dari 2023", route: "#/pendidikan", source: "BPS 2024" },
];

export const POP_SERIES = [
  { year: 2020, value: 270.20 }, { year: 2022, value: 275.77 },
  { year: 2023, value: 278.70 }, { year: 2024, value: 281.60 },
  { year: 2025, value: 284.44 },
];

export const AGE_GROUPS = [
  { label: "0–14 tahun", share: 24.6, source: "World Bank 2024" },
  { label: "15–64 tahun", share: 68.1, source: "Derived: 100 − 24,6 − 7,3" },
  { label: "65+ tahun", share: 7.3, source: "World Bank 2024" },
];

export const GDP_GROWTH = [
  { year: 2020, value: -2.07 }, { year: 2021, value: 3.70 },
  { year: 2022, value: 5.31 }, { year: 2023, value: 5.05 },
  { year: 2024, value: 5.03 },
];

export const INFLATION = [
  { year: 2020, value: 1.68 }, { year: 2021, value: 1.87 },
  { year: 2022, value: 5.51 }, { year: 2023, value: 2.61 },
  { year: 2024, value: 1.57 },
];

export const UNEMPLOYMENT = [
  { year: 2021, value: 6.49 }, { year: 2022, value: 5.86 },
  { year: 2023, value: 5.32 }, { year: 2024, value: 4.91 },
];

export const POVERTY = [
  { label: "Mar 2024", pct: 9.03, people: 25.22 },
  { label: "Sep 2024", pct: 8.57, people: 24.06 },
  { label: "Mar 2025", pct: 8.47, people: 23.85 },
];

export const SECTORS = [
  { name: "Industri pengolahan", share: 18.98, growth: 4.43 },
  { name: "Perdagangan besar & eceran", share: 13.07, growth: 4.86 },
  { name: "Pertanian, kehutanan & perikanan", share: 12.61, growth: 0.67 },
  { name: "Konstruksi", share: 10.09, growth: 5.03 },
  { name: "Pertambangan & penggalian", share: 9.15, growth: null },
  { name: "Lapangan usaha lainnya", share: 36.10, growth: null, derived: true },
];

export const HDI_SERIES = [
  { year: 2022, value: 73.77 }, { year: 2023, value: 74.39 },
  { year: 2024, value: 75.02 }, { year: 2025, value: 75.90 },
];

export const STUNTING = [
  { year: 2021, value: 24.4 }, { year: 2022, value: 21.6 },
  { year: 2023, value: 21.5 }, { year: 2024, value: 19.8 },
];

export const EDU_COMPLETION = [
  { label: "SD / sederajat", pct: 97.84 },
  { label: "SMP / sederajat", pct: 91.15 },
  { label: "SMA / SMK sederajat", pct: 67.07 },
];

export const SCHOOL_YEARS = [
  { label: "Harapan lama sekolah (7+)", value: "13,21 tahun", source: "BPS 2024" },
  { label: "Rata-rata lama sekolah (25+)", value: "8,85 tahun", source: "BPS 2024" },
  { label: "Rata-rata lama sekolah (15+)", value: "9,22 tahun", source: "BPS, Susenas Mar 2024" },
];

export const PROVINCES = [
  { name: "Jawa Barat", pop: 50.35, density: 1359, capital: "Bandung", note: "Provinsi terpadat di Indonesia, hampir 1 dari 5 penduduk; kepadatan 1.359 jiwa/km2 (BPS 2024)." },
  { name: "Jawa Timur", pop: 41.81, density: 870, capital: "Surabaya", note: "Terpadat kedua, Surabaya kota terbesar kedua." },
  { name: "Jawa Tengah", pop: 37.89, density: 1104, capital: "Semarang", note: "Terpadat ketiga; penduduk tersebar dari Semarang, Solo, hingga Purwokerto." },
  { name: "Sumatera Utara", pop: 15.59, density: null, capital: "Medan", note: "Terpadat di luar Pulau Jawa; ibu kota Medan." },
  { name: "Banten", pop: 12.43, density: 1329, capital: "Serang", note: "Provinsi termuda di Pulau Jawa bagian barat; kepadatan 1.329 jiwa/km2 (BPS 2024)." },
  { name: "DKI Jakarta", pop: 10.68, density: 16165, capital: "Jakarta", note: "Ibu kota dan terpadat per km2: 16.165 jiwa/km2 (BPS 2024), sekitar 12 kali Jawa Barat." },
];

export const NATIONAL_POP = 281.6;
export const fmtId = (n) => String(n).replace(".", ",");
