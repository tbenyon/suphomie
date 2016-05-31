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
    host     : 'localhost',
    user     : 'testUser',
    password : 'password',
    database : 'suphomie'
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
    cloudinary.uploader.upload("data:image/jpg;base64," + image, function(result) {
        console.log(result);
    });
};

var addImageDataToDB = function (res, imageData) {
    return new Promise(function(resolve, reject){
        connection.query('INSERT INTO images SET ?', imageData, function(err, result) {
            if (err) {
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
            console.log('LOG COMMENT ADDED: ' + comment);
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
    uploadImageToCloudinary(req.body.image);
    addImageDataToDB(res, req.body)
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
