const database = require('./../database/database.js');

var exports = module.exports = {};

exports.getStatus = function () {
    return {status: true};
};