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

router.get('/mouth', function(req, res, next) {
    var userPhone =req.session.user.phone;
    if (userPhone ==undefined){
        utils.pageMessage(req,res,"参数错误","/index","operation","mouth");
    }
	var currentPage = req.query.currentPage || 1;
	var date = utils.get30day();
	var startDate = req.query.startDate|| date.startDate;
	var endDate =  req.query.endDate || date.endDate;
	var pageSize = req.query.pageSize || PAGE_SIZE;

	var data = {
		userPhone: userPhone,
		startDate: startDate,
		endDate: endDate,
		currentPage: currentPage,
        pageSize:pageSize
	};
	var restFulPotion = {
		host: rest.emomoDetail.host,
		port: rest.emomoDetail.port,
		path: rest.emomoDetail.operationMouth,
		body: JSON.stringify(data)
	};

	http.doPost(restFulPotion,function(status,d){

		if (status == 200 && d.code == 'SUCCESS') {
            if (d.message == 'RECORD_EMPTY') {
                data.data =[];
                data.totalPages =0;
			}else {
                data.data = d.data.datas;
                data.totalPages = d.data.totalPages;
			}
            data.PRO_MENU ={"menu":"operation","subMenu":"mouth"};
            res.render("operationMouth",data);
		}else {
            utils.pageMessage(req,res,"服务器内部错误","/index","operation","mouth");
		}

	});
});

router.get('/day', function(req, res, next) {
    var userPhone =req.session.user.phone;
    if (userPhone ==undefined){
        utils.pageMessage(req,res,"参数错误","/index","operation","mouth");
    }
    var currentPage = req.query.currentPage || 1;
    var pageSize = req.query.pageSize || PAGE_SIZE;
    var date = utils.get30day();
    var today = req.query.today ||date.endDate;

    var data = {
        userPhone: userPhone,
        today: today,
        currentPage: currentPage,
        pageSize:pageSize
    };

    var restFulPotion = {
        host: rest.emomoDetail.host,
        port: rest.emomoDetail.port,
        path: rest.emomoDetail.operationDay,
        body: JSON.stringify(data)
    };


    http.doPost(restFulPotion,function(status,d){

        if (status == 200 && d.code == 'SUCCESS') {
            if (d.message == 'RECORD_EMPTY') {
                data.data =[];
                data.totalPages =0;
            }else {
                data.data = d.data.datas;
                data.totalPages = d.data.totalPages;
            }
            data.PRO_MENU ={"menu":"operation","subMenu":"day"};
            res.render("operationDay",data);
        }else {
            utils.pageMessage(req,res,"服务器内部错误","/index","operation","day");
        }

    });
});

router.get('/order', function(req, res, next) {

    var userPhone =req.session.user.phone;
    if (userPhone ==undefined){
        utils.pageMessage(req,res,"参数错误","/index","operation","mouth");
    }
    var currentPage = req.query.currentPage || 1;

    var date = utils.get30day();
    var startDate = req.query.startDate|| date.startDate;
    var endDate =  req.query.endDate || date.endDate;
    var pageSize = req.query.pageSize || PAGE_SIZE;

    var data = {
        userPhone: userPhone,
        startDate: startDate,
        endDate: endDate,
        currentPage: currentPage,
        pageSize:pageSize
    };
    var restFulPotion = {
        host: rest.emomoDetail.host,
        port: rest.emomoDetail.port,
        path: rest.emomoDetail.operationOrder,
        body: JSON.stringify(data)
    }

    http.doPost(restFulPotion,function(status,d){
        if (status == 200 &&  d.code == 'SUCCESS') {
            if (d.message == 'RECORD_EMPTY') {
                data.data =[];
                data.totalPages =0;
            }else {
                data.data = d.data.datas;
                data.totalPages = d.data.totalPages;
            }
            data.PRO_MENU = {"menu":"operation","subMenu":"order"}
            res.render("operationOrder",data);

        }else {
            utils.pageMessage(req,res,"服务器内部错误","/index","operation","order");
		}

    });
});
router.post('/order', function(req, res, next) {
    console.log('----------order---post------------');
    console.log(req.body);

    var userPhone =req.session.user.phone;

    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var currentPage = req.body.currentPage;

    if (startDate ==undefined || startDate ==''
        ||endDate ==undefined || endDate ==''
        ||currentPage==undefined||currentPage=='') {
        return res.send('参数错误');
    }
    var body = {
        userPhone: userPhone,
        startDate: startDate,
        endDate: endDate,
        currentPage: currentPage,
    };
    var restFulPotion = {
        host: rest.emomoDetail.host,
        port: rest.emomoDetail.port,
        path: rest.emomoDetail.operationOrder,
        body: JSON.stringify(body)
    }

    var data ={}
    data.PRO_MENU = {"menu":"operation","subMenu":"order"};
    data.currentPage = currentPage;
    data.startDate = startDate ;
    data.endDate = endDate ;
    data.userPhone=userPhone;
    data.totalPages = 100;

    http.doPost(restFulPotion,function(status,d){
        console.log('-------d-----------',d);
        if(d!= undefined && status == 200 && d.code == 'SUCCESS'){
            console.log(d.message);
            if (d.message == 'RECORD_EMPTY') {
                return res.send('指定时间内的记录数为空');
            }else{
                data.data = d.data.datas;
                data.totalPages = d.data.totalPages;
                data.currentPage = currentPage;
                console.log('-------post---mouth-----------');
                console.log(data);
                res.render("operationOrder",data);
            }
        }else{
            return res.send('参数错误');
        }
    });
});

