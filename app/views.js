// Page renderers for the Meridia statistics site.
// Each view is a function returning HTML for #app. Figures come from data.js;
// charts from charts.js. Every link is a hash route inside the site.

import {
  META, YEARS, POPULATION, BIRTHS, DEATHS, NET_MIGRATION, AGE_BANDS, AGE_SHARES,
  LIFE_EXPECTANCY, MEDIAN_AGE, GDP, GDP_GROWTH, GVA_SECTORS, TRADE, EXPORT_DESTINATIONS,
  UNEMPLOYMENT, LABOUR, EMPLOYMENT_SECTORS, CPI, CPI_CATEGORIES, REGIONS, RELEASES,
  cpiInflation, gdpPerCapita, fmtThousands, fmtMillions,
} from './data.js';
import { lineChart, barChart, hbarChart, donutChart, pyramidChart, CHART_COLORS } from './charts.js';

const SRC = `<p class="source">${META.sourceLine}. Figures are illustrative example data for the fictional country of Meridia.</p>`;

function kpi(label, value, sub) {
  return `<div class="kpi"><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div><div class="kpi-sub">${sub}</div></div>`;
}

function sectionHead(title, intro) {
  return `<div class="section-head"><h2>${title}</h2><p>${intro}</p></div>`;
}

function latest(i) {
  return YEARS.length - 1 - i;
}

// ---------------- Overview ----------------
export function viewHome() {
  const i = latest(0);
  const popChange = ((POPULATION[i] / POPULATION[i - 1] - 1) * 100).toFixed(1);
  return `
  <div class="hero">
    <p class="eyebrow">National Statistics Office of Meridia</p>
    <h1>Meridia in numbers</h1>
    <p class="lede">The official figures for Meridia — how many of us there are, what we earn,
    what things cost, and where we live. All figures for ${META.latestYear}, unless a year is shown.</p>
  </div>
  <div class="kpi-grid">
    ${kpi('Resident population', fmtMillions(POPULATION[i]) + ' million', `+${popChange}% on ${YEARS[i - 1]}`)}
    ${kpi('GDP per person', 'M' + fmtThousands(gdpPerCapita(i)), `Real GDP growth ${GDP_GROWTH[i].toFixed(1)}%`)}
    ${kpi('Unemployment rate', UNEMPLOYMENT[i].toFixed(1) + '%', `${fmtThousands(LABOUR.unemployed)} thousand people`)}
    ${kpi('Consumer price inflation', cpiInflation(i).toFixed(1) + '%', `CPI index ${CPI[i].toFixed(1)} (2020 = 100)`)}
    ${kpi('Life expectancy at birth', LIFE_EXPECTANCY.all.toFixed(1) + ' years', `Women ${LIFE_EXPECTANCY.female.toFixed(1)} · Men ${LIFE_EXPECTANCY.male.toFixed(1)}`)}
  </div>
  <div class="panel-grid">
    <section class="panel wide">
      <h2>Population, 2015–2025</h2>
      <p class="panel-note">Resident population at 1 January, thousands.</p>
      ${lineChart({ labels: YEARS.map(String), values: POPULATION, title: 'Resident population of Meridia, 2015 to 2025', unit: '' })}
      ${SRC}
    </section>
    <section class="panel">
      <h2>Real GDP growth</h2>
      <p class="panel-note">Annual change, percent.</p>
      ${barChart({ labels: YEARS.slice(1).map(String), values: GDP_GROWTH.slice(1), title: 'Real GDP growth, 2016 to 2025', unit: '%', color: CHART_COLORS.green, height: 200 })}
      ${SRC}
    </section>
    <section class="panel">
      <h2>Unemployment rate</h2>
      <p class="panel-note">Percent of the labour force.</p>
      ${lineChart({ labels: YEARS.map(String), values: UNEMPLOYMENT, title: 'Unemployment rate, 2015 to 2025', unit: '%', color: CHART_COLORS.coral, height: 200 })}
      ${SRC}
    </section>
  </div>
  <section class="panel">
    <h2>Latest releases</h2>
    <ul class="release-list">
      ${RELEASES.slice(0, 3).map((r) => `<li><span class="release-date">${r.date}</span><a href="#/releases">${r.title}</a><span class="release-topic">${r.topic}</span></li>`).join('')}
    </ul>
    <p><a class="text-link" href="#/releases">All releases and methods →</a></p>
  </section>
  <section class="panel">
    <h2>Explore by topic</h2>
    <div class="topic-grid">
      <a class="topic-card" href="#/population"><strong>Population</strong><span>4.86 million people, age structure, births and migration</span></a>
      <a class="topic-card" href="#/economy"><strong>Economy</strong><span>GDP, growth, trade and what Meridia produces</span></a>
      <a class="topic-card" href="#/employment"><strong>Employment</strong><span>Jobs, unemployment, wages and industries</span></a>
      <a class="topic-card" href="#/prices"><strong>Prices</strong><span>Inflation, the CPI and what costs more this year</span></a>
      <a class="topic-card" href="#/regions"><strong>Regions</strong><span>Six regions compared, from Northport to the Isles</span></a>
    </div>
  </section>`;
}

