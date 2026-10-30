<?php
// POST /api/submit.php — receives every form on the site (JSON body).
// Stores the submission in api/data/submissions.csv and emails a notification.
require __DIR__ . '/lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') aan_json(405, ['error' => 'POST only']);

$raw = file_get_contents('php://input');
$in = json_decode($raw, true);
if (!is_array($in)) $in = $_POST;
if (!is_array($in) || !$in) aan_json(400, ['error' => 'Empty submission']);

// Honeypot: bots fill the hidden "website" field. Pretend success.
if (!empty($in['website'])) aan_json(200, ['ok' => true]);

$email = filter_var(trim($in['email'] ?? ''), FILTER_VALIDATE_EMAIL);
if (!$email) aan_json(400, ['error' => 'Please enter a valid email address']);

$formType = preg_replace('/[^a-z0-9_-]/i', '', $in['form_type'] ?? 'unknown') ?: 'unknown';

$fixed = [
    'received_at'  => gmdate('c'),
    'form_type'    => $formType,
    'email'        => $email,
    'first_name'   => aan_clean($in['first_name'] ?? '', 120),
    'last_name'    => aan_clean($in['last_name'] ?? '', 120),
    'country'      => aan_clean($in['country'] ?? '', 120),
    'city'         => aan_clean($in['city'] ?? '', 120),
    'company'      => aan_clean($in['company'] ?? '', 200),
    'utm_source'   => aan_clean($in['utm_source'] ?? '', 120),
    'utm_medium'   => aan_clean($in['utm_medium'] ?? '', 120),
    'utm_campaign' => aan_clean($in['utm_campaign'] ?? '', 120),
    'utm_content'  => aan_clean($in['utm_content'] ?? '', 120),
    'landing_page' => aan_clean($in['landing_page'] ?? '', 300),
    'referrer'     => aan_clean($in['referrer'] ?? '', 300),
    'ip_hash'      => aan_ip_hash(),
];
$skip = array_merge(array_keys($fixed), ['website', 'submitted_at']);
$extra = [];
foreach ($in as $k => $v) {
    if (in_array($k, $skip, true)) continue;
    $extra[preg_replace('/[^a-z0-9_]/i', '', $k)] = aan_clean($v);
}
$row = $fixed + ['details' => json_encode($extra, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)];

aan_append_csv('submissions.csv', $row);

// Email notification (best effort — the CSV is the source of truth)
$labels = [
    'representative' => 'Local Representative application',
    'leader'         => 'Local Leader application',
    'partner'        => 'Partner application',
    'newsletter'     => 'Newsletter signup',
    'register'       => 'Network registration',
    'contact'        => 'Contact message',
];
$label = $labels[$formType] ?? ucfirst($formType);
$name = trim($fixed['first_name'] . ' ' . $fixed['last_name']);
$subject = "[AmericanAbroad] $label — " . ($name ?: $email) . ($fixed['country'] ? " ({$fixed['country']})" : '');
$body = "$label received on americanabroad.net\n\n";
foreach ($fixed as $k => $v) if ($v !== '') $body .= str_pad($k, 14) . ": $v\n";
foreach ($extra as $k => $v) if ($v !== '') $body .= str_pad($k, 14) . ": $v\n";
$headers = 'From: ' . AAN_NOTIFY_FROM . "\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";
@mail(AAN_NOTIFY_TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers);

aan_json(200, ['ok' => true]);
