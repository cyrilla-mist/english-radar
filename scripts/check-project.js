const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const root = path.resolve(__dirname, '..');
const pages = ['index.html','learn.html','dictionary.html','inbox.html','quiz.html','me.html','404.html'];
const errors = [];
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
['js/content-registry.js', 'scripts/validate-content-pack.js', 'data/signals.js', 'data/quizzes.js', 'data/cyrilla-notion-archive-pack.js', 'docs/NOTION_MIGRATION_REPORT.md'].forEach((file) => {
  if (!fs.existsSync(path.join(root, file))) errors.push(`missing required Phase 8A file ${file}`);
});
['js/sync-config.js', 'js/date-utils.js', 'js/notion-sync.js', 'scripts/validate-notion-sync-payload.js', 'worker/src/index.js', 'worker/wrangler.toml.example', 'worker/package.json', 'worker/README.md', 'docs/NOTION_SYNC_SCHEMA.md', 'docs/NOTION_SYNC_SETUP.md', 'docs/DAILY_RADAR_WORKFLOW.md'].forEach((file) => {
  if (!fs.existsSync(path.join(root, file))) errors.push(`missing required Phase 9 file ${file}`);
});
pages.forEach((file) => {
  const html = read(file);
  if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(`${file}: missing title`);
  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) errors.push(`${file}: missing viewport`);
  if (!/<meta[^>]+name=["']description["']/i.test(html)) errors.push(`${file}: missing description`);
  if (!/assets\/favicon\.svg/i.test(html)) errors.push(`${file}: missing favicon`);
  if (!/<html[^>]+lang=["'][a-z-]+["']/i.test(html)) errors.push(`${file}: missing language`);
  if (file !== '404.html' && !/<main\b/i.test(html)) errors.push(`${file}: missing main`);
  if (!/skip/i.test(html)) errors.push(`${file}: missing skip link`);
  [...html.matchAll(/(?:src|href)=["'](\.?\/[^"']+)["']/gi)].forEach((match) => {
    const target = match[1].split(/[?#]/)[0]; if (!target || target.startsWith('./assets/favicon.svg') || target.startsWith('./index.html#')) return;
    if (/\.(?:js|css|html|svg)$/i.test(target) && !fs.existsSync(path.resolve(root, target))) errors.push(`${file}: missing local target ${target}`);
  });
  if (/file:\/\/\/|C:\\Users\\|<iframe|\balert\s*\(|\bconfirm\s*\(|\beval\s*\(|new\s+Function\s*\(|\bfetch\s*\(|sessionStorage|indexedDB|document\.cookie/i.test(html)) errors.push(`${file}: forbidden or environment-specific code marker`);
});
const all = pages.map(read).join('\n');
['index.html','learn.html','dictionary.html','quiz.html','me.html'].forEach((file) => {
  const html = read(file);
  const storageIndex = html.indexOf('./js/storage.js');
  const signalsIndex = html.indexOf('./data/signals.js');
  const registryIndex = html.indexOf('./js/content-registry.js');
  if (storageIndex < 0 || signalsIndex < 0 || registryIndex < 0 || !(storageIndex < signalsIndex && signalsIndex < registryIndex)) errors.push(`${file}: storage, signals and content registry script order is invalid`);
});
const meHtml = read('me.html');
if (!/data-content-pack-import/.test(meHtml) || !/data-export-content/.test(meHtml) || !/data-import/.test(meHtml)) errors.push('me.html: missing Content Library or backup controls');
if (!/data\/cyrilla-notion-archive-pack\.js/.test(meHtml) || !/data-bundled-install/.test(meHtml) || !/data-bundled-remove/.test(meHtml)) errors.push('me.html: missing bundled Cyrilla Content Pack controls');
if (!/js\/sync-config\.js/.test(meHtml) || !/js\/notion-sync\.js/.test(meHtml) || !/data-sync-start/.test(meHtml)) errors.push('me.html: missing Notion Sync scripts or controls');
if (!/<button[^>]+type=["']button["'][^>]+data-sync-save|<button[^>]+data-sync-save[^>]+type=["']button["']/i.test(meHtml)) errors.push('me.html: Save settings must be an explicit non-submit button');
const meScript = read('js/me.js');
if (/\binnerHTML\b|\beval\s*\(|\bfetch\s*\(/i.test(meScript)) errors.push('js/me.js: content library must not use innerHTML, eval or fetch');
if (!/Notion Sync settings saved\./.test(meScript) || !/preventDefault/.test(meScript) || !/getSyncSettings\(\)/.test(meScript)) errors.push('js/me.js: Notion Sync save confirmation/re-read safeguards are missing');
if (!/Loading approved signals/.test(meScript) || !/Sync preview ready\./.test(meScript) || !/No approved signals found in Notion\./.test(meScript) || !/Unable to load approved signals:/.test(meScript)) errors.push('js/me.js: Notion Sync loading, empty, success or error feedback is incomplete');
if (!/js\/date-utils\.js/.test(meHtml) || !/EnglishRadarDate/.test(meScript)) errors.push('date-utils: unified local date utility is not wired into My Radar');
const syncConfig = read('js/sync-config.js');
if (/workerBaseUrl\s*:\s*["']https:\/\/english-radar-notion-sync\.example/i.test(syncConfig)) errors.push('js/sync-config.js: example Worker URL must not be a saved default');
const syncScript = read('js/notion-sync.js');
if (!/payload\.ok === true && Array\.isArray\(payload\.records\)/.test(syncScript) || !/exactDuplicates/.test(syncScript) || !/possibleDuplicates/.test(syncScript)) errors.push('js/notion-sync.js: normalized sync payload and preview counters are incomplete');
const frontendScripts = fs.readdirSync(path.join(root, 'js')).filter((file) => file.endsWith('.js'));
frontendScripts.forEach((file) => { const source = read(path.join('js', file)); if (file !== 'notion-sync.js' && /\bfetch\s*\(/i.test(source)) errors.push(`js/${file}: only js/notion-sync.js may use fetch`); if (/api\.notion\.com|NOTION_TOKEN\s*[:=]\s*['"][^'"]+|SYNC_ADMIN_TOKEN\s*[:=]\s*['"][^'"]+/i.test(source)) errors.push(`js/${file}: frontend contains a Notion endpoint or credential`); });
const dataCheck = childProcess.spawnSync(process.execPath, ['scripts/validate-data.js'], { cwd: root, encoding: 'utf8' });
if (dataCheck.status !== 0 || !/60 signals[\s\S]*120 quizzes/i.test(dataCheck.stdout || '')) errors.push('Core data validation did not confirm 60 Signals / 120 Quizzes.');
if (/file:\/\/\/|C:\\Users\\|<iframe|\balert\s*\(|\bconfirm\s*\(|\beval\s*\(|new\s+Function\s*\(|\bfetch\s*\(|sessionStorage|indexedDB|document\.cookie/i.test(all)) errors.push('Project contains a forbidden marker.');
if (errors.length) { console.error('English Radar project check failed.'); errors.forEach((error) => console.error(`- ${error}`)); process.exitCode = 1; } else console.log('English Radar project check passed.');
