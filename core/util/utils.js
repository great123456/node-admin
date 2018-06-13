/**
 * Created by dragon on 16-7-31.
 * 全局的函数
 */


/**
 * 格式化端口
 * @param val
 * @returns {*}
 */
exports.normalizePort = function(val){
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};



/**
 * 获取远程请求IP
 * @param req
 * @returns {*}
 */
exports.getClientIp = function (req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};


/**
 * aes加密
 * @param data
 * @param key
 * @param iv
 * @returns {*}
 */
exports.aes = function (data,key,iv){
    var algorithm = 'aes-128-cbc';
    var crypto      = require('crypto');
    var cipher = crypto.createCipheriv(algorithm, key, iv)
    var encrypted = cipher.update(data, 'binary', 'base64')
    encrypted += cipher.final('base64');

    return encrypted;
}


/**
 * MD5散列
 * @param data
 * @returns {*}
 */
exports.md5= function(data){
    var crypto      = require('crypto');
    var md5         = crypto.createHash('md5');
    md5.update(data);
    var sign        = md5.digest('hex');
    return sign;
}


exports.filterParams = function(obj,params){
    data = {} ;
    if(! params instanceof Array || obj == "")
    {
        return data ;
    }
    for(i=0; i<params.length; i++)
    {
        if(obj[params[i]] != "")
        {
            data[params[i]] = obj[params[i]] ;
        }
    }
    return data ;

}

exports.pageMessage = function(req,res,mes,backUrl,menu,subMenu){
    data = {
        mes : mes == "" || typeof mes == 'object' ? "信息为空" : mes,
        //backUrl : backUrl == "" ? "%2f" : encodeURIComponent(backUrl) ,
        backUrl : backUrl == "" ? "%2f" : (backUrl) ,
        PRO_MENU : {
            "menu":menu,
            "subMenu":subMenu
        },
    }

    res.render("mes",data);

}


exports.contains = function (arr, str) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === str) {
            return true;
        }
    }
    return false;
}

exports.get30day = function () {

    //获取当前日期
    var myDate = new Date();
    var nowY = myDate.getFullYear();
    var nowM = myDate.getMonth()+1;
    var nowD = myDate.getDate();
    var endDate = nowY+"-"+(nowM<10 ? "0" + nowM : nowM)+"-"+(nowD<10 ? "0"+ nowD : nowD);

    //获取三十天前日期
    var lw = new Date(myDate - 1000 * 60 * 60 * 24 * 30);
    var lastY = lw.getFullYear();
    var lastM = lw.getMonth()+1;
    var lastD = lw.getDate();
    var startDate=lastY+"-"+(lastM<10 ? "0" + lastM : lastM)+"-"+(lastD<10 ? "0"+ lastD : lastD);//三十天之前日期

    var date = {
        startDate:startDate,
        endDate:endDate
    }
    console.log('---------get30day------------');
    console.log(date);
    return date;

}

exports.getTime = function (time) {

    var myDate = new Date(time);
    var year = myDate.getFullYear();
    var month = myDate.getMonth()+1;
    var date = myDate.getDate();  
    var hour=myDate.getHours();     
    var minute=myDate.getMinutes();     
    var second=myDate.getSeconds();     
    var now1 = year+"-"+month+"-"+date+"  "+hour+":"+minute+":"+second;
    return now1 ;
}

exports.getToday = function () {

    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth()+1;
    var date = myDate.getDate();  
    var hour=myDate.getHours();     
    var minute=myDate.getMinutes();     
    var second=myDate.getSeconds();     
    var now1 = year+"-"+month+"-"+date;
    return now1 ;
}

