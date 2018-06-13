exports.orderPayType = function(val){
    data = "";
    switch (val)
    {
        case 1:data="支付宝";break;
        case 0:data="微储";break;
        default :data="未知";break;
    }
    return data;
}

exports.orderStatus = function(val){
    data = "";
    switch (val)
    {
        case 1:data="未支付";break;
        case 2:data="支付成功(已使用)";break;
        case -1:data="支付失败";break;
        case -2:data="分润失败";break;
        case 3:data="支付成功(未使用)";break;
        default :data="未知";break;
    }
    return data;
}

/**
 * 得到格式化的时间格式
 * @param time 时间戳 单位：秒或毫秒
 * @param format 返回时间格式 默认格式是2015-05-10 10：04：20
 * @return String 日期字符串
 */
exports.getDateFormat = function(time,format){
    if (time == null) {
        return "";
    }
    if(time.toString().length == 10){
        time = time * 1000;
    }
    format = format || "yyyy-MM-dd hh:mm:ss";
    Date.prototype.format = function(format) {
        var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    };
    return new Date(time).format(format);
};