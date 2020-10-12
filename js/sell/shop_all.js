var vm = new Vue({
	el: '#vue',
	data: {
		allShopData: {
			data1: '',
			data2: ''
		},

		send: {
			date: '2020-06-01_2020-06-30',
			date_type: '1',
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
		selectDateShow: '',
		daterange: [],
		monthrange: [],

		dateValue2: "",
		daterange2: '',
		monthrange2: '',

		// 日期控制的变量  结束 ============================

		select_shop: [],

		// 目标
		monthSale: [],
		yearSale: [],
		monthTargetName: '',
		yearTargetName: '',
		target: {},
		target_month: {
			"payamt": "",
			"target": [{
				"targetname": "",
				"target": ""
			}]
		},
		target_year: {
			"payamt": "",
			"target": [{
				"targetname": "",
				"target": ""
			}, ]
		},


		payment_amt: 0,
		payment_qty: 0,
		visitors: 0,
		shopping_cart: 0,
		payment_collect_qty: 0,
		pay_conversion_rate: 0,
		customer_price: 0,
		unit_price: 0,

		s_tar: 'payment_amt',
		dateType2: 'no',
		type2: 'no',
		tarShow: '',
		sel_show: '&nbsp',
	},

	mounted: function() {

		this.initLayui();

		this.initSelect();

		this.getShop();

		this.initConTop();	

		this.initHeZiClick();
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
				$('#datePicker1').find('.el-date-editor--daterange')[0].click();
			}
			if (type == 'week') {
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

			this.getMonTarDate();
			this.getShopData(1)
		},

		//处理月目标的日期
		getMonTarDate() {
			var montar_date = this.send.date.split('_')[0];
			this.montar_date1 = moment(montar_date).month(moment(montar_date).month()).startOf('month').format('YYYY-MM-DD');
			this.montar_date2 = moment(montar_date).month(moment(montar_date).month()).endOf('month').format('YYYY-MM-DD');

			if (this.send.date_type == 1 || this.send.date_type == 3) {
				if (this.selectDateShow.split('_')[0] == this.selectDateShow.split('_')[1]) {
					this.tarShow = true;
				} else {
					this.tarShow = false;
				}
			}
			if (this.send.date_type == 2) {
				this.tarShow = false;
			}
		},

		dateClick2: function(value) {
			var _this = this;
			_this.send2 = JSON.parse(JSON.stringify(_this.send));
			// $('#xm-time').val('yes');
			$("input[name=time][value=yes]").prop('checked', true);
			layui.form.render();
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

			this.getShopData(2)
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
			form.render();

			form.on('checkbox(dx)', function(data) {
				var index = data.value;
				var ifshow = !data.elem.checked;
				_this.title[index].hide = ifshow;
				layui.table.reload('table_shop', {
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
			var form = layui.form;
			form.on('select(xm-time)', function(data) {
				$('#xm-time').val('no');
				form.render();
				var type = data.value;
				_this.mergeHandle(_this.time_data);
				_this.dateType2 = _this.dateType;
				_this.type2 = type;
				if (type == 'no') {
					_this.allShopData.data2 = '';
					_this.dateValue2 = "";
					_this.daterange2 = '';
					_this.monthrange2 = '';
					_this.filterData();
				} else {
					if (_this.dateType == 'daterange') {
						$('#d1').focus()
						// $('#datePicker2').find('.el-date-editor--daterange')[0].click();
					}
					if (_this.dateType == 'week') {
						$('#d2').focus()
						// $('#datePicker2').find('.el-date-editor--daterange')[1].click();
						$('.available').removeClass('in-range start-date');
						$('.available').removeClass('in-range end-date');
					}
					if (_this.dateType == 'monthrange') {
						$('#d3').focus()
						// $('#datePicker2').find('.el-date-editor--monthrange').click()
					}
				}
			})

			form.on('radio(ra-time)', function(data) {
				// var before = $("input[name=time]:checked").val();
				// if(before == 'no'){
					
				// }
				$("input[name=time][value=no]").prop('checked', true);
				form.render();
				var type = data.value;
				_this.mergeHandle(_this.time_data);
				_this.dateType2 = _this.dateType;
				_this.type2 = type;
				if (type == 'no') {
					_this.allShopData.data2 = '';
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
				// console.log($(this).attr('data'))

				_this.s_tar = $(this).attr('data');
				_this.fillEachart();
			})
		},


		//填充年度  月度目标
		yearMonthTarget: function(data, which) {
			var _this = this;
			var arr = [];
			var payamt = parseInt(data.payamt).toString() == 'NaN' ? '---' : parseInt(data.payamt); // 实际销售额 
			for (var i = 0; i < data.target.length; i++) {
				if (data.target[i].target != 0) {
					var obj = {
						target: roundingFormat(data.target[i].target),
						'payamt': roundingFormat(payamt),
						'targetName': data.target[i].targetname
					};
					arr.push(obj);
				}
			}
			if (arr.length == 0) {
				var obj = {
					target: 0,
					'payamt': roundingFormat(payamt),
					'targetName': '未设置目标'
				};
				arr.push(obj);
			}
			var name = which + 'Sale';
			this[name] = arr.slice(0);
			var targetName = which + 'TargetName';
			this[targetName] = arr[0].targetName;
			Vue.nextTick(function() {
				for (var i = 0; i < arr.length; i++) {
					var div = 'target-' + which + '-charts_' + i;
					var value = ((parseFloat(arr[i]['payamt']) / parseFloat(arr[i]['target'])) * 100).toFixed(2).toString() ==
						'NaN' ? 0 : ((parseFloat(arr[i]['payamt']) / parseFloat(arr[i]['target'])) * 100).toFixed(2);
					dashBoard(div, '销量完成率', value);
				}
				if (which == 'month' && arr.length > 1) {
					_this.target_swicth(arr.length, '#c-data-month', which);
				} else if (which == 'year' && arr.length > 1) {
					_this.target_swicth(arr.length, '#c-data-year', which);
				}
			})
		},

		// 目标切换
		target_swicth: function(target_length, div_id, which) {
			var _this = this;
			$(div_id).find('.switch-box').empty()
			var switch_span = '';
			for (var i = 0; i < target_length; i++) { //动态循环生成有多少个按钮
				switch_span += '<span class="switch-btn" data-index="' + i + '" ';
				if (i == 0) { //默认第一个高亮显示
					switch_span += 'data-check="true" style="background:rgba(0, 0, 0, 0.5)" ';
				}
				switch_span += '></span>';
			}
			$(div_id).find('.switch-box').append(switch_span);

			$(div_id).find('.switch-btn').unbind('click').bind('click', function(e) { //点击
				$(div_id).find('.switch-btn').removeAttr('style'); // 清空所有样式
				$(div_id).find('.switch-btn').removeAttr('data-check'); // 清空点击标示
				$(e.currentTarget).css('background', 'rgba(0,0,0,0.5)'); // 点击的按钮显示高亮
				$(e.currentTarget).attr('data-check', 'true'); // 添加点击标示
				var right_width = $(e.currentTarget).parent().prev().width(); //计算切换宽度
				$(div_id).find('.c-p-switch-box').css('right', right_width * $(e.currentTarget).attr('data-index'));
				var whichName = which + 'TargetName';
				var arrName = which + 'Sale';
				_this[whichName] = _this[arrName][$(e.currentTarget).attr('data-index')].targetName;
			});

			$(window).resize(function() {
				var resize_width = $(div_id).find('.c-p-switch-box').width();
				var resize_index = $(div_id).find('.switch-btn[data-check="true"]').attr('data-index');
				if ($(div_id).find('.switch-btn[data-check="true"]').attr('data-index') != '0') { // 只有不是第一个就resize时候调整div位置
					$(div_id).find('.c-p-switch-box').css('right', resize_width * resize_index);
				}
			});
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
				arr_shop[i].selected = true;
			}
			var demo_select = xmSelect.render({
				direction: 'down',
				el: '#xm-shop',
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
				data: arr_shop,
				on: function(data) {
					_this.sel_show = '';
					if (data.arr.length > 0) {
						// _this.time_data.start_time = data.arr[0].data_star;
						// _this.time_data.end_time = data.arr[0].data_end;
						var a = [];
						_this.select_shop = data.arr.map(function(item) {
							var one = {
								shop_id: item.id,
								shop_name: item.name,
								data: []
							};
							a.push(item.name)
							return one;
						})
						_this.sel_show = a.join('，')
					} else {
						// _this.time_data.start_time = "";
						// _this.time_data.end_time = "";
						_this.select_shop = [];
					}
					_this.filterData()
				}
			});

			//初始化
			//日期
			if (arr_shop.length > 0) {
				_this.time_data.start_time = arr_shop[0].data_star;
				_this.time_data.end_time = arr_shop[0].data_end;
				_this.selectDateShow = arr_shop[0].data_end + '_' + arr_shop[0].data_end;
				_this.daterange = [arr_shop[0].data_end, arr_shop[0].data_end];
				_this.send.date = _this.selectDateShow;

				//选择店铺
				// demo_select.setValue([arr_shop[0].id]);
				// _this.select_shop = [{
				// 	shop_id: arr_shop[0].id,
				// 	shop_name: arr_shop[0].shop_name + changePlatform(arr_shop[0].platform),
				// 	data: []
				// }];

				//全选
				_this.select_shop = [];
				_this.sel_show = [];
				for (var i in arr_shop) {
					var d = arr_shop[i];
					var name = d.shop_name + '(' + changePlatform(d.platform) + ')';
					var one = {
						shop_id: d.id,
						shop_name: name,
						data: []
					};
					_this.select_shop.push(one)
					_this.sel_show.push(name);
				}
				_this.sel_show = _this.sel_show.join('，')
				// _this.select_shop = arr_shop.map(function(d) {
				// 	var one = {
				// 		shop_id: d.id,
				// 		shop_name: d.shop_name + '(' + changePlatform(d.platform) + ')',
				// 		data: []
				// 	};
				// 	return one;
				// })
			}


			// _this.send.date = "2020-05-01_2020-05-01";
			_this.getMonTarDate();
			_this.getShopData(1);
		},

		//获取店铺数据 c=1不对比，2对比
		getShopData(c) {
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
				url: url_shop_select,
				type: 'post',
				dataType: 'json',
				data: send,
				timeout:60000,
				success: function(res) {
					removeLoading()
					checkStatus(res, function() {
						if (c == 1) {
							// _this.allShopData.data1 = _this.filterTimeData(_this.send.date, res.data.shop_data);
							_this.allShopData.data1 = res.data.shop_data;
							_this.target.target_year = res.data.target_year;
							_this.target.shop_target = res.data.shop_target;
							_this.target.shop_data = res.data.shop_data;
						}
						if (c == 2) {
							// _this.allShopData.data2 = _this.filterTimeData(_this.send.date, res.data.shop_data);
							_this.allShopData.data2 = res.data.shop_data;
						}

						// console.log(res.data)
						

						_this.filterData();
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

		//过滤店铺数据
		filterData() {
			var _this = this;
			var shop_data = _this.allShopData;
			_this.date_arr = [];
			_this.target_month.payamt = 0;
			_this.target_month.target[0].target = 0;
			_this.target_year.payamt = 0;
			_this.target_year.target[0].target = 0;

			var time1 = new Date(_this.selectDateShow.split('_')[0]).getTime();
			var time2 = new Date(_this.selectDateShow.split('_')[1]).getTime();

			_this.c_data = {
				data1: [],
				data2: []
			};
			//循环选择的店铺
			for (var a in _this.select_shop) {
				var d1 = _this.select_shop[a];
				d1.data = [];

				if (_this.tarShow && _this.type2 == 'no') {
					//年目标,月目标
					for (var i in _this.target.shop_target) {
						var d = _this.target.shop_target[i];
						if (d1.shop_id == d.shop_id) {
							if (_this.montar_date1 == d.date) {
								_this.target_month.target[0].target = changeSum(_this.target_month.target[0].target, d.target);
							}
							_this.target_year.target[0].target = changeSum(_this.target_year.target[0].target, d.target);
						}
					}

					//月目标销售
					for (var i in _this.target.shop_data) {
						var d = _this.target.shop_data[i];
						var date = d.statistics_date;
						var shopid = d.shop_id;
						if (_this.montar_date1 <= date && date <= _this.montar_date2 && d1.shop_id == shopid) {
							_this.target_month.payamt = changeSum(_this.target_month.payamt, d.payment_amt);
						}
					}

					//年目标销售额
					for (var i in _this.target.target_year) {
						var d = _this.target.target_year[i];
						if (d1.shop_id == d.shop_id) {
							_this.target_year.payamt = changeSum(_this.target_year.payamt, d.payment_amt);
						}
					}
				}


				//循环所有数据 用于盒子，折线图，表
				for (var i in shop_data) {
					var k = shop_data[i];
					for (var i1 in k) {
						var d = k[i1];
						//匹配所选店铺
						if (d1.shop_id == d.shop_id) {
							var date = d.statistics_date;

							//获取所有日期
							if (_this.date_arr.hasOwnProperty(date) == false) {
								_this.date_arr[date] = {
									data1: [],
									data2: []
								};
							}
							_this.date_arr[date][i].push(d);

							if (_this.c_data[i].hasOwnProperty(date) == false) {
								_this.c_data[i][date] = [];
							}
							_this.c_data[i][date].push(d);

							var time = new Date(date).getTime();
							if (time >= time1 && time <= time2) {
								if (i == 'data1') {
									d1.data.push(d);
								}
							}

						}
					}
				}
			}
			if (_this.tarShow && _this.type2 == 'no') {
				_this.yearMonthTarget(_this.target_month, 'month');
				_this.yearMonthTarget(_this.target_year, 'year');
			}

			_this.fillHeZi()
			_this.fillEachart();
			_this.fillTable();
		},

		//填充盒子
		fillHeZi() {
			// payment_amt  payment_qty  visitors  shopping_cart
			// payment_collect_qty  pay_conversion_rate  customer_price  unit_price
			var _this = this;
			var data = _this.select_shop;
			_this.payment_amt = 0;
			_this.payment_qty = 0;
			_this.visitors = 0;
			_this.shopping_cart = 0;
			_this.payment_collect_qty = 0;
			_this.pay_conversion_rate = 0;
			_this.customer_price = 0;
			_this.unit_price = 0;

			for (var i in data) {
				var d = data[i].data;
				for (var i in d) {
					var d2 = d[i];
					_this.payment_amt = changeSum(_this.payment_amt, d2.payment_amt);
					_this.payment_qty = changeSum(_this.payment_qty, d2.payment_qty);
					_this.visitors = changeSum(_this.visitors, d2.visitors);
					_this.shopping_cart = changeSum(_this.shopping_cart, d2.shopping_cart);
					_this.payment_collect_qty = changeSum(_this.payment_collect_qty, d2.payment_collect_qty);
				}
			}

			_this.pay_conversion_rate = (changeChu(_this.payment_collect_qty, _this.visitors) * 100).toFixed(2);
			_this.customer_price = changeChu(_this.payment_amt, _this.payment_collect_qty).toFixed(0);
			_this.unit_price = changeChu(_this.payment_amt, _this.payment_qty).toFixed(0);
		},

		//折线图
		fillEachart() {
			var _this = this;
			// var data_all = [];
			// var date_arr = _this.date_arr;
			// var data_top = ['日期', '不对比'];
			// if (_this.type2 != 'no') {
			// 	data_top[2] = '对比时间';
			// }
			// var data_num = [];
			// for (var i in date_arr) {
			// 	var dd = date_arr[i];
			// 	var data1 = '',
			// 		data2 = '';

			// 	data1 = changeData(dd.data1, data1);
			// 	data2 = changeData(dd.data2, data2);

			// 	function changeData(tdata, data1) {
			// 		if (tdata.length == 0) {
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
			// 				var item = tdata[k];
			// 				data1 = changeSum(data1, item[_this.s_tar])

			// 				payment_amt = changeSum(payment_amt, item.payment_amt);
			// 				payment_qty = changeSum(payment_qty, item.payment_qty);
			// 				visitors = changeSum(visitors, item.visitors);
			// 				shopping_cart = changeSum(shopping_cart, item.shopping_cart);
			// 				payment_collect_qty = changeSum(payment_collect_qty, item.payment_collect_qty);
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

			// 	if (_this.dateType == 'week') {
			// 		var year = i.split('-')[0];
			// 		i = year + '年第' + getWeekInYear(i) + '周';
			// 	}
			// 	if (_this.dateType == 'monthrange') {
			// 		var arr = i.split('-');
			// 		i = arr[0] + '-' + arr[1];
			// 	}
			// 	var arr = [i, data1];

			// 	if (_this.dateType2 != 'no') {
			// 		arr.push(data2)
			// 	}
			// 	data_num.push(arr);
			// }

			// data_all = [data_top];
			// data_all = data_all.concat(data_num);
			// data_num.sort(function(a, b) {
			// 	var a1 = new Date(a[0]).getTime();
			// 	var b1 = new Date(b[0]).getTime();
			// 	return a1 - b1;
			// })

			// polygonal('echart_sellTrend',data_all);
			var title = $('.selectHezi .heZiText').text()
			title = title.split('(')[0] + '趋势图';
			contrastE('echart_sellTrend', _this.c_data, title, _this.s_tar, _this.dateType);

			if (Object.values(_this.select_shop).length == 0) {
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
			var payment_amt;
			var payment_collect_qty;
			var visitors;
			var payment_qty;
			_this.title = [{
					field: 'shop_name',
					title: '店铺',
					sort: false,
					minWidth: 195,
					totalRowText: '合计'
				},
				{
					field: 'payment_amt',
					title: '支付金额(元)',
					sort: false,
					minWidth: 130,
					// templet: function(d) {
					// 	payment_amt = ts(d, 'payment_amt');
					// 	return ts(d, 'payment_amt');
					// },
					totalRowText: _this.payment_amt
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
					totalRowText: _this.payment_qty
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
					totalRowText: _this.visitors
				},
				{
					field: 'shopping_cart',
					title: '加购人数(人)',
					sort: false,
					minWidth: 130,
					// templet: function(d) {
					// 	return ts(d, 'shopping_cart');
					// },
					totalRowText: _this.shopping_cart
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
					totalRowText: _this.payment_collect_qty
				},
				{
					field: 'pay_conversion_rate',
					title: '支付转化率(%)',
					sort: false,
					minWidth: 130,
					// templet: function(d) {
					// 	return (changeChu(payment_collect_qty, visitors) * 100).toFixed(2);
					// },
					totalRowText: _this.pay_conversion_rate
				},
				{
					field: 'customer_price',
					title: '客单价(元)',
					sort: false,
					minWidth: 130,
					// templet: function(d) {
					// 	return (changeChu(payment_amt, payment_collect_qty)).toFixed(0);
					// },
					totalRowText: _this.customer_price
				},
				{
					field: 'unit_price',
					title: '件单价(元)',
					sort: false,
					minWidth: 130,
					// templet: function(d) {
					// 	return (changeChu(payment_amt, payment_qty)).toFixed(0);
					// },
					totalRowText: _this.unit_price
				},
			];

			for (var i in _this.select_shop) {
				var a = _this.select_shop[i];
				a.payment_amt = 0;
				a.payment_qty = 0;
				a.visitors = 0;
				a.shopping_cart = 0;
				a.payment_collect_qty = 0;
				a.pay_conversion_rate = 0;
				a.customer_price = 0;
				a.unit_price = 0;
				for (var j in a.data) {
					var d2 = a.data[j];
					a.payment_amt = changeSum(a.payment_amt, d2.payment_amt);
					a.payment_qty = changeSum(a.payment_qty, d2.payment_qty);
					a.visitors = changeSum(a.visitors, d2.visitors);
					a.shopping_cart = changeSum(a.shopping_cart, d2.shopping_cart);
					a.payment_collect_qty = changeSum(a.payment_collect_qty, d2.payment_collect_qty);
				}
				a.pay_conversion_rate = (changeChu(a.payment_collect_qty, a.visitors) * 100).toFixed(2);
				a.customer_price = changeChu(a.payment_amt, a.payment_collect_qty).toFixed(0);
				a.unit_price = changeChu(a.payment_amt, a.payment_qty).toFixed(0);
			}
			_this.select_shop.sort(function(a, b) {
				return b.payment_amt - a.payment_amt;
			})
			table.render({
				id: "table_shop",
				elem: '#table_shop',
				data: _this.select_shop,
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
			ex_total = ['合计'].concat(ex_total);


			var ex_data = [];
			for (var i in _this.select_shop) {
				var d = _this.select_shop[i];
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
