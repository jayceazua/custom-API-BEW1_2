const express = require('express');
const app = express();
const port = process.env.PORT ||  3000;
require('./database/mongo');


const puppies = require('./controllers/puppies');
// Routes - Middleware
app.use('/puppies', puppies);

app.listen(port, () => {
    console.log(`Puppies are coming on port: ${port}`);
})