router.get('/agent', function(req, res) {
   console.log("---代理商收益查询页面----");
   console.log(req.session);
   var params=req.query;
   console.log(params);
   if(params.beginTime){
    var time=params.beginTime;
    params.beginTime=time.substring(0,10);
    var startDate=params.beginTime;
   }else{
    var startDate='';
   };

   if(params.finishTime){
    var time=params.finishTime;
    params.finishTime=time.substring(0,10);
    var endDate=params.finishTime;
   }else{
    var endDate='';
   };
   
   var currentPage = params.currentPage||'';
   var deviceSn=params.deviceSn||'';
   var body={
    currentPage:currentPage,
    pageSize:'6',
    proxyId:req.session.user.uid,
    deviceSn:deviceSn,
    startDate:startDate,
    endDate:endDate
    };
   
   var restFulPotion = {
         host: rest.emomoYunkong.host,
         port: rest.emomoYunkong.port,
         path: rest.emomoDetail.operationquery,
         body: JSON.stringify(body)
   }; 

   http.doPost(restFulPotion, function(status, d) {

       if (d != undefined && status == 200 && d.code == '0') {
           console.log("代理商收益查询页面请求成功");
           console.log(d);
           console.log(d.data.list[0]);
           var data={
             PRO_MENU: { menu: 'operate', subMenu: 'query' },
             data:d.data,
             params:params
           };
           res.render('operationquery',data);
       }else {
           console.log("代理商收益查询页面请求错误");
           utils.pageMessage(req, res, d.mes, "/index", "address", "addAddress");
       }

    });

});



/*router.post('/mouth', function(req, res, next) {
	console.log('-----mouth.post---------');
	console.log(req.body);

	var userPhone =req.session.user.phone;

	var startDate = req.body.startDate;
	var endDate = req.body.endDate;
	var currentPage = req.body.currentPage;

	if (startDate ==undefined || startDate ==''
		||endDate ==undefined || endDate ==''
		||currentPage==undefined||currentPage=='') {
		return res.send('参数错误');
	}
	var body = {
		userPhone: userPhone,
		startDate: startDate,
		endDate: endDate,
		currentPage: currentPage,
	};
	var restFulPotion = {
		host: rest.emomoDetail.host,
		port: rest.emomoDetail.port,
		path: rest.emomoDetail.operationMouth,
		body: JSON.stringify(body)
	}

	var data ={}
	data.PRO_MENU = {"menu":"operation","subMenu":"mouth"};
	data.currentPage = currentPage;
	data.startDate = startDate ;
	data.endDate = endDate ;
	data.userPhone=userPhone;
	data.totalPages = 100;

	http.doPost(restFulPotion,function(status,d){
		if(d!= undefined && status == 200 && d.code == 'SUCCESS'){
			console.log(d.message);
			if (d.message == 'RECORD_EMPTY') {
				return res.send('指定时间内的记录数为空');
			}else{

				data.data = d.data.datas;
				data.totalPages = d.data.totalPages;
				data.currentPage = currentPage;

				console.log('-------post---mouth-----------');
				console.log(data);
				res.render("operationMouth",data);
			}
		}else{
			return res.send('参数错误');
		}
	});
});*/



/*router.post('/day', function(req, res, next) {
	console.log('-------post---day-----------');
	console.log(req.body);
	var userPhone =req.session.user.phone;
	
	var today = req.body.today;
	var currentPage = req.body.currentPage;

	if (today ==undefined || today ==''
		||currentPage==undefined||currentPage=='') {
		return res.send('参数错误');
	}
	var body = {
		userPhone: userPhone,
		today: today,
		currentPage: currentPage, 
	};

	var restFulPotion = {
		host: rest.emomoDetail.host,
		port: rest.emomoDetail.port,
		path: rest.emomoDetail.operationDay,
		body: JSON.stringify(body)
	}

	var data ={}
	data.PRO_MENU = {"menu":"operation","subMenu":"day"};
	data.currentPage = currentPage;
	data.today = today ;
	data.userPhone=userPhone;
	data.totalPages = 100;

	http.doPost(restFulPotion,function(status,d){
		if(d!= undefined && status == 200 && d.code == 'SUCCESS'){
			console.log('-------------d.message-----------');
			console.log(d.message);
			if (d.message == 'RECORD_EMPTY') {
				return res.send('指定时间内的记录数为空');
			}else{
				data.data = d.data.datas;
				data.totalPages = d.data.totalPages;
				console.log('-------post---day-----------');
				console.log(data);
				res.render("operationDay",data);
			}
		}else{
			return res.send('参数错误');
		}
	});
});*/

module.exports = router;