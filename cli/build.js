/**
 * Created by eason on 16-11-7.
 */
"use strict";
const fs = require('fs');
const {Parser,Define,Database} = require('../index');

module.exports = ()=>{
    let database = new Database(`./${Define.data}`);
    //输出除了post之外的所有layout文件
    fs.readdir(`./${Define.layout}/`,(err,paths)=>{
        for(let file of paths){
            let info = fs.statSync(`./${Define.layout}/${file}`);
            if (!info.isDirectory()&&file!==Define.postTmpl) {
                Parser.tmplparse(`./${Define.layout}/${file}`,database.json)
                    .then((html)=>fs.writeFileSync(`./${Define.build}/${file.split('.')[0]}.html`,html));
            }
        }
    });
    //输出post文件
    fs.readdir(`./${Define.post}/`,(err,paths)=>{
        for(let file of paths){
            let info = fs.statSync(`./${Define.post}/${file}`);
            if (!info.isDirectory()) {
                fs.readFile(`./${Define.post}/${file}`, (err,data)=>{
                    let md = data.toString();
                    Parser.mdparse(md).then((html)=>{
                        let post = database.getpost({path:`${file.split('.')[0]}.html`});
                        if(post){
                            post.content = html;
                            return Parser.tmplparse(`./${Define.layout}/${Define.postTmpl}`,post);
                        }
                    }).then((html)=>{
                        fs.writeFileSync(`./${Define.build}/${file.split('.')[0]}.html`,html);
                    })
                });
            }
        }
    });
    //输出静态文件
    (function copy(src=`./${Define.static}`,dst=`./${Define.build}`){
        fs.readdir( src, function( err, paths ) {
            if (err) {
                throw err;
            }
            paths.forEach((path)=>{
                let _src = `${src}/${path}`,
                    _dst = `${dst}/${path}`,
                    readable, writable;
                fs.stat(_src,(err, st)=>{
                    if (err) {
                        throw err;
                    }
                    if (st.isFile()) {
                        readable = fs.createReadStream(_src);
                        writable = fs.createWriteStream(_dst);
                        readable.pipe(writable);
                    }
                    else if (st.isDirectory()) {
                        fs.exists( _dst, function( exists ){
                            if(!exists) {
                                fs.mkdir( _dst );
                            }
                        });
                        return copy(_src,_dst);
                    }
                });
            });
        });
    })();
};
