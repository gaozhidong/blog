/*
取URL的参数
调用方法

// 取全部
var allVars = $.getUrlVars();
 
// 取单个
var byName = $.getUrlVar('name');

*/
$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  }
});


String.prototype.replaceAll = function(s1,s2){ 

 if(s1=="?")
 s1="\\?";
if(s1=="||")
  s1="\\|\\|";

return this.replace(new RegExp(s1,"gm"),s2); 
}



jQuery.login=function(msg)
{

	layer.open({
    content: msg,
    btn: ['确认', '取消'],
    shadeClose: false,
    yes: function(){
       location.href="login_after.html"
    }, 
    no: function(){
         layer.close();
    }
})

};
jQuery.alert=function(msg)
{

  layer.open({
    content: msg,
    btn: ['OK'],
})

};

//==============================我喜欢的和我的消息tab切换===============================
    $('.like_nav_box a').click(function(){
      var cur=$(this).index();
      $(this).addClass('like_style').siblings('a').removeClass('like_style');
      $('.slideBox').eq(cur).show().siblings('div').hide();
    })