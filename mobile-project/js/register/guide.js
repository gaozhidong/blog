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
			//��֤�Ա�

			if ($("#sex").find(".activ").size() == 0) {
				sex = 2;
			}
			else {
				sex = $("#sex").find(".activ").attr("data-value");

			}
			//��֤����
			if ($("#gang").find(".activ").size() == 0) {
				$.$.alert("������룿");
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
			//ϲ����ǩ
			if ($("#likes").find(".activ").size() == 0) {
				$.$.alert("��ѡ�����ϲ��");
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
						//���ݷ���ֵ������ת
						location.href = "/home";
					} else {
						$.$.alert(result.Msg);
					}
				}
			});
		});
	}