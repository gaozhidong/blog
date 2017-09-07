
	$(function(){
		//发现首页
		var Find = {

			init:function(){
				var self = this;
				this.$camp = $("#camps");
				this.serchField = $("#serchField");
				this.userInfor = {};
				this._bindEvent();
			},
			_bindEvent:function(){
				var self = this;
				this.pictureScrollAjax();
				this.campChange();
				//this._getCurrentUserInforAjax();
				//点击搜索跳转到热门人物
				this.serchField.find("a").bind("click",function(){
					var txt = self.serchField.find("input").val(),
						reurl=window.location.href,  
                		index = reurl.lastIndexOf('/') + 1,				
                		Reurl = reurl.substring(index);
                	Reurl = Reurl.replaceAll('?','||').replaceAll('=','__').replaceAll('&','#');
					location.href = "search.html?value="+txt+"&reurl="+Reurl+"";
				});
			},
			_getCurrentUserInforAjax:function(){
				var self = this;
				var option = {
					url:MoonduDomain+'/UserCenter/GetUserInfo',
					callback:function(res){
						if (res.Result) {
							self.userInfor.name = res.Data.UserNick;
							self.userInfor.portrait = res.Data.IMAGE;
							self.userInfor.id = res.Data.Uid;
		      				//self._bindEvent();		
						};
					}
				}
				$.md.ajaxurl(option);
			},
			//==========图片滚动模块=========
			pictureScrollRender:function(data){
				var self = this,
					html = '',
					picScrollTemp = document.getElementById("picScrollTemp"),
					temp = new EJS({"text": picScrollTemp}),
					$wrap=$(".find-activity-tab");
				for (var i = 0; i < data.length; i++) {
					html += temp.render(data[i]);
				};
				$wrap.find("ul").html(html);

		        $(".flexslider").flexslider({
					slideshowSpeed: 3000,
					animationSpeed: 300, 
					touch: true, //是否支持触屏滑动
					animation:"slide",
					slideshow:"true",
					pauseOnHover:false
				});
				$("ul.flex-direction-nav").remove();
			},
			campChange:function(){
				var self = this;
				this.$camp.flexslider({
					slideshowSpeed: 4000,
					animationSpeed: 400, 
					touch: true, //是否支持触屏滑动
					animation:"slide",
					slideshow:"true",
					pauseOnHover:false
				});
				this.$camp.find(".flex-control-nav").css("bottom","-40px");
			},
			//图片轮播
			pictureScrollAjax:function(){
				var self = this;
				var option={
					url:MoonduDomain+'/MNewsB/IndexNews',
					data:{cmsid:37},
					callback:function(res){
						if (!res.Result) return;
						self.pictureScrollRender(res.Data.Rows);
					}
				}
				$.md.ajaxurl(option);
			},
			//签到获取经验值
			getExperienceBySignAjax:function(){
				var self = this,userId = this.userInfor.id;
				var option={
		            url:MoonduDomain+'/Integral/SignIn',
		            data:{uid:userId,pid:postId},
		            callback:function(res){
		            	if (res.Result) {
				    	}
		            }
		        }
		       $.md.ajaxurl(option);
			}
		}
		//星秀场
		var Show = {

	    	init:function(){
	    		var self = this;
	    		this.$top = $("#showTop");
	    		this.$search = $("#search");
	    		this.$wrap = $("#wrap");
	    		this.$rank = $('#rank');
	    		this.$voteWrap = this.$wrap.find(".vote");
	    		this.$fansWrap = this.$wrap.find(".fans");
	    		this.userInfor = {};  //存储当前用户信息
	    		this.vpage = 1;
	    		this.fpage = 1;
	    		this.voteClick = 0;
	    		this.fansClick = 0;
	    		this.votesList = []; //按票数排序列表数据
	    		this.fansList = [];  //按粉丝排序列表数据
	    		this.vcallAjax = true;//是否接受ajax请求
	    		this.fcallAjax = true;//是否接受ajax请求

	    		//获取当前用户信息
	    		this._getCurrentUserInforAjax();
	    		this._bindEvent();
	    		$('.bottom-fix').on('click','.join a',function(){
	    			var href=$(this).attr('href');
	    			if(href !='apply.html'){
	    				$.login('是否登录');
	    			}
	    			
	    		})
	    	},
	    	_bindEvent:function(){
	    		var self = this;
	    		//图片轮播
				this.pictureScrollAjax();

				this._getCurrentActivityId();
	    		//投票
	    		this.$wrap.on("click","button.notVoted",self.isVotedSuccessAjax.bind(this));
				//加入阵营
				this.$top.on('click','.join',self.joinCampAjax.bind(this));
				//切换排序tab
				this.$rank.find('li').bind('click',self._tabToggle.bind(this));
				//判断是否滚动到了底部
				$(window).on('scroll',function(){
					if ($(document).scrollTop() + $(window).height() + 10 >= $(document).height()){
						//fix bug--判断是哪一个部分加载数据
						self.$voteWrap.hasClass('hidden') ? loadFansData() : loadVoteData();
						function loadVoteData(){
							if (self.vpage == -1) return;
						 	self.vpage ++;
						 	if (self.vpage > 1) {
						 		if (!self.vcallAjax) return;
		      					self.vcallAjax = false;
						 		self.getVotingAjax(self.vpage);
						 	}
						}
						function loadFansData(){
							if (self.fpage == -1) return;
					 		self.fpage ++;
					 		if (self.fpage > 1) {
					 		if (!self.fcallAjax) return;
		  						self.fcallAjax = false;
		  						self.getFansAjax(self.fpage);
		  					}
						}
					}
				})
				//点击搜索跳转到热门人物
				this.$search.find("a").bind("click",function(){
					var txt = self.$search.find("input").val(),
						reurl=window.location.href,  
                		index = reurl.lastIndexOf('/') + 1,			
                		Reurl = reurl.substring(index);
                	Reurl=Reurl.replaceAll('?','||').replaceAll('=','__').replaceAll('&','#');
					location.href="search.html?value="+txt+"&reurl="+Reurl+"";
				})
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
						if (res.Result != "nologin" && res.Result && res.Data.Gids) {
							self.userInfor.gid = res.Data.Gids;
							//判断有没有加入阵营,若当前用户未登录则不能加入阵营
							self.joinCamp();
						}
						//当前用户是否登陆
						if (res.Result) {
							//self._bindEvent();
							self.userInfor.isLogined = res.Result;
							if(self.userInfor.isLogined==true){
								$('.bottom-fix').find('.join a').attr('href','apply.html');
							}
						};
					}
				}
				$.md.ajaxurl(option);
	    	},
	    	_tabToggle:function(e){
	    		if (e.currentTarget.nodeName != 'LI') return;
	    		var index = parseInt($(e.currentTarget).attr('data-index')),
	    			$title = this.$rank.find('li'),
					$content = this.$wrap;
				$title.eq(index).find('.current').removeClass('hidden').parent().siblings().find('.current').addClass('hidden');
				$content.find('ul').eq(index).removeClass('hidden').siblings('ul').addClass('hidden');
				switch(index){
					case 0 :  
						this.voteClick ++; 
						this.getVotingAjax(this.vpage);  
						break;
					case 1 : 
						this.fansClick ++; 
						this.getFansAjax(this.fpage);  
						break;
				}
	    	},
	    	//=====按票数排序模块渲染====
	    	rankByVotesRender:function(data){
	    		var self = this,html="",temp = document.getElementById("rankingByVotesTemp"),votes = new EJS({"text": temp});
	    		for(var i=0;i<data.length;i++){
	    			html += votes.render(data[i]);
	    			this.votesList.push(data[i]);
	    		}
	    		//无论点击多少次，html元素不是追加，而是替换
	    		this.voteClick > 1 && this.vpage == 1 ? this.$voteWrap.html(html) : this.$voteWrap.append(html);
	    	},
	    	//=========按粉丝排序模块渲染======
	    	rankByFansRender:function(data){
	    		var self = this,html = "",temp = document.getElementById("rankingByFansTemp"),fans = new EJS({"text": temp});
	    		for(var i=0;i<data.length;i++){
	    			html+=fans.render(data[i]);
	    			this.fansList.push(data[i]);
	    		}
	    		//无论点击多少次，html元素不是追加，而是替换
	    		this.fansClick > 1 && this.fpage == 1 ? this.$fansWrap.html(html) : this.$fansWrap.append(html);
	    	},
	    	joinCamp:function(){
				if (this.userInfor.gid.indexOf(40) > -1){
					this.$top.find('span').removeClass("join").addClass("cur");
					this.$top.find('span').text("已加入阵营");
				}
			},
	    	//投票
	    	votingMod:function(obj,uid){
	    		var xcount = parseInt($(obj).siblings("span.vote-num").text().match(/\d+/)[0]);
	    		//按粉丝排序和按票数排序的具有相同id的都发生改变
	    		if ($(obj).hasClass("notVoted")) {
	    			this.$wrap.find('.item[data-uid='+uid+']').find('button').removeClass("notVoted").addClass("hasVoted");
	    		};
	    		this.$wrap.find('.item[data-uid='+uid+']').find('button').text('已投票');
	    		xcount ++ ;
	    		this.$wrap.find('.item[data-uid='+uid+']').find('button').siblings("span.vote-num").text(xcount);

	    		this.getExperienceByVotingAjax($(obj));
	    	},
	    	//========图片轮播模块=======
	    	tabsRender:function(data){
	    		var self = this,html = '',picScrollTemp = document.getElementById("picScrollTemp"),temp = new EJS({"text": picScrollTemp}),slider = $(".flexslider");
				for (var i = 0; i < data.length; i++) {
				     html += temp.render(data[i]);
				};
				$("#picScroll").html(html);
			 	slider.flexslider({
					slideshowSpeed: 4000,
					animationSpeed: 400, 
					touch: true, //是否支持触屏滑动
					animation:"slide",
					slideshow:"true",
					pauseOnHover:false
				});
				$("ul.flex-direction-nav").remove();
	    	},
	    	joinCampAjax:function(){
				var self = this;
				this.userInfor.isLogined == true ? join() : $.login('是否登录');
				function join(){
					var option={
			            url:MoonduDomain + '/Found/AddGroup',
			            data:{gid:40},
			            callback:function(res){
			            	if (res.Result) {
								self.$top.find('span').removeClass("join").addClass("cur");
								self.$top.find('span').text("已加入阵营");
							};
			            }
		        	}
		       		$.md.ajaxurl(option);
				}
				
			},
			pictureScrollAjax:function(){
			    var self = this;
			    var option={
			     	url:MoonduDomain+'/MNewsB/IndexNews',
			     	data:{cmsid:38},
			     	callback:function(res){
			     		if (!res.Result) return;
			      		self.tabsRender(res.Data.Rows);
			     	}
			    }
			    $.md.ajaxurl(option);
			},
	    	//=======投票获取经验====
	    	getExperienceByVotingAjax:function(obj){
	    		var postId = $(obj).parent().find("input[data-type=postID]").val(),
	    			userId = $(obj).parent().find("input[data-type=userID]").val(),
	    			self = this;
				var option={
		            url:MoonduDomain+"/Integral/GetvoteInfo",
		            data:{uid:userId,pid:postId},
		            callback:function(res){
		            	//经验添加成功
						if (res.Result) {
							//$.alert(res.Msg);
						}
		            }
		        }
		       $.md.ajaxurl(option);
	    	},
	    	//========判断是否投票成功=====
	    	isVotedSuccessAjax:function(e){
	    		var target = e.target,post = $(target).parent('.item').attr('data-post'),uid = $(target).parent('.item').attr('data-uid');
	    		Show.userInfor.isLogined == true ? vote() : $.login('是否登录');
	    		function vote(){
	    			var option={
			            url:MoonduDomain+'/Mshow/MshowVote',
			            data:{SignupID:post,ActivityType:1},
			            callback:function(res){
			            	if (res.Result) {
								Show.votingMod($(target),uid);
							};
			            }
			        }
		       		$.md.ajaxurl(option);
	    		}
	    	},
	    	//获取活动id
	    	_getCurrentActivityId:function(){
	    		var self = this;
	    		var option={
		            url:MoonduDomain+'/Mshow/GetCurrMshow',
		            data:{},
		            callback:function(res){
		            	self.getVotingAjax(self.vpage); //按票数进行排列ajax
		            	if (!res.Result || res.Result == "nologin") return;
		            	this.activityId = res.Data.Id;
		            	$("#activityId").val(this.activityId);
		            }
		        }
		       $.md.ajaxurl(option);
	    	},
	    	//============按投票排序========
	    	getVotingAjax:function(page){
	    		var self = this,page = parseInt(page),aid = parseInt($("#activityId").val());
       		    var option={
		            url:MoonduDomain+'/MshowB/PlayerList',
		            data:{type:0,pageindex:page,aid:aid},
		            callback:function(res){
		            	if (res.Result){
		            		if (res.Data.Rows.length > 0) {
		            			self.rankByVotesRender(res.Data.Rows);
								self.vcallAjax = true;
		            		}else{
		            			self.vpage = -1;
		            		}
						}
		            }
		        }
		       $.md.ajaxurl(option);
	    	},
	    	//========按粉丝排序==========
	    	getFansAjax:function(page){
	    		var self = this,page = parseInt(page),aid = parseInt($("#activityId").val());
		        var option={
		            url:MoonduDomain+'/MshowB/PlayerList',
		            data:{type:1,pageindex:page,aid:aid},
		            callback:function(res){
		            	if (res.Result){
		            		if (res.Data.Rows.length > 0) {
		            			self.rankByFansRender(res.Data.Rows);
								self.fcallAjax = true;
		            		}else{
		            			self.fpage = -1;
		            		}
						}
		            }
		        }
		       $.md.ajaxurl(option);
	    	}
		}
		//搭配帮
		var Match = {

	     	init:function(){
	     		var self = this;
	     		this.$top = $("#matchTop");
	     		this.rankWrap = $("#match-rank");
	     		this.workWrap = $("#matchWork");
	     		this.serchField = $("#serchField");
	     		this.page = 1;
	     		this.callAjax = true;//是否接受ajax请求
	     		this.userInfor = {};//存储当前用户信息
	     		this.topList = []; //TOP3数据
	     		this.matchList = [];//搭配作品数据

	     		//获取当前用户信息
	     		this._getCurrentUserInforAjax();
	     		this._bindEvent();
	     	},
	     	_bindEvent:function(){
	     		var self = this;
	     		this.getTopIdAjax();
	     		this.getPhotoDataAjax(self.page);
				//关注
				this.workWrap.on("click",".attention",self.attentionAjax.bind(this));
				//取消关注
				this.workWrap.on("click",".attention-active",self.cancelAttentionAjax.bind(this));
				//图片轮播
				this.pictureScrollAjax();
				//加入阵营
				this.$top.on('click','.join',self.joinCampAjax.bind(this));
				//判断是否滚动到了底部
				$(window).scroll(function () {
				    if ($(document).scrollTop() + $(window).height() + 50 >= $(document).height()) {
				    	if (self.page == -1) return;
				    	self.page ++;
				    	if (self.page > 1) {
				    		if (!self.callAjax) return;
         		 			self.callAjax = false;
				       		self.getPhotoDataAjax(self.page);
				    	};
				    }
				});
				//点击搜索跳转到热门人物
				this.serchField.find("a").bind("click",function(){
					var txt = self.serchField.find("input").val(),
						reurl=window.location.href,  
                		index = reurl.lastIndexOf('/') + 1,				
                		Reurl = reurl.substring(index);
                	Reurl = Reurl.replaceAll('?','||').replaceAll('=','__').replaceAll('&','#');
					location.href = "search.html?value="+txt+"&reurl="+Reurl+"";
				});
	     	},
	     	_getCurrentUserInforAjax:function(){
	     		var self = this;
	     		var option={
					url:MoonduDomain+'/UserCenter/GetUserInfo',
					callback:function(res){
						if (res.Result != "nologin" && res.Result && res.Data.Gids) {
							self.userInfor.gid = res.Data.Gids;
							self.userInfor.id = res.Data.Uid;
							self.userInfor.isLogined = true;
							//加入阵营
							self.joinCamp();
						}
					}
				}
			$.md.ajaxurl(option);
	     	},
	     	//================搭配师TOP3模块渲染==============
	     	rankingRender:function(data){
	     		var self = this,html = "",rankingTemp=document.getElementById("ranking"),temp = new EJS({"text": rankingTemp});
	     		for (var i = 0; i < data.length; i++) {
	     			html += temp.render(data[i]);
	     			this.topList.push(data[i]);
	     		};
	     		this.rankWrap.find("ul").html(html);
	     		//判断用户头像是否为空，若是为空，则显示默认头像
	     		var item = this.rankWrap.find("ul").find('li');
	     		$(this.rankWrap.find('li').eq(1)).find('.rank').attr('src','images/match-icon-2.png');
	     		$(this.rankWrap.find('li').eq(2)).find('.rank').attr('src','images/match-icon-3.png');
	     	},
	     	joinCamp:function(){
				var self = this;
				if (this.userInfor.gid.indexOf(41) > -1){
					this.$top.find('span').removeClass("join").addClass("cur");
					this.$top.find('span').text("已加入阵营");
				}
			},
	     	//==============搭配模块渲染==========
	     	matcherWorkRender:function(data){
	     		var self = this,
					html = "",
					tempWork=document.getElementById("tempWork"),
					temp = new EJS({"text": tempWork});
	     		for (var i = 0; i < data.length; i++) {
	     			html += temp.render(data[i]);
	     			this.matchList.push(data[i]);
	     		}
	     		this.workWrap.append(html);
	     		//标签用#ff7f00颜色标识
	     		var item = this.workWrap.find(".list-item");
	     		item.each(function(){
	     			var title = $(this).find('.title').text(),
	     				index = title.indexOf('#'),
	     				declare = title.substring(0,index),
	     				tags = title.substring(index),
	     				emElement = $("<em>"+tags+"</em>");
	     			if (index > -1) {
	     				if (index == 0) {
	     					$(this).find('.title').css('color','#ff7f00');
	     				}else{
	     					$(this).find('.title').text(declare);
	     					emElement.css('color','#ff7f00');
	     					$(this).find('.title').append(emElement);	
	     				}
	     			}
	     		});
	     	},
	     	//================关注================
	     	attentionModule:function(userId){
	     		var self = this;
				this.workWrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').removeClass("attention").addClass("attention-active");
				this.workWrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').text('已关注');
	     	},
	     	//===============取消关注==============
	     	cancelAttentionModule:function(userId){
	     		this.workWrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').addClass("attention").removeClass("attention-active");
	     		this.workWrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').text('+关注');
	     	},
	     	//================图片轮播模块渲染=====================
	     	pictureScrollRender:function(data){
				var self = this,
     				html = '',
     				picScrollTemp = document.getElementById("picScrollTemp"),
     				temp = new EJS({"text": picScrollTemp}),
     				slider = $(".flexslider")
    			for (var i = 0; i < data.length; i++) {
     				html += temp.render(data[i]);
    			};
				$("#match-tab").find("ul").html(html);
			 	slider.flexslider({
					slideshowSpeed: 4000,
					animationSpeed: 400, 
					touch: true, //是否支持触屏滑动
					animation:"slide",
					slideshow:"true",
					pauseOnHover:false
				});
				$("ul.flex-direction-nav").remove();
				$("ol.flex-control-nav").addClass("hidden");
	     	},
	     	 //图片轮播
   			pictureScrollAjax:function(){
    			var self = this;
    			var option={
     				url:MoonduDomain+'/MNewsB/IndexNews',
     				data:{cmsid:40},
     				callback:function(res){
     					if (!res.Result) return;
      					self.pictureScrollRender(res.Data.Rows);
     				}
    			}
    			$.md.ajaxurl(option);
   			},
	     	joinCampAjax:function(){
				var self = this;
				this.userInfor.isLogined == true ? join() : $.login('是否登录');
				function join(){
					var option = {
			            url:MoonduDomain + '/Found/AddGroup',
			            data:{gid:41},
			            callback:function(res){
			            	if (res.Result) {
								self.$top.find('span').removeClass("join").addClass("cur");
								self.$top.find('span').text("已加入阵营");
							};
			            }
		        	}
			       	$.md.ajaxurl(option);
				}
				
			},
	     	//=======关注ajax===
	     	attentionAjax:function(e){
	     		var self = this,
	     			target = e.target,
	     			uid = $(target).parent().find("input[data-type=uid]").val();
	     		this.userInfor.isLogined == true ? attention() : $.login('是否登录');
	     		function attention(){
	     			//如果是当前登录用户，则提示不能关注自己
	     			uid == self.userInfor.id ? layerShow() : ajaxManager();
		     		 function layerShow(){
		     		 	layer.open({
						    content: '不能关注自己',
						    btn: ['OK']
						});
		     		 }
		     		 function ajaxManager(){
						var option = {
				            url:MoonduDomain + "/Found/MFocus",
				            data:{fansId:uid,flag:0},
				            callback:function(res){
				            	if (res.Result) {
									self.attentionModule(uid);
								}else{
									$.alert(res.Msg);
								}
				            }
				        }
			       		$.md.ajaxurl(option);
		     		}
	     		}
	     	},
	     	//==============取消关注ajax=========
	     	cancelAttentionAjax:function(e){
	     		var self = this,
	     			target = e.target,
	     			uid = $(target).parent().find("input[data-type=uid]").val();
	     		this.userInfor.isLogined == true ? cancel() : $.login('是否登录');
	     		function cancel(){
					var option = {
			            url:MoonduDomain + "/Found/MFocus",
			            data:{fansId:uid,flag:1},
			            callback:function(res){
			            	if (res.Result) {
								self.cancelAttentionModule(uid);
							}
			            }
			        }
		       		$.md.ajaxurl(option);
	     		}
				
	     	},
	     	//获取前三名的id
	     	getTopIdAjax:function(){
	     		var self = this;
	     		var option = {
		            url:MoonduDomain+"/CmsApi/CmsInfos",
		            data:{id:41},
		            callback:function(res){
		            	if (res.Result) {
		            		var uid = res.Data.CONTENT;
		            		self.geMatcherTop3Ajax(uid)
		            	}
		        	}
		        }
		       	$.md.ajaxurl(option);
	     	},
	     	//===============设计师TOP3===============
	     	geMatcherTop3Ajax:function(uid){
	     		var self = this;
				var option = {
		            url:MoonduDomain + "/UserCenterB/ListUsers",
		            data:{uid:uid},
		            callback:function(res){
		            	if (res.Result) 
		            		self.rankingRender(res.Data);
						if (res.Data == '') {
							$.alert("TOP3数据为空")
						};
		            }
		        }
		       	$.md.ajaxurl(option);
	     	},
	     	//======获取搭配作品数据=======
	     	getPhotoDataAjax:function(page){
				var self = this;
				var txt = this.serchField.find("input").val();
				var option={
			        url:MoonduDomain + "/photob/UsersPhotosList",
			        data:{page:page,pageSize:10,gid:41},
			        callback:function(res){
			           if (res.Result) {
							if (res.Data.Rows.length > 0) {
								self.matcherWorkRender(res.Data.Rows);
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
	   //设计档
	    var Design = {

			init:function(){
				var self = this;
				this.$top = $("#designTop");
				this.serchField = $("#serchField");
				this.wrap = $("#designWork");
				this.rankWrap = $("#design-rank");
				this.page = 1;
				this.callAjax = true;//是否接受ajax请求
				this.userInfor = {};//存储当前用户信息
				this.topList = []; //TOP3数据
				this.designList = [];//设计作品数据
				//获取当前用户信息
				this._getCurrentUserInforAjax();
				this._bindEvent();
			},
			_bindEvent:function(){
				var self=this;
				this.getTopIdAjax();
				this.getLatestDesinerAjax(self.page);
				//点击滑到顶部
				$('#match-scroll-top').click(function(){
					$('html,body').animate({scrollTop: '0px'}, 500);
					return false;
				});
				//判断是否滚动到了底部
				$(window).scroll(function () {
				    if ($(document).scrollTop() + $(window).height() + 50 >= $(document).height()) {
				    	if (self.page == -1) return;
				    	self.page ++;
				    	if (self.page > 1) {
				    		if (!self.callAjax) return;
          					self.callAjax = false;
				       		self.getLatestDesinerAjax(self.page);
				    	}
				    }
				});
				//关注
				this.wrap.on("click","a.attention",self.attentionAjax.bind(this));
				//取消关注
				this.wrap.on("click","a.attention-active",self.cancelAttentionAjax.bind(this));
				//点击搜索跳转到热门人物
				this.serchField.find("a").bind("click",function(){
					var txt = self.serchField.find("input").val(),
						reurl=window.location.href,  
                		index = reurl.lastIndexOf('/') + 1,				
                		Reurl = reurl.substring(index);
                	Reurl=Reurl.replaceAll('?','||').replaceAll('=','__').replaceAll('&','#');
					location.href="search.html?value="+txt+"&reurl="+Reurl+"";
				});
				//图片轮播
				this.pictureScrollAjax();
				this.$top.on('click','.join',self.joinCampAjax.bind(this));
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
						if (res.Result !="nologin" && res.Result && res.Data.Gids) {
							self.userInfor.gid = res.Data.Gids;
							self.userInfor.id = res.Data.Uid;
						}
						if (res.Result) {
							self._bindEvent();
							self.userInfor.isLogined = res.Result;
							self.joinCamp();//判断有没有加入阵营
						};
					}
				}
			$.md.ajaxurl(option);
			},
			//===============设计师TOP3模块渲染========
			designerRankingRender:function(data){
				var self=this,
					html="",
					designerTemp=document.getElementById("designerTemp").innerHTML,
					temp=new EJS({"text": designerTemp});

				for(var i=0;i<data.length;i++){
					html += temp.render(data[i]);
					this.topList.push(data[i]);
				}
				this.rankWrap.find("ul").html(html);
				//判断用户头像是否为空，若是为空，则显示默认头像
				var item = this.rankWrap.find("ul").find('li');

				$(this.rankWrap.find('li').eq(1)).find('.rank').attr('src','images/match-icon-2.png');
	     		$(this.rankWrap.find('li').eq(2)).find('.rank').attr('src','images/match-icon-3.png');
			},
			//======================设计师作品模块渲染====================
			designWorkRender:function(data,flag){
				var self=this,
					html="",
					designWorkTmp=document.getElementById("designWorkTmp").innerHTML,
					temp=new EJS({"text": designWorkTmp});

				for(var i=0;i<data.length;i++){
					html += temp.render(data[i]);
					this.designList.push(data[i]);
				}
				//判断是页面首次渲染还是搜索的结果
	     		switch (flag){
	     			case 'render' : this.wrap.append(html); break;
	     			case 'search' : this.wrap.html(html); break;
	     		}

	     		//标签用#ff7f00颜色标识
	     		var item = this.wrap.find('.list-item');
	     		item.each(function(){
	     			var title = $(this).find('.title').text(),
	     				index = title.indexOf('#'),
	     				declare = title.substring(0,index),
	     				tags = title.substring(index),
	     				emElement = $("<em>"+tags+"</em>");
	     			if (index > -1) {
	     				if (index == 0) {
	     					$(this).find('.title').css('color','#ff7f00');
	     				}else{
	     					$(this).find('.title').text(declare);
	     					emElement.css('color','#ff7f00');
	     					$(this).find('.title').append(emElement);	
	     				}
	     			}
	     		});
			},
			joinCamp:function(){
				var self = this;
				if (this.userInfor.gid && this.userInfor.gid.indexOf(42) > -1){
					this.$top.find('span').removeClass("join").addClass("cur");
					this.$top.find('span').text("已加入阵营");
				}
			},
			attentionModule:function(userId){
				this.wrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').removeClass("attention").addClass("attention-active");
				this.wrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').text('已关注');
			},
			cancelAttentionModule:function(userId){
				this.wrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').addClass("attention").removeClass("attention-active");
				this.wrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').text('+关注');
			},
			//=================图片轮播模块渲染================
			pictureScrollRender:function(data){
				 var self = this,
     				html = '',
     				picScrollTemp = document.getElementById("picScrollTemp"),
     				temp = new EJS({"text": picScrollTemp}),
     				slider = $(".flexslider")
    			for (var i = 0; i < data.length; i++) {
     				html += temp.render(data[i]);
    			};
				$("#tab").find("ul").html(html);
			 	slider.flexslider({
					slideshowSpeed: 4000,
					animationSpeed: 400, 
					touch: true, //是否支持触屏滑动
					animation:"slide",
					slideshow:"true",
					pauseOnHover:false
				});
				$("ul.flex-direction-nav").remove();
				$("ol.flex-control-nav").addClass("hidden");
			},
			pictureScrollAjax:function(){
				var self = this;
    			var option={
     				url:MoonduDomain+'/MNewsB/IndexNews',
     				data:{cmsid:40},
     				callback:function(res){
     					if (!res.Result) return;
      					self.pictureScrollRender(res.Data.Rows);
     				}
    			}
    			$.md.ajaxurl(option);
			},
			//获取前三名的id
             getTopIdAjax:function(){
                 var self = this;
                 var option = {
                    url:MoonduDomain+"/CmsApi/CmsInfos",
                    data:{id:42},
                    callback:function(res){
                        if (res.Result) {
                            var uid = res.Data.CONTENT;
                            self.designerTop3Ajax(uid)
                        }
                    }
                }
                   $.md.ajaxurl(option);
             },
			//==============设计师TOP3=============
			designerTop3Ajax:function(uid){
				var self = this;
				var option = {
		            url:MoonduDomain + "/UserCenterB/ListUsers",
		            data:{uid:uid},
		            callback:function(res){
		            	if (res.Result) self.designerRankingRender(res.Data);
						if (res.Data == '') {
							$.alert("TOP3数据为空");
						};
		            }
		        }
		       	$.md.ajaxurl(option);
			},
			joinCampAjax:function(){
				var self = this;
				this.userInfor.isLogined == true ? join() : $.login('是否登录');
				function join(){
					var option = {
			            url:MoonduDomain + '/Found/AddGroup',
			            data:{gid:42},
			            callback:function(res){
			            	if (res.Result) {
								self.$top.find('span').removeClass("join").addClass("cur");
								self.$top.find('span').text("已加入阵营");
							};
			            }
		        	}
		       	$.md.ajaxurl(option);
				}
				
			},
			//==============关注ajax=============
	     	attentionAjax:function(e){
	     		var self = this,
	     			target = e.target,
	     			uid = $(target).parent().find("input[data-type=uid]").val();
	     		this.userInfor.isLogined == true ? attention() : $.login('是否登录');
     			function attention(){
     				//当前用户不能关注自己
     				uid == self.userInfor.id ? layerShow() : ajaxManager();
     			}
	     		function layerShow(){
	     			layer.open({
					    content: '不能关注自己',
					    btn: ['OK']
					});
	     		}
	     		function ajaxManager(){
					var option={
			            url:MoonduDomain + "/Found/MFocus",
			            data:{fansId:uid,flag:0},
			            callback:function(res){
			            	if (res.Result) {
								self.attentionModule(uid);
							}else{
								$.alert(res.Msg);
							}
			            }
			        }
			       	$.md.ajaxurl(option);
	     		}
	     	},
	     	//==============取消关注=========
	     	cancelAttentionAjax:function(e){
	     		var self = this,
	     			target = e.target,
	     			uid = $(target).parent().find("input[data-type=uid]").val();
	     		this.userInfor.isLogined == true ? cancel() : $.login('是否登录');
	     		function cancel(){
	     			var option={
			            url:MoonduDomain + "/Found/MFocus",
			            data:{fansId:uid,flag:1},
			            callback:function(res){
			            	if (res.Result) {
								self.cancelAttentionModule(uid);
							}
			            }
			        }
		       		$.md.ajaxurl(option);
	     		}
	     	},
			//==================获取最新设计师数据==============
			getLatestDesinerAjax:function(page){
				var self=this;
				var option={
		            url:MoonduDomain + "/photob/UsersPhotosList",
		            data:{page:page,pageSize:10,gid:42},
		            callback:function(res){
		            	if (res.Result) {
							if (res.Data.Rows.length > 0) {
								self.designWorkRender(res.Data.Rows,'render');
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
		//造型派
		var Sculpt = {

			init:function(){
				var self = this;
				this.$top = $("#designTop");
				this.serchField = $("#serchField");
				this.wrap = $("#designWork");
				this.rankWrap = $("#design-rank");
				this.page = 1;
				this.callAjax = true;//是否接受ajax请求
				this.userInfor = {};//存储当前用户信息
				this.topList = []; //TOP3数据
				this.designList = [];//设计作品数据
				//获取当前用户信息
				this._getCurrentUserInforAjax();
				this._bindEvent();
			},
			_bindEvent:function(){
				var self = this;
				this.getTopIdAjax();
				this.getLatestDesinerAjax(self.page);
				//点击滑到顶部
				$('#match-scroll-top').click(function(){
					$('html,body').animate({scrollTop: '0px'}, 500);
					return false;
				});
				//判断是否滚动到了底部
				$(window).scroll(function () {
				    if ($(document).scrollTop() + $(window).height() + 50 >= $(document).height()) {
				    	if (self.page == -1) return;
				    	self.page ++;
				    	if (self.page > 1) {
				    		if (!self.callAjax) return;
          					self.callAjax = false;
				       		self.getLatestDesinerAjax(self.page);
				    	}
				    }
				});
				//关注
				this.wrap.on("click","a.attention",self.attentionAjax.bind(this));
				//取消关注
				this.wrap.on("click","a.attention-active",self.cancelAttentionAjax.bind(this));
				//点击搜索跳转到热门人物
				this.serchField.find("a").bind("click",function(){
					var txt = self.serchField.find("input").val(),
						reurl=window.location.href,  
                		index = reurl.lastIndexOf('/') + 1,				
                		Reurl = reurl.substring(index);
                	Reurl=Reurl.replaceAll('?','||').replaceAll('=','__').replaceAll('&','#');
					location.href="search.html?value="+txt+"&reurl="+Reurl+"";
				});
				//图片轮播
				this.pictureScrollAjax();
				this.$top.on('click','.join',self.joinCampAjax.bind(this));
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
						if (res.Result !="nologin" && res.Result && res.Data.Gids) {
							self.userInfor.gid = res.Data.Gids;
							self.userInfor.id = res.Data.Uid;
						}
						if (res.Result) {
							self._bindEvent();
							self.userInfor.isLogined = res.Result;
							self.joinCamp();//判断有没有加入阵营
						};
					}
				}
			$.md.ajaxurl(option);
			},
			//===============设计师TOP3模块渲染========
			designerRankingRender:function(data){
				var self=this,
					html="",
					designerTemp=document.getElementById("designerTemp").innerHTML,
					temp=new EJS({"text": designerTemp});

				for(var i=0;i<data.length;i++){
					html += temp.render(data[i]);
					this.topList.push(data[i]);
				}
				this.rankWrap.find("ul").html(html);
				//判断用户头像是否为空，若是为空，则显示默认头像
				var item = this.rankWrap.find("ul").find('li');

				$(this.rankWrap.find('li').eq(1)).find('.rank').attr('src','images/match-icon-2.png');
	     		$(this.rankWrap.find('li').eq(2)).find('.rank').attr('src','images/match-icon-3.png');
			},
			//======================设计师作品模块渲染====================
			designWorkRender:function(data,flag){
				var self=this,
					html="",
					designWorkTmp=document.getElementById("designWorkTmp").innerHTML,
					temp=new EJS({"text": designWorkTmp});

				for(var i=0;i<data.length;i++){
					html += temp.render(data[i]);
					this.designList.push(data[i]);
				}
				//判断是页面首次渲染还是搜索的结果
	     		switch (flag){
	     			case 'render' : this.wrap.append(html); break;
	     			case 'search' : this.wrap.html(html); break;
	     		}

	     		//标签用#ff7f00颜色标识
	     		var item = this.wrap.find('.list-item');
	     		item.each(function(){
	     			var title = $(this).find('.title').text(),
	     				index = title.indexOf('#'),
	     				declare = title.substring(0,index),
	     				tags = title.substring(index),
	     				emElement = $("<em>"+tags+"</em>");
	     			if (index > -1) {
	     				if (index == 0) {
	     					$(this).find('.title').css('color','#ff7f00');
	     				}else{
	     					$(this).find('.title').text(declare);
	     					emElement.css('color','#ff7f00');
	     					$(this).find('.title').append(emElement);	
	     				}
	     			}
	     		});
			},
			joinCamp:function(){
				var self = this;
				if (this.userInfor.gid && this.userInfor.gid.indexOf(42) > -1){
					this.$top.find('span').removeClass("join").addClass("cur");
					this.$top.find('span').text("已加入阵营");
				}
			},
			attentionModule:function(userId){
				this.wrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').removeClass("attention").addClass("attention-active");
				this.wrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').text('已关注');
			},
			cancelAttentionModule:function(userId){
				this.wrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').addClass("attention").removeClass("attention-active");
				this.wrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').text('+关注');
			},
			//=================图片轮播模块渲染================
			pictureScrollRender:function(data){
				var self = this,
     				html = '',
     				picScrollTemp = document.getElementById("picScrollTemp"),
     				temp = new EJS({"text": picScrollTemp}),
     				slider = $(".flexslider")
    			for (var i = 0; i < data.length; i++) {
     				html += temp.render(data[i]);
    			};
				$("#tab").find("ul").html(html);
			 	slider.flexslider({
					slideshowSpeed: 4000,
					animationSpeed: 400, 
					touch: true, //是否支持触屏滑动
					animation:"slide",
					slideshow:"true",
					pauseOnHover:false
				});
				$("ul.flex-direction-nav").remove();
				$("ol.flex-control-nav").addClass("hidden");
			},
			pictureScrollAjax:function(){
				var self = this;
    			var option = {
     				url:MoonduDomain+'/MNewsB/IndexNews',
     				data:{cmsid:40},
     				callback:function(res){
     					if (!res.Result) return;
      					self.pictureScrollRender(res.Data.Rows);
     				}
    			}
    			$.md.ajaxurl(option);
			},
			getTopIdAjax:function(){
                 var self = this;
                 var option = {
                    url:MoonduDomain+"/CmsApi/CmsInfos",
                    data:{id:41},
                    callback:function(res){
                        if (res.Result) {
                            var uid = res.Data.CONTENT;
                            self.sculptTop3Ajax(uid)
                        }
                    }
                }
                $.md.ajaxurl(option);
             },
			//==============设计师TOP3=============
			sculptTop3Ajax:function(uid){
				var self = this;
				var option = {
		            url:MoonduDomain + "/UserCenterB/ListUsers",
		            data:{uid:uid},
		            callback:function(res){
		            	if (res.Result) {
		            		if (res.Data.length == 0) {
								$.alert("TOP3数据为空");
							}else{
								self.designerRankingRender(res.Data);
							}
		            	}
						
		            }
		        }
		       	$.md.ajaxurl(option);
			},
			joinCampAjax:function(){
				var self = this;
				this.userInfor.isLogined == true ? join() : $.login('是否登录');
				function join(){
					var option={
			            url:MoonduDomain + '/Found/AddGroup',
			            data:{gid:43},
			            callback:function(res){
			            	if (res.Result) {
								self.$top.find('span').removeClass("join").addClass("cur");
								self.$top.find('span').text("已加入阵营");
							};
			            }
		        	}
		       	$.md.ajaxurl(option);
				}
				
			},
			//==============关注ajax=============
	     	attentionAjax:function(e){
	     		var self = this,
	     			target = e.target,
	     			uid = $(target).parent().find("input[data-type=uid]").val();
	     		this.userInfor.isLogined == true ? attention() : $.login('是否登录');
     			function attention(){
     				//当前用户不能关注自己
     				uid == self.userInfor.id ? layerShow() : ajaxManager();
     			}
	     		function layerShow(){
	     			layer.open({
					    content: '不能关注自己',
					    btn: ['OK']
					});
	     		}
	     		function ajaxManager(){
					var option={
			            url:MoonduDomain + "/Found/MFocus",
			            data:{fansId:uid,flag:0},
			            callback:function(res){
			            	if (res.Result) {
								self.attentionModule(uid);
							}else{
								$.alert(res.Msg);
							}
			            }
			        }
			       	$.md.ajaxurl(option);
	     		}
	     	},
	     	//==============取消关注=========
	     	cancelAttentionAjax:function(e){
	     		var self = this,
	     			target = e.target,
	     			uid = $(target).parent().find("input[data-type=uid]").val();
	     		this.userInfor.isLogined == true ? cancel() : $.login('是否登录');
	     		function cancel(){
	     			var option={
			            url:MoonduDomain + "/Found/MFocus",
			            data:{fansId:uid,flag:1},
			            callback:function(res){
			            	if (res.Result) {
								self.cancelAttentionModule(uid);
							}
			            }
			        }
		       		$.md.ajaxurl(option);
	     		}
	     	},
			//==================获取最新设计师数据==============
			getLatestDesinerAjax:function(page){
				var self = this;
				var option = {
		            url:MoonduDomain + "/photob/UsersPhotosList",
		            data:{page:page,pageSize:10,gid:43},
		            callback:function(res){
		            	if (res.Result) {
							if (res.Data.Rows.length > 0) {
								self.designWorkRender(res.Data.Rows,'render');
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
		//摄影会
		var photoCamp = {

			init:function(){
				var self = this;
				this.$top = $("#designTop");
				this.serchField = $("#serchField");
				this.wrap = $("#designWork");
				this.rankWrap = $("#design-rank");
				this.page = 1;
				this.callAjax = true;//是否接受ajax请求
				this.userInfor = {};//存储当前用户信息
				this.topList = []; //TOP3数据
				this.designList = [];//设计作品数据
				//获取当前用户信息
				this._getCurrentUserInforAjax();
				this._bindEvent();
			},
			_bindEvent:function(){
				var self = this;
				this.getTopIdAjax();
				this.getLatestDesinerAjax(self.page);
				//点击滑到顶部
				$('#match-scroll-top').click(function(){
					$('html,body').animate({scrollTop: '0px'}, 500);
					return false;
				});
				//判断是否滚动到了底部
				$(window).scroll(function () {
				    if ($(document).scrollTop() + $(window).height() + 50 >= $(document).height()) {
				    	if (self.page == -1) return;
				    	self.page ++;
				    	if (self.page > 1) {
				    		if (!self.callAjax) return;
          					self.callAjax = false;
				       		self.getLatestDesinerAjax(self.page);
				    	}
				    }
				});
				//关注
				this.wrap.on("click","a.attention",self.attentionAjax.bind(this));
				//取消关注
				this.wrap.on("click","a.attention-active",self.cancelAttentionAjax.bind(this));
				//点击搜索跳转到热门人物
				this.serchField.find("a").bind("click",function(){
					var txt = self.serchField.find("input").val(),
						reurl=window.location.href,  
                		index = reurl.lastIndexOf('/') + 1,				
                		Reurl = reurl.substring(index);
                	Reurl=Reurl.replaceAll('?','||').replaceAll('=','__').replaceAll('&','#');
					location.href="search.html?value="+txt+"&reurl="+Reurl+"";
				});
				//图片轮播
				this.pictureScrollAjax();
				this.$top.on('click','.join',self.joinCampAjax.bind(this));
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
						if (res.Result !="nologin" && res.Result && res.Data.Gids) {
							self.userInfor.gid = res.Data.Gids;
							self.userInfor.id = res.Data.Uid;
						}
						if (res.Result) {
							self._bindEvent();
							self.userInfor.isLogined = res.Result;
							self.joinCamp();//判断有没有加入阵营
						};
					}
				}
			$.md.ajaxurl(option);
			},
			//===============设计师TOP3模块渲染========
			designerRankingRender:function(data){
				var self=this,
					html="",
					designerTemp=document.getElementById("designerTemp").innerHTML,
					temp=new EJS({"text": designerTemp});

				for(var i=0;i<data.length;i++){
					html += temp.render(data[i]);
					this.topList.push(data[i]);
				}
				this.rankWrap.find("ul").html(html);
				//判断用户头像是否为空，若是为空，则显示默认头像
				var item = this.rankWrap.find("ul").find('li');

				$(this.rankWrap.find('li').eq(1)).find('.rank').attr('src','images/match-icon-2.png');
	     		$(this.rankWrap.find('li').eq(2)).find('.rank').attr('src','images/match-icon-3.png');
			},
			//======================设计师作品模块渲染====================
			designWorkRender:function(data,flag){
				var self=this,
					html="",
					designWorkTmp=document.getElementById("designWorkTmp").innerHTML,
					temp=new EJS({"text": designWorkTmp});

				for(var i=0;i<data.length;i++){
					html += temp.render(data[i]);
					this.designList.push(data[i]);
				}
				//判断是页面首次渲染还是搜索的结果
	     		switch (flag){
	     			case 'render' : this.wrap.append(html); break;
	     			case 'search' : this.wrap.html(html); break;
	     		}

	     		//标签用#ff7f00颜色标识
	     		var item = this.wrap.find('.list-item');
	     		item.each(function(){
	     			var title = $(this).find('.title').text(),
	     				index = title.indexOf('#'),
	     				declare = title.substring(0,index),
	     				tags = title.substring(index),
	     				emElement = $("<em>"+tags+"</em>");
	     			if (index > -1) {
	     				if (index == 0) {
	     					$(this).find('.title').css('color','#ff7f00');
	     				}else{
	     					$(this).find('.title').text(declare);
	     					emElement.css('color','#ff7f00');
	     					$(this).find('.title').append(emElement);	
	     				}
	     			}
	     		});
			},
			joinCamp:function(){
				var self = this;
				if (this.userInfor.gid && this.userInfor.gid.indexOf(42) > -1){
					this.$top.find('span').removeClass("join").addClass("cur");
					this.$top.find('span').text("已加入阵营");
				}
			},
			attentionModule:function(userId){
				this.wrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').removeClass("attention").addClass("attention-active");
				this.wrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').text('已关注');
			},
			cancelAttentionModule:function(userId){
				this.wrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').addClass("attention").removeClass("attention-active");
				this.wrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').text('+关注');
			},
			//=================图片轮播模块渲染================
			pictureScrollRender:function(data){
				 var self = this,
     				html = '',
     				picScrollTemp = document.getElementById("picScrollTemp"),
     				temp = new EJS({"text": picScrollTemp}),
     				slider = $(".flexslider")
    			for (var i = 0; i < data.length; i++) {
     				html += temp.render(data[i]);
    			};
				$("#tab").find("ul").html(html);
			 	slider.flexslider({
					slideshowSpeed: 4000,
					animationSpeed: 400, 
					touch: true, //是否支持触屏滑动
					animation:"slide",
					slideshow:"true",
					pauseOnHover:false
				});
				$("ul.flex-direction-nav").remove();
				$("ol.flex-control-nav").addClass("hidden");
			},
			pictureScrollAjax:function(){
				var self = this;
    			var option={
     				url:MoonduDomain+'/MNewsB/IndexNews',
     				data:{cmsid:40},
     				callback:function(res){
     					if (!res.Result) return;
      					self.pictureScrollRender(res.Data.Rows);
     				}
    			}
    			$.md.ajaxurl(option);
			},
			getTopIdAjax:function(){
                 var self = this;
                 var option = {
                    url:MoonduDomain+"/CmsApi/CmsInfos",
                    data:{id:1045},
                    callback:function(res){
                        if (res.Result) {
                            var uid = res.Data.CONTENT;
                            self.famous3Ajax(uid)
                        }
                    }
                }
                $.md.ajaxurl(option);
             },
			//==============设计师TOP3=============
			famous3Ajax:function(uid){
				var self = this;
				var option = {
		            url:MoonduDomain + "/UserCenterB/ListUsers",
		            data:{uid:uid},
		            callback:function(res){
		            	if (res.Result) {
		            		if (res.Data.length == 0) {
								$.alert("TOP3数据为空");
							}else{
								self.designerRankingRender(res.Data);
							}
		            	}
		            }
		        }
		       	$.md.ajaxurl(option);
			},
			joinCampAjax:function(){
				var self = this;
				this.userInfor.isLogined == true ? join() : $.login('是否登录');
				function join(){
					var option={
			            url:MoonduDomain + '/Found/AddGroup',
			            data:{gid:44},
			            callback:function(res){
			            	if (res.Result) {
								self.$top.find('span').removeClass("join").addClass("cur");
								self.$top.find('span').text("已加入阵营");
							};
			            }
		        	}
		       	$.md.ajaxurl(option);
				}
				
			},
			//==============关注ajax=============
	     	attentionAjax:function(e){
	     		var self = this,
	     			target = e.target,
	     			uid = $(target).parent().find("input[data-type=uid]").val();
	     		this.userInfor.isLogined == true ? attention() : $.login('是否登录');
     			function attention(){
     				//当前用户不能关注自己
     				uid == self.userInfor.id ? layerShow() : ajaxManager();
     			}
	     		function layerShow(){
	     			layer.open({
					    content: '不能关注自己',
					    btn: ['OK']
					});
	     		}
	     		function ajaxManager(){
					var option={
			            url:MoonduDomain + "/Found/MFocus",
			            data:{fansId:uid,flag:0},
			            callback:function(res){
			            	if (res.Result) {
								self.attentionModule(uid);
							}else{
								$.alert(res.Msg);
							}
			            }
			        }
			       	$.md.ajaxurl(option);
	     		}
	     	},
	     	//==============取消关注=========
	     	cancelAttentionAjax:function(e){
	     		var self = this,
	     			target = e.target,
	     			uid = $(target).parent().find("input[data-type=uid]").val();
	     		this.userInfor.isLogined == true ? cancel() : $.login('是否登录');
	     		function cancel(){
	     			var option={
			            url:MoonduDomain + "/Found/MFocus",
			            data:{fansId:uid,flag:1},
			            callback:function(res){
			            	if (res.Result) {
								self.cancelAttentionModule(uid);
							}
			            }
			        }
		       		$.md.ajaxurl(option);
	     		}
	     	},
			//==================获取最新设计师数据==============
			getLatestDesinerAjax:function(page){
				var self = this;
				var option = {
		            url:MoonduDomain + "/photob/UsersPhotosList",
		            data:{page:page,pageSize:10,gid:43},
		            callback:function(res){
		            	if (res.Result) {
							if (res.Data.Rows.length > 0) {
								self.designWorkRender(res.Data.Rows,'render');
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
		//名人堂
		var Famous = {

			init:function(){
				var self = this;
				this.$top = $("#designTop");
				this.serchField = $("#serchField");
				this.wrap = $("#designWork");
				this.rankWrap = $("#design-rank");
				this.page = 1;
				this.callAjax = true;//是否接受ajax请求
				this.userInfor = {};//存储当前用户信息
				this.topList = []; //TOP3数据
				this.designList = [];//设计作品数据
				//获取当前用户信息
				this._getCurrentUserInforAjax();
				this._bindEvent();
			},
			_bindEvent:function(){
				var self = this;
				this.getTopIdAjax();
				this.getLatestDesinerAjax(self.page);
				//点击滑到顶部
				$('#match-scroll-top').click(function(){
					$('html,body').animate({scrollTop: '0px'}, 500);
					return false;
				});
				//判断是否滚动到了底部
				$(window).scroll(function () {
				    if ($(document).scrollTop() + $(window).height() + 50 >= $(document).height()) {
				    	if (self.page == -1) return;
				    	self.page ++;
				    	if (self.page > 1) {
				    		if (!self.callAjax) return;
          					self.callAjax = false;
				       		self.getLatestDesinerAjax(self.page);
				    	}
				    }
				});
				//关注
				this.wrap.on("click","a.attention",self.attentionAjax.bind(this));
				//取消关注
				this.wrap.on("click","a.attention-active",self.cancelAttentionAjax.bind(this));
				//点击搜索跳转到热门人物
				this.serchField.find("a").bind("click",function(){
					var txt = self.serchField.find("input").val(),
						reurl=window.location.href,  
                		index = reurl.lastIndexOf('/') + 1,				
                		Reurl = reurl.substring(index);
                	Reurl=Reurl.replaceAll('?','||').replaceAll('=','__').replaceAll('&','#');
					location.href="search.html?value="+txt+"&reurl="+Reurl+"";
				});
				//图片轮播
				this.pictureScrollAjax();
				this.$top.on('click','.join',self.joinCampAjax.bind(this));
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
						if (res.Result !="nologin" && res.Result && res.Data.Gids) {
							self.userInfor.gid = res.Data.Gids;
							self.userInfor.id = res.Data.Uid;
						}
						if (res.Result) {
							self._bindEvent();
							self.userInfor.isLogined = res.Result;
							self.joinCamp();//判断有没有加入阵营
						};
					}
				}
			$.md.ajaxurl(option);
			},
			//===============设计师TOP3模块渲染========
			designerRankingRender:function(data){
				var self=this,
					html="",
					designerTemp=document.getElementById("designerTemp").innerHTML,
					temp=new EJS({"text": designerTemp});

				for(var i=0;i<data.length;i++){
					html += temp.render(data[i]);
					this.topList.push(data[i]);
				}
				this.rankWrap.find("ul").html(html);
				//判断用户头像是否为空，若是为空，则显示默认头像
				var item = this.rankWrap.find("ul").find('li');

				$(this.rankWrap.find('li').eq(1)).find('.rank').attr('src','images/match-icon-2.png');
	     		$(this.rankWrap.find('li').eq(2)).find('.rank').attr('src','images/match-icon-3.png');
			},
			//======================设计师作品模块渲染====================
			designWorkRender:function(data,flag){
				var self=this,
					html="",
					designWorkTmp=document.getElementById("designWorkTmp").innerHTML,
					temp=new EJS({"text": designWorkTmp});

				for(var i=0;i<data.length;i++){
					html += temp.render(data[i]);
					this.designList.push(data[i]);
				}
				//判断是页面首次渲染还是搜索的结果
	     		switch (flag){
	     			case 'render' : this.wrap.append(html); break;
	     			case 'search' : this.wrap.html(html); break;
	     		}

	     		//标签用#ff7f00颜色标识
	     		var item = this.wrap.find('.list-item');
	     		item.each(function(){
	     			var title = $(this).find('.title').text(),
	     				index = title.indexOf('#'),
	     				declare = title.substring(0,index),
	     				tags = title.substring(index),
	     				emElement = $("<em>"+tags+"</em>");
	     			if (index > -1) {
	     				if (index == 0) {
	     					$(this).find('.title').css('color','#ff7f00');
	     				}else{
	     					$(this).find('.title').text(declare);
	     					emElement.css('color','#ff7f00');
	     					$(this).find('.title').append(emElement);	
	     				}
	     			}
	     		});
			},
			joinCamp:function(){
				var self = this;
				if (this.userInfor.gid && this.userInfor.gid.indexOf(42) > -1){
					this.$top.find('span').removeClass("join").addClass("cur");
					this.$top.find('span').text("已加入阵营");
				}
			},
			attentionModule:function(userId){
				this.wrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').removeClass("attention").addClass("attention-active");
				this.wrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').text('已关注');
			},
			cancelAttentionModule:function(userId){
				this.wrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').addClass("attention").removeClass("attention-active");
				this.wrap.find('.list-item[data-uid="'+userId+'"]').find('a[data-type=attention]').text('+关注');
			},
			//=================图片轮播模块渲染================
			pictureScrollRender:function(data){
				 var self = this,
     				html = '',
     				picScrollTemp = document.getElementById("picScrollTemp"),
     				temp = new EJS({"text": picScrollTemp}),
     				slider = $(".flexslider")
    			for (var i = 0; i < data.length; i++) {
     				html += temp.render(data[i]);
    			};
				$("#tab").find("ul").html(html);
			 	slider.flexslider({
					slideshowSpeed: 4000,
					animationSpeed: 400, 
					touch: true, //是否支持触屏滑动
					animation:"slide",
					slideshow:"true",
					pauseOnHover:false
				});
				$("ul.flex-direction-nav").remove();
				$("ol.flex-control-nav").addClass("hidden");
			},
			pictureScrollAjax:function(){
				var self = this;
    			var option={
     				url:MoonduDomain+'/MNewsB/IndexNews',
     				data:{cmsid:40},
     				callback:function(res){
     					if (!res.Result) return;
      					self.pictureScrollRender(res.Data.Rows);
     				}
    			}
    			$.md.ajaxurl(option);
			},
			getTopIdAjax:function(){
                 var self = this;
                 var option = {
                    url:MoonduDomain+"/CmsApi/CmsInfos",
                    data:{id:1047},
                    callback:function(res){
                        if (res.Result) {
                            var uid = res.Data.CONTENT;
                            self.famous3Ajax(uid)
                        }
                    }
                }
                $.md.ajaxurl(option);
             },
			//==============设计师TOP3=============
			famous3Ajax:function(uid){
				var self = this;
				var option = {
		            url:MoonduDomain + "/UserCenterB/ListUsers",
		            data:{uid:uid},
		            callback:function(res){
		            	if (res.Result) {
		            		if (res.Data.length == 0) {
								$.alert("TOP3数据为空");
							}else{
								self.designerRankingRender(res.Data);
							}
		            	}
		            }
		        }
		       	$.md.ajaxurl(option);
			},
			joinCampAjax:function(){
				var self = this;
				this.userInfor.isLogined == true ? join() : $.login('是否登录');
				function join(){
					var option={
			            url:MoonduDomain + '/Found/AddGroup',
			            data:{gid:45},
			            callback:function(res){
			            	if (res.Result) {
								self.$top.find('span').removeClass("join").addClass("cur");
								self.$top.find('span').text("已加入阵营");
							};
			            }
		        	}
		       	$.md.ajaxurl(option);
				}
				
			},
			//==============关注ajax=============
	     	attentionAjax:function(e){
	     		var self = this,
	     			target = e.target,
	     			uid = $(target).parent().find("input[data-type=uid]").val();
	     		this.userInfor.isLogined == true ? attention() : $.login('是否登录');
     			function attention(){
     				//当前用户不能关注自己
     				uid == self.userInfor.id ? layerShow() : ajaxManager();
     			}
	     		function layerShow(){
	     			layer.open({
					    content: '不能关注自己',
					    btn: ['OK']
					});
	     		}
	     		function ajaxManager(){
					var option={
			            url:MoonduDomain + "/Found/MFocus",
			            data:{fansId:uid,flag:0},
			            callback:function(res){
			            	if (res.Result) {
								self.attentionModule(uid);
							}else{
								$.alert(res.Msg);
							}
			            }
			        }
			       	$.md.ajaxurl(option);
	     		}
	     	},
	     	//==============取消关注=========
	     	cancelAttentionAjax:function(e){
	     		var self = this,
	     			target = e.target,
	     			uid = $(target).parent().find("input[data-type=uid]").val();
	     		this.userInfor.isLogined == true ? cancel() : $.login('是否登录');
	     		function cancel(){
	     			var option={
			            url:MoonduDomain + "/Found/MFocus",
			            data:{fansId:uid,flag:1},
			            callback:function(res){
			            	if (res.Result) {
								self.cancelAttentionModule(uid);
							}
			            }
			        }
		       		$.md.ajaxurl(option);
	     		}
	     	},
			//==================获取最新设计师数据==============
			getLatestDesinerAjax:function(page){
				var self = this;
				var option = {
		            url:MoonduDomain + "/photob/UsersPhotosList",
		            data:{page:page,pageSize:10,gid:43},
		            callback:function(res){
		            	if (res.Result) {
							if (res.Data.Rows.length > 0) {
								self.designWorkRender(res.Data.Rows,'render');
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
		//程序主入口
		var MainEntrance = {

			init:function(){

				 switch($("body").attr("data-type")){

				 	case "show" : Show.init(); break; //星秀场

				 	case "match" : Match.init(); break; //搭配帮

				 	case "design" : Design.init(); break; //设计党

				 	case "sculpt" : Sculpt.init(); break; //造型派

				 	case "photo" : photoCamp.init(); break; //造型派

				 	case "famous" : Famous.init(); break; //名人堂

				 	case "find-index" : Find.init(); break; //发现首页
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

























