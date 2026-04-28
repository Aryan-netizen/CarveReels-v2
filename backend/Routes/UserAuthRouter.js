const { signup, login } = require('../Controllers/AuthController');
const { googleAuthUser } = require('../Controllers/googleAuth');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const { uploadOneImage } = require('../Middlewares/imageUploader');

const router = require('express').Router();

router.post('/signup', uploadOneImage, signup);
router.post('/login', loginValidation, login);
router.post('/google-login', googleAuthUser);

module.exports = router;
