/**
 *  微信卡卷  nodejs v6.10.1 
 *
 *	{"account":"13538919704","password":"qazwsx"}
 *
 * pviX3soLVXmIoXgoYpTFVtGEvmY0
 * 
 */

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
		path: rest.emomoYunkong.cardPage,
		body: JSON.stringify(body),
	};

	var data = {
		PRO_MENU: { menu: 'card', subMenu: 'wxcard' },
		currentPage: body.currentPage,
		pageSize: body.pageSize
	};

	http.doPost(restFulPotion, function(status, d) {
		if (d != undefined && status == 200 && d.code == '0') {
			data.list = d.data.list;
			data.totalPages = d.data.totalPages;
			res.render('card', data);
		} else {
			utils.pageMessage(req, res, d.mes, '/index', 'address', 'myAddress');
		}
	});

});


router.post('/add', function(req, res) {

	if (req.body.cardId ==undefined) {
		utils.pageMessage(req, res, '参数错误', '/index');
		return;
	}

	var body = {
		cardId: req.body.cardId
	};
	
	var restFulPotion = {
		host: rest.wxCard.host,
		port: rest.wxCard.port,
		path: rest.wxCard.getCard,
		body: JSON.stringify(body)
	};

	http.doPost(restFulPotion, function(status, data) {

		if (status !=200 && data.errcode !=0) {
			console.log('查询失败');
			utils.pageMessage(req, res,'查询失败', '/card/page', 'card', 'wxcard');
			return;
		}
	
		var info;
		var cardtype =  data.card.card_type;

		if (cardtype == 'GENERAL_COUPON') {
			info = data.card.general_coupon.base_info;
		}else if (cardtype == 'CASH') {
			info = data.card.cash.base_info; 
		}
		info.date_info.end_timestamp = info.date_info.end_timestamp*1000 ||(new Date().getTime()+1000 * 60 * 60 * 24 *info.date_info.fixed_term);
		
		console.log('=========微信卡卷详情 data.card=========');
        console.log(data.card);
		var body = {
			source:info.brand_name,
			cardType:data.card.card_type,
			cardId:info.id,
			dealDetail:'',
			gift:'',
			leastCost: '',
			reduceCost:'',
			discount:'',
			logoUrl:info.logo_url,
			title:info.title,
			dateInfo:utils.getTime(info.date_info.end_timestamp),
			quantity:info.sku.quantity,
			totalQuantity:info.sku.total_quantity,
			status:info.status,
		};

		if (cardtype == 'CASH') {
			body.leastCost =data.card.cash.least_cost; 
			body.reduceCost= data.card.cash.reduce_cost;
		}

		console.log('=========微信卡卷详情 body=========');
		console.log(body);
		var restFulPotion = {
			host: rest.emomoYunkong.host,
			port: rest.emomoYunkong.port,
			path: rest.emomoYunkong.cardAdd,
			body: JSON.stringify(body)
		};

		http.doPost(restFulPotion, function(status, d) {
			console.log('=========微信卡卷java=========');
			console.log(d);
			if (status !=200 || d.code =='-1') {
				console.log('入库失败');
				utils.pageMessage(req, res,d.mes, '/card/page', 'card', 'wxcard');
			}else{
				utils.pageMessage(req, res,'添加成功', '/card/page', 'card', 'wxcard');
			}
			
		});

	});
});


module.exports = router;

