var express = require('express');
var router = express.Router();

var fs = require("fs");
var func = require('../core/func');
var logger = require('../core/util/logger');
var rest = require('../core/restUrl');
var http = require('../core/util/http');
var sd = require('silly-datetime');
var utils = require('../core/util/utils');

var restFulPotion = {
    host: rest.urls['emomo-usersystem']['host'],
    port: rest.urls['emomo-usersystem']['port'],
    postType: "json"
};
var restFulConf = rest.urls['emomo-usersystem'];

var restYkFulPotion = {
    host: rest.urls['emomo-yunkong']['host'],
    port: rest.urls['emomo-yunkong']['port'],
    postType: "json"
};
var restYkFulConf = rest.urls['emomo-yunkong'];

var PAGE_SIZE = 10;

/**
 * 平台管理员
 */
router.get('/platfrom', function (req, res, next) {

    restParams = {
        path: rest.urls['emomo-yunkong'].findMyUsers,
        host: rest.urls['emomo-yunkong']['host'],
        port: rest.urls['emomo-yunkong']['port'],
        postType: "json"
    };

    //console.log(req);
    params = req.query;

    var currentPage = params.currentPage||1;
    restParams.body = JSON.stringify({
        "currentPage": currentPage,
        "pageSize": PAGE_SIZE,
        roleId: "YUNKONG_PLATFORM_ADMIN"
    });

    http.doPost(restParams, function (status, data) {

        if (data != undefined && status == 200) {

            data.PRO_MENU = {"menu": "superAdmin", "subMenu": "platformAdminPage"};

            res.render("platformAdminPage", data);
        } else {

            utils.pageMessage(req, res, data.mes, "/superAdmin/platform", "superAdmin", "platformAdminPage");
        }
    });

});
router.get('/platfrom/add', function (req, res, next) {

    data = {
        PRO_MENU:{"menu": "superAdmin", "subMenu": "platformAdminPage"}
    };
    res.render("platformAdminAddPage", data);

});
router.post('/platfrom/add', function (req, res, next) {

    restParams = restYkFulPotion;
    restParams.path = restYkFulConf.addUserPlatFormAdmin;

    params = req.body;

    // roleId;//代理商：INDUSTRY_AGENT 子代理商|场地管理员：CITY_OPERATOR  厂商：FACTORY_ADMIN 平台管理员：YUNKONG_PLATFORM_ADMIN
    data = {};
    data['roleId'] = "YUNKONG_PLATFORM_ADMIN";
    data['loginName'] = params['loginName'];
    data['nickName'] = params['nickName'];
    data['phone'] = params['phone'];
    data['name'] = params['name'];
    data['password'] = params['password'];
    data['idNum'] = params['idNum'] || "";
    data['address'] = params['address'] || "";


    data['parentUserId'] = req.session['user'].uid;

    restParams.body = JSON.stringify(data);

    http.doPost(restParams, function (status, data) {

        if (data != undefined && status == 200 && data.code == '0') {

            data["PRO_MENU"] = {"menu": "device", "subMenu": "batchPage"};
            utils.pageMessage(req, res, "添加成功", "/super/platform", "superAdmin", "platformAdminPage");

            //res.send(data);
        } else {
            //res.send(dFunc.errJson);
            utils.pageMessage(req, res, data.mes, "/super/platfrom", "superAdmin", "platformAdminPage");
        }
    });

});


/**
 * 代理商
 */
router.get('/proxyAdmin', function (req, res, next) {

    restParams = {
        path: rest.urls['emomo-yunkong'].findMyUsers,
        host: rest.urls['emomo-yunkong']['host'],
        port: rest.urls['emomo-yunkong']['port'],
        postType: "json"
    };
    params = req.query;


    var currentPage = params.currentPage || 1;
    // roleId;//代理商：INDUSTRY_AGENT 子代理商|场地管理员：CITY_OPERATOR  厂商：FACTORY_ADMIN 平台管理员：YUNKONG_PLATFORM_ADMIN
    restParams.body = JSON.stringify({"currentPage": currentPage, "pageSize": PAGE_SIZE, roleId: "INDUSTRY_AGENT"});

    http.doPost(restParams, function (status, data) {

        if (data != undefined && status == 200) {

            data["PRO_MENU"] = {"menu": "superAdmin", "subMenu": "proxyAdminPage"};

            res.render("proxyAdminPage", data);

            //res.send(data);
        } else {
            //res.send(dFunc.errJson);
            utils.pageMessage(req, res, data.mes, "/superAdmin/proxyAdmin", "superAdmin", "proxyAdminPage");
        }
    });

});

