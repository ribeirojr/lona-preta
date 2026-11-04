# Lona Preta

**Run several occupations at once. Make each one produce. Defend each in court. Turn every camp into a settlement, or lose it for good.**

Lona Preta is a small turn-based browser game inspired by the land occupations of Brazil's *Movimento dos Trabalhadores Rurais Sem Terra* (MST). The name means "black tarp", the plastic sheeting that covers the shacks in MST camps along Brazilian roadsides.

You lead a movement of landless families. You start with **four camps in four different regions**, each with two families, three hens and sacks of seed, each on an estate that has sat unused for years. You switch between the camps, clear scrub, plant crops and raise chickens in each. Sooner or later each owner finds out and sues to get the land back. You fund every defense and keep every camp producing. Then you wait for the judges. Each camp ends on its own: it becomes a **settlement**, or it is **lost for good**. The aim is to turn all of them into settlements.

It is a single HTML file with no build step and no dependencies.

## Two modes, two languages

The button at the top right switches between two modes. Each one has its own language:

| Mode | Look | Language |
|---|---|---|
| **Night** (default) | dark, like a black tarp | English |
| **Modo Bandeira** | light, with the green, yellow and blue of the Brazilian flag | Português do Brasil |

Your choice is remembered. On a first visit, a device set to a light theme opens in Modo Bandeira.
You can also force one with `?theme=night` or `?theme=bandeira` in the URL. Switching mid-game re-translates the screen,
the open window and the camp log.

## Play

Open `index.html` in any modern browser, on desktop or phone. Progress is saved automatically in your browser's local storage.

To host it with GitHub Pages, go to **Settings → Pages**, choose **Deploy from a branch**, and select `main` with the root folder. The game will be live at `https://<your-user>.github.io/lona-preta/`.

## How it plays

Each turn is one month, starting in October at the beginning of the rainy season.

### 1. Four camps, one movement

The game starts with four camps, picked at random in four different regions and spaced out on the map. Switch between them with the tabs under the title or by tapping a marker on the map. Each tab shows the camp's state (quiet, hearing in N months, settlement, lost) so a hearing in another camp is never out of sight.

**Nothing is shared between camps.** Each one has its own families, labor, money, stores, animals, wells and court case. Seed, eggs and cash do not move from one to another. "Next month" moves every camp forward at once, and the game ends when no camp is still fighting.

Each estate has:

| Attribute | Why it matters |
|---|---|
| Years unused | Long-idle land is easier to defend as failing its social function |
| Soil | Multiplies every harvest |
| Owner | Heirs in a dispute are weak in court. Agribusiness groups hire strong lawyers |
| Watchfulness | How quickly the owner notices you farming |
| Size | 9, 12 or 16 plots |

### 2. Farm

Families give you labor every month (2 each, plus 1 per hoe). Clearing scrub, planting and harvesting each cost 1 labor. Planting costs 2 units from your seed stock, and harvests refill it.

| Crop | Months to harvest | Base yield | Notes |
|---|---|---|---|
| Feijão (beans) | 2 | 8 | Fast, sells best |
| Milho (corn) | 3 | 12 | Also feeds the hens |
| Mandioca (cassava) | 5 | 22 | Slow, but the biggest harvest |

Crops planted in the rainy season (Oct–Mar) give a full harvest. Dry-season planting gives half, unless you have dug a well on that land.

### 3. Keep everyone fed

Each family eats 2 food a month: eggs, goat milk or any crop. If there isn't enough, a family leaves. If every family leaves a camp, that camp is lost for good.

Hens lay 3 eggs a month when fed corn (1 corn per 3 hens) and 1 when they forage. They also hatch chicks that grow into hens. A camp with plenty of food attracts new families, up to eight.

### 4. Trade at the feira

Sell harvests and eggs at prices that shift every month (the same prices for every camp). Whatever you buy or sell goes to the camp on screen. Buy:

