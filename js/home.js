layui.config({
	base: '../layuiadmin/' //静态资源所在路径
}).extend({
	index: 'lib/index' //主入口模块
}).use('index');


if (localStorage.user) {
	var userInfo = JSON.parse(localStorage.user);
	var user = userInfo.username;
	$('#user').empty();
	$('#user').append(user);
	var menu = userInfo.left;
	var str = '';

	for (var i in menu) {
		var fu = menu[i];
		var sfu = `<div class="f-level"><span class="f-level-name">` + fu.title + `</span></div>`;

		var szi = '';
		for (var j in fu.data) {
			var zi = fu.data[j];
			szi += `<div class="s-level" lay-href=` + zi.url + `><i class="` + zi.icon + `"></i><span class="s-level-name">` +
				zi.title + `</span></div>`;
		}
		str += `<div class="each-navigation">` + sfu + szi + `</div>`;
	}

	var first = menu[0].data[0].url;
	$('.layadmin-iframe').attr('src', first)
	$('#navigation').empty();
	$('#navigation').append(str)
	NavigationClick();
}else{
	layer.alert('请登录',function(){
		window.location.href = './login.html';
	})
}

function NavigationClick() {
	//二级菜单 目前只有2级菜单能点击
	$($('.s-level')[0]).addClass('sLevelwordClick');
	$('.s-level').unbind('click').bind('click', function(e) {
		$('.s-level.sLevelwordClick').removeClass('sLevelwordClick');
		$(e.currentTarget).addClass('sLevelwordClick');
		// if ($(e.currentTarget).attr('lay-href')) { //检测到如果URL不为空 即可跳转
		// 	$('#l-b-content').load($(e.currentTarget).attr('lay-href'));
		// }
	});
}


function logout() {
	localStorage.removeItem('user');
	window.location.href = './login.html';
}
