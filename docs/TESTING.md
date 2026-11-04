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
node scripts/shot.mjs night      /tmp/n.png                                   # first screen: four fresh camps
node scripts/shot.mjs bandeira   /tmp/b.png scripts/drivers/play.js           # main screen after some clicks
node scripts/shot.mjs bandeira   /tmp/m.png scripts/drivers/lost.js 800 1500  # a settlement, two lost camps, tall window
node scripts/shot.mjs night      /tmp/p.png scripts/drivers/play.js 390 1700  # phone width (shown in an iframe, see below)
```

Widths under 500: headless Chrome refuses windows narrower than ~500 px, so `shot.mjs` renders the game inside an iframe of the requested width. The result is
a 500 px wide image with the phone layout on the left and a grey margin. Use a tall height (for example 1700) to see the whole page.

Then open the PNG (an AI assistant can read it with its image tool). `?theme=night|bandeira` in the URL forces a mode;
the script uses a fresh browser profile so no saved game interferes. Set `CHROME=/path/to/chrome` if Chrome is not in the macOS default location.

Ready-made drivers in `scripts/drivers/`:

| Driver | Result |
|---|---|
| `play.js` | works two camps (clears, plants), forces a hearing in a third, shows camp 1 |
| `market.js` | opens the feira on the Buy tab |
| `court.js` | forces a court case in camp 0 and some log entries |
| `lost.js` | camp 0 is a settlement, camps 1 and 2 are lost (evicted, starved), camp 3 has a hearing coming. Shows a lost camp |
| `end.js` | shows the final screen (2 settlements, 2 lost) |
| `notice.js` | two camps get news in the same month: the notices queue up |

### Writing a driver

A driver is a plain script appended to a **temporary copy** of `index.html` (your file is untouched). It runs in the page, so it can use the
game's globals (`S`, `K()`, `render`, `tr`, `openMarket`, `endMonth`, ...). Click helper:

```js
const fire=el=>el&&!el.disabled&&el.dispatchEvent(new MouseEvent("click",{bubbles:true})); // NOT el.click(): SVG has no click()
const q=s=>document.querySelector(s);
fire(q('[data-camp="1"]'));                                   // go to the second camp (tab or map marker)
fire(q('[data-p="0"]')); fire(q('[data-a="clear"]'));          // select plot 0 of that camp, clear it
```

Useful selectors: `[data-camp="i"]` camp tab or map marker, `[data-p="i"]` plot, `[data-a="clear|plant|harvest|market|next|lawyer|laudo|mob"]`,
`[data-theme-toggle]` mode button, `[data-tab="buy"]`, `#okb` the OK button of a notice, `[data-restart]`. To set up a situation quickly, change `S` directly and call `render()`
(see `court.js`).

### Reading values instead of pixels

Write results into the page title and dump the DOM:

```js
document.title = "money="+K().money+" camps="+S.camps.length;
```
```
chrome --headless=new --disable-gpu --user-data-dir=/tmp/prof --virtual-time-budget=3000 --dump-dom file:///path/to/copy.html | grep -o "<title>[^<]*</title>"
```

## 3. Manual checklist (before you say "done")

Run through in **both** modes (use the button at the top right, or `?theme=`):

- [ ] First screen: four camp tabs, four markers on the map with readable names, the camp on screen has a ring.
- [ ] Main screen: plots, status chips, map, stores, log, "How to play" all readable.
- [ ] Tap a tab and a map marker: the main screen switches camp. Money, stores and plots are per camp.
- [ ] Open the feira (sell and buy tabs). Look at a won camp (banner, read-only plots), a lost camp (banner only) and the end screen.
- [ ] "Next month" with news in two camps: the notices appear one after the other.
- [ ] Switch mode **with a modal open**: it must re-translate in place.
- [ ] Switch mode on the main screen: the log entries re-translate too.
- [ ] No English in Modo Bandeira; no Portuguese UI sentences in Night (place and crop names excepted).
- [ ] Phone width (390 px): no horizontal scroll, buttons reachable.

## 4. Old saves

Saves from earlier versions must still load. `start()` upgrades them (`upgradeOld()` turns a one-camp save into camp 0 and adds three new camps). Log entries in the old format
(`{m,when}` strings) still display. If you change the shape of `S`, add an upgrade line in `start()` and test by loading an
old shape (put it in `localStorage["lonapreta"]` and call `start({})`).

## 5. Deploy

Pushing to `main` publishes https://ribeirojr.github.io/lona-preta/ through GitHub Pages in about a minute:

```
git push
gh api repos/ribeirojr/lona-preta/pages/builds/latest --jq '{status,commit}'   # "built" when done
```
