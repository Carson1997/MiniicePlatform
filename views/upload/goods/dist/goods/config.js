var head = 'http://' + window.location.host;
// head = 'http://' + '192.168.1.20';
// head = 'http://' + '219.128.102.76:808';

// var platform = '/thinkphp/Platform';
var platform = '/thinkphp/MiniicePlatform';

// 商品销售
// 店铺时间段和店铺ID 1淘宝 2京东 3苏宁 4猫宁 
var url_shop = head + platform + '/shop/shop';
//日期选择
var url_shop_select = head + platform + '/Shop/select';
//商品明细
var url_shop_detail = head + platform + '/SellPro/ProDetails';
//商品分析
var url_shop_analysis = head + platform + '/SellPro/analysis';
//商品名
var url_goods = head + platform + '/SellPro/select_prd';
//平台分析
var url_pla = head + platform + '/PlatformAnalysis/select';


//淘系来源
//店铺来源
var url_taoxi_shop_source = head + platform + '/TaobaoFlow/shop';
//商品来源明细
var url_taoxi_source_detail = head + platform + '/TaobaoFlow/prd_details';
//商品来源分析
var url_taoxi_source_analysis = head + platform + '/TaobaoFlow/prd_analysis';
//淘宝商品
var url_taoxi_goods = head + platform + '/TaobaoFlow/select_prd';

//京东来源
//京东来源
var url_jd_source = head + platform + '/JdFlow/brand';
//京东来源明细
var url_jd_source_detail = head + platform + '/JdFlow/prd_details';
//京东商品
var url_jd_goods = head + platform + '/JdFlow/select_prd';
//京东来源分析
var url_jd_source_analysis = head + platform + '/JdFlow/prd_analysis';


//苏宁来源
//店铺来源
var url_sn_shop_source = head + platform + '/SunningFlow/shop';
//商品明细
var url_sn_source_detail = head + platform + '/SunningFlow/prd_details';
//苏宁商品
var url_sn_goods = head + platform + '/SunningFlow/select_prd';
//商品分析
var url_sn_source_analysis = head + platform + '/SunningFlow/prd_analysis';

//竞品
//竞品明细
//销售明细
var url_jp_sellDetail = head + platform + '/CompetitorFlow/saledetails';
//流量明细
var url_jp_flowDetail = head + platform + '/CompetitorFlow/flowdetails';
//商品
var url_jp_goods = head + platform + '/CompetitorFlow/myprd';
//竞品分析
var url_jp_flowAnalysis = head + platform + '/CompetitorFlow/competitoranalysis';

//登录
var url_login = head + platform + '/login/index';

//用户列表
var url_userList = head + platform + '/login/user';
//用户添加，设置菜单列表
var url_userMeunList = head + platform + '/login/user_leftnav';
//用户添加更新
var url_userUpdate = head + platform + '/login/user_add_update';
//菜单设置,添加
var url_menuSet = head + platform  + '/login/leftnav_add_update';


//店铺设置
//查询店铺
var url_shop_list = head + platform + '/Shop/select_shop';
//添加店铺
var url_shop_add = head + platform + '/Shop/add';
//更新店铺
var url_shop_update = head + platform + '/Shop/update_shop';
//查询目标
var url_shopTarList = head + platform + '/Shop/shop_target';
//添加目标
var url_shopTarAdd = head + platform + '/Shop/add_target';
//更新目标
var url_shopTarUpdate = head + platform + '/Shop/update_target';
//删除目标
var url_shopTarDelete = head + platform + '/Shop/delect_target';

//excel列表
var url_uploadList = head + platform + '/Data/excel';
var url_dataRun = head + platform + '/Data/run';
//我的商品
var url_proSelect = head + platform + '/pro/select';
//竞品
var url_jpGoods = head + platform + '/pro/select_competitor';




function checkStatus(obj, success, fail, next) {
	if (obj.status == '0') {
		if (typeof(success) == 'function') {
			success();
		}
	}
	if (obj.status == '1') {
		if (typeof(fail) == 'function') {
			fail();
		}
		if (obj.info != '') {
			layer.alert(obj.info)
		}
	}
	if (obj.status == '2') {
		if (typeof(next) == 'function') {
			next();
		}
		if (obj.info != '') {
			layer.alert(obj.info, function() {
				if (obj.url == '') {
					parent.location.reload();
				}
			})
		}
		if (obj.url != '') {
			parent.location.href = obj.url;
		}
	}
}

