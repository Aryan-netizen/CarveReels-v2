const { PostVideoImage, getfood, getUserReels, updateReel, deleteReel } = require('../Controllers/FoodController');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const ensureAuthenticated = require('../Middlewares/Auth');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_ID,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'social',
        resource_type: 'auto',
        public_id: (file) => {
            if (!file || !file.originalname) {
                return "file_" + Date.now();
            }
            return file.originalname.split('.')[0] + "_" + Date.now();
        }
    }
});

const upload = multer({ storage });

const router = require('express').Router();

router.get('/', getfood);
router.get('/user/reels', ensureAuthenticated, getUserReels);
router.post('/', ensureAuthenticated, upload.array('files', 2), PostVideoImage);
router.put('/:reelId', ensureAuthenticated, upload.array('files', 2), updateReel);
router.delete('/:reelId', ensureAuthenticated, deleteReel);

module.exports = router;