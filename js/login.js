var form = layui.form;
form.render()

form.on('submit(su)', function(data) {
	var inp = form.val('myform');
	for(var  i in inp){
		var d = inp[i]
		if(i  == 'password'){
			inp[i] = hex_md5(d)
		}
	}

	$.ajax({
		type: 'post',
		dataType: 'json',
		url: url_login,
		// url:url_shop,
		data: inp,
		timeout: 10000,
		success: function(obj) {
			// console.log(obj)
			// return
			function ok() {
				localStorage.user = JSON.stringify(obj.data)
				window.location.href = './home.html';
			}
			checkStatus(obj, ok);
		},
		error: function() {
			layer.alert('请求错误');
		}
	});

	return false;
});

/* function login() {
	var yh = $('#inp1').val();
	if (yh == '') {
		layer.alert('请输入用户名')
		return false
	}
	var mi = $('#inp2').val();
	if (mi == '') {
		layer.alert('请输入密码')
		return false
	}

	$.ajax({
		type: 'post',
		dataType: 'json',
		url: url_login,
		data: {
			username: yh,
			password: mi
		},
		timeout: 10000,
		success: function(obj) {
			function ok() {
				window.location.href = 'menu.html';
			}
			checkStatus2(obj, ok);
		},
		error: function() {
			layer.alert('请求错误');
		}
	});
} */

// $(document).keypress(function(e) {
// 	if (e.keyCode == 13) {
// 		// login()
// 		$('#login').click();
// 	}
// });
