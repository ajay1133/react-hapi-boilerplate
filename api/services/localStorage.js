
"use strict";
var fs = require('fs');
const uuid = require('uuid');
const config = require('config');

exports.uploadFile = (uploadFile, callback) => {

    const filename  = uploadFile.hapi.filename;
    const extension = filename.substring(filename.lastIndexOf('.') + 1);
    const key       = `${uuid.v4()}.${extension}`;
    const contentType  =  uploadFile.hapi.headers['content-type'];

    var ret = {
        filename: filename,
        key: key,
        contentType: contentType,
    };

    console.log('image property',ret);

    var path = config.profileImage.profileImagePath +'/'+ key;

    console.log(path);
    var file = fs.createWriteStream(path);

    file.on('error', function (err) {
        console.error(err)
    });

    uploadFile.pipe(file);

    uploadFile.on('end', function (err) {
        var ret = {
            filename: filename,
            key: key,
            contentType: contentType,
        };
        callback(null, ret);
    })


};
