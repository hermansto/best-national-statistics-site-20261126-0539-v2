// charts.js — small inline-SVG charts, no library, no network.
// Every chart takes plain {label, value} points and returns an SVG string.

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

export function lineChart(points, opts = {}) {
  const w = opts.width || 640, h = opts.height || 260;
  const padL = 52, padR = 16, padT = 18, padB = 34;
  const vals = points.map((p) => p.value);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  if (hi === lo) { hi += 1; lo -= 1; }
  const span = hi - lo, pad = span * 0.18;
  lo -= pad; hi += pad;
  const x = (i) => padL + (i * (w - padL - padR)) / Math.max(1, points.length - 1);
  const y = (v) => padT + ((hi - v) * (h - padT - padB)) / (hi - lo);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const area = `${path} L${x(points.length - 1).toFixed(1)},${h - padB} L${x(0).toFixed(1)},${h - padB} Z`;
  const ticks = 4;
  let grid = "";
  for (let t = 0; t <= ticks; t++) {
    const v = lo + ((hi - lo) * t) / ticks;
    const yy = y(v);
    grid += `<line x1="${padL}" y1="${yy.toFixed(1)}" x2="${w - padR}" y2="${yy.toFixed(1)}" stroke="#e3e0d8" stroke-width="1"/><text x="${padL - 8}" y="${(yy + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#6b7280">${esc(String(v.toFixed(1)).replace(".", ","))}</text>`;
  }
  const dots = points.map((p, i) =>
    `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="4.5" fill="#0e7c6b" stroke="#fff" stroke-width="2"/><text x="${x(i).toFixed(1)}" y="${(y(p.value) - 10).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="#0b2a4a">${esc(String(p.value).replace(".", ","))}</text>`).join("");
  const labels = points.map((p, i) =>
    `<text x="${x(i).toFixed(1)}" y="${h - 10}" text-anchor="middle" font-size="12" fill="#374151">${esc(String(p.label))}</text>`).join("");
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Grafik garis"><path d="${area}" fill="#0e7c6b" opacity="0.10"/><path d="${path}" fill="none" stroke="#0e7c6b" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${grid}${dots}${labels}</svg>`;
}

export function barChart(rows, opts = {}) {
  const w = opts.width || 640, h = opts.height || 240;
  const padL = 150, padR = 64, padT = 12, padB = 12;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const rowH = (h - padT - padB) / rows.length;
  const bars = rows.map((r, i) => {
    const bw = ((w - padL - padR) * r.value) / max;
    const y = padT + i * rowH + 6;
    return `<text x="${padL - 10}" y="${y + 15}" text-anchor="end" font-size="12.5" fill="#1f2937">${esc(r.label)}</text><rect x="${padL}" y="${y}" width="${Math.max(2, bw).toFixed(1)}" height="22" rx="5" fill="${r.color || "#0b2a4a"}"/><text x="${padL + Math.max(2, bw) + 8}" y="${y + 16}" font-size="12.5" font-weight="700" fill="#0b2a4a">${esc(String(r.value).replace(".", ","))}${r.suffix || "%"}</text>`;
  }).join("");
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Grafik batang">${bars}</svg>`;
}

export function shareBars(rows) {
  // Horizontal 0–100% bars for age-group shares.
  return rows.map((r) => `<div class="share-row"><div class="share-label">${esc(r.label)} <span class="share-src">${esc(r.source)}</span></div><div class="share-track"><div class="share-fill" style="width:${r.share}%"></div></div><div class="share-val">${esc(String(r.share).replace(".", ","))}%</div></div>`).join("");
}
