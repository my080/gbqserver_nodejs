/*
 * crud.js - module to provide CRUD db capabilities
 */

/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global */

// ------------ BEGIN MODULE SCOPE VARIABLES --------------
'use strict';
var
  constructObj, readObj,
  updateObj, destroyObj, saveObj;
var mongodb = require('mongodb');
var config = require('../config/config');
var mongoServer = new mongodb.Server(
    config.mongo.ip,
    config.mongo.port
  );
var dbHandle = new mongodb.Db(
    'gbq', mongoServer, {
      safe: true
    }
  );
// ------------- END MODULE SCOPE VARIABLES ---------------

// ---------------- BEGIN UTILITY METHODS -----------------


// ----------------- END UTILITY METHODS ------------------

// ---------------- BEGIN PUBLIC METHODS ------------------

constructObj = function(obj_type, obj_map, callback) {
  dbHandle.collection(
    obj_type,
    function(outer_error, collection) {
      var options_map = {
        safe: true
      };

      collection.insert(
        obj_map,
        options_map,
        function(inner_error, result_map) {
          callback(result_map);
        }
      );
    }
  );  
};

readObj = function(obj_type, find_map, fields_map, callback) {  
  dbHandle.collection(
    obj_type,
    function(outer_error, collection) {
      collection.find(find_map, fields_map).toArray(
        function(inner_error, map_list) {
          callback(map_list);
        }
      );
    }
  );
};

updateObj = function(obj_type, find_map, set_map, callback) {
  dbHandle.collection(
    obj_type,
    function(outer_error, collection) {
      collection.update(
        find_map, {
          $set: set_map
        }, {
          safe: true,
          multi: true,
          upsert: false
        },
        function(inner_error, update_count) {
          callback({
            update_count: update_count
          });
        }
      );
    }
  );
};

saveObj = function(obj_type, obj_map, callback) {
  dbHandle.collection(
    obj_type,
    function(outer_error, collection) {
      collection.save(        
        obj_map,         
        {safe: true},
        function(inner_error, result) {
          callback(result);
        }
      );
    }
  );
};

destroyObj = function(obj_type, find_map, callback) {
  dbHandle.collection(
    obj_type,
    function(outer_error, collection) {
      var options_map = {
        safe: true,
        single: true
      };

      collection.remove(find_map, options_map,
        function(inner_error, delete_count) {
          callback({
            delete_count: delete_count
          });
        }
      );
    }
  );
};

module.exports = {
  makeMongoId: mongodb.ObjectID,  
  construct: constructObj,
  read: readObj,
  save: saveObj,
  update: updateObj,
  destroy: destroyObj
};
// ----------------- END PUBLIC METHODS -----------------

// ------------- BEGIN MODULE INITIALIZATION --------------
dbHandle.open(function() {
  console.log('** Connected to GBQ **');
});

// -------------- END MODULE INITIALIZATION ---------------