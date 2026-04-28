const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require("../Models/UserModel");

/* POST Google Authentication API. */
exports.googleAuth = async (req, res, next) => {
    const { email, name, picture } = req.body;
    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                image: picture,
            });
        }
        
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )
        
        res.status(200).json({
            message: "Login Success",
            success: true,
            jwtToken,
            email,
            name: user.name
        })
    } catch (err) {
        console.error('Google Auth Error:', err.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        })
    }
};