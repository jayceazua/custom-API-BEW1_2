const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    createdAt: {type: Date},
    updatedAt: {type: Date},
    password: {type: String, select: false, maxLength: 20},
    username: {type: String, required: true, maxLength: 16},
    admin: { type: Boolean, default: false },
    banned: { type: Boolean, default: false },
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment', required: true}],
});

UserSchema.pre('save', function (next) {
    // SET createdAt AND updatedAt
    const now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }

    // ENCRYPT PASSWORD
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, (err, isMatch) => {
            if (err) reject(error);
            else resolve(isMatch);
        });
    });
};

UserSchema.methods.compareUsername = function (username, done) {
    bcrypt.compare(username, this.username, (err, isMatch) => {
        done(err, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
