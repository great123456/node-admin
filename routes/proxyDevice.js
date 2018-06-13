var express = require('express');
var router = express.Router();

var fs = require("fs");
var func = require('../core/func');
var logger = require('../core/util/logger');
var rest = require('../core/restUrl');
var utils = require('../core/util/utils');
var http = require('../core/util/http');
var httpClient = require('../core/util/httpClient').DHttpUtil;
var sd = require('silly-datetime');

var async = require('async');

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

    var searchKey = {
        isAllocationed:req.query.isAllocationed,
        connStatusCode:req.query.connStatusCode,
        statusCode:req.query.statusCode,
        currentPage:req.query.currentPage || 1,
        pageSize : req.query.pageSize || PAGE_SIZE
    };

    if ('INDUSTRY_AGENT' ==role){
        searchKey.uid = req.session.user.uid;
    }else {
        searchKey.uid = req.query.ownerId;
    }

    restFulPotion.path = restFulConf.proxyDevice;
    restFulPotion.body = JSON.stringify(searchKey);

    http.doPost(restFulPotion, function (status, data) {
        if (data != undefined && status == 200 && data.code == "0") {

            data.data.keywords = searchKey;
            data.role = role;
            data.code = 0;
            data.uid =searchKey.uid;
            if (data.data.list == undefined) {
                utils.pageMessage(req, res, "服务器内部错误", "/index", "superAdmin", "subProxyAdminPage");
            } else {
                console.log(data);

                if (role == 'INDUSTRY_AGENT'){
                    data.PRO_MENU = {"menu": "device", "subMenu": "proxyDevice"};
                    res.render("proxyDevicePage", data);
                }else {
                    data.PRO_MENU = {"menu": "address", "subMenu": "myAddress"};
                    res.render("proxyDevicePage", data);
                }
            }
        } else {
            utils.pageMessage(req, res, data.mes, "/index", "device", "proxyDevice");
        }
    });
});


router.post('/page', function (req, res, next) {
    var role = req.session.user.role;

    console.log(req.body);

    var searchKey = {};
    searchKey.pageSize = PAGE_SIZE;
    searchKey.uid = req.body.uid;
    searchKey.currentPage = req.body.currentPage;


    var code = parseInt(req.body.code);

    switch (code) {
        case 0:
            break;
        case 1:
            searchKey.isAllocationed = false;
            break;
        case 2:
            searchKey.isAllocationed = true;
            break;
        case 3:
            searchKey.connStatusCode = '1';
            break;
        case 4:
            searchKey.connStatusCode = '0';
            break;
        case 5:
            searchKey.connStatusCode = '02';
            break;
    }

    if (req.body.statusCode != undefined) {
        searchKey.statusCode = req.body.statusCode;
    }

    if (req.body.name != undefined && req.body.name != '') {
        var num = req.body.term;
        console.log('num =', num);
        if (num == '1') {
            searchKey.devNumber = req.body.name;
        } else if (num == '2') {
            searchKey.regionName = req.body.name;
        } else if (num == '3') {
            searchKey.regionName = req.body.name;
        } else if (num == '4') {
            searchKey.deviceName = req.body.name;
        }
    }

    restFulPotion.path = restFulConf.proxyDevice;
    restFulPotion.body = JSON.stringify(searchKey);

    console.log(restFulPotion.body);


    http.doPost(restFulPotion, function (status, data) {
        if (data != undefined && status == 200 && data.code == "0") {

            data.data.keywords = searchKey;
            data.role = role;
            data.code = code;
            data.uid =searchKey.uid;
            if (data.data.list == undefined) {
                utils.pageMessage(req, res, "服务器内部错误", "/index", "superAdmin", "subProxyAdminPage");
            } else {
                if (role == 'INDUSTRY_AGENT'){
                    data.PRO_MENU = {"menu": "device", "subMenu": "proxyDevice"};
                    res.render("proxyDevicePage", data);
                }else {
                    data.PRO_MENU = {"menu": "address", "subMenu": "myAddress"};
                    res.render("proxyDevicePage", data);
                }

            }
        } else {
            utils.pageMessage(req, res, data.mes, "/index", "device", "proxyDevice");
        }
    });
});


