var request = require('request');
var database = require('./../database/database.js');

exports.notifyIFTTTofImageCapture = function(imageURL, connection) {
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