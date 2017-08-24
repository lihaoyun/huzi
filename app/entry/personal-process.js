import '../css/public.css';
import '../css/personal-process.css';
import $ from 'jquery';
import apiUrl from '../js/config';
import {rand,signName,reTop,tabBar,findArrIndex,imgLazy,setSto,getSto,cartCount,rmSto,allSto} from '../js/config';
import md5 from 'md5';
var vipNo=getSto('vipNo');
var token=getSto('token');
//获取购物车数量
cartCount($('.func-public em'));
//初始化商品参数
(function(){
	setSto('goods-style','');
	setSto('goods-size','');
	setSto('goods-material','');
	setSto('style','');
	setSto('size','');
	setSto('material','');
	setSto('order-money','');
	setSto('letter-words','');
})();

//定制商品布局
(function(){
	var oMaterialCon=$('.material');//材质容器
	var oSizeCon=$('.size');//尺寸容器
	var oNecklace=$('.necklace');//项链按钮
	var oBrooch=$('.brooch');//胸针按钮
	var oEarring=$('.earring');//耳环按钮
	var aStyleImg=$('.style img');//款式的图片
	var sStyle='';
	var sMaterial='';
	var sSize='';
	var goodsStyle='';
	var goodsMaterial='';
	var goodsSize='';
	var oMoney=$('.price p span');
	//点击项链
	oNecklace.on('click',function(){
		sStyle=$(this).get(0).dataset.model;
		goodsStyle=$(this).find('p').text();
		setSto("style",sStyle);
		setSto("size",'');
		setSto("material",'');
		setSto("goods-style",goodsStyle);

		var type=$(oNecklace).get(0).dataset.type;
		showMaterial(type);
		showSize(type,'silver');
		changeStyle($('.style>div'));
		//$(oNecklace).find('img').get(0).src=require('../imgs/necklace-copy.png');
		$(oNecklace).addClass('active');
		showImgLayer('价格计算中');
		$.ajax({
			url:apiUrl+'/customization/price?style='+sStyle+'&material='+sessionStorage.getItem("material")+'&size='+sessionStorage.getItem("size"),
			success:function(data){
				if(data.head.code){
					console.log('数据返回错误！');
					return;
				}
				$(oMoney).html(data.body.money);
				setSto('order-money',data.body.money);
				cancelImgLayer();
			},
			error:function(err){
				console.log(err);
			}
		});
	});
	//点击胸针
	oBrooch.on('click',function(){
		sStyle=$(this).get(0).dataset.model;
		goodsStyle=$(this).find('p').text();
		setSto("style",sStyle);
		setSto("size",'');
		setSto("goods-style",goodsStyle);
		setSto("material","CZ-YIN-01");

		setSto('goods-material','925银');
		var type=$(oBrooch).get(0).dataset.type;
		showMaterial(type);
		changeStyle($('.style>div'));
		//$(oBrooch).find('img').get(0).src=require('../imgs/brooch-copy.png');
		console.log('oBrooch:',$(oBrooch));
		$(oBrooch).addClass('active');
		showImgLayer('价格计算中');
		$.ajax({
			url:apiUrl+'/customization/price?style='+sStyle+'&material='+sessionStorage.getItem("material")+'&size='+sessionStorage.getItem("size"),
			success:function(data){
				if(data.head.code){
					console.log('数据返回错误！');
					return;
				}
				$(oMoney).html(data.body.money);
				setSto('order-money',data.body.money);
				cancelImgLayer();
			},
			error:function(err){
				console.log(err);
			}
		});
	});
	//点击耳环
	oEarring.on('click',function(){
		sStyle=$(this).get(0).dataset.model;
		goodsStyle=$(this).find('p').text();
		setSto("style",sStyle);
		setSto("goods-style",goodsStyle);
		setSto("material","CZ-YIN-01");
		setSto("size","CC-S");


		setSto('goods-size','S 1*1cm');
		setSto('goods-material','925银');
		var type=$(oEarring).get(0).dataset.type;
		showMaterial(type);
		changeStyle($('.style>div'));
		//$(oEarring).find('img').get(0).src=require('../imgs/earring-copy.png');
		$(oEarring).addClass('active');
		showImgLayer('价格计算中');
		$.ajax({
			url:apiUrl+'/customization/price?style='+sStyle+'&material='+sessionStorage.getItem("material")+'&size='+sessionStorage.getItem("size"),
			success:function(data){
				if(data.head.code){
					console.log('数据返回错误！');
					return;
				}
				$(oMoney).html(data.body.money);
				setSto('order-money',data.body.money);
				cancelImgLayer();
			},
			error:function(err){
				console.log(err);
			}
		});
	});

	//显示材质函数
	function showMaterial(type){
		var str='';
		if(type=='necklace'){
			str+='<div class="silver" data-type="'+type+'" data-material="silver" data-model="CZ-YIN-01"><p>925银</p></div>';
            str+='<div class="gold" data-type="'+type+'" data-material="gold" class="block gold" data-model="CZ-18KJ-01"><p class="">18k金(玫瑰金)</p></div><span></span>';
           
		}else if(type=='brooch'){
			str+='<div class="silver active" data-type="'+type+'" data-material="silver" data-model="CZ-YIN-01"><p>925银</p></div>';
			
		}else if(type=='earring'){
			str+='<div class="silver active" data-type="'+type+'" data-material="silver" data-model="CZ-YIN-01"><p>925银</p></div>';
			
		}
		$(oMaterialCon).html(str);

		var oSilver=$('.silver');//银按钮
		var oGold=$('.gold');//金按钮

		//选择银时
		oSilver.on('click',function(){
			sMaterial=$(this).get(0).dataset.model;
			goodsMaterial=$(this).find('p').text();
			setSto("material",sMaterial);
			setSto("goods-material",goodsMaterial);
			setSto('goods-material','925银');
			setSto("size",'')
			var material=$(oSilver).get(0).dataset.material;
			var aMaterialImg=$('.material img');//材质的图片
			showSize(type,material);
			//changeMaterial(aMaterialImg);

			var aSizelImg=$('.size img');//材质的图片
			//specialChangeSize(aSizelImg,type,'silver');
			//$(oSilver).find('img').get(0).src=require('../imgs/block-copy.png');
			$(oSilver).addClass('active');
			$('.gold p').text('18k金(玫瑰金)');
			showImgLayer('价格计算中');
			$.ajax({
				url:apiUrl+'/customization/price?style='+sStyle+'&material='+sessionStorage.getItem("material")+'&size='+sessionStorage.getItem("size"),
				success:function(data){
					if(data.head.code){
						console.log('数据返回错误！');
						return;
					}
					$(oMoney).html(data.body.money);
					setSto('order-money',data.body.money);
					cancelImgLayer();
				},
				error:function(err){
					console.log(err);
				}
			});
		});

		var oPactity=$('.material-more');
		oGold.on('click',function(){

			sMaterial=$(this).get(0).dataset.model;
			goodsMaterial=$(this).find('p').text();
			setSto("material",sMaterial);
			setSto("goods-material",goodsMaterial);
			setSto('goods-material',$(oGold).find('p').text());
			setSto("size",""),
			$(oPactity).css('display','block');
			setTimeout(function(){
				$(oPactity).css('opacity',1);
			},50);
			
			$.ajax({
				url:apiUrl+'/customization/price?style='+sStyle+'&material='+sessionStorage.getItem("material")+'&size='+sessionStorage.getItem("size"),
				success:function(data){
					if(data.head.code){
						console.log('数据返回错误！');
						return;
					}
					$(oMoney).html(data.body.money);
					setSto('order-money',data.body.money);
					
				},
				error:function(err){
					console.log(err);
				}
			});
		});

		//选择项链时的黄金材质时的颜色
		var aColor=$('.material-more li');
		aColor.each(function(index,item){
			$(item).on('click',function(){
				var oGold=$('.gold');//金按钮
					var material=$(oGold).get(0).dataset.material;
					$('.gold p').text($(item).text());
					showSize('necklace',material);
					//changeMaterial(aMaterialImg);
					//specialChangeSize(aSizelImg,type,material);
					//$(oGold).find('img').get(0).src=require('../imgs/block-copy.png');
					$(oGold).addClass('active');

				$(oPactity).css('opacity',0);
				setTimeout(function(){
					$(oPactity).css('display','none');
				},500);
			});
		});

		//如果选择款式时是胸针或耳环时直接显示出材质和尺寸项
		if(type=='brooch'){
			showSize('brooch','silver');
			var aMaterialImg=$('.material img');//材质的图片
			
			//changeMaterial(aMaterialImg);
			var aSizelImg=$('.size img');//材质的图片
			//specialChangeSize(aSizelImg,type,'silver');
			//$(oSilver).find('img').get(0).src=require('../imgs/block-copy.png');
			$(oSilver).addClass('active');
		}else if(type=='earring'){
			showSize('earring','silver');
			var aMaterialImg=$('.material img');//材质的图片
			//changeMaterial(aMaterialImg);
			//$(oSilver).find('img').get(0).src=require('../imgs/block-copy.png');
			$(oSilver).addClass('active');
		}
	}
	//显示尺寸函数
	function showSize(type,material){
		var str='';
		if(type=='necklace'&&material=='silver'){
			str+='<div class="small" data-model="CC-S"><p>2*1.2cm</p></div>';
            str+='<div class="middle" data-model="CC-M"><p>3*1.9cm</p></div>';
            str+='<div class="large" data-model="CC-L"><p>3.5*2.2cm</p></div>';
            console.log(type);
		}else if(type=='necklace'&&material=='gold'){
			str+='<div class="small" data-model="CC-S"><p>1.5*1cm</p></div>';
            str+='<div class="large" data-model="CC-L"><p>2*1.5cm</p></div>';
            
		}else if(type=='brooch'&&material=='silver'){
			str+='<div class="small" data-model="CC-S"><p>3*2.5cm</p></div>';
            str+='<div class="large" data-model="CC-L"><p>4*3cm</p></div>';
            
		}else if(type=='earring'&&material=='silver'){
			str+='<div class="small" data-model="CC-S"><p>1*1cm</p></div>';
            
		}
		$(oSizeCon).html(str);
		var aSizelImg=$('.size img');//材质的图片
		var oS=$('.small');//小尺寸按钮
		var oM=$('.middle');//小尺寸按钮
		var oL=$('.large');//小尺寸按钮
		changeSize(aSizelImg);
		if(type=='earring'){
			//$(oS).find('img').get(0).src=require('../imgs/s-copy.png');
			$(oS).addClass('active');
		}

		oS.on('click',function(){

			sSize=$(this).get(0).dataset.model;
			goodsSize=$(this).find('p').text();
			setSto("size",sSize);
			setSto("goods-size",'S '+goodsSize);
			//specialChangeSize(aSizelImg,type,material);
			//$(oS).find('img').get(0).src=require('../imgs/s-copy.png');
			$(oS).addClass('active');
			showImgLayer('价格计算中');
			$.ajax({
				url:apiUrl+'/customization/price?style='+sStyle+'&material='+sessionStorage.getItem("material")+'&size='+sessionStorage.getItem("size"),
				success:function(data){
					if(data.head.code){
						console.log('数据返回错误！');
						return;
					}
					$(oMoney).html(data.body.money);
					setSto('order-money',data.body.money);
					cancelImgLayer();
				},
				error:function(err){
					console.log(err);
				}
			});
		});
		oM.on('click',function(){

			sSize=$(this).get(0).dataset.model;
			goodsSize=$(this).find('p').text();
			setSto("size",sSize);
			setSto("goods-size",'M '+goodsSize);

			//specialChangeSize(aSizelImg,type,material);
			//$(oM).find('img').get(0).src=require('../imgs/m-copy.png');
			$(oM).addClass('active');
			showImgLayer('价格计算中');
			$.ajax({
				url:apiUrl+'/customization/price?style='+sStyle+'&material='+sessionStorage.getItem("material")+'&size='+sessionStorage.getItem("size"),
				success:function(data){
					if(data.head.code){
						console.log('数据返回错误！');
						return;
					}
					$(oMoney).html(data.body.money);
					setSto('order-money',data.body.money);
					cancelImgLayer();
				},
				error:function(err){
					console.log(err);
				}
			});
		});
		oL.on('click',function(){

			sSize=$(this).get(0).dataset.model;
			goodsSize=$(this).find('p').text();
			setSto("size",sSize);
			setSto("goods-size",'L '+goodsSize);

			//specialChangeSize(aSizelImg,type,material);
			//$(oL).find('img').get(0).src=require('../imgs/l-copy.png');
			$(oL).addClass('active');
			showImgLayer('价格计算中');
			$.ajax({
				url:apiUrl+'/customization/price?style='+sStyle+'&material='+sessionStorage.getItem("material")+'&size='+sessionStorage.getItem("size"),
				success:function(data){
					if(data.head.code){
						console.log('数据返回错误！');
						return;
					}
					$(oMoney).html(data.body.money);
					setSto('order-money',data.body.money);
					cancelImgLayer();
				},
				error:function(err){
					console.log(err);
				}
			});
		});
	}

	//选择款式样式
	function changeStyle(aItem){
		//aImg[0].src=require('../imgs/necklace.png');
		//aImg[1].src=require('../imgs/brooch.png');
		//aImg[2].src=require('../imgs/earring.png');
		aItem.each(function(index,item){
			$(item).removeClass('active');
		});
	}
	//选择材质样式
	function changeMaterial(aImg){
		//aImg[0].src=require('../imgs/block.png');
		// aImg.each(function(index,item){
		// 	aImg[index].src=require('../imgs/block.png');
		// 	$(item).next('p').removeClass('active');
		// });
	}
	//选择尺寸样式
	function changeSize(aImg){
		// aImg[0].src=require('../imgs/s.png');
		// if(aImg[1]){
		// 	aImg[1].src=require('../imgs/m.png');
		// }
		// if(aImg[2]){
		// 	aImg[2].src=require('../imgs/l.png');
		// }
		// aImg.each(function(index,item){
		// 	$(item).next('p').removeClass('active');
		// });
	}
	//项链胸针时的选择尺寸样式
	function specialChangeSize(aImg,type,material){
		if(type=='necklace'&&material=='gold'){
			//aImg[0].src=require('../imgs/s.png');
			//aImg[1].src=require('../imgs/l.png');
		}else if(type=='brooch'&&material=='silver'){
			//aImg[0].src=require('../imgs/s.png');
			//aImg[1].src=require('../imgs/l.png');
		}else{
			//aImg[0].src=require('../imgs/s.png');
			if(aImg[1]){
				//aImg[1].src=require('../imgs/m.png');
			}
			if(aImg[2]){
				//aImg[2].src=require('../imgs/l.png');
			}
			aImg.each(function(index,item){
				$(item).next('p').removeClass('active');
			});
		}
		aImg.each(function(index,item){
			$(item).next('p').removeClass('active');
		});
	}
})();

