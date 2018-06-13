/**
 * Created by Administrator on 2017/6/15.
 *  jie
 */
var express = require('express');
var router  = express.Router();

var func    = require('../core/func');
var rest    = require('../core/restUrl').urls;
var http   = require('../core/util/http');
var httpClient   = require('../core/util/httpClient').DHttpUtil;
var utils   = require('../core/util/utils');

var PAGE_SIZE = 10 ;

router.post('/region', function(req, res, next) {
    var data = {
        currentPage:req.body.currentPage || 1,
        pageSize:req.body.pageSize ||PAGE_SIZE,
    };

    var restFulPotion = {
        host : rest.emomoYunkong.host,
        port : rest.emomoYunkong.port,
        path : rest.emomoYunkong.regionPage,
        body :JSON.stringify(data)
    };

    http.doPost(restFulPotion,function (status,d) {
        if (status ==200 && d.data!=null &&d.code =='0') {
            data.PRO_MENU = {"menu":"market","subMenu":"region"};
            data.list =d.data.list ;
            data.totalPages=d.data.totalPages;
            data.code =200;
        }else {
            data.mes =d.mes;
            data.code =500;
        }
        res.send(data);

    });
});

router.post('/page', function(req, res, next) {

    var data = {
        uid:req.body.uid,
        currentPage:req.body.currentPage || 1,
        pageSize:req.body.pageSize ||PAGE_SIZE,

    };

    if (data.uid ==undefined) {
        data.code =500;
        data.mes ='参数错误';
        res.send(data);
        return;
    }

    var restFulPotion = {
        host : rest.emomoYunkong.host,
        port : rest.emomoYunkong.port,
        path : rest.emomoYunkong.marketPage,
        body :JSON.stringify(data)
    };

    http.doPost(restFulPotion,function (status,d) {

        if (status ==200 && d.data!=null &&d.code =='0') {
            data.PRO_MENU = {"menu":"market","subMenu":"page"};
            data.list =d.data.list ;
            data.totalPages=d.data.totalPages ;
            data.code =200;
        }else {
            data.code =500;
            data.mes =d.mes;
        }
        res.send(data);
    });
});

router.post('/add', function(req, res, next) {

    if (req.body.uid ==undefined) {
        utils.pageMessage(req,res,'参数错误',"/index","market","page");
        return;
    }

    if (req.body.number ==undefined){
        utils.pageMessage(req,res,'参数错误',"/index","market","page");
        return;
    }

    var data = {
        uid:req.body.uid,
        number:req.body.number,
    };

    var restFulPotion = {
        host : rest.emomoYunkong.host,
        port : rest.emomoYunkong.port,
        path : rest.emomoYunkong.regionAdd,
        body :JSON.stringify(data)
    };

    http.doPost(restFulPotion,function (status,d) {

        if (status ==200 && d.data!=null &&d.code =='0') {
            data.code =200;
        }else {
            data.code =500;
        }
        data.data = d.data;
        data.mes = d.mes;
        res.send(data);
    });
});

router.post('/delete', function(req, res, next) {

    if (req.body.uid ==undefined || req.body.id ==undefined) {
        utils.pageMessage(req,res,'参数错误',"/index","market","page");
        return;
    }

    var data = {
        uid:req.body.uid,
        id:req.body.id,
    };

    var restFulPotion = {
        host : rest.emomoYunkong.host,
        port : rest.emomoYunkong.port,
        path : rest.emomoYunkong.regionDelete,
        body :JSON.stringify(data)
    };

    http.doPost(restFulPotion,function (status,d) {

        if (status ==200 &&d.code =='0') {
            data.code =200;
        }else {
            data.mes=d.mes;
            data.code =500;
        }
        console.log(data);
        res.send(data);

    });
});

