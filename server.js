const express = require('express');
const app = express();
const port = 3000;
const password = 'yourPassword';

app.get('/yourJavascriptFile.js', (req, res) => {
    if (req.query.password === password) {
        res.sendFile(__dirname + '/yourJavascriptFile.js');
    } else {
        res.status(403).send('Forbidden');
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is up and running at http://localhost:${port}`);
});

