// Router and interactions for the Meridia statistics site.
// Hash routes: #/ #/population #/economy #/employment #/prices #/regions #/releases.
// Every control on every page works: chart toggles, table sorting, the region
// picker and the release search all update the page in place.

import { VIEWS } from './views.js';
import { YEARS, POPULATION, BIRTHS, DEATHS, NET_MIGRATION, GDP, UNEMPLOYMENT, REGIONS } from './data.js';
import { lineChart, barChart, CHART_COLORS } from './charts.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('[data-route]')];
const TITLES = {
  home: 'Meridia in numbers — National Statistics Office of Meridia',
  population: 'Population — National Statistics Office of Meridia',
  economy: 'Economy — National Statistics Office of Meridia',
  employment: 'Employment — National Statistics Office of Meridia',
  prices: 'Prices — National Statistics Office of Meridia',
  regions: 'Regions — National Statistics Office of Meridia',
  releases: 'Releases and methods — National Statistics Office of Meridia',
};

function route() {
  const hash = location.hash.replace(/^#\/?/, '') || 'home';
  return VIEWS[hash] ? hash : 'home';
}

function render() {
  const name = route();
  app.innerHTML = VIEWS[name]();
  document.title = TITLES[name];
  navLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.route === name));
  window.scrollTo(0, 0);
  wirePage(name);
}

function setActivePills(container, btn) {
  container.querySelectorAll('.pill').forEach((p) => p.classList.remove('is-active'));
  btn.classList.add('is-active');
}

// ---- Population page: switch the trend chart between measures ----
function wirePopulationChart() {
  const chart = document.getElementById('pop-chart');
  const note = document.getElementById('pop-chart-note');
  if (!chart) return;
  const series = {
    population: { labels: YEARS.map(String), values: POPULATION, title: 'Resident population of Meridia, 2015 to 2025', note: 'Resident population at 1 January, thousands.' },
    births: { labels: YEARS.slice(1).map(String), values: BIRTHS.slice(1), title: 'Births in Meridia, 2016 to 2025', note: 'Live births per year, thousands.' },
    deaths: { labels: YEARS.slice(1).map(String), values: DEATHS.slice(1), title: 'Deaths in Meridia, 2016 to 2025', note: 'Deaths per year, thousands.' },
    migration: { labels: YEARS.slice(1).map(String), values: NET_MIGRATION.slice(1), title: 'Net migration to Meridia, 2016 to 2025', note: 'Arrivals minus departures per year, thousands.' },
  };
  chart.parentElement.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-metric]');
    if (!btn) return;
    setActivePills(btn.parentElement, btn);
    const s = series[btn.dataset.metric];
    chart.innerHTML = lineChart({ labels: s.labels, values: s.values, title: s.title, color: btn.dataset.metric === 'deaths' ? CHART_COLORS.coral : CHART_COLORS.teal });
    note.textContent = s.note;
  });
}

// ---- Economy / Employment pages: switch a chart between all years and the last five ----
function wireRangeToggle(containerId, build) {
  const holder = document.getElementById(containerId);
  if (!holder) return;
  holder.parentElement.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-range]');
    if (!btn) return;
    setActivePills(btn.parentElement, btn);
    holder.innerHTML = build(btn.dataset.range);
  });
}

