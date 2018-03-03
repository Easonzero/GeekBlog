/**
 * Created by eason on 16-11-8.
 */
const fs = require('fs');
const Define = require('../config');

class Database{
    constructor(path){
        this.json = JSON.parse(fs.readFileSync(path));
        this.path = path;
    }
    //添加post
    addpost({title,tag,path}){
        let date = new Date();
        let _date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        for(let index in this.json.posts) {
            if (this.json.posts[index].path == path) {
                this.json.posts[index] = {
                    title:title,tag:tag,date:_date,path:path
                };
                return this;
            }
        }
console.log(title,tag,path)
        this.json.posts.unshift({
            title:title,tag:tag,date:_date,path:path
        });
        return this;
    }
    //去除post
    rmpost({path}){
        for(let index in this.json.posts){
            if(this.json.posts[index].path == path) {
                let file = `./build/${this.json.posts[index].path}`;
                fs.exists(file,(exist)=>{
                    if(exist){
                        fs.unlinkSync(file);
                    }
                });
                this.json.posts.splice(index,1);
            }
        }
        return this;
    }
    //得到post
    getpost({path}){
        for(let index in this.json.posts) {
            if (this.json.posts[index].path == path) {
                return this.json.posts[index];
            }
        }
        return false;
    }
    //写入文件
    flush(){
        let content = JSON.stringify(this.json);
        fs.writeFile(this.path,content);
    }
}

module.exports = Database;
