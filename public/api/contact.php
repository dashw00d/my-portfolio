<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function send_json(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    send_json(405, ['success' => false, 'message' => 'Method not allowed.']);
}

$raw = file_get_contents('php://input') ?: '';
if (strlen($raw) > 32_000) {
    send_json(413, ['success' => false, 'message' => 'Payload too large.']);
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    send_json(400, ['success' => false, 'message' => 'Invalid JSON.']);
}

if (trim((string) ($data['website'] ?? '')) !== '') {
    send_json(200, ['success' => true, 'message' => 'Message sent successfully.']);
}

$name = trim((string) ($data['name'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$company = trim((string) ($data['company'] ?? ''));
$project = trim((string) ($data['project'] ?? ''));
$timeline = trim((string) ($data['timeline'] ?? ''));

if ($name === '' || $email === '' || $project === '') {
    send_json(422, [
        'success' => false,
        'message' => 'Name, email, and project details are required.',
    ]);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_json(422, ['success' => false, 'message' => 'A valid email is required.']);
}

$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateFile = sys_get_temp_dir() . '/dashwood-contact-' . hash('sha256', $ip);
$hits = [];
if (is_file($rateFile)) {
    $hits = json_decode((string) file_get_contents($rateFile), true) ?: [];
}
$windowStart = time() - 3600;
$hits = array_values(array_filter($hits, static fn ($ts) => (int) $ts >= $windowStart));
if (count($hits) >= 8) {
    send_json(429, ['success' => false, 'message' => 'Too many messages. Try again later.']);
}
$hits[] = time();
file_put_contents($rateFile, json_encode($hits), LOCK_EX);

$config = load_contact_config();
$defaultTo = 'ryan@dashwood.net';
$to = $config['CONTACT_TO'] ?: $config['CONTACT_FROM'] ?: $config['SMTP_USER'] ?: $defaultTo;
$from = $config['CONTACT_FROM'] ?: $config['SMTP_USER'] ?: $defaultTo;
$bcc = $config['CONTACT_BCC'];

$subject = 'New inquiry from ' . $name;
$text = "Name: {$name}\nEmail: {$email}\nCompany: " . ($company !== '' ? $company : '--') .
    "\nTimeline: " . ($timeline !== '' ? $timeline : '--') . "\n\nProject details:\n{$project}\n";
$html = '<h2>New inquiry</h2>'
    . '<p><strong>Name:</strong> ' . h($name) . '</p>'
    . '<p><strong>Email:</strong> ' . h($email) . '</p>'
    . '<p><strong>Company:</strong> ' . h($company !== '' ? $company : '—') . '</p>'
    . '<p><strong>Timeline:</strong> ' . h($timeline !== '' ? $timeline : '—') . '</p>'
    . '<p>' . nl2br(h($project), false) . '</p>';

$mailConfigured = $config['SMTP_HOST'] !== '' && $config['SMTP_PORT'] !== ''
    && $config['SMTP_USER'] !== '' && $config['SMTP_PASS'] !== '';

try {
    if ($mailConfigured) {
        smtp_send($config, $from, $to, $bcc, $email, $subject, $text, $html);
    } else {
        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'From: ' . $from,
            'Reply-To: ' . $email,
        ];
        if ($bcc !== '') {
            $headers[] = 'Bcc: ' . $bcc;
        }
        $ok = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $text, implode("\r\n", $headers));
        if (!$ok) {
            error_log('dashwood contact: mail() failed; logged submission instead');
            error_log(json_encode([
                'name' => $name,
                'email' => $email,
                'company' => $company,
                'timeline' => $timeline,
                'submittedAt' => gmdate('c'),
            ]));
        }
    }
    send_json(200, ['success' => true, 'message' => 'Message sent successfully.']);
} catch (Throwable $e) {
    error_log('dashwood contact mail error: ' . $e->getMessage());
    send_json(500, ['success' => false, 'message' => 'Failed to send email.']);
}

function h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function load_contact_config(): array
{
    $keys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_TO', 'CONTACT_FROM', 'CONTACT_BCC'];
    $config = array_fill_keys($keys, '');

    $candidates = [
        dirname(__DIR__, 2) . '/contact.config.php',
        dirname(__DIR__) . '/contact.config.php',
        __DIR__ . '/contact.config.php',
    ];
    foreach ($candidates as $path) {
        if (is_file($path)) {
            $loaded = include $path;
            if (is_array($loaded)) {
                foreach ($keys as $key) {
                    if (isset($loaded[$key]) && $loaded[$key] !== '') {
                        $config[$key] = (string) $loaded[$key];
                    }
                }
            }
            break;
        }
    }

    foreach ($keys as $key) {
        $env = getenv($key);
        if (is_string($env) && $env !== '') {
            $config[$key] = $env;
        }
    }

    return $config;
}

function smtp_send(
    array $config,
    string $from,
    string $to,
    string $bcc,
    string $replyTo,
    string $subject,
    string $text,
    string $html
): void {
    $host = $config['SMTP_HOST'];
    $port = (int) ($config['SMTP_PORT'] ?: 587);
    $secure = $port === 465;
    $timeout = 12;
    $remote = ($secure ? 'ssl://' : '') . $host . ':' . $port;
    $fp = @stream_socket_client($remote, $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT);
    if ($fp === false) {
        throw new RuntimeException("SMTP connect failed: {$errstr}");
    }
    stream_set_timeout($fp, $timeout);

    smtp_expect($fp, 220);
    smtp_cmd($fp, 'EHLO dashwood.net', 250);
    if (!$secure) {
        smtp_cmd($fp, 'STARTTLS', 220);
        if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            throw new RuntimeException('SMTP STARTTLS failed.');
        }
        smtp_cmd($fp, 'EHLO dashwood.net', 250);
    }
    smtp_cmd($fp, 'AUTH LOGIN', 334);
    smtp_cmd($fp, base64_encode($config['SMTP_USER']), 334);
    smtp_cmd($fp, base64_encode($config['SMTP_PASS']), 235);
    smtp_cmd($fp, 'MAIL FROM:<' . extract_email($from) . '>', 250);
    smtp_cmd($fp, 'RCPT TO:<' . extract_email($to) . '>', 250);
    if ($bcc !== '') {
        smtp_cmd($fp, 'RCPT TO:<' . extract_email($bcc) . '>', 250);
    }

    $boundary = 'b' . bin2hex(random_bytes(12));
    $headers = [
        'From: ' . $from,
        'To: ' . $to,
        'Reply-To: ' . $replyTo,
        'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    ];
    $body = implode("\r\n", $headers) . "\r\n\r\n" .
        '--' . $boundary . "\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n{$text}\r\n" .
        '--' . $boundary . "\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n{$html}\r\n" .
        '--' . $boundary . "--\r\n";

    smtp_cmd($fp, 'DATA', 354);
    fwrite($fp, str_replace("\n.", "\n..", $body) . "\r\n.\r\n");
    smtp_expect($fp, 250);
    smtp_cmd($fp, 'QUIT', 221);
    fclose($fp);
}

function extract_email(string $value): string
{
    if (preg_match('/<([^>]+)>/', $value, $match)) {
        return $match[1];
    }
    return $value;
}

function smtp_cmd($fp, string $command, int $expect): void
{
    fwrite($fp, $command . "\r\n");
    smtp_expect($fp, $expect);
}

function smtp_expect($fp, int $expect): void
{
    $response = '';
    while (($line = fgets($fp, 2048)) !== false) {
        $response .= $line;
        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }
    if (!str_starts_with($response, (string) $expect)) {
        throw new RuntimeException('Unexpected SMTP response: ' . trim($response));
    }
}
