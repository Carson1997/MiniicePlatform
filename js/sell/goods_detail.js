var vm = new Vue({
	el: '#vue',
	data: {
		send: {
			date: '2020-06-01_2020-06-30',
			date_type: '1',
		},
		// 日期控制的变量  开始 ============================
		time_data: {
			start_time: "",
			end_time: ""
		},
		dateValue: '',
		dateType: "daterange",
		selectDate: '---',
		defaultValue: '',
		dataType: 1,
		pickOption: {
			firstDayOfWeek: 1,
			disabledDate: function(time) {}
		},
		pickOptionMonth: {
			firstDayOfWeek: 1,
			disabledDate: function(time) {}
		},
		selectDateShow: '2020-06-01_2020-06-30',
		daterange: [],
		monthrange: [],
		// 日期控制的变量  结束 ============================

		sel_pla: [],
		sel_shop: [],
		sel_category1: [],
		sel_category2: [],
		sel_category3: [],
		sel_brand: [],
	},

	created() {
		window.tClick1 = this.tClick1;
	},

	mounted: function() {

		this.initLayui();

		this.initConTop();

		this.initSelect();

		this.getShop();
	},

	methods: {
		// 限制时间处理函数
		mergeHandle: function(data) {
			this.defaultValue = data.end_time;
			limitDayBegin = new Date(data.start_time.replace('-', '/')).getTime();
			limitDayEnd = new Date(data.end_time.replace('-', '/')).getTime();
			//限制日，周
			this.pickOption.disabledDate = function(time) {
				if (limitDayBegin > time.getTime() || limitDayEnd < time.getTime()) {
					return time;
				}
			}
			//限制月
			var monthStart = moment(limitDayBegin).startOf('month').format('YYYY-MM-DD');
			var dateStart = limitDayBegin;
			if (data.start_time != monthStart) {
				var date1 = moment(data.start_time).subtract(-1, 'months').format('YYYY-MM-DD');
				dateStart = moment(date1).startOf('month').format('YYYY/MM/DD')
				dateStart = new Date(dateStart).getTime();
			}

			var monthLast = moment(limitDayEnd).endOf('month').format('YYYY-MM-DD');
			var dateEnd = limitDayEnd;
			if (data.end_time != monthLast) {
				var date1 = moment(data.end_time).subtract(1, 'months').format('YYYY-MM-DD');
				dateEnd = moment(date1).endOf('month').format('YYYY/MM/DD')
				dateEnd = new Date(dateEnd).getTime();
			}
			this.pickOptionMonth.disabledDate = function(time) {
				if (dateEnd > dateStart) {
					if (dateStart > time.getTime() || dateEnd < time.getTime()) {
						return time;
					}
				} else {
					return time;
				}
			}
		},

		// 日周月被点击  打开日期选择框
		selectLis: function(type, dataType) {
			this.dataType = dataType;
			var data = this.time_data;

			if (this.dateType != type) {
				this.dateValue = '';
				this.dateType = type;
				this.mergeHandle(data);
			} else {
				this.mergeHandle(data);
			}

			if (type == 'daterange') {
				// $('#datePicker1').find('.el-date-editor--daterange').click();
				$('#datePicker1').find('.el-date-editor--daterange')[0].click();
			}
			if (type == 'week') {
				// $('#el-week').focus();
				$('#datePicker1').find('.el-date-editor--daterange')[1].click();
				$('.available').removeClass('in-range start-date');
				$('.available').removeClass('in-range end-date');
			}
			if (type == 'monthrange') {
				$('#datePicker1').find('.el-date-editor--monthrange').click()
			}
		},

		// 时间被点击
		dateClick: function(value) {
			$('.wordClick').removeClass('wordClick');
			var show = '';
			if (this.dateType == 'date') {
				show = value + '_' + value;
				$($('.word')[0]).addClass('wordClick');
			} else if (this.dateType == 'week') {
				var start = moment(value).isoWeekday(1).week(moment(value).isoWeekday(1).week()).startOf('isoweek').format(
					'YYYY-MM-DD');
				var end = moment(value).isoWeekday(1).week(moment(value).isoWeekday(1).week()).endOf('isoweek').format(
					'YYYY-MM-DD');
				show = start + '_' + end;
				$($('.word')[1]).addClass('wordClick');
			} else if (this.dateType == 'month') {
				var start = moment(value).month(moment(value).month()).startOf('month').format('YYYY-MM-DD');
				var end = moment(value).month(moment(value).month()).endOf('month').format('YYYY-MM-DD');
				show = start + '_' + end;
				$($('.word')[2]).addClass('wordClick');
			}
			this.selectDate = show;
			if (this.dateType == 'week') {
				$($('.word')[1]).addClass('wordClick');
				// this.selectDateShow = changeDate(this.selectDate, this.dataType) + ' (' + start.split('-')[0] + '年第' +
				// 	getWeekInYear(start) + '周)';
				// this.send.date = changeDate(this.selectDate, this.dataType);
				this.send.date_type = 2;
				var start = moment(value[0]).isoWeekday(1).week(moment(value[0]).isoWeekday(1).week()).startOf('isoweek').format(
					'YYYY-MM-DD');
				var end = moment(value[1]).isoWeekday(1).week(moment(value[1]).isoWeekday(1).week()).endOf('isoweek').format(
					'YYYY-MM-DD');
				this.selectDateShow = start + '_' + end;
				this.send.date = this.selectDateShow;
			}
			if (this.dateType == 'daterange') {
				$($('.word')[0]).addClass('wordClick');
				this.selectDateShow = value[0] + '_' + value[1];
				this.send.date = this.selectDateShow;
				this.send.date_type = 1;
			}
			if (this.dateType == 'monthrange') {
				$($('.word')[2]).addClass('wordClick');
				var start = moment(value[0]).month(moment(value[0]).month()).startOf('month').format('YYYY-MM-DD');
				var end = moment(value[1]).month(moment(value[1]).month()).endOf('month').format('YYYY-MM-DD');
				var show = start + '_' + end;
				this.selectDateShow = value[0].substr(0, 7) + '_' + value[1].substr(0, 7);
				this.send.date = show;
				this.send.date_type = 3;
			}
			// console.log(this.send)
			this.daterange = '';
			this.dateValue = '';
			this.monthrange = '';
			this.getGoodsData()
		},

		//获取店铺
		getShop() {
			var _this = this;
			addLoading()
			$.ajax({
				url: url_shop,
				type: 'get',
				dataType: 'json',
				timeout:60000,
				success: function(res) {
					removeLoading()
					checkStatus(res, function() {
						// console.log(res)
						var arr_shop = res.data;
						_this.fillShopSelect(arr_shop)
						if (res.data.length > 0) {
							_this.time_data.start_time = res.data[0].data_star;
							_this.time_data.end_time = res.data[0].data_end;
							_this.selectDateShow = res.data[0].data_end + '_' + res.data[0].data_end;
							_this.daterange = [res.data[0].data_end, res.data[0].data_end];
							_this.send.date = _this.selectDateShow;
						}
						_this.getGoodsData()
					});
				},
				error: function() {
					removeLoading()
					layer.alert('请求失败')
				}
			});
		},

		//填充店铺选项
		fillShopSelect(arr_shop) {
			var _this = this;
			for (var i in arr_shop) {
				var d = arr_shop[i]
				arr_shop[i].name = arr_shop[i].shop_name + '(' + changePlatform(d.platform) + ')';
				arr_shop[i].value = arr_shop[i].id;
			}
			_this.arr_shop = arr_shop;
			_this.selectMore('#xm-shop', arr_shop)
		},

		//获取商品数据
		getGoodsData() {
			var _this = this;
			// _this.send.date = '2020-06-08_2020-07-08';
			addLoading()
			$.ajax({
				url: url_shop_detail,
				type: 'post',
				dataType: 'json',
				data: _this.send,
				timeout:60000,
				success: function(res) {
					removeLoading()
					checkStatus(res, function() {
						// console.log(res.data)
						_this.allGoodsData = res.data;
						_this.filterData(1);
					});
				},
				error: function() {
					removeLoading()
					layer.alert('请求失败')
				}
			});
		},

		//过滤数据
		filterData(ci) {
			var _this = this;
			_this.goods_data = [];
			if (ci == 1) {
				_this.arr_category1 = [];
				_this.arr_category2 = [];
				_this.arr_category3 = [];
				_this.arr_brand = [];
			}

			var time1 = new Date(_this.selectDateShow.split('_')[0]).getTime();
			var time2 = new Date(_this.selectDateShow.split('_')[1]).getTime();

			for (var i in _this.allGoodsData) {
				var d = _this.allGoodsData[i];
				d.payment_amt = parseFloat(d.payment_amt).toFixed(2)
				d.shop_name = changeShopName(d.shop_id, _this.arr_shop);
				d.pay_conversion_rate = (changeChu(d.payment_collect_qty, d.visitors) * 100).toFixed(2);
				d.customer_price = changeChu(d.payment_amt, d.payment_collect_qty).toFixed(0);
				d.unit_price = changeChu(d.payment_amt, d.payment_qty).toFixed(0);
				// if(_this.sel_pla.indexOf(d.platform) > -1 && _this.sel_shop.indexOf(d.shop_id) > -1){
				// 	_this.goods_data.push(d);
				// }
				if (ci == 1) {
					getArrSelect(d);
				}

				var time = new Date(d.statistics_date).getTime();
				if (time >= time1 && time <= time2) {
					_this.goods_data.push(d);
				}
			}

			if (ci == 1) {
				_this.arr_category1 = Object.values(_this.arr_category1);
				_this.arr_category2 = Object.values(_this.arr_category2);
				_this.arr_category3 = Object.values(_this.arr_category3);
				_this.arr_brand = Object.values(_this.arr_brand);

				_this.selectRadio('#xm-category1', Object.values(_this.arr_category1));
				_this.selectRadio('#xm-category2', Object.values(_this.arr_category2));
				_this.selectRadio('#xm-category3', Object.values(_this.arr_category3));
				_this.selectMore('#xm-brand', Object.values(_this.arr_brand));
			}

			//获取类目，品牌选项
			function getArrSelect(data) {
				get1(_this.arr_category1, 'category1');
				get1(_this.arr_category2, 'category2');
				get1(_this.arr_category3, 'category3');
				get1(_this.arr_brand, 'brand');

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
			// filterThis(_this.sel_pla, _this.goods_data, 'platform')
			// filterThis(_this.sel_shop, _this.goods_data, 'shop_id')
			// filterThis(_this.sel_category1, _this.goods_data, 'category1')
			// filterThis(_this.sel_category2, _this.goods_data, 'category2')
			// filterThis(_this.sel_category3, _this.goods_data, 'category3')
			// filterThis(_this.sel_brand, _this.goods_data, 'brand')

			// function filterThis(select, data, str) {
			// 	var data1 = data;
			// 	if (select.length > 0) {
			// 		data1 = data.filter(function(d) {
			// 			if (select.indexOf(d[str]) > -1) {
			// 				return d;
			// 			}
			// 		});
			// 	}
			// 	_this.goods_data = data1;
			// }
			_this.goods_data = filterThis(_this.sel_pla, _this.goods_data, 'platform')
			_this.goods_data = filterThis(_this.sel_shop, _this.goods_data, 'shop_id')
			_this.goods_data = filterThis(_this.sel_category1, _this.goods_data, 'category1')
			_this.goods_data = filterThis(_this.sel_category2, _this.goods_data, 'category2')
			_this.goods_data = filterThis(_this.sel_category3, _this.goods_data, 'category3')
			_this.goods_data = filterThis(_this.sel_brand, _this.goods_data, 'brand')

			function filterThis(select, data, str) {
				if (!data || !select) {
					return [];
				}
				var _this = this;
				var data1 = data;
				if (select.length > 0) {
					data1 = data.filter(function(d) {
						if (select.indexOf(d[str]) > -1 && d[str] != '') {
							return d;
						}
					});
				}
				if (select == '全部') {
					data1 = data;
				}
				return data1;
			}

			// console.log(_this.goods_data)

			_this.payment_amt = 0;
			_this.payment_qty = 0;
			_this.visitors = 0;
			_this.shopping_cart = 0;
			_this.payment_collect_qty = 0;
			_this.pay_conversion_rate = 0;
			_this.customer_price = 0;
			_this.unit_price = 0;

			for (var i in _this.goods_data) {
				var d2 = _this.goods_data[i];
				_this.payment_amt = changeSum(_this.payment_amt, d2.payment_amt);
				_this.payment_qty = changeSum(_this.payment_qty, d2.payment_qty);
				_this.visitors = changeSum(_this.visitors, d2.visitors);
				_this.shopping_cart = changeSum(_this.shopping_cart, d2.shopping_cart);
				_this.payment_collect_qty = changeSum(_this.payment_collect_qty, d2.payment_collect_qty);
			}

			_this.pay_conversion_rate = (changeChu(_this.payment_collect_qty, _this.visitors) * 100).toFixed(2);
			_this.customer_price = changeChu(_this.payment_amt, _this.payment_collect_qty).toFixed(0);
			_this.unit_price = changeChu(_this.payment_amt, _this.payment_qty).toFixed(0);

			this.fillTable();
		},

		//初始化layui
		initLayui() {
			var _this = this;
			var form = layui.form;
			form.render();

			form.on('checkbox(dx)', function(data) {
				var index = data.value;
				var ifshow = !data.elem.checked;
				_this.title[index].hide = ifshow;
				layui.table.reload('table_goods', {
					cols: [
						_this.title
					]
				})
			});
		},

		initConTop() {
			var height2 = $('.fixedTitle').height() + 10;
			$('.layui-fluid').css('margin-top', height2);
		},

		initSelect() {
			var _this = this;
			_this.arr_pla = [{
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
			_this.arr_shop = [];
			_this.selectMore('#xm-platform', _this.arr_pla)
		},

		selectRadio(el, data) {
			var _this = this;
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
							_this.selectRadio('#xm-category2', arr_n);

							var arr_n2 = [];
							arr_n.forEach(function(item) {
								_this.arr_category3.forEach(function(item2) {
									if (item.value == item2.parent) {
										arr_n2.push(item2)
									}
								})
							})
							_this.selectRadio('#xm-category3', arr_n2);
						} else {
							_this.selectRadio('#xm-category2', _this.arr_category2);
							_this.selectRadio('#xm-category3', _this.arr_category3);
						}

						_this.filterData()
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
							_this.selectRadio('#xm-category3', arr_n);
						} else {
							_this.selectRadio('#xm-category3', _this.arr_category3);
						}

						_this.filterData()
					}
					//类目3选择
					if (el == '#xm-category3') {
						_this.sel_category3 = [];
						if (d.arr.length > 0) {
							_this.sel_category3 = d.arr.map(function(item) {
								return item.value.toString();
							});
						}
						_this.filterData()
					}
				}
			});
		},

		selectMore(el, data) {
			var _this = this;
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
					//平台选择
					if (el == '#xm-platform') {
						_this.sel_pla = [];
						_this.sel_shop = [];
						if (d.arr.length > 0) {
							var arr_shop_n = [];
							_this.sel_pla = d.arr.map(function(item) {
								_this.arr_shop.forEach(function(item2) {
									if (item.value == item2.platform) {
										arr_shop_n.push(item2);
									}
								})
								return item.value.toString();
							})
							_this.selectMore('#xm-shop', arr_shop_n)
						} else {
							_this.selectMore('#xm-shop', _this.arr_shop)
						}
						_this.filterData()
					}
					//店铺选择
					if (el == '#xm-shop') {
						_this.sel_shop = [];
						if (d.arr.length > 0) {
							_this.sel_shop = d.arr.map(function(item) {
								return item.value.toString();
							});
						}
						_this.filterData()
					}
					//品牌选择
					if (el == '#xm-brand') {
						_this.sel_brand = [];
						if (d.arr.length > 0) {
							_this.sel_brand = d.arr.map(function(item) {
								return item.value.toString();
							});
						}
						_this.filterData()
					}
				}
			});
		},

		//下拉图标
		clickTitleIcon() {
			var t = $('.titleIcon i').attr('class');
			var height = $('.fixedTitle').height();
			var height1 = $('.layui-fluid').offset().top;
			var offset2;
			var offset1;
			if (t.indexOf('layui-icon-up') != -1) {
				this.content_top = height1;
				offset2 = 10;
				offset1 = height;
				$('.titleIcon i').attr('class', 'layui-icon layui-icon-down');
			} else {
				$('.titleIcon i').attr('class', 'layui-icon layui-icon-up');
				offset2 = this.content_top;
				offset1 = 0;
			}

			$('.fixedTitle').animate({
				'margin-top': '-' + offset1,
			}, ".1s");

			$('.layui-fluid').animate({
				'margin-top': offset2,
			}, ".1s");
		},

		fillTable() {
			var _this = this;
			var table = layui.table;
			// console.log(_this.goods_data)
			_this.title = [{
					field: 'shop_name',
					title: '店铺',
					sort: false,
					minWidth: 170,
					totalRowText: '合计'
				},
				{
					field: 'model_num',
					title: '商品',
					sort: false,
					minWidth: 170,
					totalRowText: ''
				},
				{
					field: 'payment_amt',
					title: '支付金额(元)',
					sort: false,
					minWidth: 130,
					totalRowText: _this.payment_amt
				},
				{
					field: 'payment_qty',
					title: '支付件数(件)',
					sort: false,
					minWidth: 130,
					totalRowText: _this.payment_qty
				},
				{
					field: 'visitors',
					title: '访客数(人)',
					sort: false,
					minWidth: 130,
					totalRowText: _this.visitors
				},
				{
					field: 'shopping_cart',
					title: '加购人数(人)',
					sort: false,
					minWidth: 130,
					totalRowText: _this.shopping_cart
				},
				{
					field: 'payment_collect_qty',
					title: '支付买家数(人)',
					sort: false,
					minWidth: 130,
					totalRowText: _this.payment_collect_qty
				},
				{
					field: 'pay_conversion_rate',
					title: '支付转化率(%)',
					sort: false,
					minWidth: 130,
					totalRowText: _this.pay_conversion_rate
				},
				{
					field: 'customer_price',
					title: '客单价(元)',
					sort: false,
					minWidth: 130,
					totalRowText: _this.customer_price
				},
				{
					field: 'unit_price',
					title: '件单价(元)',
					sort: false,
					minWidth: 130,
					totalRowText: _this.unit_price
				},
				{
					title: '操作',
					minWidth: 90,
					templet: function(d) {
						var prd_id = d.prd_id;
						var s = `<span class="tClick" prd_id=` + prd_id + ` onclick="tClick1(` + prd_id + `)">商品分析</span>`;
						return s;
					}
				}
			];

			//合计,导出数据
			var ex_title = [];
			var ex_data = [];
			var ex_total = [];
			for (var j = 0; j < _this.goods_data.length; j++) {
				var d2 = _this.goods_data[j];
				var one = [];
				for (var i in _this.title) {
					var d = _this.title[i];
					if (d.title != '操作') {
						if (j == 0) {
							ex_title.push(d.title);

							ex_total.push(d.totalRowText.toString());
						}
						one.push(d2[d.field].toString())
					}
				}
				ex_data.push(one)
			}
			ex_data.push(ex_total)
			$('#dl').unbind('click').bind('click', function() {
				table.exportFile(ex_title, ex_data, 'xls');
			})
			
			_this.goods_data.sort(function(a, b) {
				return  b.payment_amt - a.payment_amt;
			})
			table.render({
				id: "table_goods",
				elem: '#table_goods',
				data: _this.goods_data,
				cols: [
					_this.title
				],
				limit: 10,
				page: true,
				totalRow: true
			});

		},

		tClick1(prd_id) {
			localStorage.prd_id = prd_id;
			parent.$('.s-level').each(function() {
				if ($(this).text() == '商品分析') {
					$(this).click();
				}
			})
		}

	}
});
