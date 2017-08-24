"use strict";

var multer = require('multer');
var md5 = require('md5');
var config = require("../config/config");
var fs = require('fs');
var formidable = require("formidable");

var util = {};

util.storage = multer.diskStorage({
    //设置上传文件路径,以后可以扩展成上传至七牛,文件服务器等等
    //Note:如果你传递的是一个函数，你负责创建文件夹，如果你传递的是一个字符串，multer会自动创建
    destination: config.upload.path,
    //TODO:文件区分目录存放
    //获取文件MD5，重命名，添加后缀,文件重复会直接覆盖
    filename: function (req, file, cb) {
        var fileFormat =(file.originalname).split(".");
        var imageName = md5(file) + "." + fileFormat[fileFormat.length - 1];
        cb(null, imageName);
    }
});

// 表单上传方法
util.multer = multer({
    storage: util.storage,
    //其他设置请参考multer的limits
    //limits:{}
});

util.getPath = function(name) {
    var fileName = name;
    var fileArray = new Array();
    var endCode = ".";
    var dir = "";
    if (fileName.indexOf(".") >= 0) {
        fileArray = fileName.split(".");
    }
    if (fileArray.length > 0) {
        endCode = endCode + fileArray[fileArray.length - 1];
        for (var key in config.dir) {
            var fileDir = config.dir[key];
            for (var i = 0; i < fileDir.length; i ++) {
                if (fileDir[i] == endCode) {
                    dir = key + "/";
                    break;
                }
            }
            if (dir != "") {
                break;
            }
        } 
    }
    var fileStr = config.download.path + dir;
    return fileStr;
}

util.download = function(req, res) {
    var param = req.query;
    var fileName = param.file;
    var fileStr = util.getPath(fileName);
    res.download(fileStr + fileName);
}

util.ajaxUpload = function(req, res, callback) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            return;
        }
        var item;
        // 计算 files 长度
        var length = 0;
        for (item in files) {
            length++;
        }
        if (length === 0) {
            return;
        }
        for (item in files) {
            var file = files[item];
            // formidable 会将上传的文件存储为一个临时文件，现在获取这个文件的目录
            var tempfilepath = file.path;
            // 获取文件类型
            var type = file.type;

            // 获取文件名，并根据文件名获取扩展名
            var filename = file.name;
            var extname = filename.lastIndexOf('.') >= 0 ? filename.slice(filename.lastIndexOf('.') - filename.length) : '';
            // 文件名没有扩展名时候，则从文件类型中取扩展名
            if (extname === '' && type.indexOf('/') >= 0) {
                extname = '.' + type.split('/')[1];
            }
            var uploadfolderpath = util.getPath(filename.toLowerCase());
            // 将文件名重新赋值为一个随机数（避免文件重名）
            filename = Math.random().toString().slice(2) + extname;

            // 构建将要存储的文件的路径
            var filenewpath = uploadfolderpath + '/' + filename;
            var readStream = fs.createReadStream(tempfilepath);
            var writeStream = fs.createWriteStream(filenewpath);
            readStream.pipe(writeStream);
            readStream.on('end',function(){
                fs.unlink(tempfilepath, function(err){
                    var result = '';
                    if (err) {
                        result = 'error|save error';
                    } else {
                        // result = 'http://10.129.8.187:3000/download?file=' + filename;
                        result = 'http://locolhost:3000/download?file=' + filename;
                    }
                    callback(result);
                });
            });
        } 
    });
}

// 获得获得客户端IP地址
util.getClientIp = function(req) {
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    if (ipAddress && ipAddress.indexOf(":") > -1) {
        var ipArray = ipAddress.split(":");
        ipAddress = ipArray[ipArray.length - 1];
    }
    return ipAddress;
};

util.initContent = function(req, res) {
    var mimeTypes = config.mimeTypes;
    var contentType = "application/json;charset=utf-8";
    var urlStr = req.originalUrl;
    var urlArray = new Array();
    if (urlStr.indexOf(".") > 0) {
      urlArray = urlStr.split(".");
    }
    var endCode = ".";
    if (urlArray.length > 0) {
      endCode = (endCode + urlArray[urlArray.length - 1]).toLowerCase();
      contentType = mimeTypes[endCode];
    }
    res.header("Content-Type", contentType);
}

// 初始化 response Header
util.initHeader = function(req, res) {
    for (let key in config.header) {
        res.header(key, config.header[key]);
    }
    util.initContent(req, res);
}

module.exports = util;