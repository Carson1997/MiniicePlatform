var form = layui.form;
form.render();

form.on('submit(su)', function(data) {
	var inp = form.val('myform');
	for (var i in inp) {
		var d = inp[i]
	}
	inp.status = 1;

	$.ajax({
		type: 'post',
		dataType: 'json',
		url: url_shop_add,
		data: inp,
		success: function(obj) {
			reloadTable()
			function ok() {
				layer.msg('添加成功')
			}
			checkStatus(obj, ok);
		},
		error: function() {
			console.log('请求错误');
		}
	});

	return false;
});

var pla_arr = [{
		name: '淘宝',
		value: 1
	},
	{
		name: '京东',
		value: 2
	},
	{
		name: '苏宁',
		value: 3
	},
	{
		name: '猫宁',
		value: 4
	}
];
var pla = xmSelect.render({
	el: '#xm-pla',
	name: 'platform',
	layVerify: 'required',
	layVerType: 'msg',
	autoRow: true,
	// size: 'mini',
	radio: true,
	height: 'auto',
	model: {
		icon: 'hidden',
		label: {
			type: 'text'
		}
	},
	data: pla_arr
})

getShop()

function getShop() {
	$.ajax({
		url: url_shop_list,
		type: 'get',
		dataType: 'json',
		timeout: 10000,
		success: function(res) {
			checkStatus(res, function() {
				filltable(res.data)
			});
		},
		error: function() {
			layer.alert('请求失败')
		}
	});
}

function filltable(data) {
	var table = layui.table;
	table.render({
		id: "myTable",
		elem: '#myTable',
		data: data,
		cols: [
			[{
					field: 'shop_name',
					title: '店铺',
					edit: 'text',
					minWidth: 150,
					templet: function(e) {
						return `<span id="user-` + e.id + `">` + e.shop_name + `</span>`;
					}
				},
				{
					title: '平台',
					minWidth: 120,
					templet: function(e) {
						var id = e.id;
						var str = `<div id="xm-` + id + `" class="xm-select-demo2"></div>`
						return str;
					}
				},
				{
					field: 'status',
					title: '状态',
					minWidth: 80,
					templet: function(e) {
						var status = e.status;
						var id = e.id;
						var on_str =
							`<div class="layui-form"><input type="checkbox" lay-skin="switch" lay-text="开|关" checked id="sw-` + id +
							`" lay-filter="test" ></div>`;
						var colose_str = `<div class="layui-form"><input  type="checkbox" lay-skin="switch" lay-text="开|关" id="sw-` +
							id + `" lay-filter="test" ></div>`;
						if (status == '1') {
							return on_str;
						} else {
							return colose_str;
						}
					}
				},
				{
					title: '操作',
					minWidth: 150,
					templet: function(e) {
						var id = e.id;
						// var data = e;
						// delete data.LAY_INDEX;
						// delete data.LAY_TABLE_INDEX;
						// data = JSON.stringify(data)
						var btn = `<button type="button" class="layui-btn layui-btn-sm"  onclick="updateT(` + id +
							`,$(this))">更新</button>`;
						btn += `<button type="button" class="layui-btn layui-btn-sm"  onclick="showTar(` + id +
							`,$(this))">目标</button>`;
						return btn;
					}
				}
			]
		],
		limit: 10,
		page: true,
		done: function(res) {
			var cells = document.querySelectorAll('div[lay-id="myTable"] .layui-table-cell');
			for (var i = 0; i < cells.length; i++) {
				cells[i].style.overflow = 'unset';
				cells[i].style.height = 'auto';
			}

			var data = res.data;
			for (var i in data) {
				var d = data[i];
				var xm = xmSelect.render({
					el: '#xm-' + d.id,
					autoRow: true,
					radio: true,
					size: 'mini',
					height: 'auto',
					model: {
						label: {
							type: 'text'
						}
					},
					data: pla_arr,
				});
				var pla = d.platform;
				var xm = xmSelect.get('#xm-' + d.id)[0];
				xm.setValue([pla]);
			}
		}
	});
}