//弹出选择层
(function(){
	var oProtocol=$('.protocol>p>span');
	var oBtn=$('.custom-btn img');
	//var oClose=$('.close');
	var oWrap=$('.order-con-opacity');
	var iBtn=true;

	oBtn.on('click',function(){
		if(!iBtn){
			return;
		}
		oWrap.css('display','block');
		setTimeout(function(){
			oWrap.css('opacity',1);
		},50);
	});
	// oClose.on('click',function(){
	// 	oWrap.css('opacity',0);
	// 	setTimeout(function(){
	// 		oWrap.css('display','none');
	// 	},600);
	// });
})();

//选择照片及显示
(function(){
	var oBtn=$('.upload');
	oBtn.on('change',function(){
		var file =this.files[0];
		var reader = new FileReader();
		reader.onload = function(e){
			$('.upload-photo>.upload-btn>img').attr('src',e.target.result);
			//$('.upload-photo>.upload-con>textarea').css('display','block');
			//$('.upload-photo>.upload-btn>p').css('display','none');
		} 
		reader.readAsDataURL(file);
	});
})();


//选择照片及显示及上传
(function(){
	sessionStorage.setItem("picUrl","");
	var oBtn=$('.upload-photo>.upload-con>input');
	

	oBtn.on('change',function(){
		var oMyForm = new FormData();
		var file =this.files[0];

		var reader = new FileReader();
		reader.onload = function(e){
			//$('.list>li>i>img').attr('src',e.target.result);
			//图片上传中显示提示层
			showImgLayer('图片提交中,请耐心等待');

			rmSto('picUrl');
			oMyForm.append('test',file);
			$.ajax({
				type:'post',
				url:apiUrl+'/pic/upload',
				data:oMyForm,
				processData : false,
	            contentType : false,  
				success:function(data){
					if(!data.head.code){
						setSto('picUrl',data.body.avatar);
						//图片上传成功后隐藏提示层

						cancelImgLayer();
						return;
					}else{
						cancelImgLayer();
						setTimeout(function(){
							alert(data.head.message);
						},600);
						
					}
				},
				error:function(err){
					cancelImgLayer('连接错误！');
					console.log(err);
				}
			});
		} 
		reader.readAsDataURL(file);
	});
})();

