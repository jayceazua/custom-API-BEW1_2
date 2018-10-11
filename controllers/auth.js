let Recaptcha = require('express-recaptcha');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
require('dotenv').config();

let recaptcha = new Recaptcha('6LciD0EUAAAAAMSM4b2xRawGOzSD0ke7mlaY-ZpQ', '6LciD0EUAAAAAH4H4CCH0EwKcfbDlQPdMUQe0SFO');


module.exports = (app) => {

  app.get('/current_user', (req, res) => {
      res.send(req.user);
  })


    // SIGN UP POST
    app.post('/sign-up/', async (req, res) => {
        // Create User and JWT
        // const user = new User(req.body);

        if (req.body.password !== req.body.password) {
            res.render('auth/reqister.handlebars', {error: "Passwords don't match"});
            return;
        }
        if (false && check_password) {
            //TODO: This
            res.render('auth/register.handlebars', {error: "Password insecure"});
            return;
        }

        recaptcha.verify(req, async function (error, data) {
            let user = await User.findOne({username: req.body.username}, 'username password')
            if (user) {
                return res.render('auth/register.handlebars', {error: "Username taken"});
            }

            if (error) {
                return res.render('auth/register.handlebars', {error: "Captcha failed"});
            }

            let userData = {username: req.body.username, password: req.body.password};
            let newUser = new User(userData);
            newUser = await newUser.save();

            let token = jwt.sign({
                _id: newUser._id,
                admin: newUser.admin,
                username: newUser.username
            }, process.env.SECRET, {
                expiresIn: "60 days"
            });
            res.cookie('nToken', token, {
                maxAge: 9000000,
                httpOnly: true
            });
            res.redirect('/login');
        });
    });

    // LOGOUT
    app.get('/logout', async (req, res) => {
        res.clearCookie('nToken');
        res.redirect('/');
    });

    // LOGIN FORM
    app.get('/login', async (req, res) => {
        let currentUser = req.user;

        res.render('auth/login.handlebars', {currentUser});
    });

    // LOGIN
    app.post('/login', async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        // Find this user name
        let user = await User.findOne({username}, 'username password');
        if (!user) {
            // User not found
            return res.render('auth/login.handlebars', {error: "Invalid username or password"});
        }

        // Check the password
        let isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('auth/login.handlebars', {error: "Invalid username or password"});
        }

        const token = jwt.sign(
            {
                _id: user._id,
                username: user.username,
                admin: user.admin,
                banned: user.banned,
            }, process.env.SECRET);
        //  { expiresIn: "60 days" }

        if (user.banned) {
            return res.redirect('/logout');
        }
        // Set a cookie and redirect to root
        res.cookie('nToken', token, {maxAge: 90000000000, httpOnly: true});
        res.redirect('/');
    });
};
