/**
 * Created by eason on 16-11-7.
 */
const fs = require('fs');
const {Parser,Define} = require('../index');
const readline = require('readline');

function addpost({title,tag,path}){
    fs.readFile(`./${Define.data}`, (err,data)=>{
        let json = JSON.parse(data.toString());
        let date = new Date();
        json.posts.push({title:title,tag:tag,date:`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,path:path});
        fs.writeFile(`./${Define.data}`,JSON.stringify(json));
    });
}

function rmpost(path){
    fs.readFile(`./${Define.data}`, (err,data)=>{
        let json = JSON.parse(data.toString());
        for(let index in json.posts){
            if(json.posts[index].path = path) {
                let file = `./build/${json.posts[index].path}`;
                fs.exists(file,(exist)=>{
                    if(exist){
                        fs.unlinkSync(file);
                    }
                });
                json.posts.splice(index,1);
            }
        }
        fs.writeFile(`./${Define.data}`,JSON.stringify(json));
    });
}

module.exports = (method,file)=>{
    switch (method){
        case 'create':
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
                            let json = {title:title,tag:answer,path:path};
                            fs.readFile(file, (err,data)=>{
                                let md = data.toString();
                                Parser.mdparse(md).then((html)=>{
                                    json.content = html;
                                    return Parser.tmplparse('./layout/post.template',json);
                                }).then((html)=>{
                                    fs.writeFile(`./build/${path}`,html);
                                })
                            });
                            addpost(json);
                            rl.close();
                        });
                    });
                }else{
                    console.log('Could not find the file!')
                }
            });
            break;
        case 'update':
            let path = `${/\/.*\/(.*)\.md$/.exec(file)[1]}.html`;
            fs.readFile(`./${Define.data}`, (err,data)=> {
                let json = JSON.parse(data.toString());
                for(let index in json.posts){
                    if(json.posts[index].path = path) {
                        fs.exists(file,(exist)=>{
                            if(exist){
                                fs.readFile(file, (err,data)=>{
                                    let md = data.toString();
                                    Parser.mdparse(md).then((html)=>{
                                        json.content = html;
                                        return Parser.tmplparse(`./${Define.layout}/${Define.post}`,json);
                                    }).then((html)=>{
                                        fs.writeFile(`./${Define.build}/${path}`,html);
                                    })
                                });
                            }else{
                                console.log('Could not find the file!')
                            }
                        });
                    }
                }
            });
            break;
        case 'delete':
            fs.exists(file,(exist)=>{
                if(exist){
                    fs.unlinkSync(file);
                }
                rmpost(`${/\/.*\/(.*)\.md$/.exec(file)[1]}.html`);
            });
            break;
    }
};