router.post('/proxyAdmin', function (req, res, next) {

    var params = req.body;

    var body = {
        "currentPage": params.currentPage || 1,
        "pageSize": PAGE_SIZE,
        roleId: "INDUSTRY_AGENT"
    };
    var restParams = {
        path: rest.urls['emomo-yunkong'].findMyUsers,
        host: rest.urls['emomo-yunkong']['host'],
        port: rest.urls['emomo-yunkong']['port'],
        postType: "json",
        body:JSON.stringify(body)
    };


    http.doPost(restParams, function (status, data) {
        console.log(data);
        if (data != undefined && status == 200 &&data.code =='0') {
            data.code = 200;
            res.send(data);
        } else {
            data.mes = '服务器错误';
            data.code = 500;
            res.send(data);
        }
    });

});

router.get('/proxyAdmin/add', function (req, res, next) {

    data = {};
    data["PRO_MENU"] = {"menu": "superAdmin", "subMenu": "proxyAdminPage"};
    res.render("proxyAdminAddPage", data);
    /*data = {};
     data = {"menu":"device","subMenu":"batchPage","mes":"fdsafds","backUrl":""};

     //utils.pageMessage(req,res,data);
     utils.pageMessage(req,res,"fdafds","/batch/page","device","batchPage");*/
});
router.post('/proxyAdmin/add', function (req, res, next) {

    restParams = restYkFulPotion;
    restParams.path = restYkFulConf.addUserProxyAdmin;
    //console.log(req);
    params = req.body;

    // roleId;//代理商：INDUSTRY_AGENT 子代理商|场地管理员：CITY_OPERATOR  厂商：FACTORY_ADMIN 平台管理员：YUNKONG_PLATFORM_ADMIN
    data = {};
    data['roleId'] = "INDUSTRY_AGENT";
    data['loginName'] = params['loginName'];
    data['nickName'] = params['nickName'];
    data['phone'] = params['phone'];
    data['name'] = params['name'];
    data['password'] = params['password'];
    data['idNum'] = params['idNum'] || "";
    data['address'] = params['address'] || "";

    uid = req.session['user'].uid;
    data['parentUserId'] = uid;

    restParams.body = JSON.stringify(data);

    http.doPost(restParams, function (status, data) {

        if (data != undefined && status == 200 && data.code == '0') {

            utils.pageMessage(req, res, "添加成功", "/super/proxyAdmin", "superAdmin", "proxyAdminPage");

            //res.send(data);
        } else {
            //res.send(dFunc.errJson);
            utils.pageMessage(req, res, data.mes, "/super/proxyAdmin", "superAdmin", "proxyAdminPage");
        }
    });

});


/**
 * 子代理商
 */
router.get('/subProxyAdmin', function (req, res, next) {
    var role = req.session.user.role;
    restParams = {
        path: rest.urls['emomo-yunkong'].findMyUsers,
        host: rest.urls['emomo-yunkong']['host'],
        port: rest.urls['emomo-yunkong']['port'],
        postType: "json"
    };

    //console.log(req);
    params = req.query;


    currentPage = params.currentPage == "" ? 1 : params.currentPage;
    // roleId;//代理商：INDUSTRY_AGENT 子代理商|场地管理员：CITY_OPERATOR  厂商：FACTORY_ADMIN 平台管理员：YUNKONG_PLATFORM_ADMIN
    //---------------------------------------session
    uid = req.session['user'].uid;
    var roleId = req.session['user'].role;
    restParams.body = JSON.stringify({
        "currentPage": currentPage,
        "pageSize": PAGE_SIZE,
        uid: uid,
        roleId: 'CITY_OPERATOR'
    });


    http.doPost(restParams, function (status, data) {

        if (data != undefined && status == 200) {

            data["PRO_MENU"] = {"menu": "superAdmin", "subMenu": "subProxyAdminPage"};
            data.role = role;
            console.log('-------------');
            console.log(data);
            if (data.data == undefined) {
                utils.pageMessage(req, res, "服务器内部错误", "/superAdmin/subProxyAdmin", "superAdmin", "subProxyAdminPage");
            }
            res.render("subProxyAdminPage", data);

            //res.send(data);
        } else {
            //res.send(dFunc.errJson);
            utils.pageMessage(req, res, data.mes, "/superAdmin/subProxyAdmin", "superAdmin", "subProxyAdminPage");
        }
    });

});

