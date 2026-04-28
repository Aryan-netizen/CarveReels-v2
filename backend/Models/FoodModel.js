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
        ref: "users"
    },
    

})


const foodModel = mongoose.model("food", foodSchema);


module.exports = foodModel;