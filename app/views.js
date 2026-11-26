// views.js — one render function per hash route. Each returns HTML for #view.
import { KPIS, POP_SERIES, AGE_GROUPS, GDP_GROWTH, INFLATION, UNEMPLOYMENT, POVERTY, SECTORS, HDI_SERIES, STUNTING, EDU_COMPLETION, SCHOOL_YEARS, PROVINCES, SOURCES, NATIONAL_POP, fmtId } from "./data.js";
import { lineChart, barChart, shareBars } from "./charts.js";

const src = (t) => `<p class="src">Sumber: ${t}</p>`;
const shareOf = (pop) => ((pop / NATIONAL_POP) * 100).toFixed(2).replace(".", ",");

export function viewDashboard() {
  const cards = KPIS.map((k) => `<a class="kpi" href="${k.route}"><span class="kpi-label">${k.label}</span><span class="kpi-value">${k.value}</span><span class="kpi-unit">${k.unit}</span><span class="kpi-change">${k.change}</span><span class="kpi-src">Sumber: ${k.source}</span></a>`).join("");
  return `
  <section class="hero"><h1>Statistik Indonesia 2024</h1><p>Angka resmi penduduk, ekonomi, kesehatan, dan pendidikan — lengkap dengan sumber dan tahunnya. Semua data tersimpan di situs ini dan bisa dibuka tanpa internet.</p>
  <div class="search-box"><label for="q">Cari angka, provinsi, atau halaman</label><input id="q" type="search" placeholder="Contoh: stunting, Jawa Barat, IPM…" autocomplete="off"><div id="search-results" class="search-results" aria-live="polite"></div></div></section>
  <section><h2>Angka utama 2024</h2><div class="kpi-grid">${cards}</div></section>
  <section class="two-col"><div class="card"><h2>Penduduk terus tumbuh</h2>${lineChart(POP_SERIES.map((p) => ({ label: p.year, value: p.value }))) }<p class="chart-note">Penduduk Indonesia, juta jiwa.</p>${src("BPS, Jumlah penduduk menurut provinsi 2024; SUPAS 2025 mencatat 284,67 jt jiwa.")}</div>
  <div class="card"><h2>Sekilas ekonomi</h2><ul class="fact-list"><li><b>PDB Rp22.139 T</b> — tumbuh 5,03% pada 2024. <span class="muted">BPS 2024</span></li><li><b>Inflasi 1,57%</b> pada Des 2024, turun dari 2,61% setahun sebelumnya. <span class="muted">BPS 2024</span></li><li><b>Pengangguran 4,91%</b> pada Agu 2024; 144,64 jt orang bekerja. <span class="muted">BPS 2024</span></li><li><b>Kemiskinan 8,47%</b> pada Mar 2025; garis kemiskinan Rp609.160/kapita/bulan. <span class="muted">BPS 2025</span></li></ul><p><a class="btn" href="#/ekonomi">Buka halaman Ekonomi →</a></p></div></section>
  <section class="card"><h2>Jelajahi berdasarkan topik</h2><div class="topic-links"><a href="#/penduduk">Penduduk</a><a href="#/ekonomi">Ekonomi</a><a href="#/kesehatan">Kesehatan</a><a href="#/pendidikan">Pendidikan</a><a href="#/provinsi">Provinsi</a><a href="#/sumber">Sumber &amp; Metode</a></div>${src("Semua angka di situs ini memakai tahun dan sumber yang tertulis di sampingnya.")}</section>`;
}

