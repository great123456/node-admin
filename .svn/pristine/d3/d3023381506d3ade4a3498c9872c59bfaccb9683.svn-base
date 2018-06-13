/**
 * Created by dragon on 16-7-21.
 */


'use strict';


module.exports = function(grunt){

    require('load-grunt-tasks')(grunt);
    var config = require('./core/config');

    //自定义json常量
    var config = {
        port:config.initBase.base.SERVER_PORT,
        dist:'D:/emomo/emomoBms/emomoBms/dist' //目标目录
    };


    grunt.initConfig({
        config:config,
        pkg: grunt.file.readJSON('package.json'),//引入package.json

        //清除目录 grunt clean --force
        clean:{
            dist:['<%= config.dist %>/<%= pkg.name%>']
        },

        //复制不需要压缩的文件
        copy:{
            dist:{
                files:[
                    {
                        '<%= config.dist %>/<%= pkg.name%>/core/config.js':['core/config.js']
                    },
                    {
                        '<%= config.dist %>/<%= pkg.name%>/core/restUrl.js':['core/restUrl.js']
                    },
                    {
                        '<%= config.dist %>/<%= pkg.name%>/package.json':['package.json']
                    },
                    {
                        '<%= config.dist %>/<%= pkg.name%>/Gruntfile.js':['Gruntfile.js']
                    },
                    {
                        '<%= config.dist %>/<%= pkg.name%>/sh/start.sh':['sh/start.sh']
                    },
                    {
                        expand:true,
                        cwd:'node_modules',
                        src:'*/**',
                        dest:'<%= config.dist %>/<%= pkg.name%>/node_modules'
                    }
                ]
            }
        },


        //压缩JS
        uglify:{
            options:{
                banner:'/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            buildsome:{
                options: {
                    report: "min"//输出压缩率，可选的值有 false(不输出信息)，gzip
                },
                files: [
                    {
                        '<%= config.dist %>/<%= pkg.name%>/core/initCore.js': ['core/initCore.js']
                    },
                    {
                        '<%= config.dist %>/<%= pkg.name%>/app.js': ['app.js']
                    }
                ]
            },
            buildall:{
                files: [
                    {
                    expand:true,
                    cwd:'core/util',//js目录下
                    src:'**/*.js',//所有js文件
                    dest: '<%= config.dist %>/<%= pkg.name%>/core/util'//输出到此目录下
                     },
                    {
                        expand:true,
                        cwd:'public',//js目录下
                        src:'**/*.js',//所有js文件
                        dest: '<%= config.dist %>/<%= pkg.name%>/public'//输出到此目录下
                    },
                    {
                        expand:true,
                        cwd:'routes',//js目录下
                        src:'**/*.js',//所有js文件
                        dest: '<%= config.dist %>/<%= pkg.name%>/routes'//输出到此目录下
                    }
                ]
            }
        },


        //压缩图片
        imagemin:{
            dist:{
                options:{
                    optimizationLevel: 3, //定义 PNG 图片优化水平
                    pngquant: true
                },
                files:[
                    {
                        expand: true,
                        cwd: 'public',
                        src: ['**/*.{png,jpg,jpeg,gif,webp,svg}'],
                        dest: '<%= config.dist %>/<%= pkg.name%>/public'
                    }
                ]
            }
        },

        //压缩CSS
        cssmin:{
            dist: {
                options: {
                    report: 'gzip'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'public',
                        src: ['**/*.css'],
                        dest: '<%= config.dist %>/<%= pkg.name%>/public'
                    }
                ]
            }
        },

        //压缩HTML
        htmlmin:{
            options: {
                removeComments: true,
                removeCommentsFromCDATA: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true
            },
            html: {
                files: [
                    {
                        expand: true,
                        cwd: 'views',
                        src: ['**/*.ejs'],
                        dest: '<%= config.dist %>/<%= pkg.name%>/views'
                    }
                ]
            }
        },


        //shell 执行命令并启动
/*       shell:{
            options: {
                stderr: false
            },
            stop: {
                command: '<%=config.dist%>/<%= pkg.name%>/sh/start.sh stop'
            },
            another: 'chmod 755 <%=config.dist%>/<%= pkg.name%>/sh/start.sh && <%=config.dist%>/<%= pkg.name%>/sh/start.sh start' // shorthand
        },*/


        //后端node.js虚拟服务
        nodemon:{
            options:{},
            dev: {
                options: {
                    file: 'app.js',
                    args:[],
                    ignoredFiles:['node_modules/**'],
                    watcedFolders:['public','routes','views'],
                    debug:true,
                    delayTime:1,
                    env:{
                        PORT: '<%= config.port%>',
                    },
                    cwd:__dirname
                }
            }
        },

        //grunt-concurrent
        concurrent:{
            tasks:['nodemon','watch'],
            options:{
                logConcurrentOutput:true
            }
        },


        //观测变化，自动重启 watch
        watch:{
            jade:{
                files:['views/**'],
                options: {
                    livereload: true  //监听前面声明的端口
                },
            },
            js:{
                files:['routes/**','public/**'],
                options: {
                    livereload: true  //监听前面声明的端口
                },
            }
        }
    });

    //加载 uglify
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //图片压缩
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    //压缩CSS
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    //压缩HTML
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    //加载 copy
    grunt.loadNpmTasks('grunt-contrib-copy');
    //shell
    //grunt.loadNpmTasks('shelljs');

    // 注册默认任务.
    grunt.registerTask('install', ['uglify','imagemin','cssmin','htmlmin','copy']);

    //启动 || 停止
    grunt.registerTask('start', ['shell']);
    grunt.registerTask('stop', ['shell:stop']);

    //加载server
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.option('force',true);

    //后端node.js虚拟服务
    grunt.registerTask("server", ['concurrent']);

    //默认任务
    grunt.registerTask("default", ['concurrent']);



}