router.post('/update', function (req, res, next) {

    params = req.body;

    id = params.id;
    if (id == undefined || id == "") {
        utils.pageMessage(req, res, "请选择要更新的设备", "/device/page", "device", "devicePage");
    }
    console.log(params);
    data = {};
    data['deviceSn'] = params.deviceSn;
    data['deviceName'] = params.deviceName;
    data['description'] = params.description;
    data['remark'] = params.remark;

    restFulPotion.body = JSON.stringify(data);

    restFulPotion.path = restFulConf.updateDevice;
    http.doPost(restFulPotion, function (status, data) {
        if (data != undefined && status == 200 && data.code == 0) {

            utils.pageMessage(req, res, "更新成功", "/device/page", "device", "devicePage");

        } else {
            utils.pageMessage(req, res, data.mes, "/index", "device", "devicePage");
        }
    });

});

router.get('/update', function (req, res, next) {

    params = req.query;

    id = params.id;

    if (id == undefined || id == "") {
        utils.pageMessage(req, res, "请选择要更新的设备", "/proxyDevice/page", "device", "proxyDevice");
    }

    retrunData = {};
    var tasklist = [];
    tasklist.push(function (callback) {
        restFulPotion.path = restFulConf.findDeviceById + id;

        http.doGet(restFulPotion, function (status, data) {
            if (data != undefined && status == 200 && data.code == 0) {
                retrunData['device'] = data.data;
                callback(null, retrunData);
            } else {
                callback("err", data);
                return;
            }
        });
    });

    //场所
    tasklist.push(function (n, callback) {
        restParams = restFulPotion;
        restParams.path = restFulConf.findDeviceRegionByNumber + retrunData['device']['regionNumber'];

        http.doGet(restParams, function (status, data) {
            if (data != undefined && status == 200 && data.code == "0") {
                retrunData['deviceRegion'] = data.data;
                callback(null, retrunData);
            } else {
                retrunData['deviceRegion'] = {};
                callback(null, retrunData);
            }
        });
    });

    //批次
    tasklist.push(function (n, callback) {
        restParams = restFulPotion;
        restParams.path = restFulConf.findBatchAll;

        http.doGet(restParams, function (status, data) {
            if (data != undefined && status == 200 && data.code == "0") {
                retrunData['batch'] = data.data;
                callback(null, retrunData);
            } else {
                callback("err", data);
                return;
            }
        });
    });

    //类型
    tasklist.push(function (n, callback) {
        restParams = restFulPotion;
        restParams.path = restFulConf.findDeviceTypeAll;

        http.doGet(restParams, function (status, data) {
            if (data != undefined && status == 200 && data.code == "0") {
                retrunData['deviceType'] = data.data;
                callback(null, retrunData);
            } else {
                callback("err", data);
                return;
            }
        });
    });

    //设备类型
    tasklist.push(function (n, callback) {
        restParams = restFulPotion;
        restParams.path = restFulConf.findDevicePriceByDeviceSn + n.device.deviceSn;

        http.doGet(restParams, function (status, data) {
            if (data != undefined && status == 200 && data.code == "0") {
                retrunData['devicePrice'] = data.data;
                callback(null, retrunData);
            } else {
                callback("err", data);
                return;
            }
        });
    });

    async.waterfall(tasklist, function (err, result) {
        if (err) {
            utils.pageMessage(req, res, err.mes, "/index", "device", "proxyDevice");
        } else {
            retrunData["PRO_MENU"] = {"menu": "device", "subMenu": "proxyDevice"};
            res.render("proxyDeviceUpdatePage", retrunData);
        }

    });


});


router.post('/price/add', function (req, res, next) {

    params = req.body;

    id = params.id;
    deviceSn = params.deviceSn
    if (id == undefined || id == "" || deviceSn == undefined || deviceSn == "") {
        utils.pageMessage(req, res, "请选择要更新的设备", "/device/page", "device", "devicePage");
    }
    data = {};
    data['deviceSn'] = params.deviceSn;
    data['price'] = params.price;
    data['func'] = params.func;
    data['functionCmd'] = params.functionCmd;
    data['workTime'] = params.workTime;

    restFulPotion.body = JSON.stringify(data);

    restFulPotion.path = restFulConf.addDevicePrice;
    http.doPost(restFulPotion, function (status, data) {
        if (data != undefined && status == 200 && data.code == 0) {

            utils.pageMessage(req, res, "添加成功", "/device/update?id=" + id, "device", "devicePage");

        } else {
            utils.pageMessage(req, res, data.mes, "/index", "device", "devicePage");
        }
    });

});

