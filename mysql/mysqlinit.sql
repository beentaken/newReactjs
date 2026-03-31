-- 1. Setup Database
-- In MySQL, 'IF NOT EXISTS' is built directly into the CREATE DATABASE command
CREATE DATABASE IF NOT EXISTS TestDB;
USE TestDB;

-- 2. Create Users Table
-- 'IDENTITY(1,1)' becomes 'AUTO_INCREMENT'
-- 'NVARCHAR' is usually just 'VARCHAR' with a UTF8MB4 charset
CREATE TABLE IF NOT EXISTS Users (
    UserID INT NOT NULL AUTO_INCREMENT,
    Name   VARCHAR(100) NOT NULL,
    Email  VARCHAR(255) NOT NULL,
    PRIMARY KEY (UserID),
    UNIQUE (Email)
) ENGINE=InnoDB;

-- 3. Create ProductInventory Table
-- 'GETDATE()' becomes 'CURRENT_DATE' or 'NOW()'
-- 'BIT' exists, but 'TINYINT(1)' is more common for booleans in MySQL
-- 'NVARCHAR(MAX)' becomes 'LONGTEXT' or 'TEXT'
CREATE TABLE IF NOT EXISTS ProductInventory (
    ProductID   INT NOT NULL AUTO_INCREMENT,
    ProductName VARCHAR(255) NOT NULL,
    Price       DECIMAL(10, 2) NOT NULL,
    InStock     TINYINT(1) DEFAULT 1,
    DateAdded   DATE DEFAULT (CURRENT_DATE),
    Description TEXT,
    AddedByUserID INT,
    
    PRIMARY KEY (ProductID),
    -- Foreign Key Syntax
    CONSTRAINT FK_UserProduct FOREIGN KEY (AddedByUserID) 
        REFERENCES Users(UserID) 
        ON DELETE SET NULL
) ENGINE=InnoDB;