router.get('/subProxyAdmin/add', function (req, res, next) {
    console.log('----------------');
    console.log(req.session.user.role);
    var role = req.session.user.role;

    data = {};
    data["PRO_MENU"] = {"menu": "superAdmin", "subMenu": "subProxyAdminPage"};
    if (role == 'INDUSTRY_AGENT') {
        data["PRO_MENU"] = {"menu": "superAdmin", "subMenu": "add"};
    }
    res.render("subProxyAdminAddPage", data);

});
router.post('/subProxyAdmin/add', function (req, res, next) {

    restParams = restYkFulPotion;
    restParams.path = restYkFulConf.addSubProxyAdmin;
    //console.log(req);
    params = req.body;

    // roleId;//代理商：INDUSTRY_AGENT 子代理商|场地管理员：CITY_OPERATOR  厂商：FACTORY_ADMIN 平台管理员：YUNKONG_PLATFORM_ADMIN
    data = {};
    data['roleId'] = "CITY_OPERATOR";
    data['loginName'] = params['loginName'];
    data['nickName'] = params['nickName'];
    data['phone'] = params['phone'];
    data['name'] = params['name'];
    data['password'] = params['password'];
    data['idNum'] = params['idNum'] || "";
    data['address'] = params['address'] || "";

    //---------------------------------------------------session
    uid = req.session['user'].uid;
    data['parentUserId'] = uid;


    restParams.body = JSON.stringify(data);

    http.doPost(restParams, function (status, data) {

        if (data != undefined && status == 200 && data.code == '0') {

            utils.pageMessage(req, res, "添加成功", "/super/subProxyAdmin", "superAdmin", "subProxyAdminPage");

            //res.send(data);
        } else {
            //res.send(dFunc.errJson);
            utils.pageMessage(req, res, data.mes, "/super/subProxyAdmin", "superAdmin", "subProxyAdminPage");
        }
    });

});

/**
 * 厂商
 */
router.get('/factoryAdmin', function (req, res, next) {

    restParams = {
        path: rest.urls['emomo-yunkong'].findMyUsers,
        host: rest.urls['emomo-yunkong']['host'],
        port: rest.urls['emomo-yunkong']['port'],
        postType: "json"
    };
    //console.log(req);
    params = req.query;


    currentPage = params.currentPage == "" ? 1 : params.currentPage;
    // roleId;//代理商：INDUSTRY_AGENT 子代理商|场地管理员：CITY_OPERATOR  厂商：FACTORY_ADMIN 平台管理员：YUNKONG_PLATFORM_ADMIN
    restParams.body = JSON.stringify({"currentPage": currentPage, "pageSize": PAGE_SIZE, roleId: "FACTORY_ADMIN"});

    http.doPost(restParams, function (status, data) {

        if (data != undefined && status == 200) {

            data["PRO_MENU"] = {"menu": "superAdmin", "subMenu": "factoryAdminPage"};

            res.render("factoryAdminPage", data);

            //res.send(data);
        } else {
            //res.send(dFunc.errJson);
            utils.pageMessage(req, res, data.mes, "/superAdmin/factoryAdmin", "superAdmin", "factoryAdminPage");
        }
    });

});
router.get('/factoryAdmin/add', function (req, res, next) {

    data = {};
    data["PRO_MENU"] = {"menu": "superAdmin", "subMenu": "factoryAdminPage"};
    res.render("factoryAdminAddPage", data);
});
router.post('/factoryAdmin/add', function (req, res, next) {

    restParams = restYkFulPotion;
    restParams.path = restYkFulConf.addUserFactoryAdmin;
    //console.log(req);
    params = req.body;

    // roleId;//代理商：INDUSTRY_AGENT 子代理商|场地管理员：CITY_OPERATOR  厂商：FACTORY_ADMIN 平台管理员：YUNKONG_PLATFORM_ADMIN
    data = {};
    data['roleId'] = "FACTORY_ADMIN";
    data['loginName'] = params['loginName'];
    data['nickName'] = params['nickName'];
    data['phone'] = params['phone'];
    data['name'] = params['name'];
    data['password'] = params['password'];
    data['idNum'] = params['idNum'] || "";
    data['address'] = params['address'] || "";

    restParams.body = JSON.stringify(data);

    http.doPost(restParams, function (status, data) {

        if (data != undefined && status == 200 && data.code == '0') {

            utils.pageMessage(req, res, "添加成功", "/super/factoryAdmin", "superAdmin", "factoryAdminPage");

            //res.send(data);
        } else {
            //res.send(dFunc.errJson);
            utils.pageMessage(req, res, data.mes, "/super/factoryAdmin", "superAdmin", "factoryAdminPage");
        }
    });

});

