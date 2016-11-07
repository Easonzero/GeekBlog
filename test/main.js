/**
 * Created by eason on 16-11-7.
 */
const fs = require('fs');
const Parser = require('../index').parser;
const Server = require('../index').server;

fs.readFile('./test/post/test.md', (err,data)=>{
    let md = data.toString();
    Parser.mdparse(md).then((html)=>{
        return Parser.tmplparse('post',{content:html});
    }).then((html)=>{
        fs.writeFile('./build/test.html',html);
    })
});