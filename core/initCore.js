/**
 * Created by dragon on 16-7-30.
 */

var fs        = require("fs");
var path      = require( 'path' ) ;

var BASE_PATH = path.join(__dirname , '/../' );
var CORE_PATH = BASE_PATH + '/core/';

if(fs.existsSync('/apps/project/node/conf/ememBms/options.js')){
    CONF_PATH = '/apps/project/node/conf/ememBms/';
}else{
    CONF_PATH = BASE_PATH + '/core/';
};

var config = require('./config').initBase;

var options= require(CONF_PATH + "options").initBase;

exports.options = options;

/**
 * 初始化环境函数
 */

exports.intiFunc = function(app){

    //==================log4js==========================
    var log4js = require('./util/logger');
    log4js.loggerInit(options.loggerOption);

    //======================session======================
    var session = require('./util/session');
    session.sessionInit(app,options);

    //======================filter======================
    var filter = require('./util/filter');
    filter.filterInit(app,config);

    //===================路由配置=========================

    //路由配置
    var baseConf   = options.base;
    var routesConf = config.routesOption;
    if(undefined == routesConf||0 == routesConf.length){
        log4js.error("路由配置出错,HTTP服务器退出,请检查routes.json");
        process.exit();
    };
    for(var i=0;i<routesConf.length;i++){
        if(baseConf.contextPath != ''){
            app.use(baseConf.contextPath + "/" +routesConf[i]["path"], require("../routes/"+routesConf[i]["route"]));
        }else {
            app.use(routesConf[i]["path"], require("../routes/"+routesConf[i]["route"]));
        }

    };


    //======================异常处理==========================
    var errorHandler = require('./util/error');
    errorHandler.errorInit(app,options);

    //====================== redis ==========================
    var redisOption = options.redisOption;
    if(redisOption.isStart){
        var redis = require('./util/redis');
        redis.redisConnect(options);
    }

    //===================== redis-cluster====================
    var redisClusterOption = options.redisClusterOption;
    if (redisClusterOption.isStart){
        var cluster = require('./util/redis-cluster');
        cluster.redisClusterConnect(options);
    }

    //======================业务功能======================
    global.BUtile = require('./util/businessUtils');

};

/**
 * 初始化环境函数
 */

exports.init = function(app){
    console.log("初始化环境...");
    //返回结果
    var result = {};
    var utils = require("./util/utils");
    //从环境||配置文件获取端口
    var port = utils.normalizePort(process.env.PORT || options.base.SERVER_PORT);
    result.port = port;

    //调用初始化函数
    this.intiFunc(app);
    return result;
};










