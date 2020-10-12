var option = ''; // 作图基本的option

/*
 name: 构建中国地图下钻  基本参数
 para: divId : 用于作图div的id;
*/
function chinaMapDrilling(divId) {
    var dom = document.getElementById(divId);
    var chart = echarts.getInstanceByDom(dom);
    if (chart == undefined || chart == null || chart == '') {
        chart = echarts.init(dom);
    } else {
        chart.clear();
    }

    option = {
        backgroundColor: '#ffffff',
        title: {
            text: '',
            subtext: '',
            link: '',
            left: 'center',
            textStyle: {
                color: '#8ed7df',
                fontSize: 16,
                fontWeight: 'normal',
                fontFamily: "Microsoft YaHei"
            },
            subtextStyle: {
                color: '#ccc',
                fontSize: 13,
                fontWeight: 'normal',
                fontFamily: "Microsoft YaHei"
            }
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: '#f2f2f2',
            padding: [5, 10, 5, 10],
            borderWidth: 1,
            borderColor: '#d3d3d3',
            textStyle: {
               color: '#353434',
            },
            formatter: function(param) {
                var value = param.value.toString() == 'NaN' ? '--' : param.value;
                return param.name + ': ' + value;
            }
        },
        visualMap: {
            show: true,
            orient: 'horizontal', // 横向布置
            left: '15px',
            top: '30px',
            pieces: [],
         },
        animationDuration: 700,
        animationEasing: 'cubicOut',
        animationDurationUpdate: 700,
    };

    return chart;
}

/*
 name: 根据点击的地方作图
 para: chart: echarts实例, mapName: 地图名称, mapData: 地图上存在的省份
*/
function renderMap(chart, mapName, mapData, min, max, formatterData, zoom) { 
   if(min != undefined && max != undefined) {
       if(max > min) {
            var colors = ['#e0e0e0', '#ffe082', '#ffb300', '#fb8c00', '#d84315'];
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
       }else {
        option.visualMap.pieces = [
            {'value': 0, 'color': '#e0e0e0'},
        ]
       }
   }
    if(formatterData) {
        option.tooltip.formatter = function(param) {
            var name = overallConstObj.province[param.name];
            var str = '';
            str = str + name + '<br />';
            if(formatterData[name]) {
                str = str + '销量: ' + formatterData[name]['pcs'] + '&nbsp;件<br />';
                str = str + '销售额: ' + formatterData[name]['payment'] + '&nbsp;元<br />';
                str = str + '买家数: ' + formatterData[name]['paybyrcnt'] + '&nbsp;个<br />';
            }else {
                str = str + '销量: &nbsp;件<br />';
                str = str + '销售额: &nbsp;元<br />';
                str = str + '买家数: &nbsp;个<br />';
            }
            return str; 
        }
    }
    option.series = [ 
        {
            name: mapName,
            type: 'map',
            mapType: mapName,
            roam: 'false',
            zoom: 1,
            top: 100,
            nameMap:{
			    'china':'中国'
			},
            label: {
	            normal:{
					show:false,
					textStyle:{
						color:'#3a3838',
						fontSize:13
					}  
	            },
	            emphasis: {
	                show: true,
	                textStyle:{
						color:'#3a3838',
						fontSize: 13,
					}
	            }
	        },
	        itemStyle: {
	            normal: {
	                areaColor: '#ffffff',
	                borderColor: '#eb7c1b'
	            },
	            emphasis: {
	                areaColor: 'rgba(237, 109, 0, .7)'
	            }
	        },
            data: mapData,
        }	
    ];
    if(zoom) {
        option.series[0].zoom = zoom;
    }
    chart.setOption(option);
    window.addEventListener("resize", function(e) {
        chart.resize();
    });
}

/*
 name: 通过地图名称获取地图的json文件
 para: mapName: 地图的名称
*/
function getJsonByMapName(mapName) {
    var obj = {
        "河北": "hebei",
        "山西": "shanxi",
        "辽宁": "liaoning",
        "吉林": "jilin",
        "黑龙江": "heilongjiang",
        "江苏": "jiangsu",
        "浙江": "zhejiang",
        "安徽": "anhui",
        "福建": "fujian",
        "江西": "jiangxi",
        "山东": "shandong",
        "河南": "henan",
        "湖北": "hubei",
        "湖南": "hunan",
        "广东": "guangdong",
        "海南": "hainan",
        "四川": "sichuan",
        "贵州": "guizhou",
        "云南": "yunnan",
        "陕西": "shanxi1",
        "甘肃": "gansu",
        "青海": "qinghai",
        "新疆": "xinjiang",
        "广西": "guangxi",
        "内蒙古": "neimenggu",
        "宁夏": "ningxia",
        "西藏": "xizang",
        "北京": "beijing",
        "天津": "tianjin",
        "上海": "shanghai",
        "重庆": "chongqing",
        "香港": "xianggang",
        "澳门": "aomen"
    };
    return obj[mapName];
}