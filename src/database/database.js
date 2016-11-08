/**
 * Created by eason on 16-11-8.
 */
const fs = require('fs');

class Database{
    constructor(path){
        this.json = JSON.parse(fs.readFileSync(path));
        this.path = path;
    }

    addpost({title,tag,path}){
        let date = new Date();
        let _date = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        for(let index in this.json.posts) {
            if (this.json.posts[index].path = path) {
                this.json.posts[index] = {
                    title:title,tag:tag,date:_date,path:path
                };
                return this;
            }
        }
        this.json.posts.push({
            title:title,tag:tag,date:_date,path:path
        });
        return this;
    }

    rmpost({path}){
        for(let index in this.json.posts){
            if(this.json.posts[index].path = path) {
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

    getpost({path}){
        for(let index in this.json.posts) {
            if (this.json.posts[index].path = path) {
                return this.json.posts[index];
            }
        }
        return false;
    }

    flush(){
        fs.writeFile(this.path,JSON.stringify(this.json));
    }
}

module.exports = Database;