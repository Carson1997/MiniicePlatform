/*
 笛卡尔积坐标系热力分布图
 功能:
    1.
 参数: 
    1.divId 画图div的id;
    2.data dataset形式传入的数据
    3.必须传入最小值最大值;
    4.dimensionNamme: 维度名称
*/

function thermogram(divId, data, min, max, dimensionNamme) {
   var dom = document.getElementById(divId);
   var chart = echarts.getInstanceByDom(dom);
   if (chart == '' || chart == undefined || chart == null) {
      chart = echarts.init(dom);
   } else {
      chart.clear();
   }

   var option = {
      dataset: {
         source: data
      },
      tooltip: { // 提示框
         backgroundColor: '#f2f2f2',
         padding: [5, 10, 5, 10],
         borderWidth: 1,
         borderColor: '#d3d3d3',
         textStyle: {
            color: '#353434',
         },
         formatter: function(obj) {
            var str = obj.marker + '<br />' + '时间: ' + obj.data[1] + '日' + obj.data[0] + '时' + ';<br />' + dimensionNamme + ': ' + obj.data[2] + ';';
            return str
         }
      },
      grid: { // 坐标轴位置
         width: '85%',
         height: '80%',
         top: '13%',
         y: '10%'
      },
      xAxis: {
         type: 'category',
         splitArea: {
            show: true
         },
         axisLabel: {
            interval: 2
        }
      },
      yAxis: {
         type: 'category',
         splitArea: {
            show: true
         },
      },
      visualMap: {
         show: true,
         orient: 'horizontal', // 横向布置
         left: '20%',
         top: '10px',
         pieces: [],
      },
      series: [{
         type: 'heatmap',
         itemStyle: {
            borderWidth: 4,
            borderColor: 'white'
         },
         encode: {
            x: 'time',
            y: 'date'
        }
      }]
   }

   if(min != undefined && max != undefined) {
      var colors = ['#e0e0e0', '#ffd5b0', '#fdbb81', '#ff963a', '#ed6d00'];
      var interval = (max - min) / 4;
      option.visualMap.pieces = [
          {'value': 0, 'color': colors[0]},
      ]   
      if(min == 0) {
         min = 1;
      }   
      for(var i = 0;i < 4;i++) {  
          if(i == 0) {
              option.visualMap.pieces.push({'min': min, max: interval * (i + 1), 'color': colors[i + 1]});
          }else {
              option.visualMap.pieces.push({'min': interval * i, max: interval * (i + 1), 'color': colors[i + 1]});
          }
      }
 }

   chart.setOption(option);
   window.addEventListener("resize", function(e) {
      chart.resize();
   });
}
