const express = require('express');
const router = express.Router();

const heating = require('./../modules/centralHeating/centralHeating.js');

router.get('/status', function (req, res) {
    heating.getStatus().then(function (status) {
        res.status(200).json(status);
    }).catch(function (err) {
        console.error(err);
        res.status(500).json({message: "Failed to get status."})
    });
});

module.exports = router;
