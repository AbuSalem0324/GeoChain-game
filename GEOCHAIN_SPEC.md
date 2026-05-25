# GeoChain — Full Product Specification

## Overview

GeoChain is a geography chain game. A mystery country (or US state) outline appears with no label. The player must identify it by naming one of its neighbours. Each correct neighbour is added to the map, expanding the chain. The goal varies by game mode and winning condition.

This document is the full spec for a ground-up rebuild. The current version is a single HTML file (~170KB) that serves as the proof of concept. The new version should be a modern full-stack web app, ideally with a 3D globe rendering, deployed on Vercel.

---

## Game Modes

### 1. World Countries
- 189 playable countries rendered from Natural Earth 50m TopoJSON
- Equirectangular or globe projection
- Player chains countries via land borders (and a small number of defined sea/proximity links)
- Special geometry injections: Kosovo, Kaliningrad (Russian exclave), Greenland, Crimea (shown as Ukraine)

### 2. US States
- 51 entries: 50 states + District of Columbia
- Rendered from us-atlas 10m TopoJSON
- Amber/orange colour theme vs teal for world mode
- Canada and Mexico are enterable as neighbours for Columbia and Rio Grande rivers respectively
- Incompatible with World Domination and Continental Domination winning conditions

### 3. Source to Sea *(new game mode)*
- Player follows a river from source country to sea/mouth
- A specific river is shown at the top of the map (e.g. "🌊 NILE")
- Player must place every country/state the river flows through
- Normal adjacency applies — player can chain through non-river countries as stepping stones, but only river countries count toward progress and only river countries are accepted as answers
- Wrong answer (country not on the river) = error
- A dashed river line is overlaid on the map showing the river's course
- Line toggle available (show/hide river overlay)
- Progress counter shows X/Y river countries placed
- **River selection**: Random or player-chosen from a list
- **River line toggle** in top-right of map, only visible during Source to Sea

---

## Core Mechanics

### Chain Logic
- A random starter country/state is placed (outlined, filled, no label)
- Player types a country name and presses Enter or clicks Go
- If the typed country is a neighbour of ANY already-placed country → valid, placed, chain grows
- If not a neighbour → error counted, red toast
- Autocomplete with ghost text (Tab or → to accept)
- Name normalisation: strips diacritics, handles aliases (Holland → Netherlands, Czechia → Czech Republic, etc.)
- Aliases include historical names (Persia, Siam, Burma, Rhodesia, Abyssinia, Formosa, etc.)

### Unplayable Countries
The following are recognised but rejected with a "not in this game" toast (no error counted):
- Gibraltar, Vatican City, Antigua and Barbuda, Bahamas, Kiribati, Nauru, Tuvalu, Faroe Islands

### Adjacency Rules
- Standard land borders apply
- Island nations linked to nearest mainland: Japan ↔ South Korea + China, Sri Lanka ↔ India, Cuba ↔ United States + Mexico, Iceland ↔ UK + Norway + Greenland, Cyprus ↔ Turkey (geographically Asia but game-assigned to Europe), Malta ↔ Italy, Taiwan ↔ China, etc.
- UK borders: Ireland, Iceland, Norway, Belgium, France, Netherlands (Channel Tunnel + proximity links)
- Morocco borders Spain (Ceuta/Melilla)
- Transcontinental countries in both continents for Continental Domination: Russia (Europe + Asia), Turkey (Europe + Asia)
- Bering Strait (Russia ↔ USA): **only active in World Domination mode**

### Special Geography
- **Kosovo**: hardcoded polygon injected from Natural Earth undefined-ID feature. Borders Albania, North Macedonia, Montenegro, Serbia.
- **Kaliningrad**: Russian exclave polygon injected. Borders Poland and Lithuania.
- **Crimea**: Shown as part of Ukraine (overrides Natural Earth which assigns it to Russia).
- **Greenland**: Injected from NE ISO 304. Borders Canada and Iceland.
- **French Guiana**: Independent country bordering Brazil and Suriname, not linked to France.
- **Western Sahara**: Borders Morocco, Algeria, Mauritania.

---

## Winning Conditions

Selected before game starts from a panel. Only one active at a time.

### Default
Endless play — no finish line, no error cap. Score = countries placed.

### Error Limit
Player sets a number (e.g. 3). When errors reach the limit, game ends. Score = countries placed, record = fewest errors per limit setting.

### Continental Domination
Place every country on the starter's continent to win. Errors are unlimited.
- Continents: Europe (46), Asia (49), Africa (55), North America (16), South America (13), Oceania (11)
- Russia and Turkey count for **both** Europe and Asia — if starter is Russia or Turkey, player chooses which continent to dominate
- Not available in US States mode

