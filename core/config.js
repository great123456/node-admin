/**
 * Created by dragon on 16-7-19.
 * 通用配置
 */

//引入初始化函数
var func = require('./initCore');

/**
 * 基础配置
 * @type {{base: {port: string}, redis: {host: string}}}
 */
exports.initBase = {


    //过滤器配置
    filtersOption:{
        type:{
            backend:"backend",//后台,在urls填写则不拦截
            fortend:"fortend"//前台,在url填写则拦截
        },
        select:"backend",//声明前台还是后台
        loginUrl:"/member/login",//登录接口
        urls:[ //添加过滤连
            "/member/login",
            '/member/login/admin',
            '/member/admin/dologin'
        ],
        isCheckRole:true,
        roles:{
            //代理商
            "INDUSTRY_AGENT" : ['/index','/member/updatePassword','/member/logout','/proxyDevice/page',
                '/proxyDevice/update','/proxyDevice/price/add','/proxyDevice/price/del','/proxyDevice/cmd',
                '/proxyDevice/bindRegion','/proxyDevice/bindRegionPage','/proxyDevice/unbindRegion',
                '/proxyDevice/bindSubProxyPage','/proxyDevice/bindSubProxy','/proxyDevice/unbindSubProxy',
                '/deviceRegion/page','/deviceRegion/add','/deviceRegion/update','/member/updatepassword',
                '/super/subProxyAdmin','/super/subProxyAdmin/add','/deviceRegion/share/page','/deviceRegion/share/set/page',
                '/deviceRegion/setRegionBatchShare','/deviceRegion/detail'
                ,'/error/devicepage'
                ,'/error/orderpage'
                ,'/funds/water'
                ,'/funds/getxml'
                ,'/operation/day'
                ,'/operation/mouth'
                ,'/operation/order'
                ,'/operation/agent'
                ,'/site/page'
                ,'/site/child'
                ,'/site/childOne'
                ,'/site/delete'
                ,'/operate/query'
            ],
            //子代理商|场地管理员
            "CITY_OPERATOR" : ['/index','/member/updatePassword','/member/logout','/roleDevice/page',
                '/roleDevice/device','/member/updatepassword','/order/page',
                '/operate/query'
            ],
            //厂商
            "FACTORY_ADMIN" : ['/index','/member/updatePassword','/member/logout','/roleDevice/page',
                '/roleDevice/device','/member/updatepassword','/operate/query'
            ],
            //平台管理员
            "YUNKONG_PLATFORM_ADMIN" : ['/index','/member/updatePassword','/member/logout','/batch/page','/batch/add',
                '/batch/update','/device/page','/device/add','/device/update','/device/price/add','/device/price/del',
                '/device/cmd','/device/allocation','/device/allocationPage','/deviceType/page','/deviceType/add',
                '/deviceType/update','/order/page','/super/platfrom','/super/platfrom/add','/super/proxyAdmin',
                '/super/proxyAdmin/add','/super/subProxyAdmin','/super/subProxyAdmin/add','/super/factoryAdmin',
                '/super/factoryAdmin/add','/super/role','/wxUser/page','/wxUser/evaluatePage',
                '/device/batch/add', '/device/share/page','/batch/share/page','/batch/share/batchadd/page',
                '/device/delete/bind','/device/single/setShare/page','/device/single/share/set','/batch/setShare/page',
                '/batch/share/set',
		        '/device/updatePrice',
                '/device/setParm',
                '/card/page',
                '/card/add',
                '/device/card/support',
                '/refund/page',
                '/refund/detail',
                '/refund/check',


                '/super/operatorAdmin',
                '/super/operatorAdmin/add',
                '/market/region',
                '/market/page',
                '/market/add',
                '/market/delete',
                '/deviceRegion/add',
                '/deviceRegion/page',
                '/deviceRegion/detail',
                '/proxyDevice/page',
                '/proxyDevice/update',

                '/site/page',

                '/price/combo',
                '/price/setprice',
                '/price/comboadd',
                '/price/add',
                '/price/queryprice',
                '/price/querypriceadd',
                '/price/queryadd',
                '/price/remove',
                '/price/combosave',
                '/price/pricepackage',
                '/price/setprice',
                '/price/setdeviceprice',
                '/price/setalldeviceprice',
                '/price/package',
                '/message/show',
                '/message/account',
                '/operate/query',
                '/message/query',

            ],
            //超级管理员
            "SUPER_ADMIN" : ['/index','/member/logout','/super/platfrom','/super/role',
                '/member/updatePassword','/super/platfrom','/super/platfrom/add','/operate/query'
            ],
            "YUNKONG_PLATFORM_OPERATOR":['/index','/member/logout', '/member/updatePassword','/operate/query']
        }
    },

    //路由配置
    routesOption:[
        {"route":"index","path":"/"},
        {"route":"superAdmin","path":"/super"},
        {"route":"mes","path":"/mes"},
        {"route":"order","path":"/order"},
        {"route":"deviceRegion","path":"/deviceRegion"},
        {"route":"wxUser","path":"/wxUser"},
        {"route":"batch","path":"/batch"},
        {"route":"deviceType","path":"/deviceType"},
        {"route":"device","path":"/device"},
        {"route":"proxyDevice","path":"/proxyDevice"},
        {"route":"member","path":"/member"},
        {"route":"roleDevice","path":"/roleDevice"},
        {"route":"error","path":"/error"},
        {"route":"funds","path":"/funds"},
        {"route":"operation","path":"/operation"},
        {"route":"site","path":"/site"},
        {"route":"card","path":"/card"},
        {"route":"refund","path":"/refund"},
        {"route":"market","path":"/market"},
        {"route":"price","path":"/price"},
        {"route":"message","path":"/message"},
        {"route":"operate","path":"/operate"},

    ],

};


