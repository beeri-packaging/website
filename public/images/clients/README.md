# Client / partner logos

Logos rendered in the **"מבין לקוחותינו / Among our clients"** band on the About page
(`/he/about`, `/en/about`).

## How to add a logo

1. Drop the logo file in this folder. **SVG is strongly preferred** (crisp at any size);
   PNG/WebP with a transparent background also works.
2. Register it in the `clients` array in [`app/content/about.ts`](../../../app/content/about.ts),
   under **both** the `he` and `en` blocks:

   ```ts
   clients: [
     { name: "שם החברה", logo: "/images/clients/company.svg" },
     // ...
   ],
   ```

Logos sit on a light (bone) tile, so dark or full-colour marks read best. While the array is
empty the band shows neat placeholder tiles, so the page always looks intentional.

## July 2026 audit

Required client-feedback logos are present:

- `elite.png` — Strauss Coffee / Elite Coffee. Official source checked:
  https://strausscoffee.com/brand/elite-coffee/
- `carlsberg.png` — Carlsberg. Official design-guide source checked:
  https://www.carlsberggroup.com/who-we-are/about-the-carlsberg-group/design-guide/
- `cbc.svg` — CBC Israel / Central Bottling Company.
- `wissotzky.svg` — Wissotzky. Official site checked: https://www.wtea.com/
- `nestle.svg` — Nestle.
- `carmel-winery.svg` — Carmel Wineries / Winegrowers Cooperative. Official source:
  https://www.carmelwines.co.il/wp-content/uploads/2021/12/logo.svg
- `recanati.png` — Recanati Winery. Official source checked:
  https://www.recanati-winery.com/en/
- `golan-heights-winery.svg` — Golan Heights Winery.
- `tempo.png` — Tempo. Official source checked: https://en.tempo.co.il/
- `leiman-schlussel.png` — Leiman Schlussel. Official source:
  https://www.l-s.co.il/wp-content/uploads/2024/03/Shlisel-Color-Logo.png
- `altman.png` — Altman.

Known follow-up: `elite.png`, `tempo.png`, `leiman-schlussel.png`, and `recanati.png`
are raster assets. SVG replacements are preferred if the brand supplies them. Adobe
vectorization was attempted for the small official PNGs, but the Adobe connector required
reauthentication in this session.
