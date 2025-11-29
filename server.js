require("dotenv").config();

const path = require('path');
const express = require('express');
const connectToDatabase = require("./db");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/submit-booking", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("booking_requests");

        const data = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone || null,
            event_date: req.body.eventDate,
            message: req.body.message,
            timestamp: new Date()
        };

        await collection.insertOne(data);

        res.json({ success: true, message: "Booking request submitted!" });
    } catch (err) {
        console.error("Booking error:", err);
        res.status(500).json({ success: false, error: "Database error." });
    }
});

app.post("/submit-song", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("suggestion_requests");

        const data = {
            name: req.body.name,
            song: req.body.song,
            artist: req.body.artist,
            notes: req.body.notes || "",
            timestamp: new Date()
        };

        await collection.insertOne(data);

        res.json({ success: true, message: "Suggestion submitted!" });
    } catch (err) {
        console.error("Suggestion error:", err);
        res.status(500).json({ success: false, error: "Database error." });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
