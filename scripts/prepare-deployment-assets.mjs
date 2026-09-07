import { readdir, readFile, mkdir, rename, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// These source photographs were migrated to Sanity. Keep them in Git, but
// move them outside public in Vercel's disposable build checkout only.
export const archiveFolders = ['images/categories', 'images/uncategorized'];
const sourceFolders = ['app', 'components', 'lib', 'sanity', 'i18n', 'messages'];

async function filesUnder(directory) {
  let entries;
  try { entries = await readdir(directory, { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const groups = await Promise.all(entries.map(entry => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(filename) : [filename];
  }));
  return groups.flat();
}

export function referencedArchiveFolders(content) {
  return archiveFolders.filter(folder => content.includes(folder));
}

export async function auditAssets(root, documents) {
  if (!Array.isArray(documents) || documents.length === 0) {
    throw new Error('CMS audit returned no documents; refusing to exclude assets.');
  }
  const references = referencedArchiveFolders(JSON.stringify(documents));
  if (references.length) throw new Error(`CMS still references archived assets: ${references.join(', ')}`);

  for (const folder of sourceFolders) {
    for (const filename of await filesUnder(path.join(root, folder))) {
      if (!/\.(?:[cm]?[jt]sx?|json|css|html|mdx)$/.test(filename)) continue;
      if (referencedArchiveFolders(await readFile(filename, 'utf8')).length) {
        throw new Error(`Source still references archived assets: ${path.relative(root, filename)}`);
      }
    }
  }

  const publicFiles = await filesUnder(path.join(root, 'public'));
  let excludedBytes = 0;
  let retainedBytes = 0;
  let excludedFiles = 0;
  for (const filename of publicFiles) {
    const relative = path.relative(path.join(root, 'public'), filename).split(path.sep).join('/');
    const size = (await stat(filename)).size;
    if (archiveFolders.some(folder => relative.startsWith(`${folder}/`))) {
      excludedBytes += size;
      excludedFiles++;
    } else {
      retainedBytes += size;
      // Catch references from retained SVG/CSS/HTML files as well.
      if (/\.(?:svg|css|html|json|js|txt)$/.test(filename)
          && referencedArchiveFolders(await readFile(filename, 'utf8')).length) {
        throw new Error(`Public file still references archived assets: ${relative}`);
      }
    }
  }
  return { excludedFiles, excludedBytes, retainedBytes };
}

export async function prepareAssets(root, documents, apply = false) {
  // Complete every check before moving anything. An unavailable CMS must fail
  // the build; it must never be treated as evidence that an image is unused.
  const report = await auditAssets(root, documents);
  if (apply) {
    for (const folder of archiveFolders) {
      const source = path.join(root, 'public', folder);
      try { await stat(source); }
      catch (error) { if (error.code === 'ENOENT') continue; throw error; }
      const destination = path.join(root, '.deployment-source-assets', folder);
      await mkdir(path.dirname(destination), { recursive: true });
      await rename(source, destination);
    }
  }
  return report;
}

async function main() {
  const apply = process.argv.includes('--apply');
  if (apply && process.env.VERCEL !== '1') {
    throw new Error('--apply is restricted to Vercel build checkouts. Local audits are read-only.');
  }
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4qkb39ql';
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const query = '*[!(_type in ["sanity.imageAsset", "sanity.fileAsset"])]';
  const url = new URL(`https://${projectId}.api.sanity.io/v2024-10-01/data/query/${dataset}`);
  url.searchParams.set('query', query);
  url.searchParams.set('perspective', 'published');
  const token = process.env.SANITY_API_READ_TOKEN;
  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`CMS asset audit failed (HTTP ${response.status}).`);
  const { result } = await response.json();
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const report = await prepareAssets(root, result, apply);
  console.log(JSON.stringify({ mode: apply ? 'prepared' : 'audit', ...report }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
