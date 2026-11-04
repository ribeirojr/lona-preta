# Recipes: step by step

Each recipe lists every place that must change. After any recipe: `node scripts/check.mjs`, then look at a
screenshot in **both** modes ([TESTING.md](TESTING.md)).

Remember the two golden rules: text goes through `tr()` with keys in **both** languages, colours are CSS variables.

---

## Change a sentence or fix a translation

1. Find the key (search the text in `index.html`; it is inside `I18N`).
2. Edit the value in `en` and/or `pt`. Keep the `{placeholders}` and tags the same.
3. Run the checker.

## Add a new piece of text to the screen

See the checklist in [I18N.md](I18N.md#adding-a-new-string-checklist).

## Add a camp-log message

1. Add `log.myThing` to `en` and `pt` (use placeholders for numbers and names).
2. Call `log("log.myThing",{n:5})` where it happens. Never pass finished text.

## Add a random event

1. Add `ev.myEvent` (and `ev.myEvent_1` if it has a count that can be 1) to `en` and `pt`.
2. Add a function to the `EVENTS` array in section 9. It receives the camp `k`, changes it and returns `["ev.myEvent",{n}]`,
   or returns nothing if the event does not apply (for example "no hens to lose").
3. Events fire with about a 30% chance per camp per month (`tickCamp`). Nothing else to wire.

## Add a shop item

1. Add to `SHOP` (section 10): `{k:"plow",cost:()=>90,do:k=>k.plows++}`. Use `once:k=>k.plows` if it can be bought only once. `k` is the camp on screen.
2. Add `shop.plow` and, optionally, `shop.plow.note` to both languages.
3. If it is a new thing the camp owns: add the field to `makeCamp()`, show it in the Stores panel in `render()`
   (new `store.plows` key in both languages), and handle saves that lack it (in `start()`, `S.camps.forEach(k=>k.plows=k.plows||0)`).

## Add a crop

A crop touches many places. Use `feijao` as the model and search for it:
1. `CROPS`: `{name,grow,yield,price}`.
2. `makeCamp()`: starting amount in `inv`.
3. `art(p)`: draw it (use `--art-*` variables only).
4. `crop.<id>.gloss` in both languages (English `" (gloss)"`, Portuguese `""`).
5. `SHOP`: a seed item, plus `shop.<id>` key in both languages.
6. `openMarket`: add the id to the list `["feijao","milho","mandioca","ovos"]`.
7. `eat()`: add to the order in `["ovos","mandioca","milho","feijao"]` and to `food` in `tickCamp()`.
8. Old saves: in `start()` do `S.camps.forEach(k=>k.inv.<id>=k.inv.<id>||0)`.

## Add a region

1. `REGIONS`: add the name. 2. `REGION_SITES`: two real places `[lon,lat]` (south and west are negative), at least
1.2 degrees apart and a little inland (camps get ~0.1 degree of jitter; the border and coast must stay outside it).
`REGION_XY`, the region centre, is derived. 3. `NAMES` must contain at least `CAMPS` names (it already has 18).
`genCamps()` can then pick the region for a new game. Check that its sites are more than 62 map units from other regions' sites, or it will rarely be picked. Saves in progress keep their camps.

## Change the number of camps

Edit `CAMPS` (section 4). `genCamps()` needs that many regions that are far enough apart (62 map units), and the map and tabs show as many as there are. Four is the most that fits comfortably with 8 regions. Update the numbers in `README.md` and [ARCHITECTURE.md](ARCHITECTURE.md).

## Change a game balance number

Use the table "Game rules and where the numbers live" in [ARCHITECTURE.md](ARCHITECTURE.md). If the number also
appears in a translated sentence (for example "R$30 · +6" in `case.lawyerCost`, "+6" in `ev.press`, "50%" in `ev.fair`,
"6 months" in `log.discovered`), update **both languages**.

## Add a new modal

```js
function openThing(){show(()=>`${themeBtn()}<h2>${tr("thing.title")}</h2><p>${tr("thing.text",{n:S.money})}</p>
  <div class="bar"><button class="btn go" data-close="1">${tr("market.back")}</button></div>`)}
```
- Pass a **function** to `show`. Build all HTML inside it from current state.
- Start with `${themeBtn()}` so the player can switch mode inside the modal.
- Buttons are handled in the `md.addEventListener("click",...)` block in section 10 through `data-*` attributes.
  `data-close="1"` closes. Add your own `data-thing` and an `if(d.thing){...}` line.
- Open it from a main-screen button: add `case "thing": openThing();return;` in the `switch` in section 8 and a
  `<button class="btn" data-a="thing">` in `render()`.

## Add a main-screen panel

Edit the template in `render()` (section 6). Wrap it in `<div class="panel">`. Use `.label` for small caps headings,
`.calm` for secondary text, `.facts`, `.inv`, `.row`, `.bar` and `.btn` as in neighbouring panels. Texts via `tr()`.

## Change a colour or add a CSS variable

See [THEMES.md](THEMES.md). Short version: define it in `:root` **and** in the bandeira block.

## Add a third theme (only if the owner asks)

The two-mode pairing (dark/English, light/Portuguese) is a deliberate design. If a new theme is requested:
1. Add it to `THEMES` (`lang`, `html`, `meta`) in section 1 and to the toggle logic (`toggleTheme` currently flips between two).
2. Add a `:root[data-theme="..."]` block overriding every non-constant variable.
3. Extend `scripts/check.mjs` (it currently looks for the `bandeira` block by name).
4. If it needs a new language, add a third object next to `en` and `pt` and extend the checker's comparison.

## Fix "it looks wrong in Modo Bandeira"

Almost always a hard-coded or wrongly chosen colour. Search the CSS and the script strings for `#`, `rgb` and `--corn`.
Replace with the right variable (`--accent` for selection and emphasis, `--chalk` for text). Re-screenshot.

## Fix "the text is still English in Modo Bandeira"

Search for the English sentence. If it is inside backticks in the script and not inside `I18N`, it is inline text:
move it into `I18N` and use `tr()`. If it is inside `I18N`, check the `pt` value is not a copy of the English.
