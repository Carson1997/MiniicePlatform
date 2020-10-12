var vm = new Vue({
	el: '#vue',
	data: {
		allGoodsData: {
			data1: '',
			data2: ''
		},

		send: {
			date: '2020-01-01_2020-06-30',
			date_type: '1',
			prd_id: '617087915410',
			prd_id2: '',
			prd_id3: ''
		},
		send2: {},

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

		dateValue2: "",
		daterange2: '',
		monthrange2: '',
		// 日期控制的变量  结束 ============================

		sel_goods: ["617087915410"],

		payment_amt: [],
		payment_qty: [],
		visitors: [],
		shopping_cart: [],
		payment_collect_qty: [],
		pay_conversion_rate: [],
		customer_price: [],
		unit_price: [],

		s_tar: 'payment_amt',
		dateType2: 'no',
		type2: 'no'
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
			// console.log(this.send)
			this.daterange = '';
			this.dateValue = '';
			this.monthrange = '';
			this.getGoodsData(1)
		},

		dateClick2: function(value) {
			var _this = this;
			_this.send2 = JSON.parse(JSON.stringify(_this.send));
			// $('#xm-time').val('yes');
			$("input[name=time][value=yes]").prop('checked', true);
			layui.form.render();
			// console.log(value)
			// if (this.dateType2 == 'week') {
			// 	this.send2.date_type = 2;
			// 	var start = moment(value[0]).isoWeekday(1).week(moment(value[0]).isoWeekday(1).week()).startOf('isoweek').format(
			// 		'YYYY-MM-DD');
			// 	var end = moment(value[1]).isoWeekday(1).week(moment(value[1]).isoWeekday(1).week()).endOf('isoweek').format(
			// 		'YYYY-MM-DD');
			// 	this.selectDateShow2 = start + '_' + end;
			// 	this.send2.date = this.selectDateShow2;
			// }
			// if (this.dateType2 == 'daterange') {
			// 	this.selectDateShow2 = value[0] + '_' + value[1];
			// 	this.send2.date = this.selectDateShow2;
			// 	this.send2.date_type = 1;
			// }
			// if (this.dateType2 == 'monthrange') {
			// 	var start = moment(value[0]).month(moment(value[0]).month()).startOf('month').format('YYYY-MM-DD');
			// 	var end = moment(value[1]).month(moment(value[1]).month()).endOf('month').format('YYYY-MM-DD');
			// 	var show = start + '_' + end;
			// 	this.selectDateShow2 = value[0].substr(0, 7) + '_' + value[1].substr(0, 7);
			// 	this.send2.date = show;
			// 	this.send2.date_type = 3;
			// }
			_this.send2.date2 = value;
			
			this.daterange2 = '';
			this.dateValue2 = '';
			this.monthrange2 = '';
			this.getGoodsData(2)
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
						_this.getGoods();
					});
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
				url: url_goods,
				type: 'get',
				dataType: 'json',
				data: {
					// key: '康佳'
				},
				timeout:60000,
				success: function(res) {
					removeLoading()
					checkStatus(res, function() {
						// console.log(res.data)
						var arr_goods = res.data;
						_this.fillGoodsSelect(arr_goods)
					});
				},
				error: function() {
					removeLoading()
					layer.alert('请求失败')
				}
			});
		},

		//填充商品选项
		fillGoodsSelect(arr_goods) {
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

			// console.log(_this.arr_goods)
			_this.selectRadio('#xm-goods1', _this.arr_goods)
			_this.selectRadio('#xm-goods2', _this.arr_goods)
			_this.selectRadio('#xm-goods3', _this.arr_goods)

			_this.getGoodsData(1)
		},


		//获取商品数据
		getGoodsData(c) {
			var _this = this;
			addLoading()
			var send;
			if (c == 1) {
				send = _this.send
			}
			if (c == 2) {
				send = _this.send2
			}
			$.ajax({
				url: url_shop_analysis,
				type: 'post',
				dataType: 'json',
				data: send,
				timeout:60000,
				success: function(res) {
					removeLoading()
					checkStatus(res, function() {
						if (c == 1) {
							_this.allGoodsData.data1 = res.data;
						}
						if (c == 2) {
							_this.allGoodsData.data2 = res.data;
						}

						_this.filterData();
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
			_this.goods_data = [];
			_this.payment_amt = [];
			_this.payment_qty = [];
			_this.visitors = [];
			_this.shopping_cart = [];
			_this.payment_collect_qty = [];
			_this.pay_conversion_rate = [];
			_this.customer_price = [];
			_this.unit_price = [];

			_this.date_arr = [];

			for (var j in _this.sel_goods) {
				var prd = _this.sel_goods[j];
				if (prd) {
					_this.goods_data[prd] = [];
				}
			}

			var time1 = new Date(_this.selectDateShow.split('_')[0]).getTime();
			var time2 = new Date(_this.selectDateShow.split('_')[1]).getTime();

			_this.c_data = {
				data1: [],
				data2: []
			};

			for (var i in _this.allGoodsData) {
				var k = _this.allGoodsData[i];

				for (var i1 in k) {
					var d = k[i1];

					//获取所有日期
					var date = d.statistics_date;
					if (_this.date_arr.hasOwnProperty(date) == false) {
						_this.date_arr[date] = {
							data1: [],
							data2: []
						};
					}
					if (_this.date_arr[date][i].hasOwnProperty(d.prd_id) == false) {
						_this.date_arr[date][i][d.prd_id] = [];
					}
					_this.date_arr[date][i][d.prd_id].push(d);

					if (_this.c_data[i].hasOwnProperty(date) == false) {
						_this.c_data[i][date] = [];
					}
					_this.c_data[i][date].push(d);

					//不同商品
					var prd_id = d.prd_id;
					var time = new Date(date).getTime();
					if (time >= time1 && time <= time2) {
						if (i == 'data1') {
							if (_this.goods_data[prd_id]) {
								_this.goods_data[prd_id].push(d)
							}
						}
					}
				}
			}

			for (var i in _this.goods_data) {
				var d = _this.goods_data[i];
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
				var name = _this.sel_goods.indexOf(i);
				_this.payment_amt.push({
					prd: name,
					data: payment_amt
				});
				_this.payment_qty.push({
					prd: name,
					data: payment_qty
				});
				_this.visitors.push({
					prd: name,
					data: visitors
				});
				_this.shopping_cart.push({
					prd: name,
					data: shopping_cart
				});
				_this.payment_collect_qty.push({
					prd: name,
					data: payment_collect_qty
				});

				pay_conversion_rate = (changeChu(payment_collect_qty, visitors) * 100).toFixed(2);
				customer_price = changeChu(payment_amt, payment_collect_qty).toFixed(0);
				unit_price = changeChu(payment_amt, payment_qty).toFixed(0);
				_this.pay_conversion_rate.push({
					prd: name,
					data: pay_conversion_rate
				});
				_this.customer_price.push({
					prd: name,
					data: customer_price
				});
				_this.unit_price.push({
					prd: name,
					data: unit_price
				});
			}

			_this.fillEachart();
		},
		
		tipsShow() {
			$('#tips').show();
		},
		
		tipsHide() {
			$('#tips').hide();
		},

		//初始化layui
		initLayui() {
			var _this = this;
			var form = layui.form;
			form.render()
			
			form.on('radio(ra-time)', function(data) {
				$("input[name=time][value=no]").prop('checked', true);
				form.render();
				var type = data.value;
				_this.mergeHandle(_this.time_data);
				_this.dateType2 = _this.dateType;
				_this.type2 = type;
				if (type == 'no') {
					_this.allGoodsData.data2 = '';
					_this.dateValue2 = "";
					_this.daterange2 = '';
					_this.monthrange2 = '';
					_this.filterData();
				} else {
					if (_this.dateType == 'daterange') {
						$('#d1').focus()
					}
					if (_this.dateType == 'week') {
						$('#d2').focus()
						$('.available').removeClass('in-range start-date');
						$('.available').removeClass('in-range end-date');
					}
					if (_this.dateType == 'monthrange') {
						$('#d3').focus()
					}
				}
			})
		},

		initConTop() {
			var height2 = $('.fixedTitle').height() + 10;
			$('.layui-fluid').css('margin-top', height2)
		},

		initSelect() {
			var _this = this;
			var form = layui.form;
			form.on('select(xm-time)', function(data) {
				$('#xm-time').val('no');
				form.render();
				var type = data.value;
				_this.mergeHandle(_this.time_data);
				_this.type2 = type;
				_this.dateType2 = _this.dateType;
				if (type == 'no') {
					_this.allGoodsData.data2 = '';
					_this.dateValue2 = "";
					_this.daterange2 = '';
					_this.monthrange2 = '';
					_this.filterData();
				} else {
					var goods = _this.sel_goods.filter(function(i) {
						return i;
					})
					if (goods.length > 1) {
						layer.alert('只能对比一个商品,请清空多余的商品')
						return;
					}

					if (_this.dateType == 'daterange') {
						// $('#datePicker1').find('.el-date-editor--daterange').click();
						$('#datePicker2').find('.el-date-editor--daterange')[0].click();
					}
					if (_this.dateType == 'week') {
						// $('#el-week').focus();
						$('#datePicker2').find('.el-date-editor--daterange')[1].click();
						$('.available').removeClass('in-range start-date');
						$('.available').removeClass('in-range end-date');
					}
					if (_this.dateType == 'monthrange') {
						$('#datePicker2').find('.el-date-editor--monthrange').click()
					}
				}
			})

			// var data = [{
			// 		name: '不对比',
			// 		value: 'no',
			// 		selected: true,
			// 	},
			// 	{
			// 		name: '对比时间',
			// 		value: 'yes'
			// 	},
			// ];

			// var xm_time = xmSelect.render({
			// 	el: '#xm-time',
			// 	size: 'mini',
			// 	radio: true,
			// 	model: {
			// 		icon: 'hidden',
			// 		label: {
			// 			type: 'text'
			// 		}
			// 	},
			// 	theme: {
			// 		color: '#ED6D00',
			// 	},
			// 	data: data,
			// 	on: function(data) {
			// 		var type = data.change[0].value;
			// 		_this.mergeHandle(_this.time_data);
			// 		_this.type2 = type;
			// 		_this.dateType2 = _this.dateType;
			// 		if (type == 'no') {
			// 			_this.allGoodsData.data2 = '';
			// 			_this.dateValue2 = "";
			// 			_this.daterange2 = '';
			// 			_this.monthrange2 = '';
			// 			_this.filterData();
			// 		} else {
			// 			if (_this.dateType == 'daterange') {
			// 				// $('#datePicker1').find('.el-date-editor--daterange').click();
			// 				$('#datePicker2').find('.el-date-editor--daterange')[0].click();
			// 			}
			// 			if (_this.dateType == 'week') {
			// 				// $('#el-week').focus();
			// 				$('#datePicker2').find('.el-date-editor--daterange')[1].click();
			// 				$('.available').removeClass('in-range start-date');
			// 				$('.available').removeClass('in-range end-date');
			// 			}
			// 			if (_this.dateType == 'monthrange') {
			// 				$('#datePicker2').find('.el-date-editor--monthrange').click()
			// 			}
			// 		}
			// 	}
			// });
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
					if (el == '#xm-goods1') {
						var goods1 = g1(d);
						_this.sel_goods[0] = goods1;
						_this.send.prd_id = goods1;
					}
					if (el == '#xm-goods2') {
						var goods2 = g1(d);
						_this.sel_goods[1] = goods2;
						_this.send.prd_id2 = goods2;
					}
					if (el == '#xm-goods3') {
						var goods3 = g1(d);
						_this.sel_goods[2] = goods3;
						_this.send.prd_id3 = goods3;
					}
					_this.allGoodsData.data2 = [];
					_this.type2 = "no";
					$('#xm-time').val('no');
					layui.form.render()

					function g1(d) {
						if (d.arr.length > 0) {
							return d.arr[0].value;
						} else {
							return '';
						}
					}
					// console.log(_this.sel_goods)
					// console.log(_this.send)
					_this.getGoodsData(1);
				}
			});

			if (el == '#xm-goods1') {
				if (data.length > 0) {
					_this.send.prd_id = data[0].value;
					_this.sel_goods[0] = data[0].value;
					demo_select.setValue([_this.sel_goods[0]]);
				}
				if (localStorage.prd_id) {
					var prd_id = localStorage.prd_id;
					_this.sel_goods[0] = prd_id;
					_this.send.prd_id = prd_id;
					demo_select.setValue([prd_id])
					localStorage.removeItem('prd_id')
				}
			}
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


		//折线图
		fillEachart() {
			var _this = this;
			var data_all = [];
			var date_arr = _this.date_arr;
			var data_top = ['日期'];
			var goods;
			goods = _this.sel_goods.map(function(t, d) {
				if (t) {
					return '商品' + (d + 1);
				}
			});
			goods = goods.filter(function(i) {
				return i;
			})
			var title = $('.selectHezi .heZiText').text()
			title = title.split('(')[0] + '趋势图';
			// console.log(_this.type2)
			if (_this.type2 == 'no') {
				data_top = data_top.concat(goods)

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
					if (_this.type2 == 'no') {
						var goods = _this.sel_goods.filter(function(item) {
							if (item) {
								return item;
							}
						});
						// var goods = _this.sel_goods;

						for (var k in goods) {
							var i1 = goods[k];
							var data = '';
							for (var j in dd.data1) {
								i2 = dd.data1[j];
								if (j == i1) {
									for (var t in i2) {
										data = changeSum(data, i2[t][_this.s_tar])
									}
								}
							}
							arr.push(data);
						}
					}
					// else {
					// 	var goods = _this.sel_goods[0];
					// 	var data1 = '',
					// 		data2 = '';

					// 	data1 = changeData(dd.data1, data1);
					// 	data2 = changeData(dd.data2, data2);

					// 	function changeData(tdata, data1) {
					// 		if (Object.keys(tdata).length == 0) {
					// 			data1 = "";
					// 			return data1;
					// 		} else {
					// 			var payment_amt = 0;
					// 			var payment_qty = 0;
					// 			var visitors = 0;
					// 			var shopping_cart = 0;
					// 			var payment_collect_qty = 0;
					// 			var pay_conversion_rate = 0;
					// 			var customer_price = 0;
					// 			var unit_price = 0;
					// 			for (var k in tdata) {
					// 				var item0 = tdata[k];
					// 				for(var j in item0){
					// 					var item = item0[j];
					// 					data1 = changeSum(data1, item[_this.s_tar])

					// 					payment_amt = changeSum(payment_amt, item.payment_amt);
					// 					payment_qty = changeSum(payment_qty, item.payment_qty);
					// 					visitors = changeSum(visitors, item.visitors);
					// 					shopping_cart = changeSum(shopping_cart, item.shopping_cart);
					// 					payment_collect_qty = changeSum(payment_collect_qty, item.payment_collect_qty);
					// 				}
					// 			}
					// 			if (_this.s_tar == 'pay_conversion_rate') {
					// 				pay_conversion_rate = (changeChu(payment_collect_qty, visitors) * 100).toFixed(2);
					// 				data1 = pay_conversion_rate;
					// 			}
					// 			if (_this.s_tar == 'customer_price') {
					// 				customer_price = changeChu(payment_amt, payment_collect_qty).toFixed(0);
					// 				data1 = customer_price;
					// 			}
					// 			if (_this.s_tar == 'unit_price') {
					// 				unit_price = changeChu(payment_amt, payment_qty).toFixed(0);
					// 				data1 = unit_price;
					// 			}
					// 			return data1;
					// 		}
					// 	}

					// 	arr.push(data1);
					// 	arr.push(data2);
					// }

					data_num.push(arr);
				}
				data_all = [data_top];
				data_num.sort(function(a, b) {
					var a1 = new Date(a[0]).getTime();
					var b1 = new Date(b[0]).getTime();
					return a1 - b1;
				})
				data_all = data_all.concat(data_num);
				polygonal('echart_sellTrend', data_all,title);
			} else {
				// data_top = ['日期', '不对比', '对比时间'];
				contrastE('echart_sellTrend', _this.c_data, title,_this.s_tar, _this.dateType);
			}


			if (Object.values(goods).length == 0) {
				$('#echart_sellTrend').hide();
				$('.tips').show();
			} else {
				$('#echart_sellTrend').show();
				$('.tips').hide();
			}
		},
	}
});