// ---------------- Population ----------------
export function viewPopulation() {
  const i = latest(0);
  return `
  ${sectionHead('Population', 'How many people live in Meridia, how the population changes, and how old we are.')}
  <div class="kpi-grid">
    ${kpi('Resident population', fmtMillions(POPULATION[i]) + ' million', `1 January ${META.latestYear}`)}
    ${kpi('Change in 2025', '+34,000', 'Births 48,300 · Deaths 41,200 · Net migration +26,900')}
    ${kpi('Median age', MEDIAN_AGE.toFixed(1) + ' years', 'Aged 65 and over: 15.7% of the population')}
    ${kpi('Life expectancy', LIFE_EXPECTANCY.all.toFixed(1) + ' years', `Women ${LIFE_EXPECTANCY.female.toFixed(1)} · Men ${LIFE_EXPECTANCY.male.toFixed(1)}`)}
  </div>
  <section class="panel">
    <h2>Population trend</h2>
    <div class="controls" role="group" aria-label="Choose a measure">
      <button class="pill is-active" data-metric="population">Population</button>
      <button class="pill" data-metric="births">Births</button>
      <button class="pill" data-metric="deaths">Deaths</button>
      <button class="pill" data-metric="migration">Net migration</button>
    </div>
    <div id="pop-chart">${lineChart({ labels: YEARS.map(String), values: POPULATION, title: 'Resident population of Meridia, 2015 to 2025' })}</div>
    <p class="panel-note" id="pop-chart-note">Resident population at 1 January, thousands.</p>
    ${SRC}
  </section>
  <div class="panel-grid">
    <section class="panel wide">
      <h2>Age structure, 2025</h2>
      <p class="panel-note">Thousands of people in each five-year age band.</p>
      ${pyramidChart({ bands: AGE_BANDS, title: 'Population pyramid of Meridia, 2025' })}
      <p class="panel-note">Aged 0–14: ${AGE_SHARES.young}% · Aged 15–64: ${AGE_SHARES.working}% · Aged 65 and over: ${AGE_SHARES.older}%.</p>
      ${SRC}
    </section>
    <section class="panel">
      <h2>Components of change</h2>
      <p class="panel-note">Thousands per year. Births minus deaths plus net migration equals the change in population.</p>
      <table class="data-table">
        <thead><tr><th>Year</th><th>Population</th><th>Births</th><th>Deaths</th><th>Net migr.</th></tr></thead>
        <tbody>
          ${YEARS.map((y, j) => `<tr><td>${y}</td><td>${fmtThousands(POPULATION[j])}</td><td>${BIRTHS[j] === null ? '—' : BIRTHS[j].toFixed(1)}</td><td>${DEATHS[j] === null ? '—' : DEATHS[j].toFixed(1)}</td><td>${NET_MIGRATION[j] === null ? '—' : '+' + NET_MIGRATION[j].toFixed(1)}</td></tr>`).join('')}
        </tbody>
      </table>
      ${SRC}
    </section>
  </div>`;
}

