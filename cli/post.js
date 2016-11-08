/**
 * Created by eason on 16-11-7.
 */
const fs = require('fs');
const {Parser} = require('../index');
const readline = require('readline');

function addpost({title,tag,path}){
    fs.readFile('./data.json', (err,data)=>{
        let json = JSON.parse(data.toString());
        let date = new Date();
        json.posts.push({title:title,tag:tag,date:`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,path:path});
        fs.writeFile('./data.json',JSON.stringify(json));
    });
}

function rmpost(path){
    fs.readFile('./data.json', (err,data)=>{
        let json = JSON.parse(data.toString());
        for(let index in json.posts){
            if(json.posts[index].path = path) {
                let file = `./build/${json.posts[index].path}`;
                fs.exists(file,(exist)=>{
                    if(exist){
                        fs.unlinkSync(file);
                    }
                });
                console.log(index)
                json.posts.splice(index,1);
            }
        }
        fs.writeFile('./data.json',JSON.stringify(json));
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
                        console.log(path);
                    rl.question('title:',(answer)=>{
                        let title = answer;
                        rl.question('tag:',(answer)=>{
                            let json = {title:title,tag:answer,path:path};
                            fs.readFile(file, (err,data)=>{
                                let md = data.toString();
                                Parser.mdparse(md).then((html)=>{
                                    json.content = html;
                                    return Parser.tmplparse('post',json);
                                }).then((html)=>{
                                    fs.writeFile(`./build/${path}`,html);
                                })
                            });
                            addpost(json);
                        });
                    });
                }else{
                    console.log('Could not find the file!')
                }
            });
            rl.close();
            break;
        case 'update':
            fs.exists(file,(exist)=>{
                if(exist){
                    let path = `${/\/.*\/(.*)\.md$/.exec(file)[1]}.html`;
                    fs.readFile(file, (err,data)=>{
                        let md = data.toString();
                        Parser.mdparse(md).then((html)=>{
                            json.content = html;
                            return Parser.tmplparse('post',json);
                        }).then((html)=>{
                            fs.writeFile(`./build/${path}`,html);
                        })
                    });
                }else{
                    console.log('Could not find the file!')
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