/*
 仪表盘类文件
 功能:
    1.
 参数: 
    1.divId 做图div的id
*/

function dashBoard(divId, name, value) {
	var dom = document.getElementById(divId);
	var chart = echarts.getInstanceByDom(dom);
	var axisLineColor = ['#ff7a7a', '#ffc16b', '#6dd481', '#56aaff', '#5a60ff'];
	if (chart == '' || chart == undefined || chart == null) {
		chart = echarts.init(dom);
	} else {
		chart.clear();
	}
	if (value > 100) { // 防止过100
		value = 100;
	} else if (value < 0) {
		value = 0;
	}
	var t_radius = '135%';
	var window_width = $('body').width();
	if (window_width <= 768) {
		t_radius = '90%';
	}
	var option = {
		series: {
			type: 'gauge',
			splitNumber: 10,
			min: 0,
			startAngle: 0,
			endAngle: 180,
			clockwise: false,
			max: 100,
			radius: t_radius,
			// radius: '135%',
			center: ['50%', '80%'],
			axisLine: { // 轴线  外围线的设置  现在是隐藏的
				show: true,
				lineStyle: {
					width: 0,
					shadowBlur: 0,
					color: [
						[0.2, '#cccccc'],
						[0.4, '#cccccc'],
						[0.6, '#cccccc'],
						[0.8, '#cccccc'],
						[1, '#cccccc']
					]
				}
			},
			axisTick: { // 刻度线
				show: true,
				lineStyle: {
					color: 'auto',
					width: 2.5,
				},
				length: 25,
				splitNumber: 5
			},
			splitLine: { // 分隔线样式
				show: true,
				length: 22,
				lineStyle: {
					color: 'auto',
				}
			},
			axisLabel: {
				show: false
			},
			pointer: {
				show: 0,
				length: '70%',
				width: 2
			},
			title: {
				color: '#2f2f2f',
				offsetCenter: [0, '-45%'],
			},
			detail: { // 数字的样式
				offsetCenter: [0, '-15%'],
				textStyle: {
					color: 'black',
					fontSize: 28,

				},
				formatter: '{value}%'
			},
			data: [{ // 数据
				name: name,
				value: value
			}]
		}
	}
	var paragraph = parseInt(value / 20);
	var leave = value % 20 > 0 ? 1 : 0;
	for (var i = 0; i < paragraph; i++) {
		option.series.axisLine.lineStyle.color[i][1] = axisLineColor[i];
	}
	if (leave != 0) {
		var temp = option.series.axisLine.lineStyle.color[paragraph + leave - 1].slice(0);
		option.series.axisLine.lineStyle.color[paragraph + leave - 1][0] = value / 100;
		option.series.axisLine.lineStyle.color[paragraph + leave - 1][1] = axisLineColor[i];
		option.series.axisLine.lineStyle.color.splice(paragraph + leave, 0, temp);
	}
	chart.setOption(option,true);
	window.addEventListener("resize", function(e) {
		var series = option.series;
		var t_radius = '135%';
		var window_width = $('body').width();
		if (window_width <= 768) {
			t_radius = '90%';
		}
		series.radius = t_radius;
		chart.setOption(option, true);
		chart.resize();
	});
}
