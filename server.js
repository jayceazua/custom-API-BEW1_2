const express = require('express');
const Puppy = require('./models/puppy');
const puppies = require('./controllers/puppies');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const port = 3000;
require('./database/mongo');

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// override with POST having ?_method=DELETE & ?_method=PUT
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('_method'));
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.get('/', (req, res) => {
    Puppy.find({}).then((pups) => {
        res.json({pups})
    }).catch((err) => {
        res.send(err.message)
    })
});


// Routes - Middleware
app.use('/puppies', puppies);

module.exports = app.listen(port, () => {
    console.log(`Puppies are coming on port: ${port}`);
});