function reloadTable() {
	$.ajax({
		url: url_shop_list,
		type: 'get',
		dataType: 'json',
		timeout: 10000,
		success: function(res) {
			checkStatus(res, function() {
				var table = layui.table;
				table.reload('myTable', {
					data: res.data
				});
			});
		},
		error: function() {
			layer.alert('请求失败')
		}
	});
}


function updateT(id, t) {
	var shop_name = $('#user-' + id).text();

	var status = $('#sw-' + id)[0].checked;
	if (status == true) {
		status = 1;
	} else {
		status = 0;
	}

	var power_arr = xmSelect.get('#xm-' + id)[0].getValue();
	power_arr = power_arr.map(function(item) {
		return item.value;
	})
	var power = power_arr.join(',');

	var data = {
		id: id,
		shop_name: shop_name,
		platform: power,
		status: status,
	};
	
	$.ajax({
		type: 'post',
		dataType: 'json',
		url: url_shop_update,
		data: data,
		success: function(obj) {
			
			function ok() {
				layer.msg('更新成功')
			}
			checkStatus(obj, ok);
		},
		error: function() {
			console.log('请求错误');
		}
	});
}

var date_arr = [{
		name: "日",
		value: '1'
	},
	{
		name: "周",
		value: '2'
	},
	{
		name: "月",
		value: '3'
	},
]

function showTar(id) {
	var str =
		`
	<form class="layui-form layui-field-box mt15" lay-filter="myTar">
		<div class="layui-form-item">
			<label class="layui-form-label label">目标：</label>
			<div class="layui-input-block">
			 <div class="layui-input-inline">
				<input type="text" autocomplete="off" placeholder="请输入目标" class="layui-input" id="inp1" lay-verify="required" name="target">
				</div>
			</div>
		</div>
		<div class="layui-form-item">
			<label class="layui-form-label label">日期：</label>
			<div class="layui-input-block">
			  <div class="layui-input-inline">
			<div id="xm-date" class="xm-select-demo"></div>
			</div>
				  <div class="layui-input-inline">
			<input type="text" autocomplete="off" placeholder="请输入日期" class="layui-input"  lay-verify="required" name="date">
			</div>
			 </div>
		</div>
		<div class="layui-form-item">
			<div class="layui-input-block">
				<button class="layui-btn text-right bt1" lay-submit lay-filter="su2">添加</button>
				<button class="layui-btn text-right bt1" type="reset">清空</button>
			</div>
		</div>
	</form>
	<div style="width:100%">
	<table lay-filter="myTableTar" id="myTableTar"></table>
	</div>
	
	`;

	layer.open({
		type: 1,
		title: '',
		content: str,
		area: ['600px', '500px'],
		id: 'LAY_layuipro',
		end: function() {},
	});

	var xm = xmSelect.render({
		el: '#xm-date',
		name: 'date_type',
		layVerify: 'required',
		layVerType: 'msg',
		autoRow: true,
		radio: true,
		// size: 'mini',
		height: 'auto',
		model: {
			label: {
				type: 'text'
			}
		},
		data: date_arr,
	});
	
	form.on('submit(su2)', function(data) {
		var inp = form.val('myTar');
		for (var i in inp) {
			var d = inp[i]
		}
		inp.shop_id = id;
	
		$.ajax({
			type: 'post',
			dataType: 'json',
			url: url_shopTarAdd,
			data: inp,
			success: function(obj) {
				reloadTableTar(id)
				function ok() {
					layer.msg(obj.info);
				}
				checkStatus(obj, ok);
			},
			error: function() {
				console.log('请求错误');
			}
		});
	
		return false;
	});

	$.ajax({
		url: url_shopTarList,
		type: 'post',
		dataType: 'json',
		timeout: 10000,
		data: {
			shop_id: id
		},
		success: function(res) {
			checkStatus(res, function() {
				filltableTar(res.data, id)
			});
		},
		error: function() {
			layer.alert('请求失败')
		}
	});
}


