window.onload=function(){
	//小能
	(function(){

		
		//详情页面
		var oBtn1=$('.custom-service');
		var oBtn2=$('.price>div>p');
		oBtn1.on('click',function(){
			console.log('调用小能开始');
			custom();
			console.log('调用小能结束');
		});
		oBtn2.on('click',function(){
			console.log('调用小能开始');
			custom();
			console.log('调用小能结束');
		});

		//商品列表
		// var aBtn=$('.contact');
		// aBtn.forEach(function(item,index){
		// 	$(item).on('click',function(){
		// 		console.log('调用小能开始');
		// 		custom();
		// 		console.log('调用小能结束');
		// 	});
		// });

		//定制详情
		var oServer=$('.server');
		oServer.on('click',function(){
			console.log('调用小能开始');
			custom();
			console.log('调用小能结束');
		});

		//个人中心
		var oCenter=$('.center-server');
		oCenter.on('click',function(){
			console.log('调用小能开始');
			custom();
			console.log('调用小能结束');
		});
		
		function custom(){
			console.log('调用小能中');
			var vipNo=sessionStorage.getItem("vipNo");
			var nickname=sessionStorage.getItem("nickname");

			if(!parseInt(vipNo)){
				vipNo='';
			}

			if(!nickname){
				nickname='';
			}

			NTKF_PARAM = {
				siteid:"kf_9529",                           //企业ID，为固定值，必填
				settingid:"kf_9529_1489472556188",    //接待组ID，为固定值，必填
				uid:vipNo,                             //会员编号//用户ID，未登录可以为空，但不能给null，uid赋予的值显示到小能客户端上
				uname:nickname,                      //用户昵称//用户名，未登录可以为空，但不能给null，uname赋予的值显示到小能客户端上
				isvip:"0",                          //是否为vip用户，0代表非会员，1代表会员，取值显示到小能客户端上
				userlevel:"0",                           //网站自定义会员级别，0-N，可根据选择判断，取值显示到小能客户端上
				erpparam:""                      //erpparam为erp功能的扩展字段，可选，购买erp功能后用于erp功能集成
			}

			NTKF.im_openInPageChat('kf_9529_1489472556188');
		}
	})();
};