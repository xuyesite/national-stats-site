// Meridia — illustrative national statistics dataset.
// Every figure is invented example data for the fictional country of Meridia.
// The series are internally consistent: regional populations sum to the national
// total, births minus deaths plus net migration equals the population change,
// and the CPI inflation rates are derived from the CPI index itself.

export const META = {
  country: 'Meridia',
  currency: 'merid',
  currencySymbol: 'M',
  latestYear: 2025,
  note: 'Illustrative example data for the fictional country of Meridia. Not real official statistics.',
  sourceLine: 'Source: Meridia National Statistics Office, 2026',
};

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// Resident population at 1 January, thousands.
export const POPULATION = [4512, 4541, 4573, 4608, 4645, 4671, 4702, 4743, 4795, 4828, 4862];

// Components of change, thousands. births - deaths + netMigration = population change.
export const BIRTHS = [null, 47.1, 47.6, 48.0, 48.4, 47.2, 47.8, 48.6, 49.1, 48.8, 48.3];
export const DEATHS = [null, 40.2, 40.5, 40.8, 41.0, 42.6, 41.9, 41.3, 41.0, 40.9, 41.2];
export const NET_MIGRATION = [null, 22.1, 24.9, 27.8, 29.6, 21.4, 25.1, 33.7, 43.9, 25.1, 26.9];

// Age structure, 2025, thousands. Male + female bands sum to 4,862.
export const AGE_BANDS = [
  { band: '0–4', male: 148, female: 141 },
  { band: '5–9', male: 154, female: 147 },
  { band: '10–14', male: 158, female: 150 },
  { band: '15–19', male: 162, female: 155 },
  { band: '20–24', male: 170, female: 164 },
  { band: '25–29', male: 177, female: 166 },
  { band: '30–34', male: 175, female: 175 },
  { band: '35–39', male: 172, female: 172 },
  { band: '40–44', male: 167, female: 165 },
  { band: '45–49', male: 158, female: 157 },
  { band: '50–54', male: 152, female: 154 },
  { band: '55–59', male: 143, female: 147 },
  { band: '60–64', male: 132, female: 139 },
  { band: '65–69', male: 116, female: 126 },
  { band: '70–74', male: 96, female: 108 },
  { band: '75–79', male: 70, female: 83 },
  { band: '80–84', male: 43, female: 54 },
  { band: '85+', male: 25, female: 41 },
];

export const AGE_SHARES = { young: 18.5, working: 65.8, older: 15.7 };
export const LIFE_EXPECTANCY = { all: 81.4, female: 83.9, male: 78.9 };
export const MEDIAN_AGE = 39.2;

// GDP, billion merids, nominal.
export const GDP = [152.3, 158.9, 166.4, 174.8, 182.6, 176.2, 189.5, 201.8, 209.6, 213.9, 218.4];
// Real GDP growth, percent.
export const GDP_GROWTH = [null, 2.4, 2.8, 3.1, 2.6, -4.2, 5.8, 4.1, 2.3, 1.9, 2.1];

// Gross value added by sector, share of total, 2025. Sums to 100.0.
export const GVA_SECTORS = [
  { name: 'Services', share: 71.2 },
  { name: 'Manufacturing', share: 14.6 },
  { name: 'Construction', share: 6.8 },
  { name: 'Agriculture', share: 3.9 },
  { name: 'Mining and energy', share: 3.5 },
];

// Trade, billion merids, 2025.
export const TRADE = { exports: 96.3, imports: 101.8, balance: -5.5 };
export const EXPORT_DESTINATIONS = [
  { name: 'Kestrel Union', share: 31 },
  { name: 'Vardania', share: 18 },
  { name: 'Ostara', share: 12 },
  { name: 'Telmara', share: 9 },
  { name: 'Rest of world', share: 30 },
];

// Unemployment rate, percent of labour force.
export const UNEMPLOYMENT = [6.8, 6.4, 5.9, 5.3, 4.9, 7.1, 6.2, 5.0, 4.5, 4.4, 4.2];
export const LABOUR = {
  labourForce: 2594, // thousands, 2025
  employed: 2486, // thousands, 2025
  unemployed: 108, // thousands, 2025
  participation: 81.0, // percent of working-age population
  employmentRate: 74.6, // percent of working-age population
  medianWage: 3840, // merids per month, 2025
  meanWage: 4210,
};

