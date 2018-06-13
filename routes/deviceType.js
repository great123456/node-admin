

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

    restFulPotion.path =restFulConf.findDeviceTypePage;
    //console.log(req);
    params = req.query ;

    console.log(params);
    searchKey = utils.filterParams(params,["typeNum","typeName","brand","factoryName"]) ;


    currentPage = params.currentPage == "" ? 1 : params.currentPage;
    restFulPotion.body=JSON.stringify({"currentPage":currentPage,"pageSize":PAGE_SIZE,keywords:searchKey});

    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200){

            data["PRO_MENU"] ={"menu":"device","subMenu":"deviceTypePage"};

            res.render("deviceTypePage",data);
            //res.send(data);
        }else{
            utils.pageMessage(req,res,data.mes,"/deviceType/page","device","deviceTypePage");
        }
   });
  //res.render("order");

});

router.get('/add', function(req, res, next) {

    var restParams = {host:rest.urls['emomo-usersystem']['host'],port:rest.urls['emomo-usersystem']['port'],postType:"json"};
    restParams.path = rest.urls['emomo-usersystem']['allUserByRole'] + "/FACTORY_ADMIN";
    http.doGet(restParams,function(status,data){
        if(data!= undefined && status == 200 && data.code == '0'){


            data["PRO_MENU"] = {"menu":"device","subMenu":"deviceTypePage"};
            res.render("deviceTypeAddPage", data);

            //res.send(data);
        }else{
            utils.pageMessage(req,res,data.mes,"/deviceType/page","device","deviceTypePage");
        }
    });



});


router.post('/add', function(req, res, next) {

    restFulPotion.path =restFulConf.addDeviceType;

    params = req.body ;

    data = {} ;
    data['typeNum']     = params.typeNum ;
    data['typeName']    = params.typeName ;
    data['brand']       = params.brand ;
    data['factoryRate'] = params.factoryRate ;

    data['factoryUserId']    = params.factoryUserId || "" ;
    if(data['factoryUserId'] == "")
    {
        utils.pageMessage(req,res,'请选择厂商',"/deviceType/add","device","deviceTypePage");
    }

    data['factoryName']    = params.factoryName ;

    restFulPotion.body=JSON.stringify(data);

    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == 0){

            data["PRO_MENU"] ={"menu":"device","subMenu":"deviceTypePage"};
            utils.pageMessage(req,res,"添加成功","/deviceType/page","device","deviceTypePage");
        }else{
            utils.pageMessage(req,res,data.mes,"/deviceType/page","device","deviceTypePage");
        }
    });
});


router.post('/update', function(req, res, next) {

    params = req.body ;

    id = params.id ;
    if(id == undefined || id == "")
    {
        utils.pageMessage(req,res,"请选择要更新的批次记录","/deviceType/page","device","deviceTypePage");
    }


    data = {} ;
    data['id']          = params.id;
    data['typeNum']     = params.typeNum ;
    data['typeName']    = params.typeName ;
    data['brand']       = params.brand ;
    data['factoryRate'] = params.factoryRate ;

    restFulPotion.body=JSON.stringify(data);

    restFulPotion.path =restFulConf.updateDeviceType;
    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == 0){

            utils.pageMessage(req,res,"更新成功","/deviceType/page","device","deviceTypePage");

        }else{
            utils.pageMessage(req,res,data.mes,"/deviceType/page","device","deviceTypePage");
        }
    });

});

router.get('/update', function(req, res, next) {

    params = req.query ;

    id = params.id ;


    if(id == undefined || id == "")
    {
        utils.pageMessage(req,res,"请选择要更新的批次记录","/deviceType/page","device","deviceTypePage");
    }

    restFulPotion.path =restFulConf.findDeviceTypeById + id;


    http.doGet(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == 0){

            data["PRO_MENU"] ={"menu":"device","subMenu":"deviceTypePage"};
            res.render("deviceTypeUpdatePage",data);
        }else{
            utils.pageMessage(req,res,data.mes,"/deviceType/page","device","deviceTypePage");
        }
    });

});

module.exports = router;