### World Domination
Place every playable country on Earth. Bering Strait (Russia ↔ USA) is exclusively active. Errors unlimited.
- Not available in US States mode

### Time Limit
Player sets a time (minutes:seconds). Countdown begins on first guess (right or wrong). Game ends when time runs out. Score = countries placed.

---

## Continent Membership

### Europe (46)
Albania, Andorra, Austria, Belarus, Belgium, Bosnia and Herzegovina, Bulgaria, Croatia, Czech Republic, Cyprus, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland, Ireland, Italy, Kosovo, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, Moldova, Monaco, Montenegro, Netherlands, North Macedonia, Norway, Poland, Portugal, Romania, Russia*, San Marino, Serbia, Slovakia, Slovenia, Spain, Sweden, Switzerland, Turkey*, Ukraine, United Kingdom

*Also in Asia

### Asia (49)
Afghanistan, Armenia, Azerbaijan, Bahrain, Bangladesh, Bhutan, Brunei, Cambodia, China, Georgia, India, Indonesia, Iran, Iraq, Israel, Japan, Jordan, Kazakhstan, Kuwait, Kyrgyzstan, Laos, Lebanon, Malaysia, Maldives, Mongolia, Myanmar, Nepal, North Korea, Oman, Pakistan, Palestine, Philippines, Qatar, Russia*, Saudi Arabia, Singapore, South Korea, Sri Lanka, Syria, Taiwan, Tajikistan, Thailand, Timor-Leste, Turkey*, Turkmenistan, United Arab Emirates, Uzbekistan, Vietnam, Yemen

### Africa (55)
Algeria, Angola, Benin, Botswana, Burkina Faso, Burundi, Cameroon, Cape Verde, Central African Republic, Chad, Comoros, Côte d'Ivoire, Democratic Republic of the Congo, Djibouti, Egypt, Equatorial Guinea, Eritrea, Eswatini, Ethiopia, Gabon, Gambia, Ghana, Guinea, Guinea-Bissau, Kenya, Lesotho, Liberia, Libya, Madagascar, Malawi, Mali, Mauritania, Mauritius, Morocco, Mozambique, Namibia, Niger, Nigeria, Republic of the Congo, Rwanda, São Tomé and Príncipe, Senegal, Seychelles, Sierra Leone, Somalia, South Africa, South Sudan, Sudan, Tanzania, Togo, Tunisia, Uganda, Western Sahara, Zambia, Zimbabwe

### North America (16)
Belize, Canada, Costa Rica, Cuba, Dominican Republic, El Salvador, Greenland, Guatemala, Haiti, Honduras, Jamaica, Mexico, Nicaragua, Panama, Trinidad and Tobago, United States

### South America (13)
Argentina, Bolivia, Brazil, Chile, Colombia, Ecuador, French Guiana, Guyana, Paraguay, Peru, Suriname, Uruguay, Venezuela

### Oceania (11)
Australia, Fiji, Marshall Islands, Micronesia, New Zealand, Palau, Papua New Guinea, Samoa, Solomon Islands, Tonga, Vanuatu

---

## Source to Sea — River Data

### World Rivers

| River | Countries Required | Source Starter | Mouth Starter |
|-------|-------------------|----------------|---------------|
| Nile | Ethiopia, Uganda, South Sudan, Sudan, Egypt | Ethiopia | Egypt |
| Congo | DRC, Republic of Congo, CAR, Zambia, Angola, Cameroon | Zambia | DRC |
| Niger | Guinea, Mali, Niger, Benin, Nigeria | Guinea | Nigeria |
| Zambezi | Zambia, Angola, Namibia, Botswana, Zimbabwe, Mozambique | Zambia | Mozambique |
| Amazon | Peru, Colombia, Brazil | Peru | Brazil |
| Danube | Germany, Austria, Slovakia, Hungary, Croatia, Serbia, Romania, Bulgaria, Moldova, Ukraine | Germany | Romania / Ukraine |
| Rhine | Switzerland, Liechtenstein, Austria, Germany, France, Netherlands | Switzerland | Netherlands |
| Dnieper | Russia, Belarus, Ukraine | Russia | Ukraine |
| Mekong | China, Myanmar, Laos, Thailand, Cambodia, Vietnam | China | Vietnam |
| Euphrates | Turkey, Syria, Iraq | Turkey | Iraq |

The Nile has a secondary branch (White Nile) rendered as an additional line from Lake Victoria (Uganda) to Khartoum.

### US State Rivers

