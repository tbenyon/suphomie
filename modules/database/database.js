var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100,
    host     : process.env.mySQL_host,
    user     : process.env.mySQL_user,
    password : process.env.mySQL_password,
    database : process.env.mySQL_database,
    debug    : false
});

exports.makeConnection = function () {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function(err,connection) {
            if (err) {
                if (connection) {
                    connection.release();
                }
                reject("Error in connection database");
                return;
            }

            resolve(connection);

            function logError(err) {
                console.log("ERROR:" + err);
                reject("Error with connection:" + connection.threadId);
            };
        });
    })
};

exports.dropConnection = function(connection) {
    connection.release();
};



exports.printAllImageData = function (connection) {
    connection.query('SELECT * from images', function(err, rows, fields) {
        if (!err)
            console.log('The solution is: ', rows);
        else
            console.log('Error while performing Query.');
    });
};

exports.addImageDataToDB = function (rawImageData, connection) {
    var imageData = {
        imageID: rawImageData.imageID,
        public_id: rawImageData.public_id,
        version: rawImageData.version,
        width: rawImageData.width,
        height: rawImageData.height,
        format: rawImageData.format,
        bytes: rawImageData.bytes,
        url: rawImageData.url,
        secure_url: rawImageData.secure_url
    };
    return new Promise(function(resolve, reject){
        connection.query('INSERT INTO images SET ?', imageData, function(err, result) {
            if (err) {
                writeToDatabaseLog("ERROR: Failed to insert image data in DB." + err, connection);
                reject(err);
            } else {
                writeToDatabaseLog("Image data was added.", connection);
                resolve(imageData.url);
            }
        });
    });
};

exports.printAllLogData = function (connection) {
    connection.query('SELECT * from log', function (err, rows, fields) {
        if (!err)
            console.log('The solution is: ', rows);
        else
            console.log('Error while performing Query.');
    });
};

exports.writeToDatabaseLog = function (comment, connection) {
    return new Promise(function (resolve, reject) {
        connection.query('INSERT INTO log SET ?', {comment: comment}, function(err, result) {
            if (!err)
                resolve('DB LOG: ' + comment);
            else
                reject('Error while performing log insert.');
        });
    });
};


var writeToDatabaseLog = function (comment, connection) {
    return new Promise(function (resolve, reject) {
        connection.query('INSERT INTO log SET ?', {comment: comment}, function(err, result) {
            if (!err)
                resolve('DB LOG: ' + comment);
            else
                reject('Error while performing log insert.');
        });
    });
};