这段时间我和terminal相爱相杀，前一段时间开发了一个项目叫做[TerminalCanvas](https://github.com/Easonzero/TerminalCanvas)，这是一个在linux终端上提供画布接口的node模块，支持监听按键事件和动画，有兴趣的同学可以戳进去瞅瞅。最近呢开发这个GeekBlog，又搞出了一个前端版的terminal。可能是身为一个程序员的原因，觉得图形界面普通无趣，terminal才是最佳的交互方式嘛～所以才不断的跟terminal死磕。

## 一个前端terminal的结构

从功能上来说，terminal需要具备接收用户输入，执行回调方法，返回数据显示在前端这三样功能。从组件划分上考虑呢，至少包括了提示头、游标、命令以及响应。基于以上需求，这里定了如下结构  

- class Terminal
	- input(ch);//接受用户输入接口
	- render();//渲染方法
	- listen();//监听按键事件方法
	- cmdHandler(cmd);//命令回调方法
- class Cursor
	- draw(x,y);//绘制
- class Prompt
	- draw(x,y);//绘制

应该算是很清晰吧，一个terminal在初始化的时候调用监听方法设置按键监听器，发生按键事件则将字码转换为字符传入input方法，input方法主要是调用cmdHandler获得回显内容，然后计算所有组件的位置，通过render方法重新渲染整个界面。

## 命令及响应的数据设计

呐，因为canvas是没有办法换行绘制的，所以必须要在数据结构上将行划分出来，所以数据结构如下：
```js
{
	value:[]//每行的值
	line://总行数
}
```

## 组件位置计算

组件位置计算是为渲染函数减少计算量的重要一环。  
计算位置的时候主要需要考虑三种情况：输入回车时、输入删除键时，输入其他字符时。  

- 输入回车时即为命令响应，需要调用cmdHandler获得回显内容，然后将回显内容转换为统一的数据结构存入响应数组中。最后在命令数组中压入一个空命令即可。游标的位置直接置为末行，水平初位置即可

- 输入删除键的时候情况复杂一些，需要考虑删除操作是否会造成行数减一，如果当前字符是一行的首字符且当前行不是首行，则行数减一，游标上移一行，当前行的内容去掉最后一个字符，同时游标水平位置减去最后一个字符的宽度即可。

- 输入其他字符的时候需要考虑当前字符是否是最后一个字符，如果是就命令数组最后一个命令的行数加一，最后一行内容加上该字符，游标下移一行，水平置为初位置即可。

## 渲染流程设计

一开始做的时候我是不停的重绘全部的Terminal内容，但是考虑一下，其实动画就一个光标闪动效果，没有必要搞成这样对吧，于是采用了如下做法：

```js
self = this;

function cursorAnimate(){
    requestAnimationFrame(cursorAnimate)
    let last = self.curY<self.lineLimit?self.curY:self.lineLimit;
    self.cursor.draw(self.curX+self.cursorOffset,(last-1)*self.lineHeight);
}

cursorAnimate();
```

这个循环渲染在Terminal初始化的时候调用，只是不断的获取游标的位置，然后只渲染游标，至于整个terminal的渲染则是在事件响应的时候被动调用render函数进行渲染，如此大大提升了canvas的性能表现。

ps. 游标的渲染需要保证显示的时间和隐藏的事件相同，所以需要有控制变量来控制隐藏和显示渲染方法的切换。

Render函数的渲染流程也有一些值得考量的地方

- 保证只渲染能显示出来的部分，提升canvas性能  

```js
while(this.offset+_last>0&&i<=this.res.length){
	//遍历命令和响应数组进行渲染
}

```

这一点主要是通过记录当前已经绘制的行数，比较命令行能够容纳的最大行数来实现

- 保证可输入的行永远在命令行窗口内部

```js
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
```

这一点是通过倒序绘制来实现的，也就是遍历命令和响应数组进行渲染的时候永远从命令或者响应的最后一行开始向前绘制。

- 支持滚动

这一点有个很简单的方法，只需要在每会调用canvas绘制接口和判断终止条件的时候，在垂直方向上加上一个偏移变量offset，然后在监听滚动事件的时候只需要根据滚动方向对offset进行增加或者减少就好。


