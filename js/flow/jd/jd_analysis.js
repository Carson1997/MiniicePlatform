//商品来源分析
function goodsAnalysis() {
	var _this = vm;
	_this.send3 = _this.send;
	// _this.send3.date = '2020-06-01_2020-06-01';
	_this.send3.prd_id = '100003710540';
	// _this.send3.prd_id2 = '100002828145';
	// _this.send3.prd_id3 = '5129535';
	_this.sel_goods = ['100003710540'];
	_this.sel_goods3 = _this.sel_goods;

	_this.xm_sa1 = '全部';
	_this.xm_sa2 = 'transactions_amt';
	_this.xm_sd = 'transactions_amt';

	// selectRadio3('#xm-select-sa1', _this.xm_arr3)
	selectRadio3('#xm-select-sa2', _this.xm_arr1)

	selectRadio3('#xm-select-sd', _this.xm_arr1);

	initLayui();

}

function getGoodsAnalysis() {
	var _this = vm;
	addLoading()
	$.ajax({
		url: url_jd_source_analysis,
		type: 'post',
		dataType: 'json',
		data: _this.send3,
		timeout:60000,
		success: function(res) {
			removeLoading()
			checkStatus(res, function() {
				_this.allGoodsData3 = res.data;
				fillEachart3(1);
				fillTable3();
			});
		},
		error: function() {
			removeLoading()
			layer.alert('请求失败')
		}
	});
}


//获取商品
function getGoods() {
	var _this = this;
	addLoading()
	$.ajax({
		url: url_jd_goods,
		data: {
			key: '京东'
		},
		type: 'post',
		dataType: 'json',
		timeout:60000,
		success: function(res) {
			removeLoading()
			checkStatus(res, function() {
				arr_goods = res.data;
				fillGoodsSelect(arr_goods)
			});
		},
		error: function() {
			removeLoading()
			layer.alert('请求失败')
		}
	});
}

//填充商品选项
function fillGoodsSelect(arr_goods) {
	var _this = this;
	var arr = [];
	var arr1 = [];
	for (var i in arr_goods) {
		var d = arr_goods[i]
		if (arr.indexOf(arr_goods[i].prd_id) == -1) {
			arr.push(arr_goods[i].prd_id);
			var one = {
				name: arr_goods[i].model_num,
				value: arr_goods[i].prd_id
			}
			arr1.push(one)
		}
	}
	_this.arr_goods = arr1;

	selectRadio3('#xm-goods1', _this.arr_goods)
	selectRadio3('#xm-goods2', _this.arr_goods)
	selectRadio3('#xm-goods3', _this.arr_goods)
	
	getGoodsAnalysis();
}


function fillEachart3(ci) {
	var _this = vm;
	var transactions_amt = [];
	var transactions_qty = [];
	var visitors = [];
	var shopping_cart = [];
	var payment_buyers_qty = [];
	var pay_conversion_rate = [];
	var customer_price = [];
	var unit_price = [];
	_this.date_arr3 = [];

	//过滤选择
	// var goodsData = _this.filterThis(_this.sel_eq, _this.allGoodsData3, 'terminal');
	var goodsData = _this.filterThis(_this.xm_sa1, _this.allGoodsData3, 'category2_source');

	if (ci == 1) {
		_this.sa_xm = [];
	}

	_this.goods_total = [];
	for (var i in goodsData) {
		var d = goodsData[i];

		//获取所有日期
		var date = d.statistics_date;
		if (_this.date_arr3.hasOwnProperty(date) == false) {
			_this.date_arr3[date] = [];
		}
		_this.date_arr3[date].push(d);
		if (ci == 1) {
			getArrSelect(d);
		}
		
		//获取不同商品
		var model_num = d.model_num;
		if (_this.goods_total.hasOwnProperty(model_num) == false) {
			_this.goods_total[model_num] = [];
		}
		_this.goods_total[model_num].push(d);
	}

	if (ci == 1) {
		var al = [{
			"name": "全部",
			"value": '全部',
			"selected": true
		}];
		_this.sa_xm = al.concat(Object.values(_this.sa_xm));
		selectRadio3('#xm-select-sa1', _this.sa_xm)
	}

	var date_arr = _this.date_arr3;
	var goods = _this.sel_goods.map(function(t, d) {
		if (t) {
			return '商品' + (d + 1);
		}
	});
	goods = goods.filter(function(i) {
		return i;
	})
	var data_top = ['日期'].concat(goods);
	var data_num = _this.changeEarchData(_this.sel_goods3, _this.date_arr3, 'prd_id', _this.xm_sa2);
	var data_all = [data_top];
	data_all = data_all.concat(data_num);
	var title = changeTar(_this.xm_sa2)
	if (title) {
		title =  title + '趋势图';
	}
	polygonal('echart_sourceTrend', data_all,title);

	if (goods.length == 0) {
		$('#echart_sourceTrend').hide();
		$('.tips').show();
	} else {
		$('#echart_sourceTrend').show();
		$('.tips').hide();
	}

	function getArrSelect(data) {
		get1(_this.sa_xm, 'category2_source');

		function get1(arr, str) {
			if (arr.hasOwnProperty(data[str]) == false && data[str] != '') {
				arr[data[str]] = {
					name: data[str],
					value: data[str],
				}
				if (str == 'category2_source') {
					arr[data[str]].parent = data.category1_source
				}
			}
		}
	}
}

