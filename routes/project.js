'use strict';
var express = require('express');
var router = express.Router();
var dbservice = require('./dbservice');
var makeMongoId = dbservice.makeMongoId;
/* 获取模板类别列表 */
router.get('/catalog', function(req, res, next) {
  dbservice.read(
    'catalog',
    {},
    {},
    function ( map_list ) { res.send( map_list ); }
  );
});

/* 获取模板列表 */
router.get('/templet', function(req, res, next) {
  let params = req.query;
  let typeObj = {type: 'mb'};
  if (params) {
    for (let key in params) {
      let value = params[key];
      let parseVal = parseInt(value);
      if (parseVal + "" == value) {
        params[key] = parseVal;
      } 
    }
    typeObj = params;
  }
  dbservice.read(
    'project',
    typeObj,
    {_id: true, catalogID: true, description: true, createTime: true, lastModify: true, type: true},
    function ( map_list ) { res.send( map_list ); }
  );
});

/* 获取招标列表 */
router.get('/zb', function(req, res, next) {
  dbservice.read(
    'project',
    {type: 'zb'},
    {_id: true, catalogID: true, description: true, createTime: true, lastModify: true, type: true},
    function ( map_list ) { res.send( map_list ); }
  );
});

/* 获取投标列表 */
router.get('/tb', function(req, res, next) {
  dbservice.read(
    'project',
    {type: 'tb'},
    {_id: true, catalogID: true, description: true, createTime: true, lastModify: true, type: true},
    function ( map_list ) { res.send( map_list ); }
  );
});

/* 获取用户项目列表 */
router.get('/list/:userID', function(req, res, next) {
  dbservice.read(
    'project',
    {userID: req.params.userID},
    {_id: true, catalogID: true, description: true, createTime: true, lastModify: true, userID: true, type: true},
    function ( map_list ) { res.send( map_list ); }
  );
});

/* 新建模板 */
router.post('/templet/create', function(req, res, next) {	 
  var obj=req.body;
	obj.type='mb';  
  obj.createTime = new Date().toLocaleString();
  obj.lastModify = obj.createTime;  
  dbservice.construct(
    'project',
    obj,
    function ( result_map ) { res.send( result_map ); }
  );
});

/* 新建招标项目 */
router.post('/zb/create', function(req, res, next) {
  var obj=req.body;    
  // 找到模板记录
  dbservice.read(
    'project',
    { _id: makeMongoId( obj.tid ) },
    {},
    function (list) { 
      var mbfile = list[0];
      obj.type = 'zb';
      obj.createTime = new Date().toLocaleString();
      obj.lastModify = obj.createTime;
      obj.data = mbfile.data;
      obj.catalog = mbfile.catalog;
      obj.catalogID = mbfile.catalogID;      
      // 保存到数据库
      dbservice.construct(
        'project',
        obj,
        function ( result_map ) { res.send( result_map ); }
      );       
    }
  );
});

/* 新建投标项目 */
router.post('/tb/create', function(req, res, next) {
  var obj=req.body;    
  // 找到模板记录
  dbservice.read(
    'project',
    { _id: makeMongoId( obj.zid ) },
    {},
    function (list) { 
      var zbfile = list[0];
      obj.type = 'tb';
      obj.createTime = new Date().toLocaleString();
      obj.lastModify = obj.createTime;
      obj.data = zbfile.data;
      obj.catalog = zbfile.catalog;
      obj.catalogID = zbfile.catalogID;      
      // 保存到数据库
      dbservice.construct(
        'project',
        obj,
        function ( result_map ) { res.send( result_map ); }
      );       
    }
  );
});

/* 删除项目 */
router.post('/delete/:id', function(req, res, next) {  
  dbservice.destroy(
      'project',
      { _id: makeMongoId( req.params.id ) },
      function ( result_map ) { res.send( result_map ); }
    );
});

/* 读取项目 */
router.get('/read/:id', function(req, res, next) {
  dbservice.read(
      'project',
      { _id: makeMongoId( req.params.id ) },
      {},
      function ( result_map ) { res.send( result_map ); }
    );
});

/* 读取项目 */
router.get('/image/', function(req, res, next) {
  let param = req.body;
  res.send({id: 1, name: "dfdfdf"});
});

/* 修改项目信息 */
router.post('/update/:id', function(req, res, next) {
  var obj = req.body;  
  obj._id = makeMongoId(req.params.id);  
  obj.lastModify = new Date();
  dbservice.save(
    'project',    
    obj,
    function(result_map) {res.send(result_map);}
  );
});

/* 复制项目信息 */
router.post('/copy/:id', function(req, res, next) {  
  // 找到原记录
  dbservice.read(
    'project',
    { _id: makeMongoId(req.params.id)},
    {},
    function (list) { 
      var srcfile = list[0];
      var newfile = {};
      newfile.type = srcfile.type;
      newfile.createTime = new Date().toLocaleString();
      newfile.lastModify = newfile.createTime;
      newfile.data = srcfile.data;
      newfile.tid = srcfile.tid;
      newfile.zid = srcfile.zid;
      newfile.catalog = srcfile.catalog;
      newfile.catalogID = srcfile.catalogID;      
      newfile.userID = srcfile.userID;
      newfile.description = srcfile.description + '_1';
      // 保存到数据库
      dbservice.construct(
        'project',
        newfile,
        function ( result_map ) { res.send( result_map ); }
      );       
    }
  );
});

module.exports = router;