router.get('/price/add', function (req, res, next) {

    params = req.query;

    sn = params.sn;

    if (sn == undefined || sn == "") {
        utils.pageMessage(req, res, "请选择要更新的设备", "/device/page", "device", "devicePage");
    }

    restFulPotion.path = restFulConf.findDeviceBySn + sn;

    http.doGet(restFulPotion, function (status, data) {
        if (data != undefined && status == 200 && data.code == 0) {
            data["PRO_MENU"] = {"menu": "device", "subMenu": "devicePage"};
            res.render("devicePriceAddPage", data);
        } else {
            utils.pageMessage(req, res, data.msg, "/batch/page", "device", "devicePage");
        }
    });

});

router.post('/price/del', function (req, res, next) {

    params = req.body;
    console.log(params);
    sn = params.deviceSn;
    id = params.priceId;
    deviceId = params.deviceId;
    if (sn == undefined || sn == "" || id == undefined || id == "" || deviceId == undefined || deviceId == "") {
        utils.pageMessage(req, res, "请选择要操作的设备", "/device/page", "device", "devicePage");
    }

    restFulPotion.path = restFulConf.delDevicePrice + sn + "/" + id;

    http.doPost(restFulPotion, function (status, data) {
        if (data != undefined && status == 200 && data.code == 0) {
            data["PRO_MENU"] = {"menu": "device", "subMenu": "devicePage"};
            utils.pageMessage(req, res, "删除成功", "/device/update?id=" + deviceId, "device", "devicePage");
        } else {
            utils.pageMessage(req, res, data.msg, "/batch/page", "device", "devicePage");
        }
    });

});

router.post('/price/del', function (req, res, next) {

    params = req.body;
    console.log(params);
    sn = params.deviceSn;
    id = params.priceId;
    deviceId = params.deviceId;
    if (sn == undefined || sn == "" || id == undefined || id == "" || deviceId == undefined || deviceId == "") {
        utils.pageMessage(req, res, "请选择要操作的设备", "/device/page", "device", "devicePage");
    }

    restFulPotion.path = restFulConf.delDevicePrice + sn + "/" + id;

    http.doPost(restFulPotion, function (status, data) {
        if (data != undefined && status == 200 && data.code == 0) {
            data["PRO_MENU"] = {"menu": "device", "subMenu": "devicePage"};
            utils.pageMessage(req, res, "删除成功", "/device/update?id=" + deviceId, "device", "devicePage");
        } else {
            utils.pageMessage(req, res, data.msg, "/batch/page", "device", "devicePage");
        }
    });
});

router.post('/cmd', function (req, res, next) {

    params = req.body;
    sn = params.deviceSn;
    cmd = params.cmd;
    if (sn == undefined || sn == "" || cmd == undefined || cmd == "") {
        utils.pageMessage(req, res, "请选择要操作的设备", "/device/page", "device", "devicePage");
    }
    callback = params.callback == undefined || params.callback == "" ? "device/page" : params.callback;

    restFulPotion.path = restFulConf.cmdDevice + cmd + "/" + sn;

    http.doPost(restFulPotion, function (status, data) {
        if (data != undefined && status == 200 && data.code == 0) {
            data["PRO_MENU"] = {"menu": "device", "subMenu": "devicePage"};

            utils.pageMessage(req, res, "操作成功", callback, "device", "devicePage");
        } else {
            utils.pageMessage(req, res, data.msg, "/device/page", "device", "devicePage");
        }
    });

});


