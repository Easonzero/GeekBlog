/**
 * Created by eason on 16-11-4.
 */
let __tag = [];
let hello = [`
    There is no place like
     1  2  7  .  0  .  0  .  1
`,
    `
    这是因特网不为人知的角落
    也许整整一年只有你的访问
    那么
    请无论如何
    阅读愉快             --easonzero
`
];

let cmdHandler = {
    'help':function([cmd,reg]){
        let value = '',i=1;
        for(let x of Object.keys(cmdHandler)){
            value += `  ${i++}.  ${x}\n`;
        }
        return new Promise((resolve)=>{
            resolve(value);
        })
    },
    'article':function([cmd,id]){
        let value = '';
        if(id){
            if(id>data.posts.length-1) value = `No match with id:${id}!`;
            else {
                value = 'Waiting...\nFinding...';
                setTimeout(()=>window.location.href=data.posts[id].path,500);
            }
        }else{
            for(let index in data.posts){
                value += `id '${index}'    :    title '${data.posts[index].title}'`+'\n';
            }
            value+=`type 'article <id>' to read the article by id!`;
        }
        return new Promise((resolve)=>{
            resolve(value);
        })
    },
    'tag':function([cmd,id]){
        let value = '',i=1;
        if(id){
            if(id>__tag.length) value = `No match with id ${id}!`;
            else{
                value += `TAG:${__tag[id-1]}`+'\n';
                for(let index in data.posts){
                    for(let tag of data.posts[index].tag){
                        if(tag==__tag[id-1]){
                            value += `id '${index}'    :    title '${data.posts[index].title}'`+'\n';
                        }
                    }
                }
            }
        }else{
            __tag.length=0;
            for(let index in data.posts){
                for(let tag of data.posts[index].tag){
                    if(!value.includes(tag)){
                        __tag.push(tag);
                        value += `id '${i++}'     :    TAG '${tag}'`+'\n';
                    }
                }
            }
            value+=`type 'tag <id>' to look through all article of the tag!`;
        }
        return new Promise((resolve)=>{
            resolve(value);
        })
    },
    'hello':function([cmd]){
        let value = '';
            value=hello[Math.round(Math.random()*(hello.length-1))];
        return new Promise((resolve)=>{
            resolve(value);
        })
    },
    'clear':function([cmd]){
        return new Promise((resolve)=>{
            resolve("${clear}");
        })
    }
};
