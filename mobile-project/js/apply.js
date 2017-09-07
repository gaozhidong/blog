$(function(){
    var 
        uesr_province=document.getElementById("uesr_province").innerHTML,
        uesr_city=document.getElementById("uesr_city").innerHTML,
        uesr_area=document.getElementById("uesr_area").innerHTML,
        provinID="",
        cityID="",
        areaID="",
        name="",
        sex="",
        age="",
        height="",
        weight="",
        chest="",
        waist="",
        count="",
        hip="",
        Photos="",
        photoFirst="",
        address="";
    var imgpid="";
    var pidArr=[];
    var pidString="";
    var aid="";
    var uid="";


    //================判断当前页面用户是否已经登录=============
    function getCurrentUserInforAjax(){
         var option={
                url:MoonduDomain+'/UserCenter/GetUserInfo',
                callback:function(res){
                    if (res.Result == "nologin") {
                        $.login("是否登录");
                    }
                    if(res.Result==true){
                        uid=res.Data.Uid;
                        //=============性别==============
                        $(".p_form_info").on('click','#itemsex',function(){

                            $('#info_wrap').addClass('hidden');
                            $('#sex_wrap').removeClass('hidden');

                        });

                        $(".infohide").on('click',function(){
                            $("#sex_wrap").addClass('hidden');
                            $("#info_wrap").removeClass('hidden');
                        })

                        //==============选择男女============
                        $('.u_sex').on('click','li',function(){
                            var cur=$(this).index();
                            $(this).parent("ul").find("a").removeClass("p_ico_choice");
                            $(this).find("a").addClass("p_ico_choice");
                            var sex=$(this).text();
                            $("#s_sex").html(sex);
                        });

                        //=============点击信息页面的地区===========
                        $(".p_form_info").on('click', '#itemlocal', function () {
                            if(count==0){
                                province();
                            }        
                            if(count>0){
                                var pid = $.trim(proTxt);
                                var findId = $(".u_province").find("li");
                                for (i = 0; i < findId.length; i++) {
                                    if ($.trim($(findId[i]).text()) === pid) {
                                        $(".u_province").find("a").removeClass("p_ico_choice");
                                        $(findId[i]).find("a").addClass("p_ico_choice");
                                    }
                                }
                            }      
                            $('#info_wrap').addClass('hidden');
                            $('#local_wrap').removeClass('hidden');
                            count=count+1;
                        });


                        //=============点击省页面==========

                        $('.u_province').on('click', 'li', function () {

                            var id = $(this).attr("id");
                            provinID = id;
                            city();  
                            $('#local_wrap').addClass('hidden');
                            $('#city_wrap').removeClass('hidden');
                            proTxt = $(this).text();
                            $('#s_local').html(proTxt);

                        });




                        //=============点击城市页面================
                        $('.u_city').on('click', 'li', function () {

                            var id = $(this).attr("id");
                            cityID = id;
                             area();
                            $('#city_wrap').addClass('hidden');
                            $('#area_wrap').removeClass('hidden');
                            $(this).parent("ul").find("a").removeClass("p_ico_choice");
                            $(this).find("a").addClass("p_ico_choice");
                            var a = $(this).text();
                            $('#s_local').append(a);
                        });


                        //=============点击地区页面===============
                        $(".u_area").on('click', 'li', function () {
                            var id = $(this).attr("id");
                            areaID = id;
                            $(this).parent("ul").find("a").removeClass("p_ico_choice");
                            $(this).find("a").addClass("p_ico_choice");
                            var a = $(this).text();
                            $('#s_local').append(a)

                        });

                        //=============点击省市县的返回按钮================

                        $("#areaBack").on('click', function () {
                            $('#city_wrap').addClass('hidden');
                            $("#local_wrap").addClass('hidden');
                            $("#area_wrap").addClass("hidden");
                            $("#info_wrap").removeClass('hidden');
                        })

                        $("#proBack").on("click",function() {
                            $("#local_wrap").addClass("hidden");
                            $("#info_wrap").removeClass("hidden");
                        })
                        $("#cityBack").on("click",function() {
                            $('#city_wrap').addClass('hidden');
                            $("#local_wrap").addClass('hidden');
                            $("#area_wrap").addClass("hidden");
                            $("#info_wrap").removeClass("hidden");
                        })


                        //==============报名页上传照片显示隐藏===========
                        $("#Next").on("click",function(){
                            age=$("#s_age").val();
                            height=$("#s_height").val();
                            weight=$("#s_weight").val();
                            chest=$("#s_chest").val();
                            waist=$("#s_waist").val();
                            hip=$("#s_hip").val();

                            name=$("#s_name").val();
                            sex=$.trim($("#s_sex").text());      
                            var add=$.trim($("#s_local").text());
                            address=add.replace(/\s+/g, " ");
                            if(name==""||sex=="未选择"||address==""){
                                $.alert("姓名、性别、地址不能为空");
                            }
                            else{

                                $("#info_wrap").addClass("hidden");
                                $(".declare_Wrap").removeClass("hidden");
                            }
                        })

                        $(".declare_Wrap").on("click",".arrow",function(){
                            $(".declare_Wrap").addClass("hidden");
                            $("#info_wrap").removeClass("hidden");
                        })

                       

                        //===================删除图片================
                        $(".upload").on("click",".deletePic",function(){
                            var $this=$(this);
                            var deleId=$(this).attr("id");    
                            //=======删除图片ajax=========
                            $.ajax({
                                url:MoonduDomain+'/photo/DelPhoto',
                                type: "GET",
                                dataType: "jsonp",
                                data:{pid:deleId},
                                success: function(data){  
                                    if(data.Result==true){
                                        $this.parent("div.addPrepic").remove();   
                                        for(var i=0;i<=pidArr.length-1;i++){
                                            if(pidArr[i]==deleId){
                                                pidArr.splice(i,1);
                                            }
                                        }                
                                    }                
                                }
                            })
                            
                        })


                        //=================点击提交==========================
                        $(".declare_Wrap").on("click",".subBtn",function(){
                              $.alert("请前去应用中心下载梦族官方应用");
                           //  var message=$(".declaration").val();
                           //  if(sex=='男'){
                           //      sex=0;
                           //   }
                           //  else{
                           //      sex=1;
                           //  }
                           // var first=$(".upload").find(".addPrepic");
                           //  photoFirst=$(first[0]).find("img").attr("src");
                           //  if(first.length<3){
                           //      $.alert("至少上传三张图片");
                           //  }else{
                           //       $.ajax({
                           //           url:MoonduDomain+'/Mshow/SignUp',
                           //           type:"GET",
                           //           dataType:"jsonp",
                           //           data:{txtAID:aid,txtPids:pidString,txtImg_index:photoFirst,uid:uid,txtName:name,sex_select:sex,addslt:address,txtHeight:height,txtWeight:weight,txtChest:chest,txtWaist:waist,txtHip:hip,txtMessage:message,txtAge:age},
                           //           success: function(data){
                           //               if(data.Result==true){                              
                           //                      $("#dialog").removeClass("hidden");
                           //                      $("#dialog").find("hgroup").html("报名成功，请等待审核！");
                           //               }
                           //               else{
                           //                   if(data.Msg="你已参加该活动！") {
                           //                       $("#dialog").removeClass("hidden");
                           //                       $("#dialog").find("hgroup").html("您已报名过星秀场");
                           //                   }
                
                           //               }
                           //           },
                           //           error:function(data){
                           //               alert("哎呦，程序出错咯");
                           //           }
                           //       });
                           //  }
                        })

                        $("#dialog").on("click","footer",function(){
                            $("#dialog").addClass("hidden");
                            window.location.href="m-show.html";
                        })


                    }
                }
            }
        $.md.ajaxurl(option);
    }
    getCurrentUserInforAjax();


                     //================所在地省份模板渲染=============
                    function province() {
                        var  localHTML = "";
                        var option={
                            url: MoonduDomain + '/UserCenter/GetProvinces',
                            callback: function (data) {
                                var data = data.Data;
                                if (data.Result == false) {
                                    return;
                                }
                                for (var i = 0; i < data.length; i++) {
                                    var template = new EJS({ "text": uesr_province });
                                    localHTML += template.render(data[i]);
                                }
                                $(".u_province").html(localHTML);


                            }
                        }
                        $.md.ajaxurl(option);
                    }

                    //================所在地城市模板渲染==========
                    function city() {
                        var cityHTML = "";
                       // console.log(provinID);
                        var option={
                            url: MoonduDomain + '/UserCenter/GetCities',
                            data: { proid: provinID },
                            callback: function (data) {
                                if (data.Result == true) {
                                    var data = data.Data;
                                    for (var i = 0; i < data.length; i++) {
                                        var template = new EJS({ "text": uesr_city });
                                        cityHTML += template.render(data[i]);
                                    }
                                    $(".u_city").html(cityHTML);
                                }

                            }
                        }
                        $.md.ajaxurl(option);
                    }


                    //====================所在地-地区模板渲染=============
                    function area() {
                        var areaHTML = "";
                        var option={
                            url: MoonduDomain + '/UserCenter/GetDistrict',
                            data: { cityid: cityID },
                            callback: function (data) {
                                if (data.Result == true) {
                                    var data = data.Data;
                                    for (var i = 0; i < data.length; i++) {
                                        var template = new EJS({ "text": uesr_area });
                                        areaHTML += template.render(data[i]);
                                    }
                                    $(".u_area").html(areaHTML);
                                }

                            }
                        }
                        $.md.ajaxurl(option);
                    }


                //==============获取aid==========
                function Aid(){
                   $.ajax({
                        url:MoonduDomain+'/Mshow/GetCurrMshow',
                        type:"GET",
                        dataType:"jsonp",
                        success:function(data){
                            if(data.Result==true){
                                aid=data.Data.Id; 
                            }
                            
                        }
                   })
                }

                Aid();

                //==================上传照片=========================
                $(".declare_Wrap").on("click","#datepicker1",function(){
                      $.alert("请前去应用中心下载梦族官方应用");
                     // if(uid!=" "){           
                     //      TakePhoto.prototype.takePhoto(
                     //            'date',
                     //            function(r){
                     //                var r=$.parseJSON(r);
                     //                if(r.Result==true){
                     //                    var photo=r.Data.PHOTO;
                     //                    imgpid=r.Data.PID;
                     //                    pidArr.push(imgpid);
                     //                    pidString = pidArr.join(',');
                     //                    Photos = ImgDomain + photo;
                     //                    //===================添加图片=================
                     //                    var temp='<div class="addPrepic">'+
                     //                    '<img id=picstyle width="100px" height="100px" src="'+Photos+'">'+
                     //                    //'<img id=picstyle width="100px" height="100px" src="http://zoneimages.moonbasa.com/31919428/150721140342_88633.jpg">'+
                     //                    '<a href="javascript:;" class="deletePic" id="'+imgpid+'"></a>'+
                     //                    '</div>'
                     //                     $(".upload").prepend($(temp));
                     //                }
                     //                else{
                     //                    $.alert("上传照片失败！");
                     //                }
                     //            },
                     //            function(e){  
                     //            },
                     //            [{"key":"123","cuscode":uid,"scode":"789","hphoto":"2","aid":aid,"upurl":MoonduDomain}]
                     //        );
                     //     }
                    });


})