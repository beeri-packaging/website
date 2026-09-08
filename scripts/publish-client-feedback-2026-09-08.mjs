// Run with the project's editor credentials and tsx. Dry-run by default.
// User approved publishing the reviewed feedback on 8 September 2026.
import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { reviewCatalog, reviewFinishing, reviewHomeCopy, reviewPost, reviewProducts, reviewPunctuation } from '../app/content/client-feedback.ts';

const client = createClient({ projectId: '4qkb39ql', dataset: 'production', apiVersion: '2024-10-01', useCdn: false, token: process.env.SANITY_API_WRITE_TOKEN });
const assets = JSON.parse(readFileSync('app/content/feedback-assets.json', 'utf8'));
const imageRef = (url) => {
  const published = Object.values(assets).find(a => a.url === url);
  const name = new URL(url).pathname.split('/').pop();
  const match = name.match(/^([a-f0-9]+)-(\d+x\d+)\.(\w+)$/);
  if (!published && !match) throw new Error(`Not a CDN image: ${url}`);
  return { _type: 'image', asset: { _type: 'reference', _ref: published?.id ?? `image-${match[1]}-${match[2]}-${match[3]}` } };
};
const localAssets = {
  '/api/local-review/sabon-mediterranean-v2.png': assets.sabon.url,
  '/api/local-review/essential.png': assets.essentialImage.url,
  '/api/local-review/vital.png': assets.vitalImage.url,
};
const image = (value) => typeof value === 'string' ? imageRef(localAssets[value] ?? value) : value;
const docs = await client.fetch('*[!(_id in path("drafts.**")) && language in ["he","en"] && _type in ["home","siteSettings","catalog","finishing","post","careers","blogSettings","placeholderPage"]]');
mkdirSync('output/production-release', { recursive: true });
const changes = [];
for (const doc of docs) {
  let next = structuredClone(doc);
  const lang = doc.language;
  if (doc._type === 'home') next = reviewHomeCopy(next, lang);
  if (doc._type === 'siteSettings' && lang === 'en') {
    next.logoEn = imageRef(assets.logo.url);
    next.logoEnIncludesByline = true;
  }
  if (doc._type === 'catalog') {
    next = reviewCatalog(next, lang);
    next.productCategories = reviewProducts(next.productCategories, lang).map(c => ({...c, products:c.products.map(p=>({...p,examples:p.examples.map(e=>({...e,image:image(e.image)}))}))}));
  }
  if (doc._type === 'post') {
    const reviewed = reviewPost({...next, slug: doc.slug.current}, lang);
    next.sections = reviewed.sections?.map(s => ({...s, ...(s.links ? {links:s.links.map((l,i)=>({...l,_type:'articleLink',_key:`link-${i}`}))}: {})}));
  }
  if (doc._type === 'finishing') {
    next = reviewFinishing(next, lang);
    next.standards = next.standards.map(s => {
      if (!['ESSENTIAL','VITAL'].includes(s.code)) return s;
      const key = s.code === 'ESSENTIAL' ? 'essentialPdf' : 'vitalPdf';
      const {certificateUrl, ...fields} = s;
      void certificateUrl;
      return {...fields,_type:'finishingStandard',_key:s.code.toLowerCase(),image:image(s.image),certificate:{_type:'file',asset:{_type:'reference',_ref:assets[key].id}}};
    });
  }
  next = reviewPunctuation(next);
  const set = Object.fromEntries(Object.entries(next).filter(([k,v]) => !k.startsWith('_') && v !== undefined && !isDeepStrictEqual(v, doc[k])));
  if (Object.keys(set).length) changes.push({id:doc._id,revision:doc._rev,set});
}
writeFileSync('output/production-release/cms-plan.json',JSON.stringify(changes,null,2));
console.log(changes.map(c=>({id:c.id,fields:Object.keys(c.set)})));
if (process.argv.includes('--apply')) {
  writeFileSync('output/production-release/cms-before-publish.json',JSON.stringify(docs,null,2));
  let tx = client.transaction();
  for (const c of changes) tx = tx.patch(c.id,p=>p.ifRevisionId(c.revision).set(c.set));
  if (changes.length) await tx.commit();
  console.log(`Published ${changes.length} documents in one revision-checked transaction.`);
}
