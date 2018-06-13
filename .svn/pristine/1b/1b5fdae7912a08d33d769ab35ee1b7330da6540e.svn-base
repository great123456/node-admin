

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

    restFulPotion.path =restFulConf.findBatchPage;
    //console.log(req);
    params = req.query ;

    searchKey = utils.filterParams(params,["batchName","batchNum"]) ;


    currentPage = params.currentPage == "" ? 1 : params.currentPage;
    restFulPotion.body=JSON.stringify({"currentPage":currentPage,"pageSize":PAGE_SIZE,keywords:searchKey});

    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200){

            data["PRO_MENU"] ={"menu":"device","subMenu":"batchPage"};

            res.render("batchPage",data);
            //res.send(data);
        }else{
            //res.send(dFunc.errJson);
            res.render("order");
        }
   });
  //res.render("order");

});

router.get('/add', function(req, res, next) {

    data = {};
    data["PRO_MENU"] = {"menu":"device","subMenu":"batchPage"};
    res.render("batchAddPage", data);
    /*data = {};
    data = {"menu":"device","subMenu":"batchPage","mes":"fdsafds","backUrl":""};

    //utils.pageMessage(req,res,data);
    utils.pageMessage(req,res,"fdafds","/batch/page","device","batchPage");*/
});


router.post('/add', function(req, res, next) {

    restFulPotion.path =restFulConf.addBatch;

    params = req.body ;

    data = {} ;
    data['batchName']   = params.batchName ;
    data['batchNum']    = params.batchNum ;

    restFulPotion.body=JSON.stringify(data);

    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == 0){

            data["PRO_MENU"] ={"menu":"device","subMenu":"batchPage"};
            utils.pageMessage(req,res,"添加成功","/batch/page","device","batchPage");
        }else{
            utils.pageMessage(req,res,data.mes,"/batch/page","device","batchPage");
        }
    });
});


router.post('/update', function(req, res, next) {

    params = req.body ;

    batchId = params.id ;
    if(batchId == undefined || batchId == "")
    {
        utils.pageMessage(req,res,"请选择要更新的批次记录","/batch/page","device","batchPage");
    }


    data = {} ;
    data['id']          = params.id;
    data['batchName']   = params.batchName ;
    data['batchNum']    = params.batchNum ;

    restFulPotion.body=JSON.stringify(data);

    restFulPotion.path =restFulConf.updateBatch;
    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == 0){

            utils.pageMessage(req,res,"更新成功","/batch/page","device","batchPage");

        }else{
            utils.pageMessage(req,res,data.mes,"/batch/page","device","batchPage");
        }
    });

});

router.get('/update', function(req, res, next) {

    params = req.query ;

    batchId = params.batchId ;
    console.log(batchId);

    if(batchId == undefined || batchId == "")
    {
        utils.pageMessage(req,res,"请选择要更新的批次记录","/batch/page","device","batchPage");
    }

    restFulPotion.path =restFulConf.findBatchById + batchId;


    http.doGet(restFulPotion,function(status,data){
        if(data!= undefined && status == 200 && data.code == 0){

            data["PRO_MENU"] ={"menu":"device","subMenu":"batchPage"};
            res.render("batchUpdatePage",data);
        }else{
            utils.pageMessage(req,res,data.mes,"/batch/page","device","batchPage");
        }
    });

});



router.get('/share/page', function(req, res, next) {

    restFulPotion.path =restFulConf.findBatchPage;
    //console.log(req);
    params = req.query ;

    searchKey = utils.filterParams(params,["batchName","batchNum"]) ;


    currentPage = params.currentPage == "" ? 1 : params.currentPage;
    restFulPotion.body=JSON.stringify({"currentPage":currentPage,"pageSize":PAGE_SIZE,keywords:searchKey});

    http.doPost(restFulPotion,function(status,data){
        if(data!= undefined && status == 200){

            data["PRO_MENU"] ={
                "menu":"sharePage",
                "subMenu":"batchSharePage"
            };

            res.render("batchSharePage",data);
            //res.send(data);
        }else{
            //res.send(dFunc.errJson);
            res.render("order");
        }
    });

});


/**
 * 批量导入分润
 */
router.get('/share/batchadd/page', function(req, res, next) {
    var data ={
        PRO_MENU:{
            "menu":"sharePage",
            "subMenu":"batchSharePage"
        }
    };

    res.render("batchShareAddPage",data);
});


/**
 * 批量设置分润
 */
router.get('/setShare/page', function(req, res, next) {
    console.log(" 批量设置分润");
    var batchNum =  req.query.batchNum;
    console.log("batchNum:"+batchNum);

    var data ={
        PRO_MENU:{
            "menu":"sharePage",
            "subMenu":"batchSharePage"
        },
        batchNum:batchNum
    }

    res.render('deviceBatchShareSetPage',data);
});


/**
 * 批量设置分润比例
 */
router.post('/share/set',function(req, res,next){
    console.log("设置分润比例");
    var body = req.body;

    restFulPotion.path =restFulConf.setBatchDeviceShare;
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




module.exports = router;