export function viewPenduduk() {
  const top = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 3)
    .map((p) => `<li><a href="#/provinsi">${p.name}</a> — <b>${fmtId(p.pop)} jt</b> (${shareOf(p.pop)}% penduduk Indonesia, derived)</li>`).join("");
  return `
  <h1>Penduduk</h1><p class="lede">Indonesia berpenduduk 281,6 juta jiwa pada 2024 (BPS) — naik 1,04% dari 2023. SUPAS 2025 mencatat 284,67 jt jiwa.</p>
  <section class="card"><h2>Jumlah penduduk 2020–2025</h2>${lineChart(POP_SERIES.map((p) => ({ label: p.year, value: p.value }))) }<p class="chart-note">Juta jiwa. Tahun 2021 tidak diterbitkan dalam seri ini.</p>${src("BPS, Jumlah penduduk menurut provinsi 2024; SUPAS 2025.")}</section>
  <section class="two-col"><div class="card"><h2>Kelompok usia</h2>${shareBars(AGE_GROUPS)}<p class="chart-note">Bagian 15–64 tahun adalah derived: 100 − 24,6 − 7,3.</p>${src("World Bank, World Development Indicators 2024.")}</div>
  <div class="card"><h2>Sebaran pulau</h2><ul class="fact-list"><li><b>Jawa 55,65%</b> — 158,41 jt jiwa</li><li><b>Sumatera 21,89%</b> — 62,32 jt jiwa</li><li><b>Rasio ketergantungan 45,05</b></li></ul>${src("BPS, SUPAS 2025.")}<h2>Provinsi terpadat</h2><ol class="fact-list">${top}</ol></div></section>
  <section class="card"><h2>Kemiskinan ikut turun</h2>${lineChart(POVERTY.map((p) => ({ label: p.label, value: p.pct }))) }<p class="chart-note">Penduduk miskin, %.</p>${src("BPS, Profil Kemiskinan di Indonesia, Maret 2025.")}</section>`;
}

export function viewEkonomi(tab = "pdb") {
  const tabs = [["pdb", "Pertumbuhan PDB"], ["inflasi", "Inflasi"], ["kerja", "Pengangguran"], ["miskin", "Kemiskinan"]];
  const tabBtns = tabs.map(([id, label]) => `<button class="tab ${tab === id ? "active" : ""}" data-tab="${id}" aria-selected="${tab === id}">${label}</button>`).join("");
  let panel = "";
  if (tab === "pdb") panel = `<h2>Pertumbuhan PDB 2020–2024</h2>${lineChart(GDP_GROWTH.map((p) => ({ label: p.year, value: p.value }))) }<p class="chart-note">Pertumbuhan PDB, % per tahun. 2020 terkontraksi −2,07% lalu pulih di atas 5% sejak 2022.</p>${src("BPS, Perekonomian Indonesia 2024 (rilis 5 Feb 2025).")}<ul class="fact-list"><li><b>PDB Rp22.139,0 triliun</b> harga berlaku, 2024</li><li><b>PDB per kapita Rp78,6 jt (US$4.960,3)</b>, dari Rp75,0 jt pada 2023</li><li><b>PDB World Bank US$1.396,3 miliar</b>; per kapita US$4.925 (2024)</li></ul>`;
  if (tab === "inflasi") panel = `<h2>Inflasi tahunan 2020–2024</h2>${lineChart(INFLATION.map((p) => ({ label: p.year, value: p.value }))) }<p class="chart-note">Inflasi, % y-on-y. Puncak 5,51% pada 2022, lalu turun ke 1,57% pada Des 2024.</p>${src("BPS 2024.")}`;
  if (tab === "kerja") panel = `<h2>Pengangguran terbuka 2021–2024</h2>${lineChart(UNEMPLOYMENT.map((p) => ({ label: p.year, value: p.value }))) }<p class="chart-note">Tingkat pengangguran terbuka (TPT), %.</p>${src("BPS, Keadaan Ketenagakerjaan Indonesia, Agustus 2024.")}<ul class="fact-list"><li><b>TPT 4,91%</b> pada Agustus 2024, dari 5,32% pada Agu 2023</li><li><b>Bekerja 144,64 jt orang</b>; penganggur 7,47 jt orang</li></ul>`;
  if (tab === "miskin") panel = `<h2>Kemiskinan 2024–2025</h2>${barChart(POVERTY.map((p) => ({ label: p.label, pct: p.pct, value: p.pct, suffix: "%" }))) }<ul class="fact-list">${POVERTY.map((p) => `<li><b>${p.label}: ${fmtId(p.pct)}%</b> — ${fmtId(p.people)} jt orang</li>`).join("")}</ul>${src("BPS, Profil Kemiskinan di Indonesia, Maret 2025. Garis kemiskinan Rp609.160/kapita/bulan; gini 0,375.")}`;
  const rows = SECTORS.map((s) => `<tr><td>${s.name}${s.derived ? ' <span class="muted">(sisa dari 100%, derived)</span>' : ""}</td><td class="num">${fmtId(s.share)}%</td><td class="num">${s.growth === null ? "—" : fmtId(s.growth) + "%"}</td></tr>`).join("");
  return `
  <h1>Ekonomi</h1><p class="lede">PDB Rp22.139 triliun pada 2024, tumbuh 5,03%. PDB per kapita Rp78,6 juta (US$4.960).</p>
  <section class="card"><div class="tabs" role="tablist">${tabBtns}</div><div id="tab-panel">${panel}</div></section>
  <section class="card"><h2>Lapangan usaha — pangsa PDB &amp; pertumbuhan</h2><table class="data-table"><thead><tr><th>Lapangan usaha</th><th>Pangsa PDB</th><th>Pertumbuhan</th></tr></thead><tbody>${rows}</tbody></table>${src("BPS, Perekonomian Indonesia 2024. Tanda — berarti tidak ada angka pertumbuhan yang diterbitkan.")}<p><button class="btn" id="csv-btn" type="button">Unduh tabel ekonomi (CSV)</button> <span id="csv-status" class="muted"></span></p></section>`;
}