// ---- Regions page: sortable table and region picker ----
function wireRegions() {
  const table = document.getElementById('region-table');
  if (table) {
    const total = REGIONS.reduce((s, r) => s + r.population, 0);
    const rows = [...table.querySelectorAll('tbody tr')];
    const valueOf = (r, key) => {
      if (key === 'name') return r.name;
      if (key === 'share') return r.population / total;
      return r[key];
    };
    let sortKey = 'population';
    let dir = -1;
    table.querySelectorAll('th[data-sort]').forEach((th) => {
      th.addEventListener('click', () => {
        const key = th.dataset.sort;
        if (key === sortKey) dir = -dir;
        else { sortKey = key; dir = key === 'name' ? 1 : -1; }
        const sorted = [...rows].sort((a, b) => {
          const ra = REGIONS.find((r) => r.name === a.dataset.name);
          const rb = REGIONS.find((r) => r.name === b.dataset.name);
          const va = valueOf(ra, key);
          const vb = valueOf(rb, key);
          return (va < vb ? -1 : va > vb ? 1 : 0) * dir;
        });
        const tbody = table.querySelector('tbody');
        sorted.forEach((tr) => tbody.appendChild(tr));
        table.querySelectorAll('th').forEach((h) => h.removeAttribute('aria-sort'));
        th.setAttribute('aria-sort', dir === 1 ? 'ascending' : 'descending');
      });
    });
  }
  const select = document.getElementById('region-select');
  const detail = document.getElementById('region-detail');
  if (select && detail) {
    const show = () => {
      const r = REGIONS[Number(select.value)];
      const total = REGIONS.reduce((s, x) => s + x.population, 0);
      detail.innerHTML = `
        <div class="region-card">
          <h3>${r.name}${r.capital ? ' — capital region' : ''}</h3>
          <dl class="stat-list">
            <div><dt>Population</dt><dd>${r.population.toLocaleString('en-GB')} thousand (${((r.population / total) * 100).toFixed(1)}% of Meridia)</dd></div>
            <div><dt>GDP per person</dt><dd>M${r.gdpPerCapita.toLocaleString('en-GB')}</dd></div>
            <div><dt>Unemployment</dt><dd>${r.unemployment.toFixed(1)}%</dd></div>
            <div><dt>Median monthly wage</dt><dd>M${r.medianWage.toLocaleString('en-GB')}</dd></div>
          </dl>
        </div>`;
    };
    select.addEventListener('change', show);
    show();
  }
}

// ---- Releases page: live search and topic filter ----
function wireReleases() {
  const search = document.getElementById('release-search');
  const list = document.getElementById('release-list');
  const count = document.getElementById('release-count');
  if (!search || !list) return;
  let topic = 'All';
  const apply = () => {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    list.querySelectorAll('li').forEach((li) => {
      const okTopic = topic === 'All' || li.dataset.topic === topic;
      const okQuery = !q || li.dataset.title.includes(q) || li.textContent.toLowerCase().includes(q);
      li.style.display = okTopic && okQuery ? '' : 'none';
      if (okTopic && okQuery) shown += 1;
    });
    count.textContent = `${shown} release${shown === 1 ? '' : 's'} shown.`;
  };
  search.addEventListener('input', apply);
  list.parentElement.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-topic]');
    if (!btn) return;
    setActivePills(btn.parentElement, btn);
    topic = btn.dataset.topic;
    apply();
  });
}

function wirePage(name) {
  if (name === 'population') wirePopulationChart();
  if (name === 'economy') {
    wireRangeToggle('gdp-chart', (range) => {
      const yrs = range === 'recent' ? YEARS.slice(6) : YEARS;
      const vals = range === 'recent' ? GDP.slice(6) : GDP;
      return barChart({ labels: yrs.map(String), values: vals, title: `Gross domestic product of Meridia, ${yrs[0]} to ${yrs[yrs.length - 1]}`, color: CHART_COLORS.teal });
    });
  }
  if (name === 'employment') {
    wireRangeToggle('unemp-chart', (range) => {
      const yrs = range === 'recent' ? YEARS.slice(6) : YEARS;
      const vals = range === 'recent' ? UNEMPLOYMENT.slice(6) : UNEMPLOYMENT;
      return lineChart({ labels: yrs.map(String), values: vals, title: `Unemployment rate of Meridia, ${yrs[0]} to ${yrs[yrs.length - 1]}`, unit: '%', color: CHART_COLORS.coral });
    });
  }
  if (name === 'regions') wireRegions();
  if (name === 'releases') wireReleases();
}

window.addEventListener('hashchange', render);
render();