function filltableTar(data, shop_id) {
	var table = layui.table;
	table.render({
		id: "myTableTar",
		elem: '#myTableTar',
		data: data,
		cols: [
			[{
					field: 'target',
					title: '目标',
					edit: 'text',
					minWidth: 80,
					templet: function(e) {
						return `<span id="tar-` + e.id + `">` + e.target + `</span>`;
					}
				},
				{
					title: '日期类型',
					minWidth: 80,
					templet: function(e) {
						var id = e.id;
						var str = `<div id="xmd-` + id + `" class="xm-select-demo"></div>`
						return str;
					}
				},
				{
					field: 'date',
					title: '日期',
					minWidth: 120,
					edit: 'text',
					templet: function(e) {
						return `<span id="date-` + e.id + `">` + e.date + `</span>`;
					}
				},
				{
					title: '操作',
					minWidth: 150,
					templet: function(e) {
						var id = e.id;
						// var data = e;
						// delete data.LAY_INDEX;
						// delete data.LAY_TABLE_INDEX;
						// data = JSON.stringify(data)
						var btn = `<button type="button" class="layui-btn layui-btn-sm"  onclick="updateTar(` +id +`,` + shop_id + `)">更新</button>`;
						btn += `<button type="button" class="layui-btn layui-btn-sm" onclick="deleteTar(` + id +
							`,` + shop_id + `)">删除</button>`;
						return btn;
					}
				}
			]
		],
		limit: 10,
		page: true,
		done: function(res) {
			var cells = document.querySelectorAll('div[lay-id="myTableTar"] .layui-table-cell');
			for (var i = 0; i < cells.length; i++) {
				cells[i].style.overflow = 'unset';
				cells[i].style.height = 'auto';
			}

			var data = res.data;
			for (var i in data) {
				var d = data[i];
				var xm = xmSelect.render({
					el: '#xmd-' + d.id,
					autoRow: true,
					radio: true,
					size: 'mini',
					height: 'auto',
					model: {
						label: {
							type: 'text'
						}
					},
					data: date_arr,
				});
				var pla = d.date_type;
				var xm = xmSelect.get('#xmd-' + d.id)[0];
				xm.setValue([pla]);
			}
		}
	});
}

function updateTar(id, shop_id) {
	var target = $('#tar-' + id).text();
	var date = $('#date-' + id).text();

	var power_arr = xmSelect.get('#xmd-' + id)[0].getValue();
	power_arr = power_arr.map(function(item) {
		return item.value;
	})
	var power = power_arr.join(',');

	var data = {
		id: id,
		target: target,
		date: date,
		date_type: power,
	};

	$.ajax({
		type: 'post',
		dataType: 'json',
		url: url_shopTarUpdate,
		data: data,
		success: function(obj) {
			reloadTableTar(shop_id)
			function ok() {
				layer.msg(obj.info);
			}
			checkStatus(obj, ok);
		},
		error: function() {
			console.log('请求错误');
		}
	});
}

function deleteTar(id, shop_id) {
	$.ajax({
		url: url_shopTarDelete,
		type: 'post',
		dataType: 'json',
		data: {
			id: id
		},
		timeout: 10000,
		success: function(res) {
			reloadTableTar(shop_id)
			checkStatus(res, function() {
				layer.msg(res.info)
			});
		},
		error: function() {
			layer.alert('请求失败')
		}
	});
}

function reloadTableTar(id) {
	$.ajax({
		url: url_shopTarList,
		type: 'post',
		dataType: 'json',
		data: {
			shop_id: id
		},
		timeout: 10000,
		success: function(res) {
			checkStatus(res, function() {
				var table = layui.table;
				table.reload('myTableTar', {
					data: res.data
				});
			});
		},
		error: function() {
			layer.alert('请求失败')
		}
	});
}
