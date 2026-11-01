# Testing

There is no test framework. Two scripts cover what matters. Both need only Node 18+ (and Google Chrome for screenshots).

## 1. Static checks (always run first)

```
node scripts/check.mjs
```

Prints `OK ...` or a list of `ERROR` lines and exits with code 1. It checks:

- the game script has valid JavaScript syntax;
- the `en` and `pt` dictionaries have the same keys, the same `{placeholders}` and the same `<b>`/`<em>` tags;
- every key used in the code exists, so typos like `tr("map.titel")` are caught;
- every CSS variable defined for night is also defined for bandeira (or is on the constant list), and every `var(--x)` is defined.

`warn` lines (for example an unused key) do not fail the run, but look at them.

## 2. Screenshots (always look at the result)

```
node scripts/shot.mjs <night|bandeira> <out.png> [driver.js] [width] [height]
```

Examples:

```
node scripts/shot.mjs night      /tmp/n.png                                   # first screen: "Where do we pitch the tarps?"
node scripts/shot.mjs bandeira   /tmp/b.png scripts/drivers/play.js           # main screen after some clicks
node scripts/shot.mjs bandeira   /tmp/m.png scripts/drivers/move.js 800 1500  # the "move the camp" modal, tall window
node scripts/shot.mjs night      /tmp/p.png scripts/drivers/play.js 390 1700  # phone width (shown in an iframe, see below)
```

Widths under 500: headless Chrome refuses windows narrower than ~500 px, so `shot.mjs` renders the game inside an iframe of the requested width. The result is
a 500 px wide image with the phone layout on the left and a grey margin. Use a tall height (for example 1700) to see the whole page.

Then open the PNG (an AI assistant can read it with its image tool). `?theme=night|bandeira` in the URL forces a mode;
the script uses a fresh browser profile so no saved game interferes. Set `CHROME=/path/to/chrome` if Chrome is not in the macOS default location.

Ready-made drivers in `scripts/drivers/`:

| Driver | Result |
|---|---|
| `play.js` | occupies an estate, clears and plants some plots, selects the cheapest estate on the map |
| `move.js` | same, then opens the "Move the camp" modal |
| `market.js` | opens the feira on the Buy tab |
| `court.js` | forces a court case and some log entries |
| `end.js` | shows the "settlement won" screen |

### Writing a driver

A driver is a plain script appended to a **temporary copy** of `index.html` (your file is untouched). It runs in the page, so it can use the
game's globals (`S`, `render`, `tr`, `moveCost`, `openMarket`, ...). Click helper:

```js
const fire=el=>el&&!el.disabled&&el.dispatchEvent(new MouseEvent("click",{bubbles:true})); // NOT el.click(): SVG has no click()
const q=s=>document.querySelector(s);
fire(q('[data-land="0"]')); fire(q('[data-settle]'));          // choose the first estate on the map, occupy it
fire(q('[data-p="0"]')); fire(q('[data-a="clear"]'));          // select plot 0, clear it
```

Useful selectors: `[data-land="i"]` estate marker, `[data-settle]` occupy, `[data-p="i"]` plot, `[data-a="clear|plant|harvest|market|move|next|lawyer|laudo|mob"]`,
`[data-theme-toggle]` mode button, `[data-go]` pack up and go, `[data-tab="buy"]`. To set up a situation quickly, change `S` directly and call `render()`
(see `court.js`).

### Reading values instead of pixels

Write results into the page title and dump the DOM:

```js
document.title = "money="+S.money+" estates="+S.estates.length;
```
```
chrome --headless=new --disable-gpu --user-data-dir=/tmp/prof --virtual-time-budget=3000 --dump-dom file:///path/to/copy.html | grep -o "<title>[^<]*</title>"
```

## 3. Manual checklist (before you say "done")

Run through in **both** modes (use the button at the top right, or `?theme=`):

- [ ] First screen: map visible, 16 markers, selecting one shows its card, "Occupy" enables.
- [ ] Main screen: plots, status chips, map, stores, log, "How to play" all readable.
- [ ] Select an estate on the map: card shows distance and cost, "Move camp here" shows `R$` cost; far ones are faded when you cannot afford them.
- [ ] Open the feira (sell and buy tabs), open "Move camp", open an end screen.
- [ ] Switch mode **with a modal open**: it must re-translate in place.
- [ ] Switch mode on the main screen: the log entries re-translate too.
- [ ] No English in Modo Bandeira; no Portuguese UI sentences in Night (place and crop names excepted).
- [ ] Phone width (390 px): no horizontal scroll, buttons reachable.

## 4. Old saves

Saves from earlier versions must still load. `start()` upgrades them (adds `history`, `estates`). Log entries in the old format
(`{m,when}` strings) still display. If you change the shape of `S`, add an upgrade line in `start()` and test by loading an
old shape (for example set `S.estates=undefined` before calling `start`).

## 5. Deploy

Pushing to `main` publishes https://ribeirojr.github.io/lona-preta/ through GitHub Pages in about a minute:

```
git push
gh api repos/ribeirojr/lona-preta/pages/builds/latest --jq '{status,commit}'   # "built" when done
```
