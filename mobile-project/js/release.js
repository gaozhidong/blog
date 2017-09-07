$(function () {
    var pid = "";
    var content = "";
    //================判断当前页面用户是否已经登录=============
    function getCurrentUserInforAjax() {
        var option = {
            url: MoonduDomain + '/UserCenter/GetUserInfo',
            callback: function (res) {
                if (res.Result == "nologin") {
                    $.login("是否登录");
                };
                if (res.Result) {
                    var uid = res.Data.Uid;
                    //=======点击删除标签==============
                    $('.p_addarea').on('click', '.tag_delete', function () {
                        $(this).parent(".p_tags_list").remove();
                    })

                    //===========点击添加标签=============
                    $('#add').on('click', function () {
                        var i = $('.p_r_tags').val();
                        if ($.trim(i) != "") {
                            var temp = '<div class="p_tags_list">' +
									  '<span>' + i +
									  '</span>' +
									  '<a href="javascript:;" class="tag_delete"></a>' +
									  '</div>'

                            $("#tag_show").append($(temp));
                            $('.p_r_tags').val("");
                        }else{
                            $.alert("请添加标签");
                        }

                    })

                    //==================上传照片=========================
                    $(".p_addarea").on("click", "#datepicker1", function () {
                        $.alert("请前去应用中心下载梦族官方应用");
//                        if (uid != " ") {
//                            TakePhoto.prototype.takePhoto(
//					                    'date',
//					                    function (r) {
//					                        var r = $.parseJSON(r);
//					                        if (r.Result == true) {
//					                            var photo = r.Data.PHOTO;
//					                            pid = r.Data.PID;
//					                            Photos = "http://zoneimages.moonbasa.com/" + photo;
//					                            //===================添加图片=================
//					                            var temp = '<div class="addpic">' +
//					                            '<img id=picstyle width="100px" height="100px" src="' + Photos + '">' +
//					                            //'<img id=picstyle width="100px" height="100px" src="http://zoneimages.moonbasa.com/31919428/150721140342_88633.jpg">'+
//					                            '<a href="javascript:;" class="deletePic"></a>' +
//					                            '</div>'
//					                            $(".p_addpic").html($(temp));

//					                        }
//					                        else {
//					                            $.alert("上传照片失败！");
//					                        }
//					                    },
//					                    function (e) {
//					                    },
//					                     [{ "key": "123", "cuscode": uid, "scode": "789", "hphoto": "0", "upurl": MoonduDomain}]
//					                );
//                        }

                    });


                    //===================删除图片================
                    $(".p_addarea").on("click", ".deletePic", function () {
                        var temp1 = '<a href="javascript:;" class="addimg" id="datepicker1"></a>'
                        $(".p_addpic").html($(temp1));
                    })




                }
            }
        }
        $.md.ajaxurl(option);
    }
    getCurrentUserInforAjax();

    //=======发布提交ajax=========
    function subMit() {
        var option = {
            url: MoonduDomain + '/photo/addphoto',
            data: { pid: pid, dec: content },
            callback: function (data) {
                if (data.Result == true) {
                    window.location.href = "circle.html";
                }
                else {
                    $.alert("发布失败");
                }

            }
        }
        $.md.ajaxurl(option);
    }


    $(".person_top").on("click", ".p_define", function () {
        $.alert("请前去应用中心下载梦族官方应用");
//        var arr = new Array();
//        var text = $(".p_content").find(".p_t_area").val();
//        var tagList = $(".p_tags_list");
//        var tagText = '';
//        for (var i = 0; i < tagList.length; i++) {
//            arr.push($(tagList[i]).find("span").text())
//        }

//        for (i = 0; i < arr.length; i++) {
//            tagText += '#' + arr[i] + '#';
//        }
//        if (tagText == "") {
//            $.alert("请添加标签");
//        } else {
//            if (text == "") {
//                content = tagText;
//            } else {
//                content = text + tagText;
//            }
//            subMit();
//        }

    })



})