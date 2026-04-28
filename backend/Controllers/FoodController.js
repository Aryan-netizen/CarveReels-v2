const foodModel = require("../Models/FoodModel");
const FoodPartnerModel = require("../Models/FoodPartnerModel");
const MenuModel = require("../Models/MenuModel");

const PostVideoImage = async (req, res) => {
    try {
        console.log('PostVideoImage called');
        console.log('User from token:', req.user);
        
        // Check if user is a food partner
        if (req.user.role !== 'foodpartner') {
            return res.status(403).json({
                message: "Only food partners can create reels",
                success: false
            });
        }

        const { title, caption, price, category, preparationTime } = req.body;
        console.log('Form data:', { title, caption, price, category, preparationTime });
        
        if (!title || !caption || !price) {
            return res.status(400).json({
                message: "title, caption, and price are required",
                success: false
            });
        }

        let image = null;
        let video = null;

        if (req.files && req.files.length > 0) {
            console.log('Files received:', req.files.length);
            req.files.forEach(file => {
                console.log('File:', file.originalname, 'MIME:', file.mimetype);
                if (file.mimetype.startsWith('image/')) {
                    image = file.path;
                } else if (file.mimetype.startsWith('video/')) {
                    video = file.path;
                }
            });
        }

        console.log('Image:', image, 'Video:', video);

        if (!image || !video) {
            return res.status(400).json({
                message: "Both image and video are required",
                success: false
            });
        }

        const foodPartner = await FoodPartnerModel.findById(req.user._id);
        
        if (!foodPartner) {
            return res.status(404).json({
                message: "Food partner profile not found",
                success: false
            });
        }

        console.log('Food partner found:', foodPartner.name);

        // Create the reel
        const foodPost = new foodModel({ 
            title, 
            caption, 
            image: image,
            video: video,
            user: req.user._id,
            userName: foodPartner.name,
            userImage: foodPartner.image
        });
        
        await foodPost.save();
        console.log('Reel saved:', foodPost._id);

        // Create menu item automatically
        const menuItem = new MenuModel({
            foodPartner: req.user._id,
            name: title,
            description: caption,
            price: parseFloat(price),
            image: image,
            category: category || 'other',
            preparationTime: parseInt(preparationTime) || 30
        });

        await menuItem.save();
        console.log('Menu item saved:', menuItem._id);

        // Link the menu item to the reel
        foodPost.menuItem = menuItem._id;
        await foodPost.save();
        console.log('Reel updated with menu item');

        res.status(201).json({
            message: "Food reel and menu item created successfully",
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
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const data = await foodModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'name image businessName')
            .populate('menuItem');

        const total = await foodModel.countDocuments();

        res.status(200).json({
            message: "Food reels",
            success: true,
            data: data,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
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

const getUserReels = async (req, res) => {
    try {
        const data = await foodModel.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "User reels",
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

const updateReel = async (req, res) => {
    try {
        const { reelId } = req.params;
        const { title, caption, price, category, preparationTime } = req.body;

        // Find the reel
        const reel = await foodModel.findById(reelId);
        if (!reel) {
            return res.status(404).json({
                message: "Reel not found",
                success: false
            });
        }

        // Check if user owns the reel
        if (reel.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can only edit your own reels",
                success: false
            });
        }

        // Update reel fields
        if (title) reel.title = title;
        if (caption) reel.caption = caption;

        // Handle file uploads
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                if (file.mimetype.startsWith('image/')) {
                    reel.image = file.path;
                } else if (file.mimetype.startsWith('video/')) {
                    reel.video = file.path;
                }
            });
        }

        await reel.save();

        // Update menu item if it exists
        if (reel.menuItem) {
            const menuItem = await MenuModel.findById(reel.menuItem);
            if (menuItem) {
                if (title) menuItem.name = title;
                if (caption) menuItem.description = caption;
                if (price) menuItem.price = parseFloat(price);
                if (category) menuItem.category = category;
                if (preparationTime) menuItem.preparationTime = parseInt(preparationTime);
                if (reel.image) menuItem.image = reel.image;
                await menuItem.save();
            }
        }

        res.status(200).json({
            message: "Reel updated successfully",
            success: true,
            data: reel
        });
    } catch (err) {
        console.error('Updating reel error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
}

const deleteReel = async (req, res) => {
    try {
        const { reelId } = req.params;

        // Find the reel
        const reel = await foodModel.findById(reelId);
        if (!reel) {
            return res.status(404).json({
                message: "Reel not found",
                success: false
            });
        }

        // Check if user owns the reel
        if (reel.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can only delete your own reels",
                success: false
            });
        }

        // Delete associated menu item
        if (reel.menuItem) {
            await MenuModel.findByIdAndDelete(reel.menuItem);
        }

        // Delete the reel
        await foodModel.findByIdAndDelete(reelId);

        res.status(200).json({
            message: "Reel deleted successfully",
            success: true
        });
    } catch (err) {
        console.error('Deleting reel error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
}

module.exports = {
    PostVideoImage,
    getfood,
    getUserReels,
    updateReel,
    deleteReel
}
