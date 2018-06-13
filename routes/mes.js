

var express = require('express');
var router  = express.Router();

var fs      = require("fs");
var func    = require('../core/func');
var logger  = require('../core/util/logger');
var rest    = require('../core/restUrl');
var utils   = require('../core/util/utils');
var http   = require('../core/util/http');
var httpClient   = require('../core/util/httpClient').DHttpUtil;
var sd     = require('silly-datetime');



var restFulPotion = {host:rest.urls['emomo-yunkong']['host'],port:rest.urls['emomo-yunkong']['port'],postType:"json"};
var restFulConf = rest.urls['emomo-yunkong'] ;


/**
 * index
 */
router.get('/', function(req, res, next) {


    params = req.query ;
    console.log(encodeURIComponent("/fdafds/fdsafdsa"));
    data = {
        mes : params.mes ,
        backUrl : params.backUrl ,
        PRO_MENU : {
            "menu":params.menu,
            "subMenu":params.subMenu
        },
    }

    res.render("mes",data);


});



module.exports = router;
