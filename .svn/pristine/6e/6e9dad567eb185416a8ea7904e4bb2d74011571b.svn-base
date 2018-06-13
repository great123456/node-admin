

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

/**
 * index
 */
router.get('/page', function(req, res, next) {


    var d = {
        currentPage:req.query.currentPage || 1,
        pageSize:req.query.pageSize ||PAGE_SIZE,
        deviceSn:req.query.deviceSn || '',
        deviceName:req.query.deviceName|| '',
        deviceType:req.query.deviceType|| '',
        shareStatus:req.query.shareStatus || '0'
    };

    var restFulPotion={
        host:rest.urls.emomoYunkong.host,
        port:rest.urls.emomoYunkong.port,
        path:rest.urls.emomoYunkong.findMyDevicePage,
        body:JSON.stringify(d)
    };

    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == "0"){
            d.PRO_MENU ={"menu":"device","subMenu":"proxyDevice"};
            d.list= data.data.list;
            d.totalPages = data.data.totalPages;
            res.render("devicePage",d);
        }else{
            utils.pageMessage(req,res,data.mes,"/device/page","device","proxyDevice");
        }
   });

});

router.get('/add', function(req, res, next) {

    retrunData = {};
    var tasklist = [];

    //批次
    tasklist.push(function (callback) {
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

    async.waterfall(tasklist, function (err, result) {
        if(err)
        {
            utils.pageMessage(req,res,err.msg,"/batch/page","device","batchPage");
        }else
        {
            retrunData["PRO_MENU"] = {"menu":"device","subMenu":"devicePage"};
            res.render("deviceAddPage", retrunData);
        }

    });

});


router.post('/add', function(req, res, next) {

    restFulPotion.path =restFulConf.addDevice;

    params = req.body ;

    data = {} ;
    data['deviceSn']     = params.deviceSn ;
    data['deviceName']    = params.deviceName ;
    data['deviceTypeId']       = params.deviceTypeId ;
    data['batchNum'] = params.batchNum ;
    data['description'] = params.description ;
    data['remark'] = params.remark ;


    restFulPotion.body=JSON.stringify(data);

    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == 0){

            data["PRO_MENU"] ={"menu":"device","subMenu":"devicePage"};
            utils.pageMessage(req,res,"添加成功","/device/page","device","devicePage");
        }else{
            utils.pageMessage(req,res,data.mes,"/device/page","device","devicePage");
        }
    });
});


router.post('/update', function(req, res, next) {

    params = req.body ;

    id = params.id ;
    if(id == undefined || id == "")
    {
        utils.pageMessage(req,res,"请选择要更新的设备","/device/page","device","devicePage");
    }
    console.log(params);
    data = {} ;
    data['deviceSn']     = params.deviceSn;
    data['deviceName']   = params.deviceName ;
    data['description']  = params.description ;
    data['deviceTypeId'] = params.deviceTypeId ;
    data['deviceType']   = params.deviceType ;
    data['batchNum']     = params.batchNum ;
    data['remark']       = params.remark ;

    restFulPotion.body=JSON.stringify(data);

    restFulPotion.path =restFulConf.updateDevice;
    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == 0){

            utils.pageMessage(req,res,"更新成功","/device/page","device","devicePage");

        }else{
            utils.pageMessage(req,res,data.mes,"/device/page","device","devicePage");
        }
    });

});

