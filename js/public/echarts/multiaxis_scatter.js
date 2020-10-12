/*
多轴散点图
功能:
 1. 实现多轴散点图
参数:
 1. 用于做图div的id;
 2. cateData: 各大类的数据;
 3. dimensionData: 维度数据;
 4. detailData: 详细数据;
*/

function multiaxisScatter(divId, cateData, dimensionData, detailData, pointColor, rule) {
    var dom = document.getElementById(divId);
    var chart = echarts.getInstanceByDom(dom);
    if(chart == undefined || chart == null || chart == '') {
        chart = echarts.init(dom);
    }else {
        chart.clear();
    }

    var option = {
        color: ['#f1892e', '#32a4ff', '#50d166', '#f13930', '#5553ce'],
        tooltip: {
            backgroundColor: '#f2f2f2',
            padding: [5, 10, 5, 10],
            borderWidth: 1,
            borderColor: '#d3d3d3',
            textStyle: {
               color: '#353434',
            },
            formatter: function(obj) {
                var str = obj.marker + '<br />';
                str = str + '名称: ' + obj.name + '<br />';
                str = str + '数值: ' + obj.value[1];
                return str;
            },
        },
        title: [],
        singleAxis: [],
        series: []
    }
    for(var i = 0;i < cateData.length;i++) {
        option.title.push({
            textBaseline: 'middle',
            top: (1.5 * i + 0.5) * 100 / 7 + '%',
            text: cateData[i],
            textStyle: {
                fontSize: 14,
            }
        });
        option.singleAxis.push({
            left: 200,
            type: 'category',
            boundaryGap: false,
            data: dimensionData,
            top: (1.5 * i + 0.5) * 100 / 7 - 1 + '%',
            height: (100 / 7 - 10) + '%',
        });
        option.series.push({
            symbolOffset: ['0' , '-20%'],
            singleAxisIndex: i,
            coordinateSystem: 'singleAxis',
            type: 'scatter',
            data: detailData[i],
            symbolSize: function (dataItem) {
                if(rule instanceof Array && rule.length >= 3) {
                    var radius = dataItem[1] / rule[0];
                    radius = radius < rule[1] ? rule[1] : radius;
                    radius = radius > rule[2] ? rule[2] : radius;
                    return radius;
                }else {
                    return dataItem[1] * 4;
                }
            }
        });
    }
    chart.setOption(option);
    window.addEventListener("resize", function(e) {
        chart.resize();
    });
}