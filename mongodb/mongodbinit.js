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

if (db.users.countDocuments() === 1) {

    const user = db.users.insertOne({
        name: "John1",
        email: "john1@email.com"
    });

    db.productInventory.insertOne({
        productName: "Laptop",
        price: 1000,
        inStock: true,
        dateAdded: new Date(),
        description: "GISP laptop",
        addedByUserId: user.insertedId
    });

}

db.createCollection("sensor_data", {
    timeseries: {
        timeField: "timestamp",
        metaField: "deviceId",
        granularity: "seconds"
    },
    expireAfterSeconds: 3600   // ⏱️ 1 hour
});

db.sensor_data.insertOne({
    timestamp: new Date(),
    deviceId: "sensor-1",
    temperature: 25.8
});

db.sensor_data.insertMany([
    { timestamp: new Date(), deviceId: "sensor-1", temperature: 25.8 },
    { timestamp: new Date(), deviceId: "sensor-2", temperature: 23.4 },
    { timestamp: new Date(), deviceId: "sensor-3", temperature: 27.1 },
    { timestamp: new Date(), deviceId: "sensor-4", temperature: 22.9 }
]);

print("MongoDB initialization completed.");
