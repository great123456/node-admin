

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

var async = require('async');

var restFulPotion = {host:rest.urls['emomo-yunkong']['host'],port:rest.urls['emomo-yunkong']['port'],postType:"json"};
var restFulConf = rest.urls['emomo-yunkong'] ;

var PAGE_SIZE = 10 ;

router.get('/page', function(req, res, next) {


    //console.log(req);
    params = req.query ;

    searchKey = {} ;

    uid = req.session['user'].uid ;
    searchKey["currentPage"]  = params.currentPage == "" ? 1 : params.currentPage ;
    searchKey["pageSize"]     =  PAGE_SIZE;


    restFulPotion.body=JSON.stringify(searchKey);

    //req.session.MEMBER_ROLE = "FACTORY_ADMIN";
    var MEMBER_ROLE = req.session['user'].role;
    if(MEMBER_ROLE == "CITY_OPERATOR") {
        restFulPotion.path =restFulConf.subProxyDevice + uid;
    }else if(MEMBER_ROLE == "FACTORY_ADMIN") {
        restFulPotion.path =restFulConf.factoryDevice + uid;
    }else {
        utils.pageMessage(req,res,"登录状态异常","/index","index","");
    }

    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == "0"){

            data["data"]["keywords"] = searchKey ;
            data["PRO_MENU"]         = {"menu":"device","subMenu":"roleDevicePage"};
            data["PAGEURL"]          = "/roleDevice/page";



            res.render("roleDevicePage",data);
        }else{
            utils.pageMessage(req,res,data.mes,"/roleDevice/page","device","roleDevicePage");
        }
    });

});

router.get('/device', function(req, res, next) {

    params = req.query ;

    id = params.id ;

    if(id == undefined || id == "")
    {
        utils.pageMessage(req,res,"请选择要更新的设备","/roleDevice/page","device","roleDevicePage");
    }

    retrunData = {};
    var tasklist = [];
    tasklist.push(function (callback) {
        restFulPotion.path =restFulConf.findDeviceById + id;

        http.doGet(restFulPotion,function(status,data){
            if(data!= undefined && status == 200 && data.code == 0){
                retrunData['device'] = data.data ;
                callback(null, retrunData);
            }else{
                callback("err", data);
                return;
            }
        });
    });

    //批次
    tasklist.push(function (n,callback) {
        restParams = restFulPotion;
        restParams.path =restFulConf.findBatchAll;

        http.doGet(restParams,function(status,data){
            if(data!= undefined && status == 200 && data.code == "0"){
                retrunData['batch']   = data.data ;
                callback(null, retrunData);
            }else{
                callback("err", data);
                return;
            }
        });
    });

    //类型
    tasklist.push(function (n, callback) {
        restParams = restFulPotion;
        restParams.path =restFulConf.findDeviceTypeAll;

        http.doGet(restParams,function(status,data){
            if(data!= undefined && status == 200 && data.code == "0"){
                retrunData['deviceType']  = data.data ;
                callback(null, retrunData);
            }else{
                callback("err", data);
                return;
            }
        });
    });

    //设备类型
    tasklist.push(function (n, callback) {
        restParams = restFulPotion;
        restParams.path =restFulConf.findDevicePriceByDeviceSn + n.device.deviceSn;

        http.doGet(restParams,function(status,data){
            if(data!= undefined && status == 200 && data.code == "0"){
                retrunData['devicePrice']  = data.data ;
                callback(null, retrunData);
            }else{
                callback("err", data);
                return;
            }
        });
    });

    async.waterfall(tasklist, function (err, result) {
        if(err)
        {
            utils.pageMessage(req,res,err.msg,"/roleDevice/page","roleDevice","roleDevicePage");
        }else
        {
            retrunData["PRO_MENU"] = {"menu":"device","subMenu":"roleDevicePage"};
            res.render("deviceInfoPage", retrunData);
        }

    });

});


module.exports = router;
