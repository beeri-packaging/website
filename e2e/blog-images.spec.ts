import {test,expect} from '@playwright/test';
const slugs=['beeri-israel-star','aix-israel-star-winner','employee-tenure-gift-pack','finishing-language','anatomy-of-a-wine-carton','recyclable-stock-2026','digital-vs-offset','from-sketch-to-prototype','display-windows'];
for(const locale of ['he','en'])test(`blog article images load and portraits remain uncropped (${locale})`,async({page})=>{
 test.setTimeout(180000);
 for(const slug of slugs){
  await page.goto(`/${locale}/blog/${slug}`);
  const article=page.locator('main article').first();await expect(article.locator('h1')).toBeVisible();
  const images=article.locator('img');expect(await images.count()).toBeGreaterThan(0);
  for(const img of await images.all()){
   await img.scrollIntoViewIfNeeded();
   await expect.poll(()=>img.evaluate((n:HTMLImageElement)=>n.complete&&n.naturalWidth>0),{timeout:20000}).toBe(true);
   const portrait=await img.evaluate((n:HTMLImageElement)=>({portrait:n.naturalHeight>n.naturalWidth,fit:getComputedStyle(n).objectFit}));
   if(portrait.portrait)expect(portrait.fit).toBe('contain');
  }
  await page.setViewportSize({width:390,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.setViewportSize({width:1280,height:960});
 }
});
