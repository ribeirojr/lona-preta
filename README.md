# Lona Preta

**Occupy idle land. Make it produce. Defend it in court. If the judge orders you off, pack what you can carry.**

Lona Preta is a small turn-based browser game inspired by the land occupations of Brazil's *Movimento dos Trabalhadores Rurais Sem Terra* (MST). The name means "black tarp", the plastic sheeting that covers the shacks in MST camps along Brazilian roadsides.

You lead a camp of landless families. You start with three families, five hens and sacks of seed. You occupy an estate that has sat unused for years, clear the scrub, plant crops and raise chickens. Sooner or later the owner finds out and sues to get the land back. You fund the defense and keep the land producing. Then you wait for the judge.

It is a single HTML file with no build step and no dependencies.

## Play

Open `index.html` in any modern browser, on desktop or phone. Progress is saved automatically in your browser's local storage.

To host it with GitHub Pages, go to **Settings → Pages**, choose **Deploy from a branch**, and select `main` with the root folder. The game will be live at `https://<your-user>.github.io/lona-preta/`.

## How it plays

Each turn is one month, starting in October at the beginning of the rainy season.

### 1. Choose an estate

You pick from three randomly generated *fazendas*. Each one shows:

| Attribute | Why it matters |
|---|---|
| Years unused | Long-idle land is easier to defend as failing its social function |
| Soil | Multiplies every harvest |
| Owner | Heirs in a dispute are weak in court. Agribusiness groups hire strong lawyers |
| Watchfulness | How quickly the owner notices you farming |
| Size | 9, 12 or 16 plots |
| Distance | How far the trucks travel when you move there |

### 2. Farm

Families give you labor every month (2 each, plus 1 per hoe). Clearing scrub, planting and harvesting each cost 1 labor. Planting costs 2 units from your seed stock, and harvests refill it.

| Crop | Months to harvest | Base yield | Notes |
|---|---|---|---|
| Feijão (beans) | 2 | 8 | Fast, sells best |
| Milho (corn) | 3 | 12 | Also feeds the hens |
| Mandioca (cassava) | 5 | 22 | Slow, but the biggest harvest |

Crops planted in the rainy season (Oct–Mar) give a full harvest. Dry-season planting gives half, unless you have dug a well on that land.

### 3. Keep everyone fed

Each family eats 2 food a month: eggs, goat milk or any crop. If there isn't enough, a family leaves. If every family leaves, the camp ends.

Hens lay 3 eggs a month when fed corn (1 corn per 3 hens) and 1 when they forage. They also hatch chicks that grow into hens. A camp with plenty of food attracts new families, up to eight.

### 4. Trade at the feira

Sell harvests and eggs at prices that shift every month. Buy:

- **Seed** for any crop
- **Laying hens**
- **Dairy goats**, which give food every month and walk with you when you move
- **Hoes**, for +1 labor every month
- **Ox carts**, for +60 carrying capacity
- **A well**, which gives full dry-season yields but stays behind if you leave

### 5. Defend the land

Every planted plot raises the chance that the owner notices. When that happens, the owner files an *ação de reintegração de posse* (repossession suit), and the hearing is set for six months later.

Two bars track the case: **your defense** and **the owner's case**. The owner's case grows every month. Your defense grows automatically with every planted plot and every family, which reflects the argument that you are giving the land a social function. You can add to it:

| Action | Cost | Effect |
|---|---|---|
| Pay popular lawyers | R$30, once a month | +6 |
| Request an INCRA inspection | R$60, once per case | +2 per year the land sat unused |
| Public mobilization | 3 labor, once a month | +5 |

At the hearing, if your defense is at least as strong as the owner's case, the court orders the estate expropriated for agrarian reform and the land becomes your settlement. **You win.**

### 6. Or move on

If you lose, you are evicted. You can also leave voluntarily at any time, which drops any case on the current land.

Moving means choosing a new estate and packing the trucks. Each family carries 15 units and each ox cart carries 60. Grain, eggs, hens and chicks weigh 1 each, and hoes weigh 2. Goats walk alongside and money weighs nothing. Crops still in the ground, wells and anything over the limit stay behind. The journey takes a month, and the families eat on the road.

### The map

A map of Brazil shows where the estates are and what state the land is in. Each estate sits in its region (Pontal do Paranapanema, Sul do Pará, Campanha Gaúcha and so on). It is a stylized outline, with positions that are approximate and illustrative, not survey data.

- When you choose or move to an estate, the three offers appear as numbered idle-land markers. Click a marker or a card to select it.
- Your camp's marker is red where the land is idle and fills green as plots go into production, so the effect of your farming is visible. A won settlement is fully green with a gold ring.
- Estates you left behind, or were evicted from, stay on the map as a ✕.

### Random events

About one month in three brings an event: a fox in the henhouse, good rain or a dry spell, a donation from the rural workers' union, an agrarian reform fair that raises prices, press coverage that helps your case, a seed exchange with a nearby settlement, a new family joining, or a university extension team improving your soil.

## Background

Article 184 of the 1988 Brazilian Constitution allows the federal government to expropriate rural property that does not fulfil its *função social* (social function) for agrarian reform, with compensation to the owner. Article 186 defines that function: rational and adequate use, environmental preservation, compliance with labor law, and use that benefits both owners and workers. INCRA, the national institute for colonization and agrarian reform, inspects land and runs the settlements (*assentamentos*).

The MST, founded in 1984, organizes landless rural workers to occupy estates it considers unproductive. The aim is to pressure the state into expropriating them. Occupations are legally and politically contested in Brazil. Landowners and many legal scholars treat them as invasions of private property, and courts frequently order evictions. The movement and its supporters see occupation as the way to make the constitutional promise of agrarian reform happen.

The game is a simplification. Real cases take years, involve many more actors, and have at times turned violent. The game's mechanics follow the movement's own framing of the struggle, and it does not try to settle the political debate.

## Project layout

```
index.html   the whole game: markup, styles and script
README.md    this file
```

No frameworks, no bundler. The only external resources are two Google Fonts (Alfa Slab One and Archivo), with system fallbacks if they fail to load.

## Ideas for later

- A Portuguese translation, with a language toggle
- Larger animals (cattle) and processed goods like *farinha de mandioca*
- Appeals after a lost hearing
- Settling a won estate and sending some families onward to a new camp
