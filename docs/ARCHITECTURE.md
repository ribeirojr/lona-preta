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
| 3 | DATA | Constants: `CROPS`, `NAMES`, `REGIONS`, `REGION_XY`, `BR` (Brazil outline), `geo()`, random helpers |
| 4 | STATE | `S`, `K()` (camp on screen), `newGame`, `genCamps`, `makeCamp`, `genLand`, `log`, `save`, label helpers (`ownerKind`...) |
| 5 | PLOT ART | `art(plot)` returns inline SVG for one plot |
| 6 | RENDER | `render()` rebuilds the whole main screen into `#app`, `campTabs()`, `banner()` |
| 7 | MAP | `mapHtml()`: one marker per camp, `data-camp` |
| 8 | ACTIONS | The click and keydown handlers for the main screen |
| 9 | MONTH LOOP | `endMonth` (all live camps), `tickCamp`, `eat`, `chickens`, `EVENTS`, `legal` (the court case), `lose` |
| 10 | MODALS | `show`, `notice`/`pump` (modal queue), `info`, `openMarket`, `endModal`, the shop |
| 11 | BOOT | `start()` loads the save, `upgradeOld()` converts one-camp saves, renders, reopens the end screen |

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
| `phase` | `"play"` `"over"` | `"over"` once no camp is still fighting. The end screen is shown |
| `cur` | number | index in `camps` of the camp on screen |
| `camps[]` | camp objects | all the camps (4 at the start). They never leave the array, even when won or lost |
| `log[]` | `{k,v,at,c}` | movement log. `k` = i18n key, `v` = vars, `at` = month index `t` or `null` for "Start", `c` = name of the camp it is about or `null`. Old saves may hold `{m,when}` strings |
| `prices` | `{feijao,milho,mandioca,ovos}` | re-rolled every month, the same for every camp |

A **camp** is a land object plus everything that belongs to that camp (nothing is shared between camps):

```
land:   name, region, lon, lat, size, cols, fert, idle, owner, growth, vigil, well, plots[]
camp:   state, why?, endT?, families, labor, money, inv{feijao,milho,mandioca,ovos}, hens, chicks[], goats, tools,
        discovered, cas, acted{lawyer?,mob?}, sel
```

- `plots[i]` is `{s:"mato"|"terra"|"grow"|"ready", crop?, age?, f?}` (`mato`=scrub, `terra`=cleared, `grow`=planted, `ready`=harvestable, `f`=yield factor).
- `state` is `"camp"` (still fighting: farmed and ticked every month), `"won"` (a settlement) or `"lost"`. Won and lost camps are frozen.
- `why` is `"evicted"` or `"hunger"` for lost camps. `endT` is the month index when the camp was won or lost.
- `cas` is `null` or `{owner,defense,months,laudo}`; it exists once the owner has found out (`discovered`). It is cleared when the case ends.
- `labor` refills each month to `families*2+tools`.

Not saved (module variables): `marketTab`, `curModal`, `pending` (modals waiting for their turn).

## Game rules and where the numbers live

| Rule | Where |
|---|---|
| Crops: months to grow, yield, price | `CROPS` |
| Seed cost to plant: 2 | `SEED_COST` |
| Start: 4 camps in 4 regions, each 2 families, 4 labor, R$30, 3 hens, 12 feijão, 12 milho, 8 mandioca | `makeCamp()`, `genCamps()` |
| Labor per month: 2 per family + 1 per hoe | `laborMax()` |
| Rainy season Oct to Mar gives full yield, dry gives half unless the land has a well | `RAINY`, the `plant` case in section 8 |
| Food: each family eats 2 per month, goats give 3 | `eat()` |
| Hens: 3 eggs/month if fed corn (1 corn per 3 hens), else 1 | `chickens()` |
| Court case: chance the owner notices | `legal()` (`pr`) |
| Hearing 6 months after being discovered. You win if `defense >= owner` | `legal()` |
| Defense per month = `round(0.6*plots in production + 0.5*families)` | `defenseTick()` |
| Lawyers R$30 (+6), INCRA R$60 (+2 per idle year), mobilization 3 labor (+5) | `case "lawyer"/"laudo"/"mob"` |
| Chance per camp per month of an event: 30%. Agrarian reform fair (prices +50%): 8% per month, for everyone | `tickCamp()`, `endMonth()` |
| A camp is lost when it is evicted or its last family leaves. The game is over when no camp is still fighting | `lose()`, `endMonth()` |
| Shop prices | `SHOP` |

## The map

- `BR` is a hand-made outline of Brazil as `[lon,lat]` pairs. `geo(lon,lat)` projects to a 400x410 SVG
  viewBox (equirectangular; the outline fills 395, the rest leaves room for a label under the southernmost camp). `REGION_XY` gives each region a centre. Positions are illustrative, not survey data.
- `genCamps(n)` picks `n` different regions whose centres are more than 62 map units apart (so markers and labels do not overlap), and nudges each camp a little off the centre.
- Every camp has a marker with `data-camp="i"`. Clicking it (or its tab) sets `S.cur`.

## Several camps at once

- `K()` is the camp on screen. Handlers act on `K()`. Anything that happens at the end of the month loops over every live camp, so those functions take the camp as an argument (`eat(k,..)`, `legal(k)`, `active(k)`...).
- `log(key,vars,camp)` defaults to the camp on screen. Pass `null` for news that is about nobody in particular.
- News that can happen in a camp you are not looking at (the owner finds out, a hearing is won or lost, a camp starves) is queued with `notice(fn)` during `endMonth()`. `pump()` shows the next one when the previous is closed. The end screen is queued the same way.

## Gotchas

- **Translate at render time**, never in top-level constants (the language can change).
- **`show()` takes a function.** Read state *inside* the function.
- Label helpers (`ownerKind`, `fertLabel`, `vigilLabel`, `plotLabel`, `monthOf`) already return translated text.
- `EVENTS` entries return `[logKey, vars]` (or nothing). `endMonth` logs them with `log(...ev)`.
- Place names (Fazenda Santa Rita) and crop names (Feijão, Milho, Mandioca) are data, not translated.
- In JS template literals `R$${x}` prints `R$` then the value. In `I18N` strings use `R${x}` with `{x}` a placeholder.
- The plot art uses `--art-*` variables that are the same in both themes (it is drawn on brown soil).
