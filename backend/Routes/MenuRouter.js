const { addMenuItem, getMenuItems, getMyMenuItems, updateMenuItem, deleteMenuItem, toggleAvailability } = require('../Controllers/MenuController');
const ensureAuthenticated = require('../Middlewares/Auth');
const { uploadOneImage } = require('../Middlewares/imageUploader');

const router = require('express').Router();

// Public routes
router.get('/partner/:foodPartnerId', getMenuItems);

// Protected routes (food partner only)
router.post('/add', ensureAuthenticated, uploadOneImage, addMenuItem);
router.get('/my-items', ensureAuthenticated, getMyMenuItems);
router.put('/update/:menuItemId', ensureAuthenticated, uploadOneImage, updateMenuItem);
router.delete('/delete/:menuItemId', ensureAuthenticated, deleteMenuItem);
router.post('/toggle-availability/:menuItemId', ensureAuthenticated, toggleAvailability);

module.exports = router;
