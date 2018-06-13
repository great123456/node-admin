
var express = require('express');
var router  = express.Router();

var fs      = require("fs");
var func    = require('../core/func');
var logger  = require('../core/util/logger');
var rest    = require('../core/restUrl').urls;
var utils   = require('../core/util/utils');
var http   = require('../core/util/http');
var httpClient   = require('../core/util/httpClient').DHttpUtil;
var async = require('async');


var PAGE_SIZE = 10 ;

router.get('/water', function(req, res, next) {
    var userPhone = req.session.user.phone;

    if (userPhone ==undefined){
        utils.pageMessage(req,res,"参数错误","/index","address","myAddress");
	}

	var currentPage = req.query.currentPage || 1;


	var date = utils.get30day();
	var startDate =date.startDate;
	var endDate =date.endDate;

	var body = {
		userPhone: userPhone,
		startDate: startDate,
		endDate: endDate,
		currentPage: currentPage,
	};

	var restFulPotion = {
		host: rest.emomoDetail.host,
		port: rest.emomoDetail.port,
		path: rest.emomoDetail.fundsWater,
		body: JSON.stringify(body)
	};

	var data ={
        PRO_MENU:{"menu":"funds","subMenu":"water"},
        userPhone: userPhone,
        currentPage:currentPage,
        startDate:startDate,
        endDate:endDate,
		sum:{
            sum_Purchase:0,
            sum_left:0,
            sum_widthraw:0,
            sum_freeze:0,
            sum_canWidthraw:0.
        },
		data:[],
        totalPages:0

	};


	var tasklist = [];

	tasklist.push(function (callback) {
		http.doPost(restFulPotion,function(status,d){
			if (status == 200 && d.code == 'SUCCESS') {

				if (d.message !='RECORD_EMPTY'){
                    data.data = d.data;
                    data.totalPages = d.totalPages;
				}

				callback(null, data);
			}else {
				callback("err", data);
			}
		});
	});

	var restFulPotion1 = {
		host: rest.emomoDetail.host,
		port: rest.emomoDetail.port,
		path: rest.emomoDetail.fundsWaterSum+'/'+userPhone,
	};

	tasklist.push(function (n,callback) {
		http.doGet(restFulPotion1,function(status,d){
			if (status == 200 && d.data != undefined) {
				data.sum = d.data;
				callback(null, data);
			}else {
				callback("err", data);
			}
		});
	});

	async.waterfall(tasklist, function (err, result) {
		if (err){
            utils.pageMessage(req,res,"参数错误","/index","address","myAddress");
            return;
		}

        res.render("fundsWater",data);
    });

});


router.post('/water', function(req, res, next) {
	var userPhone = req.session.user.phone;
	var startDate = req.body.startDate;
	var endDate = req.body.endDate;
	var currentPage = req.body.currentPage;
	var billType = req.body.billType;


	if (startDate ==undefined || startDate ==''
		||endDate ==undefined || endDate ==''
		||currentPage==undefined||currentPage=='') {
		utils.pageMessage(req,res,'参数错误',"/index","index","");
	}
	var body = {
		userPhone: userPhone,
		startDate: startDate,
		endDate: endDate,
		currentPage: currentPage, 
		billType: billType
	};
	var restFulPotion = {
		host: rest.emomoDetail.host,
		port: rest.emomoDetail.port,
		path: rest.emomoDetail.fundsWater,
		body: JSON.stringify(body)
	}

	var data ={}
	data.PRO_MENU = {"menu":"funds","subMenu":"water"};
	data.currentPage = currentPage;
	data.startDate = startDate ;
	data.endDate = endDate ;
	data.sum = {
		sum_Purchase:req.body.sum_Purchase,
		sum_left: req.body.sum_left,
		sum_widthraw: req.body.sum_widthraw,
		sum_freeze: req.body.sum_freeze,
		sum_canWidthraw:req.body.sum_canWidthraw
	};
	data.userPhone=userPhone;
	data.totalPages = 100;

	http.doPost(restFulPotion,function(status,d){
		if(d!= undefined && status == 200 && d.code == 'SUCCESS'){
			console.log(d.message);
			if (d.message == 'RECORD_EMPTY' ) {
				utils.pageMessage(req,res,'指定时间内的记录数为空',"/index","index","");
				
			}else{
				data.data = d.data.datas;
				data.totalPages = d.data.totalPages;
				data.currentPage = currentPage;
				console.log(data);
				res.render("fundsWater",data);
			}
		}else{
			utils.pageMessage(req,res,'参数错误',"/index","index","");
			//return res.send('参数错误');
		}
	});
});




module.exports = router;