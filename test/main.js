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


new Server().listen('127.0.0.1',4000);