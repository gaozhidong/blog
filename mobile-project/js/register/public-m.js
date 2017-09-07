// API
/*  ajaxurl
*url  服务地址
*data 参数
*type 方法 POST，GET
*jsonp 是否是jsonp方法
*callback
*/
;(function($){

 $.md = $.extend({
        ajaxurl: function (options) {
            options = $.extend({
				url:"",
				type:"GET",
				data:{},
				jsonp:1,
				callback:null
            }, options || {});
			
			if(options.url=="" || options.callback=="")
			{
				return;
			}
//			if(options.callback==null)
//			 {
//				  asyncs=false;
//			 }
//			 else
//			 {
//				 asyncs=true;
//			 }
			if(options.jsonp==1)
			{
				$.ajax({
					dataType:"jsonp",
					url:options.url,
					type:options.type,
					data:options.data,
					//async:false,
					success: function(data){
						calback(data);
						}
				});
			}
			else
			{
				$.ajax({
					url:options.url,
					type:options.type,
					data:options.data,
					//async:asyncs,
					success: function(data){
							calback(data);
						}
				});
			}
				function calback(_data)
				{
						if(options.callback!==null)
						 {
								options.callback.call(this, _data); 
						 }
				}
        }
    }, $.md || {});
})(jQuery);
