$(function(){
	var phone="";
	var code="";

	$("#modifyWrap").on("blur","#Phone",function(){
		phone=$("#Phone").val();

		if(phone.length==0){
			$.alert("请输入手机号码！");
		}
		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
		if(!myreg.test(phone)){
			$.alert('请输入有效的手机号码！'); 
		 }  
	})

	$("#verifyCode").on("blur",function(){
		code=$("#verifyCode").val();
		if(code==""){
			$.alert("请输入验证码！")
		}
		else{

			}
		})

	$("#modifyWrap").on("click","#getVerifyCode",function(){	
		Scode();
	})


	$("#modifyWrap").on("click","#Submit",function(){
		if(phone==""||code==""){
			$.alert("手机号和验证码不能为空");
		}else{
			CheckCode();
		}		
	})


	$("#newWrap").on("blur","#newPwd",function(){
		var newPwd=$("#newPwd").val();
		if(newPwd.length==0){
			$.alert("密码不能为空！");
		}
		else if(newPwd.length < 6 || newPwd.length > 16){
			$.alert("密码请设为6-16位！");
		}

		var reg = /^[0-9a-zA-Z]*$/;
		if(!reg.test(newPwd)){
			$.alert("密码只能由数字和字母组成");
		} 
	})

	$("#repeatPwd").on("blur",function(){
		var repeatPwd=$("#repeatPwd").val();
		var newPwd=$("#newPwd").val();
		if(repeatPwd.length==0){
			$.alert("请重复新密码");
		}
		else if(repeatPwd!=newPwd){
			$.alert("密码不一致！");
		}
	})

	$("#newWrap").on("click","#Save",function(){
		modifyCode();
	})



	

	//========获取验证码ajax=========
	function Scode(){
		var option={
			url:MoonduDomain+'/Utility/SecurityCode',
			data:{mobile:phone},
			callback: function(data){
				if(data.Result==true){
					if (phone.length==0) {
						$.alert("手机号不能为空");
					}
					else{
						$.alert("验证码获取成功");
					}
				}
				else{
					$.alert("重新获取验证码");
				}
			}
		}
		$.md.ajaxurl(option);
	}

	//=========验证验证码ajax=======
	function CheckCode(){
		var option={
			url:MoonduDomain+'/Utility/CheckVerifyCode',
			data:{mobile:phone,verifycode:code},
			callback: function(data){
				if(data.Result==true){
						$("#modifyWrap").addClass("hidden");
						$("#modifyTop").addClass("hidden");
						$("#newpage").removeClass("hidden");
						$("#newWrap").removeClass("hidden");		
				}
				else{
					$.alert("验证码输入有误");
				}
			}
		}
		$.md.ajaxurl(option);

	}

	//=========修改密码ajax========
	function modifyCode(){
		var newPwd=$("#repeatPwd").val();
		var option={
			url:MoonduDomain+'/Utility/ModifyPwd',
			data:{mobile:phone,newpwd:newPwd},
			callback: function(data){
				if(data.Result==true){
					$.alert("修改成功");
				}
				else{
					$.alert("验证码输入有误");
				}
			}
		}
		$.md.ajaxurl(option);
	}

	


})