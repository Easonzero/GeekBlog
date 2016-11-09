/**
 * Created by eason on 16-11-4.
 */
let cmdHandler = {
    'help':function(){
        let value = '';
        for(let x of Object.keys(cmdHandler)){
            value += `    ${x}`;
        }
        return new Promise((resolve)=>{
            resolve(value);
        })
    },
    'article':function(){
        let value = $('data-post').text();
        return new Promise((resolve)=>{
            resolve(value);
        })
    },
    'tag':function(){
        let value = $('data-tag').text();
        return new Promise((resolve)=>{
            resolve(value);
        })
    },
    'category':function(){
        let value = $('data-category').text();
        return new Promise((resolve)=>{
            resolve(value);
        })
    },
    'archive':function(){

    }
};