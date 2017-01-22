const database = require('./../database/central_heating_db.js');

exports.getStatus = function () {
    return new Promise(function(resolve, reject) {
        database.getHeatingAndWaterStatus().then(function (data) {
            resolve(data[0]);
        }).catch(function (err) {
            console.error(err);
            reject("Failed to get status from the DB.");
        })
    });
};
