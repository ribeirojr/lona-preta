# Architecture

Everything is in `index.html`: a `<style>` block, a tiny body, and one `<script>`.
Search the script for `=====` to jump between its 11 numbered sections.

## Files

```
index.html          the whole game
README.md           player-facing description and rules
CLAUDE.md           rules for AI assistants (start here if you are one)
AGENTS.md           pointer to CLAUDE.md
docs/               these guides
scripts/check.mjs   static checks (syntax, translations, theme variables)
scripts/shot.mjs    headless-Chrome screenshots, optionally after scripted clicks
scripts/drivers/    small click-through scripts used by shot.mjs
.nojekyll           tells GitHub Pages not to run Jekyll
```

## The 11 sections of the script

| # | Section | What lives there |
|---|---|---|
| 1 | THEME | `THEMES`, `applyTheme`, `toggleTheme`, `themeBtn`. Picks the mode and the language |
| 2 | I18N | The `I18N` dictionary (`en`, `pt`) between `/* i18n:begin */` and `/* i18n:end */`, plus `tr()` |
| 3 | DATA | Constants: `CROPS`, `NAMES`, `REGIONS`, `REGION_SITES`, `REGION_XY`, `BR` (Brazil outline), `geo()`, random helpers |
| 4 | STATE | `S`, `newGame`, `genEstates`, `genLand`, `log`, `save`, label helpers (`ownerKind`...) |
| 5 | PLOT ART | `art(plot)` returns inline SVG for one plot |
| 6 | RENDER | `render()` rebuilds the whole main screen into `#app` |
| 7 | MAP | `mapHtml()`, `estateCard()`, distance and move cost (`kmTo`, `moveCost`) |
| 8 | ACTIONS | The click and keydown handlers for the main screen |
| 9 | MONTH LOOP | `endMonth`, `eat`, `chickens`, `EVENTS`, `legal` (the court case) |
| 10 | MODALS | `show`, `openMarket`, `openChoose`, `openMove`, `doMove`, `openEnd`, the shop |
| 11 | BOOT | `start()` loads the save, upgrades old saves, renders, reopens the right modal |

## Data flow

```
click  ->  handler mutates S  ->  save()  ->  render()  ->  app.innerHTML = template strings
```

- There is **one** global state object `S`. Handlers change it, then call `render()`. There is no
  virtual DOM. `render()` throws away and rebuilds the HTML, so never hold on to DOM nodes.
- Modals live in `#ov > #modal`. `show(fn)` stores `fn` in `curModal` and sets `md.innerHTML=fn()`.
  Because `fn` is kept, `toggleTheme()` can call it again to redraw an open modal in the other language.
- Persistence: `save()` writes `S` as JSON to `localStorage["lonapreta"]`. The chosen mode is stored
  separately in `localStorage["lonapreta-theme"]`.

## The saved game `S`

| Field | Type | Meaning |
|---|---|---|
| `t` | number | months elapsed. Month index = `(9+t)%12` (game starts in October), year = `2026+floor((9+t)/12)` |
| `phase` | `"choose"` `"play"` `"evict"` `"won"` `"lost"` | which part of the game we are in |
| `families`, `labor`, `money` | number | labor refills each month to `families*2+tools` |
| `inv` | `{feijao,milho,mandioca,ovos}` | stores |
| `hens`, `chicks[]`, `goats`, `tools`, `carts` | number / ages | animals and equipment |
| `land` | land object or `null` | the estate the camp occupies |
| `estates[]` | land objects | the idle estates shown on the map (16 at start). The camp's own land is not in here |
| `history[]` | `{name,region,lon,lat,evicted}` | land left behind. Only `evicted:true` entries are drawn (as ✕) |
| `discovered`, `cas` | bool, `{owner,defense,months,laudo}` or `null` | the court case. `cas` exists once the owner has found out |
| `acted` | `{lawyer?,mob?}` | once-per-month actions already used |
| `sel` | number or `null` | selected plot index |
| `log[]` | `{k,v,at}` | camp log. `k` = i18n key, `v` = vars, `at` = month index `t` or `null` for "Start". Old saves may hold `{m,when}` strings |
| `prices` | `{feijao,milho,mandioca,ovos}` | re-rolled every month |
| `landsCount`, `evictions` | number | statistics for the end screen |

A **land object**: `{name,region,lon,lat,size,cols,fert,idle,owner,growth,vigil,well,plots[]}` where
`plots[i]` is `{s:"mato"|"terra"|"grow"|"ready", crop?, age?, f?}`
(`mato`=scrub, `terra`=cleared, `grow`=planted, `ready`=harvestable, `f`=yield factor).

Not saved (module variables): `moveSel` (selected estate index on the map), `take` (what is being packed),
`marketTab`, `curModal`.

## Game rules and where the numbers live

| Rule | Where |
|---|---|
| Crops: months to grow, yield, price | `CROPS` |
| Seed cost to plant: 2 | `SEED_COST` |
| Labor per month: 2 per family + 1 per hoe | `laborMax()` |
| Rainy season Oct to Mar gives full yield, dry gives half unless the land has a well | `RAINY`, the `plant` case in section 8 |
| Food: each family eats 2 per month, goats give 3 | `eat()` |
| Hens: 3 eggs/month if fed corn (1 corn per 3 hens), else 1 | `chickens()` |
| Court case: chance the owner notices | `legal()` (`pr`) |
| Hearing 6 months after being discovered. You win if `defense >= owner` | `legal()` |
| Defense per month = `round(0.6*plots in production + 0.5*families)` | `defenseTick()` |
| Lawyers R$30 (+6), INCRA R$60 (+2 per idle year), mobilization 3 labor (+5) | `case "lawyer"/"laudo"/"mob"` |
| Moving cost = R$10 + R$0.03 per km, road km = 1.3 x straight line | `kmTo()`, `moveCost()` |
| Carry capacity: 15 per family + 60 per ox cart | `cap()` |
| Shop prices | `SHOP` |

## The map

- `BR` is the border of Brazil as `[lon,lat]` pairs (Natural Earth 1:50m, public domain, simplified to ~7 km). `geo(lon,lat)` projects to a 400x395 SVG
  viewBox (equirectangular). `REGION_SITES` pins two real municipalities per region (`REGION_XY` is their midpoint).
- `genEstates()` makes 2 estates per region, one near each of the region's two sites (about 10 km of random jitter).
- Selecting a marker sets `moveSel`. The cost shown comes from `moveCost(estate)`.
- Leaving land voluntarily puts it back in `estates` as idle scrub. Being evicted does not (it gets a ✕).

## Gotchas

- **Translate at render time**, never in top-level constants (the language can change).
- **`show()` takes a function.** Read state *inside* the function.
- Label helpers (`ownerKind`, `fertLabel`, `vigilLabel`, `plotLabel`, `monthOf`) already return translated text.
- `EVENTS` entries return `[logKey, vars]` (or nothing). `endMonth` logs them with `log(...ev)`.
- Place names (Fazenda Santa Rita) and crop names (Feijão, Milho, Mandioca) are data, not translated.
- In JS template literals `R$${x}` prints `R$` then the value. In `I18N` strings use `R${x}` with `{x}` a placeholder.
- The plot art uses `--art-*` variables that are the same in both themes (it is drawn on brown soil).