// ---------------- Economy ----------------
export function viewEconomy() {
  const i = latest(0);
  return `
  ${sectionHead('Economy', 'What Meridia produces, how fast it grows, and what it buys and sells abroad.')}
  <div class="kpi-grid">
    ${kpi('Gross domestic product', 'M' + GDP[i].toFixed(1) + ' billion', `Real growth ${GDP_GROWTH[i].toFixed(1)}% in ${META.latestYear}`)}
    ${kpi('GDP per person', 'M' + fmtThousands(gdpPerCapita(i)), 'Nominal, 2025')}
    ${kpi('Exports', 'M' + TRADE.exports.toFixed(1) + ' billion', 'Goods and services, 2025')}
    ${kpi('Imports', 'M' + TRADE.imports.toFixed(1) + ' billion', `Trade balance M${TRADE.balance.toFixed(1)} billion`)}
  </div>
  <div class="panel-grid">
    <section class="panel wide">
      <h2>GDP, 2015–2025</h2>
      <div class="controls" role="group" aria-label="Choose a range">
        <button class="pill is-active" data-range="all">All years</button>
        <button class="pill" data-range="recent">Last 5 years</button>
      </div>
      <div id="gdp-chart">${barChart({ labels: YEARS.map(String), values: GDP, title: 'Gross domestic product of Meridia, 2015 to 2025', unit: '', color: CHART_COLORS.teal })}</div>
      <p class="panel-note">Nominal GDP, billion merids. The 2020 fall is the pandemic year; growth resumed in 2021.</p>
      ${SRC}
    </section>
    <section class="panel">
      <h2>What Meridia produces</h2>
      <p class="panel-note">Gross value added by sector, share of total, 2025.</p>
      ${donutChart({ items: GVA_SECTORS.map((s) => ({ name: s.name, value: s.share })), title: 'Gross value added by sector, 2025' })}
      ${SRC}
    </section>
  </div>
  <div class="panel-grid">
    <section class="panel">
      <h2>Trade in 2025</h2>
      <p class="panel-note">Billion merids.</p>
      ${barChart({ labels: ['Exports', 'Imports'], values: [TRADE.exports, TRADE.imports], title: 'Exports and imports of Meridia, 2025', color: CHART_COLORS.amber, height: 200 })}
      <p class="panel-note">Meridia imports M5.5 billion more than it exports.</p>
      ${SRC}
    </section>
    <section class="panel">
      <h2>Where exports go</h2>
      <p class="panel-note">Share of exports, 2025.</p>
      ${hbarChart({ labels: EXPORT_DESTINATIONS.map((d) => d.name), values: EXPORT_DESTINATIONS.map((d) => d.share), title: 'Export destinations, 2025', unit: '%', color: CHART_COLORS.teal, height: 220 })}
      ${SRC}
    </section>
    <section class="panel">
      <h2>GDP by year</h2>
      <table class="data-table">
        <thead><tr><th>Year</th><th>GDP (bn M)</th><th>Real growth</th><th>GDP per person</th></tr></thead>
        <tbody>
          ${YEARS.map((y, j) => `<tr><td>${y}</td><td>${GDP[j].toFixed(1)}</td><td>${GDP_GROWTH[j] === null ? '—' : GDP_GROWTH[j].toFixed(1) + '%'}</td><td>M${fmtThousands(gdpPerCapita(j))}</td></tr>`).join('')}
        </tbody>
      </table>
      ${SRC}
    </section>
  </div>`;
}

