// Бере перший домен з queue.txt, сканує webforensik, пише results.tsv і reports/json/<id>.json.
// OK -> домен прибирається з черги; 429/помилка -> лишається на наступний запуск.
const fs = require('fs');
const q = fs.readFileSync('queue.txt', 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
if (!q.length) { console.log('queue empty'); process.exit(0); }
const d = q[0];
(async () => {
  const r = await fetch('https://webforensik.de/api.php?action=scan&url=' + encodeURIComponent('https://' + d), { signal: AbortSignal.timeout(170000) }).catch(e => ({ status: 0 }));
  if (r.status === 429) { console.log(d, '429 rate limit'); return; }
  const j = await r.json().catch(() => ({}));
  if (!j.scan_id) { console.log(d, 'no scan_id', r.status); return; }
  const res = await (await fetch('https://webforensik.de/api.php?action=result&id=' + j.scan_id)).text();
  fs.writeFileSync(`reports/json/${j.scan_id}.json`, res);
  let score = ''; try { const b = JSON.parse(res); score = b.score ?? b.total_score ?? ''; } catch {}
  const t = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Kyiv' }).slice(0, 16);
  fs.appendFileSync('results.tsv', `${t}\t${d}\t${j.scan_id}\t${score}\n`);
  fs.writeFileSync('queue.txt', q.slice(1).join('\n') + '\n');
  console.log('OK', d, j.scan_id, score);
})();
