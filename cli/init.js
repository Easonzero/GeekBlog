/**
 * Created by eason on 16-11-9.
 */
const fs = require('fs');
const {Define} = require('../index');

module.exports = ()=>{
    for(let path in Define){
        if(path=='data'){
            fs.exists(`./${Define[path]}`,(exist)=>{
                if(!exist) fs.writeFile(`./${Define.data}`,'{"name":"Easonzero","posts":[]}');
            });
        }
        else if(path.includes('Tmpl')||path.includes('Page')) continue;
        else
            fs.exists(`./${Define[path]}`,(exist)=>{
                if(!exist) fs.mkdir(`./${Define[path]}`);
            });
    }
};