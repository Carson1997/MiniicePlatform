// 店铺来源明细
function getGoodsDetails() {
	var _this = vm;
	addLoading()
	$.ajax({
		url: url_sn_source_detail,
		data: _this.send,
		type: 'post',
		dataType: 'json',
		timeout:60000,
		success: function(res) {
			removeLoading()
			checkStatus(res, function() {
				_this.allGoodsData = res.data;
				filterData2(1);
			});
		},
		error: function() {
			removeLoading()
			layer.alert('请求失败')
		}
	});

	//    var arr = [
	// 	{name:'全部',value:'全部',selected:true},
	// 	{name:'淘宝搜索',value:'淘宝搜索'},
	// 	{name:'手淘搜索',value:'手淘搜索'},
	// 	{name:'天猫搜索',value:'天猫搜索'},
	// 	{name:'直通车',value:'直通车'}
	// ];
	_this.sel_s1 = '全部';
	// selectRadio2('#xm-select-s1', arr);
	_this.sel_s2 = 'payment_amt';
	selectRadio2('#xm-select-s2', _this.xm_arr1)

	var arr_shop = [];
	for (var i in _this.all_shop) {
		var d = _this.all_shop[i]
		if (d.platform == 4) {
			var one = {
				name : d.shop_name + '(' + changePlatform(d.platform) + ')',
				value:d.id,
			}
			arr_shop.push(one);
		}
	}
	_this.selectRadio('#xm-shop', arr_shop)
	if(arr_shop.length>0){
		_this.sel_shop = arr_shop[0].value;
		xmSelect.get('#xm-shop')[0].setValue([_this.sel_shop]);
	}
}

function filterData2(ci) {
	var _this = vm;
	_this.goods_data = [];
	if (ci == 1) {
		_this.arr_category1 = [];
		_this.arr_category2 = [];
		_this.arr_category3 = [];
		_this.arr_brand = [];
		_this.sel_category1 = [];
		_this.sel_category2 = [];
		_this.sel_category3 = [];
		_this.sel_brand = [];
		_this.de_xm = [];
	}

	for (var i in _this.allGoodsData) {
		var d = _this.allGoodsData[i];
		d.shop_name = changeShopName(d.shop_id, _this.arr_shop);
		d.pay_conversion_rate = (changeChu(d.payment_collect_qty, d.visitors) * 100).toFixed(2);
		d.customer_price = changeChu(d.payment_amt, d.payment_collect_qty).toFixed(0);
		d.unit_price = changeChu(d.payment_amt, d.payment_qty).toFixed(0);
		if (ci == 1) {
			getArrSelect(d);
		}

		_this.goods_data.push(d);
	}

	if (ci == 1) {
		_this.arr_category1 = Object.values(_this.arr_category1);
		_this.arr_category2 = Object.values(_this.arr_category2);
		_this.arr_category3 = Object.values(_this.arr_category3);
		_this.arr_brand = Object.values(_this.arr_brand);
		_this.de_xm = [{
			"name": "全部",
			"value": '全部',
			"selected": true
		}].concat(Object.values(_this.de_xm));

		selectRadio2('#xm-category1', _this.arr_category1);
		selectRadio2('#xm-category2', _this.arr_category2);
		selectRadio2('#xm-category3', _this.arr_category3);
		selectMore2('#xm-brand', _this.arr_brand);
		selectRadio2('#xm-select-s1', _this.de_xm);
	}

	//获取类目，品牌选项
	function getArrSelect(data) {
		get1(_this.arr_category1, 'category1');
		get1(_this.arr_category2, 'category2');
		get1(_this.arr_category3, 'category3');
		get1(_this.arr_brand, 'brand');
		get1(_this.de_xm, 'category_source');

		function get1(arr, str) {
			if (arr.hasOwnProperty(data[str]) == false && data[str] != '') {
				arr[data[str]] = {
					name: data[str],
					value: data[str],
				}
				if (str == 'category2') {
					arr[data[str]].parent = data.category1
				}
				if (str == 'category3') {
					arr[data[str]].parent = data.category2
				}
			}
		}
	}

	//过滤选择
	_this.goods_data = _this.filterThis(_this.sel_eq, _this.goods_data, 'terminal');
	_this.goods_data = _this.filterThis(_this.sel_shop, _this.goods_data, 'shop_id');
	_this.goods_data = _this.filterThis(_this.sel_brand, _this.goods_data, 'brand');
	_this.goods_data = _this.filterThis(_this.sel_category1, _this.goods_data, 'category1');
	_this.goods_data = _this.filterThis(_this.sel_category2, _this.goods_data, 'category2');
	_this.goods_data = _this.filterThis(_this.sel_category3, _this.goods_data, 'category3');
	_this.goods_data = _this.filterThis(_this.sel_s1, _this.goods_data, 'category_source');

	// console.log(_this.sel_shop)

	var goods_arr = [];
	var date_arr = [];
	_this.date_total = [];
	for (var i in _this.goods_data) {
		var d = _this.goods_data[i];
		var date = d.statistics_date;

		//获取不同商品
		var model_num = d.model_num;
		if (goods_arr.hasOwnProperty(model_num) == false) {
			goods_arr[model_num] = [];
		}
		goods_arr[model_num].push(d);

		// 获取日期
		if (date_arr.indexOf(date) == -1) {
			date_arr.push(date)
			_this.date_total[date] = [];
		}
_this.date_total[date].push(d)
	}

	_this.date_arr2 = date_arr;

	_this.goods_arr2 = changeFuZi('category_source', goods_arr,3);
	fillTable2();
}

