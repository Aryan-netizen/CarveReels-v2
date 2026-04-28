const multer = require("multer")
const {CloudinaryStorage} = require("multer-storage-cloudinary")
const cloudinary = require("cloudinary").v2

console.log('Cloudinary config:', {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_ID,
    api_secret: process.env.CLOUDINARY_SECRET
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_ID,
    api_secret: process.env.CLOUDINARY_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder:'social',
        format: async(req,file)=>'png',
        public_id:(req,file)=>file.originalname.split('.')[0]+"_"+Date.now()
    }
})
const CloudinaryFlieUploader = multer({storage})
const uploadMultipleImage = CloudinaryFlieUploader.array('images',10)
const uploadMultipleVideo = CloudinaryFlieUploader.array('videos',10)
const uploadOneImage = CloudinaryFlieUploader.single('images')
const uploadOneVideo = CloudinaryFlieUploader.single('videos')

module.exports = {uploadMultipleImage,uploadMultipleVideo,uploadOneImage,uploadOneVideo}