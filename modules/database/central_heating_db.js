const database = require('./database.js');

exports.getHeatingAndWaterStatus = function () {
    return new Promise(function (resolve, reject) {
       let connection;
       database.makeConnection().then(function (conn) {
           connection = conn;
           return database.makeQuery(connection, "SELECT * from central_heating_status");
       }).then(function(data) {
           connection.release();
           resolve(data);
       }).catch(function (err) {
           connection.release();
           reject(err);
       })
    });
};

