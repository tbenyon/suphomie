var express = require('express');
var router = express.Router();

var database = require('./../modules/database/database.js');
var cloudinary = require('./../modules/cloudinary/cloudinary.js');
var ifttt = require('./../modules/ifttt/ifttt.js');

router.post('/addImageData', function (req, res) {
    var dbConnection;

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