CREATE DATABASE IF NOT EXISTS website_monitor;

USE website_monitor;


-- Websites being monitored
CREATE TABLE IF NOT EXISTS websites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(500) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Each monitoring run
CREATE TABLE IF NOT EXISTS monitoring_runs (
    id INT AUTO_INCREMENT PRIMARY KEY,

    sequential_time DECIMAL(10,4) NOT NULL,

    concurrent_time DECIMAL(10,4) NOT NULL,

    speedup DECIMAL(10,4) NOT NULL,

    improvement DECIMAL(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Result for each website
CREATE TABLE IF NOT EXISTS monitoring_results (
    id INT AUTO_INCREMENT PRIMARY KEY,

    run_id INT NOT NULL,

    website_id INT NOT NULL,

    http_status INT,

    response_time DECIMAL(10,4),

    availability VARCHAR(20),

    ssl_status VARCHAR(20),

    page_title VARCHAR(500),

    error_message TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (run_id)
        REFERENCES monitoring_runs(id)
        ON DELETE CASCADE,

    FOREIGN KEY (website_id)
        REFERENCES websites(id)
        ON DELETE CASCADE
);