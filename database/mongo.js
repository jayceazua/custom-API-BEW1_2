const mongoose = require('mongoose');
// Set a Mongoose Promise library
mongoose.Promise = global.Promise;
// MongoDB URI - could be in a config file4
let dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/custom_api';

mongoose.connect(dbURI, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
  console.log('Custom Puppy API BEW 1-2 MongoDB Connected.')
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection Error:'));