function showImgLayer(str){
	var oImg=$('.circle');	
	$(oImg).find('p').text(str);
	$(oImg).css('display','block');
	setTimeout(function(){
		$(oImg).css('opacity',1);
	},50);
}
function cancelImgLayer(){
	var oImg=$('.circle');	
	$(oImg).css('opacity',0);
	setTimeout(function(){
		$(oImg).css('display','none');
	},500);
}

//提交定制
(function(){
	var oBtn=$('.price button');
	var oFile=$('.upload-photo>.upload-con>input');
	var oText=$('.words>input');
	var oComment=$('.remarks input');
	var reg=/^((https|http|ftp|rtsp|mms)?:\/\/)/;
	var reg1=/^[a-zA-Z\u4e00-\u9fa5]{1,20}$/;
	//点击图片选择框的按钮
	oBtn.on('click',function(){
		var picUrl=getSto('picUrl');

		if(!reg.test(picUrl)){
			alert('请选择照片！');
			return;
		}
	//款式的判断，如果没选的话就会提示让选择款式
		if(getSto('style')==''){
			alert('请选择款式');
			return;
		}else if(getSto('material')==''){
			alert('请选择材质');
			return;
		}else if(getSto('size')==''){
			alert('请选择尺寸');
			return;
		}

		if(oText.val().length>7){
			alert('请填写7个以内字符！');
			return;
		}

		// if(oText.val().length!=0&&!reg1.test(oText.val())){
		// 	alert('不能用特殊字符！');
		// 	return;
		// }
		var vipNo=getSto("vipNo");
		setSto("letter-words",oText.val());
		setSto("comment",oComment.val());

		var vipNo=getSto("vipNo");
		var token=getSto("token");
		if(parseInt(vipNo)){
			$.ajax({
				url:apiUrl+'/address/detail/my?memberNo='+vipNo+'&addressId=0',
				headers:signName(md5,vipNo,token),
				success:function(data){
					if(data.head.code){
                                  
		                if(data.head.code==71982){
		                    rmSto('nickname');
		                    rmSto('timestamp');
		                    rmSto('token');
		                    rmSto('vipNo');
		                    alert('出现错误，请重新登录！');
		                    location.href='personal-orders.html';
		                }
		                alert(data.head.message);
		                return;
		            }
					//setSto("addressID",data.body.address.id);

					window.location.href='ok-order.html?from=custom';
				},
				error:function(err){
					console.log(err);
				}
			});
		}else{
			$('.add-new-address').css('display','block');
			//window.location.href='address.html';
		}
	});
})();