router.get('/update', function(req, res, next) {

    params = req.query ;

    id = params.id ;

    if(id == undefined || id == "") {
        utils.pageMessage(req,res,"请选择要更新的设备","/device/page","device","proxyDevice");
    }

    retrunData = {};
    var tasklist = [];
    tasklist.push(function (callback) {
        restFulPotion.path =restFulConf.findDeviceById + id;

        http.doGet(restFulPotion,function(status,data){
            if(data!= undefined&&status == 200 && data.code == 0){
                retrunData.device = data.data ;
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
                retrunData.batch   = data.data ;
                callback(null, retrunData);
            }else{
                retrunData.mes = data.mes;
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
                retrunData.deviceType  = data.data ;
                callback(null, retrunData);
            }else{
                retrunData.mes = data.mes;
                callback("err", data);
                return;
            }
        });
    });

    //设备价格
    tasklist.push(function (n, callback) {
        restParams = restFulPotion;
        restParams.path =restFulConf.findDevicePriceByDeviceSn + n.device.deviceSn;

        http.doGet(restParams,function(status,data){
            if(data!= undefined && status == 200 && data.code == "0"){
                retrunData.devicePrice  = data.data ;
                callback(null, retrunData);
            }else{
                retrunData.mes = data.mes;
                callback("err", data);
                return;
            }
        });
    });

    async.waterfall(tasklist, function (err, result) {
        if(err) {
            utils.pageMessage(req,res, retrunData.mes,"/device/page","device","proxyDevice");
        }else {
            retrunData["PRO_MENU"] = {"menu":"device","subMenu":"proxyDevice"};
            res.render("deviceUpdatePage", retrunData);
        }

    });


});




router.post('/price/add', function(req, res, next) {

    params = req.body ;

    id = params.id ;
    deviceSn = params.deviceSn;
    if(id == undefined || id == "" || deviceSn == undefined || deviceSn == "")
    {
        utils.pageMessage(req,res,"请选择要更新的设备","/device/page","device","devicePage");
    }
    data = {} ;
    data['deviceSn']          = params.deviceSn;
    data['price']     = params.price ;
    data['func']    = params.func ;
    data['functionCmd']       = params.functionCmd ;
    data['workTime']       = params.workTime ;

    restFulPotion.body=JSON.stringify(data);

    restFulPotion.path =restFulConf.addDevicePrice;
    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == 0){

            utils.pageMessage(req,res,"添加成功","/device/update?id="+id,"device","devicePage");

        }else{
            utils.pageMessage(req,res,data.mes,"/device/page","device","devicePage");
        }
    });

});

router.get('/price/add', function(req, res, next) {

    params = req.query ;

    sn = params.sn ;

    if(sn == undefined || sn == "")
    {
        utils.pageMessage(req,res,"请选择要更新的设备","/device/page","device","devicePage");
    }

    restFulPotion.path =restFulConf.findDeviceBySn + sn;

    http.doGet(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == 0){
            data["PRO_MENU"] = {"menu":"device","subMenu":"devicePage"};
            res.render("devicePriceAddPage", data);
        }else{
            utils.pageMessage(req,res,data.msg,"/batch/page","device","devicePage");
        }
    });

});

router.post('/price/del', function(req, res, next) {

    params = req.body ;
console.log(params) ;
    sn = params.deviceSn ;
    id = params.priceId ;
    deviceId = params.deviceId ;
    if(sn == undefined || sn == "" || id == undefined || id == "" || deviceId == undefined || deviceId == "")
    {
        utils.pageMessage(req,res,"请选择要操作的设备","/device/page","device","devicePage");
    }

    restFulPotion.path =restFulConf.delDevicePrice + sn + "/" + id;

    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == 0){
            data["PRO_MENU"] = {"menu":"device","subMenu":"devicePage"};
            utils.pageMessage(req,res,"删除成功","/device/update?id="+deviceId,"device","devicePage");
        }else{
            utils.pageMessage(req,res,data.msg,"/batch/page","device","devicePage");
        }
    });

});

router.post('/price/del', function(req, res, next) {

    params = req.body ;
    console.log(params) ;
    sn = params.deviceSn ;
    id = params.priceId ;
    deviceId = params.deviceId ;
    if(sn == undefined || sn == "" || id == undefined || id == "" || deviceId == undefined || deviceId == "")
    {
        utils.pageMessage(req,res,"请选择要操作的设备","/device/page","device","devicePage");
    }

    restFulPotion.path =restFulConf.delDevicePrice + sn + "/" + id;

    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == 0){
            data["PRO_MENU"] = {"menu":"device","subMenu":"devicePage"};
            utils.pageMessage(req,res,"删除成功","/device/update?id="+deviceId,"device","devicePage");
        }else{
            utils.pageMessage(req,res,data.msg,"/batch/page","device","devicePage");
        }
    });
});

