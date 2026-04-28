const ensureAuthenticated = require('../Middlewares/Auth');
const UserModel = require('../Models/UserModel');

const router = require('express').Router();

router.get('/', ensureAuthenticated, async (req, res) => {
    console.log('---- logged in user detail ---', req.user);
    try {
        const data = await UserModel.findOne({ _id: req.user._id });

        console.log('<--- data --> ', data);
        res.status(200)
            .json({
                message: "Products",
                success: true,
                data: data,
                product: [   
                    {
                        name: "mobile",
                        price: 10000
                    },
                    {
                        name: "tv",
                        price: 20000
                    }
                ]
            })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err
        })
    }
});

router.get('/:id', ensureAuthenticated, async (req, res) => {
    console.log('---- logged in user detail ---', req.user);
    try {
        const data = await UserModel.findOne({ _id: req.user._id });

        console.log('<--- data --> ', data);
        res.status(200)
            .json({
                message: "Images",
                success: true,
                data: data,
                product: [   
                    {
                        name: "mobile",
                        price: 10000
                    },
                    {
                        name: "tv",
                        price: 20000
                    }
                ]
            })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err
        })
    }
});

module.exports = router;