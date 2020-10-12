/*
特殊折线图
功能:
 1. 实现分段颜色;
 2. 实现markpoint提示;
参数:
 1. divId: 用于做图div的id;
 2. 符合dataset格式的data;
 3. lineColor: 线体颜色;
 4. specialData: 特殊节日
*/

function specialPolygonal(divId, data, lineColor, specialData) {
    var dom = document.getElementById(divId);
    var chart = echarts.getInstanceByDom(dom);
    if(chart == undefined || chart == null || chart == '') {
        chart = echarts.init(dom);
    }else {
        chart.clear();
    }

    var option = {
        color: lineColor,
        dataset: {
            source: data,
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
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
        },
        yAxis: {
            type: 'value',
        },
        series: {
            type: 'line',
            smooth: true,
            showSymbol: false,
            name: data[0][1],
            lineStyle: {
                width: 3,
                color: lineColor[0],
            },
            markArea: {
                data: specialData,
                itemStyle: {
                    color: 'rgb(250, 230, 171, .6)',
                }
            }
        },
    }
    chart.setOption(option);
    window.addEventListener("resize", function(e) {
        chart.resize();
    });
}
