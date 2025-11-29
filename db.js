// This file will handle the MongoDB connection

const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
        version: "1",
        strict: false,
        deprecationErrors: false,
    }
});

let db;

async function connectToDatabase() {
    if (db) return db;

    try {
        await client.connect();
        console.log("Connected to Cosmos DB (Mongo vCore)");
        db = client.db("band_site");      
        return db;
    } catch (err) {
        console.error("Database connection error:", err);
        throw err;
    }
}

module.exports = connectToDatabase;