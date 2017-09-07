            

            var 
             html="",
             showHTML="",
             dreamHTML="",
             userCommentHTML = "",
             photoHTML="",
             activeHTML="",
             voteHTML="",
             show_vote=document.getElementById("show_vote").innerHTML,
             personal_top=document.getElementById("personal_top").innerHTML,
             show_box=document.getElementById("show_box").innerHTML,
             userCommentTemp = document.getElementById("userCommentTemp").innerHTML,
             dreamTemp=document.getElementById("dreamTemp").innerHTML,
             photo_box=document.getElementById("photo_box").innerHTML,
             active_box=document.getElementById("active_box").innerHTML;

        
        //=====================TA头部模板渲染===========================
        function public_home_top(page){
            $.ajax({
                url:MoonduDomain+'/UserCenter/OtherUserInfo',
                type:"GET",
                dataType:"jsonp",
                data:{uid:"0001"},
                success: function(res){
                    var data=res.Data;
                    var template = new EJS({"text": personal_top});
                    html += template.render(data);
                    $(".person_top").html(html);

                    
                }

            });
        } 

        //================星秀场模板渲染==================

        function public_home_show(page){
            $.ajax({
                url:MshowDomain+'m_api.php',
                type:"GET",
                dataType:"jsonp",
                data:{action:'details',id:'147'},
                success: function(res){

                    var data=res.Data;
                    var template2 = new EJS({"text": show_box});
                    showHTML+=template2.render(data);
                    $(".show_wrap").html(showHTML);
                }
                
            });
        }

        //================投票模板渲染==================
         function public_show_vote(page){
            $.ajax({
                url:MoonduDomain+'/UserCenter/OtherUserInfo',
                type:"GET",
                dataType:"jsonp",
                data:{uid:"0001"},
                success: function(res){ 
                    var data=res.Data; 
                    var template= new EJS({"text": show_vote});
                    voteHTML+=template.render(data);
                    $(".show_tags").html(voteHTML);
                    
                    
                }
                
            });
        } 


        //====================梦话模板渲染=============================
        function public_home_dream(page){
            $.ajax({
                url:"data/my_dream.json",
                type:"GET",
                dataType:"json",
                success: function(res){
                    var data=res.data;
                    for(var i=0;i<data.length;i++){
                        var template3 = new EJS({"text": dreamTemp});
                        dreamHTML+= template3.render(data[i]);

                        var template4=new EJS({"text":userCommentTemp});
                            userCommentHTML += template4.render(data[i]);
                    }
                    loading_hide();
                    $(".item-wrap").append(dreamHTML);
                    $("#userComment").append(userCommentHTML);
                }   
            });
        }

        //==============相册模板渲染=====================
        function public_home_photo(page){
            $.ajax({
                url:MoonduDomain+'/photo/GetUserTagByUid',
                type:"GET",
                dataType:"jsonp",
                data:{uid:"110",page:"1"},
                success: function(res){
                    var data=res.Data.Rows;
                    for(var i=0;i<data.length;i++){
                        var template5= new EJS({"text": photo_box});
                        photoHTML+= template5.render(data[i]);
                    }
                    loading_hide();
                    $("ul.clearfix").append(photoHTML);
                }   
            });
        }

        //===========活动模板渲染=====================

        function public_home_active(page){
            $.ajax({
                url:MshowDomain+'mact_api.php',
                type:"GET",
                dataType:"jsonp",
                data:{action:'myactiv',uid:'31928116',page:page},
                success: function(data){
                    data=data.Data;
                    index_html=""; 
                    for(var i=0; i<data.length;i++) 
                        {
                            var template= new EJS({"text": active_box});
                            activeHTML+= template.render(data[i]);
                        } 
                         $(".active_area").append(activeHTML);
                      loading_hide(); 
                       
                    }
                });
        }

        public_home_top(0);
        public_home_show(0);
        public_show_vote(0);
        public_home_dream(0);
        public_home_photo(0);
        public_home_active(0);

        //==============================瀑布流========================================
            $(window).scroll(function(){
                totalheight=parseFloat($(window).height()) + parseFloat($(window).scrollTop());

                if($(document).height()<=totalheight){
                    
                        
                        cur=$(".like_style").attr("data-id");

                            if(cur==1){
                                if($(".item").size()<50){
                                    public_home_dream(0);
                                }
                                
                            }
                            else if(cur==2){
                                if($(".like_photo_area li").size()<50){
                                    public_home_photo(0);
                                }
                                
                            }
                            else if(cur=3){
                                if($(".active_content").size()<50){
                                    public_home_active(0);
                                }
         
                }
            }

            });


            function loading_show(){
                $("body").append('<div class="loading"></div>');
            }

            function loading_hide(){
                $(".loading").remove();
            }



            //=======================个人中心导航栏tab切换==================
        $('.public_nav_box a').mouseover(function(){
            var cur=$(this).index();
            $(this).addClass('like_style').siblings('a').removeClass('like_style');
            $('.p_container').eq(cur).show().siblings('div').hide();
        });



            //======================评论页弹出===================================

            $(".item-wrap").on("click",".comment",function(){
                            $(".item-wrap").addClass("hidden");
                            $("#comment-page").removeClass("hidden");
                            $("#commentLayer").removeClass("hidden");
            })

            //==================点赞================================

            $(".item-wrap").on("click",".love",function(){
                $(this).removeClass("love").addClass("love-after");
            })

            //===============取消赞===========================
            $(".item-wrap").on("click",".love-after",function(){
                $(this).removeClass("love-after").addClass("love");
            })



            //======================给TA投票====================

            $(".show_tags").on("click",".p_btn_bottom",function(){

                
                var x=$("#vote_num").html();
                x=parseInt(x)+1;
                $("#vote_num").html(x);
                $(this).removeClass("p_btn_bottom").addClass("hasVoted").text("已投票");

                var id=$(this).attr("data-uid");    
                $.ajax({
                    url:MshowDomain+'m_api.php',
                    type:"GET",
                    dataType:"jsonp",
                    data:{action:"m_vote",id:id},   
                    success: function(data){
                            
                    }               
                });

            })

            //======================给TA取消投票====================

            $(".show_tags").on("click",".hasVoted",function(){

                
                var x=$("#vote_num").html();
                x=parseInt(x)-1;
                $("#vote_num").html(x);
                $(this).removeClass("hasVoted").addClass("p_btn_bottom").text("给TA投票");             
                var id=$(this).attr("data-uid");
                
                $.ajax({
                    url:MshowDomain+'m_api.php',
                    type:"GET",
                    dataType:"jsonp",
                    data:{action:"m_vote",id:id},
                    success: function(data){
                            
                    }                       
                });

            })