/**
 * Created by eason on 16-11-7.
 */
const fs = require('fs');
const showdown  = require('showdown'),
    converter = new showdown.Converter();

class Parser{
    static mdparse(md){
        let html = converter.makeHtml(md);
        return new Promise((resolve)=>{
            resolve(html);
        });
    }

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
                        result+=o[cmd.replace(/^[\s　]+|[\s　]+/g, "")];
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