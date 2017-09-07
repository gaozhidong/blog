$(function () {
	
    $("body").on('blur', "#txtMobile", function () {
        var mobile = $("#txtMobile").val();
        if (mobile == "") {
            $.alert("输入的手机号码不能为空.");
        }
        else if (!ML.Validator.IsMobile(mobile)) {
            $.alert("您输入的手机号码不符合规范");
        }
        else {
            $.md.ajaxurl({
                url: MoonduDomain + '/Utility/CheckMobile',
                data: {mobile: mobile },
                callback: function (str) {
                    if (typeof (str) != 'undefined') {
                        if (str.Result == false) {
                            $.alert("该手机号已经注册.");
                        }
                        else if (str.Result == true) {
                            console.log("手机号可以使用.");
                        }
                    }
                    else {
                        $.alert("系统异常请稍后再试！");;
                    }
                }
            });
        }
    })

    $("body").on("blur", "#txtRegPwd", function () {
        var pwd = $("#txtRegPwd").val();
        var vpwdResult = VPWD.Check(pwd);
        if (ML.Validator.IsEmptyOrNull(pwd)==false) {
            $.alert("密码不能为空.");
        }
        else if (pwd.length < 8 || pwd.length > 20) {
            $.alert("密码请设为8-20位字母和数字！");
        }
        else if (vpwdResult == 1) {
            $.alert("密码太弱，有被盗风险，请设置为多种字符组成的复杂密码！");
        }
        else {
        }
    })

    /*获取验证码*/
    $("body").on("click", "#getVerifyCode", function () {
        var mobile = $("#txtMobile").val();
        var code=$("#verifyCode").val();
        $.md.ajaxurl({
            url: MoonduDomain + '/Utility/SecurityCode',
            data: {mobile: mobile },
            callback: function (str) {
                if (typeof (str) != 'undefined') {

                    if (str.Result == true) {
                        $.alert("获取验证码成功.请查看手机短信.");
                        
                    } else {

                    }
                } else {
                    $.alert("数据发送存在异常，请稍等重新发送.");
                }
            }
        })
    });


function register(){
    var mobile = $("#txtMobile").val();
    var pwd = $("#txtRegPwd").val();
    var verifyCode = $("#verifyCode").val();
    $.md.ajaxurl({
        url: MoonduDomain + '/Utility/AppRegister',
        data:{mobile:mobile,pwd:pwd,verifyCode:verifyCode },
        callback: function (str) {
            if (typeof (str) != "undefined") {
                if (str.Result == true) {
                    window.location.href = 'lead.html';
                } else {
                    $.alert("注册失败.");
                }
            }
            else {
                if (str.Result == false) {
                    $.alert("数据传输异常，注册失败！");
                }
            }
        }
    });
}



/*用户注册*/
$("body").on("click", "#btn_register", function () {
    var mobile = $("#txtMobile").val();
    var pwd = $("#txtRegPwd").val();
    var verifyCode = $("#verifyCode").val();

    if (ML.Validator.IsEmptyOrNull(mobile) == false || ML.Validator.IsEmptyOrNull(pwd) == false || verifyCode=="") {
        $.alert("输入的手机号码或密码或验证码信息不能为空.");
    }
    else{
        $.ajax({
            url:MoonduDomain+'/Utility/CheckVerifyCode',
            type:"GET",
            dataType:"jsonp",
            data:{mobile:mobile,verifycode:verifyCode},
            success: function(data){
                if(data.Result==true){
                    register();       
                }
                else{
                    $.alert("验证码输入有误");
                }
            }
        });
    }
    return false;
})

});

