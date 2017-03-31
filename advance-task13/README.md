## 跨域

#### CORS
        CORS全称是跨域资源共享（Cross-Origin Resource Sharing），是一种ajax跨域请求资源的方式，支持现代浏览器，IE支持10以上。
###### 实现方式
       当你使用 XMLHttpRequest 发送请求时，浏览器发现该请求不符合同源策略，会给该请求加一个请求头：Origin，后台进行一系列处理，如果确定接受请求则在返回结果中加入一个响应头：Access-Control-Allow-Origin; 浏览器判断该相应头中是否包含 Origin 的值，如果有则浏览器会处理响应，我们就可以拿到响应数据，如果不包含浏览器直接驳回，这时我们无法拿到响应数据。所以 CORS 的表象是让你觉得它与同源的 ajax 请求没啥区别，代码完全一样。
       [只允许b.jrg.com访问](http://upload-images.jianshu.io/upload_images/5007981-52113f6ad1c55d98.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
#### 降域
        两个页面不同域，但是它们的父域之上都相同(端口)，那么可以使用降域的方法
        如a.html 的url为 a.kylewh.com:8080/a.html;
        a.html 的url为 b.kylewh.com:8080/b.html;
        那么将二者都使用document.domaim = 'kylewh.com';
        即可使二者之间进行跨域。

        降域存在局限性。


#### postMessage
        postMessage的原理是会向另一个地方发送信息，另一个地方通常是iframe,或者是由当前页面弹出的窗口。参数是：信息以及表示接受消息方的来自哪个域的字符串，如果给定*便是不限定接受者的域。
        所以在一个html中嵌入另一个html文件的iframe，并且互相发送postMessage并响应在input框以此来观察效果。
