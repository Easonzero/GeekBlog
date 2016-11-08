/**
 * Created by eason on 16-11-7.
 */
const fs = require('fs');
const {Parser} = require('../index');

module.exports = ()=>{

    let posts = './post/';
    fs.readdir(posts,(err,paths)=>{
        for(let file of paths){
            let info = fs.statSync(posts + file);
            if (!info.isDirectory()) {
                fs.readFile(posts+file, (err,data)=>{
                    let md = data.toString();
                    Parser.mdparse(md).then((html)=>{
                        return Parser.tmplparse('./layout/post.template',{content:html});
                    }).then((html)=>{
                        fs.writeFile(`./build/${file.split('.')[0]}.html`,html);
                    })
                });
            }
        }
    });

    (function copy(src='./static',dst='./build'){
        fs.readdir( src, function( err, paths ) {
            if (err) {
                throw err;
            }
            paths.forEach((path)=>{
                var _src = `${src}/${path}`,
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