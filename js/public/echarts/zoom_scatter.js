/*
 name: 带缩放的散点图
 para: 
    divId: 用于做图div的id;
    data: 数据;
    color: 点的颜色
*/

function zoomScatter(divId, data, color, rule) {

    var dom = document.getElementById(divId);
    var chart = echarts.getInstanceByDom(dom);
    if(chart == '' || chart == undefined || chart == null) {
        chart = echarts.init(dom);
    }else {
        chart.clear();
    }

    var option = {
        backgroundColor: 'white',
        legend: {
            top: 10,
        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'cross'
            },
            backgroundColor: '#f2f2f2',
            padding: [5, 10, 5, 10],
            borderWidth: 1,
            borderColor: '#d3d3d3',
            textStyle: {
               color: '#353434',
            },
            formatter: function(obj) {
                var str = obj.marker + '<br />'; 
                str = str + '品牌: ' + obj.data[6] + '<br />';
                str = str + '型号: ' + obj.data[3] + '<br />';
                str = str + '尺寸: ' + obj.data[0] + '&nbsp;<br />';
                str = str + '销量: ' + obj.data[2] + '&nbsp<br />';
                str = str + '价格: ' + obj.data[5] + '&nbsp<br   />';
                return str;
            }
        },
        toolbox: {
            top: '10',
            right: '30',
            feature: {
                dataZoom: {},
                brush: {
                    type: [''],
                }
            }
        },
        xAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
            scale: true,
        },
        series: [],
    }
    
    for(var i = 0;i < data.length;i++) {
        var name = data[i].length == 0 ? $($('.ah-tab-content[data-ah-tab-active=true]').find('input')[i]).val() : data[i][0][6];
        var obj = {
            name: name,
            data: data[i],
            type: 'scatter',
            symbolSize: function (data) {
                return Math.sqrt(data[2]);
            },
            itemStyle: {
                normal: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(120, 36, 50, 0.5)',
                    shadowOffsetY: 5,
                    color: color[i],
                }
            }
        };
        option.series.push(obj);
    }
    if(rule) {
        for(var i in rule) {
            option[i]['type'] = rule[i];
        }
    }
    chart.setOption(option);
    window.addEventListener("resize", function(e) {
        chart.resize();
    });
}