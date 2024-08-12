const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let blockedWebsites = {};

app.post('/block', (req, res) => {
    const { url, duration } = req.body;
    const unblockTime = Date.now() + duration * 1000; // duration in seconds

    blockedWebsites[url] = unblockTime;
    res.status(200).send({ message: `Blocked ${url} for ${duration} seconds.` });
});

app.get('/blocked-websites', (req, res) => {
    const currentTime = Date.now();
    blockedWebsites = Object.fromEntries(
        Object.entries(blockedWebsites).filter(([_, time]) => time > currentTime)
    );
    res.send(blockedWebsites);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