| River | States Required | Source | Mouth | Notes |
|-------|----------------|--------|-------|-------|
| Mississippi | MN, WI, IA, IL, MO, KY, TN, AR, MS, LA | Minnesota | Louisiana | |
| Missouri | MT, ND, SD, NE, IA, KS, MO | Montana | Missouri | |
| Colorado | CO, UT, AZ, NV, CA | Colorado | California | |
| Tennessee | VA, NC, TN, GA, AL, MS, KY | Virginia | Kentucky | |
| Ohio | PA, WV, OH, IN, KY, IL | Pennsylvania | Illinois | |
| Arkansas | CO, KS, OK, AR | Colorado | Arkansas | |
| Columbia | MT, ID, WA, OR, Canada | Canada | Oregon | Crosses into Canada |
| Rio Grande | CO, NM, TX, Mexico | Colorado | Texas / Mexico | Forms US-Mexico border |

---

## UI Structure

### Header (always visible during gameplay)
- GeoChain logo (left)
- Placed / Errors stats (centre)
- ☀/🌙 theme toggle, Timer toggle pill, Menu, New Game, Switch Mode buttons (right)

### Sidebar (left, gameplay only)
- Message area ("Name a country" / "X/Y river countries placed" etc.)
- Search bar with ghost text autocomplete + Go button
- Error limit badge (X / Y errors) — only shown when Error Limit condition active
- River progress badge (X / Y river) — only shown in Source to Sea mode
- Show List toggle (pill)
  - When open: Show Names toggle + Chain list (numbered, blurred names until toggled)

### Map Area (main content)
- SVG map (equirectangular, 1000×500 viewBox) — ideally replaced with 3D globe
- Pan (drag) + Zoom (scroll)
- River line toggle (top-right, Source to Sea only)
- River name label (top-centre, Source to Sea only)
- "US States Mode" label (top-left, states mode only)

### Main Menu (start screen)
- ☀/🌙 light mode pill toggle
- GeoChain logo + tagline
- How-to rules list (colour-coded arrows)
- 🌍 World Countries button
- 🇺🇸 US States button
- 🌊 Source to Sea button → opens rules panel → World Rivers / US State Rivers selection
- 🏆 Winning Conditions button → opens conditions panel

### Panels (overlays)
All panels are modal overlays with backdrop blur.

**Winning Conditions Panel**
- Default (pre-selected, endless)
- Error Limit (with number input sub-panel)
- Continental Domination (⚠ not available in US States)
- World Domination (⚠ not available in US States)
- Time Limit (with MM:SS sub-panel)
- Confirm button

**Source to Sea Rules Panel**
- Rules explanation
- World Rivers / US State Rivers buttons

**River Selection Panel (World / US States)**
- 🎲 Random (bold, top)
- Individual river buttons
- Columbia + Rio Grande marked with "⚠ This river crosses into foreign territory — it can be entered"

**Dual-Continent Picker** (Russia/Turkey starters in Continental Domination)
- Shown before game starts
- Buttons: Europe (N countries) / Asia (N countries)
- Input locked until chosen

**Time Limit Picker** (Time Limit condition)
- MM:SS input
- "The countdown begins when you enter your first country — right or wrong"
- Start Game button

**Incompatible Mode Panel** (World/Continental Domination + US States)
- Warning message
- Continue on Default / Back to Menu

**Game Over Panel** (Error Limit hit / Timer expired)
- Title, score, error count
- Record tracking
- Play Again / Switch Mode / Menu buttons

**Win Panel** (Continental / World Domination won)
- "X Dominated!" or "World Dominated!"
- Countries placed, errors, record
- Try Again / Keep Playing / Switch Mode / Menu buttons

---

## Visual Design

### Dark Mode (default)
- Background: `#080c14`
- Surface: `#0f1623`
- Border: `#1e2d45`
- Accent (green): `#3de8a0`
- Accent2 (amber): `#f7b731`
- Accent3 (red): `#e84855`
- Text: `#d8e3f0`
- Muted: `#4a5a78`

### Light Mode
- Background: `#f0f4f8`
- Surface: `#ffffff`
- Border: `#c8d4e0`
- Accent: `#18a870`
- Accent2: `#d4920a`
- Accent3: `#d63040`
- Text: `#1a2535`

### Typography
- Display/headers: Bebas Neue
- Body/mono: DM Mono
- UI: DM Sans

### Country Shape Colours (dark mode)
- Unplaced (visible): `#0d1a2e` fill, `#1e3a5f` stroke
- Starter: `#0a2e1e` fill, `#3de8a0` stroke (teal/green)
- Placed normal: `#0a1e2e` fill, `#1e4a6e` stroke (dark blue)
- States mode uses amber accent (`#f7b731`) instead of teal

### River Line
- Colour: `#00aaff`
- Width: 3px
- Solid (no dash)
- Opacity: 0.9
- Secondary branch (White Nile): `#00cfff`

---

## 3D Globe Suggestion (new build)

The current proof of concept uses a flat equirectangular SVG map. For the new version, consider:

