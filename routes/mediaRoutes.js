const express = require('express');
const router = express.Router();

const database = require('./../modules/database/database.js');
const cloudinary = require('./../modules/cloudinary/cloudinary.js');
const ifttt = require('./../modules/ifttt/ifttt.js');

router.post('/addImageData', function (req, res) {
    let dbConnection;

    database.makeConnection().then(function (conn) {
        dbConnection = conn;
        return database.writeToDatabaseLog("Image post request made with ID:" + dbConnection.threadId, dbConnection)
    }).then(function () {
        return cloudinary.uploadImageToCloudinary(req.body.image, dbConnection)
    }).then(function(rawData) {
        return database.addImageDataToDB(rawData, dbConnection)
    }).then(function(imageURL) {
        return ifttt.notifyIFTTTofImageCapture(imageURL, dbConnection)
    }).then(function(){
        database.dropConnection(dbConnection);
        res.send(200);
    }).catch(function(err){
        database.dropConnection(dbConnection);
        console.log(err);
        res.send(500);
    });
});

module.exports = router;