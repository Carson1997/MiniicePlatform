var form = layui.form;
form.render()
form.on('select(sel)', function(data) {
	var sel = data.value;
	getData(sel)
});
form.on('select(selJP)', function(data) {
	var sel = data.value;
	getDataJP(sel)
});


var sel = 0;
getData1(sel)
getDataJP(sel)

function getData1(sel, ci) {
	addLoading();
	$.ajax({
		url: url_proSelect,
		type: 'post',
		data: {
			complete: sel
		},
		dataType: 'json',
		timeout:60000,
		success: function(res) {
			removeLoading()
			checkStatus(res, function() {
				console.log(res.data)
				fillTable(res.data)
			});
		},
		error: function() {
			removeLoading()
			layer.alert('请求失败')
		}
	});
}

function getDataJP(sel, ci) {
	addLoading();
	$.ajax({
		url: url_jpGoods,
		type: 'post',
		data: {
			complete: sel
		},
		timeout:60000,
		dataType: 'json',
		success: function(res) {
			removeLoading()
			checkStatus(res, function() {
				fillTableJP(res.data)
			});
		},
		error: function() {
			removeLoading()
			layer.alert('请求失败')
		}
	});
}

function fillTable(data) {
	var thead = '';
	var a = 0;
	var arr_title = [];
	for (var i in data[0]) {
		thead += `<th lay-data="{field:` + a + `}">` + i + `</th>`;
		a++;
		arr_title.push(i)
	}
	thead = `<thead><tr>` + thead + `</tr></thead>`;

	var tbody = '';
	for (var i in data) {
		var d = data[i];
		var str = '';
		for (var j in d) {
			str += `<td>` + d[j] + `</td>`;
		}
		tbody += `<tr>` + str + `</tr>`;
	}
	tbody = `<tbody>` + tbody + `</tbody>`;
	var all = thead + tbody;
	$('#myTable').empty();
	$('#myTable').append(all);

	var table = layui.table;
	table.init('demo', {
		page: true,
		limit: 10,
		id: 'demo',
	});

	$('#dl1').unbind('click').bind('click', function() {
		console.log(arr_title)
		console.log(data)
		return
		table.exportFile(arr_title, data, 'xls');
	})
}


function fillTableJP(data) {
	var thead = '';
	var a = 0;
	var arr_title = [];
	for (var i in data[0]) {
		thead += `<th lay-data="{field:` + a + `}">` + i + `</th>`;
		a++;
		arr_title.push(i)
	}
	thead = `<thead><tr>` + thead + `</tr></thead>`;

	var tbody = '';
	for (var i in data) {
		var d = data[i];
		var str = '';
		for (var j in d) {
			str += `<td>` + d[j] + `</td>`;
		}
		tbody += `<tr>` + str + `</tr>`;
	}
	tbody = `<tbody>` + tbody + `</tbody>`;
	var all = thead + tbody;
	$('#myTableJP').empty();
	$('#myTableJP').append(all);

	var table = layui.table;
	table.init('demoJP', {
		page: true,
		limit: 10,
		id: 'demoJP',
	});

	$('#dl2').unbind('click').bind('click', function() {
		table.exportFile(arr_title, data, 'xls');
	})
}

