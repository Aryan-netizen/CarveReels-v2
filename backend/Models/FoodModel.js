const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartners"
    },
    userName: {
        type: String,
    },
    userImage: {
        type: String,
    },
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "menu"
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [{
        user: String,
        text: String,
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const foodModel = mongoose.model("food", foodSchema);

module.exports = foodModel;