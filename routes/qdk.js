'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config/config');

/* 获取清单库列表 */
router.get('/list', function(req, res, next) {
  request(config.qdkapi.BQItemDBs, function(error, response, body){   
    if(response.body){
      res.send(response.body);  
    }else{
      res.send(response);  
    }    
  });
});

/* 获取清单库数据 */
router.get('/read/:id', function(req, res, next) {
  request(config.qdkapi.BQItemDB + req.params.id, function(error, response, body){
    if(response.body){
      res.send(response.body);  
    }else{
      res.send(response);  
    }
  });
});

router.get('/projectspec/:id', function(req, res, next){
  request(config.qdkapi.projectspec + req.params.id, function(error, response, body){
    if(response.body){
      res.send(response.body);  
    }else{
      res.send(response);  
    }
  });
});

router.get('/catalogs', function(req, res, next){
  request(config.qdkapi.catalogs, function(error, response, body){
    if(response.body){
      res.send(response.body);  
    }else{
      res.send(response);  
    }
  });
});

module.exports = router;
