var express = require('express');

var router = express.Router();
var rest = require('../core/restUrl').urls;
var utils = require('../core/util/utils');
var http = require('../core/util/http');

var PAGE_SIZE = 10;

router.get('/page', function(req, res) {
	var body = {
		currentPage: req.query.currentPage || 1,
		pageSize: PAGE_SIZE,
	};

	var restFulPotion = {
		host: rest.emomoYunkong.host,
		port: rest.emomoYunkong.port,
		path: rest.emomoYunkong.refundPage,
		body: JSON.stringify(body)
	};

	var data = {
		PRO_MENU: { menu: 'refund', subMenu: 'page' },
		currentPage: body.currentPage,
		pageSize: body.pageSize
	};

	http.doPost(restFulPotion, function(status, d) {
		if (d != undefined && status == 200 && d.code == '0') {
			data.list = d.data.list;
			data.totalPages = d.data.totalPages;
			res.render('refundPage', data);
		} else{
			utils.pageMessage(req, res, d.mes, '/index', 'refund', 'page');
		}
	});

});


router.get('/detail', function(req, res) {

	var orderSn = req.query.orderSn;

    var restFulPotion = {
        host: rest.emomoYunkong.host,
        port: rest.emomoYunkong.port,
        path: rest.emomoYunkong.refundDtail+orderSn
    };

    http.doGet(restFulPotion, function(status, d) {
    	console.log(d);
        if (d != undefined && status == 200 && d.code == '0') {
            res.send({code:200,mes:d.mes,data:d.data})
        } else {
            res.send({code:500,mes:d.mes});
        }
    });
});

router.post('/check', function(req, res) {
    var body= req.body;

	var isBoolean = body.checkStatus =='true' ^ body.checkStatus =='false';
	if (isBoolean ==0){
        utils.pageMessage(req, res, '异常退款选择', '/refund/page', 'refund', 'page');
        return;
	}

	if (body.checkOpinion ==undefined){
		body.checkOpinion='';
	}

    if (body.checkStatus == undefined){
        utils.pageMessage(req, res, '是否退款没选择', '/refund/page', 'refund', 'page');
        return;
	}
    if (body.orderSn ==undefined ||body.orderSn ==''){
        utils.pageMessage(req, res, '订单错误', '/refund/page', 'refund', 'page');
        return;
    }

    body.userId = req.session.user.uid;
    body.orderBy="createTime desc"
    if (body.userId ==undefined ||body.userId ==''){
        utils.pageMessage(req, res, '服务器错误', '/refund/page', 'refund', 'page');
        return;
    }

    var restFulPotion = {
        host: rest.emomoYunkong.host,
        port: rest.emomoYunkong.port,
        path: rest.emomoYunkong.refundCheck,
        body: JSON.stringify(body)
    };

   http.doPost(restFulPotion, function(status, d) {

        if (d != undefined && status == 200 && d.code == '0') {
            utils.pageMessage(req, res, '订单 '+body.orderSn+' 设置成功', '/refund/page', 'refund', 'page');
        } else {
            utils.pageMessage(req, res, '服务器错误', '/refund/page', 'refund', 'page');
        }
   });
});

module.exports = router;