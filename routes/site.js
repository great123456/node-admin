var express = require('express');
var router  = express.Router();

var func    = require('../core/func');
var logger  = require('../core/util/logger');
var rest    = require('../core/restUrl').urls;
var http   = require('../core/util/http');
var httpClient   = require('../core/util/httpClient').DHttpUtil;
var sd     = require('silly-datetime');
var utils   = require('../core/util/utils');
var async = require('async');

var PAGE_SIZE = 10 ;

/**
 * index
 */
router.get('/page', function(req, res, next) {

	if (req.query.regionNum ==undefined){
        utils.pageMessage(req,res,"参数错误","/deviceRegion/page","address","myAddress");
	}

	var data = {
		currentPage:req.query.currentPage || 1,
		pageSize:req.query.pageSize ||PAGE_SIZE,
		regionNum:req.query.regionNum
	};

	var restFulPotion = {
		host : rest.emomoYunkong.host,
		port : rest.emomoYunkong.port,
		path : rest.emomoYunkong.regionDevices,
		body : JSON.stringify(data)
	};

    var role = req.session.user.role;

    if ('INDUSTRY_AGENT' !=role){
        if (req.query.ownerId ==undefined){
            utils.pageMessage(req,res,"参数错误","/deviceRegion/page","address","myAddress");
        }else {
            data.ownerId = req.query.ownerId;
        }
        data.role = 'OTHER'
	}else {
    	data.role = 'INDUSTRY_AGENT';
	}

	http.doPost(restFulPotion,function(status,d){
		if(d!= undefined && status == 200 && d.code == "0"){
            data.PRO_MENU = {"menu":"address","subMenu":"myAddress"};
			data.data = d.data;
			data.totalPages=d.totalPages;

			console.log('--------------------------');
			console.log(data);
			res.render("site",data);
		}else{
			utils.pageMessage(req,res,d.mes,"/deviceRegion/page","address","myAddress");
		}
	});

});


/*router.post('/page', function(req, res, next) {

	console.log(req);

	var body = {
		currentPage:req.body.currentPage,
		pageSize:PAGE_SIZE,
		regionNum:req.body.regionNum
	};

	var restFulPotion = {
		host : rest.emomoYunkong.host,
		port : rest.emomoYunkong.port,
		path : rest.emomoYunkong.regionDevices,
		body : JSON.stringify(body)
	}

	var data = {};
	data.PRO_MENU = {"menu":"address","subMenu":"myAddress"};
	data.currentPage = req.body.currentPage;
	data.regionNum = req.body.regionNum;


	http.doPost(restFulPotion,function(status,d){
		if(d!= undefined && status == 200 && d.code == "0"){
			data.data = d.data;
			res.render("site",data);
		}else{
			utils.pageMessage(req,res,d.mes,"/deviceRegion/page","address","myAddress");
		}
	});

});*/


router.post('/child', function(req, res, next) {

	var data = {
        PRO_MENU:{"menu":"address","subMenu":"myAddress"}
	};


	var tasklist = [];

	var body = {
		deviceSns:req.body.deviceSns.split(",")
	};
	var restFulPotion = {
		host : rest.emomoYunkong.host,
		port : rest.emomoYunkong.port,
		path : rest.emomoYunkong.findDeviceBySns,
		body : JSON.stringify(body)
	};
	tasklist.push(function (callback) {
		http.doPost(restFulPotion,function(status,d){
			if(d!= undefined && status == 200 && d.code == "0"){
				data.data = d.data;
				callback(null,data);
			}else{
				callback('err',d)
			}
		});
	});

	var body1 = {
		uid:req.session.user.uid,
		roleId:  'CITY_OPERATOR',
		pageSize:10
	};
	var restFulPotion1 = {
		host : rest.emomoYunkong.host,
		port : rest.emomoYunkong.port,
		path : rest.emomoYunkong.findMyUsers,
		body : JSON.stringify(body1)
	};
	tasklist.push(function(n,callback) {
		http.doPost(restFulPotion1,function(status,d){
			if(d!= undefined && status == 200 && d.code == "0"){
				data.list = d.data.list;
				callback(null,data);
			}else{
				callback('err',d)
			}
		});
	});

	async.waterfall(tasklist,function(err,result) {
		if (err) {
			utils.pageMessage(req,res,d.mes,"/deviceRegion/page","address","myAddress");
		}else{
			res.render("siteChild",data);		
		}
	});
});

router.post('/delete', function(req, res, next) {

	if (req.body.subProxyUserId==undefined) {
		utils.pageMessage(req,res,'参数错误',"/deviceRegion/page","address","myAddress");
	}

	var uid = req.session.user.uid ;
	var deviceSn = req.body.deviceSn;

	var body = {
		subProxyUserRate:req.body.subProxyUserRate,
		subProxyUserId: req.body.subProxyUserId
	};

	var restFulPotion = {
		host : rest.emomoYunkong.host,
		port : rest.emomoYunkong.port,
		path : rest.emomoYunkong.unbindDeviceSubProxy+'/'+uid+'/'+deviceSn,
		body : JSON.stringify(body)
	}

	var data = {
        PRO_MENU:{"menu":"address","subMenu":"myAddress"}
	};

	http.doPost(restFulPotion,function(status,d){
		if(d!= undefined && status == 200 && d.code == "0"){
			data.data = d.data;
			utils.pageMessage(req,res,'删除成功',"/deviceRegion/page","address","myAddress");
		}else{
			utils.pageMessage(req,res,d.mes,"/deviceRegion/page","address","myAddress");
		}
	});

});


router.post('/childOne', function(req, res, next) {

	var data = {
        PRO_MENU:{"menu":"address","subMenu":"myAddress"}
	};

	var tasklist = [];

	var deviceSns = [];
	deviceSns.push(req.body.deviceSn);
	var body = {
		deviceSns:deviceSns
	};
	var restFulPotion = {
		host : rest.emomoYunkong.host,
		port : rest.emomoYunkong.port,
		path : rest.emomoYunkong.findDeviceBySns,
		body : JSON.stringify(body)
	};

	tasklist.push(function (callback) {
		http.doPost(restFulPotion,function(status,d){
			if(d!= undefined && status == 200 && d.code == "0"){
				data.data = d.data;
				callback(null,data);
			}else{
				callback('err',d)
			}
		});
	});

	var body1 = {
		uid:req.session.user.uid,
		roleId:  'CITY_OPERATOR',
		pageSize:10
	};
	var restFulPotion1 = {
		host : rest.emomoYunkong.host,
		port : rest.emomoYunkong.port,
		path : rest.emomoYunkong.findMyUsers,
		body : JSON.stringify(body1)
	};
	tasklist.push(function(n,callback) {
		http.doPost(restFulPotion1,function(status,d){
			if(d!= undefined && status == 200 && d.code == "0"){
				data.list = d.data.list;
				callback(null,data);
			}else{
				callback('err',d)
			}
		});
	});

	async.waterfall(tasklist,function(err,result) {
		if (err) {
			utils.pageMessage(req,res,d.mes,"/deviceRegion/page","address","myAddress");
		}else{
			res.render("siteChild",data);		
		}
	});
});
module.exports = router;