export function viewKesehatan() {
  return `
  <h1>Kesehatan</h1><p class="lede">Stunting balita turun ke 19,8% pada 2024 — dari 21,5% pada 2023 dan 24,4% pada 2021.</p>
  <section class="card"><h2>Stunting balita 2021–2024</h2>${lineChart(STUNTING.map((p) => ({ label: p.year, value: p.value }))) }<p class="chart-note">Prevalensi stunting balita, %.</p>${src("Kemenkes, Survei Status Gizi Indonesia (SSGI) 2024.")}</section>
  <section class="two-col"><div class="card"><h2>Gizi balita 2024</h2>${barChart([{ label: "Stunting", value: 19.8 }, { label: "Wasting", value: 7.4 }, { label: "Overweight", value: 3.4 }])}${src("Kemenkes, SSGI 2024.")}</div>
  <div class="card"><h2>Yang perlu dicatat</h2><ul class="fact-list"><li><b>Stunting 19,8%</b> — turun 1,7 poin dalam setahun</li><li><b>Wasting 7,4%</b> dan <b>overweight 3,4%</b> pada 2024</li><li><b>Umur harapan hidup 74,15 tahun</b> saat lahir (BPS 2024)</li></ul><p><a class="btn" href="#/pendidikan">Lihat Pendidikan →</a></p></div></section>`;
}

export function viewPendidikan() {
  const years = SCHOOL_YEARS.map((s) => `<li><b>${s.value}</b> — ${s.label} <span class="muted">(${s.source})</span></li>`).join("");
  return `
  <h1>Pendidikan</h1><p class="lede">IPM 75,02 pada 2024 (kategori tinggi), naik 0,63 poin dari 2023. Harapan lama sekolah 13,21 tahun.</p>
  <section class="card"><h2>IPM 2022–2025</h2>${lineChart(HDI_SERIES.map((p) => ({ label: p.year, value: p.value }))) }<p class="chart-note">Indeks Pembangunan Manusia.</p>${src("BPS, Indeks Pembangunan Manusia 2024 (rilis 15 Nov 2024).")}</section>
  <section class="two-col"><div class="card"><h2>Penyelesaian sekolah 2024</h2>${barChart(EDU_COMPLETION.map((e) => ({ label: e.label, value: e.pct }))) }${src("BPS, Statistik Pendidikan 2024 (Susenas Maret 2024).")}</div>
  <div class="card"><h2>Lama sekolah</h2><ul class="fact-list">${years}</ul><p class="chart-note">Rata-rata lama sekolah penduduk 25 tahun ke atas 8,85 tahun; penduduk 15 tahun ke atas 9,22 tahun.</p>${src("BPS 2024.")}</div></section>`;
}

