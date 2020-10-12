/*
散点图文件
功能:
 1. 实现散点图
参数:
 1. divId: 用于做图div的id;
 2. data: 符合dataset的data;
 3. rule: 根据规则定义圆点的大小 形式: [圆点的倍数, 最小值, 最大值];
 4. style: 圆点样式; 定义颜色, 形状, 自定义
*/

function scatter(divId, data, rule, style) {
    var dom = document.getElementById(divId);
    var chart = echarts.getInstanceByDom(dom);
    if(chart == undefined || chart == null || chart == '') {
        chart = echarts.init(dom);
    }else {
        chart.clear();
    }
    
    var option = {
        dataset: {
            source: data
        },
        tooltip: {
            backgroundColor: '#f2f2f2',
            padding: [5, 10, 5, 10],
            borderWidth: 1,
            borderColor: '#d3d3d3',
            textStyle: {
               color: '#353434',
            },
            formatter: function(obj) {
                var str = '';
                str = str + obj.marker + '<br />';
                str = str + data[0][0] + ': ' + obj.value[0] + ';<br />';
                str = str + data[0][1] + ': ' + obj.value[1] + ';<br />';
                str = str + data[0][2] + ': ' + obj.value[2] + ';';
                return str;
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            splitLine: { // 分隔线
                show: true,
                lineStyle: {
                    color: '#999',
                    type: 'dashed'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(200,200,200,0.1)','rgba(250,250,250,0.1)'],
                }, 
            },
            axisLine: { // 轴线
                show: true
            },
            max: function(value) {
                return value.max + .5;   
            }
        },
        yAxis: {
            type: 'category',
            splitLine: { // 分隔线
                show: false,
            },
            axisLine: { // 轴线
                show: true
            },
        },
        series: {
            type: 'scatter',
            symbolSize: function (val) {
                if(rule instanceof Array && rule.length >= 3) {
                    var radius = 0;
                    radius = val[2] / rule[0];
                    radius = radius < rule[1] ? rule[1] : radius;
                    radius = radius > rule[2] ? rule[2] : radius;
                    return radius
                }else {
                    return val[2] / 2;
                }
            },
            encode: {
                x: data[0][0]
            }
        },
    }
    if(style) {
        if(style.color) {
            option['color'] = style.color;
        }
        if(style.markPoint) {
            option.series['symbol'] = style.markPoint;
        }
    }
    chart.setOption(option);
    window.addEventListener("resize", function(e) {
        chart.resize();
    });
}
