const express = require('express');
const router = express.Router();

const heating = require('./../modules/centralHeating/centralHeating.js');

router.get('/status', function (req, res) {
    var status = heating.getStatus();
    res.status(200).json(status);
});

module.exports = router;
