var vm = new Vue({
	el: '#vue',
	data: {
		send: {
			date: '2020-01-01_2020-06-30',
			date_type: '1',
			prd_id: '590716085952',
			// prd_id2: '604472854982',
			// prd_id3: '594661106285',
			platform: '1',
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

		// sel_goods: ['554965391244', '604472854982', '594661106285'],
		sel_goods: ['590716085952'],

		payment_amt: [],
		payment_qty: [],
		visitors: [],
		shopping_cart: [],
		payment_collect_qty: [],
		pay_conversion_rate: [],
		customer_price: [],
		unit_price: [],

		s_tar: 'payment_amt',
		sel_pla: '1',
		sel_s1: '全部',
		sel_s2: 'payment_amt',

		tarShow: true
	},

	mounted: function() {
		this.initLayui();

		this.initConTop();

		this.initSelect();

		this.initHeZiClick();

		this.getShop();

		// this.getJpFlowDetail();
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

			this.getPlaData();
			// this.getJpFlowDetail();
		},


		//初始化layui
		initLayui() {
			var form = layui.form;
			form.render()
		},

		initConTop() {
			var height2 = $('.fixedTitle').height() + 10;
			$('.layui-fluid').css('margin-top', height2)
		},

		initSelect() {
			var _this = this;
			var xm_arr1 = [{
					name: '支付金额',
					value: 'payment_amt',
					selected: true
				},
				{
					name: '访客数',
					value: 'visitors'
				},
				{
					name: '支付买家数',
					value: 'payment_buyers_qty'
				},
				{
					name: '支付转化率',
					value: 'pay_conversion_rate'
				},
				{
					name: '客单价',
					value: 'customer_price'
				},
			];
			_this.selectRadio('#xm-select2', xm_arr1)

			var arr_pla = [{
					name: '淘宝',
					value: '1',
					selected: true
				},
				{
					name: '京东',
					value: '2'
				},
				{
					name: '苏宁',
					value: '3'
				},
				// {
				// 	name: '猫宁',
				// 	value: '4'
				// }
			];
			_this.selectRadio('#xm-platform', arr_pla);

			// var arr = [{
			// 		name: '全部',
			// 		value: '全部',
			// 		selected: true
			// 	},
			// 	{
			// 		name: '淘宝首页',
			// 		value: '淘宝首页'
			// 	},
			// 	{
			// 		name: '天猫首页',
			// 		value: '天猫首页'
			// 	},
			// 	{
			// 		name: '淘宝搜索',
			// 		value: '淘宝搜索'
			// 	},
			// 	{
			// 		name: '天猫搜索',
			// 		value: '天猫搜索'
			// 	},
			// 	{
			// 		name: '直通车',
			// 		value: '直通车'
			// 	},
			// 	{
			// 		name: '淘宝客',
			// 		value: '淘宝客'
			// 	},
			// 	{
			// 		name: '淘宝其他店铺',
			// 		value: '淘宝其他店铺'
			// 	},
			// ];
			// _this.selectRadio('#xm-select1', arr);
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

		//合子点击
		initHeZiClick() {
			var _this = this;
			$('.myBorderHeZi').click(function() {
				$(this).siblings().removeClass('selectHezi');
				$(this).addClass('selectHezi');

				_this.s_tar = $(this).attr('data');
				_this.filterData1();
			})
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
						if (res.data.length > 0) {
							_this.time_data.start_time = res.data[0].data_star;
							_this.time_data.end_time = res.data[0].data_end;
							_this.selectDateShow = res.data[0].data_end + '_' + res.data[0].data_end;
							_this.daterange = [res.data[0].data_end, res.data[0].data_end];
							_this.send.date = _this.selectDateShow;
						}
					});

					_this.getGoods();
				},
				error: function() {
					removeLoading()
					layer.alert('请求失败')
				}
			});
		},

		//获取商品
		getGoods() {
			var _this = this;
			addLoading()
			$.ajax({
				url: url_jp_goods,
				type: 'get',
				dataType: 'json',
				timeout:60000,
				success: function(res) {
					removeLoading()
					checkStatus(res, function() {
						_this.arr_goods = res.data;
						_this.fillGoodsSelect()
					});
				},
				error: function() {
					removeLoading()
					layer.alert('请求失败')
				}
			});
		},

		//填充商品选项
		fillGoodsSelect() {
			var _this = this;
			var arr1 = [];
			_this.myprd = [];

			var myprd = _this.arr_goods.myprd;
			for (var i in myprd) {
				var d = myprd[i]
				if (arr1.indexOf(d.prd_id) == -1 && _this.sel_pla == d.platform) {
					arr1.push(d.prd_id);
					var one = {
						name: d.model_num,
						value: d.prd_id
					}
					_this.myprd.push(one)
				}
			}

			var arr2 = [];
			_this.competitorprd = [];
			var competitorprd = _this.arr_goods.competitorprd;
			for (var i in competitorprd) {
				var d = competitorprd[i];
				if (arr2.indexOf(d.prd_id) == -1 && _this.sel_pla == d.platform) {
					arr2.push(d.prd_id);
					var one = {
						name: d.model_num,
						value: d.prd_id
					}
					_this.competitorprd.push(one)
				}
			}

			_this.selectRadio('#xm-goods1', _this.myprd)
			_this.selectRadio('#xm-goods2', _this.competitorprd)
			_this.selectRadio('#xm-goods3', _this.competitorprd)

			_this.getPlaData();
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
					if (el == '#xm-platform') {
						var pla = g1(d);
						_this.send.platform = pla;
						_this.sel_pla = pla;
						// _this.getPlaData()
						_this.fillGoodsSelect()

						// if (pla == 2) {
						// 	$('.cjd').addClass('disabled')
						// }
						// if (pla != 2) {
						// 	$('.cjd').removeClass('disabled')
						// }
						if (pla == 1) {
							_this.tarShow = true;
						} else {
							_this.tarShow = false;
						}
					}
					if (el == '#xm-goods1') {
						var goods1 = g1(d);
						_this.sel_goods[0] = goods1;
						_this.send.prd_id = goods1;
						_this.getPlaData()
						// _this.filterData2()
					}
					if (el == '#xm-goods2') {
						var goods2 = g1(d);
						_this.sel_goods[1] = goods2;
						_this.send.prd_id2 = goods2;
						_this.getPlaData()
						// _this.filterData2()
					}
					if (el == '#xm-goods3') {
						var goods3 = g1(d);
						_this.sel_goods[2] = goods3;
						_this.send.prd_id3 = goods3;
						_this.getPlaData()
						// _this.filterData2()
					}
					if (el == '#xm-select1') {
						var s1 = g1(d);
						_this.sel_s1 = s1;
						_this.filterData2()
					}
					if (el == '#xm-select2') {
						var s2 = g1(d);
						_this.sel_s2 = s2;
						_this.filterData2()
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

			function g1(d) {
				if (d.arr.length > 0) {
					return d.arr[0].value;
				} else {
					return '';
				}
			}

			if (el == '#xm-goods1') {
				if (data.length > 0) {
					_this.send.prd_id = data[0].value;
					_this.sel_goods[0] = data[0].value;
					demo_select.setValue([_this.sel_goods[0]]);

					_this.send.prd_id2 = '';
					_this.send.prd_id3 = '';
					_this.sel_goods[1] = '';
					_this.sel_goods[2] = '';
				}
			}
		},

		getPlaData() {
			var _this = this;
			addLoading()
			$.ajax({
				url: url_jp_flowAnalysis,
				// url:url_jp_flowAnalysis,
				type: 'post',
				data: _this.send,
				dataType: 'json',
				timeout:60000,
				success: function(res) {
					removeLoading()
					checkStatus(res, function() {
						// console.log(res.data)
						_this.allPlaData = res.data.pro;
						_this.filterData1()

						_this.allFlowData = res.data.flow;
						_this.filterData2(1)

					});
				},
				error: function() {
					removeLoading()
					layer.alert('请求失败')
				}
			});
		},

		//过滤数据
		filterData1() {
			var _this = this;
			_this.payment_amt = [];
			_this.payment_qty = [];
			_this.visitors = [];
			_this.shopping_cart = [];
			_this.payment_collect_qty = [];
			_this.pay_conversion_rate = [];
			_this.customer_price = [];
			_this.unit_price = [];
			_this.pla_data = [];
			_this.date_arr = [];

			// 过滤选择
			var allPlaData = _this.allPlaData;
			allPlaData = _this.filterThis(_this.sel_pla, allPlaData, 'platform');
			for (var j in _this.sel_goods) {
				var pla = _this.sel_goods[j];
				if (pla) {
					_this.pla_data[pla] = [];
				}
			}

			var time1 = new Date(_this.selectDateShow.split('_')[0]).getTime();
			var time2 = new Date(_this.selectDateShow.split('_')[1]).getTime();
			// console.log(allPlaData)
			for (var i in allPlaData) {
				var d = allPlaData[i];

				//获取所有日期
				var date = d.statistics_date;
				if (_this.date_arr.hasOwnProperty(date) == false) {
					_this.date_arr[date] = [];
				}
				_this.date_arr[date].push(d);

				//对应不同商品
				var prd_id = d.prd_id;
				if (_this.pla_data[prd_id]) {
					var time = new Date(date).getTime();
					if (time >= time1 && time <= time2) {
						_this.pla_data[prd_id].push(d)
					}
				}

			}

			for (var i in _this.pla_data) {
				var d = _this.pla_data[i];
				var payment_amt = 0;
				var payment_qty = 0;
				var visitors = 0;
				var shopping_cart = 0;
				var payment_collect_qty = 0;
				var pay_conversion_rate = 0;
				var customer_price = 0;
				var unit_price = 0;
				for (var k in d) {
					var d1 = d[k];
					payment_amt = changeSum(payment_amt, d1.payment_amt);
					payment_qty = changeSum(payment_qty, d1.payment_qty);
					visitors = changeSum(visitors, d1.visitors);
					shopping_cart = changeSum(shopping_cart, d1.shopping_cart);
					payment_collect_qty = changeSum(payment_collect_qty, d1.payment_collect_qty);
				}

				var index = _this.sel_goods.indexOf(i);
				var na = '竞品' + index;
				if (index == 0) {
					na = '我的竞品';
				}


				_this.payment_amt.push({
					pla: na,
					data: payment_amt
				});
				_this.payment_qty.push({
					pla: na,
					data: payment_qty
				});
				_this.visitors.push({
					pla: na,
					data: visitors
				});
				_this.shopping_cart.push({
					pla: na,
					data: shopping_cart
				});


				pay_conversion_rate = (changeChu(payment_collect_qty, visitors) * 100).toFixed(2);
				customer_price = changeChu(payment_amt, payment_collect_qty).toFixed(0);
				unit_price = changeChu(payment_amt, payment_qty).toFixed(0);
				if (_this.sel_pla == 2) {
					pay_conversion_rate = (changeChu(payment_qty, visitors) * 100).toFixed(2);
				}
				_this.payment_collect_qty.push({
					pla: na,
					data: payment_collect_qty
				});
				_this.pay_conversion_rate.push({
					pla: na,
					data: pay_conversion_rate
				});
				_this.customer_price.push({
					pla: na,
					data: customer_price
				});
				_this.unit_price.push({
					pla: na,
					data: unit_price
				});
			}

			_this.fillEachart(_this.date_arr, _this.s_tar, 'echart_goodsTrend');
		},

		//折线图
		fillEachart(date, str, div) {
			var _this = this;
			var date_arr = date;
			var goods = _this.sel_goods.map(function(t, d) {
				if (t) {
					if (d == 0) {
						return '我的商品'
					}
					return '竞品' + d;
				}
			});
			goods = goods.filter(function(i) {
				return i;
			})
			var data_top = ['日期'].concat(goods);
			var data_num = [];
			for (var i in date_arr) {
				var dd = date_arr[i];
				if (_this.dateType == 'week') {
					var year = i.split('-')[0];
					i = year + '年第' + getWeekInYear(i) + '周';
				}
				if (_this.dateType == 'monthrange') {
					var arr = i.split('-');
					i = arr[0] + '-' + arr[1];
				}
				var arr = [i];
				for (var k in _this.sel_goods) {
					var i1 = _this.sel_goods[k];
					var data1 = 0;

					var payment_amt = 0;
					var payment_qty = 0;
					var visitors = 0;
					var shopping_cart = 0;
					var payment_collect_qty = 0;
					var pay_conversion_rate = 0;
					var customer_price = 0;
					var unit_price = 0;

					var payment_buyers_qty = 0;

					for (var j in dd) {
						var i2 = dd[j];
						if (i1 == i2.prd_id || i1 == i2.prd_no) {
							data1 = changeSum(data1, i2[str]);

							payment_amt = changeSum(payment_amt, i2.payment_amt);
							payment_qty = changeSum(payment_qty, i2.payment_qty);
							visitors = changeSum(visitors, i2.visitors);
							shopping_cart = changeSum(shopping_cart, i2.shopping_cart);
							payment_collect_qty = changeSum(payment_collect_qty, i2.payment_collect_qty);

							if (i2.payment_buyers_qty) {
								payment_collect_qty = changeSum(payment_buyers_qty, i2.payment_buyers_qty);
							}
						}
					}

					if (str == 'pay_conversion_rate') {
						pay_conversion_rate = (changeChu(payment_collect_qty, visitors) * 100).toFixed(2);
						if (_this.sel_pla == 2) {
							pay_conversion_rate = (changeChu(payment_qty, visitors) * 100).toFixed(2);
						}
						data1 = pay_conversion_rate;
					}
					if (str == 'customer_price') {
						customer_price = changeChu(payment_amt, payment_collect_qty).toFixed(0);
						data1 = customer_price;
					}
					if (str == 'unit_price') {
						unit_price = changeChu(payment_amt, payment_qty).toFixed(0);
						data1 = unit_price;
					}

					arr.push(data1);
				}
				data_num.push(arr);
			}
			if (str == 'customer_price' || str == 'payment_collect_qty') {
				if (_this.sel_pla == 2) {
					data_num = [];
				}
			}
			data_all = [data_top];
			data_num.sort(function(a, b) {
				var a1 = new Date(a[0]).getTime();
				var b1 = new Date(b[0]).getTime();
				return a1 - b1;
			})
			data_all = data_all.concat(data_num);
			var title = $('.selectHezi .heZiText').text()
			title = title.split('(')[0] + '趋势图';
			polygonal(div, data_all, title);
			
			if (Object.values(goods).length == 0) {
				$('#' + div).hide();
				$('.tips2').hide();
				$('.tips').show();
			} else {
				$('#' + div).show();
				$('.tips').hide();
				if (div == 'echart_sourceTrend') {
					if (Object.values(date).length == 0) {
						$('#' + div).hide();
						$('.tips').hide();
						$('.tips2').show();
					} else {
						$('.tips2').hide();
					}
				}
			}
		},

		filterData2(ci) {
			var _this = this;
			_this.flow_data = [];
			_this.date_arr2 = [];

			// 过滤选择
			var allFlowData = _this.allFlowData;
			allFlowData = _this.filterThis(_this.sel_goods, allFlowData, 'prd_id');
			allFlowData = _this.filterThis(_this.sel_s1, allFlowData, 'traffic_source');

			if (ci == 1) {
				_this.sa_xm = [];
			}

			for (var j in _this.sel_goods) {
				var pla = _this.sel_goods[j];
				if (pla) {
					_this.flow_data[pla] = [];
				}
			}

			for (var i in allFlowData) {
				var d = allFlowData[i];

				//获取所有日期
				var date = d.statistics_date;
				if (_this.date_arr2.hasOwnProperty(date) == false) {
					_this.date_arr2[date] = [];
				}
				_this.date_arr2[date].push(d);
				if (ci == 1) {
					getArrSelect(d);
				}
			}

			// console.log(_this.date_arr2)
			_this.fillEachart(_this.date_arr2, _this.sel_s2, 'echart_sourceTrend');

			if (ci == 1) {
				var al = [{
					"name": "全部",
					"value": '全部',
					"selected": true
				}];
				_this.sa_xm = al.concat(Object.values(_this.sa_xm));
				_this.selectRadio('#xm-select1', _this.sa_xm);
			}

			function getArrSelect(data) {
				get1(_this.sa_xm, 'traffic_source');

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

	}
});
