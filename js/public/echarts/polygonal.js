/*
 折线图文件
 功能: 
    1. 实现折线图;
    2. 实现多条折线图;
    3. 实现堆叠效果;
    4. 实现水位;
 参数:
    1.divId: 用于作图的div
    2.data: 作图的data
    3.是否堆叠 

 问题: hover时圆圈变大
*/

function polygonal(divId, data,title,isStacking, isAreaStyle, lineColor, areaColor) {	
	var dom = document.getElementById(divId);
	var chart = echarts.getInstanceByDom(dom);
	if (chart == '' || chart == undefined || chart == null) {
		chart = echarts.init(dom);
	} else {
		chart.clear();
	}

	var linecolors = ['#f1892e', '#32a4ff', '#50d166', '#f13930', '#5553ce', '#888888', '#FD75D9', '#00FFFF', '#FFDB5C',
		'#9AF2F2'
	];
	var option = {
		title: {
		      left: 'center',
		      text: title,
		  },
		color: linecolors,
		dataset: {
			source: data
		},
		legend: {
			top:25
		},
		// grid: {
		// 	left:'5px',
		// 	right:'25px',
		// 	containLabel: true
		// },
		tooltip: {
			trigger: 'axis',
			backgroundColor: '#f2f2f2',
			padding: [5, 10, 5, 10],
			borderWidth: 1,
			borderColor: '#d3d3d3',
			textStyle: {
				color: '#353434',
			}
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
		},
		yAxis: {
			type: 'value'
		},
		series: []
	}
	var window_width = $('body').width();
	if (window_width <= 768) {
		option.grid = {
			left: '5px',
			right: '10px',
			containLabel: true
		}
	}

	for (var i = 1; i < data[0].length; i++) {
		var obj = {
			type: 'line',
			smooth: true,
			// showSymbol: false,
			name: data[0][i],
			lineStyle: {
				width: 3,
			},
			encode: {
				x: 'date',
				y: data[0][i]
			},
		}
		if (isStacking == true) {
			obj['stack'] = '总量';
		}
		if (isAreaStyle == true) {
			obj['areaStyle'] = {};
			if (areaColor) {
				obj['areaStyle']['color'] = linecolors[i - 1];
			}
		}
		if (lineColor) {
			obj['lineStyle']['color'] = linecolors[i - 1];
		}
		option.series.push(obj)
	}
	chart.setOption(option, true);
	window.addEventListener("resize", function(e) {
		chart.resize();
	});
	return chart;
}


function contrastE(divId, data,title, tar, dateType) {
	var all_time = [];
	var all_data = [];
	for (var t in data) {
		var k = data[t];
		if (Object.keys(k).length > 0) {
			var time1 = [];
			var data1 = [];
			change1(k, time1, data1);
			var t1 = {
				type: 'category',
				boundaryGap: false,
				data: time1
			};
			var d1 = {
				type: 'line',
				smooth: true,
				data: data1
			};
			all_time.push(t1)
			all_data.push(d1)
		}
	}
	if (all_data.length == 2) {
		all_data[1].xAxisIndex = 1;
	}
	if(all_time.length == 0){
		all_time = [{}]
	}

	function change1(data, time, arr) {
		var title = $('.selectHezi .heZiText').text()
		title = title.split('(')[0] + '趋势图';
		for (var i in data) {
			var d = data[i];
			var date = i;
			if (dateType == 'week') {
				var year = date.split('-')[0];
				date = year + '年第' + getWeekInYear(date) + '周';
			}
			if (dateType == 'monthrange') {
				var marr = date.split('-');
				date = marr[0] + '-' + marr[1];
			}
			var sum = 0;
			var payment_amt = 0;
			var payment_qty = 0;
			var visitors = 0;
			var shopping_cart = 0;
			var payment_collect_qty = 0;
			var pay_conversion_rate = 0;
			var customer_price = 0;
			var unit_price = 0;
			for (var j in d) {
				var item = d[j];
				sum = changeSum(sum, item[tar]);
				payment_amt = changeSum(payment_amt, item.payment_amt);
				payment_qty = changeSum(payment_qty, item.payment_qty);
				visitors = changeSum(visitors, item.visitors);
				shopping_cart = changeSum(shopping_cart, item.shopping_cart);
				payment_collect_qty = changeSum(payment_collect_qty, item.payment_collect_qty);
			}
			if (tar == 'pay_conversion_rate') {
				pay_conversion_rate = (changeChu(payment_collect_qty, visitors) * 100).toFixed(2);
				sum = pay_conversion_rate;
			}
			if (tar == 'customer_price') {
				customer_price = changeChu(payment_amt, payment_collect_qty).toFixed(0);
				sum = customer_price;
			}
			if (tar == 'unit_price') {
				unit_price = changeChu(payment_amt, payment_qty).toFixed(0);
				sum = unit_price;
			}
			time.push(date);
			arr.push(sum);
		}
	}

	var dom = document.getElementById(divId);
	var chart = echarts.getInstanceByDom(dom);
	if (chart == '' || chart == undefined || chart == null) {
		chart = echarts.init(dom);
	} else {
		chart.clear();
	}

	var linecolors = ['#f1892e', '#32a4ff', '#50d166', '#f13930', '#5553ce', '#888888', '#FD75D9', '#00FFFF', '#FFDB5C',
		'#9AF2F2'
	];
	option = {
		  title: {
		        left: 'center',
		        text: title,
		    },
		color: linecolors,
		tooltip: {
			trigger: 'axis',
			backgroundColor: '#f2f2f2',
			padding: [5, 10, 5, 10],
			borderWidth: 1,
			borderColor: '#d3d3d3',
			textStyle: {
				color: '#353434',
			}
		},
		legend: {
			top:25
		},
		// xAxis: [{
		// 		type: 'category',
		// 		boundaryGap: false,
		// 		data: ['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7', '2016-8', '2016-9', '2016-10',
		// 			'2016-11', '2016-12'
		// 		]
		// 	},
		// 	{
		// 		type: 'category',
		// 		boundaryGap: false,
		// 		data: ['2015-1', '2015-2', '2015-3', '2015-4', '2015-5', '2015-6', '2015-7', '2015-8', '2015-9', '2015-10',
		// 			'2015-11', '2015-12'
		// 		]
		// 	}
		// ],
		xAxis: all_time,
		yAxis: [{
			type: 'value'
		}],
		// series: [{
		// 		name: '2016 降水量',
		// 		type: 'line',
		// 		smooth: true,
		// 		data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
		// 	},
		// 	{
		// 		name: '2015 降水量',
		// 		type: 'line',
		// 		xAxisIndex: 1,
		// 		smooth: true,
		// 		data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
		// 	}]
		series: all_data
	};

	var window_width = $('body').width();
	if (window_width <= 768) {
		option.grid = {
			left: '5px',
			right: '10px',
			containLabel: true
		}
	}

	chart.setOption(option, true);
	window.addEventListener("resize", function(e) {
		chart.resize();
	});
	return chart;
}
