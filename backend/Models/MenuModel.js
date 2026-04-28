const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foodpartners',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['appetizer', 'main', 'dessert', 'beverage', 'other'],
        default: 'other'
    },
    available: {
        type: Boolean,
        default: true
    },
    preparationTime: {
        type: Number, // in minutes
        default: 30
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const MenuModel = mongoose.model('menu', menuItemSchema);
module.exports = MenuModel;
