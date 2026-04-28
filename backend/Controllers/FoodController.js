const foodModel = require("../Models/FoodModel");

const PostVideoImage = async (req, res) => {
    try {
        const { title, caption } = req.body;
        
        // Validate inputs
        if (!title || !caption) {
            return res.status(400).json({
                message: "title and caption are required",
                success: false
            });
        }

        let image = null;
        let video = null;

        // Handle multiple files
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                if (file.mimetype.startsWith('image/')) {
                    image = file.path;
                } else if (file.mimetype.startsWith('video/')) {
                    video = file.path;
                }
            });
        }

        if (!image || !video) {
            return res.status(400).json({
                message: "Both image and video are required",
                success: false
            });
        }

        const foodPost = new foodModel({ 
            title, 
            caption, 
            image: image,
            video: video,
            user: req.user._id
        });
        
        await foodPost.save();
        res.status(201).json({
            message: "Food post created successfully",
            success: true,
            data: foodPost
        })
    } catch (err) {
        console.error('Uploading video/image error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        })
    }
}

const getfood = async (req, res) => {
    try {
        const data = await foodModel.find();

        console.log('<--- data --> ', data);
        res.status(200).json({
            message: "Food posts",
            success: true,
            data: data,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err
        })
    }
}

module.exports = {
    PostVideoImage,
    getfood
}