//控制最大字符长度为7
(function(){
	var oBtn=$('.words>input');
	var text='';
	oBtn.on('input',function(){
		if($(oBtn).val().length<8){
			text=$(oBtn).val();
			console.log(1);
		}else{
			$(oBtn).val(text);
		}
	});
})();

//选择地区
(function(){
	const provinceArray = new Array("北京市","上海市","天津市","重庆市","河北省","山西省","内蒙古自治区","辽宁省","吉林省","黑龙江省","江苏省","浙江省","安徽省","福建省","江西省","山东省","河南省","湖北省","湖南省","广东省","广西壮族自治区","海南省","四川省","贵州省","云南省","西藏自治区","陕西省","甘肃省","宁夏回族自治区","青海省","新疆维吾尔族自治区","香港特别行政区","澳门特别行政区","台湾省");  
	const cityArray = new Array();   
	cityArray[0] = new Array("北京市","东城区|西城区|崇文区|宣武区|朝阳区|丰台区|石景山区|海淀区|门头沟区|房山区|通州区|顺义区|昌平区|大兴区|平谷区|怀柔区|密云区|延庆区");   
	cityArray[1] = new Array("上海市","黄浦区|卢湾区|徐汇区|长宁区|静安区|普陀区|闸北区|虹口区|杨浦区|闵行区|宝山区|嘉定区|浦东区|金山区|松江区|青浦区|南汇区|奉贤区|崇明区");   
	cityArray[2] = new Array("天津市","和平区|东丽区|河东区|西青区|河西区|津南区|南开区|北辰区|河北区|武清区|红挢区|塘沽区|汉沽区|大港区|宁河区|静海区|宝坻区|蓟县");   
	cityArray[3] = new Array("重庆市","万州区|涪陵区|渝中区|大渡口区|江北区|沙坪坝区|九龙坡区|南岸区|北碚区|万盛区|双挢区|渝北区|巴南区|黔江区|长寿区|綦江区|潼南区|铜梁 区|大足区|荣昌区|壁山区|梁平区|城口区|丰都区|垫江区|武隆区|忠县区|开县区|云阳区|奉节区|巫山区|巫溪区|石柱区|秀山区|酉阳区|彭水区|江津区|合川区|永川区|南川区");   
	cityArray[4] = new Array("河北省","石家庄市|邯郸市|邢台市|保定市|张家口市|承德市|廊坊市|唐山市|秦皇岛市|沧州市|衡水市");   
	cityArray[5] = new Array("山西省","太原市|大同市|阳泉市|长治市|晋城市|朔州市|吕梁市|忻州市|晋中市|临汾市|运城市");   
	cityArray[6] = new Array("内蒙古自治区","呼和浩特市|包头市|乌海市|赤峰市|呼伦贝尔盟市|阿拉善盟市|哲里木盟市|兴安盟市|乌兰察布盟市|锡林郭勒盟市|巴彦淖尔盟市|伊克昭盟市");   
	cityArray[7] = new Array("辽宁省","沈阳市|大连市|鞍山市|抚顺市|本溪市|丹东市|锦州市|营口市|阜新市|辽阳市|盘锦市|铁岭市|朝阳市|葫芦岛市");   
	cityArray[8] = new Array("吉林省","长春市|吉林市|四平市|辽源市|通化市|白山市|松原市|白城市|延边市");   
	cityArray[9] = new Array("黑龙江省","哈尔滨市|齐齐哈尔市|牡丹江市|佳木斯市|大庆市|绥化市|鹤岗市|鸡西市|黑河市|双鸭山市|伊春市|七台河市|大兴安岭市");   
	cityArray[10] = new Array("江苏省","南京市|镇江市|苏州市|南通市|扬州市|盐城市|徐州市|连云港市|常州市|无锡市|宿迁市|泰州市|淮安市");   
	cityArray[11] = new Array("浙江省","杭州市|宁波市|温州市|嘉兴市|湖州市|绍兴市|金华市|衢州市|舟山市|台州市|丽水市");   
	cityArray[12] = new Array("安徽省","合肥市|芜湖市|蚌埠市|马鞍山市|淮北市|铜陵市|安庆市|黄山市|滁州市|宿州市|池州市|淮南市|巢湖市|阜阳市|六安市|宣城市|亳州市");   
	cityArray[13] = new Array("福建省","福州市|厦门市|莆田市|三明市|泉州市|漳州市|南平市|龙岩市|宁德市");   
	cityArray[14] = new Array("江西省","南昌市|景德镇市|九江市|鹰潭市|萍乡市|新馀市|赣州市|吉安市|宜春市|抚州市|上饶市");   
	cityArray[15] = new Array("山东省","济南市|青岛市|淄博市|枣庄市|东营市|烟台市|潍坊市|济宁市|泰安市|威海市|日照市|莱芜市|临沂市|德州市|聊城市|滨州市|菏泽市");   
	cityArray[16] = new Array("河南省","郑州市|开封市|洛阳市|平顶山市|安阳市|鹤壁市|新乡市|焦作市|濮阳市|许昌市|漯河市|三门峡市|南阳市|商丘市|信阳市|周口市|驻马店市|济源市");   
	cityArray[17] = new Array("湖北省","武汉市|宜昌市|荆州市|襄樊市|黄石市|荆门市|黄冈市|十堰市|恩施市|潜江市|天门市|仙桃市|随州市|咸宁市|孝感市|鄂州市");  
	cityArray[18] = new Array("湖南省","长沙市|常德市|株洲市|湘潭市|衡阳市|岳阳市|邵阳市|益阳市|娄底市|怀化市|郴州市|永州市|湘西市|张家界市");   
	cityArray[19] = new Array("广东省","广州市|深圳市|珠海市|汕头市|东莞市|中山市|佛山市|韶关市|江门市|湛江市|茂名市|肇庆市|惠州市|梅州市|汕尾市|河源市|阳江市|清远市|潮州市|揭阳市|云浮市");   
	cityArray[20] = new Array("广西壮族自治区","南宁市|柳州市|桂林市|梧州市|北海市|防城港市|钦州市|贵港市|玉林市|南宁地区市|柳州地区市|贺州市|百色市|河池市");   
	cityArray[21] = new Array("海南省","海口市|三亚市|三沙市|儋州市|五指山市|文昌市|琼海市|万宁市|东方市");   
	cityArray[22] = new Array("四川省","成都市|绵阳市|德阳市|自贡市|攀枝花市|广元市|内江市|乐山市|南充市|宜宾市|广安市|达川市|雅安市|眉山市|甘孜市|凉山市|泸州市");   
	cityArray[23] = new Array("贵州省","贵阳市|六盘水市|遵义市|安顺市|铜仁市|黔西南市|毕节市|黔东南市|黔南市");   
	cityArray[24] = new Array("云南省","昆明市|大理市|曲靖市|玉溪市|昭通市|楚雄市|红河市|文山市|思茅市|西双版纳市|保山市|德宏市|丽江市|怒江市|迪庆市|临沧市");  
	cityArray[25] = new Array("西藏自治区","拉萨市|日喀则市|山南市|林芝市|昌都市|阿里市|那曲市");   
	cityArray[26] = new Array("陕西省","西安市|宝鸡市|咸阳市|铜川市|渭南市|延安市|榆林市|汉中市|安康市|商洛市");   
	cityArray[27] = new Array("甘肃省","兰州市|嘉峪关市|金昌市|白银市|天水市|酒泉市|张掖市|武威市|定西市|陇南市|平凉市|庆阳市|临夏市|甘南市");   
	cityArray[28] = new Array("宁夏回族自治区","银川市|石嘴山市|吴忠市|固原市");   
	cityArray[29] = new Array("青海省","西宁市|海东市|海南市|海北市|黄南市|玉树市|果洛市|海西市");   
	cityArray[30] = new Array("新疆维吾尔族自治区","乌鲁木齐市|石河子市|克拉玛依市|伊犁市|巴音郭勒市|昌吉市|克孜勒苏柯尔克孜市|博尔塔拉市|吐鲁番市|哈密市|喀什市|和田市|阿克苏市");   
	cityArray[31] = new Array("香港特别行政区","香港特别行政区");   
	cityArray[32] = new Array("澳门特别行政区","澳门特别行政区");   
	cityArray[33] = new Array("台湾省","台北市|高雄市|台中市|台南市|屏东市|南投市|云林市|新竹市|彰化市|苗栗市|嘉义市|花莲市|桃园市|宜兰市|基隆市|台东市|金门市|马祖市|澎湖市");  

	var oProvWrap=$('.province ul');
	var oCityWrap=$('.city ul');
	var sProv='';
	var sCity='';
	//省份布局
	provinceArray.forEach(function(item,index){
		sProv+='<li>'+item+'</li>';
	});
	oProvWrap.html(sProv);

	//城市布局
	var aProv=$('.province ul li');
	var valProv='北京市';
	var valCity='';
	var oI=$('.add-new-address ul li p i');
	//默认显示北京区的
	cityArray[0][1].split('|').forEach(function(item,index){
		sCity+='<li>'+item+'</li>'
	});
	oCityWrap.html(sCity);
	select();
	//点击省份显示对应的城市布局
	aProv.each(function(index,item){
		$(item).on('click',function(){
			var text=$(this).text();
			sCity='';
			cityArray.forEach(function(item1,index1){
				if(text==item1[0]){
					valProv=item1[0];
					var arrCity=item1[1].split('|');
					arrCity.forEach(function(item2,index2){
						sCity+='<li>'+item2+'</li>'
					});
					oCityWrap.html(sCity);
				}
			});
			select();
		});
	});

	//点击城市选中值
	function select(){
		var aCity=$('.city li');
		aCity.each(function(index,item){
			$(item).on('click',function(){

				aCity.each(function(index1,item1){
					$(item1).removeClass('active');
				});
				$(this).addClass('active');
				
				$(oI).text(valProv+'/'+$(this).text());

				oSelect.css('opacity',0);
				timer=setTimeout(function(){
					oSelect.css('display','none');
				},500);
			});
		});
	}
	//弹层
	var oClose=$('.select-top>span.close');
	var oBtn=$('.add-new-address ul li p');
	var oSelect=$('.select');
	var timer=null;
	var timer1=null;

	//弹出层
	oBtn.on('click',function(){
		oSelect.css('display','block');
		timer=setTimeout(function(){
			oSelect.css('opacity',1);
		},50);
	});

	//弹层消失
	oClose.on('click',function(){
		oSelect.css('opacity',0);
		timer=setTimeout(function(){
			oSelect.css('display','none');
		},500);
	});
})();

