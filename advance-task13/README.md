## 跨域

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
