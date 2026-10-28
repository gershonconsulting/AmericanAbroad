<?php
// GET /api/stats.php?k=<key> — private campaign dashboard (visits + applications by UTM).
// Add &csv=submissions to download all submissions as CSV.
require __DIR__ . '/lib.php';

$k = $_GET['k'] ?? '';
if (!hash_equals(AAN_STATS_KEY_SHA256, hash('sha256', $k))) { http_response_code(404); echo 'Not found'; exit; }

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

if (($_GET['csv'] ?? '') === 'submissions') {
    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename="americanabroad-submissions-' . gmdate('Y-m-d') . '.csv"');
    readfile(aan_data_dir() . '/submissions.csv');
    exit;
}

$visits = aan_read_csv('visits.csv');
$subs   = aan_read_csv('submissions.csv');
$days   = max(1, min(365, (int)($_GET['days'] ?? 30)));
$since  = gmdate('c', time() - $days * 86400);
$visits = array_filter($visits, fn($r) => $r['ts'] >= $since);
$subsP  = array_filter($subs, fn($r) => $r['received_at'] >= $since);

$camp = []; // campaign|content => [visits, uniques, apps]
$key = fn($r) => ($r['utm_campaign'] ?: '(no campaign)') . ' | ' . ($r['utm_content'] ?: '—');
foreach ($visits as $r) {
    $c = $key($r);
    $camp[$c] ??= ['v' => 0, 'u' => [], 'a' => 0, 'src' => $r['utm_source']];
    $camp[$c]['v']++; $camp[$c]['u'][$r['visitor']] = 1;
}
foreach ($subsP as $r) {
    $c = $key($r);
    $camp[$c] ??= ['v' => 0, 'u' => [], 'a' => 0, 'src' => $r['utm_source']];
    $camp[$c]['a']++;
}
uasort($camp, fn($a, $b) => [$b['a'], $b['v']] <=> [$a['a'], $a['v']]);

$pages = [];
foreach ($visits as $r) { $pages[$r['page']] = ($pages[$r['page']] ?? 0) + 1; }
arsort($pages);
$forms = [];
foreach ($subsP as $r) { $forms[$r['form_type']] = ($forms[$r['form_type']] ?? 0) + 1; }

$h = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES);
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>AmericanAbroad — Campaign Stats</title>
<style>
body{font-family:Inter,system-ui,sans-serif;background:#F7F8FC;color:#1C1C2E;margin:0;padding:24px}
h1{color:#0A2463;font-size:1.4rem;margin:0 0 4px}h2{color:#0A2463;font-size:1.05rem;margin:28px 0 8px}
.k{display:flex;gap:12px;flex-wrap:wrap;margin:16px 0}.k div{background:#fff;border-radius:10px;padding:14px 18px;min-width:130px;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.k b{display:block;font-size:1.6rem;color:#BF0A30}table{border-collapse:collapse;width:100%;background:#fff;font-size:.88rem}
td,th{padding:8px 10px;border-bottom:1px solid #EEF0F5;text-align:left}th{background:#0A2463;color:#fff}td.n{text-align:right}
a{color:#BF0A30}.wrap{overflow-x:auto}
</style></head><body>
<h1>AmericanAbroad.net — Campaign Stats</h1>
<div>Last <?= $days ?> days · <a href="?k=<?= $h($k) ?>&days=7">7d</a> · <a href="?k=<?= $h($k) ?>&days=30">30d</a> · <a href="?k=<?= $h($k) ?>&days=90">90d</a> · <a href="?k=<?= $h($k) ?>&csv=submissions">Download all submissions (CSV)</a></div>
<div class="k">
<div><b><?= count($visits) ?></b>Page views</div>
<div><b><?= count(array_unique(array_column($visits, 'visitor'))) ?></b>Unique visitors</div>
<div><b><?= count($subsP) ?></b>Form submissions</div>
<div><b><?= $forms['representative'] ?? 0 ?></b>Rep applications</div>
</div>
<h2>By campaign (utm_campaign | utm_content)</h2>
<div class="wrap"><table><tr><th>Campaign | Content</th><th>Source</th><th class="n">Views</th><th class="n">Visitors</th><th class="n">Submissions</th><th class="n">Conv.</th></tr>
<?php foreach ($camp as $c => $d): $u = count($d['u']); ?>
<tr><td><?= $h($c) ?></td><td><?= $h($d['src']) ?></td><td class="n"><?= $d['v'] ?></td><td class="n"><?= $u ?></td><td class="n"><?= $d['a'] ?></td><td class="n"><?= $u ? round(100 * $d['a'] / $u, 1) . '%' : '—' ?></td></tr>
<?php endforeach; ?></table></div>
<h2>Latest submissions</h2>
<div class="wrap"><table><tr><th>When (UTC)</th><th>Form</th><th>Name</th><th>Email</th><th>Country</th><th>Campaign</th></tr>
<?php foreach (array_slice(array_reverse($subs), 0, 50) as $r): ?>
<tr><td><?= $h(substr($r['received_at'], 0, 16)) ?></td><td><?= $h($r['form_type']) ?></td><td><?= $h($r['first_name'] . ' ' . $r['last_name']) ?></td><td><?= $h($r['email']) ?></td><td><?= $h($r['country']) ?></td><td><?= $h($r['utm_campaign']) ?></td></tr>
<?php endforeach; ?></table></div>
<h2>Top pages</h2>
<div class="wrap"><table><tr><th>Page</th><th class="n">Views</th></tr>
<?php foreach (array_slice($pages, 0, 20, true) as $p => $n): ?><tr><td><?= $h($p) ?></td><td class="n"><?= $n ?></td></tr><?php endforeach; ?>
</table></div>
</body></html>
