<?php

class DatabaseConnection
{
    // The database connection
    private static $connection;

    public function connectDatabase()
    {
        // Try and connect to the database
        if (!isset(self::$connection)) {
            // Load configuration as an array. Use the actual location of your configuration file
            $config = parse_ini_file("../../config/config.ini");
            self::$connection = new mysqli($config["database_hostname"], $config['database_username'], $config['database_password'], $config['database_name']);
        }

        // If connection was not successful, handle the error
        if (self::$connection === false) {
            // Handle error - notify administrator, log to a file, show an error screen, etc.
            return false;
        }
        return self::$connection;
    }

    public function query($query)
    {
        // Connect to the database
        $connection = $this->connectDatabase();

        // Query the database
        $result = $connection->query($query);

        return $result;
    }

    public function select($query)
    {
        $rows = array();
        $result = $this->query($query);
        if ($result === false) {
            return false;
        }
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
        return $rows;
    }

    public function error()
    {
        $connection = $this->connectDatabase();
        return $connection->error;
    }
}