const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodPartnerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    image: {
        type: String
    },
    businessName: {
        type: String,
    },
    bio: {
        type: String,
    },
    followers: {
        type: Number,
        default: 0
    },
    reelsCount: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const FoodPartnerModel = mongoose.model('foodpartners', FoodPartnerSchema);
module.exports = FoodPartnerModel;
