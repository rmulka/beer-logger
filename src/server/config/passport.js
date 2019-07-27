const passport = require('passport');
const LocalStrategy = require('passport-local');
const usersModel = require('../models/user.model');
const DbClient = require('../db/dbClient');

const dbClient = new DbClient(usersModel);

passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]',
}, async (email, password, done) => {
    const user = await dbClient.findAll({ email });
    if (!user.length || !user[0].validPassword(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
    }
    return done(null, user[0]);
}));