function changePlatform(id) {
	if (id == 1) {
		return '淘宝'
	}
	if (id == 2) {
		return '京东'
	}
	if (id == 3) {
		return '苏宁'
	}
	if (id == 4) {
		return '猫宁'
	}
}

function changeShopName(id, data) {
	var name;
	data.forEach(function(item) {
		if (item.id == id) {
			name = item.name;
		}
	})
	return name;
}


function changeSum(arg1, arg2) {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length
	} catch (e) {
		r1 = 0
	}
	try {
		r2 = arg2.toString().split(".")[1].length
	} catch (e) {
		r2 = 0
	}
	m = Math.pow(10, Math.max(r1, r2));
	n = (r1 >= r2) ? r1 : r2;
	return ((arg1 * m + arg2 * m) / m).toFixed(2);
}


function changeChu(a, b) {
	if (a == 0 || b == 0) {
		return 0;
	} else {
		return (parseFloat(a) / parseFloat(b));
	}
}


// 客单价：支付金额÷支付人数（结果四舍五入取整）
// 件单价：支付金额÷支付件数（结果四舍五入取整）
// 支付转化率：  支付人数÷访客数   （结果四舍五入 显示百分比至后两位小数）

function changeFuZi(str, data, jd) {
	var arr = [];
	for (var i in data) {
		var d = data[i];
		var pla = i;
		if (pla == '') {
			pla = '其他'
		}
		d.sort(function(a, b) {
			if(jd ==2){
				return b.transactions_amt - a.transactions_amt;
			}
			return b.payment_amt - a.payment_amt;
		})
		var a = {
			name: pla,
			data: d,
			pla: pla,
			showZi: true
		}
		a.payment_amt = 0;
		a.payment_qty = 0;
		a.visitors = 0;
		a.shopping_cart_qty = 0;
		a.payment_buyers_qty = 0;
		a.pay_conversion_rate = 0;
		a.customer_price = 0;
		a.unit_price = 0;
		a.transactions_amt = 0;
		a.transactions_qty = 0;
		a.shopping_cart = 0;
		a.payment_collect_qty = 0;
		var data1 = [];
		for (var j in d) {
			var tar = d[j][str];
			if (tar == '') {
				tar = '其它'
			}
			if (data1.hasOwnProperty(tar) == false) {
				data1[tar] = [];
			}
			data1[tar].push(d[j]);

			var d2 = d[j];
			a.payment_amt = changeSum(a.payment_amt, d2.payment_amt);
			a.payment_qty = changeSum(a.payment_qty, d2.payment_qty);
			a.visitors = changeSum(a.visitors, d2.visitors);
			a.shopping_cart_qty = changeSum(a.shopping_cart_qty, d2.shopping_cart_qty);
			a.payment_buyers_qty = changeSum(a.payment_buyers_qty, d2.payment_buyers_qty);
			if (jd ==2 ) {
				a.transactions_amt = changeSum(a.transactions_amt, d2.transactions_amt);
				a.transactions_qty = changeSum(a.transactions_qty, d2.transactions_qty);
				a.shopping_cart = changeSum(a.shopping_cart, d2.shopping_cart);
			}
			if(jd ==3){
				a.payment_collect_qty = changeSum(a.payment_collect_qty, d2.payment_collect_qty);
			}
		}
		a.pay_conversion_rate = (changeChu(a.payment_buyers_qty, a.visitors) * 100).toFixed(2);
		a.customer_price = changeChu(a.payment_amt, a.payment_buyers_qty).toFixed(0);
		a.unit_price = changeChu(a.payment_amt, a.payment_qty).toFixed(0);
		if (jd ==2 ) {
			a.customer_price = changeChu(a.transactions_amt, a.transactions_qty).toFixed(0);
		}
		if(jd ==3){
			a.pay_conversion_rate = (changeChu(a.payment_collect_qty, a.visitors) * 100).toFixed(2);
			a.customer_price = changeChu(a.payment_amt, a.payment_collect_qty).toFixed(0);
		}
		arr.push(a);
	}

	//排序父类
	arr.sort(function(a, b) {
		if(jd ==2 ){
			return b.transactions_amt - a.transactions_amt;
		}
		return b.payment_amt - a.payment_amt;
	})

	var new_arr = [];
	for (var y in arr) {
		var d = arr[y].data;
		var pla = arr[y].pla;
		new_arr.push(arr[y]);

		var data1 = [];
		for (var j in d) {
			var tar = d[j][str];
			if (tar == '') {
				tar = '其它'
			}
			if (data1.hasOwnProperty(tar) == false) {
				data1[tar] = [];
			}
			data1[tar].push(d[j]);
		}

		for (var k in data1) {
			var d1 = data1[k];
			var s = {
				name: k,
				data: d1,
				parent_pla: pla
			}
			if (str == 'platform') {
				s.name = changePlatform(k);
			}
			s.payment_amt = 0;
			s.payment_qty = 0;
			s.visitors = 0;
			s.shopping_cart_qty = 0;
			s.payment_buyers_qty = 0;
			s.pay_conversion_rate = 0;
			s.customer_price = 0;
			s.unit_price = 0;
			s.transactions_amt = 0;
			s.transactions_qty = 0;
			s.shopping_cart = 0;
			s.payment_collect_qty = 0;
			for (var n in d1) {
				var d3 = d1[n];
				s.payment_amt = changeSum(s.payment_amt, d3.payment_amt);
				s.payment_qty = changeSum(s.payment_qty, d3.payment_qty);
				s.visitors = changeSum(s.visitors, d3.visitors);
				s.shopping_cart_qty = changeSum(s.shopping_cart_qty, d3.shopping_cart_qty);
				s.payment_buyers_qty = changeSum(s.payment_buyers_qty, d3.payment_buyers_qty);
				if (jd ==2 ) {
					s.transactions_amt = changeSum(s.transactions_amt, d3.transactions_amt);
					s.transactions_qty = changeSum(s.transactions_qty, d3.transactions_qty);
					s.shopping_cart = changeSum(s.shopping_cart, d3.shopping_cart);
				}
				if(jd ==3){
					s.payment_collect_qty = changeSum(s.payment_collect_qty, d3.payment_collect_qty);
				}
			}
			s.pay_conversion_rate = (changeChu(s.payment_buyers_qty, s.visitors) * 100).toFixed(2);
			s.customer_price = changeChu(s.payment_amt, s.payment_buyers_qty).toFixed(0);
			s.unit_price = changeChu(s.payment_amt, s.payment_qty).toFixed(0);
			if (jd ==2 ) {
				s.customer_price = changeChu(s.transactions_amt, s.transactions_qty).toFixed(0);
			}
			if (jd ==3 ) {
				s.pay_conversion_rate = (changeChu(s.payment_collect_qty, s.visitors) * 100).toFixed(2);
				s.customer_price = changeChu(s.payment_amt, s.payment_collect_qty).toFixed(0);
			}
			new_arr.push(s)
		}
	}
	return new_arr;
}