// ---------------- Employment ----------------
export function viewEmployment() {
  const i = latest(0);
  return `
  ${sectionHead('Employment', 'Who works in Meridia, who is looking for work, and what jobs pay.')}
  <div class="kpi-grid">
    ${kpi('Unemployment rate', UNEMPLOYMENT[i].toFixed(1) + '%', `${fmtThousands(LABOUR.unemployed)} thousand people`)}
    ${kpi('People in work', fmtMillions(LABOUR.employed) + ' million', `Labour force ${fmtMillions(LABOUR.labourForce)} million`)}
    ${kpi('Employment rate', LABOUR.employmentRate.toFixed(1) + '%', `Labour force participation ${LABOUR.participation.toFixed(1)}%`)}
    ${kpi('Median monthly wage', 'M' + fmtThousands(LABOUR.medianWage), `Mean wage M${fmtThousands(LABOUR.meanWage)}`)}
  </div>
  <div class="panel-grid">
    <section class="panel wide">
      <h2>Unemployment rate, 2015–2025</h2>
      <div class="controls" role="group" aria-label="Choose a range">
        <button class="pill is-active" data-range="all">All years</button>
        <button class="pill" data-range="recent">Last 5 years</button>
      </div>
      <div id="unemp-chart">${lineChart({ labels: YEARS.map(String), values: UNEMPLOYMENT, title: 'Unemployment rate of Meridia, 2015 to 2025', unit: '%', color: CHART_COLORS.coral })}</div>
      <p class="panel-note">Percent of the labour force. The 2020 rise is the pandemic year.</p>
      ${SRC}
    </section>
    <section class="panel">
      <h2>Jobs by industry, 2025</h2>
      <p class="panel-note">Thousands of people in work.</p>
      ${hbarChart({ labels: EMPLOYMENT_SECTORS.map((s) => s.name), values: EMPLOYMENT_SECTORS.map((s) => s.value), title: 'Employment by industry, 2025', unit: '', color: CHART_COLORS.teal, height: 240 })}
      ${SRC}
    </section>
  </div>
  <section class="panel">
    <h2>Unemployment by year</h2>
    <table class="data-table">
      <thead><tr><th>Year</th><th>Unemployment rate</th><th>Labour force (thousands)</th><th>In work (thousands)</th></tr></thead>
      <tbody>
        ${YEARS.map((y, j) => `<tr><td>${y}</td><td>${UNEMPLOYMENT[j].toFixed(1)}%</td><td>${j === YEARS.length - 1 ? fmtThousands(LABOUR.labourForce) : '—'}</td><td>${j === YEARS.length - 1 ? fmtThousands(LABOUR.employed) : '—'}</td></tr>`).join('')}
      </tbody>
    </table>
    <p class="panel-note">Labour force totals are published for the latest year only in this release.</p>
    ${SRC}
  </section>`;
}

// ---------------- Prices ----------------
export function viewPrices() {
  const i = latest(0);
  const infl = YEARS.slice(1).map((_, j) => +cpiInflation(j + 1).toFixed(1));
  return `
  ${sectionHead('Prices', 'What things cost in Meridia, and how fast prices are rising.')}
  <div class="kpi-grid">
    ${kpi('Consumer price inflation', cpiInflation(i).toFixed(1) + '%', `Annual rate, ${META.latestYear}`)}
    ${kpi('CPI index', CPI[i].toFixed(1), '2020 = 100')}
    ${kpi('Food prices', '+' + CPI_CATEGORIES[0].change.toFixed(1) + '%', 'Annual change, 2025')}
    ${kpi('Housing and utilities', '+' + CPI_CATEGORIES[1].change.toFixed(1) + '%', 'Annual change, 2025')}
  </div>
  <div class="panel-grid">
    <section class="panel wide">
      <h2>Consumer price index, 2015–2025</h2>
      <p class="panel-note">Index, 2020 = 100.</p>
      ${lineChart({ labels: YEARS.map(String), values: CPI, title: 'Consumer price index of Meridia, 2015 to 2025', color: CHART_COLORS.amber })}
      ${SRC}
    </section>
    <section class="panel">
      <h2>Inflation by year</h2>
      <p class="panel-note">Annual change in the CPI, percent.</p>
      ${barChart({ labels: YEARS.slice(1).map(String), values: infl, title: 'Inflation in Meridia, 2016 to 2025', unit: '%', color: CHART_COLORS.coral, height: 200 })}
      ${SRC}
    </section>
  </div>
  <div class="panel-grid">
    <section class="panel">
      <h2>What rose most in 2025</h2>
      <p class="panel-note">Annual price change by category, percent.</p>
      ${hbarChart({ labels: CPI_CATEGORIES.map((c) => c.name), values: CPI_CATEGORIES.map((c) => c.change), title: 'Price change by category, 2025', unit: '%', color: CHART_COLORS.teal, height: 300 })}
      ${SRC}
    </section>
    <section class="panel">
      <h2>CPI by year</h2>
      <table class="data-table">
        <thead><tr><th>Year</th><th>CPI (2020 = 100)</th><th>Inflation</th></tr></thead>
        <tbody>
          ${YEARS.map((y, j) => `<tr><td>${y}</td><td>${CPI[j].toFixed(1)}</td><td>${cpiInflation(j) === null ? '—' : cpiInflation(j).toFixed(1) + '%'}</td></tr>`).join('')}
        </tbody>
      </table>
      ${SRC}
    </section>
  </div>`;
}

