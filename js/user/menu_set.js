var menu = [];
getMenu()

var form = layui.form;
form.render();

form.on('submit(su)', function(data) {
	var inp = form.val('myform');
	inp.is_enable = 1;
	// console.log(inp)
	// return false;

	$.ajax({
		type: 'post',
		dataType: 'json',
		url: url_menuSet,
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
				menu = [{id:0,title:'顶级'}].concat(res.data);
				var demo2 = xmSelect.render({
					el: '#xm-power',
					name: 'fid',
					layVerify: 'required',
					layVerType: 'msg',
					autoRow: true,
					// size: 'mini',
					// toolbar: {
					// 	show: true,
					// 	list: ['ALL', 'CLEAR']
					// },
					radio:true,
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

				filltable(res.data)
			});
		},
		error: function() {
			layer.alert('请求失败')
		}
	});
}

// function getUser() {
// 	$.ajax({
// 		url: url_userList,
// 		type: 'get',
// 		dataType: 'json',
// 		timeout: 10000,
// 		success: function(res) {
// 			checkStatus(res, function() {
// 				filltable(res.data)
// 			});
// 		},
// 		error: function() {
// 			layer.alert('请求失败')
// 		}
// 	});
// }

function filltable(data) {
	var table = layui.table;
	table.render({
		id: "myTable",
		elem: '#myTable',
		data: data,
		cols: [
			[
				{
					field: 'id',
					title: 'id',
					minWidth: 80,
					templet: function(e) {
						return `<span id="id-` + e.id + `">` + e.id + `</span>`;
					}
				},
				{
					field: 'title',
					title: '菜单名',
					edit: 'text',
					minWidth: 80,
					templet: function(e) {
						return `<span id="title-` + e.id + `">` + e.title + `</span>`;
					}
				},
			
				{
					field: 'pid',
					title: '父菜单',
				    minWidth: 80,
					templet: function(e) {
						var id = e.id;
						var str = `<div id="xm-` + id + `" class="xm-select-demo2"></div>`
						return str;
					}
				},
				{
					field: 'url',
					title: '相对地址',
					edit: 'text',
					minWidth: 250,
					templet: function(e) {
						return `<span id="url-` + e.id + `">` + e.url + `</span>`;
					}
				},
				{
					field: 'icon',
					title: '图标',
					edit: 'text',
					minWidth: 350,
					templet: function(e) {
						return `<span id="icon-` + e.id + `">` + e.icon + `</span>`;
					}
				},
				{
					field: 'is_enable',
					title: '状态',
					minWidth: 80,
					templet: function(e) {
						var is_enable = e.is_enable;
						var id = e.id;
						var on_str =
							`<div class="layui-form"><input type="checkbox" lay-skin="switch" lay-text="开|关" checked id="sw-` + id +
							`" lay-filter="test" ></div>`;
						var colose_str = `<div class="layui-form"><input  type="checkbox" lay-skin="switch" lay-text="开|关" id="sw-` +
							id + `" lay-filter="test" ></div>`;
						if (is_enable == '1') {
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
					// toolbar: {
					// 	show: true,
					// 	list: ['ALL', 'CLEAR']
					// },
					radio:true,
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
				var fid = d.fid.split(',');
				var xm = xmSelect.get('#xm-' + d.id)[0];
				xm.setValue(fid)
			}
		}
	});
}

function reloadTable() {
	$.ajax({
		url: url_userMeunList,
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
	var title = $('#title-' + id).text();
	var icon = $('#icon-' + id).text();
var url = $('#url-' + id).text();
	var is_enable = $('#sw-' + id)[0].checked;
	if (is_enable == true) {
		is_enable = 1;
	} else {
		is_enable = 0;
	}

	var fid = xmSelect.get('#xm-' + id)[0].getValue();
	fid = fid.map(function(item) {
		return item.id;
	})
	var fid = fid.join(',');

	var data = {
		id: id,
		title: title,
		icon: icon,
		is_enable: is_enable,
		fid: fid,
		url:url
	};

// console.log(data)
// return

	$.ajax({
		type: 'post',
		dataType: 'json',
		url: url_menuSet,
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
