/**
 * 过滤器
 * @param app
 * @param config
 */

exports.filterInit = function(app,config) {

    var utils = require('./utils');

    //过滤器配置
    var filterConf = config.filtersOption;

    /**
     * 重定向 ,后台会重定向
     */
    app.use(function(req, res, next) {
        if(filterConf.select == filterConf.type.backend){//后台
            if ("/" == req.originalUrl) {
                res.redirect("/index");
            }else{
                next();
            }
        }else{//前台
            next();
        }

    });


    /**
     *  过滤器，规则：
     *  如果是前台则配置需要拦截的接口
     *
     */
    app.use(function(req, res, next) {

        if(filterConf.select == filterConf.type.backend){//后台

            //--系统过滤连
            if (checkNoFilter(req)) {
                next();
            } else {

                //是否校验权限
                if(filterConf.isCheckRole === true)
                {
                    //--获取登陆 session
                    var currentUser  = req.session.user;

                    var user_role = req.session.MEMBER_ROLE ;
                    //console.log(currentUser) ;
                    //console.log(filterConf.roles) ;
                    if (currentUser != undefined && currentUser != null && filterConf.roles[user_role] != undefined) {

                        res.locals.USER_NICK_NAME = currentUser.nickName;
                        res.locals.USER_MENU = user_role;

                        console.log("logioned") ;
                        url = req.originalUrl ;
                        var end = url.indexOf("?") ;
                        if(end != -1)
                        {
                            url = url.substring(0,end) ;
                        }

                        console.log(url) ;


                        if(utils.contains(filterConf['roles'][user_role],url))//有权限
                        {
                            next();
                        }else//无权限
                        {
                            utils.pageMessage(req,res,"你无此操作权限","/index","index","index");
                        }


                    } else {
                        console.log("no logion") ;
                        //记录路径,重定向到login 路径
                        var redirectUrl = req.originalUrl;

                        var url = "";
                        if(redirectUrl!=undefined && redirectUrl!=null && redirectUrl != ""){
                            url = filterConf.loginUrl +"?redirectUrl=" +redirectUrl;
                        }else{
                            url = filterConf.loginUrl;
                        }

                        res.redirect(url);
                    }

                }else
                {

                    res.locals.USER_NICK_NAME = "";
                    res.locals.USER_MENU = "";

                    next();
                }


            }

        }else if(filterConf.select == filterConf.type.fortend){//前台

            if (checkNoFilter(req)) {//拦截，并且登陆后重定向回拦截的页面

                //--获取登陆 session
                var currentUser  = req.session;
                currentUser['role'] = "YUNKONG_PLATFORM_ADMIN" ;

                console.log("过滤器currentUser------------" + currentUser);

                if (currentUser != undefined && currentUser != null && filterConf.roles[currentUser.role] != undefined) {

                    //console.log(req.originalUrl) ;

                    next();
                } else {

                    //记录路径,重定向到login 路径
                    var redirectUrl = req.originalUrl;

                    var url = "";
                    if(redirectUrl!=undefined && redirectUrl!=null && redirectUrl != ""){
                        url = filterConf.loginUrl +"?redirectUrl=" +redirectUrl;
                    }else{
                        url = filterConf.loginUrl;
                    }

                    res.redirect(url);
                }

            } else {
                next();
            }

        }else{
            next();
        }
    });

    /**
     * 系统过滤连
     * @param req
     * @returns {boolean}
     */
    function checkNoFilter(req){
        var url = req.originalUrl;
        //console.log(url);
        var urls = filterConf.urls;
        //console.log("系统过滤连-------------"+urls);
        for(var i=0;i<urls.length;i++){
            var noFilter = urls[i];
            //console.log(url.indexOf(noFilter));
            //console.log(url.match(noFilter));
            if(url.indexOf(noFilter) == 0){
                return true;
            }
        }
        return false;
    }

}

