<?php
declare(strict_types=1);

if (PHP_SAPI === 'cli') {
    $_SERVER['REQUEST_METHOD'] = getenv('REQUEST_METHOD') ?: ($_SERVER['REQUEST_METHOD'] ?? 'GET');
    $_SERVER['REMOTE_ADDR'] = getenv('REMOTE_ADDR') ?: '127.0.0.1';
}

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const MAX_BODY_BYTES = 300_000;
const PROPOSAL_ID = 'southern-star-website-rebuild';
const CONFIG_VERSION = 1;

function send_json(int $status, array $body): never
{
    $payload = json_encode($body, JSON_UNESCAPED_SLASHES);
    if (PHP_SAPI === 'cli') {
        echo "HTTP {$status}\n{$payload}";
        exit;
    }

    http_response_code($status);
    echo $payload;
    exit;
}

function request_path(): string
{
    $uri = (string) ($_SERVER['REQUEST_URI'] ?? '/');
    return parse_url($uri, PHP_URL_PATH) ?: '/';
}

function method(): string
{
    return strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
}

function read_json_body(): array
{
    $raw = PHP_SAPI === 'cli'
        ? (stream_get_contents(STDIN) ?: '')
        : (file_get_contents('php://input') ?: '');

    if (strlen($raw) > MAX_BODY_BYTES) {
        send_json(413, ['error' => 'Payload too large.']);
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        send_json(400, ['error' => 'Invalid JSON.']);
    }

    return $data;
}

function data_directory(): string
{
    foreach ([getenv('PROPOSAL_DATA_DIR'), $_ENV['PROPOSAL_DATA_DIR'] ?? null, $_SERVER['PROPOSAL_DATA_DIR'] ?? null] as $value) {
        if (is_string($value) && $value !== '') {
            return rtrim($value, '/');
        }
    }
    return dirname(__DIR__, 2) . '/data/proposal';
}

