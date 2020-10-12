/*                           
 name: 数据处理层  公用的函数      
*/

/* 
 1.name: bootstrap table的公共类
 2.para: 
    1. div_id: table的id
    2. table_head: table的表头
    3. table_body: table的表身
    4. table_box_id: 存放table的盒子id
    5. table_pagination: 是否分页
    6. table_sortable: 是否排序
    7. table_search: 是否搜索
    8. table_showColumns: 是否显示选择列按钮
    9. table_showExport: 是否显示导出按钮
 */
function publicBootstrapTable(div_id, table_head, table_body, table_box_id, table_pagination, table_sortable,
	table_search, table_showColumns, table_showExport) {
	$(div_id).bootstrapTable('destroy');
	$(div_id).bootstrapTable({
		data: table_body, //表身数据
		striped: true, //是否显示行间隔色
		cache: false, //是否使用缓存
		pagination: table_pagination, //是否显示分页（*）
		paginationLoop: false,
		sortable: table_sortable, //是否启用排序
		sortOrder: "asc", //排序方式
		pageNumber: 1, //初始化加载第一页，默认第一页
		pageSize: 10, //每页的记录行数（*）
		pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
		search: table_search, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端
		// height: $(table_box_id).height(),		//高度 这里是使用了存放表格的盒子高
		showColumns: table_showColumns, //是否显示所有的列
		minimumCountColumns: 1, //最少允许的列数
		columns: table_head, //表头数据
		showExport: table_showExport, //是否显示导出
		exportDataType: "all", //basic'当前页 ，'all'所有数据，'selected'选中数据
		exportTypes: ['excel', 'xlsx'], //导出类型
	});
	$(window).resize(function() { //自适应表格高度
		$(div_id).bootstrapTable('resetView', {
			height: $(table_box_id).height()
		});
	});
	$(window).resize();
}

/*
 name: 取整 并且 千分位 分隔
*/
function roundingFormat(value) {
	var temp = parseFloat(value).toString() == 'NaN' ? '0' : parseFloat(value);
	var reg = /\d{1,3}(?=(\d{3})+$)/g;
	var temp = (temp + '').replace(reg, '$&,');
	return temp;
}

// 获取第几周
function getWeekInYear(dateStr) {
	var y = parseFloat(dateStr.split('-')[0]);
	var m = parseFloat(dateStr.split('-')[1]);
	var d = parseFloat(dateStr.split('-')[2]);
	var targetDay = new Date(y, m - 1, d);
	var year = targetDay.getFullYear();
	var month = targetDay.getMonth();
	var days = targetDay.getDate();
	for (var i = 1; i < m; i++) {
		days += getMonthDays(year, i);
	}
	//那一年第一天是星期几
	var yearFirstDay = new Date(year, 0, 1).getDay();
	//计算是第几周
	days += yearFirstDay;
	var week = Math.ceil(days / 7);
	return week;
}

function isLeapYear(year) {
	return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
}

function getMonthDays(year, month) {
	return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

// 自定义table
function publicSimpleTable(table_id, table_head, table_body) {
	$(table_id).empty();
	var SimpleTable = '';
	SimpleTable += '<table>';
	SimpleTable += '<thead><tr>';
	for (var i = 0; i < table_head.length; i++) {
		SimpleTable += '<td>' + table_head[i] + '</td>';
	}
	SimpleTable += '</tr></thead>';
	SimpleTable += '<tbody>';
	for (var i = 0; i < table_body.length; i++) {
		SimpleTable += '<tr>';
		for (var j = 0; j < table_body[i].length; j++) {
			SimpleTable += '<td>' + table_body[i][j] + '</td>';
		}
		SimpleTable += '</tr>';
	}
	SimpleTable += '</tbody>';
	SimpleTable += '</table>';
	$(table_id).append(SimpleTable);
}

// 将日期按规定显示
function changeDate(date, dataType) {
	var date = date.split('_');
	var back = '';
	if (dataType == 1) {
		back = date[0];
	} else if (dataType == 7) {
		back = date[0] + '_' + date[1];
	} else if (dataType == 31) {
		date = date[0].split('-');
		back = date[0] + '-' + date[1];
	}
	return back;
}

// 添加loading层    
// 参数: 1.div   2.loading底的class,   2.loading的class
function addLoading() {
	var loading = '';
	if ($('.loading-div').length >= 1) {
		loading = loading + '<div class="loading-div disNone">';
		loading = loading + '<div class="loadingInner">';
		// loading = loading + '<embed src="../../img/loading.svg" width="100%" height="100%" type="image/svg+xml"/>';
		loading = loading + `<img src="../../img/load.gif">`;
			loading = loading + '</div>';
	} else {
		loading = loading + '<div class="loading-div">';
		loading = loading + '<div class="loadingInner">';
		loading = loading + `<img src="../../img/load.gif">`;
		// loading = loading + '<embed src="../../img/loading.svg" width="100%" height="100%" type="image/svg+xml"/>';
		loading = loading + '</div>';
	}
	loading = loading + '</div>';
	$('body').append(loading);
}

// 消除loading
function removeLoading() {
	if ($('.loading-div.disNone').length >= 1) {
		$($('.loading-div.disNone')[0]).remove();
	} else {
		$($('.loading-div')).remove();
	}
}

// 将后台返回的内容放上localSession
/*
    形式为: url/para=para1
*/
function setLocalStorage(url, sendObj, resData) {
	var str = url + '?';
	for (var i in sendObj) {
		str = str + i + '=' + sendObj[i];
	}
	if (resData.length != 0 && (resData instanceof Array) == true) { // 数组长度为0
		var strJson = JSON.stringify(resData);
		try {
			localStorage.setItem(str, strJson);
		} catch (oException) {
			layer.msg('localStorage空间已满！现清除空间并展现数据！');
			localStorage.clear();
			localStorage.setItem(str, strJson);
		}
	} else if ((resData instanceof Object) == true) {
		var strJson = JSON.stringify(resData);
		try {
			localStorage.setItem(str, strJson);
		} catch (oException) {
			layer.msg('localStorage空间已满！现清除空间并展现数据！');
			localStorage.clear();
			localStorage.setItem(str, strJson);
		}
	}
}

/*
    获取localSession上面后台返回的内容
*/
function getLocalStorage(url, sendObj) {
	var str = url + '?';
	for (var i in sendObj) {
		str = str + i + '=' + sendObj[i];
	}
	var resData = localStorage.getItem(str);
	if (resData != undefined) {
		resData = JSON.parse(resData);
		return resData;
	} else {
		return false;
	}
}

/*
    根据获取的内容进行是否请求的函数
*/
function requestAccordingLocal(isExist, requestFunction, noRequestFunction) {
	if (isExist != false) { // 非请求方法
		noRequestFunction();
	} else { // 请求方法
		requestFunction();
	}
}
