var vm = new Vue({
	el: '#vue',
	data: {
		send: {
			date: '2020-01-01_2020-06-30',
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
		selectDateShow: '2020-01-01_2020-06-30',
		daterange: [],
		monthrange: [],
		// 日期控制的变量  结束 ============================

		tap: 1,
		xm_shop: true,
		xm_category: false,
		xm_brand: true,
		xm_goods1: false,
		xm_goods2: false,
		xm_goods3: false,

		sel_goods: [],
		sel_goods3: [],
		sel_eq: '全部',
		sel_shop: '',
		sel_flowTrend1: 'transactions_amt',
		sel_xm1: '',
		sel_xm2: '全部',
		sel_xm3: '全部',
		sel_xm4: 'transactions_amt',
		sel_brand: '',

		eq_arr: [{
				name: '全部',
				value: '全部',
				selected: true
			},
			{
				name: 'PC',
				value: '1'
			},
			{
				name: '无线',
				value: '2'
			},
		],
		xm_arr1: [{
				name: '支付金额',
				value: 'transactions_amt',
				selected: true
			},
			{
				name: '访客数',
				value: 'visitors'
			},
			{
				name: '加购人数',
				value: 'shopping_cart'
			},
			// {
			// 	name: '支付买家数',
			// 	value: 'payment_buyers_qty'
			// },
			// {
			// 	name: '支付转化率',
			// 	value: 'pay_conversion_rate'
			// },
			// {
			// 	name: '客单价',
			// 	value: 'customer_price'
			// },
			{
				name: '支付买家数',
				value: 'transactions_qty'
			},
			{
				name: '客单价',
				value: 'unit_price'
			},
		],
		xm_arr2: [
			// {
			// 	name: '全部',
			// 	value: '全部',
			// 	selected: true
			// },
			// {
			// 	name: '站内自然',
			// 	value: '站内自然',
			// },
			// {
			// 	name: '站内营销',
			// 	value: '站内营销'
			// },
			// {
			// 	name: '付费广告',
			// 	value: '付费广告'
			// },
			// {
			// 	name: '站内其他',
			// 	value: '站内其他'
			// },
		],
		xm_arr3: [
			// {
			// 	name: '全部',
			// 	value: '全部',
			// 	selected: true
			// },
			// {
			// 	name: '京东快车',
			// 	value: '京东快车'
			// },
			// {
			// 	name: '独立海报',
			// 	value: '独立海报'
			// },
		],
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
			var _this = this;
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
				// $($('.word')[1]).addClass('wordClick');
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

			this.daterange = '';
			this.dateValue = '';
			this.monthrange = '';

			if (_this.tap == 1) {
				_this.getShopSource();
			}
			if (_this.tap == 2) {
				getGoodsDetails()
			}
			if (_this.tap == 3) {
				getGoodsAnalysis()
			}
		},
		//初始化layui
		initLayui() {
			var _this = this;
			var form = layui.form;
			form.render();

			cb('checkbox(dx1)', 'table_source_detail');

			function cb(cb, table) {
				form.on(cb, function(data) {
					var index = data.value;
					var ifshow = !data.elem.checked;
					_this.title1[index].hide = ifshow;
					layui.table.reload(table, {
						cols: [
							_this.title1
						]
					})
				});
			}
		},

		initConTop() {
			var height2 = $('.fixedTitle').height() + 10;
			$('.layui-fluid').css('margin-top', height2)
		},

		initSelect() {
			var _this = this;
			this.selectRadio('#xm-1flowTrend', this.xm_arr1)
			// this.selectRadio('#xm-eq', this.eq_arr)

			this.selectRadio('#xm-select4', _this.xm_arr1)

		},

		selectRadio(el, data) {
			var _this = this;
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
				height: 400,
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
					if (el == '#xm-brand') {
						_this.sel_brand = g1(d);
						_this.filterData1();
					}
					if (el == '#xm-1flowTrend') {
						_this.sel_flowTrend1 = g1(d);
						_this.fillsel_flowTrend1()
					}
					if (el == '#xm-select1') {
						_this.sel_xm1 = g1(d)
						_this.detailFlowTrend();
					}
					if (el == '#xm-select2') {
						_this.sel_xm2 = g1(d)
						_this.sel_xm3 = '全部';
						_this.detailFlowTrend();

						var cate2 = [{
							"name": "全部",
							"value": '全部',
							"selected": true
						}];
						_this.xm_arr3.forEach(function(item2) {
							if (_this.sel_xm2 == item2.parent) {
								cate2.push(item2)
							}
						})
						if (_this.sel_xm2 == '全部') {
							cate2 = _this.xm_arr3;
						}
						_this.selectRadio('#xm-select3', cate2)
					}
					if (el == '#xm-select3') {
						_this.sel_xm3 = g1(d)
						_this.detailFlowTrend();
					}
					if (el == '#xm-select4') {
						_this.sel_xm4 = g1(d)
						_this.detailFlowTrend();
					}
				}
			});

			function g1(d) {
				if (d.arr.length > 0) {
					return d.arr[0].value;
				} else {
					return '';
				}
			}
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
				on: function(d) {}
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

		//选项卡变化
		changeTap(tap) {
			var _this = this;
			if (tap != this.tap) {
				if (tap == 1) {
					_this.tap = 1;
					_this.xm_shop = true;
					_this.xm_category = false;
					_this.xm_brand = true;
					_this.xm_goods1 = false;
					_this.xm_goods2 = false;
					_this.xm_goods3 = false;

					_this.getShopSource()
				}
				if (tap == 2) {
					_this.tap = 2;
					_this.xm_shop = true;
					_this.xm_category = true;
					_this.xm_brand = true;
					_this.xm_goods1 = false;
					_this.xm_goods2 = false;
					_this.xm_goods3 = false;
					getGoodsDetails()
				}
				if (tap == 3) {
					_this.tap = 3;
					_this.xm_shop = false;
					_this.xm_category = false;
					_this.xm_brand = false;
					_this.xm_goods1 = true;
					_this.xm_goods2 = true;
					_this.xm_goods3 = true;
					getGoods()
					goodsAnalysis()
				}
				setTimeout(function() {
					_this.initConTop();
				}, 50)
			}
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
						_this.allShopNameData = res.data;
						if (res.data.length > 0) {
							_this.time_data.start_time = res.data[0].data_star;
							_this.time_data.end_time = res.data[0].data_end;
							_this.selectDateShow = res.data[0].data_end + '_' + res.data[0].data_end;
							_this.daterange = [res.data[0].data_end, res.data[0].data_end];
							_this.send.date = _this.selectDateShow;
						}
						_this.getShopSource();
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
			_this.arr_shop = [];
			for (var i in arr_shop) {
				var d = arr_shop[i]
				if (d.platform == 2) {
					arr_shop[i].name = arr_shop[i].shop_name + '(' + changePlatform(d.platform) + ')';
					arr_shop[i].value = arr_shop[i].id;
					_this.arr_shop.push(arr_shop[i]);
				}
			}
			_this.selectRadio('#xm-shop', _this.arr_shop)
			_this.sel_shop = _this.arr_shop[0].id;
			xmSelect.get('#xm-shop')[0].setValue([_this.sel_shop]);

			this.selectRadio('#xm-select1', _this.arr_shop)
		},

		getShopSource() {
			var _this = this;
			addLoading()
			$.ajax({
				url: url_jd_source,
				data: _this.send,
				type: 'post',
				dataType: 'json',
				timeout:60000,
				success: function(res) {
					removeLoading()
					checkStatus(res, function() {
						_this.allShopSourceData = res.data;
						_this.arr_brand = [];
						var allShopSourceData = _this.allShopSourceData;
						if (allShopSourceData.length > 0) {
							_this.sel_brand = allShopSourceData[0].brand;
							for (var i in allShopSourceData) {
								var d = allShopSourceData[i];
								//获取品牌
								var brand = d.brand;
								if (_this.arr_brand.hasOwnProperty(brand) == false) {
									_this.arr_brand[brand] = {
										name: brand,
										value: brand,
									}
								}
							}
						}

						_this.selectRadio('#xm-brand', Object.values(_this.arr_brand));
						_this.selectRadio('#xm-select1', Object.values(_this.arr_brand));
						if (allShopSourceData.length > 0) {
							xmSelect.get('#xm-brand')[0].setValue([allShopSourceData[0].brand]);
						}

						_this.filterData1();
					});
				},
				error: function() {
					removeLoading()
					layer.alert('请求失败')
				}
			});
		},

		//过滤数据 店铺来源
		filterData1() {
			var _this = this;
			_this.date_arr = [];
			_this.sel_flowTrend1_arr = [];
			_this.flow_data = [];

			var allShopSourceData = _this.allShopSourceData;
			allShopSourceData = _this.filterThis(_this.sel_brand, allShopSourceData, 'brand');
			// allShopSourceData = _this.filterThis(_this.sel_eq, allShopSourceData, 'terminal');
			// allShopSourceData = _this.filterThis(_this.sel_shop, allShopSourceData, 'shop_id');

			for (var i in allShopSourceData) {
				var d = allShopSourceData[i];
				// d.shop_name = changeShopName(d.shop_id, _this.allShopNameData);

				//获取所有日期
				var date = d.statistics_date;
				if (_this.date_arr.hasOwnProperty(date) == false) {
					_this.date_arr[date] = [];
				}
				_this.date_arr[date].push(d);

				if (_this.sel_flowTrend1_arr.indexOf(d.category1_source) == -1) {
					_this.sel_flowTrend1_arr.push(d.category1_source)
					_this.flow_data[d.category1_source] = [];
				}
				_this.flow_data[d.category1_source].push(d)
			}

			_this.shopSource();
		},

		//过滤选择
		filterThis(select, data, str) {
			if (!data) {
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
		},

		// 店铺来源
		shopSource() {
			var _this = this;
			_this.fillsel_flowTrend1();

			_this.detailFlowTrend(1);

			_this.tableSourceDetail();
		},

		//一级流量趋势
		fillsel_flowTrend1() {
			var _this = this;
			var data_top = ['日期'].concat(_this.sel_flowTrend1_arr);
			var data_all = [data_top];
			var data_num = _this.changeEarchData(_this.sel_flowTrend1_arr, _this.date_arr, 'category1_source', _this.sel_flowTrend1)
			data_all = data_all.concat(data_num);
			var title = changeTar(_this.sel_flowTrend1)
			if(title){
				title = title+'趋势图';
			}
			polygonal('echart_1flowTrend', data_all, title);
		},

		//细分流量趋势
		detailFlowTrend(ci) {
			var _this = this;
			//过滤选择
			var allShopSourceData = _this.allShopSourceData;
			// allShopSourceData = _this.filterThis(_this.sel_eq, allShopSourceData, 'terminal');

			var sel_shop = [_this.sel_brand];
			if (_this.sel_xm1) {
				sel_shop.push(_this.sel_xm1);
			}
			allShopSourceData = _this.filterThis(sel_shop, allShopSourceData, 'brand');
			// allShopSourceData = _this.filterThis(sel_shop, allShopSourceData, 'shop_id');
			allShopSourceData = _this.filterThis(_this.sel_xm2, allShopSourceData, 'category1_source');
			allShopSourceData = _this.filterThis(_this.sel_xm3, allShopSourceData, 'category2_source');

			_this.shop_data1 = [];
			if (ci == 1) {
				_this.xm_arr2 = [];
				_this.xm_arr3 = [];
			}
			var date_arr = [];
			for (var i in allShopSourceData) {
				var d = allShopSourceData[i];
				// d.shop_name = changeShopName(d.shop_id, _this.allShopNameData);
				//获取所有日期
				var date = d.statistics_date;
				if (date_arr.hasOwnProperty(date) == false) {
					date_arr[date] = [];
				}
				date_arr[date].push(d);
				if (ci == 1) {
					getArrSelect(d);
				}
			}

			var al = [{
				"name": "全部",
				"value": '全部',
				"selected": true
			}];
			if (ci == 1) {
				_this.xm_arr2 = al.concat(Object.values(_this.xm_arr2));
				_this.xm_arr3 = al.concat(Object.values(_this.xm_arr3));
				_this.selectRadio('#xm-select2', _this.xm_arr2)
				_this.selectRadio('#xm-select3', _this.xm_arr3)
			}

			var data_num = _this.changeEarchData(sel_shop, date_arr, 'brand', _this.sel_xm4);
			var data_top = ['日期'].concat(sel_shop);
			var data_all = [data_top];
			data_all = data_all.concat(data_num);
			var title = changeTar(_this.sel_xm4)
			if(title){
				title = title+'趋势图';
			}
			polygonal('echart_2flowTrend', data_all,title);

			if (_this.sel_brand == '') {
				$('#echart_2flowTrend').hide();
				$('.tips').show();
			} else {
				$('#echart_2flowTrend').show();
				$('.tips').hide();
			}

			function getArrSelect(data) {
				get1(_this.xm_arr2, 'category1_source');
				get1(_this.xm_arr3, 'category2_source');

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

		},

		changeEarchData(select, tdata, dif, str) {
			var _this = this;
			var data_num = [];
			for (var i in tdata) {
				var dd = tdata[i];
				if (_this.dateType == 'week') {
					var year = i.split('-')[0];
					i = year + '年第' + getWeekInYear(i) + '周';
				}
				if (_this.dateType == 'monthrange') {
					var arr = i.split('-');
					i = arr[0] + '-' + arr[1];
				}
				var arr = [i];
				for (var k in select) {
					var i1 = select[k];
					var data = 0;

					var transactions_amt = 0;
					var transactions_qty = 0;
					var visitors = 0;
					var shopping_cart = 0;
					var payment_buyers_qty = 0;
					var pay_conversion_rate = 0;
					var customer_price = 0;
					var unit_price = 0;

					for (var j in dd) {
						var i2 = dd[j];
						if (i1 == i2[dif]) {
							data = changeSum(data, i2[str]);

							transactions_amt = changeSum(transactions_amt, i2.transactions_amt);
							transactions_qty = changeSum(transactions_qty, i2.transactions_qty);
							visitors = changeSum(visitors, i2.visitors);
							shopping_cart = changeSum(shopping_cart, i2.shopping_cart);
							payment_buyers_qty = changeSum(payment_buyers_qty, i2.payment_buyers_qty);
						}
					}

					if (str == 'pay_conversion_rate') {
						pay_conversion_rate = (changeChu(payment_buyers_qty, visitors) * 100).toFixed(2);
						data = pay_conversion_rate;
					}
					if (str == 'customer_price') {
						customer_price = changeChu(transactions_amt, payment_buyers_qty).toFixed(0);
						data = customer_price;
					}
					if (str == 'unit_price') {
						unit_price = changeChu(transactions_amt, transactions_qty).toFixed(0);
						data = unit_price;
					}
					arr.push(data);
				}
				data_num.push(arr);
			}
			data_num.sort(function(a, b) {
				var a1 = new Date(a[0]).getTime();
				var b1 = new Date(b[0]).getTime();
				return a1 - b1;
			})
			return data_num;
		},

		//来源明细
		tableSourceDetail() {
			var _this = this;
			var table = layui.table;

			var tData = changeFuZi('category2_source', _this.flow_data,2)

			var tableId = 'table_source_detail';
			var transactions_amt = 0;
			var transactions_qty = 0;
			var visitors = 0;
			var shopping_cart = 0;
			var payment_buyers_qty = 0;
			var pay_conversion_rate = 0;
			var customer_price = 0;
			var unit_price = 0;
			_this.title1 = [{
					field: 'name',
					title: '来源',
					sort: false,
					minWidth: 170,
					templet: function(d) {
						var s;
						if (d.pla) {
							title = '收起';
							var icon = 'layui-icon-reduce-circle';
							if (d.showZi == false) {
								icon = 'layui-icon-add-circle';
								title = '展开';
							}
					
							s = `<span title="`+title+`" lay-event="edit"><i class="layui-icon ` + icon + ` tbtn"></i>` + d.name + '</span>';
						} else {
							s = `<span title="`+title+`" style="margin-left: 20px;" parent_pla=` + d.parent_pla + `>` + d.name + `</span>`;
						}
						return s;
					},
					totalRowText: '合计'
				},
				{
					field:'transactions_amt',
					title: '支付金额(元)',
					sort: false,
					minWidth: 130,
					// templet: function(d) {
					// 	transactions_amt = _this.ts(d, 'transactions_amt');
					// 	return _this.ts(d, 'transactions_amt');
					// }
					totalRowText: ''
				},
				{
					field:'transactions_qty',
					title: '支付买家数(件)',
					sort: false,
					minWidth: 130,
					// templet: function(d) {
					// 	transactions_qty = _this.ts(d, 'transactions_qty');
					// 	return _this.ts(d, 'transactions_qty');
					// }
					totalRowText: ''
				},
				{
					field:'visitors',
					title: '访客数(人)',
					sort: false,
					minWidth: 130,
					// templet: function(d) {
					// 	visitors = _this.ts(d, 'visitors');
					// 	return _this.ts(d, 'visitors');
					// }
					totalRowText: ''
				},
				{
					field:'shopping_cart',
					title: '加购人数(人)',
					sort: false,
					minWidth: 130,
					// templet: function(d) {
					// 	return _this.ts(d, 'shopping_cart');
					// },
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
				// 		return _this.ts(d, 'payment_buyers_qty');
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
				// 	title: '客单价(元)',
				// 	sort: false,
				// 	minWidth: 130,
				// 	templet: function(d) {
				// 		return (changeChu(transactions_amt, payment_buyers_qty)).toFixed(0);
				// 	}
				// },
			];
			// console.log(tData)
			
			dlEx(tData);
			table.render({
				elem: '#table_source_detail',
				id: 'table_source_detail',
				data: tData,
				limit: 10,
				page: true,
				totalRow: true,
				cols: [
					_this.title1
				]
			});
			_this.t_name = [];
			table.on('tool(table_source_detail)', function(obj) {
				var name = obj.data.name;
				var index = _this.t_name.indexOf(name);
				if (index == -1) {
					_this.t_name.push(name);
				} else {
					_this.t_name.splice(index, 1)
				}
				var data1 = [];
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
				table.reload('table_source_detail', {
					data: data1,
				});
				dlEx(data1);
			});
			
			//合计,导出数据
			function dlEx(data){
				var ex_title = [];
				var ex_data = [];
				var ex_total = ['合计'];
				var total = getTotal(_this.flow_data,{},1)
				for (var j = 0; j < data.length; j++) {
					var d2 = data[j];
					var one = [];
					for (var i in _this.title1) {
						var d = _this.title1[i];
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
				ex_data.push(ex_total)
				$('#dl_sourceDetail').unbind('click').bind('click', function() {
					table.exportFile(ex_title, ex_data, 'xls');
				})
			}
		},

		ts(d, n) {
			var s = 0;
			for (var i in d.data) {
				var a = d.data[i][n];
				s = changeSum(s, a)
			}
			return s;
		},

	}
});