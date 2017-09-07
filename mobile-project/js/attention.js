
	$(function(){
		//=======返回上一级页面=========
        $(".search-top").on("click","a",function(){
         	var str2=$.getUrlVar('reurl');		
			str2 = str2.replaceAll('||','?').replaceAll('__','=').replaceAll('#','&');		
			window.location.href = str2;
        })
		//关注人物
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
				var option={
					url:MoonduDomain+'/UserCenter/GetUserInfo',
					callback:function(res){
						if (res.Result == "nologin") {
							$.login("是否登录！");
						}
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
								$.alert("不能关注自己！");
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
				var uid = $.getUrlVar('uid');
				var option={
			        url:MoonduDomain + '/Found/FocusUsers',
			        data:{page:page,pagesize:10,optype:0,uid:uid},
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
		//我的粉丝
		var fan={

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
				var option={
					url:MoonduDomain+'/UserCenter/GetUserInfo',
					callback:function(res){
						if (res.Result == "nologin") {
							$.login("是否登录！");
						}
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
								$.alert("不能关注自己！");
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
				var uid = $.getUrlVar('uid');
				var option={
			        url:MoonduDomain + '/Found/FocusUsers',
			        data:{page:page,pagesize:10,uid:uid,optype:1},
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

		//我的黑名单
		var black={

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
				var option={
					url:MoonduDomain+'/UserCenter/GetUserInfo',
					callback:function(res){
						if (res.Result == "nologin") {
							$.login("是否登录！");
						}
						if (res.Result && res.Result!="nologin") {
							self.userInfor.name = res.Data.UserNick;
							self.userInfor.portrait = res.Data.Image;
							self.userInfor.id = res.Data.Uid;
							self.userInfor.isLogined = true;
							self.getHotPersonListAjax(self.userInfor.id);
							//判断头像是否为空，若是为空，显示默认头像
			      			if (self.userInfor.portrait == 'http://zoneimages.moonbasa.com/images/user.jpg' || self.userInfor.portrait == '') {
						      	self.userInfor.portrait = 'images/user.jpg';
						    }
						};
					}
				}
				$.md.ajaxurl(option);
			},
			//================黑名单模块渲染=============
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
				$(obj).text("移除黑名单");
			},
			//==================取消关注================
			cancelAttentionMod:function(obj){
				var xcount = parseInt($(obj).parent().find(".attention-num").text().match(/\d+/)[0]);
				$(obj).removeClass("hot-active").addClass("attention");
				$(obj).text("加入黑名单");
			},
			attentionModAjax:function(e){
				var self = this,target = e.target,userAttentionid = $(target).attr("data-id");
				if (target.nodeName != "A") return;
				this.userInfor.isLogined == true ? attention() : $.login('是否登录！');
				function attention(){
					var option = {
				        url:MoonduDomain + "/Found/MBlacklist",
				        data:{ToID:userAttentionid,flag:0},
				        callback:function(res){
				        	if(res.Result){
							  	self.attentionMod($(target));
							}else{
								$.alert("不能加入自己！");
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
				        url:MoonduDomain + "/Found/MBlacklist",
				        data:{ToID:userCancelAttentionid,flag:1},
				        callback:function(res){
				        	if(res.Result){
							  	self.cancelAttentionMod($(target));
							}
				        }
			    	}
		   		$.md.ajaxurl(option);
				}
			},
			getHotPersonListAjax:function(id){
				var self = this;
				var page=this.page;
				var option={
			        url:MoonduDomain + '/Found/UserBlacklistList',
			        data:{page:page,pagesize:10,uid:id},
			        callback:function(res){
			        	if (!res.Result) return;
						//判断数据是否加载完
						if (res.Data == null) {
		        		}else{
		        			if (res.Data.Rows.length > 0) {
								self.sensationRender(res.Data.Rows);
								self.callAjax = true;
							}
							else{
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

				 	case "sensation" : Sensation.init(); break; //我的关注

				 	case "fan" : fan.init(); break; //我的粉丝

				 	case "black" : black.init(); break; //我的黑名单
				 }
			}
		}
		MainEntrance.init();
	});