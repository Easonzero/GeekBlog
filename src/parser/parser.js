/**
 * Created by eason on 16-11-7.
 */
const fs = require('fs');
const Define = require('../config');
const showdown  = require('showdown'),
    converter = new showdown.Converter();

class Parser{
    //解析文件
    static mdparse(md){
        let html = converter.makeHtml(md);
        return new Promise((resolve)=>{
            resolve(html);
        });
    }
    //解析模板
    static tmplparse(tmpl,o){
        let tmpldata = fs.readFileSync(tmpl).toString();
        let state = 0,result='',cmd='';
        for(let i=0;i<tmpldata.length;i++){
            let ch = tmpldata.charAt(i);
            switch (state){
                case 0:
                    if(ch=='{') state++;
                    else result+=ch;
                    break;
                case 1:
                    if(ch=='{')
                        state++;
                    else {
                        result+='{'+ch;
                        state = 0;
                    }
                    break;
                case 2:
                    if(ch=='}')
                        state++;
                    else {
                        cmd+=ch;
                    }
                    break;
                case 3:
                    if(ch=='}') {
                        state = 0;
                        let content = cmd.replace(/^[\s　]+|[\s　]+/g, "");
                        if(content==Define.data){
                            result += `<script>data = ${JSON.stringify(o)}</script>`;
                        }else{
                            let indexs = content.split('.');
                            let tmp = o;
                            for(let i=0;i<indexs.length;i++){
                                tmp = tmp[indexs[i]];
                            }
                            result += tmp;
                        }
                        cmd='';
                    }else {
                        cmd+='}'+ch;
                        state = 2;
                    }
                    break;
            }
        }
        return new Promise((resolve)=>{
            resolve(result);
        });
    }
}

module.exports = Parser;