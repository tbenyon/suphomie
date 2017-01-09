const cloudinary = require('cloudinary');

const database = require('./../database/database.js');

cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
});

exports.uploadImageToCloudinary = function(image, connection) {
    return new Promise(function(resolve, reject) {
        cloudinary.uploader.upload("data:image/jpg;base64," + image, function (result) {
            if ('Error' in result) {
                database.writeToDatabaseLog("ERROR: Uploading to Cloudinary failed.", connection);
                reject("Error when uploading to Cloudinary.")
            } else {
                database.writeToDatabaseLog("Image file was uploaded to Cloudinary.", connection);
                resolve(result);
            }
        });
    });
};