// Employment by industry, thousands, 2025. Sums to 2,486.
export const EMPLOYMENT_SECTORS = [
  { name: 'Services', value: 1612 },
  { name: 'Manufacturing', value: 318 },
  { name: 'Construction', value: 187 },
  { name: 'Agriculture', value: 104 },
  { name: 'Mining and energy', value: 45 },
  { name: 'Other industries', value: 220 },
];

// CPI index, 2020 = 100. Inflation is derived from this index.
export const CPI = [91.2, 93.0, 95.1, 97.4, 99.2, 100.0, 102.8, 110.9, 118.4, 124.1, 127.1];

// CPI by category, 2025: annual change, percent.
export const CPI_CATEGORIES = [
  { name: 'Food and drink', change: 2.9 },
  { name: 'Housing and utilities', change: 3.1 },
  { name: 'Transport', change: 1.2 },
  { name: 'Health', change: 2.2 },
  { name: 'Education', change: 3.4 },
  { name: 'Recreation and culture', change: 1.8 },
  { name: 'Clothing and footwear', change: 0.6 },
  { name: 'Communication', change: -0.4 },
];

// Regions, 2025. Populations sum to 4,862 thousand.
export const REGIONS = [
  { name: 'Northport', capital: true, population: 1486, gdpPerCapita: 58200, unemployment: 3.1, medianWage: 4310 },
  { name: 'Eastvale', capital: false, population: 912, gdpPerCapita: 46800, unemployment: 3.9, medianWage: 3980 },
  { name: 'Southmere', capital: false, population: 784, gdpPerCapita: 41300, unemployment: 4.6, medianWage: 3720 },
  { name: 'Westford', capital: false, population: 693, gdpPerCapita: 38900, unemployment: 4.9, medianWage: 3590 },
  { name: 'Highlands', capital: false, population: 521, gdpPerCapita: 33400, unemployment: 5.8, medianWage: 3310 },
  { name: 'Isles', capital: false, population: 466, gdpPerCapita: 36700, unemployment: 5.1, medianWage: 3480 },
];

// Latest statistical releases.
export const RELEASES = [
  { title: 'Population Estimates 2025', date: '2026-11-20', topic: 'Population', summary: 'Resident population reaches 4.86 million; net migration adds 26,900 people.' },
  { title: 'Gross Domestic Product, Q3 2026', date: '2026-11-14', topic: 'Economy', summary: 'GDP grows 0.6% on the quarter; services drive the increase.' },
  { title: 'Labour Force Survey, October 2026', date: '2026-11-11', topic: 'Employment', summary: 'Unemployment steady at 4.2%; employment rate 74.6%.' },
  { title: 'Consumer Price Index, October 2026', date: '2026-11-07', topic: 'Prices', summary: 'Annual inflation 2.4%; food prices up 2.9% on the year.' },
  { title: 'Regional Accounts 2025', date: '2026-10-28', topic: 'Regions', summary: 'Northport GDP per capita 58,200 merids, the highest of the six regions.' },
  { title: 'Migration Statistics 2025', date: '2026-10-15', topic: 'Population', summary: 'Net migration 26,900; arrivals highest from the Kestrel Union.' },
  { title: 'Household Income and Living Conditions 2025', date: '2026-09-30', topic: 'Economy', summary: 'Median household income 61,400 merids a year; poverty rate 11.8%.' },
  { title: 'Business Demography 2025', date: '2026-09-12', topic: 'Economy', summary: '312,400 active businesses; 18,900 new firms registered in 2025.' },
];

// ---- Derived helpers (computed from the series above, so figures stay consistent) ----

export function cpiInflation(yearIndex) {
  if (yearIndex < 1) return null;
  return ((CPI[yearIndex] / CPI[yearIndex - 1] - 1) * 100);
}

export function gdpPerCapita(yearIndex) {
  return Math.round((GDP[yearIndex] * 1e9) / (POPULATION[yearIndex] * 1000));
}

export function populationChange(yearIndex) {
  if (yearIndex < 1) return null;
  return POPULATION[yearIndex] - POPULATION[yearIndex - 1];
}

export function fmtThousands(n) {
  return n.toLocaleString('en-GB');
}

export function fmtMillions(n) {
  return (n / 1000).toFixed(2);
}
