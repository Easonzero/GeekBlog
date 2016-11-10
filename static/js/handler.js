/**
 * Created by eason on 16-11-4.
 */
let __tag = [];
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
            if(id>data.posts.length) value = 'No match any tag!';
            else {
                value = 'Waiting...\nFinding...';
                setTimeout(()=>window.location.href=data.posts[id].path,500);
            }
        }else{
            for(let index in data.posts){
                value += `id '${index}'    :    title '${data.posts[index].title}'`+'\n';
            }
        }
        return new Promise((resolve)=>{
            resolve(value);
        })
    },
    'tag':function([cmd,id]){
        let value = '',i=1;
        if(id){
            if(id>__tag.length) value = 'No match any tag!';
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
        }
        return new Promise((resolve)=>{
            resolve(value);
        })
    }
};