router.post('/cmd', function(req, res, next) {

    params = req.body ;
    sn = params.deviceSn ;
    cmd = params.cmd ;
    if(sn == undefined || sn == "" || cmd == undefined || cmd == "")
    {
        utils.pageMessage(req,res,"请选择要操作的设备","/device/page","device","devicePage");
    }
    callback = params.callback == undefined || params.callback == "" ? "device/page" : params.callback ;

    restFulPotion.path =restFulConf.cmdDevice + cmd + "/" + sn;

    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == 0){
            data["PRO_MENU"] = {"menu":"device","subMenu":"devicePage"};

            utils.pageMessage(req,res,"操作成功",callback,"device","devicePage");
        }else{
            utils.pageMessage(req,res,data.msg,"/device/page","device","devicePage");
        }
    });

});


router.post('/allocation', function(req, res, next) {

    params = req.body ;

    deviceSns = params.deviceSns
    if( deviceSns == undefined || deviceSns == "")
    {
        utils.pageMessage(req,res,"请选择要更新的设备","/device/page","device","devicePage");
    }
    data = {} ;
    data['deviceSns']          = params.deviceSns;
    data['typeNum']            = params.typeNum ;
    data['batchNum']           = params.batchNum ;
    data['regionProxyUserId']  = params.regionProxyUserId ;

    //===================================session
    uid = req.session['user'].uid ;
    data['platformUserId']     = uid ;

    restFulPotion.body=JSON.stringify(data);

    restFulPotion.path =restFulConf.allocationDevice;
    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == 0){

            utils.pageMessage(req,res,"分配成功","/device/page","device","devicePage");

        }else{
            utils.pageMessage(req,res,data.mes,"/device/page","device","devicePage");
        }
    });

});

