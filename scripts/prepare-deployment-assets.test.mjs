import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, access, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { prepareAssets } from './prepare-deployment-assets.mjs';

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'beeri-asset-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const folder of ['app/review', 'public/images/categories', 'public/images/generated']) {
    await mkdir(path.join(root, folder), { recursive: true });
  }
  await writeFile(path.join(root, 'public/images/categories/original.jpg'), 'original');
  await writeFile(path.join(root, 'public/images/generated/review.webp'), 'review');
  await writeFile(path.join(root, 'app/review/page.tsx'), 'const image = "/images/generated/review.webp";');
  return root;
}

test('audit leaves originals intact; preparation preserves review assets and archives originals', async t => {
  const root = await fixture(t);
  const docs = [{ _id: 'home', image: 'https://cdn.sanity.io/example.jpg' }];
  const report = await prepareAssets(root, docs);
  assert.equal(report.excludedBytes, 8);
  assert.equal(report.retainedBytes, 6);
  await access(path.join(root, 'public/images/categories/original.jpg'));
  await prepareAssets(root, docs, true);
  assert.equal(await readFile(path.join(root, '.deployment-source-assets/images/categories/original.jpg'), 'utf8'), 'original');
  assert.equal(await readFile(path.join(root, 'public/images/generated/review.webp'), 'utf8'), 'review');
  assert.match(await readFile(path.join(root, 'app/review/page.tsx'), 'utf8'), /review.webp/);
  await assert.rejects(access(path.join(root, 'public/images/categories/original.jpg')));
});

test('a CMS legacy reference blocks preparation before any file moves', async t => {
  const root = await fixture(t);
  await assert.rejects(prepareAssets(root, [{ image: { legacyImagePath: '/images/categories/original.jpg' } }], true), /CMS still references/);
  await access(path.join(root, 'public/images/categories/original.jpg'));
});

test('a review source reference blocks preparation before any file moves', async t => {
  const root = await fixture(t);
  await writeFile(path.join(root, 'app/review/page.tsx'), 'const image = "/images/categories/original.jpg";');
  await assert.rejects(prepareAssets(root, [{ _id: 'home' }], true), /Source still references/);
  await access(path.join(root, 'public/images/categories/original.jpg'));
});

test('an empty CMS response cannot silently authorize removing assets', async t => {
  const root = await fixture(t);
  await assert.rejects(prepareAssets(root, [], true), /no documents/);
  await access(path.join(root, 'public/images/categories/original.jpg'));
});
