# Meridia Statistics

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/xuyesite/national-stats-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/xuyesite/national-stats-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

An original national statistics site for the make.fun **Make the best national statistics site** bounty. It presents the statistics of the fictional country Meridia — every figure is invented sample data, labelled as such on every page, and the site copies no real institution's brand, text or images.

## What it covers

Seven pages, each reached by a link: Overview, Population, Economy, Employment, Prices, Regions, and Releases & Methods. Population trends and an age pyramid, GDP and trade, unemployment by industry, CPI and inflation by category, six regions with sortable tables, and a searchable release calendar. Charts are hand-written SVG (line, bar, horizontal bar, donut, pyramid) with no chart library, and every control does what it says.

## Run

Open `app/index.html` in a desktop browser, or serve the `app/` folder statically (`node serve.ts` serves it at http://localhost:8080). Fully offline: no network requests, works on a phone too.

## Files

- `app/` — the whole site (HTML/CSS/JS, standard library only).
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` into the output directory and writes `dossier.json`.
- `screenshots/` — 4 screenshots of the site (overview, population, economy, phone size).
- `shots.json` — the shot list.
- `vendor/makefun-frontend.ts` — the kit's dossier helper (not authored here).
- `LICENSE` — MIT.
