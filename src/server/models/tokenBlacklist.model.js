const mongoose = require('mongoose');

const modelName = `${process.env.NODE_ENV}_TokenBlacklist`;

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model(modelName, blacklistSchema);
