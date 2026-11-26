// Hand-built SVG charts for the Meridia statistics site.
// No chart library: every chart is a small function returning an SVG string,
// so the first load stays small and every figure comes from data.js.

const TEAL = '#0b3d4a';
const AMBER = '#e8a13a';
const CORAL = '#c65a3a';
const SLATE = '#5b7a82';
const LIGHT = '#dce8ea';
const GREEN = '#3f7d5d';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function niceTicks(min, max, count = 4) {
  const span = max - min || 1;
  const step = span / count;
  const mag = 10 ** Math.floor(Math.log10(step));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const s = nice * mag;
  const start = Math.ceil(min / s) * s;
  const ticks = [];
  for (let v = start; v <= max + 1e-9; v += s) ticks.push(+v.toFixed(10));
  return ticks;
}

function fmtNum(v) {
  if (Math.abs(v) >= 1000) return v.toLocaleString('en-GB');
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(1);
}

// Line chart with dots, gridlines and year labels.
export function lineChart({ labels, values, title, unit = '', color = TEAL, height = 240, ymin = null, ymax = null }) {
  const W = 640;
  const H = height;
  const padL = 56;
  const padR = 14;
  const padT = 12;
  const padB = 30;
  const iw = W - padL - padR;
  const ih = H - padT - padB;
  const vals = values.filter((v) => v !== null);
  const lo = ymin ?? Math.min(...vals);
  const hi = ymax ?? Math.max(...vals);
  const span = hi - lo || 1;
  const x = (i) => padL + (i / (labels.length - 1)) * iw;
  const y = (v) => padT + ih - ((v - lo) / span) * ih;
  const ticks = niceTicks(lo, hi, 4);
  let g = '';
  for (const t of ticks) {
    g += `<line x1="${padL}" y1="${y(t)}" x2="${W - padR}" y2="${y(t)}" stroke="${LIGHT}" stroke-width="1"/>`;
    g += `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="${SLATE}">${fmtNum(t)}${unit}</text>`;
  }
  const pts = labels.map((_, i) => (values[i] === null ? null : `${x(i).toFixed(1)},${y(values[i]).toFixed(1)}`));
  const line = pts.filter(Boolean).join(' ');
  g += `<polyline points="${line}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>`;
  labels.forEach((lab, i) => {
    if (values[i] === null) return;
    g += `<circle cx="${x(i)}" cy="${y(values[i])}" r="3.5" fill="${color}"><title>${esc(lab)}: ${fmtNum(values[i])}${unit}</title></circle>`;
    if (i % 2 === 0 || i === labels.length - 1) {
      g += `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="${SLATE}">${esc(lab)}</text>`;
    }
  });
  const last = values[values.length - 1];
  const lastX = x(labels.length - 1);
  const labelY = Math.max(y(last) + 4, 14);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}" class="chart"><title>${esc(title)}</title>${g}<text x="${(lastX - 10).toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="end" font-size="12" font-weight="700" fill="${color}">${fmtNum(last)}${unit}</text></svg>`;
}

// Vertical bar chart with value labels on top.
export function barChart({ labels, values, title, unit = '', color = TEAL, height = 240, horizontal = false }) {
  if (horizontal) return hbarChart({ labels, values, title, unit, color, height });
  const W = 640;
  const H = height;
  const padL = 56;
  const padR = 14;
  const padT = 22;
  const padB = 30;
  const iw = W - padL - padR;
  const ih = H - padT - padB;
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const slot = iw / labels.length;
  const bw = Math.min(48, slot * 0.62);
  const y = (v) => padT + ih - ((v - min) / span) * ih;
  const ticks = niceTicks(min, max, 4);
  let g = '';
  for (const t of ticks) {
    g += `<line x1="${padL}" y1="${y(t)}" x2="${W - padR}" y2="${y(t)}" stroke="${LIGHT}" stroke-width="1"/>`;
    g += `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="${SLATE}">${fmtNum(t)}${unit}</text>`;
  }
  g += `<line x1="${padL}" y1="${y(0)}" x2="${W - padR}" y2="${y(0)}" stroke="${SLATE}" stroke-width="1"/>`;
  labels.forEach((lab, i) => {
    const cx = padL + slot * i + slot / 2;
    const v = values[i];
    const top = Math.min(y(v), y(0));
    const h = Math.abs(y(v) - y(0));
    g += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(h, 1).toFixed(1)}" fill="${v < 0 ? CORAL : color}" rx="2"><title>${esc(lab)}: ${fmtNum(v)}${unit}</title></rect>`;
    g += `<text x="${cx}" y="${(top - 5).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="#1c2b2e">${fmtNum(v)}${unit}</text>`;
    g += `<text x="${cx}" y="${H - 8}" text-anchor="middle" font-size="11" fill="${SLATE}">${esc(lab)}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}" class="chart"><title>${esc(title)}</title>${g}</svg>`;
}

