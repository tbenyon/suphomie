var Promise = require('bluebird');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = Promise.promisifyAll(require('mysql'));

app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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

var addImageDataToDB = function (imageData) {
    connection.query('INSERT INTO images SET ?', imageData, function(err, result) {
        if (!err)
            console.log('The result is: ', result);
        else
            console.log('Error while performing image data insert to DB.' + err);
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
            console.log('The result is: ', result);
        else
            console.log('Error while performing log insert.');
    });
};

connection.connect();
writeToDatabaseLog("Server was exectuted.");
printAllLogData();
connection.end();

app.get('/', function (req, res) {
    res.sendfile('assets/pages/index.html');
});

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
