<?php
// Shared helpers for the AmericanAbroad.net form + tracking endpoints.
// Data is stored as CSV in api/data/ (blocked from the web by api/data/.htaccess).

const AAN_NOTIFY_TO   = 'olivier@gershonconsulting.com';
const AAN_NOTIFY_FROM = 'AmericanAbroad.net <no-reply@americanabroad.net>';
// sha256 of the stats access key (the key itself is NOT in this repo)
const AAN_STATS_KEY_SHA256 = 'd26ed6a204bd3995203b11e13b093413bcca055eb28e562c9069c01a8c6b3cc7';

function aan_data_dir(): string {
    $dir = __DIR__ . '/data';
    if (!is_dir($dir)) { @mkdir($dir, 0750, true); }
    $ht = $dir . '/.htaccess';
    if (!file_exists($ht)) { @file_put_contents($ht, "Require all denied\nDeny from all\n"); }
    return $dir;
}

function aan_clean($v, int $max = 2000): string {
    if (is_bool($v)) return $v ? 'yes' : 'no';
    if (is_array($v)) $v = implode('; ', array_map('strval', $v));
    $v = trim((string)$v);
    $v = str_replace(["\r", "\n", "\t"], ' ', $v);
    // neutralise spreadsheet formula injection
    if ($v !== '' && strpos('=+-@', $v[0]) !== false) $v = "'" . $v;
    return mb_substr($v, 0, $max);
}

function aan_append_csv(string $file, array $row): void {
    $path = aan_data_dir() . '/' . $file;
    $isNew = !file_exists($path);
    $fh = @fopen($path, 'a');
    if (!$fh) return;
    flock($fh, LOCK_EX);
    if ($isNew) fputcsv($fh, array_keys($row));
    fputcsv($fh, array_values($row));
    flock($fh, LOCK_UN);
    fclose($fh);
}

function aan_read_csv(string $file): array {
    $path = aan_data_dir() . '/' . $file;
    if (!file_exists($path)) return [];
    $rows = []; $head = null;
    if (($fh = fopen($path, 'r')) === false) return [];
    while (($r = fgetcsv($fh)) !== false) {
        if ($head === null) { $head = $r; continue; }
        if (count($r) === count($head)) $rows[] = array_combine($head, $r);
    }
    fclose($fh);
    return $rows;
}

function aan_json(int $code, array $body): void {
    http_response_code($code);
    header('Content-Type: application/json');
    header('Cache-Control: no-store');
    echo json_encode($body);
    exit;
}

function aan_ip_hash(): string {
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? ($_SERVER['REMOTE_ADDR'] ?? '');
    return substr(hash('sha256', $ip . '|aan'), 0, 12);
}
