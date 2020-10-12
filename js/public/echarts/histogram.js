/*
柱状图文件
功能:
 1. 实现柱状图;
 2. 实现横向纵向画图;
 3. 实现堆叠效果;
参数:
 1. 用于做图div的id;
 2. 做图的数据;
 3. 做图的方向;
 4. 柱状图是否堆叠;
 5. 柱状图的颜色;
*/

function histogram(divId, data, direction, isStack, barColor, interval) {
    var dom = document.getElementById(divId);
    var chart = echarts.getInstanceByDom(dom);
    if(chart == null || chart == undefined || chart == '') {
        chart = echarts.init(dom);
    }else {
        chart.clear();
    }
    var option = {
        color: ['#f1892e', '#32a4ff', '#50d166', '#f13930', '#5553ce'],
        dataset: {
            source: data,
        },
        grid: {
            left: '3%',
            right: '6.5%',
            bottom: '3%',
            top: '3%', 
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#f2f2f2',
            padding: [5, 10, 5, 10],
            borderWidth: 1,
            borderColor: '#d3d3d3',
            textStyle: {
               color: '#353434',
            },
            axisPointer: {
            	type: 'shadow', // 阴影
            	label: {
                	backgroundColor: '#6a7985',
            	}
        	},
        },
        xAxis: {axisLabel: {}},
        yAxis: {axisLabel: {}},
        series: []
    }

    // ============================= 控制柱状图的方向, 默认为竖直方向 =============================
    option.xAxis['type'] = 'category';
    if(direction && direction == 'transverse') { 
        option.yAxis['type'] = 'category';
        option.xAxis['type'] = '';
        if(interval) {
            option.yAxis['axisLabel']['interval'] = interval;   
        }
    }
    if(interval) {
        option.xAxis['axisLabel']['interval'] = interval;
    }
    // ============================= 控制柱状图的方向, 默认为竖直方向 =============================

    for(var i = 1;i < data[0].length;i++) {
        var obj = {
            type: 'bar',
            name: data[0][i],
            itemStyle: {},
        }

        // ============================= 堆叠效果 =============================
        if(isStack == true) {
            obj['stack'] = '总量';
        }
        // ============================= 堆叠效果 =============================

        // ============================= 颜色效果 =============================
        // if(barColor) {
        //     obj['itemStyle']['color'] = barColor[i - 1]; 
        // }
        // ============================= 颜色效果 =============================

        option.series.push(obj);
    }
    chart.setOption(option);
    window.addEventListener("resize", function(e) {
        chart.resize();
    });
}