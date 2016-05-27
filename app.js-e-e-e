var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));








app.get('/', function (req, res) {
    res.sendfile('assets/pages/index.html');
});

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
