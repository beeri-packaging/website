import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('catalog opens all twelve products and loads all thirty-four examples',async({page},testInfo)=>{
 test.setTimeout(150000);
 const errors:string[]=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/review/catalog-preview');
 const cards=page.getByRole('button',{name:/— לפתיחת המוצר$/});
 await expect(cards).toHaveCount(12);
 let count=0;
 for(let p=0;p<12;p++){
  await cards.nth(p).click(); const dialog=page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const examples=dialog.getByRole('button',{name:/^דוגמה /}); const n=await examples.count();count+=n;
  if(n===0) await expect(dialog.getByText('ממתין לתמונת דוגמה מאושרת')).toBeVisible();
  for(let i=0;i<n;i++){
   await examples.nth(i).click();
   await expect.poll(()=>dialog.locator('img').first().evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0),{timeout:15000}).toBe(true);
  }
  if(p===10) await page.screenshot({path:testInfo.outputPath('food-desktop.png'),animations:'disabled'});
  if(p===11){
   await page.screenshot({path:testInfo.outputPath('pharma-desktop.png'),animations:'disabled'});
   const a=await new AxeBuilder({page}).analyze();
   expect(a.violations.filter(v=>['serious','critical'].includes(v.impact??''))).toEqual([]);
  }
  await dialog.getByRole('button',{name:'סגירת פירוט המוצר'}).click();
 }
 expect(count).toBe(34);expect(errors).toEqual([]);
 await page.setViewportSize({width:390,height:844});
 await cards.nth(10).click();const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
 await page.screenshot({path:testInfo.outputPath('food-mobile.png'),animations:'disabled'});
 await dialog.getByRole('heading',{name:'אריזות למוצרי מזון',exact:true}).scrollIntoViewIfNeeded();
 await expect(dialog.getByRole('heading',{name:'אריזות למוצרי מזון',exact:true})).toBeInViewport();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
