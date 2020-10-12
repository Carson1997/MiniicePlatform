/*
圆形图文件
功能:
 1.实现圆环图;
 2. visualmap指定种类颜色  (没实现);
 3.自定义圆环大小
参数:
 1.做图div的id;
 2.作为dataset的data数组; 
*/

function pieChart(divId, data, radius) {
    var dom = document.getElementById(divId);
    var chart = echarts.getInstanceByDom(dom);
    if (chart == undefined || chart == null || chart == '') {
        chart = echarts.init(dom);
    } else {
        chart.clear();
    }

    var option = {
        color: ['#f1892e', '#32a4ff', '#50d166', '#f13930', '#5553ce'],
        dataset: {
            source: data
        },
        tooltip: {
            trigger: 'item',
            position: ['26%', '42%'],
            backgroundColor: '#f2f2f2',
            padding: [5, 10, 5, 10],
            borderWidth: 1,
            borderColor: '#d3d3d3',
            textStyle: {
               color: '#353434',
            },
            formatter: function(obj) {
                var str = obj.marker + '<br />' + 
                        data[0][0] + ': ' + obj.value[0] + '<br />' + 
                        '数量: ' + ': ' + obj.value[1] + '<br />' + 
                        '占比: ' + obj.percent + '%';
                return str;
            }
        },
        series: {
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            label: {
                normal: {
                    show: false,
                }
            },
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
            }
        }
    }
    if(radius) {
        option.series.radius = radius;
    }
    chart.setOption(option);
    window.addEventListener("resize", function(e) {
        chart.resize();
    });
}