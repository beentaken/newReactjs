// Switch / Create Database
db = db.getSiblingDB("TestDB");

// --------------------
// USERS COLLECTION
// --------------------
if (!db.getCollectionNames().includes("users")) {
    db.createCollection("users");
}

db.users.createIndex(
    { email: 1 },
    { unique: true }
);

// --------------------
// PRODUCT INVENTORY
// --------------------
if (!db.getCollectionNames().includes("productInventory")) {
    db.createCollection("productInventory");
}

db.productInventory.createIndex(
    { addedByUserId: 1 }
);

// --------------------
// INSERT SAMPLE DATA (only if empty)
// --------------------
if (db.users.countDocuments() === 0) {

    const user = db.users.insertOne({
        name: "John",
        email: "john@email.com"
    });

    db.productInventory.insertOne({
        productName: "Laptop",
        price: 1500,
        inStock: true,
        dateAdded: new Date(),
        description: "Gaming laptop",
        addedByUserId: user.insertedId
    });

}

print("MongoDB initialization completed.");
