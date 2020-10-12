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
		sel_pla: '1',
		sel_s2: "payment_amt",

		dx_arr: ['支付金额', '支付件数', '访客数', '加购人数', '支付买家数', '支付转化率', '客单价', '件单价']
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
				// if (this.dateValue != '' && this.dateType == 'week') {
				// 	var s = $('.start-date');
				// 	s.removeClass('in-range start-date');
				// 	var s1 =  s.parent().children(":first");
				// 	s1.addClass('start-date');
				// 	var l = $('.end-date');
				// 	l.removeClass('in-range end-date');
				// 	var l1 = l.parent().children(":last");
				// 	l1.addClass('end-date');
				// 	var p = s.parent().parent();
				// }	
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

			if (this.tap == 1) {
				this.getJpSellDetail()
			}
			if (this.tap == 2) {
				this.getJpFlowDetail()
			}
		},


		//初始化layui
		initLayui() {
			var _this = this;
			var form = layui.form;
			form.render()
			form.on('checkbox(dx)', function(data) {
				var index = data.value;
				var ifshow = !data.elem.checked;
				_this.title[index].hide = ifshow;
				layui.table.reload('table_sell_detail', {
					cols: [
						_this.title
					]
				})
			});
		},

		initConTop() {
			var height2 = $('.fixedTitle').height() + 10;
			$('.layui-fluid').css('margin-top', height2)
		},

		initSelect() {
			var _this = this;
			_this.arr_pla = [{
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
			_this.selectRadio('#xm-platform', _this.arr_pla);
		},

		//xm-select
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
						_this.sel_pla = g1(d);
						if (_this.tap == 1) {
							_this.fillSellTable();
						}
						if (_this.tap == 2) {
							if (_this.sel_pla == 1) {
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
								_this.sel_s1 = '全部';
								_this.selectRadio('#xm-select-s2', xm_arr1);
							}
							if (_this.sel_pla == 3) {
								var xm_arr1 = [{
									name: '访客数',
									value: 'visitors',
									selected: true
								}];
								_this.selectRadio('#xm-select-s2', xm_arr1);
								_this.sel_s2 = 'visitors';
							}

							_this.getJpFlowDetail();
						}
					}
					if (el == '#xm-select-s1') {
						_this.sel_s1 = g1(d);
						_this.fillFlowTable();
					}
					if (el == '#xm-select-s2') {
						_this.sel_s2 = g1(d);
						_this.fillFlowTable();
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
			var demo_select = xmSelect.render({
				direction: 'down',
				el: el,
				size: 'mini',
				model: {
					label: {
						type: 'text'
					}
				},
				theme: {
					color: '#ED6D00',
				},
				data: data
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
			$('.myBorderHeZi').click(function() {
				$(this).siblings().removeClass('selectHezi');
				$(this).addClass('selectHezi');
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
						_this.getJpSellDetail();
					});
				},
				error: function() {
					removeLoading()
					layer.alert('请求失败')
				}
			});
		},

		//选项卡变化
		changeTap(tap) {
			var _this = this;
			if (tap != this.tap) {
				if (tap == 1) {
					_this.tap = 1;
					_this.initSelect();
					_this.getJpSellDetail();
				}
				if (tap == 2) {
					_this.tap = 2;
					_this.jpFlowDetail();
				}
			}
		},

		// 竞品销售明细
		getJpSellDetail() {
			var _this = this;
			addLoading()
			$.ajax({
				url: url_jp_sellDetail,
				type: 'post',
				data: _this.send,
				dataType: 'json',
				timeout:60000,
				success: function(res) {
					removeLoading()
					checkStatus(res, function() {
						_this.allSellData = _this.filterTimeData(_this.selectDateShow, res.data);
						_this.fillSellTable();
					});
				},
				error: function() {
					removeLoading()
					layer.alert('请求失败')
				}
			});
		},

		//过滤数据日期
		filterTimeData(time, data) {
			var time1 = new Date(time.split('_')[0]).getTime();
			var time2 = new Date(time.split('_')[1]).getTime();
			if (data.length > 0) {
				var ndata = data.filter(function(item) {
					var t_time = new Date(item.statistics_date).getTime();
					if (t_time >= time1 && t_time <= time2) {
						return item;
					}
				});
				return ndata;
			}
		},

		//过滤数据 销售明细
		fillSellTable() {
			var _this = this;
			//过滤选择
			var sell_data = _this.filterThis(_this.sel_pla, _this.allSellData, 'platform');

			_this.payment_amt = 0;
			_this.payment_qty = 0;
			_this.visitors = 0;
			_this.shopping_cart_qty = 0;
			_this.payment_buyers_qty = 0;
			_this.pay_conversion_rate = 0;
			_this.customer_price = 0;
			_this.unit_price = 0;

			for (var i in sell_data) {
				var d = sell_data[i];
				d.payment_amt = parseFloat(d.payment_amt).toFixed(2);
				d.pay_conversion_rate = (changeChu(d.payment_buyers_qty, d.visitors) * 100).toFixed(2);
				if (_this.sel_pla == 2) {
					d.pay_conversion_rate = (changeChu(d.payment_qty, d.visitors) * 100).toFixed(2);
				}
				d.customer_price = changeChu(d.payment_amt, d.payment_buyers_qty).toFixed(0);
				d.unit_price = changeChu(d.payment_amt, d.payment_qty).toFixed(0);

				_this.payment_amt = changeSum(_this.payment_amt, d.payment_amt);
				_this.payment_qty = changeSum(_this.payment_qty, d.payment_qty);
				_this.visitors = changeSum(_this.visitors, d.visitors);
				_this.shopping_cart_qty = changeSum(_this.shopping_cart_qty, d.shopping_cart_qty);
				_this.payment_buyers_qty = changeSum(_this.payment_buyers_qty, d.payment_buyers_qty);
			}
			_this.pay_conversion_rate = (changeChu(_this.payment_buyers_qty, _this.visitors) * 100).toFixed(2);
			_this.customer_price = changeChu(_this.payment_amt, _this.payment_buyers_qty).toFixed(0);
			_this.unit_price = changeChu(_this.payment_amt, _this.payment_qty).toFixed(0);

			var table = layui.table;
			var title = [{
					field: 'shop',
					title: '店铺',
					sort: false,
					minWidth: 170,
					totalRowText: '合计'
				},
				{
					field: 'model_num',
					title: '竞品',
					sort: false,
					minWidth: 170,
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
					field: 'shopping_cart_qty',
					title: '加购人数(人)',
					sort: false,
					minWidth: 130,
					totalRowText: _this.shopping_cart_qty
				},
				{
					field: 'payment_buyers_qty',
					title: '支付买家数(人)',
					sort: false,
					minWidth: 130,
					totalRowText: _this.payment_buyers_qty,
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
			];

			if (_this.sel_pla == 2) {
				_this.title = [title[0], title[1], title[2], title[3], title[4], title[5], title[7], title[9]];
				_this.dx_arr = ['支付金额', '支付件数', '访客数', '加购人数', '支付转化率', '件单价'];
			} else {
				_this.title = title;
				_this.dx_arr = ['支付金额', '支付件数', '访客数', '加购人数', '支付买家数', '支付转化率', '客单价', '件单价'];
			}

			$('#dx').empty();
			var str = '';
			for (var i = 0; i < _this.dx_arr.length; i++) {
				var d = _this.dx_arr[i];
				var value = i + 2;
				str += `<input type="checkbox" lay-skin="primary" lay-filter="dx" checked title=` + d + ` value=` + value + ` />`;
			}

			$('#dx').append(str)
			var form = layui.form;
			form.render();

			// _this.title = title;
			sell_data.sort(function(a, b) {
				return b.payment_amt - a.payment_amt;
			})
			table.render({
				id: "table_sell_detail",
				elem: '#table_sell_detail',
				data: sell_data,
				cols: [
					_this.title
				],
				limit: 10,
				page: true,
				totalRow: true
			});
			
			var ex_title = [];
			var ex_total = [];
			for (var i in _this.title) {
				var d = _this.title[i];
				ex_title.push(d.title)
				if(_this[d.field]){
					ex_total.push(_this[d.field].toString())
				}
			}
			ex_total = ['合计',''].concat(ex_total);
			
			var ex_data = [];
			for (var i in sell_data) {
				var d = sell_data[i];
				var one = [];
				for (var k in _this.title) {
					var d1 = _this.title[k].field;
					one.push(d[d1].toString());
				}
				ex_data.push(one)
			}
			ex_data.push(ex_total)
			$('#dl1').unbind('click').bind('click', function() {
				table.exportFile(ex_title, ex_data, 'xls');
			})
			
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

		// 竞品流量明细
		jpFlowDetail() {
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

			_this.arr_pla = [{
				name: '淘宝',
				value: '1',
				selected: true
			}, ];
			_this.selectRadio('#xm-platform', _this.arr_pla);
			_this.sel_pla = 1;

			_this.sel_s1 = '全部';
			// this.selectRadio('#xm-select-s1', arr);

			this.selectRadio('#xm-select-s2', xm_arr1)
			this.getJpFlowDetail()
		},

		getJpFlowDetail() {
			var _this = this;
			var send = _this.send;
			send.platform = _this.sel_pla;
			addLoading()
			$.ajax({
				url: url_jp_flowDetail,
				type: 'post',
				data: send,
				dataType: 'json',
				timeout:60000,
				success: function(res) {
					removeLoading()
					checkStatus(res, function() {
						_this.allFlowData = _this.filterTimeData(_this.selectDateShow, res.data);
						_this.fillFlowTable(1)
					});
				},
				error: function() {
					removeLoading()
					layer.alert('请求失败')
				}
			});
		},

		fillFlowTable(ci) {
			var _this = this;
			var goods_data = _this.allFlowData;
			goods_data = _this.filterThis(_this.sel_s1, goods_data, 'traffic_source');

			var data1 = [];
			var date_arr = [];
			_this.date_total = [];
			if (ci == 1) {
				_this.de_xm = [];
			}
			for (var i in goods_data) {
				var d = goods_data[i];
				var date = d.statistics_date;
				if (data1.hasOwnProperty(d.model_num) == false) {
					data1[d.model_num] = [];
				}
				data1[d.model_num].push(d)

				if (date_arr.indexOf(date) == -1) {
					date_arr.push(date)
					_this.date_total[date] = [];
				}
				_this.date_total[date].push(d)
				if (ci == 1) {
					getArrSelect(d);
				}
			}
			_this.goods_arr2 = changeFuZi('traffic_source', data1);

			if (ci == 1) {
				_this.de_xm = [{
					"name": "全部",
					"value": '全部',
					"selected": true
				}].concat(Object.values(_this.de_xm));
				_this.selectRadio('#xm-select-s1', _this.de_xm);
			}

			function getArrSelect(data) {
				get1(_this.de_xm, 'traffic_source');

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

			date_arr = date_arr.sort();
			var date_arr2 = date_arr.map(function(i) {
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
					}
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

			var table = layui.table;
			dlEx(_this.goods_arr2);
			table.render({
				elem: '#table_source_detail',
				id: 'table_source_detail',
				data: _this.goods_arr2,
				limit: 10,
				page: true,
				cols: [
					title
				],
				totalRow: true,
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
				table.reload('table_source_detail', {
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
				$('#dl2').unbind('click').bind('click', function() {
					table.exportFile(ex_title, ex_data, 'xls');
				})
			}
			
		},

		
	}
});