router.post('/bindRegion', function (req, res, next) {

    params = req.body;

    deviceSns = params.deviceSns
    if (deviceSns == undefined || deviceSns == "") {
        utils.pageMessage(req, res, "请选择要更新的设备", "/device/page", "device", "devicePage");
    }
    data = {};
    data['deviceSns'] = params.deviceSns;

    data['regionNumber'] = params.regionNumber;
    restFulPotion.body = JSON.stringify(data);
    //===================================session
    uid = req.session['user'].uid;


    restFulPotion.path = restFulConf.bindDeviceRegion + uid;
    http.doPost(restFulPotion, function (status, data) {
        if (data != undefined && status == 200 && data.code == 0) {

            utils.pageMessage(req, res, "绑定成功", "/proxyDevice/page", "device", "proxyDevice");

        } else {
            utils.pageMessage(req, res, data.mes, "/proxyDevic/page", "device", "proxyDevice");
        }
    });

});
//TODO
router.post('/bindRegionPage', function (req, res, next) {

    params = req.body;

    console.log('---------bindRegionPage---------');
    console.log(params);
    deviceSns = params.deviceSns;

    console.log("bindRegionPage" + deviceSns);

    if (deviceSns == undefined || deviceSns == "") {
        utils.pageMessage(req, res, "请选择要分配的设备", "/proxyDevice/page", "device", "proxyDevice");
    }

    retrunData = {};
    var tasklist = [];
    tasklist.push(function (callback) {
        uid = req.session['user'].uid;
        restParams = restFulPotion;
        restParams.path = restFulConf.deviceRegionAll + uid;
        //---------------------------session

        http.doGet(restParams, function (status, data) {
            if (data != undefined && status == 200 && data.code == 0) {
                retrunData['deviceRegion'] = data.data;
                callback(null, retrunData);
            } else {
                callback("err", data);
                return;
            }
        });
    });

    //设备信息
    tasklist.push(function (n, callback) {
        restParams = restFulPotion;
        restParams.path = restFulConf.findDeviceBySns;

        data = {};
        data['deviceSns'] = deviceSns.split(",");
        console.log("push findDeviceSns" + JSON.stringify(data));
        restParams.body = JSON.stringify(data);


        http.doPost(restParams, function (status, data) {
            if (data != undefined && status == 200 && data.code == "0") {
                console.log("push findDeviceSns" + data.data);
                retrunData['devices'] = data.data;
                retrunData['deviceSns'] = deviceSns;
                callback(null, retrunData);
            } else {
                callback("err", data);
                return;
            }
        });
    });

    async.waterfall(tasklist, function (err, result) {
        if (err) {
            utils.pageMessage(req, res, err.msg, "/proxyDevice/page", "device", "proxyDevice");
        } else {
            retrunData["PRO_MENU"] = {"menu": "device", "subMenu": "proxyDevice"};
            res.render("deviceBindPage", retrunData);
        }

    });

});

router.post('/unbindRegion', function (req, res, next) {

    params = req.body;
    deviceSn = params.deviceSn
    if (deviceSn == undefined || deviceSn == "") {
        utils.pageMessage(req, res, "请选择要解绑的设备", "/proxyDevice/page", "device", "proxyDevice");
    }


    //===================================session
    uid = req.session['user'].uid;


    restFulPotion.path = restFulConf.unbindDeviceRegion + uid + "/" + deviceSn;
    http.doPost(restFulPotion, function (status, data) {
        callback = params.callback == undefined || params.callback == "" ? "proxyDevice/page" : params.callback;
        if (data != undefined && status == 200 && data.code == 0) {

            utils.pageMessage(req, res, "解绑成功", callback, "device", "proxyDevice");

        } else {
            utils.pageMessage(req, res, data.mes, callback, "device", "proxyDevice");
        }
    });

});


/**
 * 设备与子代理商的绑定
 */
