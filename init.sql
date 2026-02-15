-- 1. Setup Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'TestDB')
BEGIN
    CREATE DATABASE TestDB;
END
GO
USE TestDB;
GO

-- 2. Create Users Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        UserID INT PRIMARY KEY IDENTITY(1,1),
        Name   NVARCHAR(100) NOT NULL,
        Email  NVARCHAR(255) UNIQUE NOT NULL
    );
END
GO

-- 3. Create ProductInventory Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ProductInventory')
BEGIN
    CREATE TABLE ProductInventory (
        ProductID   INT PRIMARY KEY IDENTITY(1,1),
        ProductName NVARCHAR(255) NOT NULL,
        Price       DECIMAL(10, 2) NOT NULL,
        InStock     BIT DEFAULT 1,
        DateAdded   DATE DEFAULT GETDATE(),
        Description NVARCHAR(MAX),
        
        -- Optional: Link product to a User (Foreign Key)
        AddedByUserID INT FOREIGN KEY REFERENCES Users(UserID)
    );
END
GO