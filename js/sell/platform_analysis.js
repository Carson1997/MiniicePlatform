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

		sel_pla: ["1", "2", "3", "4"],

		payment_amt: [],
		payment_qty: [],
		visitors: [],
		shopping_cart: [],
		payment_collect_qty: [],
		pay_conversion_rate: [],
		customer_price: [],
		unit_price: [],

		s_tar: 'payment_amt',
	},
	mounted: function() {
		this.initLayui();

		this.initConTop();

		this.initSelect();

		this.initHeZiClick();

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
			this.getPlaData()
		},

		//初始化layui
		initLayui() {
			var _this = this;
			var form = layui.form;
			form.render();

			cb('checkbox(dx1)', 'table_brand');
			cb('checkbox(dx2)', 'table_category')
			cb('checkbox(dx3)', 'table_shop')

			function cb(cb, table) {
				form.on(cb, function(data) {
					var index = data.value;
					var ifshow = !data.elem.checked;
					_this.title[index].hide = ifshow;
					layui.table.reload(table, {
						cols: [
							_this.title
						]
					})
				});
			}
		},

		initConTop() {
			var height2 = $('.fixedTitle').height() + 10;
			$('.layui-fluid').css('margin-top', height2);
		},

		initSelect() {
			var _this = this;
			_this.arr_pla = [{
					name: '淘宝',
					value: 1,
					selected: true
				},
				{
					name: '京东',
					value: 2,
					selected: true
				},
				{
					name: '苏宁',
					value: 3,
					selected: true
				},
				{
					name: '猫宁',
					value: 4,
					selected: true
				}
			];
			_this.arr_shop = [];
			_this.selectMore('#xm-platform', _this.arr_pla)
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
					_this.sel_pla = [];
					if (d.arr.length > 0) {
						_this.sel_pla = d.arr.map(function(item) {
							return item.value.toString();
						})
					}
					_this.filterData()
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

		//合子点击
		initHeZiClick() {
			var _this = this;
			$('.myBorderHeZi').click(function() {
				$(this).siblings().removeClass('selectHezi');
				$(this).addClass('selectHezi');

				_this.s_tar = $(this).attr('data');
				_this.fillEachart();
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
				timeout: 60000,
				success: function(res) {
					removeLoading()
					checkStatus(res, function() {
						// console.log(res)
						_this.allShopNameData = res.data;
						if (res.data.length > 0) {
							_this.time_data.start_time = res.data[0].data_star;
							_this.time_data.end_time = res.data[0].data_end;
							_this.selectDateShow = res.data[0].data_end + '_' + res.data[0].data_end;
							_this.daterange = [res.data[0].data_end, res.data[0].data_end];
							_this.send.date = _this.selectDateShow;
						}
						_this.getPlaData();
					});
				},
				error: function() {
					removeLoading()
					layer.alert('请求失败')
				}
			});
		},

		getPlaData() {
			var _this = this;
			addLoading()
			$.ajax({
				url: url_pla,
				type: 'get',
				data: _this.send,
				dataType: 'json',
				timeout: 60000,
				success: function(res) {
					removeLoading()
					checkStatus(res, function() {
						// console.log(res.data)
						_this.allPlaData = res.data.pro_data;
						_this.allShopData = res.data.shop_data;
						_this.filterData()
					});
				},
				error: function() {
					removeLoading()
					layer.alert('请求失败')
				}
			});
		},

		//过滤数据
		filterData() {
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
			_this.shopData = [];

			// 过滤选择
			var allPlaData = _this.allPlaData;
			filterThis(_this.sel_pla, allPlaData, 'platform');

			for (var j in _this.sel_pla) {
				var pla = _this.sel_pla[j];
				_this.pla_data[pla] = [];
				_this.shopData[pla] = [];
			}

			var time1 = new Date(_this.selectDateShow.split('_')[0]).getTime();
			var time2 = new Date(_this.selectDateShow.split('_')[1]).getTime();

			_this.category1_arr = [];
			for (var i in allPlaData) {
				var d = allPlaData[i];
				d.shop_name = _this.changeShopName(d.shop_id, _this.allShopNameData);

				//获取所有日期
				var date = d.statistics_date;
				// if (_this.date_arr.hasOwnProperty(date) == false) {
				// 	_this.date_arr[date] = [];
				// }
				// _this.date_arr[date].push(d);

				//对应不同平台
				var platform = d.platform;
				if (_this.pla_data[platform]) {
					var time = new Date(date).getTime();
					if (time >= time1 && time <= time2) {
						_this.pla_data[platform].push(d);
					}
				}

				//对应不同类目1
				var time = new Date(date).getTime();
				if (time >= time1 && time <= time2) {
					var category1 = d.category1;
					if (_this.category1_arr.hasOwnProperty(category1) == false) {
						_this.category1_arr[category1] = [];
					}
					_this.category1_arr[category1].push(d);
				}
			}

			for (var i in _this.allShopData) {
				var d = _this.allShopData[i];
				d.shop_name = _this.changeShopName(d.shop_id, _this.allShopNameData);

				//获取所有日期
				var date = d.statistics_date;
				if (_this.date_arr.hasOwnProperty(date) == false) {
					_this.date_arr[date] = [];
				}
				_this.date_arr[date].push(d);


				var platform = d.platform;
				if (_this.shopData[platform]) {
					var time = new Date(date).getTime();

					if (time >= time1 && time <= time2) {
						_this.shopData[platform].push(d);
					}
				}
			}

			for (var i in _this.shopData) {
				var d = _this.shopData[i];
				// console.log(i)
				var payment_amt = 0;
				var payment_qty = 0;
				var visitors = 0;
				var shopping_cart = 0;
				var payment_collect_qty = 0;
				var pay_conversion_rate = 0;
				var customer_price = 0;
				var unit_price = 0;
				for (var k in d) {
					var d1 = d[k]
					payment_amt = changeSum(payment_amt, d1.payment_amt);
					payment_qty = changeSum(payment_qty, d1.payment_qty);
					visitors = changeSum(visitors, d1.visitors);
					shopping_cart = changeSum(shopping_cart, d1.shopping_cart);
					payment_collect_qty = changeSum(payment_collect_qty, d1.payment_collect_qty);
				}
				_this.payment_amt.push({
					pla: changePlatform(i),
					data: payment_amt
				});
				_this.payment_qty.push({
					pla: changePlatform(i),
					data: payment_qty
				});
				_this.visitors.push({
					pla: changePlatform(i),
					data: visitors
				});
				_this.shopping_cart.push({
					pla: changePlatform(i),
					data: shopping_cart
				});
				_this.payment_collect_qty.push({
					pla: changePlatform(i),
					data: payment_collect_qty
				});

				pay_conversion_rate = (changeChu(payment_collect_qty, visitors) * 100).toFixed(2);
				customer_price = changeChu(payment_amt, payment_collect_qty).toFixed(0);
				unit_price = changeChu(payment_amt, payment_qty).toFixed(0);
				_this.pay_conversion_rate.push({
					pla: changePlatform(i),
					data: pay_conversion_rate
				});
				_this.customer_price.push({
					pla: changePlatform(i),
					data: customer_price
				});
				_this.unit_price.push({
					pla: changePlatform(i),
					data: unit_price
				});
			}

			_this.fillEachart();

			_this.fillTable();

			function filterThis(select, data, str) {
				var data1 = [];
				if (select.length > 0 && data != '') {
					data1 = data;
					data1 = data1.filter(function(d) {
						if (select.indexOf(d[str]) > -1) {
							return d;
						}
					});
				}
				allPlaData = data1;
			}
		},

		changeShopName(id, data) {
			var name;
			data.forEach(function(item) {
				if (item.id == id) {
					name = item.shop_name;
				}
			})
			return name;
		},


		//折线图
		fillEachart() {
			var _this = this;
			var date_arr = _this.date_arr;
			var pla = _this.sel_pla.map(function(t) {
				return changePlatform(t);
			});
			var data_top = ['日期'].concat(pla);
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
				for (var k in _this.sel_pla) {
					var i1 = _this.sel_pla[k];
					var data1 = 0;

					var payment_amt = 0;
					var payment_qty = 0;
					var visitors = 0;
					var shopping_cart = 0;
					var payment_collect_qty = 0;
					var pay_conversion_rate = 0;
					var customer_price = 0;
					var unit_price = 0;

					for (var j in dd) {
						var i2 = dd[j];
						if (i1 == i2.platform) {
							data1 = changeSum(data1, i2[_this.s_tar]);

							payment_amt = changeSum(payment_amt, i2.payment_amt);
							payment_qty = changeSum(payment_qty, i2.payment_qty);
							visitors = changeSum(visitors, i2.visitors);
							shopping_cart = changeSum(shopping_cart, i2.shopping_cart);
							payment_collect_qty = changeSum(payment_collect_qty, i2.payment_collect_qty);
						}
					}

					if (_this.s_tar == 'pay_conversion_rate') {
						pay_conversion_rate = (changeChu(payment_collect_qty, visitors) * 100).toFixed(2);
						data1 = pay_conversion_rate;
					}
					if (_this.s_tar == 'customer_price') {
						customer_price = changeChu(payment_amt, payment_collect_qty).toFixed(0);
						data1 = customer_price;
					}
					if (_this.s_tar == 'unit_price') {
						unit_price = changeChu(payment_amt, payment_qty).toFixed(0);
						data1 = unit_price;
					}

					arr.push(data1);
				}

				data_num.push(arr);
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
			polygonal('echart_sellTrend', data_all, title);

			if (Object.values(pla).length == 0) {
				$('#echart_sellTrend').hide();
				$('.tips').show();
			} else {
				$('#echart_sellTrend').show();
				$('.tips').hide();
			}
		},

		fillTable() {
			var _this = this;
			var table = layui.table;

			_this.title = [{
					field: 'name',
					title: '',
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

							s = `<span title="` + title + `" lay-event="edit"><i class="layui-icon ` + icon + ` tbtn"></i>` + d.name +
								'</span>';
						} else {
							s = `<span title="` + title + `" style="margin-left: 20px;" parent_pla=` + d.parent_pla + `>` + d.name +
								`</span>`;
						}
						return s;
					},
					totalRowText: '合计'
				},
				{
					field: "payment_amt",
					title: '支付金额(元)',
					sort: false,
					minWidth: 130,
					// templet: function(d) {
					// 	payment_amt = ts(d, 'payment_amt');
					// 	return ts(d, 'payment_amt');
					// },
					totalRowText: ''
				},
				{
					field: 'payment_qty',
					title: '支付件数(件)',
					sort: false,
					minWidth: 130,
					// templet: function(d) {
					// 	payment_qty = ts(d, 'payment_qty');
					// 	return ts(d, 'payment_qty');
					// },
					totalRowText: ''
				},
				{
					field: 'visitors',
					title: '访客数(人)',
					sort: false,
					minWidth: 130,
					// templet: function(d) {
					// 	visitors = ts(d, 'visitors');
					// 	return ts(d, 'visitors');
					// },
					totalRowText: ''
				},
				{
					field: 'shopping_cart',
					title: '加购人数(人)',
					sort: false,
					minWidth: 130,
					// templet: function(d) {
					// 	return ts(d, 'shopping_cart');
					// },
					totalRowText: ''
				},
				{
					field: 'payment_collect_qty',
					title: '支付买家数(人)',
					sort: false,
					minWidth: 130,
					// templet: function(d) {
					// 	payment_collect_qty = ts(d, 'payment_collect_qty');
					// 	return ts(d, 'payment_collect_qty');
					// },
					totalRowText: ''
				},
				{
					field: 'pay_conversion_rate',
					title: '支付转化率(%)',
					sort: false,
					minWidth: 130,
					// templet: function(d) {
					// 	return (changeChu(payment_collect_qty, visitors) * 100).toFixed(2);
					// },
					totalRowText: ''
				},
				{
					field: 'customer_price',
					title: '客单价(元)',
					sort: false,
					minWidth: 130,
					// templet: function(d) {
					// 	return (changeChu(payment_amt, payment_collect_qty)).toFixed(0);
					// },
					totalRowText: ''
				},
				{
					field: 'unit_price',
					title: '件单价(元)',
					sort: false,
					minWidth: 130,
					// templet: function(d) {
					// 	return (changeChu(payment_amt, payment_qty)).toFixed(0);
					// },
					totalRowText: ''
				},
			];

			var table_data1 = g1('brand', _this.pla_data);
			var table_data2 = g1('category1', _this.pla_data);
			var table_data3 = g1('shop_name', _this.shopData);
			var table_data0 = g1('platform', _this.category1_arr);

			var total = {};

			function g1(str, data) {
				var arr = [];
				for (var i in data) {
					var d = data[i];
					var pla = changePlatform(i);
					if (str == 'platform') {
						pla = i;
					}
					d.sort(function(a, b) {
						return b.payment_amt - a.payment_amt;
					})
					var a = {
						name: pla,
						data: d,
						pla: pla,
						showZi: true
					}
					a.payment_amt = 0;
					a.payment_qty = 0;
					a.visitors = 0;
					a.shopping_cart = 0;
					a.payment_collect_qty = 0;
					a.pay_conversion_rate = 0;
					a.customer_price = 0;
					a.unit_price = 0;

					var data1 = [];
					for (var j in d) {
						var tar = d[j][str];
						if (tar == '') {
							tar = '其它'
						}
						if (data1.hasOwnProperty(tar) == false) {
							data1[tar] = [];
						}
						data1[tar].push(d[j]);

						var d2 = d[j];
						a.payment_amt = changeSum(a.payment_amt, d2.payment_amt);
						a.payment_qty = changeSum(a.payment_qty, d2.payment_qty);
						a.visitors = changeSum(a.visitors, d2.visitors);
						a.shopping_cart = changeSum(a.shopping_cart, d2.shopping_cart);
						a.payment_collect_qty = changeSum(a.payment_collect_qty, d2.payment_collect_qty);
					}
					a.pay_conversion_rate = (changeChu(a.payment_collect_qty, a.visitors) * 100).toFixed(2);
					a.customer_price = changeChu(a.payment_amt, a.payment_collect_qty).toFixed(0);
					a.unit_price = changeChu(a.payment_amt, a.payment_qty).toFixed(0);

					arr.push(a);
				}


				//排序父类
				arr.sort(function(a, b) {
					return b.payment_amt - a.payment_amt;
				})

				var new_arr = [];
				for (var y in arr) {
					var d = arr[y].data;
					var pla = arr[y].pla;
					new_arr.push(arr[y]);
					var data1 = [];
					for (var j in d) {
						var tar = d[j][str];
						if (tar == '') {
							tar = '其它'
						}
						if (data1.hasOwnProperty(tar) == false) {
							data1[tar] = [];
						}
						data1[tar].push(d[j]);
					}

					var c1 = [];
					for (var k in data1) {
						var d1 = data1[k];
						var s = {
							name: k,
							data: d1,
							parent_pla: pla
						}
						if (str == 'platform') {
							s.name = changePlatform(k);
						}
						s.payment_amt = 0;
						s.payment_qty = 0;
						s.visitors = 0;
						s.shopping_cart = 0;
						s.payment_collect_qty = 0;
						s.pay_conversion_rate = 0;
						s.customer_price = 0;
						s.unit_price = 0;
						for (var n in d1) {
							var d3 = d1[n];
							s.payment_amt = changeSum(s.payment_amt, d3.payment_amt);
							s.payment_qty = changeSum(s.payment_qty, d3.payment_qty);
							s.visitors = changeSum(s.visitors, d3.visitors);
							s.shopping_cart = changeSum(s.shopping_cart, d3.shopping_cart);
							s.payment_collect_qty = changeSum(s.payment_collect_qty, d3.payment_collect_qty);
						}
						s.pay_conversion_rate = (changeChu(s.payment_collect_qty, s.visitors) * 100).toFixed(2);
						s.customer_price = changeChu(s.payment_amt, s.payment_collect_qty).toFixed(0);
						s.unit_price = changeChu(s.payment_amt, s.payment_qty).toFixed(0);
						// new_arr.push(s)
						c1.push(s)
					}
					c1.sort(function(a, b) {
						return b.payment_amt - a.payment_amt;
					})
					new_arr  = new_arr.concat(c1)
				}

				return new_arr;
			}


			var total1 = get1(_this.pla_data, {});
			var total2 = get1(_this.shopData, {});

			function get1(data, arr) {
				arr.payment_amt = 0;
				arr.payment_qty = 0;
				arr.visitors = 0;
				arr.shopping_cart = 0;
				arr.payment_collect_qty = 0;
				arr.pay_conversion_rate = 0;
				arr.customer_price = 0;
				arr.unit_price = 0;
				for (var i in data) {
					var d1 = data[i];
					for (var j in d1) {
						var d2 = d1[j];
						arr.payment_amt = changeSum(arr.payment_amt, d2.payment_amt);
						arr.payment_qty = changeSum(arr.payment_qty, d2.payment_qty);
						arr.visitors = changeSum(arr.visitors, d2.visitors);
						arr.shopping_cart = changeSum(arr.shopping_cart, d2.shopping_cart);
						arr.payment_collect_qty = changeSum(arr.payment_collect_qty, d2.payment_collect_qty);
					}
				}
				arr.pay_conversion_rate = (changeChu(arr.payment_collect_qty, arr.visitors) * 100).toFixed(2);
				arr.customer_price = changeChu(arr.payment_amt, arr.payment_collect_qty).toFixed(0);
				arr.unit_price = changeChu(arr.payment_amt, arr.payment_qty).toFixed(0);
				return arr;
			}

			tablePublic('#table_brand', table_data1, 'table_brand', total1);
			tablePublic('#table_category', table_data2, 'table_category', total1);
			tablePublic('#table_shop', table_data3, 'table_shop', total2);
			tablePublic('#table_platform', table_data0, 'table_platform', total1);

			function tablePublic(el, data, tableId, total) {
				var title;
				if (tableId == 'table_brand') {
					title = _this.title;
					title[0].title = '平台/品牌';
				}
				if (tableId == 'table_category') {
					title = _this.title;
					title[0].title = '平台/类目'
				}
				if (tableId == 'table_shop') {
					title = _this.title;
					title[0].title = '平台/店铺';
				}
				if (tableId == 'table_platform') {
					title = _this.title;
					title[0].title = '类目/平台';
				}

				initTable(tableId, data)
				dlEx(data)
				table.render({
					elem: el,
					id: tableId,
					data: data,
					limit: 10,
					page: true,
					cols: [
						title
					],
					totalRow: true
				});


				function initTable(tableId, data) {
					var arr = [];
					table.on('tool(' + tableId + ')', function(obj) {
						var name = obj.data.name;
						var index = arr.indexOf(name);
						if (index == -1) {
							arr.push(name);
						} else {
							arr.splice(index, 1)
						}
						var data1 = [];
						var tData = data;
						for (var i in tData) {
							var d = tData[i];
							if (arr.indexOf(d.pla) > -1) {
								d.showZi = false;
							}
							if (arr.indexOf(d.pla) == -1) {
								d.showZi = true;
							}
							if (arr.indexOf(d.parent_pla) == -1) {
								data1.push(d)
							}
						}
						table.reload(tableId, {
							data: data1,
						});
						dlEx(data1)
					});
				}


				//合计,导出数据
				function dlEx(data) {
					var ex_title = [];
					var ex_data = [];
					var ex_total = ['合计'];
					for (var j = 0; j < data.length; j++) {
						var d2 = data[j];
						var one = [];
						for (var i in title) {
							var d = title[i];
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
					$('#dl_' + tableId).unbind('click').bind('click', function() {
						table.exportFile(ex_title, ex_data, 'xls');
					})
				}
			}

			function ts(d, n) {
				var s = 0;
				for (var i in d.data) {
					var a = d.data[i][n];
					s = changeSum(s, a)
				}
				return s;
			}

		}

	}
});
