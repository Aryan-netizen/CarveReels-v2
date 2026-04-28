const { googleAuth } = require('../Controllers/googleAuth');
const { signup, login } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const { uploadOneImage } = require('../Middlewares/imageUploader');

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', uploadOneImage, signup);
router.post("/google-login", googleAuth);

module.exports = router;