
	$(function(){

		//热门人物
		var Sensation={

			init:function(){
				var self = this;
				this.page = 1; //从第一页开始
				this.callAjax = true;//是否接受ajax请求
				this.userInfor = {};//存储当前用户信息
				this.hotPersonInfor = []; //存储列表的所有信息
				this.$wrap = $("#sensation");

				this._getCurrentUserInforAjax();
				this._bindEvent();
			},
			_bindEvent:function(){
				var self = this;
				this.getHotPersonListAjax(self.page);//获取列表数据
				this.$wrap.on("click",".attention",self.attentionModAjax.bind(this));//关注
				this.$wrap.on("click",".hot-active",self.cancelAttentionModAjax.bind(this));//取消关注
				//判断是否滚动到了底部
				$(window).scroll(function(){
					 if ($(document).scrollTop() + $(window).height() + 100 >= $(document).height()){
					 	if (self.page == -1) return;
					 	self.page ++;
					 	if (self.page > 1) {
					 		if (!self.callAjax) return;
					 		self.getHotPersonListAjax(self.page);
					 	}
					 }
				});	
			},
			_getCurrentUserInforAjax:function(){
				var self = this;
				var option = {
					url:MoonduDomain+'/UserCenter/GetUserInfo',
					callback:function(res){
						if (res.Result && res.Result!="nologin") {
							self.userInfor.name = res.Data.UserNick;
							self.userInfor.portrait = res.Data.Image;
							self.userInfor.id = res.Data.Uid;
							self.userInfor.isLogined = true;
							//判断头像是否为空，若是为空，显示默认头像
			      			if (self.userInfor.portrait == 'http://zoneimages.moonbasa.com/images/user.jpg' || self.userInfor.portrait == '') {
						      	self.userInfor.portrait = 'images/user.jpg';
						    }
						};
					}
				}
				$.md.ajaxurl(option);
			},
			//================热门人物模块渲染=============
			sensationRender:function(data){
				var self = this;
				var	html = "";
				var	sensationTmp = document.getElementById("sensationTmp").innerHTML;
				var	temp = new EJS({"text": sensationTmp});
				for (var i = 0; i < data.length; i++) {
					html += temp.render(data[i]);
					self.hotPersonInfor.push(data[i]);
					//标签字数多余12个，则隐藏
				};
				this.$wrap.find("ul").append(html);

				var item = this.$wrap.find("ul").find('li');
				for (var i = 0; i < item.length; i++) {
					//判断用户头像是否为空。若是为空，则显示默认头像
					if ($(item[i]).find('a.portrait').find('img').attr('src') == '') {
						$(item[i]).find('a.portrait').find('img').attr('src','images/user.jpg');
					}
					//标签多余12个字，则隐藏
					if ($(item[i]).find('.introduction').find('p').text().trim() != '') {
						if ($(item[i]).find('.introduction').find('p').text().trim().length > 11) {
							tags = $(item[i]).find('.introduction').find('p').text().trim().substring(0,11);
							$(item[i]).find('.introduction').find('p').text(tags);
						}
					}
					//如果是已关注状态，为0人关注，则修改为1人关注
					if ($(item[i]).find('a.payattention').text().trim() == '已关注' && $(item[i]).find('span.attention-num').text().trim() == '0个粉丝') {
						$(item[i]).find('span.attention-num').text('1个粉丝');
					};
				}
			},
			//===================关注==================
			attentionMod:function(obj){
				var xcount = parseInt($(obj).parent().find(".attention-num").text().match(/\d+/)[0]);
				$(obj).removeClass("attention").addClass("hot-active");
				$(obj).text("已关注");
				xcount ++;
				$(obj).parent().find(".attention-num").text(xcount + "人关注");
			},
			//==================取消关注================
			cancelAttentionMod:function(obj){
				var xcount = parseInt($(obj).parent().find(".attention-num").text().match(/\d+/)[0]);
				$(obj).removeClass("hot-active").addClass("attention");
				$(obj).text("+关注");
				xcount == 0 ? xcount = 0 : xcount --;
				$(obj).parent().find(".attention-num").text(xcount + "人关注");
			},
			attentionModAjax:function(e){
				var self = this,target = e.target,userAttentionid = $(target).attr("data-id"); 
				if (target.nodeName != "A") return;
				this.userInfor.isLogined == true ? attention() : $.login('是否登录！');
				function attention(){
					var option = {
				        url:MoonduDomain + "/Found/MFocus",
				        data:{fansId:userAttentionid,flag:0},
				        callback:function(res){
				        	if(res.Result){
							  	self.attentionMod($(target));
							}else{
								$.alert(res.Msg);
							}
				        }
			    	}
		   		$.md.ajaxurl(option);
				}
			},
			cancelAttentionModAjax:function(e){
				var self = this,target = e.target,userCancelAttentionid = $(target).attr("data-id");
				if (target.nodeName != "A") return;
				this.userInfor.isLogined == true ? cancelAttention() : $.login('是否登录！');
				function cancelAttention(){
					var option={
				        url:MoonduDomain + "/Found/MFocus",
				        data:{fansId:userCancelAttentionid,flag:1},
				        callback:function(res){
				        	if(res.Result){
							  	self.cancelAttentionMod($(target));
							}
				        }
			    	}
		   		$.md.ajaxurl(option);
				}
			},
			getHotPersonListAjax:function(page){
				var self = this;
				var option = {
			        url:MoonduDomain + '/UserCenterB/HotUsers',
			        data:{page:page,pagesize:10},
			        callback:function(res){
			        	if (!res.Result) return;
						//判断数据是否加载完
						if (res.Data.Rows.length > 0) {
							self.sensationRender(res.Data.Rows);
							self.callAjax = true;
						}
						else{
							self.page = -1;
						}
			        }
		    	}
		   		$.md.ajaxurl(option);
			}
		}
		//搜索人物
		var Search = {

			init:function(){
				var self = this;
				this.page = 1;
				this.callAjax = true;//是否接受ajax请求
				this.userInfor = {};
				this.$top = $("#top");
				this.$wrap = $("#search");
				this.serchField = $("#serchField");

				this._getCurrentUserInforAjax();
				this._bindEvent();
			},
			_bindEvent:function(){
				var self = this;
				this.getSearchUserAjax();
				var txt = $.getUrlVar('value');
				//鼠标抬起时去后台请求数据
				this.serchField.find("input.searchBox").unbind();
				//点击搜索按钮，开始查找
				this.serchField.find("input.searchBox").bind('keyup',function(){
					//先判断搜索框是不是空的,如果是空的，将‘取消’改为‘搜索’
					if (self.serchField.find("input.searchBox").text().trim() == '') {
						self.serchField.find("a[data-fn=search]").text('搜索');
						//添加alreadySearch，判断是不是通过点击来进行搜索
						self.serchField.find("a[data-fn=search]").addClass("alreadySearch");
					}
				});
				//点击‘搜索’开始查找	
				this.serchField.find('a[data-fn=search]').bind('click',self.getSearchUserAjax.bind(this));

				this.serchField.on("click","a[data-fn=search]",function(){
					if (self.serchField.find("input.searchBox").val() != '') {
						self.serchField.find("a[data-fn=search]").addClass("alreadySearch");
					}
				})
				//关注和取消关注
				self.$wrap.on("click","a.hot-active",self.cancelAttentionModAjax.bind(this));
				self.$wrap.on("click","a.attention",self.attentionModAjax.bind(this));
				//判断是否滚动到了底部
				$(window).scroll(function () {
				    if ($(document).scrollTop() + $(window).height() + 50 >= $(document).height()) {
				    	if (self.page == -1) return;
				    	self.page ++;
				    	if (self.page > 1) {
				    		 if (!self.callAjax) return;
				    		  self.callAjax = false;
				    		  //判断是搜索渲染页面还是滚动追加页面
				      		  self.$wrap.addClass('iScroll');
				      		  self.getSearchUserAjax(self.page);
				    	}
				    }
				});
				//当前用户不能关注自己
				self.$wrap.on('click','a[data-type=attention]',function(){
					if ($(this).attr('data-id') == self.userInfor.id) {
						layer.open({
						    content: '不能关注自己',
						    btn: ['OK']
						});
					};
				})
			},
			_getCurrentUserInforAjax:function(){
				var self = this;
				var option = {
					url:MoonduDomain+'/UserCenter/GetUserInfo',
					callback:function(res){
						if (res.Result && res.Result != 'nologin') {
							self.userInfor.name = res.Data.UserNick;
							self.userInfor.portrait = res.Data.Image;
							self.userInfor.id = res.Data.Uid;
							self.userInfor.isLogined = true;
							//判断头像是否为空，若是为空，显示默认头像
			      			if (self.userInfor.portrait == 'http://zoneimages.moonbasa.com/images/user.jpg' || self.userInfor.portrait == '') {
						      	self.userInfor.portrait = 'images/user.jpg';
						    }
						};
					}
				}
				$.md.ajaxurl(option);
			},
			//==========渲染页面=======
			searchRender:function(data){
				var self = this;
				var	html = "";
				var	searchTemp = document.getElementById("searchTemp");
				var	temp = new EJS({"text": searchTemp});
				for (var i = 0; i < data.length; i++) {
					html += temp.render(data[i]);
				};
				//判断是搜索渲染页面还是滚动追加页面
				if (this.$wrap.hasClass('iScroll')) {
					this.$wrap.find("ul").append(html);
				}else{
					this.$wrap.find("ul").html(html);
				}
				var item = this.$wrap.find("ul").find('li');
				//判断头像是否为空。若是为空，则显示默认头像
				for (var i = 0; i < item.length; i++) {
					if ($(item[i]).find('a.portrait').find('img').attr('src') == '') {
						$(item[i]).find('a.portrait').find('img').attr('src','images/user.jpg');
					};
					//标签多余12个字符，则剩余的隐藏
					if ($(item[i]).find('.introduction').find('p').text().trim() != '') {
						if ($(item[i]).find('.introduction').find('p').text().trim().length > 11) {
							tags = $(item[i]).find('.introduction').find('p').text().trim().substring(0,11);
							$(item[i]).find('.introduction').find('p').text(tags);
						}
					}
					//如果是已关注状态，为0人关注，则修改为1人关注
					if ($(item[i]).find('a[data-type=attention]').text().trim() == '已关注' && $(item[i]).find('.attention-num').text().trim() == '0人关注') {
						$(item[i]).find('.attention-num').text('1人关注');
					};
				};
			},
			//===================关注==================
			attentionMod:function(obj){
				var xcount = parseInt($(obj).parent().find(".attention-num").text().match(/\d+/)[0]);
				$(obj).removeClass("attention").addClass("hot-active");
				$(obj).text("已关注");
				xcount ++;
				$(obj).parent().find(".attention-num").text(xcount + "人关注");
			},
			//==================取消关注================
			cancelAttentionMod:function(obj){
				var xcount = parseInt($(obj).parent().find(".attention-num").text().match(/\d+/)[0]);
				$(obj).removeClass("hot-active").addClass("attention");
				$(obj).text("+关注");
				xcount == 0 ? xcount = 0 : xcount --;
				$(obj).parent().find(".attention-num").text(xcount + "人关注");
			},
			attentionModAjax:function(e){
				var self = this,target = e.target,userAttentionid = $(target).attr("data-id");
				if (target.nodeName != "A") return;
				this.userInfor.isLogined == true ? 	attention() : $.login('是否登录！');
				function attention(){
					//当前登录人不能关注自己
					userAttentionid == self.userInfor.id ? getMyselfState() : getFocusState();
				}
				function getMyselfState(){
					layer.open({
						content: '不能关注自己',
						btn: ['OK']
					});
				}
				function getFocusState(){
					var option={
				        url:MoonduDomain  + "/Found/MFocus",
				        data:{fansId:userAttentionid,flag:0},
				        callback:function(res){
				        	if(res.Result){
							  	self.attentionMod($(target));
							}
				        }
		    		}
		   			$.md.ajaxurl(option);
				}
			},
			cancelAttentionModAjax:function(e){
				var self = this,target = e.target,userCancelAttentionid = $(target).attr("data-id");
				if (target.nodeName != "A") return;
				this.userInfor.isLogined == true ? 	cancelAttention() : $.login('是否登录！');
				function cancelAttention(){
					var option = {
				        url:MoonduDomain + "/Found/MFocus",
				        data:{fansId:userCancelAttentionid,flag:1},
				        callback:function(res){
				        	if(res.Result){
						  		self.cancelAttentionMod($(target));
							}
				        }
			    	}
			   		$.md.ajaxurl(option);
				}
			},
			//==========获取搜索出的人物数据========
			getSearchUserAjax:function(){
				var self = this,
					page = this.page,
					txt = decodeURIComponent($.getUrlVar('value'));
				//如果是点击‘搜索’进行的搜索,则清空地址栏上的value,搜索内容为输入框里的文字
				if (this.serchField.find("a[data-fn=search]").hasClass("alreadySearch")) {
					txt = decodeURIComponent(this.serchField.find("input.searchBox").val());
				};
				this.serchField.find("input").val(txt);
				var option={
			        url:MoonduDomain  + '/UserCenterB/SearchUser',
			        data:{page:page,pagesize:10,usertxt:txt},
			        callback:function(res){
			        	if (res.Result){
							if (res.Data.Rows.length > 0) {
								self.searchRender(res.Data.Rows);
								self.callAjax = true;
							}else{
								//fix bug-如果搜索不到数据，给用户相关提示
								if(res.Data.Rows.length == 0 && $(window).scrollTop() == 0){
									self.$wrap.find("ul").html('');
									layer.open({
									    content: '没有搜索到相关记录',
									    btn: ['OK']
									});
									self.page = 1;
								}else{
									self.page = -1;
								}
							}
						}
			        }
		    	}
		   		$.md.ajaxurl(option);
			}
		}
		//热门内容
		var HotContent={

			init:function(){
				var self = this;
				this.page = 1;
				this.cpage = 1;//评论页
				this.callAjax = true;//是否接受ajax请求
				this.commentCallAjax = true;
				this.userInfor = {};//存储当前用户信息
				this.commentList = []; //存储评论数据
				this.newsList = []; //存储新闻列表
				this.clickNum = 0;  //点击评论按钮的次数
				this.commentHTML = ''; //评论页的html
				this.newsScrollTop = 0;
				this.$top = $("#top");
				this.discussWrap = $("#hotDiscuss");
				this.commentLayer = $("#commentLayer");
				this.commentPage = $("#comment-page");

				this._getCurrentUserInforAjax();
				this._bindEvent();
			},
			_bindEvent:function(){
				var self = this;
				//获取列表信息
				this.getHotMessageAjax(self.page);
				//判断评论是否成功，发表评论
				this.commentLayer.on("click","button",self.isCommentSuccessAjax.bind(this));
				//评论页面出现
				this.discussWrap.off('click');
				this.discussWrap.on("click","span[data-type=comment]",function(){
					//点击评论按钮时记录滚动条的高度
					self.newsScrollTop = $('body').scrollTop();
					$('html,body').animate({scrollTop: 0}, 0);
					//添加评论列表所在资讯的标志
					$(this).parents('.list-item').addClass('cur').siblings().removeClass('cur');
					if (self.clickNum == 0) {
						self.getCommentListAjax(1);
					}else{
						self.cpage = 1;
						self.commentHTML = '';
						self.commentPage.find('span.num').text('0');
						self.commentPage.find("ul").html("");
						self.getCommentListAjax(self.cpage);
					}
					self.discussWrap.addClass("hidden");
					self.commentLayer.removeClass("hidden");
					self.commentPage.removeClass("hidden");
					self.$top.addClass("hidden");
					self.commentPage.find(".top").removeClass("hidden");

					self.clickNum ++;
				});
				//评论页消失，返回热门内容
				this.commentPage.on('click','a.arrow',function(){
					self.discussWrap.removeClass("hidden");
					self.commentLayer.addClass("hidden");
					self.commentPage.addClass("hidden");
					self.$top.removeClass("hidden");
					self.commentPage.find(".top").addClass("hidden");
					//返回原滚动条的位置
					$('html,body').animate({scrollTop: self.newsScrollTop}, 0);
				})
				////fix-bug --判断scroll事件是list-item数据加载还是commentPage评论数据加载
				$(window).scroll(function () {
				    if ($(document).scrollTop() + $(window).height() + 20 >= $(document).height()) {
				    	//如果评论页面有hidden,则表明是list-item数据加载
				    	if (self.commentPage.hasClass('hidden')) {
				    		if (self.page == -1)  return;
					    	self.page ++;
					    	if (self.page > 1) {
					    		 if (!self.callAjax) return;
					    		  self.callAjax = false;
					        	  self.getHotMessageAjax(self.page);
					    	}
				    	}else{
				    		if (self.cpage == -1) return;
							self.cpage ++;
							if (self.cpage > 1) {
								if (!self.commentCallAjax) return;
								self.commentCallAjax = false;
								self.getCommentListAjax();
								//记录滚动条的位置
					        	self.commentScroll = $(window).scrollTop();
							}
				    	}
				    }
				});
			},
			_getCurrentUserInforAjax:function(){
				var self = this;
				var option={
					url:MoonduDomain+'/UserCenter/GetUserInfo',
					callback:function(res){
						/*if (res.Result == "nologin") {
							layer.open({
								content:res.Msg,
								btn: ['OK']
							});
							location.href = "login_after.html";
						}*/
						if (res.Result && res.Result != 'nologin') {
							self.userInfor.name = res.Data.UserNick;
							self.userInfor.portrait = res.Data.Image;
							self.userInfor.id = res.Data.Uid;
							self.userInfor.isLogined = true;
							//判断头像是否为空，若是为空，显示默认头像
			      			if (self.userInfor.portrait == 'http://zoneimages.moonbasa.com/images/user.jpg' || self.userInfor.portrait == '' || self.userInfor.portrait == null) {
						      	self.userInfor.portrait = 'images/user.jpg';
						    }
						};
					}
				}
				$.md.ajaxurl(option);
			},
			//======================用户评论模块渲染=======================
			commentRender:function(data){
				var self = this,
					html = '',
					commentTemp = document.getElementById("userCommentTemp").innerHTML,
					temp = new EJS({"text": commentTemp}),
					item = this.discussWrap.find('.list-item').filter('.cur');
				for (var i = 0; i < data.length; i++) {
					this.commentHTML += temp.render(data[i]);
					this.commentList.push(data[i]);
				};
				var oul = this.commentPage.find("ul").html(this.commentHTML);
				$('html,body').one('scroll',function(){
					$('html,body').animate({scrollTop: '0px'}, 500);
				});
				//评论数量
				var commentNum = $(item).find('sup').text().match(/\d+/)[0];
				this.commentPage.find("span.num").text(commentNum);
				//评论为空，则隐藏；
				this.commentPage.find("ul").find('li').each(function(){
					if ($(this).find('.replay').text() == '') {
						$(this).addClass('hidden');
					};
				});
			},
			//============添加评论==========
			addComment:function(content){
				var	self = this,
					reurl=window.location.href, 
		        	index = reurl.lastIndexOf('/') + 1,
		        	Reurl = reurl.substring(index);
		        Reurl = Reurl.replaceAll('?','||').replaceAll('=','__').replaceAll('&','#');
				var	parms = {
						time:self.addZero(new Date().getHours()) +":"+self.addZero(new Date().getMinutes()),
						day:new Date().getFullYear() +"年" + self.addZero(new Date().getMonth() + 1) + "月"+self.addZero(new Date().getDate())+"日",
					};
				var oli = "<li>\
							<a href='public_home.html?id="+self.userInfor.id+"&reurl="+Reurl+"' class='left-item fl'>\
								<img class='user-icon fl' src='"+this.userInfor.portrait+"'>\
							</a>\
							<span class='user'>"+this.userInfor.name+"</span>\
							"+parms.day + "<span class='time'>  " + parms.time + "</span>\
							<p class='content'> " + content + "</p>\
						</li>";
				this.commentPage.find("ul").prepend(oli);
				this.commentLayer.find("input").val("");
				//评论数量
				var commentNum = parseInt(this.commentPage.find('span.num').text());
				this.commentPage.find('span.num').text(commentNum + 1);

				this.discussWrap.find('.list-item').filter('.cur').find('sup').text(commentNum + 1);
			},
			addZero:function(num){
				if (num < 10) {
					num = "0" + num;
				};
				return num;
			},
			//============热门资讯模块渲染==========
			hotMessageRender:function(data){
				var self = this,
					html = "",
					hotDiscussTemp = document.getElementById("hotDiscussTemp").innerHTML,
					temp =  new EJS({"text": hotDiscussTemp});
				for (var i = 0; i < data.length; i++) {
					html += temp.render(data[i]);
					this.newsList.push(data[i]);
				};
				this.discussWrap.append(html);
			},
			//===============获取评论列表==============
			getCommentListAjax:function(){
				var self = this,
					page = this.cpage,
					postId = this.discussWrap.find('.list-item').filter('.cur').attr('data-post');
		   		var option={
		            url:MoonduDomain+'/MNewsB/CommList',
		            data:{action:'list_news',newid:postId,pageindex:page},
		            callback:function(res){
		            	if (res.Result) {
		            		if (res.Data.Rows.length > 0) {
		        				//如果是第二次点击，则把前面的清空
		        				if (self.clickNum > 1) {
		        					self.commentPage.find("ul").html('');
		        				}
		        				self.commentRender(res.Data.Rows);
	        					self.commentCallAjax = true;
		        			}else{
		        				self.cpage = -1;
		        			}
						};
		            }
		        }
		       	$.md.ajaxurl(option);
			},
			//============判断用户发表评论是否成功====
			isCommentSuccessAjax:function(){
				var self = this;
				//有cur的class就是当前资讯的评论列表
				var parms = {
					content:HotContent.commentLayer.find('input').val(),
					messageId:parseInt(this.discussWrap.find('.list-item').filter('.cur').attr('data-post'))
				}
				this.userInfor.isLogined == true ? comment() : $.login('是否登录?');
				function comment(){
					$.trim(parms.content) == '' ? promptDialog('亲，你还没有输入内容哦！') : addCommentSuccess();
				}
		        function addCommentSuccess(){
		        	var option = {
			            url:MoonduDomain+'/MNews/CommPost',
			            data:{newid:parms.messageId,content:parms.content},
			            callback:function(res){
			            	if (res.Result) {
			            		self.addComment(parms.content);
							}
			            }
		        	}
		        $.md.ajaxurl(option);
		        }
			},
			getHotMessageAjax:function(page){
				var self = this;
		       var option={
		            url:MoonduDomain+'/MNewsB/NewsList',
		            data:{type:2,pageindex:page},
		            callback:function(res){
		            	if (res.Result){
							if (res.Data.Rows.length > 0) {
								self.hotMessageRender(res.Data.Rows);
								self.callAjax = true;
							}else{
								self.page = -1;
							}
						}
		            }
		        }
		       $.md.ajaxurl(option);
			}
		}
		//热门标签相册
		var HotPhotos={

			init:function(){
				var self = this;
				this.page = 1;
				this.callAjax = true;//是否接受ajax请求
				this.photoList = [];
				this.$top = $("#top");
				this.$wrap = $("#photos");
				this.photoDate={};//用来存储相册日期
				//获取当前用户信息
				this._getCurrentUserInforAjax();
				this._bindEvent();
			},
			_bindEvent:function(){
				var self = this;
				//文档加载完后调用，
				$(window).load(function(){
					self.getPhotoDataAjax(self.page);

				});
				//判断鼠标是否滚动到了底部
				$(window).on("scroll", function (){
					if ($(document).scrollTop() + $(window).height() + 50 >= $(document).height()) {
						if (self.page == -1) return;
						self.page ++;
						if (self.page > 1) {
							if (!self.callAjax) return;
							self.callAjax = false;
				        	self.getPhotoDataAjax(self.page);
						};
				    }
				})
			},
			_getCurrentUserInforAjax:function(){
				var self = this;
				var option = {
					url:MoonduDomain+'/UserCenter/GetUserInfo',
					callback:function(res){
						/*if (res.Result == "nologin") {
							$.alert("请您重新登录！");
							location.href = "login_after.html";
						}*/
						if (res.Result) {
							
						};
					}
				}
			$.md.ajaxurl(option);
			},
			//相册渲染
			photosRender:function(data){
				var self = this,
					html="",
					photosTemp = document.getElementById("photosTemp"),
					temp = new EJS({"text": photosTemp}),
					parms={	
							week:new Date().getDay(),
							day:self.addZero(new Date().getDate()),
							month:self.addZero(new Date().getMonth() + 1)
						};
				switch (parseInt(parms.week)){
					case 0 : parms.week = "星期天";  break;
					case 1 : parms.week = "星期一";  break;
					case 2 : parms.week = "星期二";  break;
					case 3 : parms.week = "星期三";  break;
					case 4 : parms.week = "星期四";  break;
					case 5 : parms.week = "星期五";  break;
					case 6 : parms.week = "星期六";  break;
				}
				switch(parseInt(parms.month)){
					case 1  : parms.month = 'Jan'; break; 
					case 2  : parms.month = 'Feb'; break;
					case 3  : parms.month = 'Mar'; break;
					case 4  : parms.month = 'Apr'; break;
					case 5  : parms.month = 'May'; break;
					case 6  : parms.month = 'June'; break;
					case 7  : parms.month = 'July'; break;
					case 8  : parms.month = 'Aug'; break;
					case 9  : parms.month = 'Sept'; break;
					case 10 : parms.month = 'Oct'; break;
					case 11 : parms.month = 'Nov'; break;
					case 12 : parms.month = 'Dec'; break;
				}
				for (var i = 0; i < data.length; i++) {
					 html += temp.render(data[i]);
					 this.photoList.push(data[i]);
					 this.photoDate.timer = data[0].Time;
				}
				this.$wrap.find("ul").append(html);
				this.$wrap.find('.day').text(parms.day);
				this.$wrap.find('.month').text(parms.month);
				this.$wrap.find('.week').text(parms.week);

				this.waterfall();
			},
			addZero:function(num){
				if (num < 10) {
					num = "0" + num;
				};
				return num;
			},
			waterfall:function(){
				var $container = this.$wrap.find("ul");
				if (this.page <= 1) {
					 $container.masonry({
		             	itemSelector: 'li'
		        	});
				}else{
					 $container.masonry('reload');
				}
			},
			//获取相册数据
			getPhotoDataAjax:function(page){
				var self = this;
				var option = {
		            url:MoonduDomain+'/photob/GetHotTagAlbum',
		            data:{page:page,pagesize:10},
		            callback:function(res){
		            	if (res.Result && res.Result != 'nologin'){
							if (res.Data.Rows.length > 0) {
								self.photosRender(res.Data.Rows);
								self.callAjax = true;
							}else{
								self.page = -1;
							}
						}
		            }
		        }
		       $.md.ajaxurl(option);
			}
		}
		//热门活动
		var HotActivity={

			init:function(){
				var self = this;
				this.page = 1;
				this.callAjax = true;//是否接受ajax请求
				this.activityList = [];
				this.$wrap = $("#wrap");
				//获取当前用户信息
				this._getCurrentUserInforAjax();
				this._bindEvent();
			},
			_bindEvent:function(){
				var self = this;
				this.getActivcityDataAjax(self.page);//获取活动信息
				//判断是否滚动到了底部
				$(window).scroll(function () {
				    if ($(document).scrollTop() + $(window).height() + 50 >= $(document).height()) {
				    	if (self.page == -1) return;
				    	self.page ++;
				    	if (self.page > 1) {
				    		if (!self.callAjax) return;
				    		self.callAjax = false;
				    		self.getActivcityDataAjax(self.page);
				    	};
				    	
				    }
				});
			},
			_getCurrentUserInforAjax:function(){
				var self = this;
				var option={
					url:MoonduDomain+'/UserCenter/GetUserInfo',
					callback:function(res){
						/*if (res.Result == "nologin") {
							$.alert("请您重新登录！");
							location.href = "login_after.html";
						}*/
						if (res.Result) {
							
						};
					}
				}
			$.md.ajaxurl(option);
			},
			activcityRender:function(data){
				var html = '',
					hotActivityTemp = document.getElementById("activeTemp").innerHTML,
					temp = new EJS({"text": hotActivityTemp});
				for (var i = 0;i<data.length;i++) {
					html += temp.render(data[i]);
					this.activityList.push(data[i]);
				}
				this.$wrap.append(html);
			},
			getActivcityDataAjax:function(page){
				var self = this;
		       var option={
		            url:MoonduDomain+'/MNewsB/NewsList',
		            data:{type:1,pageindex:page},
		            callback:function(res){
		            	if (res.Result) {
				    		if (res.Data.Rows.length > 0) {
				    			self.activcityRender(res.Data.Rows);
				    			self.callAjax = true;
				    		}else{
				    			self.page = -1;
				    		}
				    	}
		            }
		        }
		       $.md.ajaxurl(option);
			}
		}
		var MainEntrance={

			init:function(){

				 switch($("body").attr("data-type")){

				 	case "sensation" : Sensation.init(); break; //热门人物

				 	case "search" : Search.init(); break;  //搜索人物

				 	case "hot-content" : HotContent.init(); break;  //热门内容
 
				 	case "hot-photo" : HotPhotos.init(); break;  //热门标签相册

				 	case "hot-activity" : HotActivity.init(); break;  //热门活动
				 }
			}
		}
		MainEntrance.init();
		//公用函数
		function promptDialog(msg){
			layer.open({
		          content: msg,
		          btn: ['确定']
		      });
		}
	});