// Horizontal bar chart, good for ranked categories and regions.
export function hbarChart({ labels, values, title, unit = '', color = TEAL, height = 240 }) {
  const W = 640;
  const rowH = Math.max(30, Math.min(44, (height - 30) / labels.length));
  const H = Math.max(120, labels.length * rowH + 34);
  const padL = 150;
  const padR = 56;
  const padT = 8;
  const iw = W - padL - padR;
  const max = Math.max(...values, 0);
  let g = '';
  labels.forEach((lab, i) => {
    const y = padT + i * rowH;
    const w = (values[i] / max) * iw;
    g += `<text x="${padL - 10}" y="${y + rowH / 2 + 4}" text-anchor="end" font-size="12" fill="#1c2b2e">${esc(lab)}</text>`;
    g += `<rect x="${padL}" y="${y + 5}" width="${Math.max(w, 1).toFixed(1)}" height="${rowH - 12}" fill="${color}" rx="2"><title>${esc(lab)}: ${fmtNum(values[i])}${unit}</title></rect>`;
    g += `<text x="${padL + w + 8}" y="${y + rowH / 2 + 4}" font-size="12" font-weight="700" fill="#1c2b2e">${fmtNum(values[i])}${unit}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}" class="chart"><title>${esc(title)}</title>${g}</svg>`;
}

// Donut chart with a legend list.
export function donutChart({ items, title, unit = '%' }) {
  const total = items.reduce((s, it) => s + it.value, 0);
  const colors = [TEAL, AMBER, CORAL, GREEN, '#7a9ea8', '#b98a2f'];
  const R = 80;
  const C = 2 * Math.PI * R;
  let offset = 0;
  let circles = '';
  items.forEach((it, i) => {
    const frac = it.value / total;
    const len = frac * C;
    circles += `<circle cx="100" cy="100" r="${R}" fill="none" stroke="${colors[i % colors.length]}" stroke-width="34" stroke-dasharray="${len.toFixed(1)} ${(C - len).toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" transform="rotate(-90 100 100)"><title>${esc(it.name)}: ${fmtNum(it.value)}${unit}</title></circle>`;
    offset += len;
  });
  const legend = items.map((it, i) => `<li><span class="swatch" style="background:${colors[i % colors.length]}"></span>${esc(it.name)} <strong>${fmtNum(it.value)}${unit}</strong></li>`).join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 200 200" role="img" aria-label="${esc(title)}" class="donut"><title>${esc(title)}</title>${circles}<text x="100" y="96" text-anchor="middle" font-size="22" font-weight="700" fill="${TEAL}">${fmtNum(total)}${unit}</text><text x="100" y="118" text-anchor="middle" font-size="11" fill="${SLATE}">total</text></svg><ul class="legend">${legend}</ul></div>`;
}

// Population pyramid: male bars to the left, female to the right.
export function pyramidChart({ bands, title }) {
  const W = 640;
  const rowH = 15;
  const H = bands.length * rowH + 44;
  const mid = W / 2;
  const max = Math.max(...bands.map((b) => Math.max(b.male, b.female)));
  const scale = (mid - 70) / max;
  let g = '';
  g += `<text x="${mid - 60}" y="16" text-anchor="end" font-size="12" font-weight="700" fill="${TEAL}">Male</text>`;
  g += `<text x="${mid + 60}" y="16" font-size="12" font-weight="700" fill="${CORAL}">Female</text>`;
  bands.forEach((b, i) => {
    const y = 24 + i * rowH;
    const mw = b.male * scale;
    const fw = b.female * scale;
    g += `<rect x="${(mid - mw).toFixed(1)}" y="${y}" width="${mw.toFixed(1)}" height="11" fill="${TEAL}"><title>${esc(b.band)} male: ${b.male} thousand</title></rect>`;
    g += `<rect x="${mid}" y="${y}" width="${fw.toFixed(1)}" height="11" fill="${CORAL}"><title>${esc(b.band)} female: ${b.female} thousand</title></rect>`;
    g += `<text x="${mid}" y="${y + 9}" text-anchor="middle" font-size="10" fill="${SLATE}">${esc(b.band)}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}" class="chart"><title>${esc(title)}</title>${g}</svg>`;
}

export const CHART_COLORS = { teal: TEAL, amber: AMBER, coral: CORAL, slate: SLATE, green: GREEN };