export function viewProvinsi() {
  const rows = PROVINCES.map((p) => `<tr data-name="${p.name}"><td><button class="link-btn prov-name" data-prov="${p.name}" type="button">${p.name}</button></td><td class="num">${fmtId(p.pop)}</td><td class="num">${shareOf(p.pop)}%</td><td class="num">${p.density === null ? "—" : p.density.toLocaleString("id-ID")}</td><td>${p.capital}</td><td><label class="compare-label"><input type="checkbox" class="compare-check" value="${p.name}"> Bandingkan</label></td></tr>`).join("");
  return `
  <h1>Provinsi</h1><p class="lede">Enam provinsi terpadat — 164,75 jt jiwa dari 281,6 jt penduduk Indonesia. Klik nama provinsi untuk detailnya, atau centang sampai 3 provinsi untuk membandingkan.</p>
  <section class="card"><div class="prov-tools"><label for="prov-q">Cari provinsi</label><input id="prov-q" type="search" placeholder="Contoh: Jawa, Banten…" autocomplete="off"></div>
  <div class="table-wrap"><table class="data-table" id="prov-table"><thead><tr><th><button class="sort-btn" data-sort="name" type="button">Provinsi ↕</button></th><th><button class="sort-btn" data-sort="pop" type="button">Penduduk (jt) ↕</button></th><th><button class="sort-btn" data-sort="share" type="button">Pangsa ↕</button></th><th><button class="sort-btn" data-sort="density" type="button">Kepadatan ↕</button></th><th>Ibu kota</th><th>Bandingkan</th></tr></thead><tbody>${rows}</tbody></table></div>
  <p class="chart-note">Pangsa = populasi ÷ 281,6 jt (derived). Tanda — berarti tidak ada angka kepadatan 2024 yang diterbitkan.</p>${src("BPS, Jumlah penduduk menurut provinsi 2024.")}</section>
  <section class="card" id="compare-box"><h2>Bandingkan provinsi</h2><p id="compare-empty">Centang sampai 3 provinsi di tabel untuk membandingkannya di sini.</p><div id="compare-out"></div></section>
  <section class="card" id="prov-detail"><h2>Detail provinsi</h2><p id="detail-empty">Klik nama provinsi di tabel untuk melihat catatannya.</p><div id="detail-out"></div></section>`;
}

export function viewSumber() {
  const rows = SOURCES.map((s) => `<tr><td><b>${s.publisher}</b></td><td>${s.title}</td><td class="num">${s.year}</td><td>${s.note}</td></tr>`).join("");
  return `
  <h1>Sumber &amp; Metode</h1><p class="lede">Setiap angka di NusaData memakai sumber dan tahun yang tertulis di sampingnya. Tidak ada angka tanpa sumber.</p>
  <section class="card"><h2>Daftar sumber</h2><div class="table-wrap"><table class="data-table"><thead><tr><th>Penerbit</th><th>Publikasi</th><th>Tahun</th><th>Catatan</th></tr></thead><tbody>${rows}</tbody></table></div></section>
  <section class="card"><h2>Metode</h2><ul class="fact-list"><li><b>Tahun jangkar 2024</b> — angka terbaru yang dipakai di seluruh situs, kecuali yang ditandai 2025.</li><li><b>Derived (aritmetika turunan)</b> diberi label di samping angkanya: pangsa provinsi (populasi ÷ 281,6 jt), kelompok usia 15–64 tahun (100 − 24,6 − 7,3), dan lapangan usaha lainnya (sisa dari 100%).</li><li><b>Angka 2025</b> dipakai hanya bila sumbernya memang 2025: SUPAS 2025 dan Profil Kemiskinan Maret 2025.</li><li><b>Tidak ada data dari internet</b> — situs ini bekerja sepenuhnya dari file-nya sendiri.</li></ul></section>`;
}
