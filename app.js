var Promise = require('bluebird');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = Promise.promisifyAll(require('mysql'));
var cloudinary = require('cloudinary');
var request = require('request');

app.use(express.static('assets'));
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '20mb'}));

cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
});

var pool = mysql.createPool({
    connectionLimit: 100,
    host     : process.env.mySQL_host,
    user     : process.env.mySQL_user,
    password : process.env.mySQL_password,
    database : process.env.mySQL_database,
    debug    : false
});

var printAllImageData = function (connection) {
    connection.query('SELECT * from images', function(err, rows, fields) {
        if (!err)
            console.log('The solution is: ', rows);
        else
            console.log('Error while performing Query.');
    });
};

var uploadImageToCloudinary = function(image, connection) {
    return new Promise(function(resolve, reject) {
        cloudinary.uploader.upload("data:image/jpg;base64," + image, function (result) {
            if ('Error' in result) {
                writeToDatabaseLog("ERROR: Uploading to Cloudinary failed.", connection);
                reject("Error when uploading to Cloudinary.")
            } else {
                writeToDatabaseLog("Image file was uploaded to Cloudinary.", connection);
                resolve(result);
            }
        });
    });
};

var addImageDataToDB = function (rawImageData, connection) {
    var imageData = {
        imageID: rawImageData.imageID,
        public_id: rawImageData.public_id,
        version: rawImageData.version,
        width: rawImageData.width,
        height: rawImageData.height,
        format: rawImageData.format,
        bytes: rawImageData.bytes,
        url: rawImageData.url,
        secure_url: rawImageData.secure_url
    };
    return new Promise(function(resolve, reject){
        connection.query('INSERT INTO images SET ?', imageData, function(err, result) {
            if (err) {
                writeToDatabaseLog("ERROR: Failed to insert image data in DB." + err, connection);
                reject(err);
            } else {
                writeToDatabaseLog("Image data was added.", connection);
                resolve(imageData.url);
            }
        });
    });
};

var printAllLogData = function (connection) {
    connection.query('SELECT * from log', function (err, rows, fields) {
        if (!err)
            console.log('The solution is: ', rows);
        else
            console.log('Error while performing Query.');
    });
};

var writeToDatabaseLog = function (comment, connection) {
    connection.query('INSERT INTO log SET ?', {comment: comment}, function(err, result) {
        if (!err)
            console.log('DB LOG: ' + comment);
        else
            console.log('Error while performing log insert.');
    });
};

var notifyIFTTTofImageCapture = function(imageURL, connection) {
    return new Promise(function (resolve, reject) {
        request({
            url: 'https://maker.ifttt.com/trigger/front_door_bell/with/key/' + process.env.IFTTT_key,
            method: 'POST',
            json: {value1: imageURL}
        },
        function (error, response, body) {
            if (!error) {
                writeToDatabaseLog("Successful IFTTT notification sent: ", connection);
                resolve(body);
            } else {
                writeToDatabaseLog("Post request to IFTTT failed: " + error, connection);
                reject("Post request to IFTTT failed: " + error)
            }
        });
    });
};

app.get('/', function (req, res) {
    res.sendfile('assets/pages/index.html');
});

app.post('/addImageData', function (req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        writeToDatabaseLog("Image post request made with ID:" + connection.threadId, connection);

        uploadImageToCloudinary(req.body.image, connection)
            .then(function(rawData) {
                return addImageDataToDB(rawData, connection)
            }).then(function(imageURL) {
                return notifyIFTTTofImageCapture(imageURL, connection)
            }).then(function(){
                connection.release();
                res.sendStatus(200);
            }, function(){
                connection.release();
                res.sendStatus(500);
            });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });

});

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