// ---------------- Regions ----------------
export function viewRegions() {
  const total = REGIONS.reduce((s, r) => s + r.population, 0);
  const sorted = [...REGIONS].sort((a, b) => b.population - a.population);
  return `
  ${sectionHead('Regions', 'Six regions, one country: compare population, income and jobs where people live.')}
  <section class="panel">
    <h2>Population by region, 2025</h2>
    <p class="panel-note">Thousands of people. Click a column heading to sort the table.</p>
    ${hbarChart({ labels: sorted.map((r) => r.name), values: sorted.map((r) => r.population), title: 'Population by region, 2025', color: CHART_COLORS.teal, height: 240 })}
    <table class="data-table sortable" id="region-table">
      <thead><tr>
        <th data-sort="name">Region</th>
        <th data-sort="population">Population (thousands)</th>
        <th data-sort="share">Share of Meridia</th>
        <th data-sort="gdpPerCapita">GDP per person (M)</th>
        <th data-sort="unemployment">Unemployment</th>
        <th data-sort="medianWage">Median wage (M/month)</th>
      </tr></thead>
      <tbody>
        ${REGIONS.map((r) => `<tr data-name="${r.name}"><td>${r.name}${r.capital ? ' ★' : ''}</td><td>${fmtThousands(r.population)}</td><td>${((r.population / total) * 100).toFixed(1)}%</td><td>${fmtThousands(r.gdpPerCapita)}</td><td>${r.unemployment.toFixed(1)}%</td><td>${fmtThousands(r.medianWage)}</td></tr>`).join('')}
      </tbody>
    </table>
    <p class="panel-note">★ Northport is the capital region. Regional rates are rounded to one decimal place, so they do not average exactly to the national figure.</p>
    ${SRC}
  </section>
  <section class="panel">
    <h2>Region in focus</h2>
    <label class="field-label" for="region-select">Choose a region</label>
    <select id="region-select">
      ${REGIONS.map((r, idx) => `<option value="${idx}">${r.name}${r.capital ? ' (capital region)' : ''}</option>`).join('')}
    </select>
    <div id="region-detail"></div>
  </section>`;
}

// ---------------- Releases ----------------
export function viewReleases() {
  return `
  ${sectionHead('Releases and methods', 'The newest figures first, and how they are made.')}
  <section class="panel">
    <h2>Latest releases</h2>
    <div class="controls">
      <input id="release-search" type="search" placeholder="Search releases…" aria-label="Search releases">
    </div>
    <div class="controls" role="group" aria-label="Filter by topic">
      <button class="pill is-active" data-topic="All">All topics</button>
      <button class="pill" data-topic="Population">Population</button>
      <button class="pill" data-topic="Economy">Economy</button>
      <button class="pill" data-topic="Employment">Employment</button>
      <button class="pill" data-topic="Prices">Prices</button>
      <button class="pill" data-topic="Regions">Regions</button>
    </div>
    <ul class="release-list" id="release-list">
      ${RELEASES.map((r) => `<li data-topic="${r.topic}" data-title="${r.title.toLowerCase()}"><span class="release-date">${r.date}</span><strong>${r.title}</strong><span class="release-topic">${r.topic}</span><span class="release-summary">${r.summary}</span></li>`).join('')}
    </ul>
    <p class="panel-note" id="release-count">${RELEASES.length} releases shown.</p>
  </section>
  <section class="panel">
    <h2>How the figures are made</h2>
    <p>Population figures come from the population register, updated with births, deaths and
    migration records. GDP is compiled from business surveys and tax records. Prices are
    collected each month from shops and services across all six regions. The labour force
    survey interviews 12,000 households every quarter.</p>
    <p>Figures are revised when better data arrives; each release notes what changed.
    A figure marked provisional may move in the next release.</p>
  </section>
  <section class="panel">
    <h2>About this site</h2>
    <p>This site is an illustrative example built for the make.fun national statistics site
    competition. Meridia is a fictional country and every figure on this site is invented
    example data, written to be internally consistent. It is not the statistics of any real
    country and must not be quoted as official data.</p>
    <p>${META.sourceLine}.</p>
  </section>`;
}

export const VIEWS = {
  home: viewHome,
  population: viewPopulation,
  economy: viewEconomy,
  employment: viewEmployment,
  prices: viewPrices,
  regions: viewRegions,
  releases: viewReleases,
};
