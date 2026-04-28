const { signup, login } = require('../Controllers/FoodPartnerAuthController');
const { googleAuthFoodPartner } = require('../Controllers/googleAuth');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const { uploadOneImage } = require('../Middlewares/imageUploader');

const router = require('express').Router();

router.post('/signup', uploadOneImage, signup);
router.post('/login', loginValidation, login);
router.post('/google-login', googleAuthFoodPartner);

module.exports = router;
