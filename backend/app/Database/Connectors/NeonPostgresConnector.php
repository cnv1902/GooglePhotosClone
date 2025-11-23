<?php

namespace App\Database\Connectors;

use Illuminate\Database\Connectors\PostgresConnector;
use PDO;

class NeonPostgresConnector extends PostgresConnector
{
    /**
     * Create a DSN string from a configuration.
     *
     * @param  array  $config
     * @return string
     */
    protected function getDsn(array $config)
    {
        $host = $config['host'] ?? '';
        $endpointId = $this->extractEndpointId($host, $config);
        
        // Build base DSN components
        $dsn = sprintf(
            'pgsql:host=%s;port=%s;dbname=%s',
            $host,
            $config['port'] ?? '5432',
            $config['database'] ?? ''
        );
        
        // Add charset if specified
        if (isset($config['charset'])) {
            $dsn .= ';client_encoding=' . $config['charset'];
        }
        
        // Add SSL mode
        if (isset($config['sslmode'])) {
            $dsn .= ';sslmode=' . $config['sslmode'];
        }
        
        // Add endpoint ID for Neon databases
        // Neon requires endpoint ID in the connection string
        // Store it for use in createConnection since PDO doesn't support it in DSN directly
        if ($endpointId && str_contains($host, 'neon.tech')) {
            $config['_neon_endpoint_id'] = $endpointId;
        }
        
        return $dsn;
    }
    
    /**
     * Extract endpoint ID from Neon hostname or config.
     *
     * @param  string  $host
     * @param  array  $config
     * @return string|null
     */
    protected function extractEndpointId($host, array $config)
    {
        $endpointId = null;
        
        // Check if this is a Neon database
        if (str_contains($host, 'neon.tech')) {
            // Extract endpoint ID from hostname
            // Format: ep-xxx-xxx-xxx.region.aws.neon.tech or ep-xxx-xxx-pooler.neon.tech
            // The endpoint ID is everything between 'ep-' and the first '.' or '-pooler'
            if (preg_match('/^(ep-[a-z0-9-]+?)(?:-pooler)?\./', $host, $matches)) {
                $endpointId = $matches[1];
            }
            
            // Also check if endpoint is in options (from DATABASE_URL parsing)
            if (!$endpointId && isset($config['options'])) {
                if (is_string($config['options'])) {
                    if (preg_match('/endpoint[=%3D]([a-z0-9-]+)/', urldecode($config['options']), $matches)) {
                        $endpointId = $matches[1];
                    }
                } elseif (is_array($config['options']) && isset($config['options']['endpoint'])) {
                    $endpointId = $config['options']['endpoint'];
                }
            }
        }
        
        return $endpointId;
    }
    
    /**
     * Create a new PDO connection.
     *
     * @param  string  $dsn
     * @param  array  $config
     * @param  array  $options
     * @return PDO
     */
    public function createConnection($dsn, array $config, array $options)
    {
        $host = $config['host'] ?? '';
        $endpointId = $config['_neon_endpoint_id'] ?? $this->extractEndpointId($host, $config);
        
        // For Neon databases, if we have endpoint ID, we need to pass it via connection string
        if ($endpointId && str_contains($host, 'neon.tech')) {
            // Try to append the endpoint to DSN options parameter
            // PostgreSQL PDO supports passing options via the DSN
            // Format: pgsql:...;options='endpoint=<endpoint-id>'
            $dsn .= ";options='endpoint=" . $endpointId . "'";
        }
        
        // Try standard PDO connection
        try {
            return parent::createConnection($dsn, $config, $options);
        } catch (\PDOException $e) {
            // If it still fails with endpoint ID error
            if (str_contains($host, 'neon.tech') && str_contains($e->getMessage(), 'Endpoint ID')) {
                throw new \PDOException(
                    "Neon database requires endpoint ID. Your libpq version may not support SNI. " .
                    "Please either:\n" .
                    "1. Use direct connection (non-pooler) in your .env: DB_HOST=ep-xxx-xxx.region.aws.neon.tech (without -pooler)\n" .
                    "2. Upgrade libpq to a version that supports SNI\n" .
                    "3. Add endpoint ID manually to DATABASE_URL: ?options=endpoint%3D" . ($endpointId ?? 'divine-sea-a1x75m53'),
                    $e->getCode(),
                    $e
                );
            }
            throw $e;
        }
    }
    
    /**
     * Get the options array, ensuring it's always an array.
     *
     * @param  array  $config
     * @return array
     */
    public function getOptions(array $config)
    {
        // Remove 'options' from config if it's a string (from DATABASE_URL parsing)
        if (isset($config['options']) && is_string($config['options'])) {
            unset($config['options']);
        }
        
        return parent::getOptions($config);
    }
}

