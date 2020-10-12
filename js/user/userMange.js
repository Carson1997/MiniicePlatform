var menu = [];
getMenu()

var form = layui.form;
form.render();

form.on('submit(su)', function(data) {
	var inp = form.val('myform');
	for (var i in inp) {
		var d = inp[i]
		if (i == 'password') {
			inp[i] = hex_md5(d)
		}
	}
	inp.status = 1;
	// console.log(inp)
	// return false;

	$.ajax({
		type: 'post',
		dataType: 'json',
		url: url_userUpdate,
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

function getMenu() {
	$.ajax({
		url: url_userMeunList,
		type: 'get',
		dataType: 'json',
		timeout: 10000,
		success: function(res) {
			checkStatus(res, function() {
				menu = res.data;
				
				var demo2 = xmSelect.render({
					el: '#xm-power',
					name: 'left_id',
					layVerify: 'required',
					layVerType: 'msg',
					autoRow: true,
					// size: 'mini',
					toolbar: {
						show: true,
						list: ['ALL', 'CLEAR']
					},
					height: 400,
						direction: 'down',
					model: {
						label: {
							type: 'text'
						}
					},
					data: menu,
					prop: {
						name: 'title',
						value: 'id',
					},
				})

				getUser();
			});
		},
		error: function() {
			layer.alert('请求失败')
		}
	});
}

function getUser() {
	$.ajax({
		url: url_userList,
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
					field: 'username',
					title: '用户',
					edit: 'text',
					minWidth: 80,
					templet: function(e) {
						return `<span id="user-` + e.id + `">` + e.username + `</span>`;
					}
				},
				{
					field: 'name',
					title: '角色',
					edit: 'text',
					minWidth: 80,
					templet: function(e) {
						return `<span id="zw-` + e.id + `">` + e.name + `</span>`;
					}
				},
				{
					// field: 'left_id',
					title: '权限',
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
						// var data = e;
						// delete data.LAY_INDEX;
						// delete data.LAY_TABLE_INDEX;
						// data = JSON.stringify(data)
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
					minWidth: 100,
					templet: function(e) {
						var id = e.id;
						// var data = e;
						// delete data.LAY_INDEX;
						// delete data.LAY_TABLE_INDEX;
						// data = JSON.stringify(data)
						var btn = `<button type="button" class="layui-btn layui-btn-sm"  onclick="updateT(` + id +
							`,$(this))">更新</button>`;
						return btn;
					}
				}
			]
		],
		limit: 10,
		page: true,
		// height: 300,
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
					size: 'mini',
					toolbar: {
						show: true,
						list: ['ALL', 'CLEAR']
					},
					height: 400,
					direction: 'down',
					model: {
						label: {
							type: 'text'
						}
					},
					data: menu,
					prop: {
						name: 'title',
						value: 'id',
					},
				});
				var power = d.left_id.split(',');
				var xm = xmSelect.get('#xm-' + d.id)[0];
				xm.setValue(power)
			}
		}
	});

	// var form = layui.form;
	// form.on('switch(test)', function(e) {
	// 	var status = e.elem.checked;
	// 	if (status == true) {
	// 		status = 1;
	// 	} else {
	// 		status = 0;
	// 	}
	// 	var data = JSON.parse(e.elem.value);
	// 	data.status = status;
	// 	$.ajax({
	// 		type: 'post',
	// 		dataType: 'json',
	// 		url: url_userUpdate,
	// 		data: data,
	// 		success: function(obj) {
	// 			function ok() {
	// 				reloadTable()
	// 			}
	// 			checkStatus(obj, ok);
	// 		},
	// 		error: function() {
	// 			console.log('请求错误');
	// 		}
	// 	});
	// });
}

function reloadTable() {
	$.ajax({
		url: url_userList,
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
	var username = $('#user-' + id).text();
	var name = $('#zw-' + id).text();

	var status = $('#sw-' + id)[0].checked;
	if (status == true) {
		status = 1;
	} else {
		status = 0;
	}

	var power_arr = xmSelect.get('#xm-' + id)[0].getValue();
	power_arr = power_arr.map(function(item) {
		return item.id;
	})
	var power = power_arr.join(',');

	var data = {
		id: id,
		username: username,
		name: name,
		status: status,
		left_id: power
	};

	$.ajax({
		type: 'post',
		dataType: 'json',
		url: url_userUpdate,
		data: data,
		success: function(obj) {
			reloadTable()

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