- **Seed** for any crop
- **Laying hens**
- **Dairy goats**, which give food every month
- **Hoes**, for +1 labor every month
- **A well**, which gives full dry-season yields on that land

### 5. Defend the land

Every planted plot raises the chance that the owner notices. When that happens, the owner files an *ação de reintegração de posse* (repossession suit), and the hearing is set for six months later.

Two bars track the case: **your defense** and **the owner's case**. The owner's case grows every month. Your defense grows automatically with every planted plot and every family, which reflects the argument that you are giving the land a social function. You can add to it:

| Action | Cost | Effect |
|---|---|---|
| Pay popular lawyers | R$30, once a month | +6 |
| Request an INCRA inspection | R$60, once per case | +2 per year the land sat unused |
| Public mobilization | 3 labor, once a month | +5 |

At the hearing, if your defense is at least as strong as the owner's case, the court orders the estate expropriated for agrarian reform and that camp becomes a **settlement**. It is secured for good and stops needing you.

### 6. Lost for good

If the defense falls short at the hearing, the families are driven off the land. The camp is **lost for good**: it is marked with a ✕ on the map and cannot be reclaimed. A camp is also lost if hunger drives off its last family. The other camps carry on.

When every camp is a settlement or lost, the game ends. The final screen tells you how many of the four became settlements.

### The map

A map of Brazil (real border data) shows all your camps. Each camp sits near a real municipality of its region, such as Rosana or Bagé, though the estates themselves are fictional.

- Each camp is a marker with its name. It is red where the land is idle and fills green as plots go into production, so the effect of your farming is visible. A gold ring means the camp is a settlement, and a ✕ means it is lost.
- The camp on screen has a highlighted ring. Tap any marker to go to that camp.

### Random events

About one month in three brings an event in each camp: a fox in the henhouse, good rain or a dry spell, a donation from the rural workers' union, (once in a while, for everyone) an agrarian reform fair that raises prices, press coverage that helps your case, a seed exchange with a nearby settlement, a new family joining, or a university extension team improving your soil.

## Background

Article 184 of the 1988 Brazilian Constitution allows the federal government to expropriate rural property that does not fulfil its *função social* (social function) for agrarian reform, with compensation to the owner. Article 186 defines that function: rational and adequate use, environmental preservation, compliance with labor law, and use that benefits both owners and workers. INCRA, the national institute for colonization and agrarian reform, inspects land and runs the settlements (*assentamentos*).

The MST, founded in 1984, organizes landless rural workers to occupy estates it considers unproductive. The aim is to pressure the state into expropriating them. Occupations are legally and politically contested in Brazil. Landowners and many legal scholars treat them as invasions of private property, and courts frequently order evictions. The movement and its supporters see occupation as the way to make the constitutional promise of agrarian reform happen.

The game is a simplification. Real cases take years, involve many more actors, and have at times turned violent. The game's mechanics follow the movement's own framing of the struggle, and it does not try to settle the political debate.

## Project layout

```
index.html          the whole game: markup, styles and script
README.md           this file
CLAUDE.md           rules for AI coding assistants (start here if you are one)
docs/               architecture, translations, themes, recipes, testing
scripts/check.mjs   static checks: syntax, translations, theme variables
scripts/shot.mjs    headless-Chrome screenshots, with optional scripted clicks
```

No frameworks, no bundler. The only external resources are two Google Fonts (Alfa Slab One and Archivo), with system fallbacks if they fail to load.

## Contributing

Read [CLAUDE.md](CLAUDE.md) and the guides in [docs/](docs/). In short: all text goes through the translation
dictionary in both languages, all colours are CSS variables that both themes define, and `node scripts/check.mjs`
must pass before you commit.

## Ideas for later

- Larger animals (cattle) and processed goods like *farinha de mandioca*
- Appeals after a lost hearing
- Solidarity between camps: sending families, seed or money from one to another, or from a won settlement to those still fighting
- Founding new occupations from the map
