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
