const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const FoodPartnerModel = require("../Models/FoodPartnerModel");


const signup = async (req, res) => {
    try {
        const { name, email, password, businessName } = req.body;
        console.log('Food Partner Signup request body:', { name, email, password, businessName });
        console.log('File:', req.file);
        
        // Validate inputs
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "name, email and password are required",
                success: false
            });
        }
        
        const foodPartner = await FoodPartnerModel.findOne({ email });
        if (foodPartner) {
            return res.status(409)
                .json({ message: 'Food Partner already exists, you can login', success: false });
        }
        
        let profileImage = null;
        if (req.file) {
            profileImage = req.file.path;
            console.log('Profile image URL:', profileImage);
        }
        
        const foodPartnerModel = new FoodPartnerModel({ 
            name, 
            email, 
            password,
            image: profileImage,
            businessName: businessName || name
        });
        
        foodPartnerModel.password = await bcrypt.hash(password, 10);
        await foodPartnerModel.save();
        res.status(201)
            .json({
                message: "Food Partner signup successfully",
                success: true
            })
    } catch (err) {
        console.error('Food Partner Signup error:', err);
        res.status(500)
            .json({
                message: "Internal server error",
                success: false,
                error: err.message
            })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const foodPartner = await FoodPartnerModel.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if (!foodPartner) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, foodPartner.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: foodPartner.email, _id: foodPartner._id, role: 'foodpartner' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                name: foodPartner.name,
                role: 'foodpartner'
            })
    } catch (err) {
        console.error('Food Partner Login error:', err);
        res.status(500)
            .json({
                message: "Internal server error",
                success: false
            })
    }
}

module.exports = {
    signup,
    login
}
