$(function () {
    /*用户登录*/
    $("#txtTel").val(window.localStorage.username);
    $("#btn_login").bind("click", function () {
        var username = $("#txtTel").val();
        var password = $("#txtPwd").val();
        if (username == "" || password == "") {
            $.alert("用户名或者密码为空！");
        };
        if (username != "" && password != "") {
            $.ajax({
                url: MoonduDomain + '/Utility/AppLogin',
                type: "GET",
                dataType: "jsonp",
                data: { mobile: username, pwd: password },
                success: function (res) {
                    if (res.Result) {
                        window.localStorage.DefaultCusCode = res.Data;
                        window.localStorage.Encryp = res.Code.replace("+", "%2B");
                        window.localStorage.username = res.Data.split(',')[1];
                        $.cookie("DefaultCusCode", res.Data, { expires: 1, secure: false, path: '/' });
                        var url = document.referrer;
                        if (url != '') {
                            url = url.substr(url.lastIndexOf("/") + 1, url.length);
                            if (url.indexOf("?") > 0) {
                                //url = url.split("?")[0];
                                location.href = url;
                            } else if (url == "login.html" || url == "login_after.html") {
                                window.location.href = 'index.html';
                            } else {
                                location.href = url;
                            }
                        } else {
                            window.location.href = 'index.html';
                        }
                    } else {
                        $.alert("登录失败,请重新登录");
                    }
                },
                error: function () {
                    console.log("fail");
                }
            });
        };
        return false;
    })

    // 删除图标
    $("#txtTel").bind("input", function () {
        if ($("#txtTel").val().trim() != "") {
            $("#txtTel").parent(".phone").find(".p_icon_close img").removeClass("hidden");
        }
        else {

        }
    })

    $("#txtPwd").bind("input", function () {
        if ($("#txtPwd").val().trim() != "") {
            $(this).parent().find(".p_icon_close img").removeClass("hidden");
        }
        else {

        }

    })
    $(".p_item").on("click", ".p_icon_close", function () {
        $(this).parent().find("input").val("");
    })

})