import {test,expect} from '@playwright/test';
for(const locale of ['he','en'])test(`catalog titles fit two lines without truncation (${locale})`,async({page})=>{
 test.setTimeout(180000);
 await page.goto(`/${locale}/catalog`);
 await page.evaluate(()=>document.fonts.ready);
 for(const width of [320,390,640,768,1024,1280]){
  await page.setViewportSize({width,height:900});
  const titles=page.locator('article h3');
  await expect(titles).toHaveCount(12);
  const measurements=await titles.evaluateAll(nodes=>nodes.map(n=>({text:n.textContent,lines:n.getBoundingClientRect().height/parseFloat(getComputedStyle(n).lineHeight),clamp:getComputedStyle(n).webkitLineClamp})));
  for(const m of measurements){expect(m.lines,`${width}: ${m.text}`).toBeLessThanOrEqual(2.1);expect(m.clamp).toBe('none');}
  const cards=page.locator('article > button');
  for(let i=0;i<12;i++){
   await cards.nth(i).click();
   const heading=page.getByRole('dialog').locator('h2');
   const m=await heading.evaluate(n=>({text:n.textContent,lines:n.getBoundingClientRect().height/parseFloat(getComputedStyle(n).lineHeight)}));
   expect(m.lines,`modal ${width}: ${m.text}`).toBeLessThanOrEqual(2.1);
   await page.keyboard.press('Escape');
  }
 }
});
