# Themes and colours

Two themes, switched by `document.documentElement.dataset.theme`:

| Theme | Selector | Look |
|---|---|---|
| **Night** (default) | `:root` | black tarp: near-black surfaces, warm off-white text, clay red, corn yellow, leaf green |
| **Modo Bandeira** | `:root[data-theme="bandeira"]` | light: off-white surfaces, deep navy text, flag green `#009b3a`, flag yellow `#fedd00`, flag blue `#002776`, and a green/yellow/blue stripe across the top |

All colours are CSS variables defined at the top of the `<style>` block. Nothing else may contain a colour.

## The variables

| Variable | Night | Bandeira | Use it for |
|---|---|---|---|
| `--tarp` | `#131415` | `#f3f6ea` | page background |
| `--tarp-2` | `#1c1e1f` | `#ffffff` | panels, modal, chips |
| `--tarp-3` | `#26292a` | `#e7efd9` | buttons, tracks, map land |
| `--line` | `#363a3b` | `#c3d1ae` | borders |
| `--chalk` | `#efe7d3` | `#0d2240` | main text |
| `--dim` | `#a69d89` | `#4a5a6b` | secondary text |
| `--clay` | `#c24a2f` | `#c8452a` | idle land, danger, owner's case, evicted |
| `--leaf` | `#77a94b` | `#08873a` | productive land, your defense, "quiet" |
| `--corn` | `#e9b62c` | `#fedd00` | flag yellow: harvest button, ready badge. **Not for text or outlines** |
| `--accent` | `#e9b62c` | `#002776` | selection rings, focus outline, route line, cost numbers |
| `--go` | `#c24a2f` | `#002776` | primary button background (white text) |
| `--brand` | `#c24a2f` | `#009b3a` | the word "Preta" in the title |
| `--scrim` | dark 78% | navy 55% | modal backdrop |
| `--pattern` | faint white | faint blue | the diagonal tarp lines on the page |

**Constant in both themes** (defined only in `:root`): `--soil`, `--soil-2`, `--soil-line`, `--art-leaf`,
`--art-leaf-dim`, `--art-corn`, `--on-dark`, `--display`, `--body`. The plots are always drawn on brown earth,
so their art, and the text that sits on them, never changes.

## Rules

1. **Never write a colour literal** in CSS rules, `style="..."` or SVG strings. Use `var(--name)`.
   Exceptions already in the code: the plot art's few earth-tone details, `#fff` on `.btn.go`, and `THEMES[...].meta`.
2. **A new variable goes in both blocks.** Define it in `:root` and in the bandeira block. The only way to
   skip the second is to add it to the `constant` pattern in `scripts/check.mjs` (and to the list above) because
   it is genuinely the same in both themes.
3. **Check contrast in both themes.** Yellow (`--corn`) is fine as a button background with dark text but invisible
   as text or a thin line on the light theme: that is why `--accent` exists. Use `--accent` for anything the player
   must notice (selection, focus, route, cost).
4. **Primary buttons use `--go`** with white text. Secondary buttons use `--tarp-3`.
5. **Use semantic variables.** Ask "what does this mean?" (danger, productive, selected) not "what colour is it?".

## How to add or tweak a colour

1. Edit the value in the right block (`:root` for night, the bandeira block for light).
2. `node scripts/check.mjs` (confirms both blocks stay in sync).
3. `node scripts/shot.mjs night a.png` and `node scripts/shot.mjs bandeira b.png`, open both PNGs.
   Use a driver such as `scripts/drivers/play.js` to see the map, buttons and selection states.

## How the flag stripe works

`:root[data-theme="bandeira"] body::before` is a fixed 6 px bar with a three-stop gradient (`z-index:40`, above the modal).
It exists only in the bandeira theme. Its colours are the three flag colours and are the one place literals are used.

## Meta theme colour

`<meta name="theme-color">` is updated by `applyTheme()` from `THEMES[name].meta` so the mobile browser bar matches.
If you change `--tarp` for a theme, change its `meta` value in `THEMES` too.