router.get('/bindSubProxyPage', function (req, res, next) {

    params = req.query;

    deviceSns = params.deviceSns;

    if (deviceSns == undefined || deviceSns == "") {
        utils.pageMessage(req, res, "请选择要分配的设备", "/proxyDevice/page", "device", "proxyDevice");
    }

    // roleId;//代理商：INDUSTRY_AGENT 子代理商|场地管理员：CITY_OPERATOR  厂商：FACTORY_ADMIN 平台管理员：YUNKONG_PLATFORM_ADMIN
    //---------------------------------------session
    uid = req.session['user'].uid;

    retrunData = {};
    var tasklist = [];
    tasklist.push(function (callback) {

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
                //res.send(data);
                callback(null, retrunData);
            } else {
                callback("err", data);
                return;
            }
        });
    });

    //设备信息
    tasklist.push(function (n, callback) {
        restParams = restFulPotion;
        restParams.path = restFulConf.findDeviceBySns;

        data = {};
        data['deviceSns'] = deviceSns.split(",");
        restParams.body = JSON.stringify(data);

        http.doPost(restParams, function (status, data) {
            if (data != undefined && status == 200 && data.code == "0") {
                retrunData['devices'] = data.data;
                retrunData['deviceSns'] = deviceSns;
                callback(null, retrunData);
            } else {
                callback("err", data);
                return;
            }
        });
    });

    //设备分享子代理商信息
    tasklist.push(function (n, callback) {
        restParams = restFulPotion;
        restParams.path = restFulConf.shareDeviceSubProxy + uid + "/" + deviceSns.split(",");

        http.doGet(restParams, function (status, data) {
            if (data != undefined && status == 200 && data.code == "0") {
                tmpData = {};
                for (var i = 0; i < data.data.length; i++) {
                    tmpData[data.data[i]['subProxyUserId']] = data.data[i];
                }
                retrunData['subProxyShare'] = tmpData;
                callback(null, retrunData);
            } else {
                callback("err", data);
                return;
            }
        });
    });


    //设备分享信息
    tasklist.push(function (n, callback) {
        restParams = restFulPotion;
        restParams.path = restFulConf.getDeviceShare + uid + "/" + deviceSns.split(",");

        http.doGet(restParams, function (status, data) {
            if (data != undefined && status == 200 && data.code == "0") {

                retrunData['deviceShare'] = data.data;
                callback(null, retrunData);
            } else {
                callback("err", data);
                return;
            }
        });
    });

    async.waterfall(tasklist, function (err, result) {
        if (err) {
            utils.pageMessage(req, res, err.msg, "/proxyDevice/page", "device", "proxyDevice");
        } else {
            retrunData["PRO_MENU"] = {"menu": "device", "subMenu": "proxyDevice"};
            res.render("deviceBindSubProxyPage", retrunData);
        }
    });
});

//TODO 因存在2个界面 未做界面处理
router.post('/bindSubProxy', function (req, res, next) {

    var params = req.body;


    var deviceSns = params.deviceSns;
    var subProxyUserId = params.subProxyUserId;
    var subProxyUserRate = params.subProxyUserRate
    if (deviceSns == undefined || deviceSns == "") {
        utils.pageMessage(req, res, "请选择要绑定的设备", "/proxyDevice/page", "device", "proxyDevice");
    }


    var subProxys = [];
    subProxys.push({"subProxyUserId": params.subProxyUserId, "subProxyUserRate": params.subProxyUserRate});
    var data = {
        subProxys: subProxys,
        subProxyUserAllRate: subProxyUserRate
    };


    var uid = req.session.user.uid;
    restFulPotion.path = restFulConf.bindDeviceMoreSubProxy + uid + "/" + deviceSns.split(",");
    restFulPotion.body = JSON.stringify(data);

    http.doPost(restFulPotion, function (status, d) {
        console.log(d);
        if (data != undefined && status == 200 && data.code == 0) {
            utils.pageMessage(req, res, '操作成功', '/deviceRegion/page', "device", "proxyDevice");
        } else {
            utils.pageMessage(req, res, data.mes, '/deviceRegion/page', "device", "proxyDevice");
        }
    });

});


router.post('/unbindSubProxy', function (req, res, next) {

    params = req.body;
    deviceSn = params.deviceSn
    if (deviceSn == undefined || deviceSn == "") {
        utils.pageMessage(req, res, "请选择要解绑的设备", "/proxyDevice/page", "device", "proxyDevice");
    }


    uid = req.session['user'].uid;

    //data.PRO_MENU = {"menu":"device","subMenu":"proxyDevice"};
    restFulPotion.path = restFulConf.unbindDeviceRegion + uid + "/" + deviceSn;
    http.doPost(restFulPotion, function (status, data) {
        callback = params.callback == undefined || params.callback == "" ? "proxyDevice/page" : params.callback;
        if (data != undefined && status == 200 && data.code == 0) {

            if (req.session.MEMBER_ROLE = 'INDUSTRY_AGENT') {
                utils.pageMessage(req, res, "解绑成功", "/proxyDevice/page", "device", "proxyDevice");
            } else {
                utils.pageMessage(req, res, "解绑成功", callback, "device", "proxyDevice");
            }
        } else {
            utils.pageMessage(req, res, data.mes, callback, "device", "proxyDevice");
        }
    });

});

module.exports = router;
