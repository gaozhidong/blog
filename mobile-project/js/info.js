$(function () {

    var user_info = document.getElementById("user_info").innerHTML,
        tag_choice = document.getElementById("tag_choice").innerHTML,
        uesr_province = document.getElementById("uesr_province").innerHTML,
        uesr_city = document.getElementById("uesr_city").innerHTML,
        uesr_area = document.getElementById("uesr_area").innerHTML,
        sign_info = document.getElementById("sign_info").innerHTML,
        like_info = document.getElementById("like_info").innerHTML,
        likeHTML = "",
        signHTML = "",
        infoHTML = "", 
        choiceHTML = "",
        provinID = "",
        cityID = "",
        campArr = [],
        tagArr = [],
        campString = "",
        tagString = "",
        Uname = "",
        Uproid = "",
        Ucityid = "",
        Udisid = "",
        Utag = "",
        Uimg = "",
        Ugids = "",
        Usex = "",
        horoID = "",
        horo = "",
        mytag = [],
        hotag = [],
        count=0,
        proTxt="",
        areaID = "";
        sign="",
        sex="",
        like="",
        name="",
        age="",
        tag="",
        local="";

    //================判断当前页面用户是否已经登录=============
    function getCurrentUserInforAjax() {
        var option = {
            url: MoonduDomain + '/UserCenter/GetUserInfo',
            callback: function (res) {
                if (res.Result == "nologin") {
                    $.alert("请您重新登录！");
                    location.href = "login_after.html";
                };
               if (res.Result) {
                    var uid=res.Data.Uid;
                    info();
                     //====================================标签=================================

                    $(".p_form_info").on('click', '#itemtag', function () {
                        myTag();
                        hotTag();
                        $('#info_wrap').addClass('hidden');
                        $('#tag_wrap').removeClass('hidden');


                        //=============比较标签是否是已选中===========
                        var arr1 = [];
                        for (var s in hotag) {
                            for (var x in mytag) {
                                if (hotag[s] == mytag[x]) {
                                    arr1.push(hotag[s]);
                                }
                            }
                        }

                        var hotlist = $("#hot").find(".hot_tags_list span");
                        for (j = 0; j < hotlist.length; j++) {
                            for (i = 0; i < arr1.length; i++) {
                                if ($(hotlist[j]).text().trim() === arr1[i]) {
                                    $(hotlist[j]).removeClass("tags").addClass("tag_color");
                                }
                            }
                        }

                    });


                    //================获取标签内容==========
                    $("#tagBack").on('click', function () {
                        var tagList = $(".p_tags_list");
                        var aa = "";
                        for (var i = 0; i < tagList.length; i++) {
                            aa += ($(tagList[i]).find("span").text()) + ",";
                        }
                        tagString = $.trim(aa.replaceAll(",", " "));
                        $("#s_tag").html(tagString);
                        $("#tag_wrap").addClass('hidden');
                        $("#info_wrap").removeClass('hidden');
                    })
                    //=================删除标签============
                    $('.p_mytags').on('click', '.tag_delete', function () {

                        var b = $('.tag_delete').attr("name");

                        $(this).parent(".p_tags_list").remove();
                        var hotlist = $("#hot").find(".hot_tags_list span");
                        for (i = 0; i < hotlist.length; i++) {
                            if ($(hotlist[i]).text().trim() === b) {
                                $(hotlist[i]).removeClass("tag_color").addClass("tags");
                            }
                        }
                    });


                    //================追加标签=============
                    $("#hot").on('click', '.hot_tags_list', function () {
                        var i = $(this).text();

                        var temp = '<div class="p_tags_list">' +
                              '<span>' + i +
                              '</span>' +
                              '</div>';

                        if ($(this).find("span").hasClass("tag_color")) {
                        }
                        else {
                            $(this).find("span").removeClass("tags").addClass("tag_color");
                            $("#tag").append($(temp));
                        }

                    });
                    //=============点击增加删除按钮===========
                    $(".p_mytags").on('click', '.p_tags_list', function () {

                        var n = $(this).text();
                        $(this).append('<a href="javascript:;" class="tag_delete" name=""></a>');
                        $('.tag_delete').attr("name", n);
                    });




                    //============================更换头像========================
                    $(".p_form_info").on("click", "#datepicker1", function () {
                        $.alert("请前去应用中心下载梦族官方应用");
//                        if (uid != " ") {
//                            TakePhoto.prototype.takePhoto(
//                                    'date',
//                                    function (r) {
//                                        var r = $.parseJSON(r);
//                                        if (r.Result == true) {
//                                            var photo = r.Data.PHOTO;
//                                            pid = r.Data.PID;
//                                            Photos = ImgDomain + photo;
//                                            //===================修改头像=================          
//                                            $("#datepicker1").find(".p_user_head img").attr("src",Photos);
//                                        }
//                                        else {
//                                            $.alert("上传照片失败！");
//                                        }
//                                    },
//                                    function (e) {
//                                    },
//                                     [{ "key": "123", "cuscode": uid, "scode": "789", "hphoto": "1", "upurl": MoonduDomain}]
//                                );
//                        }
                    });


                    //====================================个性签名==============================

                    $(".p_form_info").on('click', '#itemsign', function () {

                        $('#info_wrap').addClass('hidden');
                        $('#sign_wrap').removeClass('hidden');

                    });

                    $("#signBack").on('click', function () {
                        $("#sign_wrap").addClass('hidden');
                        $("#info_wrap").removeClass('hidden');
                        var text = $("#sign_content textarea").val();
                        $("#s_sign").html(text);
                    })



                    //=======================================性别=============================
                    $(".p_form_info").on('click', '#itemsex', function () {

                        $('#info_wrap').addClass('hidden');
                        $('#sex_wrap').removeClass('hidden');
                        var htxt=$.trim($("#s_sex").html());
                        var findId = $(".u_sex").find("li");
                        for (i = 0; i < findId.length; i++) {
                            if ($.trim($(findId[i]).text()) === htxt) {
                                $(findId[i]).find("a").addClass("p_ico_choice");
                            }
                        }

                    });

                    $(".infohide").on('click', function () {
                        $("#sex_wrap").addClass('hidden');
                        $("#info_wrap").removeClass('hidden');
                    })

                    //====================选择男女==============
                    $('.u_sex').on('click', 'li', function () {
                        var cur = $(this).index();
                        $(this).parent("ul").find("a").removeClass("p_ico_choice");
                        $(this).find("a").addClass("p_ico_choice");
                        var sex = $(this).text();
                        $("#s_sex").html(sex);
                    });




                    //===================================星座================================
                    $(".p_form_info").on('click', '#itemhoro', function () {

                        $('#info_wrap').addClass('hidden');
                        $('#horo_wrap').removeClass('hidden');
                        var htxt=$.trim($("#s_horo").html());
                        var findId =$(".u_horo").find("li");
                        for (i = 0; i < findId.length; i++) {
                            if ($.trim($(findId[i]).text()) === htxt) {
                                $(findId[i]).find("a").addClass("p_ico_choice");
                            }
                        }


                    });


                    //===========点击星座页面===============
                    $('.u_horo').on('click', 'li', function () {
                        $(this).parent("ul").find("a").removeClass("p_ico_choice");
                        $(this).find("a").addClass("p_ico_choice");
                        var ele = $(this).text();
                        $("#s_horo").html(ele);
                    });


                    //=============点击星座返回按钮=============
                    $("#horoBack").on('click', function () {
                        $("#horo_wrap").addClass('hidden');
                        $("#info_wrap").removeClass('hidden');
                        var choice = $(".u_horo .p_ico_choice");
                        horoID = $(choice).parent("li").attr("id");
                    })




                    //=====================================爱好===============================

                    $(".p_form_info").on('click', '#itemlike', function () {
                        $('#info_wrap').addClass('hidden');
                        $('#like_wrap').removeClass('hidden');
                    });

                    $("#likeBack").on('click', function () {
                        $("#like_wrap").addClass('hidden');
                        $("#info_wrap").removeClass('hidden');
                        var text = $("#like_content textarea").val();
                        $("#s_like").html(text);
                    })

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



                    //=====================================阵营===================================

                    $(".p_form_info").on('click', '#itemcamp', function () {
                        $('#info_wrap').addClass('hidden');
                        $('#camp_wrap').removeClass('hidden');
                        gid= Ugids.split(",");
                        var findId=$(".u_camp").find("li");
                         for (i = 0; i < findId.length; i++) {
                            for (j = 0; j < gid.length; j++) {
                                    if ($(findId[i]).attr("id") === gid[j]) {
                                        $(findId[i]).find("a").addClass("p_ico_choice");
                                    }
                                }
                        }

                    });

                    //========获取阵营内容===========
                    $('.u_camp').on('click', 'li', function () {
                        $(this).find('a').toggleClass('p_ico_choice');

                    });

                    $("#campBack").on("click", function () {
                        $("#camp_wrap").addClass('hidden');
                        $("#info_wrap").removeClass('hidden');
                        $("#s_camp").html($(".u_camp  .p_ico_choice").parent("li").text());
                        var campList = $(".u_camp .p_ico_choice");
                        for (i = 0; i < campList.length; i++) {
                            campArr.push($(campList[i]).parent("li").attr("id"));
                        }
                        campString = campArr.join(',');


                    })

                    


                    //============================提交个人信息页面==============================

                    $("#submit").on("click", function () {

                        sign = $("#s_sign").text();
                        sex = $.trim($("#s_sex").text());
                        like = $("#s_like").text();
                        name = $("#username").val();
                        age = $("#age").val();
                        tag = $.trim($("#s_tag").html());

                        if (sex == '女') {
                            sex = 0;
                        }
                        else {
                            sex = 1;
                        }

                        if (name == "") {
                            name = Uname;
                        };


                        if (provinID == "" || cityID == "" || areaID == "") {
                            local = Uproid + ',' + Ucityid + ',' + Udisid;
                        }
                        else {
                            local = provinID + ',' + cityID + ',' + areaID;
                        }

                        if (campString == "") {
                            campString = Ugids;
                        }
                        if (horoID == "") {
                            horoID = horo;
                        }
                        commit();
                    });

                }
            }
        }
        $.md.ajaxurl(option);
    }
    getCurrentUserInforAjax();


    //============================基本信息模板渲染=======================
    function info() {
        var option={
            url: MoonduDomain + '/UserCenter/GetUserInfo',
            callback: function (data) {
                data = data.Data;
                if (data.Result == false) {
                    return;
                }
                Uname = data.UserNick;
                Uproid = data.Proid;
                Ucityid = data.Cityid;
                Udisid = data.Disid;
                Utag = data.Tag;
                Ugids = data.Gids;
                Usex = data.Sex;
                Uimg = data.Image;
                //信息页面
                var template = new EJS({ "text": user_info });
                infoHTML += template.render(data);
                $(".p_form_info form").html(infoHTML);
                //签名页面
                var template1 = new EJS({ "text": sign_info });
                signHTML += template1.render(data);
                $(".p_content").html(signHTML);

                //爱好页面
                var template2 = new EJS({ "text": like_info });
                likeHTML += template2.render(data);
                $("#like_content").html(likeHTML);


                if (data.Image == ""||data.Image=="http://zoneimages.moonbasa.com/images/user.jpg") {
                    $(".p_form_info").find(".p_user_head img").attr("src", "images/user.jpg");
                }

                //=============判断男女===============
                if (data.Sex == 0) {
                    $("#s_sex").html("女")
                }
                else {
                    $("#s_sex").html("男")
                }
                getAge();


                //=============判断星座===============
                horo = data.Cid;
                if(horo==0){
                    $("#s_horo").html("");
                }
                //$.alert(horo)
                switch (horo) {
                    case 1:
                        $("#s_horo").html("白羊座");
                        break;
                    case 2:
                        $("#s_horo").html("狮子座");
                        break;
                    case 3:
                        $("#s_horo").html("双子座");
                        break;
                    case 4:
                        $("#s_horo").html("天蝎座");
                        break;
                    case 5:
                        $("#s_horo").html("水瓶座");
                        break;
                    case 6:
                        $("#s_horo").html("金牛座");
                        break;
                    case 7:
                        $("#s_horo").html("巨蟹座");
                        break;
                    case 8:
                        $("#s_horo").html("天秤座");
                        break;
                    case 9:
                        $("#s_horo").html("双鱼座");
                        break;
                    case 10:
                        $("#s_horo").html("处女座");
                        break;
                    case 11:
                        $("#s_horo").html("摩羯座");
                        break;
                    case 12:
                        $("#s_horo").html("射手座");
                        break;
                }


                //===========所在帮派==============
                if (Ugids.indexOf(40) > -1) {
                    $(".p_form_info").find("#s_camp").append(" 星秀场 ");
                }
                if (Ugids.indexOf(41) > -1) {
                    $(".p_form_info").find("#s_camp").append(" 搭配帮 ");
                }
                if (Ugids.indexOf(42) > -1) {
                    $(".p_form_info").find("#s_camp").append(" 设计党 ");
                }

            }
        }
        $.md.ajaxurl(option);
    }
    //================提交修改信息================
    function commit(){
         $.ajax({
            url: MoonduDomain + '/UserCenter/SaveEditNew',
            type: "GET",
            dataType: "jsonp",
            data: { UserNick: name, Description: sign, Sex: sex, Age: age, Cid: horoID, Interest: like, Address: local, Gid: campString, Tag: tag },
            success: function (data) {
                if (data.Result == true) {
                     $.alert("信息编辑成功！");
                }
                else {
                     $.alert("输入有误！")
                }
            }

        });
    }


    //==================================我的标签===============================
    function myTag() {
        var tag = $("#s_tag").html();
        mytag = tag.split(" ");
        var html = "";
        if(tag!=""){
            for (i = 0; i < mytag.length; i++) {
                html += '<div class="p_tags_list"><span>' + mytag[i] + '</span></div>';
            }
        }
        
        $("#tag_wrap").find("#tag").html(html);
    }

    //====================================热门标签==============================

    function hotTag() {
        hotag = hot_tag.split(",");
        var html = "";
        for (i = 0; i < hotag.length; i++) {
            html += '<div class="hot_tags_list"><span class="tags">' + hotag[i] + '</span></div>';
        }
        $("#tag_wrap").find("#hot").html(html);
    }


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

                    var pid = Uproid.toString();
                    var findId = $(".u_province").find("li");
                    for (i = 0; i < findId.length; i++) {
                        if ($(findId[i]).attr("id") === pid) {
                            $(findId[i]).find("a").addClass("p_ico_choice");
                        }
                     }
            }
        }
        $.md.ajaxurl(option);
    }

    //================所在地城市模板渲染==========
    function city() {
        var cityHTML = "";
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


});





    //==================个性签名多行文本输入框剩余字数计算===========
        function checkMaxInput(obj, maxLen) {  
            if (obj == null || obj == undefined || obj == "") {  
                return;  
            }  
            if (maxLen == null || maxLen == undefined || maxLen == "") {  
                maxLen = 30;  
            }  
  
            var strResult;  
            var $obj = $(obj);  
            var newid = $obj.attr("id") + 'msg';  
  
            if (obj.value.length > maxLen) { //如果输入的字数超过了限制  
                obj.value = obj.value.substring(0, maxLen); //就去掉多余的字  
                strResult = '<span id="' + newid + '" class="p_sign_span"  >' + (maxLen - obj.value.length) + '</span>'; //计算并显示剩余字数  
            }  
            else {  
                strResult = '<span id="' + newid + '" " class="p_sign_span"  >' + (maxLen - obj.value.length) + '</span>'; //计算并显示剩余字数  
            }  
  
            var $msg = $("#" + newid);  
            if ($msg.length == 0) {  
                $obj.after(strResult);  
            }  
            else {  
                $msg.html(strResult);  
            }  
        }  
  
        //==================清空剩除字数提醒信息======================  
        function resetMaxmsg() {  
            $("span.Max_msg").remove();  
        } 

    //========================根据出生日期计算年龄==================
        function getAge(){
                    var age;
                    var aDate=new Date();
                    var thisYear=aDate.getFullYear();
                    var thisMonth=aDate.getMonth()+1;
                    var thisDay=aDate.getDate();
                    var brith=document.getElementById("age").value;
                    brithy=brith.substr(0,4);
                    brithm=brith.substr(5,2);
                    brithd=brith.substr(7,2);
                    if(thisYear-brithy<0)
                    {
                           $.alert("输入错误!");
                           age="";
                    }
                    else
                    {
                        age = thisYear-brithy;

                    }
                    document.getElementById("age").value=age;
        }




        

    //=====================帮助页面点击上下切换=======================
            $('.help_wrap').on('click','.p_issue',function(){
                var oDiv=$(this);
                if(oDiv.next('.p_issue_txt').is(':hidden')){
                    oDiv.next('.p_issue_txt').show();
                    var i=$(this).attr("id");
                    $(this).find('a').addClass('p_issue_ico_up');
                    $(this).find('div.p_ico_left').addClass('p_ico_down');
                    
                }
                else{
                    oDiv.next('.p_issue_txt').hide();
                    var i=$(this).attr("id");
                    $(this).find('a').removeClass('p_issue_ico_up').addClass('p_issue_ico_down');
                    $(this).find('div.p_ico_left').removeClass('p_ico_down').addClass('p_ico_left');
                }
            })



    



