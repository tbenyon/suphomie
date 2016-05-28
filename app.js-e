var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'testUser',
    password : 'password',
    database : 'suphomie'
});

connection.connect();
var post  = {comment: 'Server executed.'};
connection.query('INSERT INTO log SET ?', post, function(err, result) {
    if (!err)
        console.log('The result is: ', result);
    else
        console.log('Error while performing log insert.');
});

connection.query('SELECT * from log', function(err, rows, fields) {
    if (!err)
        console.log('The solution is: ', rows);
    else
        console.log('Error while performing Query.');
});

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
