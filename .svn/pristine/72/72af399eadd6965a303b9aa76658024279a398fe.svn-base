

var express = require('express');
var router  = express.Router();

var fs      = require("fs");
var func    = require('../core/func');
var logger  = require('../core/util/logger');
var rest    = require('../core/restUrl');
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


  restFulPotion.path =restFulConf.findOrderPage;
    //console.log(req);

  searchKey = {};
    if(req.query.deviceSn != "")
    {
        searchKey['deviceSn'] = req.query.deviceSn ;
    }
    if(req.query.orderSn != "")
    {
        searchKey['orderSn'] = req.query.orderSn ;
    }
    currentPage = req.query.currentPage == "" ? 1 : req.query.currentPage;
  restFulPotion.body=JSON.stringify({"currentPage":currentPage,"pageSize":PAGE_SIZE,keywords:searchKey});
  http.doPost(restFulPotion,function(status,data){
   if(data!= undefined && status == 200){

       data["PRO_MENU"] ={"menu":"order","subMenu":"orderPage"};
       console.log(data);
   res.render("order",data);
   //res.send(data);
   }else{
   //res.send(dFunc.errJson);
   res.render("order");
   }
   });
  //res.render("order");

});





module.exports = router;
