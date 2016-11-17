/**
 * Created by eason on 16-11-9.
 */

class Hacker{
    constructor(ctx,height,width){
        this.ctx = ctx;
        this.height = height;
        this.width = width;
        this.length = 130;
        this.strings = [];
        this.lineHeight = 20;
        this.time=0;
        ctx.font = '15px serif';
        ctx.fillStyle = 'rgb(154,256,154)';
        ctx.translate(height,0);
        ctx.rotate(90 * Math.PI / 180);
        for(let i=0;i<height/this.lineHeight;i++){
            let length = Math.ceil(Math.random()*30)+20;
            let t = length%20;
            this.strings.push({speed:2,line:i+1,start:-length-t,end:-t,string:this.getCharQ(this.length),time:0})
        }

        let self = this;
        function bgAnimate(){
            requestAnimationFrame(bgAnimate);
            self.draw();
        }

        bgAnimate();
    }

    getCharQ(len){
        let tmp = '';
        for(var  i=0;i<len;i++)  {
            tmp  +=  Hacker.chars.charAt(Math.ceil(Math.random()*100000000)%Hacker.chars.length)+'  ';
        }
        return tmp;
    }

    draw(){
        this.ctx.clearRect(0,0,this.width,this.height);
        this.temp = [];
        while(this.strings.length!==0){
            let json = this.strings.pop();
            if(!json.time) json.time=0;
            json.time++;

            let str = json.string.substring(json.start*3,(json.end-1)*3);
            let start = this.ctx.measureText(json.string.substring(0,json.start*3)).width;

            this.ctx.font = `${20-json.speed}px serif`;
            this.ctx.fillText(str,start,json.line*this.lineHeight);

            if(json.time==json.speed){
                json.time = 0;

                json.start++;
                json.end++;

                if(json.end==50) {
                    let length = Math.ceil(Math.random()*30)+20;
                    this.temp.push({speed:length%2+1,line:json.line,start:-length-length%20,end:-length%20,string:this.getCharQ(this.length),time:0});
                }
                if(start < this.width) this.temp.push(json);
            }else this.temp.push(json);
        }
        this.strings = this.temp;
    }
}

Hacker.chars='0123456789qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM[];,./';