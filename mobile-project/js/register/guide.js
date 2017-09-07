MZ.domReady = function () {
		var sex = "";
		var gang = "";
		var likes = "";

		$("#sex a").on("click", function () {

			$(this).parents("#sex").find("a").removeClass("activ");
			$(this).addClass("activ");
		});
		$("#gang a,#likes a").on("click", function () {
			if ($(this).attr("class") == "activ") {
				$(this).removeClass("activ");
			}
			else {
				$(this).addClass("activ");
			}
		});

		$(".pub_bnt").on("click", function () {
			//验证性别

			if ($("#sex").find(".activ").size() == 0) {
				sex = 2;
			}
			else {
				sex = $("#sex").find(".activ").attr("data-value");

			}
			//验证帮派
			if ($("#gang").find(".activ").size() == 0) {
				$.$.alert("你想加入？");
				return false;
			}
			else {
				$("#gang").find(".activ").each(function (index, element) {
					if (index == 0) {
						gang = $(this).attr("data-value");
					}
					else {
						gang += " " + $(this).attr("data-value");
					}

				});
			}
			//喜欢标签
			if ($("#likes").find(".activ").size() == 0) {
				$.$.alert("请选择你的喜欢");
				return false;
			}
			else {
				$("#likes").find(".activ").each(function (index, element) {

					if (index == 0) {
						likes = $(this).text();
					}
					else {
						likes += " " + $(this).text();
					}
				});
			}
			$.ajax({
				type: 'post',
				url: '/UserCenter/SaveGuide',
				datatype: 'json',
				data: { sex: sex, gang: gang, likes: likes },
				success: function (result) {
					if (result.Result) {
						$.$.alert(result.Msg);
						//根据返回值进行跳转
						location.href = "/home";
					} else {
						$.$.alert(result.Msg);
					}
				}
			});
		});
	}