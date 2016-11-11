#内存管理
###Reduce
1. 差异化对待
 * 缓存容量
 
 * 图片资源
2. 按需加载资源
3. 减小Bitmap对象的内存占用
 * inSampleSize
 
 * decode format

###Reuse
1. pools(按用的次数多少分类)
2. Bitmap对象的复用(Bitmap池)
3. listview or girdview中contertview的复用
4. 避免频繁的创建与回收对象(内存抖动)

###Recycle
1. Activity内存泄漏
 * 内部类
 * 集合类
 * static singleton
2. 谨慎选择Context  
![image](http://github.com/Easonzero/interview/raw/master/res/android_context.png)  
3. 注意有生命周期对象的注销
4. 注意极耗内存对象的及时回收
 * Bitmap
 
 * Webview
 
 * Cursor
5. onTrimMemory()与 onLowMemory()

###Refactor
1. 使用优化过的数据结构
 * Hashmap->Arraymap/Sparsexxxmap
 
 * enum->static
2. 减少内存的碎片化
3. 优化布局，节省内存损耗

###Revalue
1. 谨慎使用largeHeap
2. 谨慎使用多进程
3. 谨慎使用第三方类库
