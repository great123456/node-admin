var express = require('express');
var router = express.Router();

var fs = require("fs");
var func = require('../core/func');
var logger = require('../core/util/logger');
var rest = require('../core/restUrl');
var http = require('../core/util/http');
var httpClient = require('../core/util/httpClient').DHttpUtil;
var sd = require('silly-datetime');
var utils = require('../core/util/utils');

var restFulPotion = {
    host: rest.urls['emomo-yunkong']['host'],
    port: rest.urls['emomo-yunkong']['port'],
    postType: "json"
};
var restFulConf = rest.urls['emomo-yunkong'];

var PAGE_SIZE = 10;

/**
 * index
 */
router.get('/page', function (req, res, next) {
    var role = req.session.user.role;

    var searchKey = {};

    if (req.query.cityName != "") {
        searchKey.cityName = req.query.cityName;
    }

    if (req.query.number != "") {
        searchKey.number = req.query.number;
    }
    if (req.query.name != "") {
        searchKey.name = req.query.name;
    }


    if ('INDUSTRY_AGENT' ==role){
        searchKey.ownerId = req.session.user.uid;
    }


    var currentPage = req.query.currentPage|| 1;

    restFulPotion.path = restFulConf.findDeviceRegionByPage;
    restFulPotion.body = JSON.stringify({"currentPage": currentPage, "pageSize": PAGE_SIZE, keywords: searchKey});

    http.doPost(restFulPotion, function (status, data) {
        if (data != undefined && status == 200) {


            data.PRO_MENU = {"menu": "address", "subMenu": "myAddress"};

            data.role = role;

            if (data.data == undefined) {
                utils.pageMessage(req, res, "服务器内部错误", "index", "address", "myAddress");
            } else {
                res.render("deviceRegionPage", data);
            }
        } else {
            res.render("order");

        }
    });
});


router.get('/add', function (req, res, next) {

    data = {
        PRO_MENU : {"menu": "address", "subMenu": "addAddress"},
        role:req.session.user.role
    };
    res.render("deviceRegionAddPage", data);

});

router.post('/add', function (req, res, next) {
    var role = req.session.user.role;

    params = req.body;

    data = {
        number : req.body.number,
        name : req.body.name,
        description : req.body.description,
        address: req.body.address,
        latitude : req.body.latitude,
        longitude : req.body.longitude,
        cityName: req.body.cityName,
        cityId:req.body.cityId,
        districtName : req.body.districtName,
        districtId: req.body.districtId,
        provinceName : req.body.provinceName,
        provinceId : req.body.provinceId,
    };


    console.log(data);
/*    var imgUrl = "";

    if (params.img != undefined) {
        for (var i = 0; i < params.img.length; i++) {
            imgUrl += params.img[i] + ",";
        }
    }

    data.imgUrl = imgUrl;

    if ('INDUSTRY_AGENT' ==role){
        data.ownerName = req.session.user.loginName;
        data.ownerId=req.session.user.uid;
    }else {
        if ( req.body.loginName ==undefined || req.body.loginName ==''){
            utils.pageMessage(req, res, "管理员添加需要代理商姓名", "/deviceRegion/page", "address", "addAddress");
        }
        if (req.body.uid ==undefined || req.body.uid ==''){
            utils.pageMessage(req, res, "管理员添加需要代理商uid", "/deviceRegion/page", "address", "addAddress");
        }
        data.ownerName = req.body.loginName;
        data.ownerId=req.body.uid;
    }


    restFulPotion.path = restFulConf.addDeviceRegion;
    restFulPotion.body = JSON.stringify(data);

    http.doPost(restFulPotion, function (status, data) {
        console.log(data);
        if (data != undefined && status == 200 && data.code == 0) {
            utils.pageMessage(req, res, "添加成功", "/deviceRegion/page", "address", "addAddress");

        } else {
            utils.pageMessage(req, res, data.mes, "/deviceRegion/add", "address", "addAddress");
        }
    });*/
});


router.get('/update', function (req, res, next) {
    var role = req.session.user.role;
    params = req.query;
    id = params.id;
    callback = params.callback == undefined || params.callback == "" ? "/deviceRegion/page" : params.callback;
    if (id == undefined || id == "") {
        if (role == 'INDUSTRY_AGENT') {
            utils.pageMessage(req, res, "请求异常", callback, "address", "myAddress");
        } else {
            utils.pageMessage(req, res, "请求异常", callback, "device", "deviceRegionPage");
        }

    }

    restFulPotion.path = restFulConf.findDeviceRegionById + "/" + id;
    http.doGet(restFulPotion, function (status, data) {

        if (data != undefined && status == 200 && data.code == '0') {

            data["PRO_MENU"] = {"menu": "device", "subMenu": "deviceRegionPage"};
            if (role == 'INDUSTRY_AGENT') {
                data["PRO_MENU"] = {"menu": "address", "subMenu": "myAddress"};
            }
            res.render("deviceRegionUpdatePage", data);

            //res.send(data);
        } else {
            if (role == 'INDUSTRY_AGENT') {
                utils.pageMessage(req, res, data.mes, callback, "address", "myAddress");
            } else {
                utils.pageMessage(req, res, data.mes, callback, "device", "deviceRegionPage");
            }
        }
    });
});