function getTotal(data, arr, jd) {
	arr.payment_amt = 0;
	arr.payment_qty = 0;
	arr.visitors = 0;
	arr.shopping_cart_qty = 0;
	arr.payment_buyers_qty = 0;
	arr.pay_conversion_rate = 0;
	arr.customer_price = 0;
	arr.unit_price = 0;
	arr.transactions_amt = 0;
	arr.transactions_qty = 0;
	arr.shopping_cart = 0;
	arr.payment_collect_qty =0;
	for (var i in data) {
		var d1 = data[i];
		for (var j in d1) {
			var d2 = d1[j];
			arr.payment_amt = changeSum(arr.payment_amt, d2.payment_amt);
			arr.payment_qty = changeSum(arr.payment_qty, d2.payment_qty);
			arr.visitors = changeSum(arr.visitors, d2.visitors);
			arr.shopping_cart_qty = changeSum(arr.shopping_cart_qty, d2.shopping_cart_qty);
			arr.payment_buyers_qty = changeSum(arr.payment_buyers_qty, d2.payment_buyers_qty);
			if (jd ==2 ) {
				arr.transactions_amt = changeSum(arr.transactions_amt, d2.transactions_amt);
				arr.transactions_qty = changeSum(arr.transactions_qty, d2.transactions_qty);
				arr.shopping_cart = changeSum(arr.shopping_cart, d2.shopping_cart);
			}
			if(jd ==3){
				arr.pay_conversion_rate = (changeChu(arr.payment_collect_qty, d2.visitors) * 100).toFixed(2);
				arr.payment_collect_qty = changeSum(arr.payment_collect_qty, d2.payment_collect_qty);
			}
		}
	}
	arr.pay_conversion_rate = (changeChu(arr.payment_buyers_qty, arr.visitors) * 100).toFixed(2);
	arr.customer_price = changeChu(arr.payment_amt, arr.payment_buyers_qty).toFixed(0);
	arr.unit_price = changeChu(arr.payment_amt, arr.payment_qty).toFixed(0);
	if (jd ==2 ) {
		arr.customer_price = changeChu(arr.transactions_amt, arr.transactions_qty).toFixed(0);
	}
	if(jd == 3){
		arr.pay_conversion_rate = (changeChu(arr.payment_collect_qty, arr.visitors) * 100).toFixed(2);
		arr.customer_price = changeChu(arr.payment_amt, arr.payment_collect_qty).toFixed(0);
	}
	return arr;
}