router.post('/allocationPage', function(req, res, next) {

    params = req.body ;

    deviceSns = params.deviceSns ;

    if(deviceSns == undefined || deviceSns == "")
    {
        utils.pageMessage(req,res,"请选择要分配的设备","/device/page","device","devicePage");
    }

    retrunData = {};
    var tasklist = [];

    //代理商
    tasklist.push(function (callback) {
        var restParams = {host:rest.urls['emomo-usersystem']['host'],port:rest.urls['emomo-usersystem']['port'],postType:"json"};
        restParams.path = rest.urls['emomo-usersystem']['allUserByRole'] + "/INDUSTRY_AGENT";

        http.doGet(restParams,function(status,data){
            if(data!= undefined && status == 200 && data.code == 0){
                retrunData['proxyAdmin'] = data.data ;
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

    //设备信息
    tasklist.push(function (n,callback) {
        restParams = restFulPotion;
        restParams.path =restFulConf.findDeviceBySns;

        data = {} ;
        data['deviceSns'] = deviceSns.split(",") ;
        restParams.body=JSON.stringify(data);

        http.doPost(restParams,function(status,data){
            if(data!= undefined && status == 200 && data.code == "0"){
                retrunData['devices']   = data.data ;
                retrunData['deviceSns']   = deviceSns ;
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
            utils.pageMessage(req,res,err.mes,"/batch/page","device","devicePage");
        }else
        {
            retrunData["PRO_MENU"] = {"menu":"device","subMenu":"devicePage"};
            res.render("deviceAllocationPage", retrunData);
        }

    });

});


/**
 * 批量添加
 */
router.get('/batch/add', function(req, res, next) {
    var retrunData ={PRO_MENU:{"menu":"device","subMenu":"devicePage"}};
    res.render("deviceBatchAddPage",retrunData);
});


/**
 * 设备分润管理
 */
router.get('/share/page', function(req, res, next) {

    restFulPotion.path =restFulConf.findMyDevicePage;
    //console.log(req);
    params = req.query ;

    currentPage = params.currentPage == "" ? 1 : params.currentPage;
    restFulPotion.body=JSON.stringify(
        {
            currentPage:currentPage,
            pageSize:PAGE_SIZE,
            deviceSn:params.deviceSn,
            deviceName:params.deviceName,
            deviceType:params.deviceType,
            shareStatus:0
        });
    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == "0"){
            data["PRO_MENU"] ={
                "menu":"sharePage",
                "subMenu":"batchSharePage"
            };
            data["keywords"] ={
                "shareStatus" : 0,
                "deviceType"  : params.deviceType,
                "deviceName"  : params.deviceName,
                "deviceSn"    : params.deviceSn
            };

            //console.log(JSON.stringify(data))
            res.render("deviceSharePage",data);
        }else{
            utils.pageMessage(req,res,data.mes,"/device/page","device","devicePage");
        }
    });



});

/**
 * 解除绑定
 */
router.post("/delete/bind", function(req, res, next) {
    console.log("解除绑定");
    var deviceSn =  req.body.deviceSn;
    console.log("deviceSn:"+deviceSn);
    restParams = restFulPotion;
    restParams.path =restFulConf.deleteBindDevice + deviceSn;

    http.doGet(restParams,function(status,data){
        if(data.code == "0"){
            res.send(data);
        }else{
            func.error.data = data.mes;
            res.send(func.error);
        }
    });

});


/**
 * 单个设置分润
 */
router.get('/single/setShare/page', function(req, res, next) {
    console.log("单个设置分润");
    var deviceSn =  req.query.deviceSn;
    console.log("deviceSn:"+deviceSn);

    var data ={
        PRO_MENU:{
        "menu":"sharePage",
        "subMenu":"batchSharePage"
        },
        deviceSn:deviceSn
    }

    res.render('deviceSingleShareSetPage',data);
});

/**
 * 设置分润比例
 */
router.post('/single/share/set',function(req, res,next){
    console.log("设置分润比例");
    var body = req.body;

    restFulPotion.path =restFulConf.setSingleDeviceShare;
    restFulPotion.body=JSON.stringify(body);
    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == "0"){
            res.send(data);
        }else{
            func.error.mes = data.mes;
            res.send(func.error);
        }
    });


});


router.post('/updatePrice',function(req, res,next){
    console.log("------updatePrice----------");
    var body= req.body;
    var arr =[];
    arr.push(body);
    restFulPotion.path =restFulConf.updatePrice;
    restFulPotion.body=JSON.stringify(arr);

    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == "0"){
            utils.pageMessage(req,res,data.mes,"/device/page","device","devicePage");
        }else{
            utils.pageMessage(req,res,data.mes,"/device/page","device","devicePage");
        }
    });
});

router.post('/setParm',function(req, res,next){
    console.log("------setParm----------");
    var body= req.body;
    
    restFulPotion.path =restFulConf.setParm;
    restFulPotion.body=JSON.stringify(body);

    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == "0"){
            utils.pageMessage(req,res,data.mes,"/device/page","device","devicePage");
        }else{
            utils.pageMessage(req,res,data.mes,"/device/page","device","devicePage");
        }
    });
});

router.post('/card/support',function (req,res) {
    console.log(req.body.cardList);
    console.log(req.body.currentPage);
    var currentPage = req.body.currentPage;
    var restFulPotion = {
        host: rest.urls.emomoYunkong.host,
        port: rest.urls.emomoYunkong.port,
        path: rest.urls.emomoYunkong.cardSupport,
        body: req.body.cardList
    };

    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code =='0'){
            utils.pageMessage(req,res,data.mes,"/device/page","device","devicePage");
        }else{
            utils.pageMessage(req,res,data.mes,"/device/page?currentPage="+currentPage,"device","devicePage");
        }
    });
});


module.exports = router;
