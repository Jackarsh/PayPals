-- ================================================
-- PayPals Database Schema
-- ================================================

CREATE DATABASE IF NOT EXISTS paypals_db;
USE paypals_db;

-- ================================================
-- USERS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL
);

-- ================================================
-- GROUPS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS groups (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

-- ================================================
-- GROUP MEMBERS TABLE (MANY-TO-MANY)
-- ================================================
CREATE TABLE IF NOT EXISTS group_members (
    group_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,

    PRIMARY KEY (group_id, user_id),

    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ================================================
-- EXPENSES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    group_id BIGINT NOT NULL,
    paid_by_user_id BIGINT NOT NULL,
    amount DOUBLE NOT NULL,
    description VARCHAR(255),
    created_at DATETIME,
    equal_split BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (paid_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);
