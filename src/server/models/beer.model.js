const mongoose = require('mongoose');

const modelName = `${process.env.NODE_ENV}_Beer`;

const BeerSchema = new mongoose.Schema({
    publisherId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    brewedBy: String,
    type: String,
    ibu: {
        type: Number,
        min: 0,
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
    },
    calories: {
        type: Number,
        min: 0,
    },
    comments: String,
}, { timestamps: true });

const BeerModel = mongoose.model(modelName, BeerSchema);
module.exports = BeerModel;
