
var express = require('express');
var router  = express.Router();

var fs      = require("fs");
var func    = require('../core/func');
var logger  = require('../core/util/logger');
var rest    = require('../core/restUrl').urls;
var utils   = require('../core/util/utils');
var http   = require('../core/util/http');
var httpClient   = require('../core/util/httpClient').DHttpUtil;

var PAGE_SIZE = 10 ;

router.get('/devicepage', function(req, res, next) {

	var uid = req.session.user.uid;
	if (uid ==undefined){
        utils.pageMessage(req,res,"参数错误","/index","error","errorDevice");
	}
	var currentPage = req.query.currentPage ||1;
	var data ={
        currentPage:req.query.currentPage || 1,
        pageSize:req.query.pageSize || PAGE_SIZE,
        uid:uid,
	};

    var code=parseInt(req.query.code);
    var name = req.query.name
    if (name!='' && name!=undefined) {
        switch(code){
            case 0:
                break;
            case 1:
                data.regionName =name;
                break;
            case 2:
                data.devNumber =name;
                break;
        }
    }

	var restFulPotion = {
		host : rest.emomoYunkong.host,
		port : rest.emomoYunkong.port,
		path : rest.emomoYunkong.errorDevice,
		body : JSON.stringify(data)
	};

	http.doPost(restFulPotion,function(status,d){
	
		if(d!= undefined && status == 200 && d.code == "0"){
            data.PRO_MENU ={"menu":"error","subMenu":"errorDevice"};
			data.data = d.data;
			data.totalPages = d.data.totalPages;
			data.code =code;
			data.name=name;

			res.render("errorDevice",data);
		}else{
			utils.pageMessage(req,res,d.mes,"/index","error","errorDevice");
		}
	});
});

router.get('/orderpage', function(req, res, next) {


    var uid = req.session.user.uid;
    if (uid ==undefined){
        utils.pageMessage(req,res,"参数错误","/index","error","errorOrder");
    }

    var currentPage = req.query.currentPage ||1;

    var code=parseInt(req.query.code);
    var name = req.query.name
    if (name!='' && name!=undefined) {
        switch(code){
            case 0:
                break;
            case 1:
                data.regionName =name;
                break;
            case 2:
                data.devNumber =name;
                break;
        }
    }

	var data = {
		uid:uid,
		currentPage:currentPage,
		pageSize:PAGE_SIZE,
	};

	var restFulPotion = {
		host : rest.emomoYunkong.host,
		port : rest.emomoYunkong.port,
		path : rest.emomoYunkong.errorOrder,
		body : JSON.stringify(data)
	};

	http.doPost(restFulPotion,function(status,d){
	
		if(d!= undefined && status == 200 && d.code == "0"){
			data.data = d.data;
			data.totalPages = d.data.totalPages;
            data.PRO_MENU = {"menu":"error","subMenu":"errorOrder"};
            data.code =code;
            data.name=name;
			res.render("errorOrder",data);
		}else{
			utils.pageMessage(req,res,d.mes,"/index","error","errorOrder");
		}
	});
});

router.post('/orderpage', function(req, res, next) {

	console.log(req.body);

	var uid = req.session.user.uid;	
	var currentPage = req.body.currentPage;
	var name = req.body.name;

	var data ={}
	data.PRO_MENU = {"menu":"error","subMenu":"errorOrder"};
	data.currentPage = currentPage;
	data.code =req.body.code ;
	data.name =req.body.name;

	var body = {
		uid:uid,
		currentPage:currentPage,
		pageSize:PAGE_SIZE,
	};

	if (name!='') {
	    var code = parseInt(req.body.code)
		switch(code){
			case 0:
            	break;
        	case 1: 
            	body.regionName =name; 
            	break;
        	case 2:
            	body.devNumber =name; 
            	break;
		}
	}

	var restFulPotion = {
		host : rest.emomoYunkong.host,
		port : rest.emomoYunkong.port,
		path : rest.emomoYunkong.errorOrder,
		body : JSON.stringify(body)
	}

	http.doPost(restFulPotion,function(status,d){
		
		if(d!= undefined && status == 200 && d.code == "0"){
			data.data = d.data;
			data.totalPages = d.data.totalPages;
			res.render("errorOrder",data);
		}else{
			utils.pageMessage(req,res,d.mes,"/error/orderpage","error","errorOrder");
		}
	});
});
module.exports = router;