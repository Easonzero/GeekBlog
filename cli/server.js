/**
 * Created by eason on 16-11-8.
 */
"use strict";
const Server = require('../src/server/server');

module.exports = ()=>{
    new Server().listen('127.0.0.1',4000);
};
