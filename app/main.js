// main.js — router and page wiring: hash routes, search, tabs, sort, compare, CSV.
import { viewDashboard, viewPenduduk, viewEkonomi, viewKesehatan, viewPendidikan, viewProvinsi, viewSumber } from "./views.js";
import { KPIS, PROVINCES, SECTORS, GDP_GROWTH, INFLATION, UNEMPLOYMENT, POVERTY, NATIONAL_POP, fmtId } from "./data.js";

const view = document.getElementById("view");
const navLinks = [...document.querySelectorAll(".nav-link")];
let ecoTab = "pdb";
let provSort = { key: "pop", dir: -1 };

const ROUTES = {
  "": viewDashboard, "/": viewDashboard, "/penduduk": viewPenduduk,
  "/ekonomi": () => viewEkonomi(ecoTab), "/kesehatan": viewKesehatan,
  "/pendidikan": viewPendidikan, "/provinsi": viewProvinsi, "/sumber": viewSumber,
};

function render() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const fn = ROUTES[hash] || viewDashboard;
  view.innerHTML = fn();
  navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${hash === "/" ? "" : hash}` || (hash === "/" && a.getAttribute("href") === "#/")));
  window.scrollTo(0, 0);
  wirePage(hash);
}

function wirePage(hash) {
  if (hash === "/" || hash === "") wireSearch();
  if (hash === "/ekonomi") wireEkonomi();
  if (hash === "/provinsi") wireProvinsi();
}

function wireSearch() {
  const input = document.getElementById("q");
  const out = document.getElementById("search-results");
  if (!input || !out) return;
  const pages = [
    { title: "Penduduk — 281,6 jt jiwa (BPS 2024)", route: "#/penduduk", keys: "penduduk jiwa supas jawa sumatera" },
    { title: "Ekonomi — PDB Rp22.139 T, tumbuh 5,03% (BPS 2024)", route: "#/ekonomi", keys: "ekonomi pdb inflasi pengangguran kemiskinan gdp" },
    { title: "Kesehatan — stunting 19,8% (SSGI 2024)", route: "#/kesehatan", keys: "kesehatan stunting wasting overweight gizi" },
    { title: "Pendidikan — IPM 75,02 (BPS 2024)", route: "#/pendidikan", keys: "pendidikan ipm sekolah lama sekolah" },
    { title: "Provinsi — 6 provinsi terpadat", route: "#/provinsi", keys: "provinsi jawa banten jakarta medan" },
    { title: "Sumber & Metode — semua sumber dan tahun", route: "#/sumber", keys: "sumber metode bps world bank" },
  ];
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { out.innerHTML = ""; return; }
    const hits = [];
    for (const p of pages) if ((p.title + " " + p.keys).toLowerCase().includes(q)) hits.push(`<a href="${p.route}">${p.title}</a>`);
    for (const k of KPIS) if ((k.label + " " + k.value).toLowerCase().includes(q)) hits.push(`<a href="${k.route}">${k.label}: <b>${k.value}</b> ${k.unit} — ${k.source}</a>`);
    for (const p of PROVINCES) if (p.name.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q)) hits.push(`<a href="#/provinsi">${p.name} — ${fmtId(p.pop)} jt jiwa, ibu kota ${p.capital} (BPS 2024)</a>`);
    out.innerHTML = hits.length ? hits.join("") : "<p class=\"muted\">Tidak ada hasil untuk pencarian itu.</p>";
  });
}

function wireEkonomi() {
  view.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => {
    ecoTab = b.dataset.tab;
    render();
  }));
  const btn = document.getElementById("csv-btn");
  if (btn) btn.addEventListener("click", () => {
    const lines = ["Lapangan usaha,Pangsa PDB (%),Pertumbuhan (%)"];
    for (const s of SECTORS) lines.push(`"${s.name}",${String(s.share).replace(".", ",")},${s.growth === null ? "" : String(s.growth).replace(".", ",")}`);
    lines.push("");
    lines.push("Pertumbuhan PDB (%),Tahun,Nilai");
    for (const g of GDP_GROWTH) lines.push(`${g.year},${String(g.value).replace(".", ",")}`);
    lines.push("Inflasi (%),Tahun,Nilai");
    for (const g of INFLATION) lines.push(`${g.year},${String(g.value).replace(".", ",")}`);
    lines.push("TPT (%),Tahun,Nilai");
    for (const g of UNEMPLOYMENT) lines.push(`${g.year},${String(g.value).replace(".", ",")}`);
    lines.push("Kemiskinan,Periode,Persen,Juta orang");
    for (const p of POVERTY) lines.push(`${p.label},${String(p.pct).replace(".", ",")},${String(p.people).replace(".", ",")}`);
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "nusadata-ekonomi.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    const st = document.getElementById("csv-status");
    if (st) st.textContent = "CSV diunduh: nusadata-ekonomi.csv";
  });
}

function shareOf(pop) { return ((pop / NATIONAL_POP) * 100).toFixed(2).replace(".", ","); }

function wireProvinsi() {
  const q = document.getElementById("prov-q");
  const table = document.getElementById("prov-table");
  const tbody = table.querySelector("tbody");
  const original = [...tbody.querySelectorAll("tr")];
  if (q) q.addEventListener("input", () => {
    const term = q.value.trim().toLowerCase();
    original.forEach((tr) => { tr.style.display = tr.dataset.name.toLowerCase().includes(term) ? "" : "none"; });
  });
  table.querySelectorAll(".sort-btn").forEach((b) => b.addEventListener("click", () => {
    const key = b.dataset.sort;
    if (provSort.key === key) provSort.dir *= -1; else provSort = { key, dir: key === "name" ? 1 : -1 };
    const val = (tr) => {
      const p = PROVINCES.find((x) => x.name === tr.dataset.name);
      if (key === "name") return p.name;
      if (key === "pop") return p.pop;
      if (key === "share") return p.pop;
      return p.density === null ? -1 : p.density;
    };
    [...original].sort((a, b) => {
      const va = val(a), vb = val(b);
      return (va < vb ? -1 : va > vb ? 1 : 0) * provSort.dir;
    }).forEach((tr) => tbody.appendChild(tr));
  }));
  const compareOut = document.getElementById("compare-out");
  const empty = document.getElementById("compare-empty");
  const checked = () => [...view.querySelectorAll(".compare-check:checked")].map((c) => c.value);
  const renderCompare = () => {
    const sel = checked();
    if (!sel.length) { compareOut.innerHTML = ""; empty.style.display = ""; return; }
    empty.style.display = "none";
    const cols = sel.map((name) => PROVINCES.find((p) => p.name === name));
    compareOut.innerHTML = `<div class="table-wrap"><table class="data-table"><thead><tr><th></th>${cols.map((p) => `<th>${p.name}</th>`).join("")}</tr></thead><tbody>
      <tr><td>Penduduk</td>${cols.map((p) => `<td class="num">${fmtId(p.pop)} jt</td>`).join("")}</tr>
      <tr><td>Pangsa nasional</td>${cols.map((p) => `<td class="num">${shareOf(p.pop)}%</td>`).join("")}</tr>
      <tr><td>Kepadatan</td>${cols.map((p) => `<td class="num">${p.density === null ? "—" : p.density.toLocaleString("id-ID") + " jiwa/km²"}</td>`).join("")}</tr>
      <tr><td>Ibu kota</td>${cols.map((p) => `<td>${p.capital}</td>`).join("")}</tr>
      <tr><td>Catatan</td>${cols.map((p) => `<td>${p.note}</td>`).join("")}</tr></tbody></table></div><p class="chart-note">Pangsa = populasi ÷ 281,6 jt (derived). Sumber: BPS 2024.</p>`;
  };
  view.querySelectorAll(".compare-check").forEach((c) => c.addEventListener("change", () => {
    if (checked().length > 3) { c.checked = false; alert("Bandingkan maksimal 3 provinsi."); return; }
    renderCompare();
  }));
  view.querySelectorAll(".prov-name").forEach((b) => b.addEventListener("click", () => {
    const p = PROVINCES.find((x) => x.name === b.dataset.prov);
    const detail = document.getElementById("detail-out");
    document.getElementById("detail-empty").style.display = "none";
    detail.innerHTML = `<h3>${p.name}</h3><ul class="fact-list"><li><b>Penduduk ${fmtId(p.pop)} jt</b> — ${shareOf(p.pop)}% penduduk Indonesia (derived)</li><li><b>Kepadatan ${p.density === null ? "tidak diterbitkan untuk 2024" : p.density.toLocaleString("id-ID") + " jiwa/km²"}</b></li><li><b>Ibu kota ${p.capital}</b></li></ul><p>${p.note}</p><p class="src">Sumber: BPS, Jumlah penduduk menurut provinsi 2024.</p>`;
    document.getElementById("prov-detail").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }));
}

window.addEventListener("hashchange", render);
render();
