呐，其实在GeekBlog我下力气写的东西就仨，一个是简单的博客生成器，一个是前端的终端，一个是数码流背景。待我一个一个慢慢道来...

##博客生成器的结构

一个博客生成器在需求上无非就是提供给使用者简单的接口来创建博客，管理文章。  
呐，分析这两个需求，创建一个博客就是根据模板和配置文件生成一堆静态文件，可以想到流程大概是使用者发送一个命令，出发一个命令回调，然后博客生成器去找项目中的配置文件和模板文件，经过解析模块生成了一堆html、js、css数据，然后把这些数据写入build文件夹。
而管理文章则是通过使用者写的md文档去更新或者生成对于的文章html，当然删除也是可以的。这个流程也大抵是通过一个命令回调，更新项目数据，然后将md文档和对应的文章模板联系起来进行解析，解析完了把数据写入build文件夹  
根据这两个需求，我定的结构是如下的样子  

- cli
	- 命令1回调.js//一个命令回调
	- 命令2回调.js
	- ....js
	- index.js//命令入口
- src
	- server//调试服务器模块
	- databse//数据管理模块
	- parser//解析器模块
	- config.js//参数文件

这个结构呢主要是将核心操作与终端管理解耦，降低代码的复杂程度。这个结构当然是非常简单的，相比与hexo那种插件化的结构显得非常的辣鸡，但是之所以写的这么简单呢，是因为考虑到我的需求是需要一款极简的博客生成器，只需要帮我完成日常的博客管理就好，所以功能相比hexo进行了极大的缩减，在这种情况下做什么插件化结构完全是多此一举。项目起初做架构设计的时候要结合需求，不要盲目的套用设计模式，设计模式是为了降低开发成本的，不要舍本逐末。

##Cli

cli是client的缩写，对于博客生成器而言，命令行的处理就相当于前端：接收事件，转发事件，回显。  
这里必须要感恩node，node是天生可以做命令行应用的，且看：  
```js
#!/usr/bin/env node
console.log(process.argv)
```
只要在我们正常写的node代码前加上一句`#!/usr/bin/env node`，就可以直接被终端执行，在代码中调用`process.argv`接可以获得命令参数了。  
需要注意的是process.argv是一个数组，索引为1的值是命令，后面的索引对应的值就是参数。  
最后，在package.json文件中添加如下语句：
```js
"bin": {
    "geekcli": "cli/index.js"
  }
```
然后使用npm link命令，则可以把`geekcli`设置为全局命令，同时把这个命令与`cli/index.js`文件关联起来。

##解析器

核心部分其实最重要的就是解析器部分了，其他的无非只是一些文件操作而已。

解析器的输入是模板文件和博客数据。原理是基于有限状态机遍历模板文件的每一个字符，进入到命令状态就记录命令，并在跳出命令状态的时候执行同步命令，将命令回调返回的数据插入到结果数据中，然后继续执行解析。  
这里使用一个第三方库叫`markdown`，这个库的作用是将md文件转化为html，通过这个库可以把md文件当作直接的数据插入到模板请求md文件的位置。

```js
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
                            result += `<script>let data = ${JSON.stringify(o)}</script>`;
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
```

目前实现的模板功能包括以html的形式插入data.json的所有数据，以脚本的形式插入data.json的所有数据，插入md文档的内容。

可以看到这段代码我只是通过switch去检测命令的，因为需要实现的只是插入数据功能，所以状态机部分实现的较为简陋，完整实现的话最好是通过词法表来实现，状态转化机的实现方式在此不多说了，想了解的同学看我另一个项目[Compiler](https://github.com/Easonzero/Compiler),这个项目实现了一个简单的编译器，在词法分析部分实现了一个较完整的有限状态机。


