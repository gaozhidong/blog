
$(function(){
	$("#top").on("click","a.arrow",function(){
			var str2=$.getUrlVar('reurl');
			
			str2 = str2.replaceAll('||','?').replaceAll('__','=').replaceAll('#','&');
			
			window.location.href = str2;
		})	
	//引导页	
	var Lead = {

		init:function(){
			this.sexWrap = $("#sex");
			this.categoriesWrap = $("#categories");
			this.likesWrap = $("#likes");
			this.sex = "";
			this.favorArr = [];
			this.constellationArr = [];

			this._bindEvent();
		},
		_bindEvent:function(){
			var self=this;
			this.sexWrap.find("a").bind("click",self.chooseSex.bind(this)); //选择性别
			this.categoriesWrap.find("a").bind("click",self.wantToJoin.bind(this));//我喜欢
			this.likesWrap.find("a").bind("click",self.myFavor.bind(this));//我想加入
			$("#gotoIndex").bind("a").bind("click",self.ajaxManager.bind(this));//摆架首页
		},
		//选择性别
		chooseSex:function(e){
			var target = e.target;
			if (target.nodeName != "A") return;
			this.sex = parseInt($(target).attr("data-sex"));
			$(target).addClass("sexActive").siblings().removeClass("sexActive");
			//如果是男神,并且已经点击
			if ($(target).hasClass("male") && $(target).hasClass("sexActive")) {
				$(target).find("b").css("background-image","url(../images/boy2.png)");
				$(target).siblings().find("b").css("background-image","url(../images/girl.png)");
			}
			//如果是女神,并且已经点击
			if ($(target).hasClass("female") && $(target).hasClass("sexActive")) {
				$(target).find("b").css("background-image","url(../images/girl2.png)");
				$(target).siblings().find("b").css("background-image","url(../images/boy.png)");
			}
		},
		//我想加入
		wantToJoin:function(e){
			var self=this;
			var target = e.target;
			if (target.nodeName != "A") return;
			//判断是否已经点击过
			if ($(target).hasClass("sexActive")) {
				$(target).removeClass("sexActive");
				this.favorArr.pop($(target).attr("data-type"));
			}
			else{
				$(target).addClass("sexActive");
				this.favorArr.push($(target).attr("data-type"));
			}
		},
		//我喜欢
		myFavor:function(e){
			var self=this;	
			var target = e.target;
			if (target.nodeName != "A") return;
			//判断是否已经点击过
			if ($(target).hasClass("sexActive")) {
				$(target).removeClass("sexActive");
				this.constellationArr.pop($(target).text());
			}else{
				$(target).addClass("sexActive");
				this.constellationArr.push($(target).text());
			}
		},
		ajaxManager:function(){
			var self = this,
				favor = '',
				star = '',
				defaultSex = this.sexWrap.find("a.female").attr("data-sex");//默认是女神
			favor = this.favorArr.join(" ");
			star = this.constellationArr.join(" ");
			var chooseSex = this.sex;
			//如果用户没有选选择性别,则默认是女神
			if (this.sex == '') {
				chooseSex = parseInt(defaultSex);
			};
		    var option={
		        url: MoonduDomain + '/UserCenter/SaveGuide',
		        data:{sex:chooseSex,categories:favor,likes:star},
		        callback:function(res){
		        	if (res.Result) {
						location.href="index.html";
					};
		         }
		      }
		   $.md.ajaxurl(option);
		}
	}
	/*圈子首页点击tab切换*/
	var Slider = {
		tabs:$(".circle-tab").find("a"),
		container:$(".swiper-slide"),
		init:function(){
			this._bindEvent();
		},
		_bindEvent:function(){
			var self=this;
			this.tabs.on("click",self.tabsEvent.bind(this));
		},
		tabsEvent:function(e){
			var self=this;
			var currentIndex=parseInt(e.target.parentNode.getAttribute("data-index"));
			self.tabs.removeClass("cur");
			self.tabs.eq(currentIndex).addClass("cur");
			self.container.addClass("hidden");
			self.container.eq(currentIndex).removeClass("hidden");
		}
	}
	//圈子
	var MZCircle = {

		init:function(){
			var self = this;
			this.$wrap = $("#circle-page");
			this.myDreamWrap=$("#myDream");
			this.friendDreamWrap = $("#friendDream");
			this.commentPage = $("#comment-page");
			this.commentLayer = $("#commentLayer");
			this.layer=$(MZConfig.layer);
			$(".foot_bar").before(this.layer);
			this.userInfor = {};
			this.fpage = 1;//好友梦话
			this.mpage = 1 ;//我的梦话
			this.fcallAjax = true;//是否接受ajax请求
			this.mcallAjax = true;//是否接受ajax请求

			this._getCurrentUserInforAjax();
			this._bindEvent();
		},
		_bindEvent:function(){
			var self=this;
			this.getFriendDreamAjax(self.fpage);
			this.getMyDreamAjax(self.mpage);
			//点赞
			this.$wrap.on("click","a[data-type=love]",self.praiseAjax);
			//我的梦话删除按钮是否出现

			//判断是否滚动到底部
			$(window).scroll(function () {
			    if ($(document).scrollTop() + $(window).height() + 50 >= $(document).height()) {
			    	if (self.fpage == -1) return;
					if (self.mpage == -1) return;
			    	self.fpage ++;
			    	self.mpage ++;
			    	if (self.mpage > 1) {
			    		if (!self.mcallAjax) return;
          				self.mcallAjax = false;
			    		self.getMyDreamAjax(self.mpage);
			    	}
			    	if (self.fpage > 1) {
			    		if (!self.fcallAjax) return;
          				self.fcallAjax = false;
			    		self.getFriendDreamAjax(self.fpage);
			    	}
			    }
			});

			Slider.init(); //梦话tab切换
		},
		_getCurrentUserInforAjax:function(){
			var self = this;
			var option = {
			    url:MoonduDomain+'/UserCenter/GetUserInfo',
			    callback:function(res){
			    	if (res.Result &&　res.Result != 'nologin') {
			    		self.userInfor.name = res.Data.UserNick;
			      		self.userInfor.portrait = res.Data.Image;
			      		self.userInfor.id = res.Data.Uid;
			      		self.userInfor.isLogined = true;
			      		//判断头像是否为空，若是为空，显示默认头像
		      			if (self.userInfor.portrait == undefined || self.userInfor.portrait == '' || this.userInfor.portrait == null || self.userInfor.portrait == 'http://zoneimages.moonbasa.com/images/user.jpg') {
					      	self.userInfor.portrait = 'images/user.jpg';
					    }
			    	}else{
			    		$.login("是否登录")
			    	}
			    }
		   }
			$.md.ajaxurl(option);
		},
		//===================好友梦话模块渲染===================
		friendDreamRender:function(data){
			var self = this,
				html = "",
				dreamTemp = document.getElementById("dreamTemp").innerHTML,
				temp = new EJS({"text": dreamTemp});
			for (var i = 0; i < data.length; i++) {
				html += temp.render(data[i]);
			};
			this.friendDreamWrap.append(html);
			//判断用户头像是否为空，若是为空，则显示默认头像
			var item = this.friendDreamWrap.find('.item');
			//标签用#ff7f00颜色标识
			item.each(function(){
				if ($(this).find('.title').text() == '') return;
				var index = $(this).find('.title').text().indexOf('#'),
					str = $(this).find('.title').text(),
					declare = $(this).find('.title').text().substring(0,index),
					tags = $(this).find('.title').text().substring(index),
					spanElement = $('<span>'+tags+'</span>');
				if (index > -1) {
					$(this).find('.title').text(declare);
					spanElement.css('color','#ff7f00');
					$(this).find('.title').append(spanElement);
				};
			});
			//页面渲染时的点赞状态
			this.isPraiseAjax();
		},
		addZero:function(num){
			if (num < 10) {
				num = "0" + num;
			};
			return num;
		},
		//================点赞================
		addPraise:function(obj){
			var num = parseInt($(obj).next().text());
			$(obj).removeClass("love").addClass("love-after");
			num ++;
			$(obj).next().text(num);
		},
		//==========================取消赞=============================
		cancelPraise:function(obj){
			$(obj).removeClass("love-after").addClass("love");
		},
		//页面渲染时候的点赞状态
		isPraiseAjax:function(){
			var self = this,
				item = this.friendDreamWrap.find('.item'),
				pidArr = [];
			for (var i = 0; i < item.length; i++) {
				pidArr.push($(item[i]).attr('data-pid'))
			};
			var pid = pidArr.join(',');
		    var option = {
		        url:MoonduDomain+'/photo/GetLikedPhoto',
		        data:{pid:pid},
		        callback:function(res){
		        	if (res.Result) {
						//通过返回的pid找到dom节点
						for (var i = 0; i < res.Data.length; i++) {
							var picId = res.Data[i].Pid;
							self.friendDreamWrap.find("div[data-pid="+picId+"]").find('a[data-type=love]').removeClass('love').addClass('love-after');
						}
					}
		         }
		      }
		   $.md.ajaxurl(option);
		},
		//=============我的梦话模块渲染============
		myDreamRender:function(data){
			var self = this;
			var html = "",
				myDreamTemp = document.getElementById("myDreamTemp").innerHTML,
				temp = new EJS({"text": myDreamTemp});
			for (var i = 0; i < data.length; i++) {
				html += temp.render(data[i]);
			};
			this.myDreamWrap.append(html);
			this.myDreamWrap.find("a.delete").bind("click",self.dialogShow.bind(this));
			//判断是否是当前登录人发表的图片，如果是，则显示删除按钮；否则隐藏删除按钮
			var item = this.myDreamWrap.find(".item");
			item.each(function(){
				//是否显示删除按钮
				if ($(this).attr('data-login') == 'true') {
					var isDelete = parseInt($(this).attr('data-isDelete'));
					if ( isDelete== 0 || isDelete == 1) {
						$(this).find('.delete').show();
					}
					if (isDelete == 2 || isDelete == 3) {
						$(this).find('.delete').hide();
					}
				}else{
					$(this[i]).find('a.delete').hide();
				}
				//标签用#ff7f00颜色标识
				if ($(this).find('.title').text() == '') return;
				var index = $(this).find('.title').text().indexOf('#'),
					str = $(this).find('.title').text(),
					declare = $(this).find('.title').text().substring(0,index),
					tags = $(this).find('.title').text().substring(index),
					spanElement = $('<span>'+tags+'</span>');
				if (index > -1) {
					$(this).find('.title').text(declare);
					spanElement.css('color','#ff7f00');
					$(this).find('.title').append(spanElement);
				};
			});
		},
		dialogShow:function(e){
			var target = e.target;
			var self = this;
			this.layer.removeClass("hidden");
			this.layer.find("a.ensure").unbind('click');//解除绑定事件
			this.layer.find("a.ensure").bind("click",self.deleteMyDreamPhotoAjax.bind($(target)));
			this.layer.find("a.cancel").bind("click",function(){
				self.layer.addClass("hidden");
			});
		},
		//===============判断是否点赞成功
		praiseAjax:function(e){
			var target = e.target;
			var pid = $(this).parents("ul").find("input[data-type=pictureId]").val();
			if (MZCircle.userInfor.isLogined) {
				$(this).hasClass('love-after') == true ? layerShow() : praise(); 
			}else{
				$.login("是否登录");
			}
			function praise(){
				var option={
			        url:MoonduDomain+'/photo/OptLike',
			        data:{pid:pid,otype:0},
			        callback:function(res){
			           if (res.Result){
							MZCircle.addPraise($(target));	
			           }
			        }
		    	}
		   		$.md.ajaxurl(option);
			}
		   function layerShow(){
     		 	layer.open({
				    content: '已经点过赞',
				    btn: ['OK']
				});
     		 }
		},
		//================好友梦话数据============
		getFriendDreamAjax:function(page){
			var self=this;
			var option={
		        url:MoonduDomain + "/Circle/FriendsTalk",
		        data:{page:page,pagesize:10},
		        callback:function(res){
		           if (res.Result) {
						if (res.Data.Rows.length > 0) {
							self.friendDreamRender(res.Data.Rows);
							self.fcallAjax = true;
						}else{
							self.fpage = -1;
						}
					}
		        }
		    }
		   $.md.ajaxurl(option);
		},
		//===============我的梦话数据=========
		getMyDreamAjax:function(page){
			var self=this;
			var option={
		        url:MoonduDomain+'/photo/GetUsePhotoByUid',
		        data:{uid:'',page:page,pagesize:10},
		        callback:function(res){
		           if (res.Result) {
						if (res.Result != "nologin" && res.Data.Rows.length > 0) {
							self.myDreamRender(res.Data.Rows);
							self.mcallAjax = true;
						}else{
							self.mpage = -1;
						}
					}
		        }
		    }
		   $.md.ajaxurl(option);
		},
		//================我的梦话判断是否要删除相片=============
		deleteMyDreamPhotoAjax:function(){
			var currentParent = $(this).parents('.item'),
				pid = $(this).parent().find("input[data-pid=pictureId]").val();
			var option={
		        url:MoonduDomain+'/photo/DelPhoto',
		        data:{pid:pid},
		        callback:function(res){
		           if (res.Result){
	           			MZCircle.layer.addClass("hidden");
						currentParent.remove();
					}
					else{
						$.alert("删除失败")
					} 
		        }
		    }
		   $.md.ajaxurl(option);
		}
	}
	//主程序入口
	var MainEntrance={
		
		init:function(){

			switch($("body").attr("data-fn")){
				
				case "lead" : Lead.init(); break; //引导页

				case "circle" : MZCircle.init(); break; //圈子
			}
		}
	}
	MainEntrance.init();
});