router.post('/update', function (req, res, next) {
    var role = req.session.user.role;
    restFulPotion.path = restFulConf.updateDeviceRegion;

    params = req.body;

    data = {};
    data['number'] = params.number;
    data['name'] = params.name;
    data['description'] = params.desc;
    data['address'] = params.address || params.oldAddress;
    data['latitude'] = params.latitude;
    data['longitude'] = params.longitude;
    data['cityName'] = params.s_city;
    data['districtName'] = params.s_county;
    data['provinceName'] = params.s_province;


    imgUrl = params.img.join(",");
    data["imgUrl"] = imgUrl;

    //============================ session
    uid = req.session['user'].uid;
    data['ownerId'] = uid;

    restFulPotion.body = JSON.stringify(data);

    http.doPost(restFulPotion, function (status, data) {
        console.log(data);
        mes = "";
        if (data != undefined && status == 200 && data.code == 0) {
            mes = "修改成功";
        } else {
            mes = data.mes;
        }
        if (role == 'INDUSTRY_AGENT') {
            utils.pageMessage(req, res, mes, "/deviceRegion/page", "address", "myAddress");
        } else {
            utils.pageMessage(req, res, mes, "/deviceRegion/page", "device", "deviceRegionPage");
        }

    });
});
/**
 * 场所分润
 */
router.get('/share/page', function (req, res, next) {

    restFulPotion.path = restFulConf.findDeviceRegionByPage;
    //console.log(req);
    params = req.query;
    searchKey = {};


    if (params.number != "") {
        searchKey['number'] = params.number;
    }
    if (params.name != "") {
        searchKey['name'] = params.name;
    }
    uid = req.session['user'].uid;
    searchKey['ownerId'] = uid;
    currentPage = params.currentPage == "" ? 1 : params.currentPage;
    restFulPotion.body = JSON.stringify({"currentPage": currentPage, "pageSize": PAGE_SIZE, keywords: searchKey});

    http.doPost(restFulPotion, function (status, data) {
        if (data != undefined && status == 200) {
            data["PRO_MENU"] = {"menu": "subProxyAdminPage", "subMenu": "subProxyAdminPage"};
            console.log(data);
            res.render("deviceRegionSharePage", data);
            //res.send(data);
        } else {
            //res.send(dFunc.errJson);
            res.render("order");
        }
    });
});
/**
 * 场所分润设置页面
 */
router.get('/share/set/page', function (req, res, next) {
    var params = req.query;
    var regionId = params.id;
    var errorMsg = params.errorMsg;
    errorMsg = errorMsg == undefined ? "" : errorMsg;

    if (errorMsg == 1) {
        errorMsg = "分润比例设置失败";
    }

    //---------------------------------------session
    uid = req.session['user'].uid;
    retrunData = {};
    var restParams = {
        host: rest.urls['emomo-usersystem']['host'],
        port: rest.urls['emomo-usersystem']['port'],
        postType: "json"
    };
    restParams.path = rest.urls['emomo-usersystem']['findMyUsers'];
    currentPage = params.currentPage == "" ? 1 : params.currentPage;
    restParams.body = JSON.stringify({"currentPage": currentPage, "pageSize": "300", uid: uid});

    http.doPost(restParams, function (status, data) {

        if (data != undefined && status == 200) {
            retrunData['subProxyAdmin'] = data.data;
            retrunData["PRO_MENU"] = {"menu": "subProxyAdminPage", "subMenu": "subProxyAdminPage"};
            retrunData["regionId"] = regionId;
            retrunData["errorMsg"] = errorMsg;

            console.log(JSON.stringify(retrunData));
            res.render("deviceRegionBatchShareSetPage", retrunData);

        } else {
            res.render("index");
        }
    });
});
/**
 * 批量设置分润
 */
router.post('/setRegionBatchShare', function (req, res, next) {
    logger.info("批量设置场所分润");
    var body = req.body;

    var regionId = body.regionId;
    var proxyUserUid = req.session['user'].uid;

    restFulPotion.path = restFulConf.setDeviceRegionShare;

    restFulPotion.body = JSON.stringify({
        regionId: regionId,
        proxyUserUid: proxyUserUid,
        subProxyUserId: body.subProxyUserId,
        subProxyUserRate: body.subProxyUserRate
    });

    http.doPost(restFulPotion, function (status, data) {
        if (data.code == "0") {
            var url = "/deviceRegion/share/page";
            res.redirect(url);
        } else {
            var url = "/deviceRegion/share/set/page?id=" + regionId + "&errorMsg=1";
            res.redirect(url);
        }
    });
});
/**
 * 场地详情
 */
router.get('/detail', function (req, res, next) {
    var role = req.session.user.role;
    params = req.query;

    var condition = {
        currentPage: params.currentPage || 1,
        pageSize: PAGE_SIZE,
        regionNum: params.number
    };

    restFulPotion.path = restFulConf.deviceRegionDetail;
    restFulPotion.body = JSON.stringify(condition);

    http.doPost(restFulPotion, function (status, data) {
        if (data != undefined && status == 200 && data.code == "0") {
            data.data.keywords = condition;
            data.PRO_MENU = {"menu": "address", "subMenu": "myAddress"};
            res.render("deviceRegionDetailPage", data);
        } else {
            utils.pageMessage(req, res, data.mes, "/proxyDevice/page", "address", "myAddress");


        }
    });

});

module.exports = router;
