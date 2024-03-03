const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY,
});

const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUploads, (result) => {
            resolve(
                {
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id,
                },
                {
                    resource_type: "auto",
                }
            );
        });
    });
};

const cloudinaryDeleteImg = async (fileToDelete) => {
    return new Promise((resolve) => {
        cloudinary.uploader.destroy(fileToDelete, (result) => {
            resolve(
                {
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id,
                },
                {
                    resource_type: "auto",
                }
            );
        });
    });
};

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };

/* 
const cloudinaryUploadImg = (fileToUploads) =>
cloudinary.uploader.upload(fileToUploads, { resource_type: "auto" });
const cloudinaryDeleteImg = (fileToDelete) =>
cloudinary.uploader.destroy(fileToDelete, { resource_type: "auto" });
*/

// import {v2 as cloudinary} from 'cloudinary';
// cloudinary.config({
//   cloud_name: '',
//   api_key: '',
//   api_secret: ''
// });
