/**
 * Created by eason on 16-11-4.
 */
let cmdHandler = {
    'help':function([cmd,reg]){
        let value = '';
        for(let x of Object.keys(cmdHandler)){
            value += 'sadf\n';
        }
        return new Promise((resolve)=>{
            resolve(value);
        })
    },
    'article':function([cmd,id]){
        let value = '';
        if(id){
            value = 'Waiting...\nBusying...'
            setTimeout(()=>window.location.href=data.posts[id].path,500);
        }else{
            for(let index in data.posts){
                value += `id '${index}'   :   title '${data.posts[index].title}'`+'\n';
            }
        }
        return new Promise((resolve)=>{
            resolve(value);
        })
    },
    'tag':function([cmd]){
        let value = $('data-tag').text();
        return new Promise((resolve)=>{
            resolve(value);
        })
    },
    'category':function([cmd]){
        let value = $('data-category').text();
        return new Promise((resolve)=>{
            resolve(value);
        })
    },
    'archive':function([cmd]){

    }
};