/**
 * 开始只显示一个li，点击后 li-1 消失，li-2 显式， 并且把cookie传入进去， 在二的时候退出，再次进入还是二
 */
$(function () {
	var AWARD = ['a','bb','333','dddd','55','666','7777'];
	var log = console.log.bind(this)
	if(Cookies.get("Name")===undefined){
		//如果没有Name 就写入
		Cookies.set('Name',six_Number())
		Cookies.set("value",'0')
	}else{
		//如果有就判断点了几下
		let Value = Cookies.get('value')
		if(Value == 1){
			li_1()
		}else if(Value == 2){
			li_2()
		}
		else if(Value == 3){
			li_3()
		}
		else if(Value == 4){
			li_4()
		}
	}
	$('.list').on('click', '.li-1', function () {
		li_1()
		Cookies.set("value",'1')
	})
	$('.list').on('click', '.li-2', function () {
		li_2()
		Cookies.set("value",'2')
	})
	$('.list').on('click', '.li-3', function () {
		li_3()
		Cookies.set("value",'3')
	})
	$('.list').on('click', '.li-4', function () {
		li_4()
		Cookies.set("value",'4')
	})
	$('.yyy').click(function(){
		close()
		let AWARDindex = Min_Max(0,6)
		let award = AWARD[AWARDindex]
		Cookies.set("award",award)
	})
	log(Cookies.get())
	//六位随机数
	function six_Number() {
		let NUMBER = parseInt((Math.random() * 9 + 1) * 100000)
		return NUMBER
	}

	//li_1
	function li_1(){
		$('.li-1').addClass('d_none');
		$('.li-2').addClass('d_block').removeClass('d_none');
	}
	//li_2
	function li_2(){
		$('.li-1').addClass('d_none');
		$('.li-2').addClass('d_none').removeClass('d_block');
		$('.li-3').addClass('d_block').removeClass('d_none')
	}
	//li_3
	function li_3(){
		$('.li-1').addClass('d_none');
		$('.li-3').addClass('d_none').removeClass('d_block');
		$('.li-4').addClass('d_block').removeClass('d_none')
	}
	//li_4
	function li_4(){
		$('.li-1').addClass('d_none');
		$('.li-4').addClass('d_none').removeClass('d_block');
		$('.xxx').addClass('d_block').removeClass('d_none')
	}
	//关闭
	function close(){
		$('.list').addClass('d_none').removeClass('d_block');;
		$('.xxx').addClass('d_none').removeClass('d_block');;
	}
	//包括min和max的随机数
	function Min_Max(min, max) {
		return parseInt(Math.random() * (max + 1 - min)) + min;
	}
})