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
            value+='type \'article <id>\' to read the article by id!';
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
                value+='type \'tag <id>\' to look through all article of the tag!';
            }
        }
        return new Promise((resolve)=>{
            resolve(value);
        })
    },
    'hello':function([cmd]){
        let value = '';
            value=`
            假如时光已逝，
            鸟儿不再歌唱，
            风儿也吹倦了，
            那就用黑暗的厚幕把我盖上，
            如同黄昏时节你用睡眠的衾被裹住大地，
            又轻轻合上睡莲的花瓣。
            路途未完，行囊已空,
            衣裳破裂污损，人已精疲力竭。
            你驱散了旅客的羞愧和困窘，
            使他在你仁慈的夜幕下，
            如花朵般焕发生机。
            在你慈爱的夜幕下苏醒。
        `;
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