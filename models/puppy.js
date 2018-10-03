const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PuppySchema = new Schema({
    name: { type: String },
    gender: { type: String },
    breed: { type: String },
    age: { type: Number }
});


PuppySchema.pre('save', (next) => {
    // SET createdAt AND updatedAt
    const now = new Date()
    this.updatedAt = now
    if (!this.createdAt) {
        this.createdAt = now
    };
    next();
});

let Puppy = mongoose.model('Puppy', PuppySchema);

module.exports = Puppy;