var reg = /^((1[0-9]{1})+\d{9})$/;

//获取验证码验证手机号
(function(){
	var oBtn=$('.identifying');
	var num=60;
	var timer=null;
	var iBtn=true;

	oBtn.on('click',function(){
		if(!iBtn){return}
		var val=$('input.tel').val();
		if(!reg.test(val)){ 
		    alert('请输入有效的手机号码'); 
		    return false; 
		}
		iBtn=false;
		timer=setInterval(function(){
			num--;
			oBtn.html(num+'s');
			oBtn.css({
				'color':'#fff',
				'background':'#CB68A4',
				'font-size':'.18rem'
			});
			if(num<0){
				clearInterval(timer);
				oBtn.html('重新获取');
				iBtn=true;
				num=60;
				oBtn.css({
					'color':'#666',
					'background':'#D8D8D8',
					'font-size':'.12rem'
				});
			}
		},1000);

		$.ajax({
			type:'post',
			url:apiUrl+'/user/captcha',
			data:{
				mobile:val
			},
			success:function(data){
				
				if(data.head.code){
					alert(data.head.message);
				}
			},
			error:function(err){
				console.log(err);
			}
		});
	});
})();

//保存并使用
(function(){
	var oLogin=$('.add-new-address ul li .keep');

	oLogin.on('click',function(){
		var sOrder=$('.order>input').val();
		var iTel1=$('.order-tel>input').val();
		var sGeter=$('.geter>input').val();
		var iTel2=$('.geter-tel>input').val();
		var iCode=$('.code>input').val();
		var sLocalAddress=$('.geter-zone i').text();
		var sDetialAddress=$('.detial-address textarea').val();
		console.log(sOrder,iTel1,sGeter,iTel2,iCode,sLocalAddress,sDetialAddress);
		if(sOrder==''||sGeter==''||iTel1==''||sLocalAddress==''||iTel2==''||iCode==''||sDetialAddress==''){
			alert('手机号或验证码不能为空！');
			return;
		}else{
			if(!reg.test(iTel1)||!reg.test(iTel2)){
			    alert('请输入有效的手机号码');
			    return false;
			}

			$.ajax({
				type:'post',
				url:apiUrl+'/register',
				data:{
					nickname:sOrder,
					mobile:iTel1,
					captcha:iCode,
					consignee:sGeter,
					consigneeMobile:iTel2,
					zone:sLocalAddress.replace(/\//, ""),
					detail:sDetialAddress
				},
				success:function(data){
					if(data.head.code){
						alert(data.head.message);
						return;
					}
					var vipNo=data.body.memberNo;
					setSto("token",data.body.token);
					setSto("addressID",data.body.addressId);
					setSto("vipNo", vipNo);
					window.location.href='ok-order.html?from=custom';
				},
				error:function(err){
					console.log(err);
				}
			});
		}
	});
})();