router.get('/operatorAdmin', function (req, res, next) {

    var data = {
        currentPage: req.query.currentPage || 1,
        pageSize: req.query.pageSize || PAGE_SIZE,
        roleId: 'YUNKONG_PLATFORM_OPERATOR'
    };

    var restFulPotion = {
        host: rest.urls.emomoYunkong.host,
        port: rest.urls.emomoYunkong.port,
        path: rest.urls.emomoYunkong.findMyUsers,
        body: JSON.stringify(data)
    };

    http.doPost(restFulPotion, function (status, data) {

        if (data != undefined && status == 200) {

            data.PRO_MENU = {"menu": "superAdmin", "subMenu": "operatorPage"};
            res.render("operatorAdminPage", data);
        } else {
            utils.pageMessage(req, res, data.mes, "/index", "superAdmin", "operatorPage");
        }
    });

});

router.get('/operatorAdmin/add', function (req, res, next) {
    data.PRO_MENU = {"menu": "superAdmin", "subMenu": "operatorPage"};

    res.render("operatorAdminAdd", data);

});


router.post('/operatorAdmin/add', function (req, res, next) {

    data = {
        roleId: 'YUNKONG_PLATFORM_OPERATOR',
        loginName: req.body.loginName,
        nickName: req.body.nickName,
        phone: req.body.phone,
        name: req.body.name,
        idNum: req.body.idNum || '',
        address: req.body.address,
        parentUserId: req.session.user.uid,
        password: req.body.password
    };

    var restFulPotion = {
        host: rest.urls.emomoYunkong.host,
        port: rest.urls.emomoYunkong.port,
        path: rest.urls.emomoYunkong.findMarketMessage,
        body: JSON.stringify(data)
    };

    http.doPost(restFulPotion, function (status, data) {
        console.log('--------data-------------');
        console.log(status);
        console.log(data);
        if (data != undefined && status == 200 && data.code == '0') {
            data.PRO_MENU = {"menu": "superAdmin", "subMenu": "operatorPage"};
            utils.pageMessage(req, res, "添加成功", "/super/operatorAdmin", "superAdmin", "operatorPage");
        } else {
            utils.pageMessage(req, res, data.mes, "/super/operatorAdmin", "superAdmin", "operatorPage");
        }
    });

});


/**
 * 岗位查询
 */
router.get('/role', function (req, res, next) {
    var resData = {
        "PRO_MENU": {
            "menu": "superAdmin",
            "subMenu": "rolePage"
        },
        list: []
    };

    var restFulPotion = {
        host: rest.urls['emomo-usersystem']['host'],
        port: rest.urls['emomo-usersystem']['port'],
        path: rest.urls['emomo-usersystem'].findAllRole + "/" + req.session['user'].role
    };

    http.doGet(restFulPotion, function (status, data) {
        var result = JSON.toString(data);
        logger.info(result);
        if (data.code == "0") {
            resData.list = data.data;
            res.render("rolePage", resData);
        } else {
            res.render("rolePage", resData);
        }
    });


});

module.exports = router;
