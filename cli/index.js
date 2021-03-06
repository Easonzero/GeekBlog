#!/usr/bin/env node
"use strict";
let init = require('./init');
let build = require('./build');
let post = require('./post');
let server = require('./server');
let publish = require('./publish');

switch(process.argv[2]){
    case 'init'://初始化命令
        init();
        break;
    case 'build'://构建命令
        build();
        break;
    case 'post'://管理文章命令
        post(process.argv[3],process.argv[4]);
        break;
    case 'server'://开启服务器命令
        server();
        break;
    case 'publish':
	publish();
	break;
    default:
        console.log(`
Usage: geekcli <command>

Commands:
   init     Create a new GeekBlog folder.
   build    Write all files of project into ./build.
   post     Manage posts.
   server   Start server.
    `)
}
