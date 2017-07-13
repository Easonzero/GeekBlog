/**
 * Created by eason on 17-4-24.
 */
let centerX = parseFloat($('.head-pic').css('left'));
let centerY = parseFloat($('.head-pic').css('top'));
let rectstr = `<div class="rect"></div>`;

let keys = [
    'hit在读学生','热爱图形学的懒癌重症患者','easonzero','小一，男，未婚待业','不服我可以撩我啊','曾经搞点android，现在玩玩前端(雾',
    'qq451114984','技术要简洁，demo要炫酷','Stay foolish?yes,I do','做人要谦逊，做事要漂亮'
];

let tweens = [
    (i,total)=>{return [900+Math.cos(Math.PI*i/total)*380,0]},
    (i,total)=>{return [900+Math.abs(i-total/2+1)*80,0]},
    (i,total)=>{return [(i%2==0)?700:1280,0]},
    (i,total)=>{return [980*((i=i/total-1)*i*i*i*i+1)+520,0]},
    (i,total)=>{
        let s = 1.70158;
        if ((i/=total/2) < 1) return [980/2*(i*i*(((s*=(1.525))+1)*i - s)) + 520,0];
        return [980/2*((i-=2)*i*(((s*=(1.525))+1)*i + s) + 2) + 520,0];
    },
    (i,total)=>{ return [-980*((i=i/total-1)*i*i*i-1)+520,0]},
    (i,total)=>{ return [Math.sqrt(460*460-(i-total/2+0.5)*(i-total/2+0.5)*980*980/(total*total))*2,0]},
    (i,total)=>{ return [900+Math.abs(i-total/2+1)*80,(i%2==0)?-50:50]}
];

for(let i=0;i<10;i++){
        let rect = $(rectstr);
        let tween = tweens[7](i,10);
        rect.addClass(`rect${i+1}`).css('height','40px').css('width',`${tween[0]}px`).css('top',`${i*50}px`).css('transform',`translate(${-50+tween[1]}%)`);
        $('header').append(rect);
    }

    let fIndex = Math.round(Math.random()*(keys.length-1-3));
    let thetas = Math.random()*Math.PI*2,
        rs = Math.random()*100+100;
    let thetad = Math.random()*Math.PI*2,
        rd = 200+Math.random()*200;
    for(let i=0;i<4;i++){
        $(`.des_${i+1}`)
            .css('top',`${centerY+Math.sin(thetas)*rs+Math.sin(thetad+i*Math.PI/2)*rd}px`)
            .css('left',`${centerX+Math.cos(thetas)*rs+Math.cos(thetad+i*Math.PI/2)*rd}px`);
	
        $(`.des_${i+1} > div > .des_c_t`).text(keys[fIndex+i]);
    }

    setInterval(()=>{
        let index = Math.round(Math.random()*(tweens.length-1));
        for(let i=0;i<10;i++){
            let tween = tweens[index](i,10);
            $(`.rect${i+1}`).css('height','40px').css('width',`${tween[0]}px`).css('top',`${i*50}px`).css('transform',`translate(${-50+tween[1]}%)`);
        }
    },5000);

    setInterval(()=>{
        let index = Math.round(Math.random()*(keys.length-1-3));
        let thetas = Math.random()*Math.PI*2,
            rs = Math.random()*100+100;
        let thetad = Math.random()*Math.PI*2,
            rd = 200+Math.random()*200;
        for(let i=0;i<4;i++){
            $(`.des_${i+1}`)
                .css('top',`${centerY+Math.sin(thetas)*rs+Math.sin(thetad+i*Math.PI/2)*rd}px`)
                .css('left',`${centerX+Math.cos(thetas)*rs+Math.cos(thetad+i*Math.PI/2)*rd}px`);
            $(`.des_${i+1} > div > .des_c_t`).text(keys[index+i]);
        }
    },2000);
