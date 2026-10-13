<?php
declare(strict_types=1);

/**
 * SocialFlow Panel - IndianSMM Background Retry Worker
 * 
 * Standalone background job daemon / cron runner that automatically retries
 * failed API order submissions with exponential backoff for transient connectivity issues.
 * 
 * Usage:
 *   # Run once via Cron (e.g. * * * * *):
 *   php IndianSMMBackgroundWorker.php --once
 * 
 *   # Run continuously as background daemon:
 *   php IndianSMMBackgroundWorker.php --daemon --interval=5
 */

require_once __DIR__ . '/IndianSMMService.php';

// CLI Environment Check
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    echo "This script must be run from the command line interface.\n";
    exit(1);
}

$shortopts = "od::i::b::h";
$longopts  = ["once", "daemon", "interval::", "batch::", "help"];
$options = getopt($shortopts, $longopts);

if (isset($options['h']) || isset($options['help'])) {
    echo "SocialFlow IndianSMM Background Retry Worker\n";
    echo "Options:\n";
    echo "  --once               Process currently due retries once and exit\n";
    echo "  --daemon             Run continuously in loop\n";
    echo "  --interval=N         Seconds to sleep between loop iterations (default: 5)\n";
    echo "  --batch=N            Max orders to process per batch (default: 20)\n";
    exit(0);
}

$isDaemon = isset($options['daemon']);
$interval = max(1, (int)($options['interval'] ?? 5));
$batchSize = max(1, (int)($options['batch'] ?? 20));

// Connect to database if credentials exist
$pdo = null;
try {
    $dbHost = getenv('DB_HOST') ?: '127.0.0.1';
    $dbPort = getenv('DB_PORT') ?: '3306';
    $dbName = getenv('DB_NAME') ?: 'socialflow_panel';
    $dbUser = getenv('DB_USER') ?: 'socialflow';
    $dbPass = getenv('DB_PASS') ?: '';

    $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 5,
    ]);
    echo "[" . date('Y-m-d H:i:s') . "] Connected to MariaDB database '{$dbName}'.\n";
} catch (\Throwable $e) {
    echo "[" . date('Y-m-d H:i:s') . "] Running in standalone mode without active PDO ({$e->getMessage()}).\n";
}

$service = new IndianSMMService(
    apiKey: null,
    apiUrl: null,
    pdo: $pdo,
    logger: function(string $level, string $msg, array $ctx) {
        echo sprintf("[%s] [%s] %s %s\n", date('Y-m-d H:i:s'), strtoupper($level), $msg, !empty($ctx) ? json_encode($ctx) : '');
    }
);

echo "[" . date('Y-m-d H:i:s') . "] Initialized IndianSMM Background Retry Worker (Batch: {$batchSize}).\n";

$running = true;
if (function_exists('pcntl_signal')) {
    pcntl_signal(SIGTERM, function() use (&$running) { $running = false; });
    pcntl_signal(SIGINT, function() use (&$running) { $running = false; });
}

do {
    if (function_exists('pcntl_signal_dispatch')) {
        pcntl_signal_dispatch();
    }

    try {
        if ($pdo) {
            $stats = $service->getRetryQueueStats();
            echo sprintf(
                "[%s] Queue Stats: Pending=%d, Retrying=%d, Succeeded=%d, PermFailed=%d\n",
                date('H:i:s'),
                $stats['pending'],
                $stats['processing'],
                $stats['succeeded'],
                $stats['permanently_failed']
            );

            if ($stats['pending'] > 0) {
                $result = $service->processFailedOrderRetries($batchSize);
                echo sprintf(
                    "[%s] Processed %d due retries: Succeeded=%d, Rescheduled=%d, PermFailed=%d\n",
                    date('H:i:s'),
                    $result['processed'],
                    $result['succeeded'],
                    $result['rescheduled'],
                    $result['permanently_failed']
                );
                foreach ($result['details'] as $detail) {
                    echo "  -> {$detail}\n";
                }
            }
        } else {
            echo "[" . date('H:i:s') . "] Standalone worker idle cycle. (Configure DB_HOST & DB_NAME for live MariaDB processing)\n";
        }
    } catch (\Throwable $e) {
        echo "[" . date('H:i:s') . "] Worker iteration error: " . $e->getMessage() . "\n";
    }

    if (!$isDaemon) {
        break;
    }

    sleep($interval);
} while ($running);

echo "[" . date('Y-m-d H:i:s') . "] Worker shutdown gracefully.\n";
exit(0);