function fillTable3() {
	var _this = vm;

	//过滤选择
	var goodsData = _this.allGoodsData3;
	// var goodsData = _this.filterThis(_this.sel_eq, _this.allGoodsData3, 'terminal');

	_this.goods_data3 = [];
	for (var i in goodsData) {
		var d = goodsData[i];
		var source = d.category2_source;
		if (_this.goods_data3.hasOwnProperty(source) == false) {
			if (source == '') {
				source = '其他'
			}
			_this.goods_data3[source] = [];
		}
		_this.goods_data3[source].push(d)
	}

	var tdata = [];
	for (var i in _this.goods_data3) {
		var d = _this.goods_data3[i];
		var a = {
			name: i,
			data: d
		}
		a.visitors = 0;
		a.customer_price = 0;
		a.transactions_amt = 0;
		a.transactions_qty = 0;
		a.shopping_cart = 0;
		for (var j in d) {
			var d2 = d[j];
			a.transactions_amt = changeSum(a.transactions_amt, d2.transactions_amt);
			a.transactions_qty = changeSum(a.transactions_qty, d2.transactions_qty);
			a.visitors = changeSum(a.visitors, d2.visitors);
			a.shopping_cart = changeSum(a.shopping_cart, d2.shopping_cart);
		}
		a.customer_price = changeChu(a.transactions_amt, a.transactions_qty).toFixed(0);
		tdata.push(a)
	}
	tdata.sort(function(a, b) {
		return b.transactions_amt - a.transactions_amt;
	})
	var table = layui.table;
	var tTitle = [];
	if (_this.sel_goods3.length == 1) {
		var transactions_amt;
		var payment_buyers_qty;
		var visitors;
		var transactions_qty;
		_this.title3 = [{
				field: 'name',
				title: '来源',
				sort: false,
				minWidth: 195,
				totalRowText: '合计'
			},
			{
				field: 'transactions_amt',
				title: '支付金额(元)',
				sort: false,
				minWidth: 130,
				// templet: function(d) {
				// 	transactions_amt = _this.ts(d, 'transactions_amt');
				// 	return transactions_amt;
				// }
				totalRowText: ''
			},
			{
				field: 'transactions_qty',
				title: '支付人数(件)',
				sort: false,
				minWidth: 130,
				// templet: function(d) {
				// 	transactions_qty = _this.ts(d, 'transactions_qty');
				// 	return _this.ts(d, 'transactions_qty');
				// },
				totalRowText: ''
			},
			{
				field:'visitors',
				title: '访客数(人)',
				sort: false,
				minWidth: 130,
				// templet: function(d) {
				// 	visitors = _this.ts(d, 'visitors');
				// 	return visitors;
				// },
				totalRowText: ''
			},
			{
				field:'shopping_cart',
				title: '加购人数(人)',
				sort: false,
				minWidth: 130,
				// templet: function(d) {
				// 	return _this.ts(d, 'shopping_cart');
				// }
				totalRowText: ''
			},
			{
				field:'customer_price',
				title: '客单价(元)',
				sort: false,
				minWidth: 130,
				// templet: function(d) {
				// 	return (changeChu(transactions_amt, transactions_qty)).toFixed(0);
				// }
				totalRowText: ''
			},
			// {
			// 	title: '支付买家数(人)',
			// 	sort: false,
			// 	minWidth: 130,
			// 	templet: function(d) {
			// 		payment_buyers_qty = _this.ts(d, 'payment_buyers_qty');
			// 		return payment_buyers_qty;
			// 	}
			// },
			// {
			// 	title: '支付转化率(%)',
			// 	sort: false,
			// 	minWidth: 130,
			// 	templet: function(d) {
			// 		return (changeChu(payment_buyers_qty, visitors) * 100).toFixed(2);
			// 	}
			// },
			// {
			// 	title: '单价(元)',
			// 	sort: false,
			// 	minWidth: 130,
			// 	templet: function(d) {
			// 		return (changeChu(transactions_amt, payment_buyers_qty)).toFixed(0);
			// 	}
			// },
		];

		tTitle = _this.title3;
		
		dlEx(tdata)
	} else {
		// console.log(tdata)
		var title1 = [{
			title: '商品/来源',
			field: 'name',
			sort: false,
			minWidth: 130
		}];
		var titleName = [];
		var title2 = _this.sel_goods.map(function(item, index) {
			var num = index + 1;
			titleName.push('商品' + num)
			var a = {
				goodid: item,
				title: '商品' + num,
				sort: false,
				minWidth: 130,
				templet: function(d) {
					var s = 0;
					var data = d.data;
					var sum = 0;
					var transactions_amt = 0;
					var transactions_qty = 0;
					var visitors = 0;
					var shopping_cart = 0;
					var payment_buyers_qty = 0;
					var pay_conversion_rate = 0;
					var customer_price = 0;
					var unit_price = 0;
					for (var t1 in data) {
						var a2 = data[t1];
						if (a2.prd_id == item) {
							sum = changeSum(sum, a2[_this.xm_sd]);

							transactions_amt = changeSum(transactions_amt, a2.transactions_amt);
							transactions_qty = changeSum(transactions_qty, a2.transactions_qty);
							visitors = changeSum(visitors, a2.visitors);
							shopping_cart = changeSum(shopping_cart, a2.shopping_cart);
							payment_buyers_qty = changeSum(payment_buyers_qty, a2.payment_buyers_qty);
						}
						s = sum;
						if (_this.xm_sd == 'pay_conversion_rate') {
							s = (changeChu(payment_buyers_qty, visitors) * 100).toFixed(2);
						}
						if (_this.xm_sd == 'customer_price') {
							s = (changeChu(transactions_amt, payment_buyers_qty)).toFixed(0);
						}
						if (_this.xm_sd == 'unit_price') {
							s = (changeChu(transactions_amt, transactions_qty)).toFixed(0);
						}
					}
					if (_this.xm_sd == '') {
						s = "";
					}
					return s;
				}
			}
			if (item) {
				return a;
			}
		})

		title2 = title2.filter(function(i) {
			return i;
		});

		tTitle = title1.concat(title2);
		
		dlEx2(tdata);
	}

	table.render({
		id: "table_sda1",
		elem: '#table_sda1',
		data: tdata,
		cols: [
			tTitle
		],
		limit: 10,
		page: true,
		totalRow: true,
	});
	
	//合计,导出数据
	function dlEx(data) {
		var ex_title = [];
		var ex_data = [];
		var ex_total = ['合计'];
		var total = getTotal(_this.goods_data3, {},2)
		for (var j = 0; j < data.length; j++) {
			var d2 = data[j];
			var one = [];
			for (var i in _this.title3) {
				var d = _this.title3[i];
				if (j == 0) {
					ex_title.push(d.title);
					if (total[d.field]) {
						d.totalRowText = total[d.field].toString();
						//组导出数据
						ex_total.push(total[d.field].toString());
					}
				}
				one.push(d2[d.field].toString())
			}
			ex_data.push(one)
		}
		$('#dl_sourceAnaysis').unbind('click').bind('click', function() {
			table.exportFile(ex_title, ex_data, 'xls');
		})
	}
	
	//合计,导出数据 两个商品
	function dlEx2(data) {
		var ex_title = ['商品/来源'].concat(titleName);
		var ex_data = [];
		var ex_total = getDateTotal(_this.goods_total, _this.xm_sd,2)
		for (var i in tTitle, ex_total) {
			var t = tTitle[i];
			var e = ex_total[i];
			t.totalRowText = e;
		}
		console.log(title2)
	
		for (var i in data) {
			var d = data[i];
			var one = [d.name];
			var one1 = [];
			for (var j in title2) {
				var goodid = title2[j].goodid;
				if (one.hasOwnProperty(goodid) == false) {
					one[goodid] = 0;
				}
			}
			for (var k in d.data) {
				var d1 = d.data[k];
				one[d1.prd_id] = changeSum(one[d1.prd_id], d1[_this.xm_sd])
			}
			// one = Object.values(one);
			for (var n in one) {
				var a = one[n].toString();
				one1.push(a)
			}
			ex_data.push(one1);
		}
		ex_data.push(ex_total)
		$('#dl_sourceAnaysis').unbind('click').bind('click', function() {
			table.exportFile(ex_title, ex_data, 'xls');
		})
	}
	
}


