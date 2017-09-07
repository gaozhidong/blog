
	$(function(){

		//当前用户信息
		var CurrentUserInfor = {
			init:function(){
				this.name = null;
				this.portrait = null;
				this.id = null;
				this.isLogined = null;

				this.getDetailInfor();
			},
			getDetailInfor:function(){
				var self = this;
				var option = {
					url:MoonduDomain+'/UserCenter/GetUserInfo',
					callback:function(res){
						if (res.Result && res.Result != 'nologin') {
							self.name = res.Data.UserNick;
							self.portrait = res.Data.Image;
							self.id = res.Data.Uid;
							self.isLogined = true;
							//判断头像是否为空，若是为空，显示默认头像
			      			if (self.portrait == 'http://zoneimages.moonbasa.com/images/user.jpg' ||self.portrait == '') {
						      	self.portrait = 'images/user.jpg';
						    }
						};
					}
				}
			$.md.ajaxurl(option);
			}
		}
		//搭配帮-更多
		var Match = {

			init:function(){
				var self = this;
				this.page = 1; //从第一页开始
				this.callAjax = true;//是否接受ajax请求
				this.$top = $('#top');
				this.$wrap = $('#matchHot');

				CurrentUserInfor.init();
				this._bindEvent();
			},
			_bindEvent:function(){
				var self = this;
				this.getMatchHotListAjax(self.page);//获取列表数据
				this.$wrap.on("click","a.attention",self.attentionModAjax.bind(this));//关注
				this.$wrap.on("click","a.hot-active",self.cancelAttentionModAjax.bind(this));//取消关注
				$(window).scroll(function(){
					 if ($(document).scrollTop() + $(window).height() + 100 >= $(document).height()){
					 	if (self.page == -1) return;
					 	self.page ++;
					 	if (self.page > 1) {
					 		if (!self.callAjax) return;
					 		self.getMatchHotListAjax(self.page);
					 	}
					 }
				});	
			},
			moreRender:function(data){
				var self = this,
					html = "",
					matchHotTemp = document.getElementById("matchHotTemp").innerHTML,
					temp = new EJS({"text": matchHotTemp});
				for (var i = 0; i < data.length; i++) {
					html += temp.render(data[i]);
					//self.hotPersonInfor.push(data[i]);
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
					if ($(item[i]).find('a.payattention').text().trim() == '已关注' && $(item[i]).find('span.attention-num').text().trim() == '0人关注') {
						$(item[i]).find('span.attention-num').text('1人关注');
					};
				}
			},
			attentionModAjax:function(e){
				var self = this,target = e.target,userAttentionid = $(target).attr("data-id");
				if (target.nodeName != "A") return;
				CurrentUserInfor.isLogined == true ? attention() : $.login('是否登录');
				function attention(){
					var option = {
				        url:MoonduDomain + "/Found/MFocus",
				        data:{fansId:userAttentionid,flag:0},
				        callback:function(res){
				        	if(res.Result){
							  	attentionMod($(target));
							}
				        }
			    	}
		   		$.md.ajaxurl(option);
				}
			},
			cancelAttentionModAjax:function(e){
				var self = this,target = e.target,userCancelAttentionid = $(target).attr("data-id");
				if (target.nodeName != "A") return;
				CurrentUserInfor.isLogined == true ? cancel() : $.login('是否登录');
				function cancel(){
					var option={
				        url:MoonduDomain + "/Found/MFocus",
				        data:{fansId:userCancelAttentionid,flag:1},
				        callback:function(res){
				        	if(res.Result){
							  	cancelAttentionMod($(target));
							}
				        }
			    	}
			   		$.md.ajaxurl(option);
				}
			},
			getMatchHotListAjax:function(page){
				var self = this;
				var option = {
			        url:MoonduDomain + '/UserCenterB/MoreListUsers',
			        data:{page:page,pagesize:10,gid:41},
			        callback:function(res){
			        	if (!res.Result) return;
						//判断数据是否加载完
						if (res.Data && res.Data.Rows.length > 0) {
							self.moreRender(res.Data.Rows);
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
		//设计档-更多
		var Design = {

			init:function(){
				var self = this;
				this.page = 1; //从第一页开始
				this.callAjax = true;//是否接受ajax请求
				this.$top = $('#top');
				this.$wrap = $('#designHot');

				CurrentUserInfor.init();
				this._bindEvent();
			},
			_bindEvent:function(){
				var self = this;
				this.getMatchHotListAjax(self.page);//获取列表数据
				this.$wrap.on("click","a.attention",self.attentionModAjax.bind(this));//关注
				this.$wrap.on("click","a.hot-active",self.cancelAttentionModAjax.bind(this));//取消关注
				$(window).scroll(function(){
					 if ($(document).scrollTop() + $(window).height() + 100 >= $(document).height()){
					 	if (self.page == -1) return;
					 	self.page ++;
					 	if (self.page > 1) {
					 		if (!self.callAjax) return;
					 		self.getMatchHotListAjax(self.page);
					 	}
					 }
				});	
			},
			moreRender:function(data){
				var self = this,
					html = "",
					designHotTemp = document.getElementById("designHotTemp").innerHTML,
					temp = new EJS({"text": designHotTemp});
				for (var i = 0; i < data.length; i++) {
					html += temp.render(data[i]);
					//self.hotPersonInfor.push(data[i]);
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
					if ($(item[i]).find('a.payattention').text().trim() == '已关注' && $(item[i]).find('span.attention-num').text().trim() == '0人关注') {
						$(item[i]).find('span.attention-num').text('1人关注');
					};
				}
			},
			attentionModAjax:function(e){
				var self = this,target = e.target,userAttentionid = $(target).attr("data-id");
				if (target.nodeName != "A") return;
				CurrentUserInfor.isLogined == true ? attention() : $.login('是否登录');
				function attention(){
					var option = {
				        url:MoonduDomain + "/Found/MFocus",
				        data:{fansId:userAttentionid,flag:0},
				        callback:function(res){
				        	if(res.Result){
							  	attentionMod($(target));
							}
				        }
			    	}
			   		$.md.ajaxurl(option);
				}
			},
			cancelAttentionModAjax:function(e){
				var self = this,target = e.target,userCancelAttentionid = $(target).attr("data-id");
				if (target.nodeName != "A") return;
				CurrentUserInfor.isLogined == true ? attention() : $.login('是否登录');
				function attention(){
					var option={
				        url:MoonduDomain + "/Found/MFocus",
				        data:{fansId:userCancelAttentionid,flag:1},
				        callback:function(res){
				        	if(res.Result){
							  	cancelAttentionMod($(target));
							}
				        }
			    	}
			   		$.md.ajaxurl(option);
				}
				
			},
			getMatchHotListAjax:function(page){
				var self = this;
				var option={
			        url:MoonduDomain + '/UserCenterB/MoreListUsers',
			        data:{page:page,pagesize:10,gid:41},
			        callback:function(res){
			        	if (!res.Result) return;
						//判断数据是否加载完
						if (res.Data && res.Data.Rows.length > 0) {
							self.moreRender(res.Data.Rows);
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
		//造型派-更多
		var Sculpt = {

			init:function(){
				var self = this;
				this.page = 1; //从第一页开始
				this.callAjax = true;//是否接受ajax请求
				this.$top = $('#top');
				this.$wrap = $('#designHot');

				CurrentUserInfor.init();
				this._bindEvent();
			},
			_bindEvent:function(){
				var self = this;
				this.getMatchHotListAjax(self.page);//获取列表数据
				this.$wrap.on("click","a.attention",self.attentionModAjax.bind(this));//关注
				this.$wrap.on("click","a.hot-active",self.cancelAttentionModAjax.bind(this));//取消关注
				$(window).scroll(function(){
					 if ($(document).scrollTop() + $(window).height() + 100 >= $(document).height()){
					 	if (self.page == -1) return;
					 	self.page ++;
					 	if (self.page > 1) {
					 		if (!self.callAjax) return;
					 		self.getMatchHotListAjax(self.page);
					 	}
					 }
				});	
			},
			moreRender:function(data){
				var self = this,
					html = "",
					designHotTemp = document.getElementById("designHotTemp").innerHTML,
					temp = new EJS({"text": designHotTemp});
				for (var i = 0; i < data.length; i++) {
					html += temp.render(data[i]);
					//self.hotPersonInfor.push(data[i]);
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
					if ($(item[i]).find('a.payattention').text().trim() == '已关注' && $(item[i]).find('span.attention-num').text().trim() == '0人关注') {
						$(item[i]).find('span.attention-num').text('1人关注');
					};
				}
			},
			attentionModAjax:function(e){
				var self = this,target = e.target,userAttentionid = $(target).attr("data-id");
				if (target.nodeName != "A") return;
				CurrentUserInfor.isLogined == true ? attention() : $.login('是否登录');
				function attention(){
					var option = {
				        url:MoonduDomain + "/Found/MFocus",
				        data:{fansId:userAttentionid,flag:0},
				        callback:function(res){
				        	if(res.Result){
							  	attentionMod($(target));
							}
				        }
			    	}
			   		$.md.ajaxurl(option);
				}
			},
			cancelAttentionModAjax:function(e){
				var self = this,target = e.target,userCancelAttentionid = $(target).attr("data-id");
				if (target.nodeName != "A") return;
				CurrentUserInfor.isLogined == true ? attention() : $.login('是否登录');
				function attention(){
					var option={
				        url:MoonduDomain + "/Found/MFocus",
				        data:{fansId:userCancelAttentionid,flag:1},
				        callback:function(res){
				        	if(res.Result){
							  	cancelAttentionMod($(target));
							}
				        }
			    	}
			   		$.md.ajaxurl(option);
				}
				
			},
			getMatchHotListAjax:function(page){
				var self = this;
				var option={
			        url:MoonduDomain + '/UserCenterB/MoreListUsers',
			        data:{page:page,pagesize:10,gid:42},
			        callback:function(res){
			        	if (!res.Result) return;
						//判断数据是否加载完
						if (res.Data && res.Data.Rows.length > 0) {
							self.moreRender(res.Data.Rows);
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
		//摄影会-更多
		var Photo = {

			init:function(){
				var self = this;
				this.page = 1; //从第一页开始
				this.callAjax = true;//是否接受ajax请求
				this.$top = $('#top');
				this.$wrap = $('#designHot');

				CurrentUserInfor.init();
				this._bindEvent();
			},
			_bindEvent:function(){
				var self = this;
				this.getMatchHotListAjax(self.page);//获取列表数据
				this.$wrap.on("click","a.attention",self.attentionModAjax.bind(this));//关注
				this.$wrap.on("click","a.hot-active",self.cancelAttentionModAjax.bind(this));//取消关注
				$(window).scroll(function(){
					 if ($(document).scrollTop() + $(window).height() + 100 >= $(document).height()){
					 	if (self.page == -1) return;
					 	self.page ++;
					 	if (self.page > 1) {
					 		if (!self.callAjax) return;
					 		self.getMatchHotListAjax(self.page);
					 	}
					 }
				});	
			},
			moreRender:function(data){
				var self = this,
					html = "",
					designHotTemp = document.getElementById("designHotTemp").innerHTML,
					temp = new EJS({"text": designHotTemp});
				for (var i = 0; i < data.length; i++) {
					html += temp.render(data[i]);
					//self.hotPersonInfor.push(data[i]);
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
					if ($(item[i]).find('a.payattention').text().trim() == '已关注' && $(item[i]).find('span.attention-num').text().trim() == '0人关注') {
						$(item[i]).find('span.attention-num').text('1人关注');
					};
				}
			},
			attentionModAjax:function(e){
				var self = this,target = e.target,userAttentionid = $(target).attr("data-id");
				if (target.nodeName != "A") return;
				CurrentUserInfor.isLogined == true ? attention() : $.login('是否登录');
				function attention(){
					var option = {
				        url:MoonduDomain + "/Found/MFocus",
				        data:{fansId:userAttentionid,flag:0},
				        callback:function(res){
				        	if(res.Result){
							  	attentionMod($(target));
							}
				        }
			    	}
			   		$.md.ajaxurl(option);
				}
			},
			cancelAttentionModAjax:function(e){
				var self = this,target = e.target,userCancelAttentionid = $(target).attr("data-id");
				if (target.nodeName != "A") return;
				CurrentUserInfor.isLogined == true ? attention() : $.login('是否登录');
				function attention(){
					var option={
				        url:MoonduDomain + "/Found/MFocus",
				        data:{fansId:userCancelAttentionid,flag:1},
				        callback:function(res){
				        	if(res.Result){
							  	cancelAttentionMod($(target));
							}
				        }
			    	}
			   		$.md.ajaxurl(option);
				}
				
			},
			getMatchHotListAjax:function(page){
				var self = this;
				var option={
			        url:MoonduDomain + '/UserCenterB/MoreListUsers',
			        data:{page:page,pagesize:10,gid:43},
			        callback:function(res){
			        	if (!res.Result) return;
						//判断数据是否加载完
						if (res.Data && res.Data.Rows.length > 0) {
							self.moreRender(res.Data.Rows);
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
		//名人堂-更多
		var Famous = {

			init:function(){
				var self = this;
				this.page = 1; //从第一页开始
				this.callAjax = true;//是否接受ajax请求
				this.$top = $('#top');
				this.$wrap = $('#designHot');

				CurrentUserInfor.init();
				this._bindEvent();
			},
			_bindEvent:function(){
				var self = this;
				this.getMatchHotListAjax(self.page);//获取列表数据
				this.$wrap.on("click","a.attention",self.attentionModAjax.bind(this));//关注
				this.$wrap.on("click","a.hot-active",self.cancelAttentionModAjax.bind(this));//取消关注
				$(window).scroll(function(){
					 if ($(document).scrollTop() + $(window).height() + 100 >= $(document).height()){
					 	if (self.page == -1) return;
					 	self.page ++;
					 	if (self.page > 1) {
					 		if (!self.callAjax) return;
					 		self.getMatchHotListAjax(self.page);
					 	}
					 }
				});	
			},
			moreRender:function(data){
				var self = this,
					html = "",
					designHotTemp = document.getElementById("designHotTemp").innerHTML,
					temp = new EJS({"text": designHotTemp});
				for (var i = 0; i < data.length; i++) {
					html += temp.render(data[i]);
					//self.hotPersonInfor.push(data[i]);
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
					if ($(item[i]).find('a.payattention').text().trim() == '已关注' && $(item[i]).find('span.attention-num').text().trim() == '0人关注') {
						$(item[i]).find('span.attention-num').text('1人关注');
					};
				}
			},
			attentionModAjax:function(e){
				var self = this,target = e.target,userAttentionid = $(target).attr("data-id");
				if (target.nodeName != "A") return;
				CurrentUserInfor.isLogined == true ? attention() : $.login('是否登录');
				function attention(){
					var option = {
				        url:MoonduDomain + "/Found/MFocus",
				        data:{fansId:userAttentionid,flag:0},
				        callback:function(res){
				        	if(res.Result){
							  	attentionMod($(target));
							}
				        }
			    	}
			   		$.md.ajaxurl(option);
				}
			},
			cancelAttentionModAjax:function(e){
				var self = this,target = e.target,userCancelAttentionid = $(target).attr("data-id");
				if (target.nodeName != "A") return;
				CurrentUserInfor.isLogined == true ? attention() : $.login('是否登录');
				function attention(){
					var option={
				        url:MoonduDomain + "/Found/MFocus",
				        data:{fansId:userCancelAttentionid,flag:1},
				        callback:function(res){
				        	if(res.Result){
							  	cancelAttentionMod($(target));
							}
				        }
			    	}
			   		$.md.ajaxurl(option);
				}
				
			},
			getMatchHotListAjax:function(page){
				var self = this;
				var option={
			        url:MoonduDomain + '/UserCenterB/MoreListUsers',
			        data:{page:page,pagesize:10,gid:44},
			        callback:function(res){
			        	if (!res.Result) return;
						//判断数据是否加载完
						if (res.Data && res.Data.Rows.length > 0) {
							self.moreRender(res.Data.Rows);
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
		var MainEntrance = {

			init:function(){

				 switch($("body").attr("data-type")){

				 	case "match" : Match.init(); break; //搭配帮-更多

				 	case "design" : Design.init(); break; //设计档-更多

				 	case "sculpt" : Design.init(); break; //造型派-更多

				 	case "photo" : Photo.init(); break; //摄影会-更多

				 	case "famous" : Famous.init(); break; //名人堂-更多

				 }
			}
		}
		MainEntrance.init();
		//公用函数
		//关注
		function attentionMod(obj){
			var xcount = parseInt($(obj).parent().find(".attention-num").text().match(/\d+/)[0]);
			$(obj).removeClass("attention").addClass("hot-active");
			$(obj).text("已关注");
			xcount ++;
			$(obj).parent().find(".attention-num").text(xcount + "人关注");
		}
		//取消关注
		function cancelAttentionMod(obj){
			var xcount = parseInt($(obj).parent().find(".attention-num").text().match(/\d+/)[0]);
			$(obj).removeClass("hot-active").addClass("attention");
			$(obj).text("+关注");
			xcount == 0 ? xcount = 0 : xcount --;
			$(obj).parent().find(".attention-num").text(xcount + "人关注");
		}
	});


