function changeTar(str) {
	var t = '';
	if (str == 'payment_amt' || str == 'transactions_amt') {
		t = '支付金额'
	}
	if (str == 'visitors') {
		t = '访客数'
	}
	if (str == 'shopping_cart_qty' || str == 'shopping_cart') {
		t = '加购人数'
	}
	if (str == 'payment_buyers_qty'  || str == 'transactions_qty') {
		t = '支付买家数'
	}
	if (str == 'pay_conversion_rate') {
		t = '支付转化率'
	}
	if (str == 'customer_price') {
		t = '客单价'
	}
	return t;
}

function getDateTotal(data, str,jd) {
	var data_arr = ['合计'];
	for (var i in data) {
		var d1 = data[i];
		var arr = {};
		arr.payment_amt = 0;
		arr.payment_qty = 0;
		arr.visitors = 0;
		arr.shopping_cart_qty = 0;
		arr.payment_buyers_qty = 0;
		arr.pay_conversion_rate = 0;
		arr.customer_price = 0;
		arr.unit_price = 0;
		arr.transactions_amt = 0;
		arr.transactions_qty = 0;
		arr.shopping_cart = 0;
		for (var j in d1) {
			var d2 = d1[j];
			arr.payment_amt = changeSum(arr.payment_amt, d2.payment_amt);
			arr.payment_qty = changeSum(arr.payment_qty, d2.payment_qty);
			arr.visitors = changeSum(arr.visitors, d2.visitors);
			arr.shopping_cart_qty = changeSum(arr.shopping_cart_qty, d2.shopping_cart_qty);
			arr.payment_buyers_qty = changeSum(arr.payment_buyers_qty, d2.payment_buyers_qty);
			if (jd ==2 ) {
				arr.transactions_amt = changeSum(arr.transactions_amt, d2.transactions_amt);
				arr.transactions_qty = changeSum(arr.transactions_qty, d2.transactions_qty);
				arr.shopping_cart = changeSum(arr.shopping_cart, d2.shopping_cart);
			}
		}
		arr.pay_conversion_rate = (changeChu(arr.payment_buyers_qty, arr.visitors) * 100).toFixed(2);
		arr.customer_price = changeChu(arr.payment_amt, arr.payment_buyers_qty).toFixed(0);
		arr.unit_price = changeChu(arr.payment_amt, arr.payment_qty).toFixed(0);
		if (jd ==2 ) {
			arr.customer_price = changeChu(arr.transactions_amt, arr.transactions_qty).toFixed(0);
		}
		data_arr.push(arr[str])
	}
	return data_arr;
}
