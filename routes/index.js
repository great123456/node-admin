var express = require('express');
var router  = express.Router();

var fs      = require("fs");
var func    = require('../core/func');
var logger  = require('../core/util/logger');
var rest    = require('../core/restUrl');
var http   = require('../core/util/http');
var sd     = require('silly-datetime');

/**
 * index
 */
router.get('/index', function(req, res, next) {
  data = {};
  data["PRO_MENU"] ={"menu":"index","subMenu":"index"};
  res.render("index",data);
});


/**
 * index
 */
router.get('/', function(req, res, next) {
 
  res.redirect("index");
});





module.exports = router;
