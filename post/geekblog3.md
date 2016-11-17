这篇文章是GeekBlog的最后一个部分，说一说数码流动画的实现。

数码流动画是啥？其实这名是我瞎起的，看过黑客帝国的同学可能知道，字符如同水流飞逝而过那种酷炫感真的是geek感爆棚

linux命令行应用其实有类似的东西啦，叫做cmatrix，效果如下：

![cmatrix](http://s7.51cto.com/wyfs02/M02/23/EE/wKioL1NHaDvhRj9-AACcBDBgTBQ876.jpg)

我们将要实现的就是web版cmatrix，在开始之前你需要准备什么呢？只需要了解canvas和js的基本使用即可。

那么，let^s start！

## 总体思路

刚看到这么个东西的时候，心里一定会想，这不就是一个随机字符串生成器嘛，然后让字符串自上而下移动就好了啊～

然而并非如此，其实这个东西当然很简单了，但是一定要观察细节，字符串真的是自上而下移动么？明明是字符串位置固定，但是显示的部分在移动！

这下思路就显而易见啦，我们需要一个结构体，作为每一个数码流的model，结构如下

```js
{
	speed:2,//速度
	line:i+1,//列数
	start:-length-t,//起始指针
	end:-t,//结尾指针
	string:this.getCharQ(this.length),//字符串
	time:0//时间
}
```

这个东东有了注释应该很容易懂，这个结构体涵盖了一个数码流的所在列，显示段开头和结尾，固定的字符串内容，以及一个用来调整动画速度用的计时器。

有了这个结构体，我们只需要提供一个随机字符串函数以及一个绘制函数，来吧这个结构体不断的画到屏幕上就ok。

## 随机字符串

这个比较简单，直接贴代码了

```js
getCharQ(len){
    let tmp = '';
    for(var  i=0;i<len;i++)  {
        tmp  +=  Hacker.chars.charAt(Math.ceil(Math.random()*100000000)%Hacker.chars.length)+'  ';
    }
    return tmp;
}
```

## 绘制流程

这个才是重点。

首先我们先绘制一个移动的数码流

```js
if(!json.time) json.time=0;
json.time++;

let str = json.string.substring(json.start*3,(json.end-1)*3);
let start = this.ctx.measureText(json.string.substring(0,json.start*3)).width;

this.ctx.fillText(str,start,json.line*this.lineHeight);

if(json.time==json.speed){
     json.time = 0;

     json.start++;
     json.end++;
}
```

json就是一个数码流结构体，这段代码的意思就是每回绘制的时候，都根据结构体获得当前显示段的起始坐标和要显示的字符串，然后画出来，同时呢计算计时器到没到时间，到时间了就移动显示段，否则就啥也不干。

接下来我们要考虑的是什么时候添加新的数码流，这里采用这样一个时机，效果还不错：显示段末端，到达最大随机显示段长度的位置。

```js
if(json.end==50) {
     let length = Math.ceil(Math.random()*30)+20;
     this.temp.push({speed:2,line:json.line,start:-length-length%20,end:-length%20,string:this.getCharQ(this.length),time:0});
}
```

可以看到显示段长度是从30到50，终止条件为数码流末端到达50行的位置。

```js
draw(){
    this.ctx.clearRect(0,0,this.width,this.height);
    this.temp = [];
    while(this.strings.length!==0){
        let json = this.strings.pop();
        if(!json.time) json.time=0;
        json.time++;

        let str = json.string.substring(json.start*3,(json.end-1)*3);
        let start = this.ctx.measureText(json.string.substring(0,json.start*3)).width;

        this.ctx.fillText(str,start,json.line*this.lineHeight);

        if(json.time==json.speed){
           json.time = 0;

           json.start++;
           json.end++;

           if(json.end==50) {
              let length = Math.ceil(Math.random()*30)+20;
              this.temp.push({speed:2,line:json.line,start:-length-length%20,end:-length%20,string:this.getCharQ(this.length),time:0});
           }
           if(start < this.width) this.temp.push(json);
       }else this.temp.push(json);
    }
    this.strings = this.temp;
}
```

以上是完整的渲染代码。这里有两点优化需要强调:
- 一个是temp这个用于缓存的栈，一定要设置为全局变量，如果在渲染循环中开这个变量的话会造成频繁的内存释放。
- 第二个呢，话就得多点了，cmatrix的实现其实和我这个还是有区别的，细心的朋友可以发现cmatrix的每一个数码流尾部都带一个白色的字符。其实呢，我一开始是实现了这个东东的，很简单嘛，只需要绘制完一个数码流之后在尾部多绘制一个白色字符，但是这里又造成了效率的浪费。canvas是基于状态机的，了解状态机的朋友知道，切换状态这种事可不是给变量赋个值那么简单，全都是效率啊！而在渲染每一个数码流都要切换颜色为绿色再切换颜色为白色，无疑效率爆炸。所以在我发现最后的动画效果有明显卡顿感后，就果断去掉了这个尾缀白色字符的效果，毕竟这个效果不细看根本看不出来嘛！

