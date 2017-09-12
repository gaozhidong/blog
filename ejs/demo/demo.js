$(function() {
    var transformData = function(data) {
        var myObj = {};
        var contents = [];
        var maps = [];
        for (var p in data[0]) {
            var content = {};
            var contentArray = [];
            if (p == 'total') {
                content.contentTitle = '总数';
            } else {
                content.contentTitle = p;
            }
            for (var pp in data[0][p]) {
                contentArray.push(data[0][p][pp]);
            }
            content.contentArray = contentArray;
            contents.push(content);
        }
        for (var ppp in data[0]['total']) {
            maps.push(ppp);
        }
        myObj.contents = contents;
        myObj.maps = maps;
        return myObj;
    }
    var loadTable = function() {
		$.ajax({
			type: "get",
			datatype: "json",
			url: "data.js",
			success: function(data) {
				var myObj = transformData(JSON.parse(data));
				var htmlTable = new EJS({
					url: 'demo.ejs'
				}).render({
					myObj: myObj
				});
				$('.dataTable').html(htmlTable);
				decorateTable();
			},
			error: function(e) {
				console.log(e);
			}
		});
    };
    var decorateTable = function() {
        $("tr:odd").addClass("odd");
        $("tr:even").addClass("even");
        $("th").addClass("thead");
    }
	$("#genTableBtn").bind("click", loadTable);
});
