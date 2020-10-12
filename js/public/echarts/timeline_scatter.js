/*
时间轴散点图
功能:
 1. 实现时间轴散点图
参数:
 1. divId: 用于做图div的id;
 2. lineData: 轴的数据;
 3. seriesData: 详细数据
*/

function timelineScatter(divId, lineData, seriesData, ruleName, category) {
    var dom = document.getElementById(divId);
    var chart = echarts.getInstanceByDom(dom);
    if (chart == undefined || chart == null || chart == '') {
        chart = echarts.init(dom);
    } else {
        chart.clear();
    }

    var option = {
        baseOption: {
            color: ['#f1892e', '#32a4ff', '#50d166', '#f13930', '#5553ce'],
            timeline: { // 时间轴
                axisType: 'category',
                orient: 'vertical',
                inverse: true,
                left: null,
                right: 0,
                top: 20,
                bottom: 20,
                width: 55,
                height: null,
                label: {
                    normal: {
                        textStyle: {
                            // color: '#999'
                        }
                    },
                    emphasis: {
                        textStyle: {
                            // color: '#fff'
                        }
                    }
                },
                symbol: 'none',
                lineStyle: {
                    // color: '#555'
                },
                checkpointStyle: {
                    color: '#000',
                    borderColor: '#000',
                    borderWidth: 2
                },
                controlStyle: {
                    showNextBtn: false,
                    showPrevBtn: false,
                    normal: {
                        color: '#666',
                        borderColor: '#666'
                    },
                    emphasis: {
                        color: '#aaa',
                        borderColor: '#aaa'
                    }
                },
                data: []
            },
            tooltip: {
                backgroundColor: '#f2f2f2',
                padding: [5, 10, 5, 10],
                borderWidth: 1,
                borderColor: '#d3d3d3',
                textStyle: {
                color: '#353434',
                },
                formatter: function (obj) {
                    var str = '';
                    str = str + obj.marker + '<br />';
                    str = str + '时间: ' + obj.data[4] + '<br />';
                    str = str + '类目: ' + obj.data[3] + '<br />';
                    str = str + '销售额: ' + obj.data[2] + ' 元<br />';
                    str = str + '销售额占比: ' + obj.data[0] + ' %<br />';
                    str = str + '同比增长率: ' + obj.data[1] + ' %<br />';
                    return str;
                }
            },
            xAxis: {
                type: 'value',

                name: ruleName[0],
                nameGap: 25,
                nameLocation: 'middle',
                nameTextStyle: {
                    fontSize: 18
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        // color: '#ccc'
                    }
                },
                axisLabel: {
                    formatter: '{value} %'
                }
            },
            yAxis: {
                type: 'value',
                name: ruleName[1],
                // max: 100,
                nameTextStyle: {
                    // color: '#ccc',
                    fontSize: 18
                },
                axisLine: {
                    lineStyle: {
                        // color: '#ccc'
                    }
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value} %'
                }
            },
            visualMap: [
                {
                    show: true,
                    dimension: 3,
                    categories: category,
                    calculable: true,
                    precision: 0.1,
                    textGap: 30,
                    textStyle: {
                        // color: '#ccc'
                    },
                    inRange: {
                        color: (function () {
                            var colors = ['#f1892e', '#32a4ff', '#50d166', '#f13930', '#5553ce'];
                            return colors.concat(colors);
                        })()
                    }
                }
            ],
            series: [
                {
                    type: 'scatter',
                    itemStyle: {},
                    data: seriesData[0],
                    symbolSize: function (val) {
                        return sizeFunction(val[2]);
                    }
                }
            ],
        },
        options: [],
    }
    for(var i = 0;i < lineData.length;i++) {    
        option.baseOption.timeline.data.push(lineData[i]);
        option.options.push({
            title: {
                show: true,
                'text': lineData[i] + ''
            },
            series: {
                name: lineData[i],
                type: 'scatter',
                // itemStyle: itemStyle,
                data: seriesData[i],
                symbolSize: function(val) {
                    return parseFloat(val[2]) / 5;
                }
            }
        });
    }
    chart.setOption(option);
    window.addEventListener("resize", function(e) {
        chart.resize();
    });
}

var min = 0;
var max = 0;

var sizeFunction = function (x) {
    var y = x / 10000;
    return y;
};
