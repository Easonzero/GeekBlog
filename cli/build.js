/**
 * Created by eason on 16-11-7.
 */
const fs = require('fs');
const {Parser,Define} = require('../index');

module.exports = ()=>{
    fs.readFile(`./${Define.data}`, (err,data)=>{
        let json = JSON.parse(data.toString());
        fs.readdir(`./${Define.layout}/`,(err,paths)=>{
            for(let file of paths){
                let info = fs.statSync(`./${Define.layout}/${file}`);
                if (!info.isDirectory()&&file!==Define.postTmpl) {
                    Parser.tmplparse(`./${Define.layout}/${file}`,json)
                        .then((html)=>fs.writeFile(`./${Define.build}/${file.split('.')[0]}.html`,html));
                }
            }
        });

        fs.readdir(`./${Define.post}/`,(err,paths)=>{
            for(let file of paths){
                let info = fs.statSync(`./${Define.post}/${file}`);
                if (!info.isDirectory()) {
                    fs.readFile(`./${Define.post}/${file}`, (err,data)=>{
                        let md = data.toString();
                        Parser.mdparse(md).then((html)=>{
                            json.content = html;
                            return Parser.tmplparse(`./${Define.layout}/${Define.postTmpl}`,json);
                        }).then((html)=>{
                            fs.writeFile(`./${Define.build}/${file.split('.')[0]}.html`,html);
                        })
                    });
                }
            }
        });
    });

    (function copy(src=`./${Define.static}`,dst=`./${Define.build}`){
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