"use strict";

var express = require('express');
var session = require('express-session');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json(req);
});

router.post('/login', function(req, res, next) {
  var obj = req.body;
  console.log(obj);
  // todo: 后面整合账号后，需要去账号系统中检查账号名和密码
  var result = {};
  result.userName = obj.userName;
  result.accesstoken = 'tempToken';
  if(result.userName.indexOf('_mb')>=0){
    result.permission = 'mb'; 
  }else if(result.userName.indexOf('_yz')>=0){
    result.permission = 'yz'; 
  }else{
    result.permission = 'gf'; 
  }
  // 把结果写入session
  req.session.userName = result.userName;
  req.session.accesstoken = result.accesstoken;
  
  res.send(result);  
});




module.exports = router;