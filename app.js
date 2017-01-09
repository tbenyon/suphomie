var Promise = require('bluebird');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

var database = require('./modules/database/database.js');
var cloudinary = require('./modules/cloudinary/cloudinary.js');

app.use(express.static('assets'));
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '20mb'}));

var notifyIFTTTofImageCapture = function(imageURL, connection) {
    return new Promise(function (resolve, reject) {
        request({
            url: 'https://maker.ifttt.com/trigger/front_door_bell/with/key/' + process.env.IFTTT_key,
            method: 'POST',
            json: {value1: imageURL}
        },
        function (error, response, body) {
            if (!error) {
                database.writeToDatabaseLog("Successful IFTTT notification sent: ", connection);
                resolve(body);
            } else {
                database.writeToDatabaseLog("Post request to IFTTT failed: " + error, connection);
                reject("Post request to IFTTT failed: " + error)
            }
        });
    });
};

app.get('/', function (req, res) {
    res.sendfile('assets/pages/index.html');
});

app.post('/addImageData', function (req, res) {
    var dbConnection;

    database.makeConnection().then(function (conn) {
        dbConnection = conn;
        return database.writeToDatabaseLog("Image post request made with ID:" + dbConnection.threadId, dbConnection)
    }).then(function () {
        return cloudinary.uploadImageToCloudinary(req.body.image, dbConnection)
    }).then(function(rawData) {
        return database.addImageDataToDB(rawData, dbConnection)
    }).then(function(imageURL) {
        return notifyIFTTTofImageCapture(imageURL, dbConnection)
    }).then(function(){
        database.dropConnection(dbConnection);
        res.send(200);
    }).catch(function(err){
        database.dropConnection(dbConnection);
        console.log(err);
        res.send(500);
    });
});

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