- **Three.js** or **D3 with geoOrthographic** projection
- Drag to rotate globe
- Scroll to zoom
- Country meshes loaded from Natural Earth TopoJSON, projected onto sphere
- Smooth transition/spin to newly placed country
- US States mode: switch to flat map (orthographic top-down of North America) or flat panel inset
- River lines rendered as great-circle arcs on globe surface
- Country labels as CSS3D sprites floating above their centroids
- Atmosphere glow effect, subtle starfield or gradient background

---

## Records System

Records are stored per game configuration:
- `{mode}-condition-error-limit-{limit}` → best countries placed
- `{mode}-win-continental-{continent}` → fewest errors
- `{mode}-win-world-World` → fewest errors
- `{mode}-timer-{duration}` → most countries placed

In the new build these should be persisted server-side (user accounts or anonymous via localStorage fallback).

---

## Alias Dictionary (partial, extend as needed)

```
Holland → Netherlands
United States of America / USA / US / America → United States
England / Great Britain / Britain / UK → United Kingdom
UAE / Emirates → United Arab Emirates
Ivory Coast → Côte d'Ivoire
Czechia / Czech → Czech Republic
Burma → Myanmar
Swaziland → Eswatini
East Timor / Timor → Timor-Leste
Türkiye / Turkiye → Turkey
Republic of Ireland / Eire → Ireland
Cabo Verde → Cape Verde
Persia → Iran
Hellas → Greece
Formosa → Taiwan
Siam → Thailand
Kampuchea → Cambodia
Abyssinia → Ethiopia
Rhodesia → Zimbabwe
Tanganyika → Tanzania
DR Congo / Congo Kinshasa / Congo DR → Democratic Republic of the Congo
Congo Brazzaville / Congo Republic → Republic of the Congo
Bosnia → Bosnia and Herzegovina
North Mac / Macedonia → North Macedonia
Trinidad / Tobago → Trinidad and Tobago
The Gambia → Gambia
Saudi → Saudi Arabia
KSA → Saudi Arabia
PNG → Papua New Guinea
CAR / Central Africa → Central African Republic
DRC → Democratic Republic of the Congo
Byelorussia / Belorussia → Belarus
Surinam → Suriname
New Guinea → Papua New Guinea
Kyrgyzia / Kirghizia → Kyrgyzstan
```

---

## Technical Notes for Rebuild

### Map Data
- World: Natural Earth 50m TopoJSON from `world-atlas` npm package
- US States: `us-atlas` npm package (10m)
- Kosovo: inject manually (Natural Earth leaves it as undefined-ID feature)
- Kaliningrad: inject as separate polygon from Russia's MultiPolygon array
- Greenland: ISO 304, in Natural Earth but inject separately for reliable access
- Crimea: inject from Russia's polygon array, assign to Ukraine's geometry

### Polygon Filtering
When processing MultiPolygon countries, filter out polygons where:
- Area < 1% of largest polygon (removes tiny island fragments)
- Spans > 270° longitude AND area < 5% of max (removes antimeridian wrap artefacts for Russia/USA)

### Antimeridian
Russia's main polygon crosses the antimeridian. Use `clipRingToLon(ring, 169)` — take the longest contiguous run of points with longitude < 169° as the main polygon.

### Projection (flat map)
```js
function project(lon, lat) {
  return [(lon + 180) * (1000 / 360), (90 - lat) * (500 / 180)];
}
// SVG viewBox: 0 0 1000 500
```

### Autocomplete
Ghost text overlay positioned absolutely over the input. Tab or → accepts the suggestion. Enter always submits exactly what was typed (never silently upgrades to autocomplete).

### BFS Neighbour Search (Source to Sea)
In STS mode, `getReachableRiverCountries()` does BFS through non-river countries to find which river countries are currently reachable. This allows the player to chain through stepping stones without having to explicitly type each one.

### Timer
- Activates on first correct OR wrong guess
- Once started, cannot be toggled
- Time Limit condition uses a countdown; Default/Error Limit/Continental/World use a count-up display

---

## Future Features (not in demo)

- **Multiplayer**: real-time competitive chaining (same starter, race to chain furthest)
- **Daily Challenge**: seeded random starter, global leaderboard
- **Country Info**: click a placed country to see flag, capital, population
- **Hint system**: cost X points, reveals country name or highlights valid neighbours
- **Speed Mode**: no errors allowed, time counts up, compete on time to complete a continent
- **Custom chains**: share a specific chain with a friend via URL
- **Globe mode**: 3D orthographic globe with rotation
- **More rivers**: Volvo (Russia), Yangtze (China), Indus (Pakistan/India), Murray-Darling (Australia), Orange (Southern Africa)
- **User accounts**: persistent records, history, streaks
