/**
 * 声明
 * 请求的 url
 */
// 本地服务器地址 192.168.3.220
// 远程服务器地址 120.24.152.193
// 上线地址127.0.0.1
exports.urls = {

        "sso":"http://u.emomo.cc/sso?appkey=yunkong&loginCallback=http://ykong.emomo.cc:42000/dologin",
        "findlogin":"/user/find/login",
        "userFindMenu":"/user-res/find-menu",
        "emomo-yunkong":{
                "host":"yunkong.api.emomo",
                "port":42220,
                "findOrderById":"/order/id/{id}",
                "findOrderBySn":"/order/sn/{sn}",
                "findOrderPage":"/order/page",

                "findDeviceRegionById"          :       "/deviceRegion/id",
                "findDeviceRegionByNumber"      :       "/deviceRegion/number/",
                "findDeviceRegionByPage"        :       "/deviceRegion/page",
                "addDeviceRegion"               :       "/deviceRegion/add",
                "updateDeviceRegion"            :       "/deviceRegion/update",
                "delDeviceRegion"               :       "/deviceRegion/del/",
                "deviceRegionAll"               :       "/deviceRegion/all/",

                "findWxUserPage"                :       "/wxUser/page",
                "findWxUserEvaluatePage"        :       "/detail/listContent",

                "findBatchPage"                 :       "/batch/page",
                "findBatchAll"                  :       "/batch/all",
                "addBatch"                      :       "/batch/add",
                "updateBatch"                   :       "/batch/update",
                "findBatchById"                 :       "/batch/id/",

                "findDeviceTypeById"            :       "/deviceType/id/",
                "findDeviceTypePage"            :       "/deviceType/page",
                "addDeviceType"                 :       "/deviceType/add",
                "updateDeviceType"              :       "/deviceType/update",
                "findDeviceTypeAll"             :       "/deviceType/all",


                "findMyDevicePage"              :       "/device/dev/page",
                "findDevicePage"                :       "/device/page",
                "addDevice"                     :       "/device/add",
                "findDeviceById"                :       "/device/id/",
                "findDeviceBySn"                :       "/device/deviceSn/",
                "updateDevice"                  :       "/device/update",
                "cmdDevice"                     :       "/device/cmd/deviceSn/",
                "findDeviceBySns"               :       "/device/deviceSns",
                "allocationDevice"              :       "/device/allocation",
                "proxyDevice"                   :       "/device/proxyDevice",
                "bindDeviceRegion"              :       "/device/bind/region/", // /device/bind/region/{uid}
                "unbindDeviceRegion"            :       "/device/unbind/region/", // /device/unbind/region/{uid}/{deviceSn}
                "bindDeviceSubProxy"            :       "/device/bind/subProxy/",// /device/bind/subProxy/{uid}/{deviceSn}
                "bindDeviceMoreSubProxy"        :       "/device/bind/more/subProxy/",// /device/bind/more/subProxy/{uid}/{deviceSn}
                "unbindDeviceSubProxy"          :       "/device/unbind/subProxy/",// /device/bind/subProxy/{uid}/{deviceSn}
                "shareDeviceSubProxy"           :       "/device/subProxy/share/",// /device/subProxy/share/{uid}/{deviceSn}
                "getDeviceShare"                :       "/device/share/", // /device/share/{uid}/{deviceSn}")
                "deleteBindDevice"              :       "/device/del/bind/",
                "setSingleDeviceShare"          :       "/device/single/share/set",
                "setBatchDeviceShare"           :       "/device/batch/share/set",
                "setDeviceRegionShare"          :       "/deviceRegion/batch/share",
                "deviceRegionDetail"            :       "/deviceRegion/detail",



                "findDevicePriceByDeviceSn"     :       "/devicePrice/deviceSn/",
                "addDevicePrice"     :       "/devicePrice/add",
                "delDevicePrice"     :       "/devicePrice/del/",

                "factoryDevice"         :       "/device/factory/page/",//  /device/factory/page/{uid}
                "subProxyDevice"        :       "/device/subProxy/page/",//  /device/subProxy/page/{uid}
                "findMyUsers"           :       "/device/userInfo",

                "addUserPlatFormAdmin"       :"/base/register/platFormAdmin",
                "addUserProxyAdmin"       :"/base/register/proxyAdmin",
                "addUserFactoryAdmin"       :"/base/register/factoryAdmin",
                "addSubProxyAdmin"       :"/base/register/subProxyAdmin",
                "updatePrice"     :"/devicePrice/update/price"

        },
        "emomo-usersystem":{
                "host":"usersystem.api.emomo",
                "port":30001,
                "allUserByRole" : "/loginService/allUser/role",
                "findUserByRole":"/loginService/user/role",
                "findMyUsers"       :"/loginService/myUsers",
                "login"       :"/loginService/login",
                "adminlogin"       :"/loginService/rootLogin",
                "updatePassword":"/loginService/update/passwd",
                "findAllRole"   :"/loginService/all/roles"

        },
        "wxCard":{
            "host":"wx.proxy.node.emomo",
            "port":9099,
            "getCard": "/wx/card/info"
        },
        "emomoYunkong":{
            "host":"yunkong.api.emomo",
            "port":42220,
            "regionDevices" : "/deviceRegion/devices",
            "findDeviceBySns" : " /device/deviceSns",
            "findMyUsers": "/device/userInfo",
            "unbindDeviceSubProxy"  :"/device/unbind/subProxy",
            "errorDevice":"/device/proxyDeviceFault",
            "errorOrder":"/order/proxyOrderFault",
            "cardPage":'/card/page',
            "cardAdd":'/card/add',
            "cardSupport": '/device/card/support',
            "refundPage": '/refund/page',
            "refundDtail":'/refund/detail/',
            "refundCheck":'/refund/check',
            "findMyDevicePage":'/device/dev/page',

            "findMarketMessage":'/base/register/platFormOperator',
            "marketPage":'/operatorRegion/findByPUid',
            "regionPage":'/operatorRegion/region',
            "regionAdd":'/operatorRegion/boundRegionByPUid',
            "regionDelete":'/operatorRegion/deleteRegionById',

            "comboadd":'/pricePackage/add',
            "pricecombo":'/pricePackage/page',
            "queryprice":'/devicePrice/packNum/{ packNum }',
            "queryadd":'/devicePrice/add',
            "queryremove":'/devicePrice/del/{packNum}/{id}',
            "pricePackageupdate":'/pricePackage/update',

            "setdeviceprice":'/devicePrice/update/price',
            "pricePackage":'/pricePackage/all',
            "setpricerecord":'/devicePrice/update',
            "messageshow":'/ordersettle/allorder',
            "messageaccount":'/settlement/findByPayer',
            "operatequery":'/statisticsReturn/operator',
            "messagequery":'/statisticsReturn/admin',

        },
        "emomoDetail":{
            "host": "account.api.emomo",
            "download": "http://admin.emomo.cc",
            "port" : 40008,
            "operationMouth" : '/report/list/order/month',
            "operationDay" : '/report/list/order/day',
            "operationOrder" : '/report/list/order/detail',
            "operationquery" : '/statisticsReturn/proxy',
            "fundsWater":'/report/list/account/detail',
            "fundsWaterSum":'/report/count/account/sumAccount',
            "fundsWaterXml":'/util/export/monthAccount.xls',
        }
}
