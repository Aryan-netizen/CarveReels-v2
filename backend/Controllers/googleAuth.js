const axios = require('axios');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/UserModel");
const FoodPartnerModel = require("../Models/FoodPartnerModel");

/* POST Google Authentication API for Users. */
exports.googleAuthUser = async (req, res, next) => {
    const { email, name, picture } = req.body;
    try {
        let user = await UserModel.findOne({ email });

        if (!user) {
            user = await UserModel.create({
                name,
                email,
                image: picture,
            });
        }
        
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )
        
        res.status(200).json({
            message: "Login Success",
            success: true,
            jwtToken,
            email,
            name: user.name,
            role: 'user'
        })
    } catch (err) {
        console.error('Google Auth Error:', err.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        })
    }
};

/* POST Google Authentication API for Food Partners. */
exports.googleAuthFoodPartner = async (req, res, next) => {
    const { email, name, picture } = req.body;
    try {
        let foodPartner = await FoodPartnerModel.findOne({ email });

        if (!foodPartner) {
            foodPartner = await FoodPartnerModel.create({
                name,
                email,
                image: picture,
                businessName: name
            });
        }
        
        const jwtToken = jwt.sign(
            { email: foodPartner.email, _id: foodPartner._id, role: 'foodpartner' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )
        
        res.status(200).json({
            message: "Login Success",
            success: true,
            jwtToken,
            email,
            name: foodPartner.name,
            role: 'foodpartner'
        })
    } catch (err) {
        console.error('Google Auth Error:', err.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        })
    }
};