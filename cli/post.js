/**
 * Created by eason on 16-11-7.
 */
const fs = require('fs');
const {Parser,Define,Database} = require('../index');
const readline = require('readline');

module.exports = (method,file)=>{
    switch (method){
        case 'create'://创建post
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            fs.exists(file,(exist)=>{
                if(exist){
                    let path = `${/\/.*\/(.*)\.md$/.exec(file)[1]}.html`;
                    rl.question('title:',(answer)=>{
                        let title = answer;
                        rl.question('tag:',(answer)=>{
                            let json = {title:title,tag:answer.split('|'),path:path};
                            new Database(`./${Define.data}`).addpost(json).flush();
                            fs.readdir(`./${Define.layout}/`,(err,paths)=>{
                                for(let file of paths){
                                    let info = fs.statSync(`./${Define.layout}/${file}`);
                                    if (!info.isDirectory()&&file!==Define.postTmpl) {
                                        Parser.tmplparse(`./${Define.layout}/${file}`,database.json)
                                            .then((html)=>fs.writeFile(`./${Define.build}/${file.split('.')[0]}.html`,html));
                                    }
                                }
                            });
                            fs.readFile(file, (err,data)=>{
                                let md = data.toString();
                                Parser.mdparse(md).then((html)=>{
                                    json.content = html;
                                    return Parser.tmplparse(`./${Define.layout}/${Define.postTmpl}`,json);
                                }).then((html)=>{
                                    fs.writeFile(`./${Define.build}/${path}`,html);
                                })
                            });
                            rl.close();
                        });
                    });
                }else{
                    console.log('Could not find the file!')
                }
            });
            break;
        case 'update'://更新post
            let path = `${/\/.*\/(.*)\.md$/.exec(file)[1]}.html`;
            let database = new Database(`./${Define.data}`);
            let post = database.getpost({path:path});

            fs.exists(file,(exist)=>{
                if(exist){
                    fs.readFile(file, (err,data)=>{
                        let md = data.toString();
                        Parser.mdparse(md).then((html)=>{
                            post.content = html;
                            return Parser.tmplparse(`./${Define.layout}/${Define.postTmpl}`,post);
                        }).then((html)=>{
                            fs.writeFile(`./${Define.build}/${path}`,html);
                        })
                    });
                }else{
                    console.log('Could not find the file!')
                }
            });
            break;
        case 'delete'://删除post
            fs.exists(file,(exist)=>{
                if(exist){
                    fs.unlinkSync(file);
                }
                new Database(`./${Define.data}`).rmpost({path:`${/\/.*\/(.*)\.md$/.exec(file)[1]}.html`}).flush();
            });
            break;
    }
};