function fillTable2() {
	var _this = vm;
	var date_arr = _this.date_arr2.sort();
	var date_arr2 = date_arr.map(function(i) {
		var d1 = [];
		var a = {
			title: i,
			sort: false,
			minWidth: 130,
			templet: function(d) {
				var s = 0;
				var data = d.data;
				var sum = 0;
				var payment_amt = 0;
				var payment_qty = 0;
				var visitors = 0;
				var shopping_cart_qty = 0;
				var payment_buyers_qty = 0;
				var pay_conversion_rate = 0;
				var customer_price = 0;
				var unit_price = 0;
				for (var t1 in data) {
					var a2 = data[t1];
					if (a2.statistics_date == i) {
						sum = changeSum(sum, a2[_this.sel_s2]);

						payment_amt = changeSum(payment_amt, a2.payment_amt);
						payment_qty = changeSum(payment_qty, a2.payment_qty);
						visitors = changeSum(visitors, a2.visitors);
						shopping_cart_qty = changeSum(shopping_cart_qty, a2.shopping_cart_qty);
						payment_buyers_qty = changeSum(payment_buyers_qty, a2.payment_buyers_qty);
					}
					s = sum;
					if (_this.sel_s2 == 'pay_conversion_rate') {
						s = (changeChu(payment_buyers_qty, visitors) * 100).toFixed(2);
					}
					if (_this.sel_s2 == 'customer_price') {
						s = (changeChu(payment_amt, payment_buyers_qty)).toFixed(0);
					}
					if (_this.sel_s2 == 'unit_price') {
						s = (changeChu(payment_amt, payment_qty)).toFixed(0);
					}
				}
				if (_this.sel_s2 == '') {
					s = "";
				}
				return s;
			},
			totalRowText: ''
		}
		return a;
	});
	var title = [{
		title: '商品/来源',
		field: 'name',
		sort: false,
		minWidth: 130,
		templet: function(d) {
			var s;
			if (d.pla) {
				var icon = 'layui-icon-reduce-circle';
				if (d.showZi == false) {
					icon = 'layui-icon-add-circle';
				}

				s = `<span lay-event="edit"><i class="layui-icon ` + icon + ` tbtn"></i>` + d.name + '</span>';
			} else {
				s = `<span style="margin-left: 20px;" parent_pla=` + d.parent_pla + `>` + d.name + `</span>`;
			}
			return s;
		},
		totalRowText: '合计',
	}].concat(date_arr2);
	var _this = vm;
	var table = layui.table;
	dlEx(_this.goods_arr2);
	table.render({
		elem: '#table_shop_source_detail',
		id: 'table_shop_source_detail',
		data: _this.goods_arr2,
		limit: 10,
		page: true,
		totalRow: true,
		cols: [
			title
		]
	});
	_this.t_name = [];
	table.on('tool(table_shop_source_detail)', function(obj) {
		var name = obj.data.name;
		var index = _this.t_name.indexOf(name);
		if (index == -1) {
			_this.t_name.push(name);
		} else {
			_this.t_name.splice(index, 1)
		}
		var data1 = [];
		var tData = _this.goods_arr2;
		for (var i in tData) {
			var d = tData[i];
			if (_this.t_name.indexOf(d.pla) > -1) {
				d.showZi = false;
			}
			if (_this.t_name.indexOf(d.pla) == -1) {
				d.showZi = true;
			}
			if (_this.t_name.indexOf(d.parent_pla) == -1) {
				data1.push(d)
			}
		}
		table.reload('table_shop_source_detail', {
			data: data1,
		});
		dlEx(data1);
	});

	//合计,导出数据
	function dlEx(data) {
		var ex_title = ['商品/来源'].concat(date_arr);
		var ex_data = [];
		var ex_total = getDateTotal(_this.date_total, _this.sel_s2);
		for(var i in title,ex_total){
			var t = title[i];
			var e = ex_total[i];
		    t.totalRowText = e;
		}
		
		for (var i in data) {
			var d = data[i];
			var one = [d.name];
			var one1 = [];
			for (var j in date_arr) {
				var date = date_arr[j];
				if (one.hasOwnProperty(date) == false) {
					one[date] = 0;
				}
			}
			for (var k in d.data) {
				var d1 = d.data[k];
				one[d1.statistics_date] = changeSum(one[d1.statistics_date],d1[_this.sel_s2])
			}
			// one = Object.values(one);
			for(var n in one){
				var a = one[n].toString();
				one1.push(a)
			}
			ex_data.push(one1);
		}
		ex_data.push(ex_total)
		$('#dl_flowDetail').unbind('click').bind('click', function() {
			table.exportFile(ex_title, ex_data, 'xls');
		})
	}
}


