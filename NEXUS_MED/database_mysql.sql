-- database.sql (Run this in phpMyAdmin or MySQL Workbench)
CREATE DATABASE IF NOT EXISTS nexusmed CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE nexusmed;

DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS medicines;
DROP TABLE IF EXISTS shops;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE medicines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    price INT NOT NULL,
    img VARCHAR(255) DEFAULT 'https://i.imgur.com/0L9aP8k.png'
) ENGINE=InnoDB;

CREATE TABLE shops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total INT NOT NULL,
    items_json TEXT NOT NULL,
    status ENUM('Paid','Processing','Delivered','Cancelled') DEFAULT 'Paid',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed Data
INSERT IGNORE INTO medicines (name, price) VALUES
('Dolo 650', 42),('Crocin Advance', 38),('Azithral 500', 118),
('Liv-52 Syrup', 165),('Neurobion Forte', 35),('Saridon', 45),
('Revital H', 299),('Calpol 650', 40),('Combiflam', 65),
('Vicks VapoRub', 89);

INSERT IGNORE INTO shops (name) VALUES
('Apollo Pharmacy'),('MedPlus'),('Guardian'),('Netmeds Store'),
('1mg Pharmacy'),('Pharmeasy'),('Wellness Forever'),('TrueMeds'),
('Reliance Medico'),('Healthkart');

-- Admin Account (mobile = 9999999999)
INSERT IGNORE INTO users (name, mobile) VALUES ('Admin', '9999999999');