function database(): PDO
{
    $dir = data_directory();
    if (!is_dir($dir) && !mkdir($dir, 0770, true)) {
        send_json(500, ['error' => 'Storage unavailable.']);
    }

    $path = $dir . '/proposals.sqlite';
    $database = new PDO('sqlite:' . $path, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $database->exec('PRAGMA journal_mode = WAL');
    $database->exec('PRAGMA foreign_keys = ON');
    return $database;
}

function migrate(PDO $database): void
{
    $database->exec('CREATE TABLE IF NOT EXISTS proposals (
        id TEXT PRIMARY KEY,
        client_token_hash TEXT NOT NULL UNIQUE,
        admin_token_hash TEXT NOT NULL UNIQUE,
        config_version INTEGER NOT NULL,
        status TEXT NOT NULL CHECK (status IN ("active","read_only","revoked")),
        expires_at INTEGER NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
    )');

    $database->exec('CREATE TABLE IF NOT EXISTS shared_state (
        proposal_id TEXT PRIMARY KEY REFERENCES proposals(id) ON DELETE CASCADE,
        state_json TEXT NOT NULL,
        revision INTEGER NOT NULL DEFAULT 1,
        updated_at INTEGER NOT NULL
    )');

    $database->exec('CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        proposal_id TEXT NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
        state_json TEXT NOT NULL,
        config_version INTEGER NOT NULL,
        submitted_at INTEGER NOT NULL,
        email_status TEXT NOT NULL DEFAULT "pending"
    )');
}

function bootstrap(): PDO
{
    static $database = null;
    if ($database instanceof PDO) {
        return $database;
    }

    $clientToken = hash_token_value('client');
    $adminToken = hash_token_value('admin');
    $database = database();
    migrate($database);

    $statement = $database->prepare('SELECT COUNT(*) FROM proposals WHERE id = :id');
    $statement->execute(['id' => PROPOSAL_ID]);
    if ((int) $statement->fetchColumn() === 0) {
        $now = time();
        $insert = $database->prepare(
            'INSERT INTO proposals (id, client_token_hash, admin_token_hash, config_version, status, expires_at, created_at, updated_at)
             VALUES (:id, :client_token_hash, :admin_token_hash, :config_version, "active", NULL, :created_at, :updated_at)'
        );
        $insert->execute([
            'id' => PROPOSAL_ID,
            'client_token_hash' => hash('sha256', $clientToken),
            'admin_token_hash' => hash('sha256', $adminToken),
            'config_version' => CONFIG_VERSION,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    return $database;
}

function hash_token_value(string $kind): string
{
    $key = $kind === 'admin' ? 'PROPOSAL_ADMIN_TOKEN' : 'PROPOSAL_CLIENT_TOKEN';
    foreach ([getenv($key), $_ENV[$key] ?? null, $_SERVER[$key] ?? null] as $value) {
        if (is_string($value) && $value !== '' && !in_array($value, ['default-admin-token', 'default-client-token'], true)) {
            return $value;
        }
    }
    send_json(503, ['error' => 'Proposal access is not configured.']);
}

function tokens_match(string $expected, string $provided): bool
{
    return hash_equals($expected, hash('sha256', $provided));
}

function find_proposal(PDO $database, ?string $clientToken, ?string $adminToken): ?array
{
    $statement = $database->prepare('SELECT * FROM proposals WHERE id = :id');
    $statement->execute(['id' => PROPOSAL_ID]);
    $proposal = $statement->fetch();

    if (!is_array($proposal)) {
        return null;
    }

    if (is_string($clientToken) && $clientToken !== '' && tokens_match((string) $proposal['client_token_hash'], $clientToken)) {
        return $proposal;
    }

    if (is_string($adminToken) && $adminToken !== '' && tokens_match((string) $proposal['admin_token_hash'], $adminToken)) {
        return $proposal;
    }

    return null;
}

function normalize_state(array $input): array
{
    $selectedOneTime = array_values(array_filter((array) ($input['oneTimeOptionIds'] ?? []), 'is_string'));
    $selectedRecurring = array_values(array_filter((array) ($input['recurringOptionIds'] ?? []), 'is_string'));

    $feedback = [];
    foreach ((array) ($input['sectionFeedback'] ?? []) as $id => $item) {
        if (!is_string($id) || !is_array($item)) {
            continue;
        }
        $comment = trim((string) ($item['comment'] ?? ''));
        $status = (string) ($item['status'] ?? '');
        if ($comment === '' && $status === '') {
            continue;
        }
        $feedback[$id] = [
            'comment' => mb_substr($comment, 0, 1200),
            'status' => in_array($status, ['interested', 'question', 'maybe_later'], true) ? $status : '',
        ];
    }

    return [
        'baseSelected' => (bool) ($input['baseSelected'] ?? true),
        'oneTimeOptionIds' => array_slice($selectedOneTime, 0, 20),
        'recurringOptionIds' => array_slice($selectedRecurring, 0, 20),
        'sectionFeedback' => $feedback,
        'displayName' => mb_substr(trim((string) ($input['displayName'] ?? '')), 0, 40),
        'updatedAt' => gmdate('c'),
    ];
}

function normalize_threads(array $input, array $savedThreads, bool $isAdmin): array
{
    $threads = [];
    $savedById = array_column($savedThreads, null, 'id');
    foreach ((array) ($input['threads'] ?? []) as $item) {
        if (!is_array($item)) {
            continue;
        }
        $body = trim((string) ($item['body'] ?? ''));
        if ($body === '') {
            continue;
        }
        $subject = (string) ($item['subject'] ?? '');
        $status = (string) ($item['status'] ?? '');
        $id = mb_substr((string) ($item['id'] ?? ''), 0, 64);
        $saved = $savedById[$id] ?? [];
        $replies = [];
        foreach (array_slice((array) ($isAdmin ? ($item['replies'] ?? []) : ($saved['replies'] ?? [])), 0, 100) as $reply) {
            if (!is_array($reply) || trim((string) ($reply['body'] ?? '')) === '') {
                continue;
            }
            $replies[] = [
                'author' => 'ryan',
                'body' => mb_substr(trim((string) $reply['body']), 0, 1200),
                'createdAt' => mb_substr((string) ($reply['createdAt'] ?? gmdate('c')), 0, 40),
                'resolved' => (bool) ($reply['resolved'] ?? false),
            ];
        }
        $threads[] = [
            'id' => $id,
            'subject' => $subject === 'preview' ? 'preview' : 'section',
            'subjectId' => mb_substr((string) ($item['subjectId'] ?? ''), 0, 80),
            'author' => 'client',
            'displayName' => mb_substr(trim((string) ($item['displayName'] ?? '')), 0, 40),
            'body' => mb_substr($body, 0, 1200),
            'status' => in_array($status, ['interested', 'question', 'maybe_later'], true) ? $status : '',
            'createdAt' => $saved['createdAt'] ?? gmdate('c'),
            'replies' => $replies,
            'resolved' => (bool) ($isAdmin ? ($item['resolved'] ?? false) : ($saved['resolved'] ?? false)),
        ];
        if (count($threads) >= 100) {
            break;
        }
    }
    return $threads;
}

function normalize_pins(array $input): array
{
    $pins = [];
    foreach ((array) ($input['pins'] ?? []) as $item) {
        if (!is_array($item)) {
            continue;
        }
        $x = (float) ($item['x'] ?? -1);
        $y = (float) ($item['y'] ?? -1);
        if ($x < 0 || $x > 1 || $y < 0 || $y > 1) {
            continue;
        }
        $pins[] = [
            'id' => mb_substr((string) ($item['id'] ?? ''), 0, 64),
            'number' => count($pins) + 1,
            'x' => $x,
            'y' => $y,
            'createdAt' => gmdate('c'),
        ];
    }
    return array_slice($pins, 0, 100);
}

function normalize_doodles(array $input): array
{
    $doodles = [];
    foreach ((array) ($input['doodles'] ?? []) as $item) {
        if (!is_array($item)) {
            continue;
        }
        $points = [];
        foreach ((array) ($item['points'] ?? []) as $point) {
            if (!is_array($point)) {
                continue;
            }
            $x = (float) ($point['x'] ?? -1);
            $y = (float) ($point['y'] ?? -1);
            if ($x < 0 || $x > 1 || $y < 0 || $y > 1) {
                continue;
            }
            $points[] = ['x' => $x, 'y' => $y];
        }
        if (count($points) < 2) {
            continue;
        }
        $doodles[] = [
            'id' => mb_substr((string) ($item['id'] ?? ''), 0, 64),
            'targetId' => mb_substr((string) ($item['targetId'] ?? ''), 0, 80),
            'surfaceWidth' => isset($item['surfaceWidth']) && is_numeric($item['surfaceWidth'])
                && (float) $item['surfaceWidth'] >= 100 && (float) $item['surfaceWidth'] <= 2000
                ? (float) $item['surfaceWidth'] : null,
            'points' => array_slice($points, 0, 800),
            'createdAt' => gmdate('c'),
        ];
    }
    return array_slice($doodles, 0, 80);
}

function load_state(PDO $database): array
{
    $statement = $database->prepare('SELECT state_json, revision, updated_at FROM shared_state WHERE proposal_id = :id');
    $statement->execute(['id' => PROPOSAL_ID]);
    $row = $statement->fetch();

    if (!is_array($row)) {
        return [
            'state' => [
                'selections' => [
                    'baseSelected' => true,
                    'oneTimeOptionIds' => [],
                    'recurringOptionIds' => [],
                    'sectionFeedback' => [],
                    'displayName' => '',
                    'updatedAt' => gmdate('c'),
                ],
                'threads' => [],
                'pins' => [],
                'doodles' => [],
            ],
            'revision' => 1,
        ];
    }

    return [
        'state' => json_decode((string) $row['state_json'], true) ?: [],
        'revision' => (int) $row['revision'],
    ];
}

function save_state(PDO $database, array $state): int
{
    $json = json_encode($state, JSON_UNESCAPED_SLASHES);
    if ($json === false) {
        send_json(500, ['error' => 'Could not encode state.']);
    }

    $statement = $database->prepare(
        'INSERT INTO shared_state (proposal_id, state_json, revision, updated_at)
         VALUES (:id, :state_json, 2, :updated_at)
         ON CONFLICT(proposal_id) DO UPDATE SET
           state_json = excluded.state_json,
           revision = shared_state.revision + 1,
           updated_at = excluded.updated_at
         RETURNING revision'
    );
    $statement->execute([
        'id' => PROPOSAL_ID,
        'state_json' => $json,
        'updated_at' => time(),
    ]);
    $revision = (int) $statement->fetchColumn();
    $statement->closeCursor();
    $database->exec('COMMIT');

    return $revision;
}

function send_admin_email(array $snapshot): void
{
    $name = (string) ($snapshot['displayName'] ?? '');
    $subject = 'Southern Star proposal feedback from ' . ($name !== '' ? $name : 'the client');
    $text = 'A response was submitted to the Southern Star proposal.' . PHP_EOL . PHP_EOL .
        'Submitted at: ' . $snapshot['submittedAt'] . PHP_EOL .
        'Submitted by: ' . ($name !== '' ? $name : 'Not provided') . PHP_EOL . PHP_EOL .
        'Open the review screen to reply: ' . ($_SERVER['HTTP_ORIGIN'] ?? 'https://dashwood.net') . '/proposal/review/' . PHP_EOL . PHP_EOL .
        'Snapshot:' . PHP_EOL . json_encode($snapshot['state'] ?? [], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

    @mail('ryan@dashwood.net', $subject, $text, 'From: Portfolio <ryan@dashwood.net>');
}

function handle_get(array $proposal): never
{
    $database = bootstrap();
    $expiresAt = $proposal['expires_at'] === null ? null : (int) $proposal['expires_at'];
    $isExpired = $expiresAt !== null && $expiresAt < time();
    if ($isExpired || $proposal['status'] === 'revoked') {
        send_json(410, ['error' => 'This proposal link is no longer available.']);
    }

    $loaded = load_state($database);
    send_json(200, [
        'configVersion' => (int) $proposal['config_version'],
        'status' => $proposal['status'],
        'isExpired' => $isExpired,
        'state' => $loaded['state'],
        'revision' => $loaded['revision'],
    ]);
}

function handle_put(array $proposal, bool $isAdmin = false): never
{
    $database = bootstrap();
    if ($proposal['status'] === 'revoked') {
        send_json(410, ['error' => 'This proposal link is no longer available.']);
    }
    if ($proposal['status'] === 'read_only') {
        send_json(423, ['error' => 'This proposal is read-only.']);
    }
    $expiresAt = $proposal['expires_at'] === null ? null : (int) $proposal['expires_at'];
    if ($expiresAt !== null && $expiresAt < time()) {
        send_json(410, ['error' => 'This proposal link has expired.']);
    }

    $data = read_json_body();
    if (!isset($data['revision'])) {
        send_json(428, ['error' => 'Revision required.']);
    }

    $database->exec('BEGIN IMMEDIATE');
    $loaded = load_state($database);
    if ((int) $data['revision'] !== $loaded['revision']) {
        $database->exec('ROLLBACK');
        send_json(409, ['error' => 'Saved elsewhere. Refresh to get the latest version.', 'revision' => $loaded['revision']]);
    }

    $state = [
        'selections' => normalize_state((array) ($data['state']['selections'] ?? $data['selections'] ?? [])),
        'threads' => normalize_threads((array) ($data['state'] ?? []), $loaded['state']['threads'], $isAdmin),
        'pins' => normalize_pins((array) ($data['state'] ?? [])),
        'doodles' => normalize_doodles((array) ($data['state'] ?? [])),
    ];
    $revision = save_state($database, $state);
    send_json(200, ['state' => $state, 'revision' => $revision]);
}

function handle_review(array $proposal): never
{
    $database = bootstrap();
    $loaded = load_state($database);

    $statement = $database->prepare(
        'SELECT state_json, config_version, submitted_at FROM submissions
         WHERE proposal_id = :proposal_id ORDER BY submitted_at DESC LIMIT 20'
    );
    $statement->execute(['proposal_id' => PROPOSAL_ID]);
    $submissions = [];
    foreach ($statement->fetchAll() as $row) {
        $snapshot = json_decode((string) $row['state_json'], true);
        if (is_array($snapshot)) {
            $submissions[] = $snapshot;
        }
    }

    send_json(200, [
        'configVersion' => (int) $proposal['config_version'],
        'status' => $proposal['status'],
        'isExpired' => $proposal['expires_at'] !== null && (int) $proposal['expires_at'] < time(),
        'state' => $loaded['state'],
        'revision' => $loaded['revision'],
        'submissions' => $submissions,
        'clientToken' => tokens_match((string) $proposal['client_token_hash'], hash_token_value('client'))
            ? hash_token_value('client') : null,
    ]);
}

function handle_post(array $proposal): never
{
    $database = bootstrap();
    if ($proposal['status'] !== 'active') {
        send_json(423, ['error' => 'This proposal cannot receive feedback right now.']);
    }
    $expiresAt = $proposal['expires_at'] === null ? null : (int) $proposal['expires_at'];
    if ($expiresAt !== null && $expiresAt < time()) {
        send_json(410, ['error' => 'This proposal link has expired.']);
    }

    $data = read_json_body();
    $loaded = load_state($database);
    $submittedAt = gmdate('c');
    $snapshot = [
        'id' => 'response-' . bin2hex(random_bytes(8)),
        'submittedAt' => $submittedAt,
        'displayName' => mb_substr(trim((string) ($data['displayName'] ?? '')), 0, 40),
        'state' => $loaded['state'],
        'configVersion' => (int) $proposal['config_version'],
    ];

    $insert = $database->prepare(
        'INSERT INTO submissions (id, proposal_id, state_json, config_version, submitted_at, email_status)
         VALUES (:id, :proposal_id, :state_json, :config_version, :submitted_at, "pending")'
    );
    $insert->execute([
        'id' => $snapshot['id'],
        'proposal_id' => PROPOSAL_ID,
        'state_json' => json_encode($snapshot, JSON_UNESCAPED_SLASHES),
        'config_version' => $snapshot['configVersion'],
        'submitted_at' => time(),
    ]);

    send_admin_email($snapshot);
    $update = $database->prepare('UPDATE submissions SET email_status = "sent" WHERE id = :id');
    $update->execute(['id' => $snapshot['id']]);

    send_json(200, ['snapshot' => $snapshot, 'message' => 'Feedback sent to Ryan.']);
}

function handle_admin(array $proposal): never
{
    $database = bootstrap();
    parse_str(parse_url((string) ($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_QUERY) ?: '', $query);
    $action = (string) ($query['action'] ?? '');
    $now = time();

    if ($action === 'set_status') {
        $data = read_json_body();
        $status = (string) ($data['status'] ?? '');
        if (!in_array($status, ['active', 'read_only', 'revoked'], true)) {
            send_json(422, ['error' => 'Invalid status.']);
        }
        $statement = $database->prepare('UPDATE proposals SET status = :status, updated_at = :updated_at WHERE id = :id');
        $statement->execute(['status' => $status, 'updated_at' => $now, 'id' => PROPOSAL_ID]);
        send_json(200, ['status' => $status]);
    }

    if ($action === 'set_expiry') {
        $data = read_json_body();
        $expiresAt = $data['expiresAt'] === null ? null : strtotime((string) $data['expiresAt']);
        if ($expiresAt === false) {
            send_json(422, ['error' => 'Invalid expiry.']);
        }
        $statement = $database->prepare('UPDATE proposals SET expires_at = :expires_at, updated_at = :updated_at WHERE id = :id');
        $statement->execute([
            'expires_at' => $expiresAt,
            'updated_at' => $now,
            'id' => PROPOSAL_ID,
        ]);
        send_json(200, ['expiresAt' => $expiresAt === null ? null : gmdate('c', $expiresAt)]);
    }

    send_json(422, ['error' => 'Unsupported admin action.']);
}

function main(): void
{
    $path = request_path();
    $method = method();
    parse_str(parse_url((string) ($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_QUERY) ?: '', $query);
    $clientToken = (string) ($query['token'] ?? ($_SERVER['HTTP_X_PROPOSAL_TOKEN'] ?? ''));
    $adminToken = (string) ($query['admin'] ?? ($_SERVER['HTTP_X_PROPOSAL_ADMIN'] ?? ''));

    $proposal = find_proposal(bootstrap(), $clientToken, $adminToken);
    if ($proposal === null) {
        send_json(404, ['error' => 'Proposal not found.']);
    }

    if ($path === '/proposal/api.php' || $path === '/proposal/api.php/') {
        if ($method === 'GET') {
            handle_get($proposal);
        }
        if ($method === 'PUT') {
            handle_put($proposal, tokens_match((string) $proposal['admin_token_hash'], $adminToken));
        }
        if ($method === 'POST') {
            handle_post($proposal);
        }
    }

    if (in_array($path, ['/proposal/api.php/admin', '/proposal/api.php/admin/'], true)
        && $method === 'POST' && tokens_match((string) $proposal['admin_token_hash'], $adminToken)) {
        handle_admin($proposal);
    }

    if (
        in_array($path, ['/proposal/api.php/review', '/proposal/api.php/review/'], true)
        && tokens_match((string) $proposal['admin_token_hash'], $adminToken)
    ) {
        if ($method === 'GET') {
            handle_review($proposal);
        }
        if ($method === 'PUT') {
            handle_put($proposal, true);
        }
    }

    send_json(404, ['error' => 'Not found.']);
}

if (method() === 'OPTIONS') {
    header('Allow: GET, POST, PUT, OPTIONS');
    header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Proposal-Token, X-Proposal-Admin');
    http_response_code(204);
    exit;
}

main();
