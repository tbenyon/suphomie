var Promise = require('bluebird');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = Promise.promisifyAll(require('mysql'));
var cloudinary = require('cloudinary');

app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
});

var connection = mysql.createConnection({
    host     : process.env.mySQL_host,
    user     : process.env.mySQL_user,
    password : process.env.mySQL_password,
    database : process.env.mySQL_database
});

var printAllImageData = function () {
    connection.query('SELECT * from images', function(err, rows, fields) {
        if (!err)
            console.log('The solution is: ', rows);
        else
            console.log('Error while performing Query.');
    });
};

var uploadImageToCloudinary = function(image) {
    return new Promise(function(resolve, reject) {
        cloudinary.uploader.upload("data:image/jpg;base64," + image, function (result) {
            if ('Error' in result) {
                writeToDatabaseLog("ERROR: Uploading to Cloudinary failed.");
                reject("Error when uploading to Cloudinary.")
            } else {
                writeToDatabaseLog("Image file was uploaded to Cloudinary.");
                resolve(result);
            }
        });
    });
};

var addImageDataToDB = function (rawImageData) {
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
                writeToDatabaseLog("ERROR: Failed to insert image data in DB." + err);
                reject(err);
            } else {
                writeToDatabaseLog("Image data was added.");
                resolve(result);
            }
        });
    });
};

var printAllLogData = function () {
    connection.query('SELECT * from log', function (err, rows, fields) {
        if (!err)
            console.log('The solution is: ', rows);
        else
            console.log('Error while performing Query.');
    });
};

var writeToDatabaseLog = function (comment) {
    connection.query('INSERT INTO log SET ?', {comment: comment}, function(err, result) {
        if (!err)
            console.log('DB LOG: ' + comment);
        else
            console.log('Error while performing log insert.');
    });
};

connection.connect();
writeToDatabaseLog("Server was executed.");

app.get('/', function (req, res) {
    res.sendfile('assets/pages/index.html');
});

app.post('/addImageData', function (req, res) {
    writeToDatabaseLog("Image post request made.");
    uploadImageToCloudinary(req.body.image)
        .then(function(rawData) {
            return addImageDataToDB(rawData)
        })
        .then(function(){
            res.send(200);
        }, function(){
            res.send(500);
        });
});

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
