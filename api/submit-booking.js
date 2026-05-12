const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
});

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, phone, eventDate, venueName, message, songRequests } = req.body;

    const emailContent = `
        <h2>New Booking Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Event Date:</strong> ${eventDate || 'Not provided'}</p>
        <p><strong>Venue Name:</strong> ${venueName || 'Not provided'}</p>
        <p><strong>Event Details:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <p><strong>Song Requests:</strong></p>
        <p>${(songRequests || 'None').replace(/\n/g, '<br>')}</p>
    `;

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            subject: 'New Booking Request from Nick Squared',
            html: emailContent
        });
        // Redirect back to your GitHub Pages success page
        res.redirect(302, 'https://nrrorton.github.io/band_site/success.html');
    } catch (err) {
        console.error('Email error:', err);
        res.status(500).json({ error: 'Failed to send email.' });
    }
}