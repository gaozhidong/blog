
	$(function(){

		var CurrentType = {};
		//活动详情
		var  Activity={

			init:function(){
				var self = this;
				this.$top = $("#top");
				this.mask = $("#mask");
				this.activityWrap = $("#activity_detail");
				this.$joinWrap = $("#joinActivity");
				this.$list = $("#issueWork");
				this.commentWrap =$("#comment-page");
				this.commentLayer = $("#commentLayer");
				this.littelWrap = $("#littleActivity");
				this.suspensionBoxWrap = $("#suspensionBox");
				this.userInfor = {};//存储当前用户信息
				this.userInfor.isLogined = false;
				this.activityData = [];  //存储活动数据
				this.activityCommentList = []; //存储对当前活动的评论列表
				this.personList = [];//存储参加活动的人物列表
				this.listScrollTop = 0;
				this.page = 1; 
				this.cpage = 1;
				this.activityTags = [];
				this.callAjax = true;//是否接受ajax请求
				this.commentCallAjax = true; //评论页是否接受ajax请求
				this.isFold = false; //判断内容是展开还是收起，默认是收起

				this._getCurrentUserInforAjax();
				this._bindEvent();
			},
			_bindEvent:function(){
				var self = this;
				var id = parseInt($.getUrlVar('id'));
				//获取活动详情
				this.getActivityAjax(id);
				//获取图片列表
				this.activityPhotoListAjax(this.page);
				//活动评论页出现
				this.suspensionBoxWrap.on("click","a.comment",self.commentShow.bind(this));
				//评论页消失
				this.commentWrap.on('click','a.arrow',self.commentHide.bind(this));
				//获取评论数据
				this.getActivityCommentAjax(this.cpage);
				//参加活动获取M豆
				this.$joinWrap.on("click","a.btn",self.getBeansByJoinActivityAjax.bind(this));
				//参加小活动
				this.suspensionBoxWrap.find('button').bind("click",joinLittleActivity.bind(this));
				//参加小活动
				this.$joinWrap.find("a.btn").bind("click",joinLittleActivity.bind(this));
				//点击添加评论,先判断是否评论成功
				this.commentLayer.on('click','button',self.isCommentSuccessAjax.bind(this));
				//展开和收起
				this.activityWrap.on('click','[data-type=more]',self._isFolded);
				//图片列表点赞
				this.$list.on("click","[data-fn=love]",self.photoListPraiseAjax.bind(this));
				//悬浮框点赞
				this.suspensionBoxWrap.on("click","[data-type=like]",self.suspensionBoxPraiseAjax);
				//拍照
				this.littelWrap.on("click","a.camera",self.takePicture.bind(this));
				//从相册中选择照片
				this.littelWrap.on("click","a.photos",self.choosePicFromPhoto.bind(this));
				//关闭按钮
				this.littelWrap.find("a.close").bind("click",function(){
					self.littelWrap.addClass("hidden");
					self.mask.addClass("hidden");
				});
				//用户选择拍照或者从相册中选择图片来参加活动
				function joinLittleActivity(){
					this.littelWrap.removeClass("hidden");
					this.mask.removeClass("hidden");
				}
			    //返回上页页面
			    this.$top.on("click","a.arrow",function(){
					var str = $.getUrlVar('reurl');	
					str = str.replaceAll('||','?').replaceAll('__','=').replaceAll('#','&');		
					window.location.href = str;
				});
				//滚动到底部，评论数量加载
				$(window).scroll(function(){
					//判断是哪一部分加载数据
					//评论部分加载数据
					if ($(document).scrollTop() + $(window).height() + 20 >= $(document).height()){
						if (!self.commentWrap.hasClass('hidden')) {
							if (self.cpage == -1) return;
				         	self.cpage ++;
				         	if (self.cpage > 1) {
				          		if (!self.commentCallAjax) return;
				                 self.commentCallAjax = false;
				                 self.getActivityCommentAjax(self.cpage);
				        	}
						}else{
							//图片列表加载数据
							if (self.page == -1) return;
							self.page ++;
							if (self.page > 1) {
								if (!self.callAjax) return;
								self.callAjax = false;
								self.activityPhotoListAjax(self.page);
							};
						}
					}
			    })
			},
			_getCurrentUserInforAjax:function(){
				var self = this,id = parseInt($.getUrlVar('id'));
				var option={
					url:MoonduDomain+'/UserCenter/GetUserInfo',
					callback:function(res){
						if (res.Result && res.Result != 'nologin') {
							self.userInfor.name = res.Data.UserNick;
							self.userInfor.portrait = res.Data.Image;
							self.userInfor.id = res.Data.Uid;
							self.userInfor.isLogined = true;
							//判断头像是否为空，若是为空，显示默认头像
			      			if (self.userInfor.portrait == 'http://nginx.moonbasagroup.com/images/user.jpg' || self.userInfor.portrait == '' || self.userInfor.portrait == null || self.userInfor.portrait == undefined) {
						      		self.userInfor.portrait = 'images/user.jpg';
						      }
						};
						//判断当前活动是否已经点赞
						self.isCurrentActivityLike(id,self.userInfor.isLogined);
					}
				}
				$.md.ajaxurl(option);
			},
			//============活动详情=============
			activityInformationRener:function(data){
				var self=this,
					html="",
					activityTemp=document.getElementById("activityTemp").innerHTML,
					temp = new EJS({"text": activityTemp});
				this.title = data.Title;
				this.content = data.Content;
				this.activityTags = data.Labels;

				html = temp.render(data);
				this.activityData.push(data);
				this.activityWrap.html(html);
				//如果活动状态stat为已经结束 1-已结束，0-没结束
				if (data.IsEnd == '1') {
					this.$joinWrap.find('a.btn').css('backgroundColor','#d8d8d8');
					this.$joinWrap.find('a.btn').text('活动已经结束');
					this.$joinWrap.find('a.btn').unbind('click');

					this.suspensionBoxWrap.find('button').css('backgroundColor','#d8d8d8');
					this.suspensionBoxWrap.find('button').text('已经结束');
					this.suspensionBoxWrap.find('button').unbind('click');
				}
				//活动评论的数量
				this.suspensionBoxWrap.find('span.comment').text('评论（' + data.ComCount + '）');
				this.commentWrap.find('span.num').text(data.ComCount);
				this.$joinWrap.find('[data-type=join]').text(data.VoteCount + '人');
				//图片宽度自适应
				this.activityWrap.find('.more').find('img').css({"width":'100%',"height":'auto','display':'block'});

			},
			//展开和收起
			_isFolded:function(){
				//如果是展开
				if (!Activity.isFold) {
					$(this).siblings(".more").removeClass("hidden");
					$(this).text("收起");
					$(this).append($("<b class='up'></b><b class='down hidden'></b>"));
					Activity.isFold = true;
				}else{
					$(this).siblings(".more").addClass("hidden");
					$(this).text("展开更多");
					$(this).append($("<b class='up hidden'></b><b class='down'></b>"));
					Activity.isFold = false;
				}
			},
			//========参加活动的人列表=========
			personJoinActivityRender:function(data){
				var self = this,
					html="",
					sceneryPublishTemp=document.getElementById("listTemp"),
					temp = new EJS({"text": listTemp});
				for (var i = 0; i < data.length; i++) {
					html += temp.render(data[i]);
					this.personList.push(data[i]);
				};
				this.$list.append(html);
				//页面渲染时判断点赞状态
				this.isPraiseAjax();
				//标签为undefiend或者图片为空，则隐藏。
				this.$list.find('li').each(function(index,item){
					//index为指针的索引值，item为对应的索引值的对象
					if ($(item).find('.introduction').text() == '#undefined#' || $(item).find('.work').find('img').attr('src') == '') {
						$(item).remove();
					};
				});
			},
			boxPraise:function(){
				var self = this;
				this.suspensionBoxWrap.find("a.like").removeClass("like").addClass("like-praise");
				//活动喜欢的人数增加
				var xcount = parseInt(this.activityWrap.find('.activity_title').find('.totle-love').find('span.num').text());
				xcount ++;
				this.activityWrap.find('.activity_title').find('.totle-love').find('span.num').text(xcount);
			},
			//======评论模块渲染=======
			commentRender:function(data){
				var self = this,
					html = "",
					commentTemp = document.getElementById("userCommentTemp").innerHTML,
					temp = new EJS({"text": commentTemp});
				for (var i = 0; i < data.length; i++) {
					html += temp.render(data[i]);
					this.activityCommentList.push(data[i]);
				};
				this.commentWrap.find("ul").append(html);
				var item = this.commentWrap.find("ul").find('li');
			},
			//============评论模块出现==============
			commentShow:function(){
				var self = this;
				this.listScrollTop = $('body').scrollTop();
				$("[data-fn=hide]").addClass("hidden");
				$('html,body').animate({scrollTop: 0}, 0);
				this.commentWrap.removeClass("hidden");
				this.commentLayer.removeClass("hidden");
				this.suspensionBoxWrap.addClass("hidden");
			},
			commentHide:function(){
				var commentNum = this.commentWrap.find('span.num').text();
				$("[data-fn=hide]").removeClass("hidden");
				this.commentWrap.addClass("hidden");
				this.commentLayer.addClass("hidden");
				this.suspensionBoxWrap.removeClass("hidden");
				this.suspensionBoxWrap.find('span.comment').text('评论（'+commentNum+'）');
				//返回原滚动条的位置
				$('html,body').animate({scrollTop: this.listScrollTop}, 0);
			},
			//==============评论页发表评论==========
			addComment:function(comment){	
				var self = this,
					reurl=window.location.href,  
					index = reurl.lastIndexOf('/') + 1,
					Reurl = reurl.substring(index);
				Reurl=Reurl.replaceAll('?','||').replaceAll('=','__').replaceAll('&','#');
				var parms={
						time:self.addZero(new Date().getHours()) +":"+self.addZero(new Date().getMinutes()),
						day:new Date().getFullYear() +"年" + self.addZero(new Date().getMonth() + 1) + "月"+self.addZero(new Date().getDate())+"日",
					}
					var oli="<li>\
							<a href='public_home.html?id="+self.userInfor.id+"&reurl="+Reurl+"' class='left-item fl'>\
					      		<img class='user-icon fl' src="+this.userInfor.portrait+">\
					      	</a>\
					      	<span class='user'>"+this.userInfor.name+"</span>\
					      	"+parms.day + "<span class='time'>  " + parms.time + "</span>\
					      	<p class='content'> " + comment + "</p>\
					    </li>";
				this.commentWrap.find("ul").prepend(oli);
				//评论成功后定位到评论的顶部
				$('html,body').animate({scrollTop: '0px'}, 500);
				//点击添加之后评论数量显示
				var commentNum = parseInt(this.commentWrap.find('span.num').text());
				this.commentWrap.find('span.num').text(commentNum + 1);
				this.commentLayer.find("input").val("");
			},
			//============前面添加0==========
			addZero:function(num){
				if (num < 10) {
					num = "0" + num;
				};
				return num;
			},
			//拍照功能
			takePicture:function(){
				var self = this,
					tag = tags = '#'+this.activityWrap.find('div.title').text()+'#',
					uid = this.userInfor.id,
					aid = parseInt($.getUrlVar('id'));
				//this.userInfor.isLogined == true ? takePhoto() : $.login("是否登录");
				this.userInfor.isLogined == true ? $.alert("请前去应用中下载梦族官方应用") : $.login("是否登录");
				function takePhoto(){
					TakePhoto.prototype.takePhoto(
		    			'time',
		    			function(res){
		    				var res = $.parseJSON(res);
		    				if (res.Result) {
		    					var parms={
		    						photo:res.Data.PHOTO,
		    						declare:res.Data.DECLARE,
		    						time:res.Data.TIME,
		    						pid:res.Data.PID,
		    						uid:res.Data.UID,
		    						commentNum:res.Data.COMMENT_COUNT,
		    						likeNum:res.Data.LIKE_COUNT,
		    						portrait:self.userInfor.portrait,
		    						name:self.userInfor.name,
		    					}
		    					var reurl=window.location.href;  
								var index = reurl.lastIndexOf('/') + 1;
								var Reurl = reurl.substring(index);
								Reurl=Reurl.replaceAll('?','||').replaceAll('=','__').replaceAll('&','#');

		    					var li="<li>\
											<div class='find-isuue-black'></div>\
											<div class='wrap'>\
												<a href='public_home.html?id="+parms.uid+"&reurl="+Reurl+"' class='author-pic'><img src='"+parms.portrait+"' width='50px'></a>\
												<div class='issue-wrap'>\
													<h2 class='author-name'>"+parms.name+"</h2>\
													<span class='issue-time'><span class='time'>"+parms.time+"</span></span>\
											</div>\
											<a href='viewPhptos.html?pid="+parms.pid+"&reurl="+Reurl+"' class='work'><img src='"+ImgDomain+parms.photo+"' width='100%' data-pid='"+parms.pid+"' data-type='pic'></a>\
											<p class='introduction'>"+tag+"</p>\
											<div class='love-comment-num'>\
												<a href='javascript:;' class='love-num fr' data-fn='love'><sup>"+parms.likeNum+"</sup></a>\
												<a href='viewPhptos.html?pid="+parms.pid+"&reurl="+Reurl+"' class='comment-num fr' data-fn='comment'><sup>"+parms.commentNum+"</sup></a>\
											</div>\
										</div>\
										<input type='hidden' value='"+parms.pid+"' id='pictureId'>\
									</li>";
		    					}
		    					function addPhoto(){
		    						var option = {
							            url:MoonduDomain+'/photo/addphoto',
							            data:{pid:parms.pid,dec:tag},
							            callback:function(res){
							            	if (res.Result) {
												self.$list.prepend(li);
				    							self.littelWrap.addClass("hidden");
				    							self.mask.addClass("hidden");
											}
							            }
							        }
							       $.md.ajaxurl(option);
		    					}
		    					
							function joinActivity(){
		    					var id = parseInt($.getUrlVar('id'));
						        var option={
						            url:MoonduDomain+'/MNews/SignUp',
						            data:{txtAID:id,txtImg_index:parms.photo,txtName:self.userInfor.name,txtPID:parseInt(parms.pid)},
						            callback:function(res){
						            	if (res.Result) {
						            		var count = parseInt(res.Data.ShwoCount);
						            		self.$joinWrap.find('span.join-num').text(count +'人');
										}
						            }
						        }
					       		$.md.ajaxurl(option);
		    				}
							addPhoto();//添加图片
							joinActivity();//参加活动
		    			},
		    			function(e){
		    				console.log(e);
		    			},
		    			 [{"key":"123","cuscode":uid,"scode":"789","hphoto":"0","upurl":MoonduDomain,hphoto:3,aid:aid}]
		    		);
				}
			},
			//从相册中选择照片
			choosePicFromPhoto:function(){
				var self = this,
					tag = '#'+this.activityWrap.find('div.title').text()+'#',
					uid = this.userInfor.id,
					aid = parseInt($.getUrlVar('id'));
				//this.userInfor.isLogined == false ? choosePic() : $.login("是否登录");
				this.userInfor.isLogined == true ? $.alert("请前去应用中下载梦族官方应用") : $.login("是否登录");
				function choosePic(){
					TakePhoto.prototype.takePhoto(
						'date',
						function(res){
							var res = $.parseJSON(res);
							if (res.Result) {
		    					var parms={
		    						photo:res.Data.PHOTO,
		    						declare:res.Data.DECLARE,
		    						time:res.Data.TIME,
		    						pid:res.Data.PID,
		    						uid:res.Data.UID,
		    						commentNum:res.Data.COMMENT_COUNT,
		    						likeNum:res.Data.LIKE_COUNT,
		    						portrait:self.userInfor.portrait,
		    						name:self.userInfor.name
		    					}
				    			var reurl=window.location.href;  
								var index = reurl.lastIndexOf('/') + 1;
								var Reurl = reurl.substring(index);
								Reurl=Reurl.replaceAll('?','||').replaceAll('=','__').replaceAll('&','#');
					
		    					var li="<li>\
											<div class='find-isuue-black'></div>\
											<div class='wrap'>\
												<a href='public_home.html?id="+parms.uid+"&reurl="+Reurl+"' class='author-pic'><img src='"+parms.portrait+"' width='50px'></a>\
												<div class='issue-wrap'>\
													<h2 class='author-name'>"+parms.name+"</h2>\
													<span class='issue-time'><span class='time'>"+parms.time+"</span></span>\
											</div>\
											<a href='viewPhptos.html?pid="+parms.pid+"&reurl="+Reurl+"' class='work'><img src='"+ImgDomain+parms.photo+"' width='100%' data-pid='"+parms.pid+"' data-type='pic'></a>\
											<p class='introduction'>"+tag+"</p>\
											<div class='love-comment-num'>\
												<a href='javascript:;' class='love-num fr' data-fn='love'><sup>"+parms.likeNum+"</sup></a>\
												<a href='viewPhptos.html?pid="+parms.pid+"&reurl="+Reurl+"' class='comment-num fr' data-fn='comment'><sup>"+parms.commentNum+"</sup></a>\
											</div>\
										</div>\
										<input type='hidden' value='"+parms.pid+"' id='pictureId'>\
									</li>";
		    					}
		    				function addPhoto(){
		    					var option={
						            url:MoonduDomain+'/photo/addphoto',
						            data:{pid:parms.pid,dec:tag},
						            callback:function(res){
						            	if (res.Result) {
											self.$list.prepend(li);
			    							self.littelWrap.addClass("hidden");
			    							self.mask.addClass("hidden");
										}
						            }
						        }
					       		$.md.ajaxurl(option);
		    				}
		    				function joinActivity(){
		    					var id = parseInt($.getUrlVar('id'));
		    					var option={
						            url:MoonduDomain+'/MNews/SignUp',
						            data:{txtAID:id,txtImg_index:parms.photo,txtName:self.userInfor.name,txtPID:parseInt(parms.pid)},
						            callback:function(res){
						            	if (res.Result) {
						            		var count = parseInt(res.Data.ShwoCount);
						            		self.$joinWrap.find('span.join-num').text(count +'人');
										}
						            }
						        }
					       		$.md.ajaxurl(option);
		    				}
							addPhoto();//添加图片
							joinActivity();//参加活动

						},
						function(e){
							console.log(e);
						},
						 [{"key":"123","cuscode":uid,"scode":"789","hphoto":"0","upurl":MoonduDomain,hphoto:3,aid:aid}]
						//key:安全验证，cuscode：用户ID，scode：也用在安全验证，hphoto：是否为头像，1：是头像，0一般照片
					);
				}
				function layerShow(){
					
				}
			},
			//悬浮框点赞
			suspensionBoxPraiseAjax:function(){
				var id = parseInt($.getUrlVar('id'));
				Activity.userInfor.isLogined == true ? praise() : $.login("是否登录");
				function praise(){
					Activity.suspensionBoxWrap.find('[data-type=like]').hasClass('like-praise') ? promptDialog('不能重复进行喜欢操作') : like();
				}
		        function praise(){
		        	var option={
			            url:MoonduDomain+'/MNews/MNewLike',
			            data:{newid:id,name:Activity.userInfor.name,page:1},
			            callback:function(res){
			            	if (res.Result) {
								Activity.boxPraise()
							}
			            }
		        	}
		        	$.md.ajaxurl(option);
		        }
			},
			//图片列表点赞
			photoListPraiseAjax:function(e){
				//如果已经是点赞状态，用户再次点赞，则提示用户已经点过赞
				var target = e.target,
					loveCount = $(target).parent().find("a[data-fn=love]").find("sup").text().match(/\d+/)[0],
					pitureId = parseInt($(target).parent().parent().find("img[data-type=pic]").attr("data-pid"));
				this.userInfor.isLogined == true ? praise() : $.login("是否登录");
				function praise(){
					$(target).hasClass('love-num-after') ? Activity.promptDialog('已经点过赞') : getState();
				}
				function getState(){
					var option={
				            url:MoonduDomain+'/photo/OptLike?pid='+pitureId,
				            data:{otype:0},
				            callback:function(res){
				            	if (res.Result) { 
									$(target).removeClass("love-num").addClass("love-num-after");
									loveCount ++;
									$(target).parent().find("a[data-fn=love]").find("sup").text(loveCount);
								};
				            }
				        }
				    $.md.ajaxurl(option);
				}
			},
			//提示框
			promptDialog:function(msg){
				layer.open({
			          content: msg,
			          btn: ['OK']
			      });
			},
			//列表页面刚渲染时的点赞状态
			isPraiseAjax:function(){
				var self = this,
					item = this.$list.find('li'),
					pidArr = [];
				for (var i = 0; i < item.length; i++) {
					pidArr.push($(item[i]).attr('data-pid'))
				};
				var pid = pidArr.join(',');
				if (!this.userInfor.isLogined) return;
				praise();
				function praise(){
					var option={
			            url:MoonduDomain+'/photo/GetLikedPhoto',
			            data:{pid:pid},
			            callback:function(res){
			            	if (res.Result) {
								//通过返回的pid找到dom节点
								for (var i = 0; i < res.Data.length; i++) {
									var picId = res.Data[i].Pid;
									self.$list.find("li[data-pid="+picId+"]").find('a[data-fn=love]').removeClass('love-num').addClass('love-num-after');
								}
							}
			            }
			        }
			       	$.md.ajaxurl(option);
				}
			},
			//==========获取评论============
			getActivityCommentAjax:function(page){
				var self = this;
				var activityId = $.getUrlVar('id');
		       	var option={
		            url:MoonduDomain+'/MNewsB/CommList',
		            data:{action:'list_news',newid:activityId,pageindex:page,pagesize:20},
		            callback:function(res){
		            	if (res.Result) {
		            		if (res.Data.Rows.length > 0) {
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
			//获取图片列表
			activityPhotoListAjax:function(page){
				var self = this,activityId = $.getUrlVar('id');
				var option = {
		            url:MoonduDomain+'/MNewsB/NewPhotoLs',
		            data:{newid:activityId,pageindex:page},
		            callback:function(res){
		            	if (res.Result) {
		            		if (res.Data.Rows.length > 0) {
		            			self.personJoinActivityRender(res.Data.Rows);  //图片列表渲染
		            			self.callAjax = true
		            		}else{
		            			self.page = -1;
		            		}
						}
		            }
		        }
		       	$.md.ajaxurl(option);
			},
			//========判断评论列表发表评论是否成功====
			isCommentSuccessAjax:function(){
				var self = this;
				var parms = {
					content:this.commentLayer.find('input').val(),
					activityId:parseInt($("#postID").val())
				}
				this.userInfor.isLogined == true ?　comment() : $.login("是否登录");
				function comment(){
					$.trim(parms.content) == '' ? this.promptDialog('亲，你还没有输入内容哦！') : success();
				}
				function success(){
					var option = {
			            url:MoonduDomain+'/MNews/CommPost',
			            data:{newid:parms.activityId,content:parms.content},
			            callback:function(res){
			            	if (res.Result) {
			            		self.addComment(parms.content);
							}
			            }
		        	}
		       		$.md.ajaxurl(option);
				}
			},
			//判断当前活动是否已经点赞
			isCurrentActivityLike:function(id,boolean){
				var self = this,activityId = $.getUrlVar('id'),flag = boolean;
				flag == true ? praise() : this.suspensionBoxWrap.find('a[data-type=like]').addClass('like').removeClass('like-praise');
				function praise(){
					var option = {
			            url:MoonduDomain+'/MNewsB/IsLike',
			            data:{newids:id},
			            callback:function(res){
			            	if (res.Result) {
			            		if (parseInt(res.Data[0]) == activityId) {
			            			self.suspensionBoxWrap.find('a[data-type=like]').removeClass('like').addClass('like-praise');
			            		}else{
			            			self.suspensionBoxWrap.find('a[data-type=like]').addClass('like').removeClass('like-praise');
			            		}
							}
			            }
			        }
			       	$.md.ajaxurl(option);
				}
			},
			//=======获取活动信息======
			getActivityAjax:function(id){
				var self = this;
		       	var option={
		            url:MoonduDomain+'/MNewsB/NewDetail',
		            data:{newid:id},
		            callback:function(res){
		            	if (res.Result) {
		            		//判断是活动还是资讯 1-活动  2-资讯
		            		CurrentType.detailType = parseInt(res.Data.Type);
							self.activityInformationRener(res.Data); //活动详情渲染
							self.currentActivityID = res.Data.Id;  //当前活动ID
						};
		            }
		        }
		       	$.md.ajaxurl(option);
			},
			//参加活动获取M豆
			getBeansByJoinActivityAjax:function(){
				var self = this,uid = this.userInfor.id,activityid = $("#postID").val();
				this.userInfor.isLogined == true ? getBeans() : $.login("是否登录");
				function getBeans(){
					var option = {
			            url:MoonduDomain+'/Integral/GetActivity',
			            data:{uid:uid,activityid:activityid},
			            callback:function(res){
			            	if (res.Result) {
								//location.href = "declare.html";
							};
			            }
			        }
		       		$.md.ajaxurl(option);
				}
			}
		}
		//照片落地页
		var View={

			init:function(){
				var self = this;
				this.$top = $("#top");
				this.wrap=$("#photoMessage");
				this.userMsg=$("#userMessage");
				this.publishField = $("#releaseCommentPanel");
				this.commentPage = $("#comment-page");
				this.praiseWarp = $("#praise");
				this.userInfor = {};//存储当前用户的信息
				this.userInfor.isLogined = false;
				this.page = 1;
				this.cpage = 1;
				this.commentCallAjax = true; //是否接受ajax请求
				this.currentActivity = [];  //当前活动
				this.commentList = [];  //当前活动评论列表
				this.praiseList = []; //点赞列表
				this.eJson = {
					"miantian":"[腼腆]",
					"dai":"[呆]",
					"danyan":"[单眼]",
					"gaoxing":"[高兴]",
					"haixiu":"[害羞]",
					"heng":"[哼]",
					"kaixin":"[开心]",
					"keai":"[可爱]",
					"lengmo":"[冷漠]",
					"nanguo":"[难过]",
					"qinqin":"[亲亲]",
					"shengqi":"[生气]",
					"tiaopi":"[调皮]",
					"xinwei":"[欣慰]",
					"yun":"[晕]"
				};
				this.imgJson = {
					'[腼腆]':'<span alt="miantian" class="ecom e_miantian"></span>',
					'[呆]':'<span alt="dai" class="ecom e_dai"></span>',
					'[单眼]':'<span alt="danyan" class="ecom e_danyan"></span>',
					'[高兴]':'<span alt="gaoxing" class="ecom e_gaoxing"></span>',
					'[害羞]':'<span alt="haixiu" class="ecom e_haixiu"></span>',
					'[哼]':'<span alt="heng" class="ecom e_heng"></span>',
					'[开心]':'<span alt="kaixin" class="ecom e_kaixin"></span>',
					'[可爱]':'<span alt="keai" class="ecom e_keai"></span>',
					'[冷漠]':'<span alt="lengmo" class="ecom e_lengmo"></span>',
					'[难过]':'<span alt="nanguo" class="ecom e_nanguo"></span>',
					'[亲亲]':'<span alt="qinqin" class="ecom e_qinqin"></span>',
					'[生气]':'<span alt="shengqi" class="ecom e_shengqi"></span>',
					'[调皮]':'<span alt="tiaopi" class="ecom e_tiaopi"></span>',
					'[欣慰]':'<span alt="xinwei" class="ecom e_xinwei"></span>',
					'[晕]':'<span alt="yun" class="ecom e_yun"></span>'
				};//存储图片表情
				//弹出层
				this.layer = $(MZConfig.layer);
				this.publishField.after(this.layer);

				this.ensureBtn=this.layer.find("a.ensure");
				this.cancelBtn=this.layer.find("a.cancel");

				this._getCurrentUserInforAjax();
				this._bindEvent();
			},
			_bindEvent:function(){
				var self=this;
				this.commentAjaxManager(self.cpage);
				//滚动到底部，评论数据加载
				$(window).scroll(function(){
			        if ($(document).scrollTop() + $(window).height() + 20 >= $(document).height()){
			         	if (self.cpage == -1) return;
			         	self.cpage ++;
			         	if (self.cpage > 1) {
			          		if (!self.commentCallAjax) return;
			                 self.commentCallAjax = false;
			                 self.commentAjaxManager(self.cpage);
			         	}
			        }
			     })
				this.getPhotoDetailAjax();
				window.onload = function(){
					self.getDeliverPraiseAjax();
				}
				//发表评论
				this.publishField.find("a.publish").bind("click",self.deliverCommentAjax.bind(this));
				//点赞
				this.publishField.on("click","a.love",self.tooltipPraiseAjax);
				//分享下载链接
				$("#activity_share_link").find("a").bind("click",self.shareUserInformationAjax.bind(this));
				//返回上一个页面
				this.$top.find('a.arrow').bind('click',function(){
					str2=$.getUrlVar('reurl');
					str2 = str2.replaceAll('||','?').replaceAll(':','=').replaceAll('#','&');
					window.location.href = str2;
				});
				//分享
				this.$top.find('a.share').bind('click',self.shareWebsiteLink.bind(this));

				//判断是不是已经点过赞，如果已经点过赞，则提示用户已经点过赞
				this.publishField.on('click','a[data-type=love]',function(){
					if ($(this).hasClass('love-after')) {
						layer.open({
						    content: '已经点过赞',
						    btn: ['OK']
						});
					}
				});
				//返回上个页面
				this.$top.on("click","a.arrow",function(){
					var	str = $.getUrlVar('reurl');
					str = str.replaceAll('||','?').replaceAll('__','=').replaceAll('#','&');		
					window.location.href = str;
				});
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
			      			self.userInfor.commentFlag = res.Result;
			      			self.userInfor.isLogined = true;
			      			//悬浮框点赞状态,先判断是否有用户登录
							self.tooltipPraiseStateAjax(self.userInfor.isLogined);
			      			//判断头像是否为空，若是为空，显示默认头像
			      			if (self.userInfor.portrait == 'http://zoneimages.moonbasa.com/images/user.jpg' || self.userInfor.portrait == '' || self.userInfor.portrait == null || self.userInfor.portrait == undefined) {
						      		self.userInfor.portrait = 'images/user.jpg';
						      }
			    		};
			    	}
			 	}
				$.md.ajaxurl(option);
				
			},
			//==========点赞=========
			praise:function(){
				var reurl=window.location.href;  
	            var index = reurl.lastIndexOf('/') + 1;				
	            var Reurl = reurl.substring(index);
	            Reurl=Reurl.replaceAll('?','||').replaceAll('=','__').replaceAll('&','#');
				var xcount = parseInt(View.praiseWarp.find("span.num").text().match(/\d+/)[0]);
				if (View.userInfor.portrait == undefined || View.userInfor.portrait == '' || View.userInfor.portrait == null) {
					var li ="<li class='fl'data-userid='"+View.userInfor.id+"'>\
							<a href='public_home.html?id="+View.userInfor.id+"&reurl="+Reurl+"'>\
								<img src='images/user.jpg' width='80%'>\
							</a>\
						</li>"
				}else{
					var li ="<li class='fl'data-userid='"+View.userInfor.id+"'>\
							<a href='public_home.html?id="+View.userInfor.id+"&reurl="+Reurl+"'>\
								<img src='"+View.userInfor.portrait+"' width='80%'>\
							</a>\
						</li>"
				}
				var liLen = View.praiseWarp.find('ul').find('li').size()*View.praiseWarp.find('ul').find('li').first().width();
				var ulLen = View.praiseWarp.find('ul').width();
				if (liLen > ulLen) {
					View.praiseWarp.find('li').filter('.ellipsis').prev().prev().addClass('hidden');
				};
				View.praiseWarp.find("ul").prepend(li);
				View.publishField.find("a.love").removeClass("love").addClass("love-after");
				xcount ++;
				View.praiseWarp.find("span.num").text(xcount);
			},
			//============取消赞=========
			cancelPraise:function(){
				var xcount = parseInt(View.praiseWarp.find("span.num").text().match(/\d+/)[0]);
				View.publishField.find("a.love-after").removeClass("love-after").addClass("love");
				xcount --;
				View.praiseWarp.find("span.num").text(xcount);
			},
			//点赞的用户过多则出现省略号
			praiseEllipsis:function(){
				var self = this,
					xcount=this.praiseWarp.find("li").size(),
					postID = parseInt(this.wrap.find("input[type=hidden]").val());
				this.praiseWarp.find("span.num").text(xcount);
				//如果用户太多，则用省略号表示，点击省略号可跳转页面
				var xSize=this.praiseWarp.find("li").size(), //总个数
					xli = $("<li class='ellipsis fl'><a href='javascript:;'>...</a></li>"),//创建带有省略号的li
					xWidth = parseInt(this.praiseWarp.find("li").not(".ellipsis").width()) + parseInt(this.praiseWarp.find("li").css("marginRight")), //每个的长度+margin值
					xcount = Math.floor(parseInt(this.praiseWarp.find("ul").width())/xWidth);//一行可容纳多少个li
				if (xSize*xWidth > parseInt(this.wrap.find("ul").width())) {
					$("#praise ul li:gt(" + (xcount-2) + ")").addClass("hidden");
					//第xcount-1个后面插入带省略号的li
					this.praiseWarp.find("li").eq(xcount-1).after(xli);
				}
			},
			messageRender:function(data){
				var self=this,
					html = "",
					d = new Date(),
					authorTemp = document.getElementById("authorTemp").innerHTML,
					temp = new EJS({"text": authorTemp});
				this.title = data.Declare;
				this.content = data.Photo;
				this.pid = data.Pid;
				html = temp.render(data);
				this.currentActivity.push(data);
				this.wrap.html(html);
				//初始状态点赞的数量为li的总数，往后每添加一条评论，长度增加1
				var praiseCount=this.wrap.find("ul").find("li").size();
				this.wrap.find(".zan").find("span.num").text(praiseCount);

				//删除功能
				this.wrap.find("a.delete").bind("click",self.dialogShow.bind(this));
				//如果图片不存在，就隐藏删除按钮
				if (this.wrap.find(".message-content").find("img").attr("src") == "") {
					this.wrap.find(".message-content").find("a.delete").addClass("hidden");
				};
				//判断是否是当前登录人发表的图片，如果是，则显示删除按钮；否则，隐藏删除按钮
				var isDelete = this.wrap.find('.message-content').attr('data-isDelete');
				if (data.IsLoginer) {
					if (isDelete == 0 || isDelete == 1) {
						this.wrap.find('a.delete').removeClass('hidden')
					};
					if (isDelete == 2 || isDelete == 3) {
						this.wrap.find('a.delete').addClass('hidden');
					}
				}else{
					this.wrap.find('a.delete').addClass('hidden');
				}
				//评论数量显示
				var commentNum = data.Comment_Count;
				commentNum == 0 ? commentNum = 0 : commentNum;
				this.commentPage.find('span.num').text(commentNum);
			},
			//分享当前页面的链接
			shareWebsiteLink:function(){
				var self = this,pid = $.getUrlVar('pid');
				TakePhoto.prototype.takePhoto(
        			'share',
        			function(r){
        				
        			},
        			function(e){console.log(e);},
        		[{"sharetitle":self.title,"sharecontent":self.title,"shareurl":MZoneDomain+"T_viewPhptos.html?pid="+pid+""}]);
			},
			dialogShow:function(e){
				var target = e.target;
				var self = this;
				this.layer.removeClass("hidden");
				//判断是否删除
				this.layer.find("a.ensure").bind("click",self.deleteMyDreamPhotoAjax.bind($(target)));
				this.layer.find("a.cancel").bind("click",function(){
					self.layer.addClass("hidden");
				});
			},
			shareLink:function(){
				var self = this;
				var u = navigator.userAgent;
				//安卓手机
				if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
					 window.location.href = "http://www.moonbasa.com/";
				//苹果手机
				} 
				else if (u.indexOf('iPhone') > -1) {
					window.location.href = "http://www.zoon.moonbasa.com/";
				} 
				//winphone手机
				else if (u.indexOf('Windows Phone') > -1) {
					//$.alert("winphone手机");
					 //window.location.href = "http://www.zoon.moonbasa.com/";
				}
			},
			//=======前面添加0====
			addZero:function(num){
				if (num < 10) {
					num = "0" + num;
				};
				return num;
			},
			//==========添加评论==============
			addComment:function(content){
				var self=this,
					reurl=window.location.href,  
		        	index = reurl.lastIndexOf('/') + 1,
		        	Reurl = reurl.substring(index);
		        Reurl=Reurl.replaceAll('?','||').replaceAll('=','__').replaceAll('&','#');
				var parms={
					time:self.addZero(new Date().getHours()) +":"+self.addZero(new Date().getMinutes()),
					day:new Date().getFullYear() +"年" + self.addZero(new Date().getMonth() + 1) + "月"+self.addZero(new Date().getDate())+"日",
				}
				var oli="<li>\
						<a href='public_home.html?id="+self.userInfor.id+"&reurl="+Reurl+"' class='left-item fl'>\
							<img class='user-icon fl' src="+this.userInfor.portrait+">\
						</a>\
						<span class='user'>"+this.userInfor.name+"</span>\
						<span class='issue-time'>  " + parms.day + "<span class='time'>  " + parms.time + "</span></span>\
						<span class='replay'><span class='content'> " + content + "</span></span>\
					</li>";
				this.commentPage.find("ul").prepend(oli);
				//点击添加之后评论数量显示
				var commentNum = this.commentPage.find("ul").find("li").length;
				this.commentPage.find(".find-message").find("span.num").text(commentNum);

				this.publishField.find("input").val("");
				this.commentPage.find('ul').find("textarea").val("");
			},
			photoPraiseRender:function(data){
				var self = this,
					html = "",
					photoPraiseTemp = document.getElementById("photoPraiseTemp"),
					temp = new EJS({"text": photoPraiseTemp});
				for (var i = 0; i < data.length; i++) {
					html += temp.render(data[i]);
					this.praiseList.push(data[i]);
				}
				this.praiseWarp.find("ul").html(html);
				this.praiseWarp.find("span.num").text(this.praiseWarp.find("ul").find("li").size());
				//省略号
				this.praiseEllipsis();
			},
			promptDialog:function(msg){
				layer.open({
			          content: msg,
			          btn: ['OK']
			      });
			},
			//==========评论模块渲染=======
			commentRender:function(data){
				var self=this,
					html="",
					commentTemp=document.getElementById("userCommentTemp"),
					temp = new EJS({"text": commentTemp});
				// for (var i = 0; i < data.length; i++) {
				// 	html += temp.render(data[i]);
				// 	this.commentList.push(data[i]);
				// };


				for (var i = 0; i < data.length; i++) {
					var patt = /\\ud83d\\ude04|\\ud83d\\ude03|\\ud83d\\ude00|\\ud83d\\ude0a|\\u263a\\ufe0f|\\ud83d\\ude09|\\ud83d\\ude0d|\\ud83d\\ude18|\\ud83d\\ude1a|\\ud83d\\ude17|\\ud83d\\ude19|\\ud83d\\ude1c|\\ud83d\\ude1d|\\ud83d\\ude1b|\\ud83d\\ude33|\\ud83d\\ude01|\\ud83d\\ude14|\\ud83d\\ude0c|\\ud83d\\ude12|\\ud83d\\ude1e|\\ud83d\\ude23|\\ud83d\\ude22|\\ud83d\\ude02|\\ud83d\\ude2d|\\ud83d\\ude2a|\\ud83d\\ude25|\\ud83d\\ude30|\\ud83d\\ude05|\\ud83d\\ude13|\\ud83d\\ude29|\\ud83d\\ude2b|\\ud83d\\ude28|\\ud83d\\ude31|\\ud83d\\ude20|\\ud83d\\ude21|\\ud83d\\ude24|\\ud83d\\ude16|\\ud83d\\ude06|\\ud83d\\ude0b|\\ud83d\\ude37|\\ud83d\\ude0e|\\ud83d\\ude34|\\ud83d\\ude35|\\ud83d\\ude32|\\ud83d\\ude1f|\\ud83d\\ude26|\\ud83d\\ude27|\\ud83d\\ude08|\\ud83d\\udc7f|\\ud83d\\ude2e|\\ud83d\\ude2c|\\ud83d\\ude10|\\ud83d\\ude15|\\ud83d\\ude2f|\\ud83d\\ude36|\\ud83d\\ude07|\\ud83d\\ude0f|\\ud83d\\ude11|\\ud83d\\udc72|\\ud83d\\udc73|\\ud83d\\udc6e|\\ud83d\\udc77|\\ud83d\\udc82|\\ud83d\\udc76|\\ud83d\\udc66|\\ud83d\\udc67|\\ud83d\\udc68|\\ud83d\\udc69|\\ud83d\\udc74|\\ud83d\\udc75|\\ud83d\\udc71|\\ud83d\\udc7c|\\ud83d\\udc78|\\ud83d\\ude3a|\\ud83d\\ude38|\\ud83d\\ude3b|\\ud83d\\ude3d|\\ud83d\\ude3c|\\ud83d\\ude40|\\ud83d\\ude3f|\\ud83d\\ude39|\\ud83d\\ude3e|\\ud83d\\udc79|\\ud83d\\udc7a|\\ud83d\\ude48|\\ud83d\\ude49|\\ud83d\\ude4a|\\ud83d\\udc80|\\ud83d\\udc7d|\\ud83d\\udca9|\\ud83d\\udd25|\\u2728|\\ud83c\\udf1f|\\ud83d\\udcab|\\ud83d\\udca5|\\ud83d\\udca2|\\ud83d\\udca6|\\ud83d\\udca7|\\ud83d\\udca4|\\ud83d\\udca8|\\ud83d\\udc42|\\ud83d\\udc40|\\ud83d\\udc43|\\ud83d\\udc45|\\ud83d\\udc44|\\ud83d\\udc4d|\\ud83d\\udc4e|\\ud83d\\udc4c|\\ud83d\\udc4a|\\u270a|\\u270c\\ufe0f|\\ud83d\\udc4b|\\u270b|\\ud83d\\udc50|\\ud83d\\udc46|\\ud83d\\udc47|\\ud83d\\udc49|\\ud83d\\udc48|\\ud83d\\ude4c|\\ud83d\\ude4f|\\u261d\\ufe0f|\\ud83d\\udc4f|\\ud83d\\udcaa|\\ud83d\\udeb6|\\ud83c\\udfc3|\\ud83d\\udc83|\\ud83d\\udc6b|\\ud83d\\udc6a|\\ud83d\\udc6c|\\ud83d\\udc6d|\\ud83d\\udc8f|\\ud83d\\udc91|\\ud83d\\udc6f|\\ud83d\\ude46|\\ud83d\\ude45|\\ud83d\\udc81|\\ud83d\\ude4b|\\ud83d\\udc86|\\ud83d\\udc87|\\ud83d\\udc85|\\ud83d\\udc70|\\ud83d\\ude4e|\\ud83d\\ude4d|\\ud83d\\ude47|\\ud83c\\udfa9|\\ud83d\\udc51|\\ud83d\\udc52|\\ud83d\\udc5f|\\ud83d\\udc5e|\\ud83d\\udc61|\\ud83d\\udc60|\\ud83d\\udc62|\\ud83d\\udc55|\\ud83d\\udc54|\\ud83d\\udc5a|\\ud83d\\udc57|\\ud83c\\udfbd|\\ud83d\\udc56|\\ud83d\\udc58|\\ud83d\\udc59|\\ud83d\\udcbc|\\ud83d\\udc5c|\\ud83d\\udc5d|\\ud83d\\udc5b|\\ud83d\\udc53|\\ud83c\\udf80|\\ud83c\\udf02|\\ud83d\\udc84|\\ud83d\\udc9b|\\ud83d\\udc99|\\ud83d\\udc9c|\\ud83d\\udc9a|\\u2764\\ufe0f|\\ud83d\\udc94|\\ud83d\\udc97|\\ud83d\\udc93|\\ud83d\\udc95|\\ud83d\\udc96|\\ud83d\\udc9e|\\ud83d\\udc98|\\ud83d\\udc8c|\\ud83d\\udc8b|\\ud83d\\udc8d|\\ud83d\\udc8e|\\ud83d\\udc64|\\ud83d\\udc65|\\ud83d\\udcac|\\ud83d\\udc63|\\ud83d\\udcad|\\ud83d\\udc36|\\ud83d\\udc3a|\\ud83d\\udc31|\\ud83d\\udc2d|\\ud83d\\udc39|\\ud83d\\udc30|\\ud83d\\udc38|\\ud83d\\udc2f|\\ud83d\\udc28|\\ud83d\\udc3b|\\ud83d\\udc37|\\ud83d\\udc3d|\\ud83d\\udc2e|\\ud83d\\udc17|\\ud83d\\udc35|\\ud83d\\udc12|\\ud83d\\udc34|\\ud83d\\udc11|\\ud83d\\udc18|\\ud83d\\udc3c|\\ud83d\\udc27|\\ud83d\\udc26|\\ud83d\\udc24|\\ud83d\\udc25|\\ud83d\\udc23|\\ud83d\\udc14|\\ud83d\\udc0d|\\ud83d\\udc22|\\ud83d\\udc1b|\\ud83d\\udc1d|\\ud83d\\udc1c|\\ud83d\\udc1e|\\ud83d\\udc0c|\\ud83d\\udc19|\\ud83d\\udc1a|\\ud83d\\udc20|\\ud83d\\udc1f|\\ud83d\\udc2c|\\ud83d\\udc33|\\ud83d\\udc0b|\\ud83d\\udc04|\\ud83d\\udc0f|\\ud83d\\udc00|\\ud83d\\udc03|\\ud83d\\udc05|\\ud83d\\udc07|\\ud83d\\udc09|\\ud83d\\udc0e|\\ud83d\\udc10|\\ud83d\\udc13|\\ud83d\\udc15|\\ud83d\\udc16|\\ud83d\\udc01|\\ud83d\\udc02|\\ud83d\\udc32|\\ud83d\\udc21|\\ud83d\\udc0a|\\ud83d\\udc2b|\\ud83d\\udc2a|\\ud83d\\udc06|\\ud83d\\udc08|\\ud83d\\udc29|\\ud83d\\udc3e|\\ud83d\\udc90|\\ud83c\\udf38|\\ud83c\\udf37|\\ud83c\\udf40|\\ud83c\\udf39|\\ud83c\\udf3b|\\ud83c\\udf3a|\\ud83c\\udf41|\\ud83c\\udf43|\\ud83c\\udf42|\\ud83c\\udf3f|\\ud83c\\udf3e|\\ud83c\\udf44|\\ud83c\\udf35|\\ud83c\\udf34|\\ud83c\\udf32|\\ud83c\\udf33|\\ud83c\\udf30|\\ud83c\\udf31|\\ud83c\\udf3c|\\ud83c\\udf10|\\ud83c\\udf1e|\\ud83c\\udf1d|\\ud83c\\udf1a|\\ud83c\\udf11|\\ud83c\\udf12|\\ud83c\\udf13|\\ud83c\\udf14|\\ud83c\\udf15|\\ud83c\\udf16|\\ud83c\\udf17|\\ud83c\\udf18|\\ud83c\\udf1c|\\ud83c\\udf1b|\\ud83c\\udf19|\\ud83c\\udf0d|\\ud83c\\udf0e|\\ud83c\\udf0f|\\ud83c\\udf0b|\\ud83c\\udf0c|\\ud83c\\udf20|\\u2b50\\ufe0f|\\u2600\\ufe0f|\\u26c5\\ufe0f|\\u2601\\ufe0f|\\u26a1\\ufe0f|\\u2614\\ufe0f|\\u2744\\ufe0f|\\u26c4\\ufe0f|\\ud83c\\udf00|\\ud83c\\udf01|\\ud83c\\udf08|\\ud83c\\udf0a|\\ud83c\\udf8d|\\ud83d\\udc9d|\\ud83c\\udf8e|\\ud83c\\udf92|\\ud83c\\udf93|\\ud83c\\udf8f|\\ud83c\\udf86|\\ud83c\\udf87|\\ud83c\\udf90|\\ud83c\\udf91|\\ud83c\\udf83|\\ud83d\\udc7b|\\ud83c\\udf85|\\ud83c\\udf84|\\ud83c\\udf81|\\ud83c\\udf8b|\\ud83c\\udf89|\\ud83c\\udf8a|\\ud83c\\udf88|\\ud83c\\udf8c|\\ud83d\\udd2e|\\ud83c\\udfa5|\\ud83d\\udcf7|\\ud83d\\udcf9|\\ud83d\\udcfc|\\ud83d\\udcbf|\\ud83d\\udcc0|\\ud83d\\udcbd|\\ud83d\\udcbe|\\ud83d\\udcbb|\\ud83d\\udcf1|\\u260e\\ufe0f|\\ud83d\\udcde|\\ud83d\\udcdf|\\ud83d\\udce0|\\ud83d\\udce1|\\ud83d\\udcfa|\\ud83d\\udcfb|\\ud83d\\udd0a|\\ud83d\\udd09|\\ud83d\\udd08|\\ud83d\\udd07|\\ud83d\\udd14|\\ud83d\\udd15|\\ud83d\\udce2|\\ud83d\\udce3|\\u23f3|\\u231b\\ufe0f|\\u23f0|\\u231a\\ufe0f|\\ud83d\\udd13|\\ud83d\\udd12|\\ud83d\\udd0f|\\ud83d\\udd10|\\ud83d\\udd11|\\ud83d\\udd0e|\\ud83d\\udca1|\\ud83d\\udd26|\\ud83d\\udd06|\\ud83d\\udd05|\\ud83d\\udd0c|\\ud83d\\udd0b|\\ud83d\\udd0d|\\ud83d\\udec1|\\ud83d\\udec0|\\ud83d\\udebf|\\ud83d\\udebd|\\ud83d\\udd27|\\ud83d\\udd29|\\ud83d\\udd28|\\ud83d\\udeaa|\\ud83d\\udeac|\\ud83d\\udca3|\\ud83d\\udd2b|\\ud83d\\udd2a|\\ud83d\\udc8a|\\ud83d\\udc89|\\ud83d\\udcb0|\\ud83d\\udcb4|\\ud83d\\udcb5|\\ud83d\\udcb7|\\ud83d\\udcb6|\\ud83d\\udcb3|\\ud83d\\udcb8|\\ud83d\\udcf2|\\ud83d\\udce7|\\ud83d\\udce5|\\ud83d\\udce4|\\u2709\\ufe0f|\\ud83d\\udce9|\\ud83d\\udce8|\\ud83d\\udcef|\\ud83d\\udceb|\\ud83d\\udcea|\\ud83d\\udcec|\\ud83d\\udced|\\ud83d\\udcee|\\ud83d\\udce6|\\ud83d\\udcdd|\\ud83d\\udcc4|\\ud83d\\udcc3|\\ud83d\\udcd1|\\ud83d\\udcca|\\ud83d\\udcc8|\\ud83d\\udcc9|\\ud83d\\udcdc|\\ud83d\\udccb|\\ud83d\\udcc5|\\ud83d\\udcc6|\\ud83d\\udcc7|\\ud83d\\udcc1|\\ud83d\\udcc2|\\u2702\\ufe0f|\\ud83d\\udccc|\\ud83d\\udcce|\\u2712\\ufe0f|\\u270f\\ufe0f|\\ud83d\\udccf|\\ud83d\\udcd0|\\ud83d\\udcd5|\\ud83d\\udcd7|\\ud83d\\udcd8|\\ud83d\\udcd9|\\ud83d\\udcd3|\\ud83d\\udcd4|\\ud83d\\udcd2|\\ud83d\\udcda|\\ud83d\\udcd6|\\ud83d\\udd16|\\ud83d\\udcdb|\\ud83d\\udd2c|\\ud83d\\udd2d|\\ud83d\\udcf0|\\ud83c\\udfa8|\\ud83c\\udfac|\\ud83c\\udfa4|\\ud83c\\udfa7|\\ud83c\\udfbc|\\ud83c\\udfb5|\\ud83c\\udfb6|\\ud83c\\udfb9|\\ud83c\\udfbb|\\ud83c\\udfba|\\ud83c\\udfb7|\\ud83c\\udfb8|\\ud83d\\udc7e|\\ud83c\\udfae|\\ud83c\\udccf|\\ud83c\\udfb4|\\ud83c\\udc04\\ufe0f|\\ud83c\\udfb2|\\ud83c\\udfaf|\\ud83c\\udfc8|\\ud83c\\udfc0|\\u26bd\\ufe0f|\\u26be\\ufe0f|\\ud83c\\udfbe|\\ud83c\\udfb1|\\ud83c\\udfc9|\\ud83c\\udfb3|\\u26f3\\ufe0f|\\ud83d\\udeb5|\\ud83d\\udeb4|\\ud83c\\udfc1|\\ud83c\\udfc7|\\ud83c\\udfc6|\\ud83c\\udfbf|\\ud83c\\udfc2|\\ud83c\\udfca|\\ud83c\\udfc4|\\ud83c\\udfa3|\\u2615\\ufe0f|\\ud83c\\udf75|\\ud83c\\udf76|\\ud83c\\udf7c|\\ud83c\\udf7a|\\ud83c\\udf7b|\\ud83c\\udf78|\\ud83c\\udf79|\\ud83c\\udf77|\\ud83c\\udf74|\\ud83c\\udf55|\\ud83c\\udf54|\\ud83c\\udf5f|\\ud83c\\udf57|\\ud83c\\udf56|\\ud83c\\udf5d|\\ud83c\\udf5b|\\ud83c\\udf64|\\ud83c\\udf71|\\ud83c\\udf63|\\ud83c\\udf65|\\ud83c\\udf59|\\ud83c\\udf58|\\ud83c\\udf5a|\\ud83c\\udf5c|\\ud83c\\udf72|\\ud83c\\udf62|\\ud83c\\udf61|\\ud83c\\udf73|\\ud83c\\udf5e|\\ud83c\\udf69|\\ud83c\\udf6e|\\ud83c\\udf66|\\ud83c\\udf68|\\ud83c\\udf67|\\ud83c\\udf82|\\ud83c\\udf70|\\ud83c\\udf6a|\\ud83c\\udf6b|\\ud83c\\udf6c|\\ud83c\\udf6d|\\ud83c\\udf6f|\\ud83c\\udf4e|\\ud83c\\udf4f|\\ud83c\\udf4a|\\ud83c\\udf4b|\\ud83c\\udf52|\\ud83c\\udf47|\\ud83c\\udf49|\\ud83c\\udf53|\\ud83c\\udf51|\\ud83c\\udf48|\\ud83c\\udf4c|\\ud83c\\udf50|\\ud83c\\udf4d|\\ud83c\\udf60|\\ud83c\\udf46|\\ud83c\\udf45|\\ud83c\\udf3d|\\ud83c\\udfe0|\\ud83c\\udfe1|\\ud83c\\udfeb|\\ud83c\\udfe2|\\ud83c\\udfe3|\\ud83c\\udfe5|\\ud83c\\udfe6|\\ud83c\\udfea|\\ud83c\\udfe9|\\ud83c\\udfe8|\\ud83d\\udc92|\\u26ea\\ufe0f|\\ud83c\\udfec|\\ud83c\\udfe4|\\ud83c\\udf07|\\ud83c\\udf06|\\ud83c\\udfef|\\ud83c\\udff0|\\u26fa\\ufe0f|\\ud83c\\udfed|\\ud83d\\uddfc|\\ud83d\\uddfe|\\ud83d\\uddfb|\\ud83c\\udf04|\\ud83c\\udf05|\\ud83c\\udf03|\\ud83d\\uddfd|\\ud83c\\udf09|\\ud83c\\udfa0|\\ud83c\\udfa1|\\u26f2\\ufe0f|\\ud83c\\udfa2|\\ud83d\\udea2|\\u26f5\\ufe0f|\\ud83d\\udea4|\\ud83d\\udea3|\\u2693\\ufe0f|\\ud83d\\ude80|\\u2708\\ufe0f|\\ud83d\\udcba|\\ud83d\\ude81|\\ud83d\\ude82|\\ud83d\\ude8a|\\ud83d\\ude89|\\ud83d\\ude9e|\\ud83d\\ude86|\\ud83d\\ude84|\\ud83d\\ude85|\\ud83d\\ude88|\\ud83d\\ude87|\\ud83d\\ude9d|\\ud83d\\ude8b|\\ud83d\\ude83|\\ud83d\\ude8e|\\ud83d\\ude8c|\\ud83d\\ude8d|\\ud83d\\ude99|\\ud83d\\ude98|\\ud83d\\ude97|\\ud83d\\ude95|\\ud83d\\ude96|\\ud83d\\ude9b|\\ud83d\\ude9a|\\ud83d\\udea8|\\ud83d\\ude93|\\ud83d\\ude94|\\ud83d\\ude92|\\ud83d\\ude91|\\ud83d\\ude90|\\ud83d\\udeb2|\\ud83d\\udea1|\\ud83d\\ude9f|\\ud83d\\udea0|\\ud83d\\ude9c|\\ud83d\\udc88|\\ud83d\\ude8f|\\ud83c\\udfab|\\ud83d\\udea6|\\ud83d\\udea5|\\u26a0\\ufe0f|\\ud83d\\udea7|\\ud83d\\udd30|\\u26fd\\ufe0f|\\ud83c\\udfee|\\ud83c\\udfb0|\\u2668\\ufe0f|\\ud83d\\uddff|\\ud83c\\udfaa|\\ud83c\\udfad|\\ud83d\\udccd|\\ud83d\\udea9|\\ud83c\\uddef\\ud83c\\uddf5|\\ud83c\\uddf0\\ud83c\\uddf7|\\ud83c\\udde9\\ud83c\\uddea|\\ud83c\\udde8\\ud83c\\uddf3|\\ud83c\\uddfa\\ud83c\\uddf8|\\ud83c\\uddeb\\ud83c\\uddf7|\\ud83c\\uddea\\ud83c\\uddf8|\\ud83c\\uddee\\ud83c\\uddf9|\\ud83c\\uddf7\\ud83c\\uddfa|\\ud83c\\uddec\\ud83c\\udde7|\\u0031\\ufe0f\\u20e3|\\u0032\\ufe0f\\u20e3|\\u0033\\ufe0f\\u20e3|\\u0034\\ufe0f\\u20e3|\\u0035\\ufe0f\\u20e3|\\u0036\\ufe0f\\u20e3|\\u0037\\ufe0f\\u20e3|\\u0038\\ufe0f\\u20e3|\\u0039\\ufe0f\\u20e3|\\u0030\\ufe0f\\u20e3|\\ud83d\\udd1f|\\ud83d\\udd22|\\u0023\\ufe0f\\u20e3|\\ud83d\\udd23|\\u2b06\\ufe0f|\\u2b07\\ufe0f|\\u2b05\\ufe0f|\\u27a1\\ufe0f|\\ud83d\\udd20|\\ud83d\\udd21|\\ud83d\\udd24|\\u2197\\ufe0f|\\u2196\\ufe0f|\\u2198\\ufe0f|\\u2199\\ufe0f|\\u2194\\ufe0f|\\u2195\\ufe0f|\\ud83d\\udd04|\\u25c0\\ufe0f|\\u25b6\\ufe0f|\\ud83d\\udd3c|\\ud83d\\udd3d|\\u21a9\\ufe0f|\\u21aa\\ufe0f|\\u2139\\ufe0f|\\u23ea|\\u23e9|\\u23eb|\\u23ec|\\u2935\\ufe0f|\\u2934\\ufe0f|\\ud83c\\udd97|\\ud83d\\udd00|\\ud83d\\udd01|\\ud83d\\udd02|\\ud83c\\udd95|\\ud83c\\udd99|\\ud83c\\udd92|\\ud83c\\udd93|\\ud83c\\udd96|\\ud83d\\udcf6|\\ud83c\\udfa6|\\ud83c\\ude01|\\ud83c\\ude2f\\ufe0f|\\ud83c\\ude33|\\ud83c\\ude35|\\ud83c\\ude34|\\ud83c\\ude32|\\ud83c\\ude50|\\ud83c\\ude39|\\ud83c\\ude3a|\\ud83c\\ude36|\\ud83c\\ude1a\\ufe0f|\\ud83d\\udebb|\\ud83d\\udeb9|\\ud83d\\udeba|\\ud83d\\udebc|\\ud83d\\udebe|\\ud83d\\udeb0|\\ud83d\\udeae|\\ud83c\\udd7f\\ufe0f|\\u267f\\ufe0f|\\ud83d\\udead|\\ud83c\\ude37|\\ud83c\\ude38|\\ud83c\\ude02|\\u24c2\\ufe0f|\\ud83d\\udec2|\\ud83d\\udec4|\\ud83d\\udec5|\\ud83d\\udec3|\\ud83c\\ude51|\\u3299\\ufe0f|\\u3297\\ufe0f|\\ud83c\\udd91|\\ud83c\\udd98|\\ud83c\\udd94|\\ud83d\\udeab|\\ud83d\\udd1e|\\ud83d\\udcf5|\\ud83d\\udeaf|\\ud83d\\udeb1|\\ud83d\\udeb3|\\ud83d\\udeb7|\\ud83d\\udeb8|\\u26d4\\ufe0f|\\u2733\\ufe0f|\\u2747\\ufe0f|\\u274e|\\u2705|\\u2734\\ufe0f|\\ud83d\\udc9f|\\ud83c\\udd9a|\\ud83d\\udcf3|\\ud83d\\udcf4|\\ud83c\\udd70|\\ud83c\\udd71|\\ud83c\\udd8e|\\ud83c\\udd7e|\\ud83d\\udca0|\\u27bf|\\u267b\\ufe0f|\\u2648\\ufe0f|\\u2649\\ufe0f|\\u264a\\ufe0f|\\u264b\\ufe0f|\\u264c\\ufe0f|\\u264d\\ufe0f|\\u264e\\ufe0f|\\u264f\\ufe0f|\\u2650\\ufe0f|\\u2651\\ufe0f|\\u2652\\ufe0f|\\u2653\\ufe0f|\\u26ce|\\ud83d\\udd2f|\\ud83c\\udfe7|\\ud83d\\udcb9|\\ud83d\\udcb2|\\ud83d\\udcb1|\\u00a9|\\u00ae|\\u2122|\\u274c|\\u203c\\ufe0f|\\u2049\\ufe0f|\\u2757\\ufe0f|\\u2753|\\u2755|\\u2754|\\u2b55\\ufe0f|\\ud83d\\udd1d|\\ud83d\\udd1a|\\ud83d\\udd19|\\ud83d\\udd1b|\\ud83d\\udd1c|\\ud83d\\udd03|\\ud83d\\udd5b|\\ud83d\\udd67|\\ud83d\\udd50|\\ud83d\\udd5c|\\ud83d\\udd51|\\ud83d\\udd5d|\\ud83d\\udd52|\\ud83d\\udd5e|\\ud83d\\udd53|\\ud83d\\udd5f|\\ud83d\\udd54|\\ud83d\\udd60|\\ud83d\\udd55|\\ud83d\\udd56|\\ud83d\\udd57|\\ud83d\\udd58|\\ud83d\\udd59|\\ud83d\\udd5a|\\ud83d\\udd61|\\ud83d\\udd62|\\ud83d\\udd63|\\ud83d\\udd64|\\ud83d\\udd65|\\ud83d\\udd66|\\u2716\\ufe0f|\\u2795|\\u2796|\\u2797|\\u2660\\ufe0f|\\u2665\\ufe0f|\\u2663\\ufe0f|\\u2666\\ufe0f|\\ud83d\\udcae|\\ud83d\\udcaf|\\u2714\\ufe0f|\\u2611\\ufe0f|\\ud83d\\udd18|\\ud83d\\udd17|\\u27b0|\\u3030|\\u303d\\ufe0f|\\ud83d\\udd31|\\u25fc\\ufe0f|\\u25fb\\ufe0f|\\u25fe\\ufe0f|\\u25fd\\ufe0f|\\u25aa\\ufe0f|\\u25ab\\ufe0f|\\ud83d\\udd3a|\\ud83d\\udd32|\\ud83d\\udd33|\\u26ab\\ufe0f|\\u26aa\\ufe0f|\\ud83d\\udd34|\\ud83d\\udd35|\\ud83d\\udd3b|\\u2b1c\\ufe0f|\\u2b1b\\ufe0f|\\ud83d\\udd36|\\ud83d\\udd37|\\ud83d\\udd38|\\ud83d\\udd39/g; // 检测utf16字符正则
					var aEmoji = temp.render(data[i]).match(/\[.{1,2}\]/g);
					var aEmojiSystem = temp.render(data[i]).match(/\\u[a-z0-9A-Z]{4}\\u[a-z0-9A-Z]{4}/g);
					var	oHtml = temp.render(data[i]);
					if( aEmoji ){
						for(var j = 0; j < aEmoji.length; j++){
							oHtml = oHtml.replace(aEmoji[j],this.imgJson[aEmoji[j]]);
						};
						for(var j = 0; j < aEmojiSystem.length; j++){
							if(!aEmojiSystem[j].match(patt)){
								 var strs = aEmojiSystem[j].match(/\\u[a-z0-9A-Z]{4}/g);
								 for(var x = 0; x < strs.length; x++){
								 	oHtml = oHtml.replace(strs[x],unescape(strs[x].replace(/\\/g,"%")));
								 }
							} else {
								var oImg = "<img src='emoji/2x/" + toUnicode(aEmojiSystem[j]) + ".png' style='width:40px; height:40px; transform:scale(0.7); margin:0;'>";
								oHtml = oHtml.replace(aEmojiSystem[j],oImg);
							}
						};
					}

					html += oHtml;
					this.commentList.push(data[i]);
				};



				var oul = this.commentPage.find('ul').append(html);
				var wrap = this.commentPage.find(".find-message").after(oul);

				function toUnicode(str){
					var h = "0x" + str.substr(str.indexOf("u")+1,4);
					var l = "0x" +  str.substr(str.lastIndexOf("u")+1,4);
					var code = (Number(h) - 0xD800) * 0x400 + 0x10000 + Number(l) - 0xDC00;
					return code.toString(16);
				}
				
				//判断用户头像是否为空
				var item = this.commentPage.find('ul').find('li');
				for (var i = 0; i < item.length; i++) {
					if ($(item[i]).find('img.user-icon').attr('src') == '') {
						$(item[i]).find('img.user-icon').attr('src','images/user.jpg');
					}
				};
			},
			//========判断是否要删除相片====
			deleteMyDreamPhotoAjax:function(){
				var imgElement = $(this).parent().find("img")
				var pid = $(this).parents(".message-content").find("input[data-type=pictureId]").val();
				var option={
		            url:MoonduDomain+'/photo/DelPhoto',
		            data:{pid:pid},
		            callback:function(res){
		            	if (res.Result) {
							imgElement.remove();
							View.layer.addClass("hidden");
							//删除成功后隐藏删除按钮
							View.wrap.find('a.delete').addClass('hidden');
						}else{
							View.layer.addClass("hidden");
						}
		            }
		        }
		       	$.md.ajaxurl(option);
			},
			//分享照片调用用户信息接口
			shareUserInformationAjax:function(){
				var self = this;
				var uid = this.userInfor.id;
				var option={
		            url:MoonduDomain + '/Home/ShareUserInfos',
		            data:{uid:uid},
		            callback:function(res){
		            	if (res.Result) {
							self.shareLink();
						};
		            }
		        }
		       	$.md.ajaxurl(option);
			},
			//===============发表评论=========
			deliverCommentAjax:function(){
				var comment = this.publishField.find('input').val(),height = this.wrap.height() + $('.blank').height(),pid = $.getUrlVar('pid'),self = this;
				this.userInfor.isLogined == true ? commentFunc() : $.login("是否登录");
				function commentFunc(){
					$.trim(comment) == '' ? promptDialog('亲，你还没有输入内容哦！') : success();
				}
				function success(){
					var option={
			            url:MoonduDomain+'/photo/OptComment',
			            data:{pid:pid,txtcontent:comment},
			            callback:function(res){
			            	if (res.Result) {
			            		if (res.Msg == '您的评论正在排队审核中，请稍后！') {
			            			layer.open({
										content:res.Msg,
										btn: ['OK']
									});
			            		}else{
			            			self.addComment(comment);
			            			$(document).trigger("scroll");
			            			$(document).scrollTop(height);
			            		}
							}else{
								if (res.Msg == '评论重复了!有木有!') {
									layer.open({
										content:res.Msg,
										btn: ['OK']
									});
								}
							}
			            }
		        	}
		       	$.md.ajaxurl(option);
				}
			},
			//悬浮框点赞状态
			tooltipPraiseStateAjax:function(boolean){
				var self  = this,pid = $.getUrlVar('pid'),flag = boolean;
				flag == true ? praiseState() : this.publishField.find("a[data-type=love]").addClass("love").removeClass("love-after");
				console.log(flag);
				function praiseState(){
					var option = {
			            url:MoonduDomain+'/photo/GetLikedPhoto',
			            data:{pid:pid},
			            callback:function(res){
			            	if (res.Result) {
								if (res.Data.length > 0 && res.Data[0].Uid == self.userInfor.id) {
									self.publishField.find("a[data-type=love]").removeClass("love").addClass("love-after");
								};
							}
			            }
			        }
			       	$.md.ajaxurl(option);
				}
			},
			//==============悬浮框点赞=============
			tooltipPraiseAjax:function(){
				var pid = parseInt($.getUrlVar('pid'));
				View.userInfor.isLogined == true ? praise() : $.login("是否登录");
				function praise(){
					var option = {
			            url:MoonduDomain+'/photo/OptLike',
			            data:{pid:pid,otype:0},
			            callback:function(res){
			            	if (res.Result) {
								View.praise();
							};
			            }
			        }
			       	$.md.ajaxurl(option);
				}
			},
			//============获取相片数据===========
			getPhotoDetailAjax:function(){
				var self = this;
				var pid = parseInt($.getUrlVar('pid'));
				var option={
		            url:MoonduDomain+'/photob/GetPhotoByPid',
		            data:{pid:pid},
		            callback:function(res){
		            	if (res.Result) {
							self.messageRender(res.Data);
						}
		            }
		        }
		       	$.md.ajaxurl(option);
			},
			//===========获取点赞用户的信息=========
			getDeliverPraiseAjax:function(){
				var self = this;
				var pid = parseInt($.getUrlVar('pid'));
				var option={
		            url:MoonduDomain+'/photob/GetLikeUserByPid',
		           data:{pid:pid},
		            callback:function(res){
		            	if (res.Result) {
							self.photoPraiseRender(res.Data.Rows);
						};
		            }
		        }
		       	$.md.ajaxurl(option);
			},
			//=========获取评论=============
			commentAjaxManager:function(page){
				var self = this;
				var pid = parseInt($.getUrlVar('pid'));
				var option={
		            url:MoonduDomain+'/photob/GetCommentByPid',
		            data:{pid:pid,page:page,pagesize:10},
		            callback:function(res){
		            	if (res.Result) {
		            		if (res.Data.Rows.length > 0) {
		            			self.commentRender(res.Data.Rows);
		            			self.commentCallAjax = true;
		            		}else{
		            			self.cpage = -1;
		            		}
							
						}
		            }
		        }
		       	$.md.ajaxurl(option);
			}
		}
		//M-资讯
		var Message={

			init:function(){
				var self = this;
				this.$top = $("#top");
				this.$wrap= $("#detaiMessage");
				this.publishField = $(".issue");
				this.praiseWarp = $("#praise");
				this.publishField = $("#releaseCommentPanel");
				this.commentPage = $("#comment-page");
				this.userInfor = {};//存储用户信息
				this.userInfor.isLogined = false;
				this.commentArr = []; //存储评论用户的id
				this.praiseIdArr = [];//存储点赞用户的id
				this.cpage = 1;
				this.commentCallAjax = true;
				this.meassageArr = []; //存储当前的资讯信息
				this.meassageCommentList = []; //存储当前资讯评论
				this.messagePraiseList = []; //存储当前资讯点赞人物列表
				this.flag = true;
				this.eJson = {
					"miantian":"[腼腆]",
					"dai":"[呆]",
					"danyan":"[单眼]",
					"gaoxing":"[高兴]",
					"haixiu":"[害羞]",
					"heng":"[哼]",
					"kaixin":"[开心]",
					"keai":"[可爱]",
					"lengmo":"[冷漠]",
					"nanguo":"[难过]",
					"qinqin":"[亲亲]",
					"shengqi":"[生气]",
					"tiaopi":"[调皮]",
					"xinwei":"[欣慰]",
					"yun":"[晕]"
				};
				this.imgJson = {
					'[腼腆]':'<span alt="miantian" class="ecom e_miantian"></span>',
					'[呆]':'<span alt="dai" class="ecom e_dai"></span>',
					'[单眼]':'<span alt="danyan" class="ecom e_danyan"></span>',
					'[高兴]':'<span alt="gaoxing" class="ecom e_gaoxing"></span>',
					'[害羞]':'<span alt="haixiu" class="ecom e_haixiu"></span>',
					'[哼]':'<span alt="heng" class="ecom e_heng"></span>',
					'[开心]':'<span alt="kaixin" class="ecom e_kaixin"></span>',
					'[可爱]':'<span alt="keai" class="ecom e_keai"></span>',
					'[冷漠]':'<span alt="lengmo" class="ecom e_lengmo"></span>',
					'[难过]':'<span alt="nanguo" class="ecom e_nanguo"></span>',
					'[亲亲]':'<span alt="qinqin" class="ecom e_qinqin"></span>',
					'[生气]':'<span alt="shengqi" class="ecom e_shengqi"></span>',
					'[调皮]':'<span alt="tiaopi" class="ecom e_tiaopi"></span>',
					'[欣慰]':'<span alt="xinwei" class="ecom e_xinwei"></span>',
					'[晕]':'<span alt="yun" class="ecom e_yun"></span>'
				};//存储图片表情
				this._getCurrentUserInforAjax();
				this._bindEvent();
			},
			_bindEvent:function(){
				var self = this;
				this.getMessageAjax();
				window.onload = function(){
					self.getDeliverPraiseAjax();
				}
				//点赞
				this.publishField.on("click","[data-type=love]",self.tooltipPraiseAjax);
				//添加表情
				// this.publishField.on("click","a.addemoji",self.addemojis.bind(this));
				//发表评论
				this.publishField.on('click','a.publish',self.deliverCommentAjax.bind(this));
				//分享下载链接
				$("#massage_share_link").find("a").bind('click',self.shareUserInformationAjax.bind(this));
				//点击分享
				this.$top.find('a.share').bind('click',self.shareWebsiteLink.bind(this));
				//返回上个页面
				this.$top.on("click","a.arrow",function(){
					var str=$.getUrlVar('reurl');	
					str = str.replaceAll('||','?').replaceAll('__','=').replaceAll('#','&');		
					window.location.href = str;
				})
				//获取评论数据
				this.commentAjaxManager(self.cpage);//获取评论信息
				$(window).scroll(function(){
		        	if ($(document).scrollTop() + $(window).height() + 20 >= $(document).height()){
		         		if (self.cpage == -1) return;
		         		self.cpage ++;
		         		if (self.cpage > 1) {
		          			if (!self.commentCallAjax) return;
		                 	self.commentCallAjax = false;
		                 	self.commentAjaxManager(self.cpage)
		        		 }
		        	}
		       });
			},
			_getCurrentUserInforAjax:function(){
				var self = this;
				var option={
				    url:MoonduDomain+'/UserCenter/GetUserInfo',
				    callback:function(res){
				   		 if (res.Result && res.Result != 'nologin') {
				   		 	self.userInfor.name = res.Data.UserNick;
				      		self.userInfor.portrait = res.Data.Image;
				      		self.userInfor.id = res.Data.Uid;
				      		self.userInfor.commentFlag = res.Result;
				      		self.userInfor.isLogined = true;
				      		//判断当前资讯是否已经点过赞
							self.isCurrentMessageLike(self.userInfor.isLogined);
				      		//判断当前用户头像是否为空，若是为空，则显示默认头像
			      			if (self.userInfor.portrait == 'http://nginx.moonbasagroup.com/images/user.jpg' || self.userInfor.portrait == '' || self.userInfor.portrait == null || self.userInfor.portrait == undefined) {
						      		self.userInfor.portrait = 'images/user.jpg';
						      }
				   		 }
				   }
			   }
				$.md.ajaxurl(option);
			},
			//======点赞============
			praise:function(){
				var xcount = parseInt(Message.praiseWarp.find("span.num").text().match(/\d+/)[0]),
					reurl=window.location.href,  
					index = reurl.lastIndexOf('/') + 1,				
					Reurl = reurl.substring(index);
				Reurl = Reurl.replaceAll('?','||').replaceAll('=','__').replaceAll('&','#');
				var li = "<li class='fl' data-UserID="+Message.userInfor.id+">\
						<a href='public_home.html?id="+Message.userInfor.id+"&reurl="+Reurl+"'>\
						<img src='"+Message.userInfor.portrait+"' width='80%'>\
					</a>\
				</li>";
				//如果当前点赞的li*size已超出ul长度，则最后一个隐藏
				var liLen = Message.praiseWarp.find('ul').find('li').size()*Message.praiseWarp.find('ul').find('li').first().width();
				var ulLen = Message.praiseWarp.find('ul').width();
				if (liLen > ulLen) {
					Message.praiseWarp.find('li').filter('.ellipsis').prev().prev().addClass('hidden');
				};
				Message.praiseWarp.find("ul").prepend(li);
				Message.publishField.find("a.love").removeClass("love").addClass("love-after");
				xcount ++;
				Message.praiseWarp.find("span.num").text(xcount);
			},
			//=======点赞的用户过多则出现省略号
			praiseEllipsis:function(){
				var self = this;
				var postID = parseInt(this.$wrap.find("input[type=hidden]").val());
				var xcount=this.praiseWarp.find("li").size();
				this.praiseWarp.find("span.num").text(xcount);
				//如果用户太多，则用省略号表示，点击省略号可跳转页面
				var xSize=this.praiseWarp.find("li").size(); //总个数
				//var xli = $("<li class='ellipsis fl'><a href='praise_list.html?pid="+postID+"'>...</a></li>");//创建带有省略号的li
				var xli = $("<li class='ellipsis fl'><a href='javascript:;'>...</a></li>");//创建带有省略号的li
				var xWidth = parseInt(this.praiseWarp.find("li").not(".ellipsis").width()) + parseInt(this.praiseWarp.find("li").css("marginRight")); //每个的长度+margin值
				var xcount = Math.floor(parseInt(this.praiseWarp.find("ul").width())/xWidth);//一行可容纳多少个li
				if (xSize*xWidth > parseInt(this.praiseWarp.find("ul").width())) {
					$("#praise ul li:gt(" + (xcount-2) + ")").addClass("hidden");
					//第xcount-1个后面插入带省略号的li
					this.praiseWarp.find("li").eq(xcount-1).after(xli);
				}
			},
			//分享当前页面的链接
			shareWebsiteLink:function(){
				var self = this,id = $.getUrlVar('id');
				TakePhoto.prototype.takePhoto(
    				'share',
        			function(r){
        				
        			},
    				function(e){console.log(e);},
    			[{"sharetitle":self.title,"sharecontent":self.content,"shareurl":MZoneDomain+"T_massage.html?id="+id+""}]);
			},
			//资讯详情渲染
			messageRender:function(data){
				var html = "",
					messageTemp = document.getElementById("messageTemp"),
					temp = new EJS({"text": messageTemp}),
					commentNum = data.ComCount
				this.title = data.Title;
				this.content = data.Describes;
				data.conn = data.Content.replaceAll("\n"," ");
				if (this.content == '') {
					this.content = this.title;
				};
				this.newsId = data.Id;
				html = temp.render(data);
				this.meassageArr.push(data);
				
				this.$wrap.html(html)
				var str = $(this.$wrap.find('pre')[1]).text().replaceAll("\n","_").replaceAll("____","\n").replaceAll("__","\n").replaceAll("_","\n");
				$(this.$wrap.find('pre')[1]).text(str);
				//评论数量显示
				this.commentPage.find("span.num").text(commentNum);
				//图片宽度自适应
				this.$wrap.find('.content').find('img').css({'width':'100%','height':'auto'});
				this.$wrap.find('.content').find('p').css('textAlign','left');
			},
			//=============点赞模块渲染=====
			photoPraiseRender:function(data){
				var self = this,
					html = "",
					photoPraiseTemp = document.getElementById("photoPraiseTemp").innerHTML,
					temp = new EJS({"text": photoPraiseTemp});
				for (var i = 0; i < data.length; i++) {
					html += temp.render(data[i]);
					this.messagePraiseList.push(data[i]);
				};
				this.praiseWarp.find("ul").html(html);
				this.praiseWarp.find("span.num").text(this.praiseWarp.find("ul").find("li").size());
				//省略号
				this.praiseEllipsis();
			},
			//=========前面添加0=========
			addZero:function(num){
				if (num < 10) {
					num = "0" + num;
				};
				return num;
			},
			shareLink:function(){
				var self = this;
				var u = navigator.userAgent;
				//安卓手机
				if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
					 window.location.href = "http://static.moonbasa.com/zone/moonbasa.zone_1.0.apk";
				//苹果手机
				} 
				else if (u.indexOf('iPhone') > -1) {
					window.location.href = "http://static.moonbasa.com/zone/moonbasa.zone_1.0.apk";
				} 
				//winphone手机
				else if (u.indexOf('Windows Phone') > -1) {
					//$.alert("winphone手机");
					 //window.location.href = "http://static.moonbasa.com/zone/moonbasa.zone_1.0.apk";
				}
			},
			commentRender:function(data){
				var self=this,
					html="",
					commentTemp=document.getElementById("userCommentTemp"),
					temp = new EJS({"text": commentTemp});
				for (var i = 0; i < data.length; i++) {
					var patt = /\\ud83d\\ude04|\\ud83d\\ude03|\\ud83d\\ude00|\\ud83d\\ude0a|\\u263a\\ufe0f|\\ud83d\\ude09|\\ud83d\\ude0d|\\ud83d\\ude18|\\ud83d\\ude1a|\\ud83d\\ude17|\\ud83d\\ude19|\\ud83d\\ude1c|\\ud83d\\ude1d|\\ud83d\\ude1b|\\ud83d\\ude33|\\ud83d\\ude01|\\ud83d\\ude14|\\ud83d\\ude0c|\\ud83d\\ude12|\\ud83d\\ude1e|\\ud83d\\ude23|\\ud83d\\ude22|\\ud83d\\ude02|\\ud83d\\ude2d|\\ud83d\\ude2a|\\ud83d\\ude25|\\ud83d\\ude30|\\ud83d\\ude05|\\ud83d\\ude13|\\ud83d\\ude29|\\ud83d\\ude2b|\\ud83d\\ude28|\\ud83d\\ude31|\\ud83d\\ude20|\\ud83d\\ude21|\\ud83d\\ude24|\\ud83d\\ude16|\\ud83d\\ude06|\\ud83d\\ude0b|\\ud83d\\ude37|\\ud83d\\ude0e|\\ud83d\\ude34|\\ud83d\\ude35|\\ud83d\\ude32|\\ud83d\\ude1f|\\ud83d\\ude26|\\ud83d\\ude27|\\ud83d\\ude08|\\ud83d\\udc7f|\\ud83d\\ude2e|\\ud83d\\ude2c|\\ud83d\\ude10|\\ud83d\\ude15|\\ud83d\\ude2f|\\ud83d\\ude36|\\ud83d\\ude07|\\ud83d\\ude0f|\\ud83d\\ude11|\\ud83d\\udc72|\\ud83d\\udc73|\\ud83d\\udc6e|\\ud83d\\udc77|\\ud83d\\udc82|\\ud83d\\udc76|\\ud83d\\udc66|\\ud83d\\udc67|\\ud83d\\udc68|\\ud83d\\udc69|\\ud83d\\udc74|\\ud83d\\udc75|\\ud83d\\udc71|\\ud83d\\udc7c|\\ud83d\\udc78|\\ud83d\\ude3a|\\ud83d\\ude38|\\ud83d\\ude3b|\\ud83d\\ude3d|\\ud83d\\ude3c|\\ud83d\\ude40|\\ud83d\\ude3f|\\ud83d\\ude39|\\ud83d\\ude3e|\\ud83d\\udc79|\\ud83d\\udc7a|\\ud83d\\ude48|\\ud83d\\ude49|\\ud83d\\ude4a|\\ud83d\\udc80|\\ud83d\\udc7d|\\ud83d\\udca9|\\ud83d\\udd25|\\u2728|\\ud83c\\udf1f|\\ud83d\\udcab|\\ud83d\\udca5|\\ud83d\\udca2|\\ud83d\\udca6|\\ud83d\\udca7|\\ud83d\\udca4|\\ud83d\\udca8|\\ud83d\\udc42|\\ud83d\\udc40|\\ud83d\\udc43|\\ud83d\\udc45|\\ud83d\\udc44|\\ud83d\\udc4d|\\ud83d\\udc4e|\\ud83d\\udc4c|\\ud83d\\udc4a|\\u270a|\\u270c\\ufe0f|\\ud83d\\udc4b|\\u270b|\\ud83d\\udc50|\\ud83d\\udc46|\\ud83d\\udc47|\\ud83d\\udc49|\\ud83d\\udc48|\\ud83d\\ude4c|\\ud83d\\ude4f|\\u261d\\ufe0f|\\ud83d\\udc4f|\\ud83d\\udcaa|\\ud83d\\udeb6|\\ud83c\\udfc3|\\ud83d\\udc83|\\ud83d\\udc6b|\\ud83d\\udc6a|\\ud83d\\udc6c|\\ud83d\\udc6d|\\ud83d\\udc8f|\\ud83d\\udc91|\\ud83d\\udc6f|\\ud83d\\ude46|\\ud83d\\ude45|\\ud83d\\udc81|\\ud83d\\ude4b|\\ud83d\\udc86|\\ud83d\\udc87|\\ud83d\\udc85|\\ud83d\\udc70|\\ud83d\\ude4e|\\ud83d\\ude4d|\\ud83d\\ude47|\\ud83c\\udfa9|\\ud83d\\udc51|\\ud83d\\udc52|\\ud83d\\udc5f|\\ud83d\\udc5e|\\ud83d\\udc61|\\ud83d\\udc60|\\ud83d\\udc62|\\ud83d\\udc55|\\ud83d\\udc54|\\ud83d\\udc5a|\\ud83d\\udc57|\\ud83c\\udfbd|\\ud83d\\udc56|\\ud83d\\udc58|\\ud83d\\udc59|\\ud83d\\udcbc|\\ud83d\\udc5c|\\ud83d\\udc5d|\\ud83d\\udc5b|\\ud83d\\udc53|\\ud83c\\udf80|\\ud83c\\udf02|\\ud83d\\udc84|\\ud83d\\udc9b|\\ud83d\\udc99|\\ud83d\\udc9c|\\ud83d\\udc9a|\\u2764\\ufe0f|\\ud83d\\udc94|\\ud83d\\udc97|\\ud83d\\udc93|\\ud83d\\udc95|\\ud83d\\udc96|\\ud83d\\udc9e|\\ud83d\\udc98|\\ud83d\\udc8c|\\ud83d\\udc8b|\\ud83d\\udc8d|\\ud83d\\udc8e|\\ud83d\\udc64|\\ud83d\\udc65|\\ud83d\\udcac|\\ud83d\\udc63|\\ud83d\\udcad|\\ud83d\\udc36|\\ud83d\\udc3a|\\ud83d\\udc31|\\ud83d\\udc2d|\\ud83d\\udc39|\\ud83d\\udc30|\\ud83d\\udc38|\\ud83d\\udc2f|\\ud83d\\udc28|\\ud83d\\udc3b|\\ud83d\\udc37|\\ud83d\\udc3d|\\ud83d\\udc2e|\\ud83d\\udc17|\\ud83d\\udc35|\\ud83d\\udc12|\\ud83d\\udc34|\\ud83d\\udc11|\\ud83d\\udc18|\\ud83d\\udc3c|\\ud83d\\udc27|\\ud83d\\udc26|\\ud83d\\udc24|\\ud83d\\udc25|\\ud83d\\udc23|\\ud83d\\udc14|\\ud83d\\udc0d|\\ud83d\\udc22|\\ud83d\\udc1b|\\ud83d\\udc1d|\\ud83d\\udc1c|\\ud83d\\udc1e|\\ud83d\\udc0c|\\ud83d\\udc19|\\ud83d\\udc1a|\\ud83d\\udc20|\\ud83d\\udc1f|\\ud83d\\udc2c|\\ud83d\\udc33|\\ud83d\\udc0b|\\ud83d\\udc04|\\ud83d\\udc0f|\\ud83d\\udc00|\\ud83d\\udc03|\\ud83d\\udc05|\\ud83d\\udc07|\\ud83d\\udc09|\\ud83d\\udc0e|\\ud83d\\udc10|\\ud83d\\udc13|\\ud83d\\udc15|\\ud83d\\udc16|\\ud83d\\udc01|\\ud83d\\udc02|\\ud83d\\udc32|\\ud83d\\udc21|\\ud83d\\udc0a|\\ud83d\\udc2b|\\ud83d\\udc2a|\\ud83d\\udc06|\\ud83d\\udc08|\\ud83d\\udc29|\\ud83d\\udc3e|\\ud83d\\udc90|\\ud83c\\udf38|\\ud83c\\udf37|\\ud83c\\udf40|\\ud83c\\udf39|\\ud83c\\udf3b|\\ud83c\\udf3a|\\ud83c\\udf41|\\ud83c\\udf43|\\ud83c\\udf42|\\ud83c\\udf3f|\\ud83c\\udf3e|\\ud83c\\udf44|\\ud83c\\udf35|\\ud83c\\udf34|\\ud83c\\udf32|\\ud83c\\udf33|\\ud83c\\udf30|\\ud83c\\udf31|\\ud83c\\udf3c|\\ud83c\\udf10|\\ud83c\\udf1e|\\ud83c\\udf1d|\\ud83c\\udf1a|\\ud83c\\udf11|\\ud83c\\udf12|\\ud83c\\udf13|\\ud83c\\udf14|\\ud83c\\udf15|\\ud83c\\udf16|\\ud83c\\udf17|\\ud83c\\udf18|\\ud83c\\udf1c|\\ud83c\\udf1b|\\ud83c\\udf19|\\ud83c\\udf0d|\\ud83c\\udf0e|\\ud83c\\udf0f|\\ud83c\\udf0b|\\ud83c\\udf0c|\\ud83c\\udf20|\\u2b50\\ufe0f|\\u2600\\ufe0f|\\u26c5\\ufe0f|\\u2601\\ufe0f|\\u26a1\\ufe0f|\\u2614\\ufe0f|\\u2744\\ufe0f|\\u26c4\\ufe0f|\\ud83c\\udf00|\\ud83c\\udf01|\\ud83c\\udf08|\\ud83c\\udf0a|\\ud83c\\udf8d|\\ud83d\\udc9d|\\ud83c\\udf8e|\\ud83c\\udf92|\\ud83c\\udf93|\\ud83c\\udf8f|\\ud83c\\udf86|\\ud83c\\udf87|\\ud83c\\udf90|\\ud83c\\udf91|\\ud83c\\udf83|\\ud83d\\udc7b|\\ud83c\\udf85|\\ud83c\\udf84|\\ud83c\\udf81|\\ud83c\\udf8b|\\ud83c\\udf89|\\ud83c\\udf8a|\\ud83c\\udf88|\\ud83c\\udf8c|\\ud83d\\udd2e|\\ud83c\\udfa5|\\ud83d\\udcf7|\\ud83d\\udcf9|\\ud83d\\udcfc|\\ud83d\\udcbf|\\ud83d\\udcc0|\\ud83d\\udcbd|\\ud83d\\udcbe|\\ud83d\\udcbb|\\ud83d\\udcf1|\\u260e\\ufe0f|\\ud83d\\udcde|\\ud83d\\udcdf|\\ud83d\\udce0|\\ud83d\\udce1|\\ud83d\\udcfa|\\ud83d\\udcfb|\\ud83d\\udd0a|\\ud83d\\udd09|\\ud83d\\udd08|\\ud83d\\udd07|\\ud83d\\udd14|\\ud83d\\udd15|\\ud83d\\udce2|\\ud83d\\udce3|\\u23f3|\\u231b\\ufe0f|\\u23f0|\\u231a\\ufe0f|\\ud83d\\udd13|\\ud83d\\udd12|\\ud83d\\udd0f|\\ud83d\\udd10|\\ud83d\\udd11|\\ud83d\\udd0e|\\ud83d\\udca1|\\ud83d\\udd26|\\ud83d\\udd06|\\ud83d\\udd05|\\ud83d\\udd0c|\\ud83d\\udd0b|\\ud83d\\udd0d|\\ud83d\\udec1|\\ud83d\\udec0|\\ud83d\\udebf|\\ud83d\\udebd|\\ud83d\\udd27|\\ud83d\\udd29|\\ud83d\\udd28|\\ud83d\\udeaa|\\ud83d\\udeac|\\ud83d\\udca3|\\ud83d\\udd2b|\\ud83d\\udd2a|\\ud83d\\udc8a|\\ud83d\\udc89|\\ud83d\\udcb0|\\ud83d\\udcb4|\\ud83d\\udcb5|\\ud83d\\udcb7|\\ud83d\\udcb6|\\ud83d\\udcb3|\\ud83d\\udcb8|\\ud83d\\udcf2|\\ud83d\\udce7|\\ud83d\\udce5|\\ud83d\\udce4|\\u2709\\ufe0f|\\ud83d\\udce9|\\ud83d\\udce8|\\ud83d\\udcef|\\ud83d\\udceb|\\ud83d\\udcea|\\ud83d\\udcec|\\ud83d\\udced|\\ud83d\\udcee|\\ud83d\\udce6|\\ud83d\\udcdd|\\ud83d\\udcc4|\\ud83d\\udcc3|\\ud83d\\udcd1|\\ud83d\\udcca|\\ud83d\\udcc8|\\ud83d\\udcc9|\\ud83d\\udcdc|\\ud83d\\udccb|\\ud83d\\udcc5|\\ud83d\\udcc6|\\ud83d\\udcc7|\\ud83d\\udcc1|\\ud83d\\udcc2|\\u2702\\ufe0f|\\ud83d\\udccc|\\ud83d\\udcce|\\u2712\\ufe0f|\\u270f\\ufe0f|\\ud83d\\udccf|\\ud83d\\udcd0|\\ud83d\\udcd5|\\ud83d\\udcd7|\\ud83d\\udcd8|\\ud83d\\udcd9|\\ud83d\\udcd3|\\ud83d\\udcd4|\\ud83d\\udcd2|\\ud83d\\udcda|\\ud83d\\udcd6|\\ud83d\\udd16|\\ud83d\\udcdb|\\ud83d\\udd2c|\\ud83d\\udd2d|\\ud83d\\udcf0|\\ud83c\\udfa8|\\ud83c\\udfac|\\ud83c\\udfa4|\\ud83c\\udfa7|\\ud83c\\udfbc|\\ud83c\\udfb5|\\ud83c\\udfb6|\\ud83c\\udfb9|\\ud83c\\udfbb|\\ud83c\\udfba|\\ud83c\\udfb7|\\ud83c\\udfb8|\\ud83d\\udc7e|\\ud83c\\udfae|\\ud83c\\udccf|\\ud83c\\udfb4|\\ud83c\\udc04\\ufe0f|\\ud83c\\udfb2|\\ud83c\\udfaf|\\ud83c\\udfc8|\\ud83c\\udfc0|\\u26bd\\ufe0f|\\u26be\\ufe0f|\\ud83c\\udfbe|\\ud83c\\udfb1|\\ud83c\\udfc9|\\ud83c\\udfb3|\\u26f3\\ufe0f|\\ud83d\\udeb5|\\ud83d\\udeb4|\\ud83c\\udfc1|\\ud83c\\udfc7|\\ud83c\\udfc6|\\ud83c\\udfbf|\\ud83c\\udfc2|\\ud83c\\udfca|\\ud83c\\udfc4|\\ud83c\\udfa3|\\u2615\\ufe0f|\\ud83c\\udf75|\\ud83c\\udf76|\\ud83c\\udf7c|\\ud83c\\udf7a|\\ud83c\\udf7b|\\ud83c\\udf78|\\ud83c\\udf79|\\ud83c\\udf77|\\ud83c\\udf74|\\ud83c\\udf55|\\ud83c\\udf54|\\ud83c\\udf5f|\\ud83c\\udf57|\\ud83c\\udf56|\\ud83c\\udf5d|\\ud83c\\udf5b|\\ud83c\\udf64|\\ud83c\\udf71|\\ud83c\\udf63|\\ud83c\\udf65|\\ud83c\\udf59|\\ud83c\\udf58|\\ud83c\\udf5a|\\ud83c\\udf5c|\\ud83c\\udf72|\\ud83c\\udf62|\\ud83c\\udf61|\\ud83c\\udf73|\\ud83c\\udf5e|\\ud83c\\udf69|\\ud83c\\udf6e|\\ud83c\\udf66|\\ud83c\\udf68|\\ud83c\\udf67|\\ud83c\\udf82|\\ud83c\\udf70|\\ud83c\\udf6a|\\ud83c\\udf6b|\\ud83c\\udf6c|\\ud83c\\udf6d|\\ud83c\\udf6f|\\ud83c\\udf4e|\\ud83c\\udf4f|\\ud83c\\udf4a|\\ud83c\\udf4b|\\ud83c\\udf52|\\ud83c\\udf47|\\ud83c\\udf49|\\ud83c\\udf53|\\ud83c\\udf51|\\ud83c\\udf48|\\ud83c\\udf4c|\\ud83c\\udf50|\\ud83c\\udf4d|\\ud83c\\udf60|\\ud83c\\udf46|\\ud83c\\udf45|\\ud83c\\udf3d|\\ud83c\\udfe0|\\ud83c\\udfe1|\\ud83c\\udfeb|\\ud83c\\udfe2|\\ud83c\\udfe3|\\ud83c\\udfe5|\\ud83c\\udfe6|\\ud83c\\udfea|\\ud83c\\udfe9|\\ud83c\\udfe8|\\ud83d\\udc92|\\u26ea\\ufe0f|\\ud83c\\udfec|\\ud83c\\udfe4|\\ud83c\\udf07|\\ud83c\\udf06|\\ud83c\\udfef|\\ud83c\\udff0|\\u26fa\\ufe0f|\\ud83c\\udfed|\\ud83d\\uddfc|\\ud83d\\uddfe|\\ud83d\\uddfb|\\ud83c\\udf04|\\ud83c\\udf05|\\ud83c\\udf03|\\ud83d\\uddfd|\\ud83c\\udf09|\\ud83c\\udfa0|\\ud83c\\udfa1|\\u26f2\\ufe0f|\\ud83c\\udfa2|\\ud83d\\udea2|\\u26f5\\ufe0f|\\ud83d\\udea4|\\ud83d\\udea3|\\u2693\\ufe0f|\\ud83d\\ude80|\\u2708\\ufe0f|\\ud83d\\udcba|\\ud83d\\ude81|\\ud83d\\ude82|\\ud83d\\ude8a|\\ud83d\\ude89|\\ud83d\\ude9e|\\ud83d\\ude86|\\ud83d\\ude84|\\ud83d\\ude85|\\ud83d\\ude88|\\ud83d\\ude87|\\ud83d\\ude9d|\\ud83d\\ude8b|\\ud83d\\ude83|\\ud83d\\ude8e|\\ud83d\\ude8c|\\ud83d\\ude8d|\\ud83d\\ude99|\\ud83d\\ude98|\\ud83d\\ude97|\\ud83d\\ude95|\\ud83d\\ude96|\\ud83d\\ude9b|\\ud83d\\ude9a|\\ud83d\\udea8|\\ud83d\\ude93|\\ud83d\\ude94|\\ud83d\\ude92|\\ud83d\\ude91|\\ud83d\\ude90|\\ud83d\\udeb2|\\ud83d\\udea1|\\ud83d\\ude9f|\\ud83d\\udea0|\\ud83d\\ude9c|\\ud83d\\udc88|\\ud83d\\ude8f|\\ud83c\\udfab|\\ud83d\\udea6|\\ud83d\\udea5|\\u26a0\\ufe0f|\\ud83d\\udea7|\\ud83d\\udd30|\\u26fd\\ufe0f|\\ud83c\\udfee|\\ud83c\\udfb0|\\u2668\\ufe0f|\\ud83d\\uddff|\\ud83c\\udfaa|\\ud83c\\udfad|\\ud83d\\udccd|\\ud83d\\udea9|\\ud83c\\uddef\\ud83c\\uddf5|\\ud83c\\uddf0\\ud83c\\uddf7|\\ud83c\\udde9\\ud83c\\uddea|\\ud83c\\udde8\\ud83c\\uddf3|\\ud83c\\uddfa\\ud83c\\uddf8|\\ud83c\\uddeb\\ud83c\\uddf7|\\ud83c\\uddea\\ud83c\\uddf8|\\ud83c\\uddee\\ud83c\\uddf9|\\ud83c\\uddf7\\ud83c\\uddfa|\\ud83c\\uddec\\ud83c\\udde7|\\u0031\\ufe0f\\u20e3|\\u0032\\ufe0f\\u20e3|\\u0033\\ufe0f\\u20e3|\\u0034\\ufe0f\\u20e3|\\u0035\\ufe0f\\u20e3|\\u0036\\ufe0f\\u20e3|\\u0037\\ufe0f\\u20e3|\\u0038\\ufe0f\\u20e3|\\u0039\\ufe0f\\u20e3|\\u0030\\ufe0f\\u20e3|\\ud83d\\udd1f|\\ud83d\\udd22|\\u0023\\ufe0f\\u20e3|\\ud83d\\udd23|\\u2b06\\ufe0f|\\u2b07\\ufe0f|\\u2b05\\ufe0f|\\u27a1\\ufe0f|\\ud83d\\udd20|\\ud83d\\udd21|\\ud83d\\udd24|\\u2197\\ufe0f|\\u2196\\ufe0f|\\u2198\\ufe0f|\\u2199\\ufe0f|\\u2194\\ufe0f|\\u2195\\ufe0f|\\ud83d\\udd04|\\u25c0\\ufe0f|\\u25b6\\ufe0f|\\ud83d\\udd3c|\\ud83d\\udd3d|\\u21a9\\ufe0f|\\u21aa\\ufe0f|\\u2139\\ufe0f|\\u23ea|\\u23e9|\\u23eb|\\u23ec|\\u2935\\ufe0f|\\u2934\\ufe0f|\\ud83c\\udd97|\\ud83d\\udd00|\\ud83d\\udd01|\\ud83d\\udd02|\\ud83c\\udd95|\\ud83c\\udd99|\\ud83c\\udd92|\\ud83c\\udd93|\\ud83c\\udd96|\\ud83d\\udcf6|\\ud83c\\udfa6|\\ud83c\\ude01|\\ud83c\\ude2f\\ufe0f|\\ud83c\\ude33|\\ud83c\\ude35|\\ud83c\\ude34|\\ud83c\\ude32|\\ud83c\\ude50|\\ud83c\\ude39|\\ud83c\\ude3a|\\ud83c\\ude36|\\ud83c\\ude1a\\ufe0f|\\ud83d\\udebb|\\ud83d\\udeb9|\\ud83d\\udeba|\\ud83d\\udebc|\\ud83d\\udebe|\\ud83d\\udeb0|\\ud83d\\udeae|\\ud83c\\udd7f\\ufe0f|\\u267f\\ufe0f|\\ud83d\\udead|\\ud83c\\ude37|\\ud83c\\ude38|\\ud83c\\ude02|\\u24c2\\ufe0f|\\ud83d\\udec2|\\ud83d\\udec4|\\ud83d\\udec5|\\ud83d\\udec3|\\ud83c\\ude51|\\u3299\\ufe0f|\\u3297\\ufe0f|\\ud83c\\udd91|\\ud83c\\udd98|\\ud83c\\udd94|\\ud83d\\udeab|\\ud83d\\udd1e|\\ud83d\\udcf5|\\ud83d\\udeaf|\\ud83d\\udeb1|\\ud83d\\udeb3|\\ud83d\\udeb7|\\ud83d\\udeb8|\\u26d4\\ufe0f|\\u2733\\ufe0f|\\u2747\\ufe0f|\\u274e|\\u2705|\\u2734\\ufe0f|\\ud83d\\udc9f|\\ud83c\\udd9a|\\ud83d\\udcf3|\\ud83d\\udcf4|\\ud83c\\udd70|\\ud83c\\udd71|\\ud83c\\udd8e|\\ud83c\\udd7e|\\ud83d\\udca0|\\u27bf|\\u267b\\ufe0f|\\u2648\\ufe0f|\\u2649\\ufe0f|\\u264a\\ufe0f|\\u264b\\ufe0f|\\u264c\\ufe0f|\\u264d\\ufe0f|\\u264e\\ufe0f|\\u264f\\ufe0f|\\u2650\\ufe0f|\\u2651\\ufe0f|\\u2652\\ufe0f|\\u2653\\ufe0f|\\u26ce|\\ud83d\\udd2f|\\ud83c\\udfe7|\\ud83d\\udcb9|\\ud83d\\udcb2|\\ud83d\\udcb1|\\u00a9|\\u00ae|\\u2122|\\u274c|\\u203c\\ufe0f|\\u2049\\ufe0f|\\u2757\\ufe0f|\\u2753|\\u2755|\\u2754|\\u2b55\\ufe0f|\\ud83d\\udd1d|\\ud83d\\udd1a|\\ud83d\\udd19|\\ud83d\\udd1b|\\ud83d\\udd1c|\\ud83d\\udd03|\\ud83d\\udd5b|\\ud83d\\udd67|\\ud83d\\udd50|\\ud83d\\udd5c|\\ud83d\\udd51|\\ud83d\\udd5d|\\ud83d\\udd52|\\ud83d\\udd5e|\\ud83d\\udd53|\\ud83d\\udd5f|\\ud83d\\udd54|\\ud83d\\udd60|\\ud83d\\udd55|\\ud83d\\udd56|\\ud83d\\udd57|\\ud83d\\udd58|\\ud83d\\udd59|\\ud83d\\udd5a|\\ud83d\\udd61|\\ud83d\\udd62|\\ud83d\\udd63|\\ud83d\\udd64|\\ud83d\\udd65|\\ud83d\\udd66|\\u2716\\ufe0f|\\u2795|\\u2796|\\u2797|\\u2660\\ufe0f|\\u2665\\ufe0f|\\u2663\\ufe0f|\\u2666\\ufe0f|\\ud83d\\udcae|\\ud83d\\udcaf|\\u2714\\ufe0f|\\u2611\\ufe0f|\\ud83d\\udd18|\\ud83d\\udd17|\\u27b0|\\u3030|\\u303d\\ufe0f|\\ud83d\\udd31|\\u25fc\\ufe0f|\\u25fb\\ufe0f|\\u25fe\\ufe0f|\\u25fd\\ufe0f|\\u25aa\\ufe0f|\\u25ab\\ufe0f|\\ud83d\\udd3a|\\ud83d\\udd32|\\ud83d\\udd33|\\u26ab\\ufe0f|\\u26aa\\ufe0f|\\ud83d\\udd34|\\ud83d\\udd35|\\ud83d\\udd3b|\\u2b1c\\ufe0f|\\u2b1b\\ufe0f|\\ud83d\\udd36|\\ud83d\\udd37|\\ud83d\\udd38|\\ud83d\\udd39/g; // 检测utf16字符正则

					var aEmoji = temp.render(data[i]).match(/\[.{1,2}\]/g);
					var aEmojiSystem = temp.render(data[i]).match(/\\u[a-z0-9A-Z]{4}\\u[a-z0-9A-Z]{4}/g);
					var	oHtml = temp.render(data[i]);
					if( aEmoji && aEmoji.length != 0 ){
						for(var j = 0; j < aEmoji.length; j++){
							oHtml = oHtml.replace(aEmoji[j],this.imgJson[aEmoji[j]]);
						}
					}
					if( aEmojiSystem ){
						for(var j = 0; j < aEmojiSystem.length; j++){
							if(!aEmojiSystem[j].match(patt)){
								 var strs = aEmojiSystem[j].match(/\\u[a-z0-9A-Z]{4}/g);
								 for(var x = 0; x < strs.length; x++){
								 	oHtml = oHtml.replace(strs[x],unescape(strs[x].replace(/\\/g,"%")));
								 }
							} else {
								var oImg = "<img src='emoji/2x/" + toUnicode(aEmojiSystem[j]) + ".png' style='width:40px; height:40px; transform:scale(0.7); margin:0;'>";
								oHtml = oHtml.replace(aEmojiSystem[j],oImg);
							}
						};
					}
						
					
					html += oHtml;
					this.meassageCommentList.push(data[i]);
				};
				var oul = this.commentPage.find('ul').append(html);
				this.commentPage.find(".find-message").after(oul);

				function toUnicode(str){
					var h = "0x" + str.substr(str.indexOf("u")+1,4);
					var l = "0x" +  str.substr(str.lastIndexOf("u")+1,4);
					var code = (Number(h) - 0xD800) * 0x400 + 0x10000 + Number(l) - 0xDC00;
					return code.toString(16);
				}
			},
			//========添加表情=========
			// addemojis:function(){
			// 	var self = this;
			// 	var aEmoji = $("div.emoji").find("span");
			// 	if(this.flag){
			// 		this.publishField.css("margin-bottom","53%");
			// 		$("div.emoji").removeClass("hidden");
			// 		this.publishField.find("div.commentContent").focusout();
			// 		this.publishField.find("img").attr("src","images/jianpan.png");
			// 		$("img.delete_e").on("click",function(){

			// 		});
			// 		this.flag = false;
			// 	} else {
			// 		this.publishField.css("margin-bottom","0");
			// 		$("div.emoji").addClass("hidden");
			// 		this.publishField.find("div.commentContent").focus();
			// 		this.publishField.find("img").attr("src","images/smile.png");
			// 		this.flag = true;
			// 	}
			// 	this.publishField.find("div.commentContent").focus(function(){
			// 		self.publishField.css("margin-bottom","0");
			// 		$("div.emoji").addClass("hidden");
			// 		self.publishField.find("img").attr("src","images/smile.png");
			// 		self.flag = true;
			// 	});

			// 	for(var i = 0; i < aEmoji.length; i++){
			// 		aEmoji[i].onclick = function(){
			// 			var oImg = document.createElement('span');
			// 			oImg.dataset.id = this.dataset.id;
			// 			oImg.className = "ecom e_" + this.dataset.id;
			// 			oImg.style.cssText = "display:inline-block; width:24%;";
			// 			self.publishField.find("div[contenteditable=true]").append(oImg);
			// 		}
			// 	}
			// },
			addComment:function(content){
				var self=this,
					reurl=window.location.href,
       				index = reurl.lastIndexOf('/') + 1,
       				Reurl = reurl.substring(index);

       				if( content.match(/\[.{1,2}\]/g) ){
       					var contentReplace = content.match(/\[.{1,2}\]/g);
       					var contentRes = content;
       					for(var i = 0; i < contentReplace.length; i++){
       						contentRes = contentRes.replace(contentReplace[i],self.imgJson[contentReplace[i]]);
       					}
       				} else {
       					var contentRes = content;
       				}

				var parms={
					time:self.addZero(new Date().getHours()) +":"+self.addZero(new Date().getMinutes()),
					day:new Date().getFullYear() +"年" + self.addZero(new Date().getMonth() + 1) + "月"+self.addZero(new Date().getDate())+"日",
				}
				Reurl=Reurl.replaceAll('?','||').replaceAll('=','__').replaceAll('&','#');
				var oli="<li>\
						<a href='public_home.html?id="+self.userInfor.id+"&reurl="+Reurl+"' class='left-item fl'>\
							<img class='user-icon fl' src="+this.userInfor.portrait+">\
						</a>\
						<span class='user'>"+this.userInfor.name+"</span>\
						<span class='issue-time'>  " + parms.day + "<span class='time'>  " + parms.time + "</span></span>\
						<span class='replay'><span class='content'> " + contentRes + "</span></span>\
					</li>";
				this.commentPage.find("ul").prepend(oli);
				$('html,body').animate({scrollTop:self.$top.height() + self.$wrap.height() + self.praiseWarp.height() + 10}, 0);
				//点击添加之后评论数量显示
				var commentNum = parseInt(this.commentPage.find('.num').text());
				this.commentPage.find(".find-message").find("span.num").text(commentNum+1);
				//清空文本框
				this.publishField.find("input").val("");
			},
			promptDialog:function(msg){
				layer.open({
			          content: msg,
			          btn: ['OK']
			    });
			},
			//========悬浮框点赞=========
			tooltipPraiseAjax:function(){
				var id = parseInt($.getUrlVar('id'));
				Message.userInfor.isLogined == true ? praise() : $.login("是否登录");
				function praise(){
					Message.publishField.find('[data-type=love]').hasClass('love-after') ? promptDialog('已经点过赞啦') : like();
				}
		       	function like(){
		        	var option={
			            url:MoonduDomain+'/MNews/MNewLike',
			            data:{newid:id,name:Message.userInfor.name,page:1},
			            callback:function(res){
			            	if (res.Result) {
								Message.praise()
							}
			            }
		        	}
		        	$.md.ajaxurl(option);
		        }
		        function promptDialog(msg){
		        	layer.open({
			          content: msg,
			          btn: ['OK']
			      });
		        }
			},
			//============获取资讯详情=========
			getMessageAjax:function(){
				var self = this;
				var id = parseInt($.getUrlVar('id'));
				var option={
		            url:MoonduDomain+'/MNewsB/NewDetail',
		            data:{newid:id},
		            callback:function(res){
		            	if (res.Result) {
		            		//判断是活动还是资讯 1-活动  2-资讯
		            		var type = parseInt(res.Data.Type);
							self.messageRender(res.Data);
						};
		            }
		        }
		       	$.md.ajaxurl(option);
			},
			//========获取点赞用户的信息========
			getDeliverPraiseAjax:function(){
				var self = this;
				var id = parseInt($("#postID").val());
		       	var option={
		            url:MoonduDomain+'/MnewsB/LikeList',
		            data:{newid:id,pagesize:100},
		            callback:function(res){
		            	if (res.Result) {
		            		self.photoPraiseRender(res.Data.Rows);
						};
		            }
		        }
		       	$.md.ajaxurl(option);
			},
			//=======分享照片调用用户信息接口=====
			shareUserInformationAjax:function(){
				var self = this;
				var uid = this.userInfor.id;
				var option={
		            url:MoonduDomain + '/Home/ShareUserInfos',
		            data:{uid:uid},
		            callback:function(res){
		            	if (res.Result) {
							self.shareLink();
						};
		            }
		        }
		       	$.md.ajaxurl(option);
			},
			//判断当前资讯是否已经点赞
			isCurrentMessageLike:function(boolean){
				var self = this,id = parseInt($.getUrlVar('id')),flag = boolean;
				flag ? praiseState() : this.publishField.find('[data-type=love]').addClass('love').removeClass('love-after');
				function praiseState(){
					var option = {
			            url:MoonduDomain+'/MNewsB/IsLike',
			            data:{newids:id},
			            callback:function(res){
			            	if (res.Result) {
			            		parseInt(res.Data[0]) == id ? self.publishField.find('[data-type=love]').addClass('love-after').removeClass('love') 
			            		: self.publishField.find('[data-type=love]').addClass('love').removeClass('love-after');
							}
			            }
			        }
			       	$.md.ajaxurl(option);
				}
			},
			//========判断评论是否发表成功=========
			deliverCommentAjax:function(){
				var htmlContent = this.publishField.find('div.commentContent').html();
				htmlContent.match(/\<.*\>/g);
				var str = "";
				for(var i = 0; i < htmlContent.length; i++){
					str += this.eJson[htmlContent[i].alt];
				}
				var content = str + this.publishField.find('div.commentContent').text(),
					id = parseInt($.getUrlVar('id')),
					self = this,
					name = this.userInfor.name,
					userId = this.userInfor.id,
					height = self.$wrap.height() + self.praiseWarp.height() + $('.blank').height();


				this.userInfor.isLogined == true ? comment() : $.login("是否登录");
				function comment(){
					$.trim(content) == '' ? promptDialog('亲，你还没有输入内容哦！') : success();
				}
				function success(){
					var option={
			            url:MoonduDomain+'/MNews/CommPost',
			            data:{newid:id,content:content},
			            callback:function(res){
			            	if (res.Result) {
			            		$(document).trigger("scroll");
			            		$(document).scrollTop(height);
			            		self.addComment(content);
							}
			            }
		        	}
		       		$.md.ajaxurl(option);
				}
			},
			//=========获取评论列表==========
			commentAjaxManager:function(page){
				var self = this,
					id = $.getUrlVar('id')
		       	var option={
		            url:MoonduDomain+'/MNewsB/CommList',
		            data:{action:'list_news',newid:id,pageindex:page,pagesize:20},
		            callback:function(res){
		            	if (res.Result) {
		            		if (res.Data.Rows.length > 0) {
		            			self.commentRender(res.Data.Rows);
		            			self.commentCallAjax = true;
		            		}else{
		            			self.cpage = -1;
		            		}
						};
		            }
		        }
		       	$.md.ajaxurl(option);
			}
		}
		//程序主入口
		var MainEntrance={

			init:function(){

				var flag = $("body").attr("data-fn");
				if (flag == "message") { Message.init() }
				if (flag == "view")    { View.init()}
				if (flag == "activityDetail") {Activity.init()};
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