function initLayui() {
	var _this = vm;
	var form = layui.form;
	form.render();

	form.on('checkbox(dx3)', function(data) {
		var index = data.value;
		var ifshow = !data.elem.checked;
		_this.title3[index].hide = ifshow;
		layui.table.reload('table_sda1', {
			cols: [
				_this.title3
			]
		})
	});
}


function selectRadio3(el, data) {
	var _this = vm;
	var demo_select = xmSelect.render({
		direction: 'down',
		el: el,
		size: 'mini',
		radio: true,
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
		height: 400,
		data: data,
		on: function(d) {
			if (el == '#xm-goods1') {
				var goods1 = g1(d);
				_this.sel_goods[0] = goods1;
				_this.send3.prd_id = goods1;
				_this.sel_goods3 = _this.sel_goods.filter(function(item) {
					if (item) {
						return item;
					}
				});
				getGoodsAnalysis();
			}
			if (el == '#xm-goods2') {
				var goods2 = g1(d);
				_this.sel_goods[1] = goods2;
				_this.send3.prd_id2 = goods2;
				_this.sel_goods3 = _this.sel_goods.filter(function(item) {
					if (item) {
						return item;
					}
				});
				getGoodsAnalysis();
			}
			if (el == '#xm-goods3') {
				var goods3 = g1(d);
				_this.sel_goods[2] = goods3;
				_this.send3.prd_id3 = goods3;
				_this.sel_goods3 = _this.sel_goods.filter(function(item) {
					if (item) {
						return item;
					}
				});
				getGoodsAnalysis();
			}
			if (el == '#xm-select-sa1') {
				var s1 = g1(d);
				_this.xm_sa1 = s1;
				fillEachart3()
			}
			if (el == '#xm-select-sa2') {
				var s2 = g1(d);
				_this.xm_sa2 = s2;
				fillEachart3()
			}
			if (el == '#xm-select-sd') {
				var sd = g1(d);
				_this.xm_sd = sd;
				fillTable3()
			}

			function g1(d) {
				if (d.arr.length > 0) {
					return d.arr[0].value;
				} else {
					return '';
				}
			}
		}
	});
	if (el == '#xm-goods1') {
		if (data.length > 0) {
			_this.send.prd_id = data[0].value;
			_this.sel_goods[0] = data[0].value;
			demo_select.setValue([_this.sel_goods[0]]);
		}
	}
}
