const OrderModel = require("../Models/OrderModel");
const FoodModel = require("../Models/FoodModel");
const FoodPartnerModel = require("../Models/FoodPartnerModel");

const createOrder = async (req, res) => {
    try {
        const { reelId, quantity, price, customerName, customerPhone, customerEmail, deliveryAddress, specialInstructions, paymentMethod } = req.body;
        const userId = req.user._id;

        // Validate inputs
        if (!reelId || !quantity || !price || !customerName || !customerPhone || !customerEmail || !deliveryAddress) {
            return res.status(400).json({
                message: "All required fields must be provided",
                success: false
            });
        }

        // Get reel details
        const reel = await FoodModel.findById(reelId);
        if (!reel) {
            return res.status(404).json({
                message: "Reel not found",
                success: false
            });
        }

        // Calculate total price
        const totalPrice = quantity * price;

        // Create order
        const order = new OrderModel({
            reel: reelId,
            foodPartner: reel.user,
            customer: userId,
            customerName,
            customerPhone,
            customerEmail,
            deliveryAddress,
            quantity,
            price,
            totalPrice,
            specialInstructions: specialInstructions || '',
            paymentMethod: paymentMethod || 'cash'
        });

        await order.save();

        res.status(201).json({
            message: "Order placed successfully",
            success: true,
            data: order
        });
    } catch (err) {
        console.error('Order creation error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const getOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await OrderModel.find({ customer: userId })
            .populate('reel', 'title image')
            .populate('foodPartner', 'name businessName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Orders retrieved successfully",
            success: true,
            data: orders
        });
    } catch (err) {
        console.error('Get orders error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const getOrdersForFoodPartner = async (req, res) => {
    try {
        const foodPartnerId = req.user._id;
        const orders = await OrderModel.find({ foodPartner: foodPartnerId })
            .populate('reel', 'title image')
            .populate('customer', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Orders retrieved successfully",
            success: true,
            data: orders
        });
    } catch (err) {
        console.error('Get orders error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({
                message: "Order ID and status are required",
                success: false
            });
        }

        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
                success: false
            });
        }

        const order = await OrderModel.findByIdAndUpdate(
            orderId,
            { status, updatedAt: Date.now() },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Order status updated successfully",
            success: true,
            data: order
        });
    } catch (err) {
        console.error('Update order error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required",
                success: false
            });
        }

        const order = await OrderModel.findByIdAndUpdate(
            orderId,
            { status: 'cancelled', updatedAt: Date.now() },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Order cancelled successfully",
            success: true,
            data: order
        });
    } catch (err) {
        console.error('Cancel order error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrdersForFoodPartner,
    updateOrderStatus,
    cancelOrder
};
