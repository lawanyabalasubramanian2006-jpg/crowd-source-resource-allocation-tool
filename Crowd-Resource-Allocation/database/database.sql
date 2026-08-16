-- =====================================================
-- CROWD-SOURCED RESOURCE ALLOCATION TOOL
-- DATABASE
-- =====================================================

CREATE DATABASE IF NOT EXISTS crowd_resource_allocation;

USE crowd_resource_allocation;


-- =====================================================
-- REMOVE OLD TABLES
-- =====================================================

DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS users;


-- =====================================================
-- 1. USERS TABLE
-- =====================================================

CREATE TABLE users (

    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    role ENUM('member', 'admin') NOT NULL DEFAULT 'member',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB;


-- =====================================================
-- 2. RESOURCES TABLE
-- =====================================================

CREATE TABLE resources (

    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    description TEXT,

    total_quantity INT NOT NULL DEFAULT 0,

    available_quantity INT NOT NULL DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (total_quantity >= 0),

    CHECK (available_quantity >= 0),

    CHECK (available_quantity <= total_quantity)

) ENGINE=InnoDB;


-- =====================================================
-- 3. REQUESTS TABLE
-- =====================================================

CREATE TABLE requests (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    resource_id INT NOT NULL,

    description TEXT NOT NULL,

    need_score INT NOT NULL,

    urgency_score INT NOT NULL,

    status ENUM(
        'Pending',
        'Allocated',
        'Rejected'
    ) NOT NULL DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_request_user

        FOREIGN KEY (user_id)

        REFERENCES users(id)

        ON DELETE CASCADE

        ON UPDATE CASCADE,

    CONSTRAINT fk_request_resource

        FOREIGN KEY (resource_id)

        REFERENCES resources(id)

        ON DELETE CASCADE

        ON UPDATE CASCADE,

    CHECK (need_score IN (30, 60, 100)),

    CHECK (urgency_score IN (30, 60, 100))

) ENGINE=InnoDB;


-- =====================================================
-- 4. VOTES TABLE
-- =====================================================

CREATE TABLE votes (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    request_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vote_user

        FOREIGN KEY (user_id)

        REFERENCES users(id)

        ON DELETE CASCADE

        ON UPDATE CASCADE,

    CONSTRAINT fk_vote_request

        FOREIGN KEY (request_id)

        REFERENCES requests(id)

        ON DELETE CASCADE

        ON UPDATE CASCADE,

    -- ONE USER CAN VOTE ONLY ONCE

    UNIQUE KEY unique_user_vote (user_id)

) ENGINE=InnoDB;


-- =====================================================
-- SAMPLE RESOURCES
-- =====================================================

INSERT INTO resources
(
    name,
    description,
    total_quantity,
    available_quantity
)
VALUES

(
    'Laptop',
    'Laptop computer for educational and community use',
    10,
    10
),

(
    'Tablet',
    'Tablet device for educational and community use',
    5,
    5
),

(
    'Desktop Computer',
    'Desktop computer for community use',
    8,
    8
);


-- =====================================================
-- SAMPLE ADMIN USER
-- =====================================================
--
-- Do NOT put a plain-text password here.
-- Create the admin/member accounts using the PHP
-- setup script with password_hash().
--
-- =====================================================