router.get('/region', function(req, res, next) {
    var data = {
        currentPage:req.query.currentPage || 1,
        pageSize:req.query.pageSize ||PAGE_SIZE,
    };

    var restFulPotion = {
        host : rest.emomoYunkong.host,
        port : rest.emomoYunkong.port,
        path : rest.emomoYunkong.regionPage,
        body :JSON.stringify(data)
    };

    http.doPost(restFulPotion,function (status,d) {
        if (status ==200 && d.data!=null &&d.code =='0') {
           data.PRO_MENU = {"menu":"market","subMenu":"region"};
           data.list =d.data.list ;
           data.totalPages=d.data.totalPages ;
           res.render("marketRegion",data);
        }else {
           utils.pageMessage(req,res,d.mes,"/index","market","region");
       }

    });
});

router.get('/page', function(req, res, next) {

    req.session.user.uid ='4ce0b19ad3230bd0';

    if (req.session.user.uid ==undefined) {
        utils.pageMessage(req,res,'参数错误',"/index","market","page");
        return;
    }

    var data = {
        uid:req.session.user.uid,
        currentPage:req.query.currentPage || 1,
        pageSize:req.query.pageSize ||PAGE_SIZE,

    };

    var restFulPotion = {
        host : rest.emomoYunkong.host,
        port : rest.emomoYunkong.port,
        path : rest.emomoYunkong.marketPage,
        body :JSON.stringify(data)
    };

    http.doPost(restFulPotion,function (status,d) {
        console.log('==========123=========');
        console.log(d.data.list);
        if (status ==200 && d.data!=null &&d.code =='0') {
            data.PRO_MENU = {"menu":"market","subMenu":"page"};
            data.list =d.data.list ;
            data.totalPages=d.data.totalPages ;
            res.render("market",data);
        }else {
            utils.pageMessage(req,res,d.mes,"/index","market","page");
        }

    });
});

router.get('/add', function(req, res, next) {


    if (req.body.uid ==undefined) {
        utils.pageMessage(req,res,'参数错误',"/index","market","page");
        return;
    }

    if (req.body.number ==undefined){
        utils.pageMessage(req,res,'参数错误',"/index","market","page");
        return;
    }

    var data = {
        uid:req.session.user.uid,
        number:req.body.number,
        currentPage:req.query.currentPage || 1,
        pageSize:req.query.pageSize ||PAGE_SIZE,

    };

    var restFulPotion = {
        host : rest.emomoYunkong.host,
        port : rest.emomoYunkong.port,
        path : rest.emomoYunkong.regionAdd,
        body :JSON.stringify(data)
    };

    http.doPost(restFulPotion,function (status,d) {

        console.log(d.data.list);
        if (status ==200 && d.data!=null &&d.code =='0') {
            data.PRO_MENU = {"menu":"market","subMenu":"page"};
            data.list =d.data.list ;
            data.totalPages=d.data.totalPages ;
            res.render("market",data);
        }else {
            utils.pageMessage(req,res,d.mes,"/index","market","page");
        }

    });
});

router.get('/delete', function(req, res, next) {



    if (req.body.uid ==undefined) {
        utils.pageMessage(req,res,'参数错误',"/index","market","page");
        return;
    }

    if (req.body.number ==undefined){
        utils.pageMessage(req,res,'参数错误',"/index","market","page");
        return;
    }

    var data = {
        uid:req.session.user.uid,
        number:req.body.number,
        currentPage:req.query.currentPage || 1,
        pageSize:req.query.pageSize ||PAGE_SIZE,

    };

    var restFulPotion = {
        host : rest.emomoYunkong.host,
        port : rest.emomoYunkong.port,
        path : rest.emomoYunkong.regionAdd,
        body :JSON.stringify(data)
    };

    http.doPost(restFulPotion,function (status,d) {
        console.log('==========123=========');
        console.log(d.data.list);
        if (status ==200 && d.data!=null &&d.code =='0') {
            data.PRO_MENU = {"menu":"market","subMenu":"page"};
            data.list =d.data.list ;
            data.totalPages=d.data.totalPages ;
            res.render("market",data);
        }else {
            utils.pageMessage(req,res,d.mes,"/index","market","page");
        }

    });
});


module.exports = router;