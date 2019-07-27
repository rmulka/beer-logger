const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

const modelName = `${process.env.NODE_ENV}_User`;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/\S+@\S+\.\S+/],
        index: true,
    },
    name: {
        type: String,
        required: true,
    },
    bio: String,
    image: String,
    hash: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(
        password,
        this.salt,
        10000,
        512,
        'sha512',
    ).toString('hex');
};


UserSchema.methods.validPassword = function (password) {
    const hash = crypto.pbkdf2Sync(
        password,
        this.salt,
        10000,
        512,
        'sha512',
    ).toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: exp.getTime() / 1000,
    }, secret);
};

UserSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
    };
};

module.exports = mongoose.model(modelName, UserSchema);
