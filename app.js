const express = require('express');
const app = express();
let bodyParser = require('body-parser');

app.use(express.static('assets'));
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '20mb'}));

app.use("/media",require('./routes/mediaRoutes.js'));
app.use("/heating",require('./routes/centralHeatingRoutes.js'));

app.get('/', function (req, res) {
    res.sendfile('assets/pages/index.html');
});

const port = process.env.PORT || 3000;

const server = app.listen(port, function () {
    const host = server.address().address;
    const port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
