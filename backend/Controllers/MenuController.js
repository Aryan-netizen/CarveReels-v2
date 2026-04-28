const MenuModel = require("../Models/MenuModel");

const addMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, preparationTime } = req.body;
        const foodPartnerId = req.user._id;

        if (!name || !price || !req.file) {
            return res.status(400).json({
                message: "Name, price, and image are required",
                success: false
            });
        }

        if (price <= 0) {
            return res.status(400).json({
                message: "Price must be greater than 0",
                success: false
            });
        }

        const menuItem = new MenuModel({
            foodPartner: foodPartnerId,
            name,
            description: description || '',
            price,
            image: req.file.path,
            category: category || 'other',
            preparationTime: preparationTime || 30
        });

        await menuItem.save();

        res.status(201).json({
            message: "Menu item added successfully",
            success: true,
            data: menuItem
        });
    } catch (err) {
        console.error('Add menu item error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const getMenuItems = async (req, res) => {
    try {
        const { foodPartnerId } = req.params;

        const menuItems = await MenuModel.find({ foodPartner: foodPartnerId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Menu items retrieved successfully",
            success: true,
            data: menuItems
        });
    } catch (err) {
        console.error('Get menu items error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const getMyMenuItems = async (req, res) => {
    try {
        const foodPartnerId = req.user._id;

        const menuItems = await MenuModel.find({ foodPartner: foodPartnerId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Menu items retrieved successfully",
            success: true,
            data: menuItems
        });
    } catch (err) {
        console.error('Get my menu items error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const { menuItemId } = req.params;
        const { name, description, price, category, available, preparationTime } = req.body;
        const foodPartnerId = req.user._id;

        const menuItem = await MenuModel.findById(menuItemId);

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found",
                success: false
            });
        }

        if (menuItem.foodPartner.toString() !== foodPartnerId.toString()) {
            return res.status(403).json({
                message: "Unauthorized to update this menu item",
                success: false
            });
        }

        if (name) menuItem.name = name;
        if (description) menuItem.description = description;
        if (price) menuItem.price = price;
        if (category) menuItem.category = category;
        if (available !== undefined) menuItem.available = available;
        if (preparationTime) menuItem.preparationTime = preparationTime;
        if (req.file) menuItem.image = req.file.path;

        menuItem.updatedAt = Date.now();
        await menuItem.save();

        res.status(200).json({
            message: "Menu item updated successfully",
            success: true,
            data: menuItem
        });
    } catch (err) {
        console.error('Update menu item error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        const { menuItemId } = req.params;
        const foodPartnerId = req.user._id;

        const menuItem = await MenuModel.findById(menuItemId);

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found",
                success: false
            });
        }

        if (menuItem.foodPartner.toString() !== foodPartnerId.toString()) {
            return res.status(403).json({
                message: "Unauthorized to delete this menu item",
                success: false
            });
        }

        await MenuModel.findByIdAndDelete(menuItemId);

        res.status(200).json({
            message: "Menu item deleted successfully",
            success: true
        });
    } catch (err) {
        console.error('Delete menu item error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const toggleAvailability = async (req, res) => {
    try {
        const { menuItemId } = req.params;
        const foodPartnerId = req.user._id;

        const menuItem = await MenuModel.findById(menuItemId);

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found",
                success: false
            });
        }

        if (menuItem.foodPartner.toString() !== foodPartnerId.toString()) {
            return res.status(403).json({
                message: "Unauthorized to update this menu item",
                success: false
            });
        }

        menuItem.available = !menuItem.available;
        menuItem.updatedAt = Date.now();
        await menuItem.save();

        res.status(200).json({
            message: "Menu item availability updated",
            success: true,
            data: menuItem
        });
    } catch (err) {
        console.error('Toggle availability error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

module.exports = {
    addMenuItem,
    getMenuItems,
    getMyMenuItems,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability
};
