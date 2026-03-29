require("dotenv").config();

const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');
const connectToDatabase = require("./db");

const app = express();
const port = process.env.PORT || 3000;

// Setup email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
});

// Helper function to send email
async function sendEmail(subject, htmlContent) {
    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            subject: subject,
            html: htmlContent
        });
        console.log("Email sent successfully");
    } catch (err) {
        console.error("Email sending error:", err);
        throw err;
    }
}

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
            venue_name: req.body.venueName || null,
            message: req.body.message,
            song_requests: req.body.songRequests || "",
            timestamp: new Date()
        };

        // Save to database
        await collection.insertOne(data);

        // Send email
        const emailContent = `
            <h2>New Booking Request</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
            <p><strong>Event Date:</strong> ${data.event_date || 'Not provided'}</p>
            <p><strong>Venue Name:</strong> ${data.venue_name || 'Not provided'}</p>
            <p><strong>Event Details:</strong></p>
            <p>${data.message.replace(/\n/g, '<br>')}</p>
            <p><strong>Song Requests:</strong></p>
            <p>${data.song_requests.replace(/\n/g, '<br>') || 'None'}</p>
        `;

        await sendEmail("New Booking Request from Nick Squared", emailContent);

        return res.redirect('/success.html');
    } catch (err) {
        console.error("Booking error:", err);
        res.status(500).json({ success: false, error: "Error processing booking." });
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

        // Save to database
        await collection.insertOne(data);

        // Send email
        const emailContent = `
            <h2>New Song Suggestion</h2>
            <p><strong>From:</strong> ${data.name}</p>
            <p><strong>Song:</strong> ${data.song}</p>
            <p><strong>Artist:</strong> ${data.artist}</p>
            <p><strong>Notes:</strong></p>
            <p>${data.notes.replace(/\n/g, '<br>') || 'None'}</p>
        `;

        await sendEmail("New Song Suggestion for Nick Squared", emailContent);

        return res.redirect('/success.html');
    } catch (err) {
        console.error("Suggestion error:", err);
        res.status(500).json({ success: false, error: "Error processing suggestion." });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
