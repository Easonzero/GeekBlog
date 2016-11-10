/**
 * Created by eason on 16-11-4.
 */

class Terminal{
    constructor(ctx,height,width,user){
        this.height = height;
        this.width = width;

        this.offset = 0;
        this.lineHeight = 20;
        this.lineLimit = Math.floor(height/this.lineHeight);
        this.fontSize = 15;
        ctx.font = `${this.fontSize}px serif`;

        this.cursor = new Cursor(ctx,'white',this.lineHeight/2,this.lineHeight);
        this.prompt = new Prompt(ctx,'blue',this.lineHeight*4,this.lineHeight,user);

        this.curX = this.prompt.width+10;
        this.curY = 1;

        this.cmd = [];
        this.res = [];
        this.ctx = ctx;

        this.cursorOffset = 4;

        this.listen();

        self = this;

        function cursorAnimate(){
            requestAnimationFrame(cursorAnimate)
            let last = self.curY<self.lineLimit?self.curY:self.lineLimit;
            self.cursor.draw(self.curX+self.cursorOffset,(last-1)*self.lineHeight);
        }

        cursorAnimate();
    }

    scroll(attr){
        switch (attr){
            case 'up':
                this.offset--;
                break;
            case 'down':
                this.offset++;
                break;
        }
        this.cursor.active = false;
        this.render();
    }

    render(){
        this.ctx.clearRect(0,0,this.width,this.height);
        let last = (this.curY<this.lineLimit?this.curY:this.lineLimit),
            i = 0,_last=last;

        while(this.offset+_last>0&&i<=this.res.length){
            let j=0,k=0;
            ctx.fillStyle = 'white';

            if(this.cmd.length===0) {
                this.prompt.draw(0,0);
                break;
            }
            if(i>0)
                while(k<this.res[i-1].line){
                    k++;
                    ctx.fillText(this.res[i-1].value[k-1], 0, (this.offset+_last+k-this.res[i-1].line-2/5)*this.lineHeight);
                }
            while(j<this.cmd[i].line){
                j++;
                let startX = j==1?this.prompt.width+10:0;
                ctx.fillText(this.cmd[i].value[j-1], startX, (this.offset+_last+j-k-this.cmd[i].line-2/5)*this.lineHeight);
            }
            this.prompt.draw(0,(this.offset+_last-k-j)*this.lineHeight);
            i++;
            _last-=j+k;
        }
        this.cursor.draw(this.curX+this.cursorOffset,(this.offset+last-1)*this.lineHeight);
    }

    listen(){
        document.onkeydown = function(event) {
            event.preventDefault();
            let keyCode;

            if (event === null) {
                keyCode = window.event.keyCode;
            }
            else {
                keyCode = event.keyCode;
            }

            switch (event.keyCode) {
                case 13:
                    this.input('$${Enter}');
                    break;
                case 8:
                    this.input('$${Delete}');
                    break;
                default:
                    if (!!event) {
                        this.input(Utils.giveMeChar(keyCode, event));
                    } else {
                        this.input(keyCode);
                    }
                    break;
            }
        }.bind(this);
    }

    input(char){
        this.offset = 0;
        this.cursor.active = true;
        if(this.cmd.length===0) this.cmd.unshift({value:[''],line:1});
        if(char=='$${Enter}') {
            let cmd = '';
            for(let s of this.cmd[0].value){ cmd += s }
            this.cmdHandler(cmd).then((result)=>{
                switch(result){
                    case '${clear}':
                        this.curX = this.prompt.width+10;
                        this.curY = 1;
                        this.cmd = [];
                        this.res = [];
                        this.render();
                        break;
                    default:
                        result = result.split('\n');
                        this.cmd.unshift({value:[''],line:1});
                        this.res.unshift({value:result,line:result.length});
                        this.curY+=1+this.res[0].line;
                        this.curX = this.prompt.width+10;
                        this.render();
                }
            });
        }
        else if(char=='$${Delete}') {
            let cmd = this.cmd[0];
            if(cmd.value[cmd.line-1].length===0&&cmd.line!=1){
                cmd.line--;
                let c = cmd.value[cmd.line-1].charAt(cmd.value[cmd.line-1].length-1);
                cmd.value[cmd.line-1] = cmd.value[cmd.line-1].substr(0,cmd.value[cmd.line-1].length-1);
                this.curY--;
                this.curX = this.width;
            }else if(cmd.value[cmd.line-1].length!==0){
                let c = cmd.value[cmd.line-1].charAt(cmd.value[cmd.line-1].length-1);
                cmd.value[cmd.line-1] = cmd.value[cmd.line-1].substr(0,cmd.value[cmd.line-1].length-1);
                this.curX -= this.ctx.measureText(c).width;
            }
            this.render();
        }
        else {
            let cmd = this.cmd[0];
            let start = this.curX;
            if(this.curX>this.width) {
                start = 0;
                cmd.line++;
                this.curY++;
                cmd.value[cmd.line-1] = '';
            }
            this.curX = start + this.ctx.measureText(char).width;
            cmd.value[cmd.line-1] += char;
            this.render();
        }
    }

    cmdHandler(cmd){
        cmd = cmd.replace(/(^\s*)|(\s*$)/g,'').split(/\s/);
        if(cmdHandler[cmd[0]])
            return cmdHandler[cmd[0]](cmd);
        else
            return new Promise((resolve)=>{
                resolve(`command not found:${cmd}!`);
            })
    }
}