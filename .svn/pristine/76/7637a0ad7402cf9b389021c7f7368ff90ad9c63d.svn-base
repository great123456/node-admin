

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

var PAGE_SIZE = 10 ;

/**
 * index
 */
router.get('/page', function(req, res, next) {

    restFulPotion.path =restFulConf.findWxUserPage;
    //console.log(req);
    params = req.query ;

    searchKey = utils.filterParams(params,["nickname"]) ;


    currentPage = params.currentPage == "" ? 1 : params.currentPage;
    restFulPotion.body=JSON.stringify({"currentPage":currentPage,"pageSize":PAGE_SIZE,keywords:searchKey});

    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200){

            data["PRO_MENU"] ={"menu":"wxUser","subMenu":"wxUserPage"};

            res.render("wxUserPage",data);
            //res.send(data);
        }else{
            //res.send(dFunc.errJson);
            res.render("order");
        }
   });
  //res.render("order");

});


/**
 *
 */
router.get('/evaluatePage', function(req, res, next) {

    restFulPotion.path =restFulConf.findWxUserEvaluatePage;
    //console.log(req);
    params = req.query ;

    searchKey = utils.filterParams(params,["deviceSn", "deviceName", "memberPhone", "feebackStatus"]) ;

    currentPage = params.currentPage == "" ? 1 : params.currentPage;
    restFulPotion.body=JSON.stringify({"currentPage":currentPage,"pageSize":PAGE_SIZE,keywords:searchKey});

    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200){

            data["PRO_MENU"] ={"menu":"wxUser","subMenu":"evaluatePage"};
            console.log(data);
            res.render("wxUserEvaluatePage",data);
            //res.send(data);
        }else{
            //res.send(dFunc.errJson);
            res.render("order");
        }
    });
    //res.render("order");

});


module.exports = router;
