const path = require('path')
const express = require('express')

const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.get('/api', (req, res) => {
    res.send('ok');
});

app.post('/submit-booking', (req, res) => {
    console.log(req.body);
    res.json({ status: 'received' });
});

app.post('/submit-song', (req, res) => {
    console.log(req.body);
    res.json({ status: 'received' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