function selectRadio2(el, data) {
	var _this = vm;
	var demo_select = xmSelect.render({
		direction: 'down',
		el: el,
		size: 'mini',
		radio: true,
		height: 'auto',
		toolbar: {
			show: true,
			showIcon: false,
			list: ['CLEAR']
		},
		filterable: true,
		model: {
			icon: 'hidden',
			label: {
				type: 'text'
			}
		},
		theme: {
			color: '#ED6D00',
		},
		data: data,
		on: function(d) {
			//类目1选择
			if (el == '#xm-category1') {
				_this.sel_category1 = [];
				_this.sel_category2 = [];
				_this.sel_category3 = [];
				if (d.arr.length > 0) {
					var arr_n = [];
					_this.sel_category1 = d.arr.map(function(item) {
						_this.arr_category2.forEach(function(item2) {
							if (item.value == item2.parent) {
								arr_n.push(item2)
							}
						})
						return item.value.toString();
					});
					selectRadio2('#xm-category2', arr_n);

					var arr_n2 = [];
					arr_n.forEach(function(item) {
						_this.arr_category3.forEach(function(item2) {
							if (item.value == item2.parent) {
								arr_n2.push(item2)
							}
						})
					})
					selectRadio2('#xm-category3', arr_n2);
				} else {
					selectRadio2('#xm-category2', _this.arr_category2);
					selectRadio2('#xm-category3', _this.arr_category3);
				}

				filterData2()
			}
			//类目2选择
			if (el == '#xm-category2') {
				_this.sel_category2 = [];
				_this.sel_category3 = [];
				if (d.arr.length > 0) {
					var arr_n = [];
					_this.sel_category2 = d.arr.map(function(item) {
						_this.arr_category3.forEach(function(item2) {
							if (item.value == item2.parent) {
								arr_n.push(item2)
							}
						})
						return item.value.toString();
					});
					selectRadio2('#xm-category3', arr_n);
				} else {
					selectRadio2('#xm-category3', _this.arr_category3);
				}

				filterData2()
			}
			//类目3选择
			if (el == '#xm-category3') {
				_this.sel_category3 = [];
				if (d.arr.length > 0) {
					_this.sel_category3 = d.arr.map(function(item) {
						return item.value.toString();
					});
				}
				filterData2()
			}
			if (el == '#xm-select-s2') {
				_this.sel_s2 = [];
				if (d.arr.length > 0) {
					_this.sel_s2 = d.arr.map(function(item) {
						return item.value.toString();
					});
				}
				fillTable2();
			}
			if (el == '#xm-select-s1') {
				_this.sel_s1 = [];
				if (d.arr.length > 0) {
					_this.sel_s1 = d.arr.map(function(item) {
						return item.value.toString();
					});
				}
				filterData2()
			}
		}
	});
}

function selectMore2(el, data) {
	var _this = vm;
	var demo_select = xmSelect.render({
		direction: 'down',
		el: el,
		size: 'mini',
		height: 'auto',
		toolbar: {
			show: true,
			showIcon: false,
			list: ['CLEAR']
		},
		filterable: true,
		model: {
			label: {
				type: 'text'
			}
		},
		theme: {
			color: '#ED6D00',
		},
		data: data,
		on: function(d) {
			//品牌选择
			if (el == '#xm-brand') {
				_this.sel_brand = [];
				if (d.arr.length > 0) {
					_this.sel_brand = d.arr.map(function(item) {
						return item.value.toString();
					});
				}
				filterData2()
			}
		}
	});
}
