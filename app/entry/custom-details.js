import '../css/public.css';
import '../css/custom-details.css';
import $ from 'jquery';
import apiUrl from '../js/config';
import {rand,signName,reTop,tabBar,imgLazy,setSto,getSto,cartCount,rmSto,allSto,getLto,noRepeat,setLto,imgLazyForFind,url_search} from '../js/config';
import md5 from 'md5';
var vipNo=getSto('vipNo');
var token=getSto('token');
(function(){
	var style=$('.style');
	var material=$('.material');
	var size=$('.size');
	
	var lettering=$('.lettering');
	var orderNum=$('.order-num');
	var dealTime=$('.deal-time');
	var geter=$('.geter');
	var tel=$('.geter-tel');
	var oAddress=$('.geter-address');
	var oTips=$('.tips');//商品正在准备中
	var oExpress=$('.express');//简单的快递信息
	var expressName=$('.express-name');
	var expressTel=$('.express-tel');
	var expressNum=$('.express-order');
	var expressWrap=$('.express-step');//快递详情信息的最外层
	var expressCon=$('.follow');//快递详情信息的外层
	var statusCon=$('.status-bar>ul');

	var goodsPrice=$('.goods-price');//商品总价
	var couponPrice=$('.goods-off');//优惠价格
	var payPrice=$('.goods-pay');//支付金额
	var sayWords=$('.remark textarea');//想对卖家说的话
	var oText=$('.comments li.comments-detail>div >p');//商品备注

	var str='';
	var temp=window.location.search;
	//var valObject=url2json(temp.split('?')[1]);
	var vipNo=getSto("vipNo");
	var token=getSto("token");

	var oWrap=$('.wrap-mycustom');//商品列表用
	var sGoods='';//商品列表用
	var token=getSto('token');
	$.ajax({
		type:'get',
		headers:signName(md5,vipNo,token),
		url:apiUrl+'/customization/order/detail',
		data:{
			memberNo:vipNo,
			orderNo:url_search().orderNo
		},
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
			var data=data.body; 
			
			var address=data.address;//收货人地址信息
			var express=data.express;//快递信息
			var status=data.statusAxis;//页面上部信息
			var goodsList=data.goodsList;//获取商品列表
			
			$(couponPrice).text('-￥'+data.order.creditAmount);
			$(goodsPrice).text('￥'+data.order.orderPrice);
			$(payPrice).text('￥'+data.order.payAmount);
			// $(lettering).text(order.lettering);
			$(orderNum).text(data.order.no);
			$(dealTime).text(data.order.createTime);
	
			if(data.orderComment!=''){
				$(oText).html(data.orderComment);//商品备注
			}else{
				$('.remark').css('display','none');
			}

			if(data.invoiceContent){
				$('.invoice-name').html(data.invoiceContent);//商品备注
			}else{
				$('.invoice').css('display','none');
			}
			
			$(expressName).text(express.company);
			$(expressNum).text(express.no);
			$(expressTel).html('<a href="tel:95543">95543</a>');

			// if(express.company==''){
			// 	$('.express').css('display','none');
			// }

			//获取地址
			$(geter).text(address.consignee);
			$(tel).text(address.mobile);
			$(oAddress).text(address.detail);
			if(address.consignee==''){
				$('#gater').css('display','none');
				$('#address').css('display','none');
			}

			//商品展示
			
            sGoods+=`<div class="custom-list-details">
                <div class="list-table">
                  <ul class="clear">
                    <li>宝贝</li>
                    <li>款式</li>
                    <li>材质</li>
                    <li>尺寸</li>
                    <li>刻字</li>
                  </ul>
                  <ol class="clear">
                    <li class="goods-list-pic"><img src="${data.order.cover}"></li>
                    <li>${data.order.style}</li>
                    <li>${data.order.material}</li>
                    <li>${data.order.size}</li>
                    <li>${data.order.lettering}</li>
                  </ol>
                </div>
              </div>`;
			

			$(oWrap).html(sGoods);
			//快递状态
			if(express.infos.length){
				express.infos.forEach(function(item,index){
					
	    			if(index==0){
	    				str+=`<p class="active">${item.createTime} ${item.content}</p>`;
	    			}else{
	    				str+=`<p>${item.createTime} ${item.content}</p>`;
	    			}
				});

				expressCon.html(str);
			}else{
				$('.follow').css({
					'height':'100px',
					'line-height':'100px',
					'text-align':'center',
					'color':'#000',
					'font-size':'14px'
				});
				$('.follow').html('暂无物流信息！');
			}
			
			//顶端状态
			// str='';
			// var len=0;

			// if(status){
			// 	len=status.length;
			// 	if(len==2){
			// 		$(statusCon).attr('class','two');
			// 	}else if(len==3){
			// 		$(statusCon).attr('class','three');
			// 	}else if(len==4){
			// 		$(statusCon).attr('class','four');
			// 	}else if(len==5){
			// 		$(statusCon).attr('class','five');
			// 	}else if(len==6){
			// 		$(statusCon).attr('class','six');
			// 	}else if(len==7){
			// 		$(statusCon).attr('class','seven');
			// 	}
				
			// 	for(var i=0; i<len; i++){
			// 		if(status[i][1]=="enable"){
			// 			str+='<li class="active"><span>'+(i+1)+'</span><p>'+status[i][0]+'</p></li>';
			// 		}else{
			// 			str+='<li class=""><span>'+(i+1)+'</span><p>'+status[i][0]+'</p></li>';
			// 		}
			// 	}
			// 	statusCon.html(str);
			// }
			
			
			str='';
			//底端按钮状态
			var iCode=data.order.statusCode;
			var oCon=$('.take-over');
			
	        switch(iCode){
	        	case 10://待付款
        			$('.logistics').css('display','none');
        			str+=`<h4>您已成功下单，请完成付款</h4>
	                <p><button class="sure-btn active pay-money">立即付款</button>
	                <a class="service" href="javascript:;" onclick="NTKF.im_openInPageChat('kf_9529_1489472556188')">联系客服</a></p>`;
	        	break;
				case 20://待确认
				    $('.logistics').css('display','none');
	        		str+=`<h4>您已付款成功，请等待商品制作确认</h4>
		            <button class="sure-btn refund-btn refund" data-type="refund">申请退款</button>
		            <a class="service" href="javascript:;" onclick="NTKF.im_openInPageChat('kf_9529_1489472556188')">联系客服</a></button></p>`;
	        	break;
				case 21://已关闭
					$('.logistics').css('display','none');
	        		str+=`<h4>交易已关闭</h4>
		              <a class="service" href="javascript:;" onclick="NTKF.im_openInPageChat('kf_9529_1489472556188')">联系客服</a></button></p>`;
	        	break;
	        	case 40://待制作
	        		$('.logistics').css('display','none');
	        		str+=`<h4>您的商品已确认，等待制作</h4>
		              <p><a class="service" href="javascript:;" onclick="NTKF.im_openInPageChat('kf_9529_1489472556188')">联系客服</a></button></p>`;
	        	break;
	        	case 50://制作中
	        		$('.logistics').css('display','none');
	        		str+=`<h4>您的商品已确认，开始制作</h4>
		              <p><a class="service" href="javascript:;" onclick="NTKF.im_openInPageChat('kf_9529_1489472556188')">联系客服</a></button></p>`;
	        	break;
				
				case 60://待发货
					$('.logistics').css('display','none');
	        		str+=`<h4>您的商品已经制作完成，准备发货中</h4>
		            <p><a class="service" href="javascript:;" onclick="NTKF.im_openInPageChat('kf_9529_1489472556188')">联系客服</a></button></p>`;
	        	
	        	break;
				
				case 70://已发货
	        		str+=`<h4>您的商品已经发货，请注意收货</h4>
		            <p><button class="sure-btn custom-ok" data-type="ok">确认收货</button>
		            <a class="service" href="javascript:;" onclick="NTKF.im_openInPageChat('kf_9529_1489472556188')">联系客服</a></p>`;
	        	
	        	break;
	        	case 80://已完成
	        		 str+=`<h4>您的订单已完成，祝您购物愉快</h4>
		              <a class="service" href="javascript:;" onclick="NTKF.im_openInPageChat('kf_9529_1489472556188')">联系客服</a></p>`;
	        	
	        	break;

				case 31://不可做
	        		$('.logistics').css('display','none');
	        		str+=`<h4>很抱歉，您的商品经确认不可制作，请您修改画作</h4>
		              <p><button class="sure-btn refund-btn refund" data-type="refund">申请退款</button>
		              <a class="service" href="javascript:;" onclick="NTKF.im_openInPageChat('kf_9529_1489472556188')">联系客服</a></p>`;
	        	
	        	break;
				case 41://待退款
	        		$('.logistics').css('display','none');
	        		str+=`<h4>您的退款申请已经发出，会及时处理，请耐心等待</h4>
		              <p><a class="service" href="javascript:;" onclick="NTKF.im_openInPageChat('kf_9529_1489472556188')">联系客服</a></p>`;
	        
	        	break;
				case 51://已退款
	        		$('.logistics').css('display','none');
	        		str+=`<h4>您的退款已经成功，请到付款账户中查询</h4>
		              <p><a class="service" href="javascript:;" onclick="NTKF.im_openInPageChat('kf_9529_1489472556188')">联系客服</a></p>`;
	        	break;
	        	default:
	        		str+=`<h4></h4>
		              <p></p>
		              <p><a class="service" href="javascript:;" onclick="NTKF.im_openInPageChat('kf_9529_1489472556188')">联系客服</a></p>`;
	        	break;
	        }
	        $(oCon).html(str);

	       	//判断是否有售后
	  //      	if(!data.aftersale){
	  //      		$('.server-support').css('display','block');
	  //      	}else{
	  //      		$('.server-support').css('display','none');
	  //      	}
	       	//立即付款
	       	(function(){
	       		var oBtn=$('.pay-money');
	       		oBtn.on('click',function(event){
	       			var token=getSto('token');
	       			$.ajax({
						type:'post',
						headers:signName(md5,vipNo,token),
						url:apiUrl+'/customization/order/pay',
						data:{
							orderNo:url_search().orderNo,
							memberNo:vipNo
						},
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
							
							var form=data.body.form;
							_AP.pay(form);
						},
						error:function(err){
							console.log(err);
						}
					});
	       		});
	       		event.stopPropagation();
	       	})();

			//申请退款
			(function(){
				var oRefund=$('.refund');
				var oWrap=$('.opacity3');
				var oBtn=$('.opacity3 .con li:last-of-type');
				var oCancel=$('.opacity3 .con li:first-of-type');
				
				oRefund.on('click',function(){
					$('.opacity3 .con').addClass('reason');
					$('.opacity .con h2').text('申请售后');
					$('.opacity .con p').text('请在输入框中填写申请售后理由');
					alertC(url_search().orderNo,$(this).get(0).dataset.type);
				});

				function refund(orderNum,vipNo,reason){
					$.ajax({
						type:'post',
						headers:signName(md5,vipNo,token),
						url:apiUrl+'/customization/order/refund',
						data:{
							orderNo:orderNum,
							memberNo:vipNo,
							reason:reason
						},
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
							console.log('data:',data);
							cancel(data.body.status);
						},
						error:function(err){
							console.log(err);
							alert(err);
						}
					});
				}

				//弹出窗口函数
				function alertC(s,type){
					oBtn.attr('data-order',s);
					oBtn.attr('data-type',type);
					oWrap.css('display','block');
					setTimeout(function(){
						oWrap.css('opacity',1);
					},50);
				}

				//窗口消失函数
				function cancel(code){
					console.log(data.statusCode);
					oWrap.css('opacity',0);
					setTimeout(function(){
						oWrap.css('display','none');
						if(!code){
							return;
						}
						location.href='personal-orders.html';
						
					},500);

				}

				//窗口的确认
				oBtn.on('click',function(){
					var vipNo=sessionStorage.getItem("vipNo");
					var reason=$('.opacity .reason input').val();
					if($(this).get(0).dataset.type=='refund'){
						refund($(this).get(0).dataset.order,vipNo,reason);
					}
					
				});

				//字数检查
				var strVal='';
				var valBtn=$('.opacity input');
				$(valBtn).on('input',function(){
					if($(this).val().length>=140){
						$(this).val(strVal);
						alert('字数不能超过140字');
					}else{
						strVal=$(this).val();
					}
				});

				//点击取消窗口消失
				oCancel.on('click',function(){
					cancel(0);
				});
			})();

			//确认收货
			(function(){
				var oK=$('.custom-ok');
				var oWrap=$('.opacity3');
				var oBtn=$('.opacity3 .con li:last-of-type');
				var oCancel=$('.opacity3 .con li:first-of-type');
				
				oK.on('click',function(){
					$('.opacity3 .con').removeClass('reason');
					$('.opacity3 .con').removeClass('cancel');
					$('.opacity3 .con input').css('display','none');
					$('.opacity3 .con a').css('display','none');
					$('.opacity3 .con h2').text('确认收货');
					$('.opacity3 .con p').text('是否确认已经收到货品？');
					alertC(url_search().orderNo,$(this).get(0).dataset.type);
				});

				//点击确认请求接口
				function ok(orderNum,vipNo){
					var token=getSto('token');
					$.ajax({
						type:'post',
						headers:signName(md5,vipNo,token),
						url:apiUrl+'/customization/order/confirm',
						
						data:{
							orderNo:orderNum,
							memberNo:vipNo
						},
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
							cancel(1);
						},
						error:function(err){
							console.log(err);
						}
					});
				}

				//弹出窗口函数
				function alertC(s,type){
					oBtn.attr('data-order',s);
					oBtn.attr('data-type',type);
					oWrap.css('display','block');
					setTimeout(function(){
						oWrap.css('opacity',1);
					},50);
				}

				//窗口消失函数
				function cancel(code){
					oWrap.css('opacity',0);
					setTimeout(function(){
						oWrap.css('display','none');
						if(!code){
							return;
						}
						location.href='personal-orders.html';
					},500);
				}

				//窗口的确认
				oBtn.on('click',function(){
					var vipNo=sessionStorage.getItem("vipNo");
					
					if($(this).get(0).dataset.type=='ok'){
						ok($(this).get(0).dataset.order,vipNo,$(this).get(0).dataset.index);
					}
					
				});

				//点击取消窗口消失
				oCancel.on('click',function(){
					cancel(0);
				});
			})();
			

			if(location.hash=='#express'){
				$('.wrap').scrollTop($('#express').offset().top);
			}

		},
		error:function(err){
			console.log(err);
		}
	});
})();