# Lona Preta: instructions for AI coding assistants

Read this file fully before changing anything. It is short on purpose. The details live in `docs/`.

## What this is

A turn-based browser game about land occupations in Brazil (MST). It is **one file**, `index.html`
(HTML + CSS + JavaScript), with **no build step and no dependencies**. It is hosted on GitHub Pages
from the `main` branch root: https://ribeirojr.github.io/lona-preta/

## The one design rule you must not break

The game has **two modes that are tied to a language on purpose** (this is the owner's wish):

| Mode | Look | Language |
|---|---|---|
| **Night** (default) | dark colours | **English** |
| **Modo Bandeira** | light colours, flag green/yellow/blue | **Português do Brasil** |

So every change you make must work in **both** modes: every visible string exists in both languages,
and every colour comes from a CSS variable that both themes define.

## Golden rules

1. **No inline player-visible text.** Add a key to **both** `en` and `pt` in the `I18N` object and use
   `tr("key",{vars})`. Details: [docs/I18N.md](docs/I18N.md).
2. **No hard-coded colours.** Use a CSS variable (`var(--accent)`). New variable? Define it in `:root`
   **and** in `:root[data-theme="bandeira"]`. Details: [docs/THEMES.md](docs/THEMES.md).
3. **Do not call `tr()` at the top level of the script** to build constants. The language can change
   while the game runs, so translate when you render.
4. **Modals take a function:** `show(()=>html)`, never `show(html)`. Otherwise switching mode with a
   modal open shows the wrong language.
5. **The camp log stores keys:** `log("log.harvest",{n,crop})`, never `log("some text")`.
6. **Keep the saved game JSON-serializable** (`S`). No functions, no DOM nodes. Old saves must still load
   (see `start()` for how older shapes are upgraded).
7. **Keep it one file.** No bundler, no npm packages, no frameworks.
8. **SVG elements have no `.click()`.** In tests use `el.dispatchEvent(new MouseEvent("click",{bubbles:true}))`.

## Workflow (do these in order)

```
node scripts/check.mjs                      # must print OK. Catches missing translations, theme variables, typos
node scripts/shot.mjs night out.png         # look at the result in each mode (then open the PNG)
node scripts/shot.mjs bandeira out2.png
node scripts/shot.mjs bandeira out3.png scripts/drivers/play.js   # a screen after some clicks
```

Then commit. Pushing to `main` deploys GitHub Pages automatically (about a minute).
Full testing guide: [docs/TESTING.md](docs/TESTING.md).

## Where to look

| I want to... | Read |
|---|---|
| understand how the code is organized, the shape of the saved game, the game rules | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| add or change text, add a language key, plurals | [docs/I18N.md](docs/I18N.md) |
| change colours, add a CSS variable, fix a theme bug | [docs/THEMES.md](docs/THEMES.md) |
| do a specific task (add a crop, region, event, shop item, modal, theme...) | [docs/RECIPES.md](docs/RECIPES.md) |
| test and screenshot the game | [docs/TESTING.md](docs/TESTING.md) |

## Definition of done

- [ ] `node scripts/check.mjs` prints `OK`.
- [ ] You looked at a screenshot in **night** and in **bandeira** (a visual bug in one mode is the most common mistake).
- [ ] No English text appears in Modo Bandeira, and no Portuguese UI text appears in Night
      (place names like *Fazenda*, *Feijão*, *feira* stay Portuguese in both, on purpose).
- [ ] `README.md` and the relevant file in `docs/` are updated if behaviour or structure changed.
- [ ] Commit message says what and why. Commits end with the attribution line given by your tooling.

## Common mistakes

- Writing `R$` followed by a template placeholder: in a JS template literal use `R$${value}`; in an
  `I18N` string write `R${value}` where `{value}` is a placeholder (the `$` is just a character).
- Adding a key to `en` only. The checker fails, and Portuguese players would see English.
- Putting a colour in `style="..."` or in the SVG strings. Use `var(--name)`.
- Using `--corn` (yellow) for text or selection. It is invisible on the light theme. Use `--accent`.
- Forgetting that `render()` rebuilds the whole page: do not keep references to old DOM nodes.
