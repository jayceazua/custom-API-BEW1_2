const express = require('express');
const app = express();
const port = 3000;
require('./database/mongo');

app.get('/', (req, res) => {
    res.send('Brochure/ Documentation...')
});

const puppies = require('./controllers/puppies');
// Routes - Middleware
app.use('/puppies', puppies);

app.listen(port, () => {
    console.log(`Puppies are coming on port: ${port}`);
});

module.exports = app
