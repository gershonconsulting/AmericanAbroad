<?php
// GET/POST /api/t.php — first-party page-visit beacon (no cookies, IP hashed).
// Called by js/main.js on every page load; records UTM tags so email
// campaigns (Snov.io) can be measured: visits -> applications.
require __DIR__ . '/lib.php';

$in = $_GET;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $j = json_decode(file_get_contents('php://input'), true);
    if (is_array($j)) $in = $j;
}
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
if ($ua === '' || preg_match('/bot|crawl|spider|slurp|preview|monitor|headless/i', $ua)) {
    http_response_code(204); exit;
}
aan_append_csv('visits.csv', [
    'ts'           => gmdate('c'),
    'page'         => aan_clean($in['p'] ?? '', 300),
    'utm_source'   => aan_clean($in['us'] ?? '', 120),
    'utm_medium'   => aan_clean($in['um'] ?? '', 120),
    'utm_campaign' => aan_clean($in['uc'] ?? '', 120),
    'utm_content'  => aan_clean($in['ut'] ?? '', 120),
    'referrer'     => aan_clean($in['r'] ?? '', 300),
    'country'      => aan_clean($_SERVER['HTTP_CF_IPCOUNTRY'] ?? '', 4),
    'visitor'      => aan_ip_hash(),
]);
http_response_code(204);
