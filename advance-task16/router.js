app.get('/loadNews', function (req, res) {
	var data = [
		{
			'Url': 'http://inews.gtimg.com/newsapp_ls/0/1352431478_150120/0',
			'headline': '韩国检方今将到看守所讯问朴槿惠 或在大选前公诉'
		},
		{
			'Url': 'http://inews.gtimg.com/newsapp_ls/0/1353457590_150120/0',
			'headline': '特朗普女婿访伊拉克 频涉外交如“影子国务卿“'
		},
		{
			'Url': 'http://inews.gtimg.com/newsapp_ls/0/1353348813_150120/0',
			'headline': '中国留学生在美身亡：飙车飞起撞隧道顶 女乘客受伤'
		},
		{
			'Url': 'http://inews.gtimg.com/newsapp_ls/0/1353001167_150120/0',
			'headline': '容城官方发公开信：市场上所有预售楼盘均为违规销售'
		},
		{
			'Url': 'http://inews.gtimg.com/newsapp_ls/0/1352526245_150120/0',
			'headline': '北京半个月发12项楼市调控政策 限购“再无空可钻”'
		},
			{
			'Url': 'http://inews.gtimg.com/newsapp_ls/0/1352431478_150120/0',
			'headline': '韩国检方今将到看守所讯问朴槿惠 或在大选前公诉'
		},
		{
			'Url': 'http://inews.gtimg.com/newsapp_ls/0/1353457590_150120/0',
			'headline': '特朗普女婿访伊拉克 频涉外交如“影子国务卿“'
		},
		{
			'Url': 'http://inews.gtimg.com/newsapp_ls/0/1353348813_150120/0',
			'headline': '中国留学生在美身亡：飙车飞起撞隧道顶 女乘客受伤'
		},
		{
			'Url': 'http://inews.gtimg.com/newsapp_ls/0/1353001167_150120/0',
			'headline': '容城官方发公开信：市场上所有预售楼盘均为违规销售'
		},
		{
			'Url': 'http://inews.gtimg.com/newsapp_ls/0/1352526245_150120/0',
			'headline': '北京半个月发12项楼市调控政策 限购“再无空可钻”'
		},
		{
			'Url': 'http://inews.gtimg.com/newsapp_ls/0/1352431478_150120/0',
			'headline': '韩国检方今将到看守所讯问朴槿惠 或在大选前公诉'
		},
		{
			'Url': 'http://inews.gtimg.com/newsapp_ls/0/1353457590_150120/0',
			'headline': '特朗普女婿访伊拉克 频涉外交如“影子国务卿“'
		},
		{
			'Url': 'http://inews.gtimg.com/newsapp_ls/0/1353348813_150120/0',
			'headline': '中国留学生在美身亡：飙车飞起撞隧道顶 女乘客受伤'
		},
		{
			'Url': 'http://inews.gtimg.com/newsapp_ls/0/1353001167_150120/0',
			'headline': '容城官方发公开信：市场上所有预售楼盘均为违规销售'
		},
		{
			'Url': 'http://inews.gtimg.com/newsapp_ls/0/1352526245_150120/0',
			'headline': '北京半个月发12项楼市调控政策 限购“再无空可钻”'
		}
	]
	var pageIndex=req.query.page;
	var len=5;
	var retnews=data.slice(pageIndex*len,pageIndex*len+len);
	res.send(retnews)
});