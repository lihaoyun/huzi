import '../css/public.css';
import '../css/kind-gift.css';
import $ from 'jquery';
import apiUrl from '../js/config';
import {rand,signName,reTop,tabBar,imgLazy,setSto,getSto,cartCount,rmSto,allSto,setICPLocation,reSetICPLocation} from '../js/config';
//获取购物车数量
cartCount($('.func-public em'));


var getUrl=apiUrl+'/home/queryHomeGoodsByPage';
var sortId=[];
var styleId=[];
var materialId=[];
var priceId=[];
var targetId=[];
var labelId=[];
var pageNum=1;
var pageSize=16;
var jsonData={
        type:4,
        pageNum:pageNum,
        pageSize:pageSize
    };

var iBtn=true;//控制分页器只布局一次的关
////////////////////////////////////弹出送给谁及为了庆祝什么的弹层////////////////////////////////////
var arrData=[
	{
		id:2,
		name:'小王子'
	},
	{
		id:1,
		name:'小公主'
	},
	{
		id:3,
		name:'宝爸宝妈'
	},
];
var oParent=$('.for-who').parent();
var oBtnWho=$('.for-who');
var oBtnWhat=$('.for-what');
var forCon=$('.for-something');
var forStr='';
var whoIndex=-1;//记录送给谁的状态
var whatIndex=-1;//记录庆祝什么的状态
//送给谁
oBtnWho.on('click',function(){
	forStr='';
	arrData.forEach(function(item,index){
		forStr+=`<div data-id=${item.id} class="kind-banner-con-item">
                    <span>${item.name}</span>
                </div>`;
	});

	$(oBtnWhat).get(0).dataset.btn='false';

	if(this.dataset.btn=='false'){
		oParent.addClass('active');
		$(this).find('em').addClass('active');//倒三角的动画
		$(oBtnWhat).find('em').removeClass('active');
		this.dataset.btn='true';
	}else{
		forStr='';
		oParent.removeClass('active');
		$(this).find('em').removeClass('active');//倒三角的动画
		this.dataset.btn='false';
	}
	forCon.removeClass('what');
	forCon.addClass('who');
	forCon.html(forStr);

	var aBtn=$('.who .kind-banner-con-item');

	aBtn.each(function(index,item){
		item.dataset.btn='true';
		if(whoIndex==index){
			$(item).addClass('active');
			item.dataset.btn='false';
		}
		$(item).on('click',function(){
			getUrl=apiUrl+'/home/list/queryGoodsByParamAndPage';

			if(item.dataset.btn=='true'){
				aBtn.each(function(index1,item1){
					$(item1).removeClass('active');
					item1.dataset.btn='true';
				});
				$(this).addClass('active');
				$('.for-what').get(0).dataset.can="true";//恢复庆祝什么可以点击
				if(item.dataset.id=='3'){//如果点击宝爸妈时不可以点击庆祝什么
					$('.for-what').get(0).dataset.can="false";//庆祝什么不可以点击
				}
				whoIndex=index;
				item.dataset.btn='false';
				targetId[0]=parseInt(item.dataset.id);
				jsonData.targetIds=targetId;

			}else{
				$(this).removeClass('active');
				$('.for-what').get(0).dataset.can="true";//恢复庆祝什么可以点击
				whoIndex=-1;
				item.dataset.btn='true';
				jsonData.targetIds='';
			}
			jsonData.pageNum=1;
			iBtn=true;//控制分页器只布局一次的关
			dataRender();
		});
	});
});

//为了什么
$.ajax({
    type:'get',
    url:apiUrl+'/home/queryLabels',
    data:{},
    success:function(data){
        
        if(data.head.code){
            console.log(data.head.message);
            cancelImgLayer();
            return;
        }
        var data=data.body;

        oBtnWhat.on('click',function(){
			forStr='';
			if(this.dataset.can=='false'){
				return;
			}
			data.labels.forEach(function(item,index){
	        	forStr+=`<div data-id=${item.id} class="kind-banner-con-item">
	                <span>${item.labelContent}</span>
	            </div>`;
	        });

	        $(oBtnWho).get(0).dataset.btn='false';

			if(this.dataset.btn=='false'){
				oParent.addClass('active');
				$(this).find('em').addClass('active');//倒三角的动画
				$(oBtnWho).find('em').removeClass('active');
				this.dataset.btn='true';
			}else{
				forStr='';
				oParent.removeClass('active');
				$(this).find('em').removeClass('active');//倒三角的动画
				this.dataset.btn='false';
			}
			forCon.removeClass('who');
			forCon.addClass('what');
			forCon.html(forStr);

			var aBtn=$('.what .kind-banner-con-item');

			aBtn.each(function(index,item){
				item.dataset.btn='true';
				if(whatIndex==index){
					$(item).addClass('active');
					item.dataset.btn='false';
				}
				$(item).on('click',function(){

					if(item.dataset.btn=='true'){
						aBtn.each(function(index1,item1){
							$(item1).removeClass('active');
							item1.dataset.btn='true';
						});
						$(this).addClass('active');
						$('.for-what').get(0).dataset.can="true";//恢复庆祝什么可以点击
						if(item.dataset.id=='3'){//如果点击宝爸妈时不可以点击庆祝什么
							$('.for-what').get(0).dataset.can="false";//庆祝什么不可以点击
						}
						whatIndex=index;
						item.dataset.btn='false';
						labelId[0]=parseInt(item.dataset.id);
						jsonData.labelIds=labelId;
					}else{
						$(this).removeClass('active');
						$('.for-what').get(0).dataset.can="true";//恢复庆祝什么可以点击
						whatIndex=-1;
						item.dataset.btn='true';
						jsonData.labelIds='';
					}
					jsonData.pageNum=1;
					iBtn=true;//控制分页器只布局一次的关
					dataRender();
				});
			});
		});
    },
    error:function(err){
    	console.log(err);
    }
});


//品类 材质 价格
var oParent2=$('.styles').parent();
var forCon2=$('.for-something2');
var oStyles=$('.styles');
var oMaterials=$('.materials');
var oPrices=$('.prices');
var stylesIndex=-1;//记录品类的状态
var materialsIndex=-1;//记录材质的状态
var pricesIndex=-1;//记录价格的状态
 
$.ajax({
    type:'get',
    url:apiUrl+'/search/result/queryConfig',
    data:{},
    success:function(data){
        
        if(data.head.code){
            console.log(data.head.message);
            cancelImgLayer();
            return;
        }
        var data=data.body;
        var dataMaterials=data.materials;
        var dataPrices=data.prices;
        var dataStyles=data.styles;
        //点击品类
        oStyles.on('click',function(){
			forStr='';
			if(this.dataset.can=='false'){
				return;
			}
			dataStyles.forEach(function(item,index){
	        	forStr+=`<div data-id=${item.id} class="kind-banner-con-item">
	                <span>${item.name}</span>
	            </div>`;
	        });

	        $(oMaterials).get(0).dataset.btn='false';
	        $(oPrices).get(0).dataset.btn='false';

			if(this.dataset.btn=='false'){
				oParent2.addClass('active');
				$(this).find('em').addClass('active');//倒三角的动画
				$(oMaterials).find('em').removeClass('active');
				$(oPrices).find('em').removeClass('active');
				this.dataset.btn='true';
			}else{
				forStr='';
				oParent2.removeClass('active');
				$(this).find('em').removeClass('active');//倒三角的动画
				this.dataset.btn='false';
			}
			forCon2.removeClass('materials-con');
			forCon2.removeClass('prices-con');
			forCon2.addClass('styles-con');
			forCon2.html(forStr);

			var aBtn=$('.styles-con .kind-banner-con-item');

			aBtn.each(function(index,item){
				item.dataset.btn='true';
				if(stylesIndex==index){
					$(item).addClass('active');
					item.dataset.btn='false';
				}
				$(item).on('click',function(){

					if(item.dataset.btn=='true'){
						aBtn.each(function(index1,item1){
							$(item1).removeClass('active');
							item1.dataset.btn='true';
						});
						$(this).addClass('active');
						stylesIndex=index;
						item.dataset.btn='false';
						styleId[0]=parseInt(item.dataset.id);
						jsonData.styleIds=styleId;
					}else{
						$(this).removeClass('active');
						stylesIndex=-1;
						item.dataset.btn='true';
						jsonData.styleIds='';
					}
					getUrl=apiUrl+'/home/list/queryGoodsByParamAndPage';
					jsonData.pageNum=1;
					iBtn=true;//控制分页器只布局一次的关
					dataRender();
				});
			});
		});
		
		//点击材质
        oMaterials.on('click',function(){
			forStr='';
			if(this.dataset.can=='false'){
				return;
			}
			dataMaterials.forEach(function(item,index){
	        	forStr+=`<div data-id=${item.id} class="kind-banner-con-item">
	                <span>${item.name}</span>
	            </div>`;
	        });

	        $(oStyles).get(0).dataset.btn='false';
	        $(oPrices).get(0).dataset.btn='false';

			if(this.dataset.btn=='false'){
				oParent2.addClass('active');
				$(this).find('em').addClass('active');//倒三角的动画
				$(oStyles).find('em').removeClass('active');
				$(oPrices).find('em').removeClass('active');
				this.dataset.btn='true';
			}else{
				forStr='';
				oParent2.removeClass('active');
				$(this).find('em').removeClass('active');//倒三角的动画
				this.dataset.btn='false';
			}
			forCon2.removeClass('styles-con');
			forCon2.removeClass('prices-con');
			forCon2.addClass('materials-con');
			forCon2.html(forStr);

			var aBtn=$('.materials-con .kind-banner-con-item');

			aBtn.each(function(index,item){
				item.dataset.btn='true';
				if(materialsIndex==index){
					$(item).addClass('active');
					item.dataset.btn='false';
				}
				$(item).on('click',function(){

					if(item.dataset.btn=='true'){
						aBtn.each(function(index1,item1){
							$(item1).removeClass('active');
							item1.dataset.btn='true';
						});
						$(this).addClass('active');
						materialsIndex=index;
						item.dataset.btn='false';
						materialId[0]=parseInt(item.dataset.id);
						jsonData.materialIds=materialId;
					}else{
						$(this).removeClass('active');
						materialsIndex=-1;
						item.dataset.btn='true';
						jsonData.materialIds='';
					}
					getUrl=apiUrl+'/home/list/queryGoodsByParamAndPage';
					jsonData.pageNum=1;
					iBtn=true;//控制分页器只布局一次的关
					dataRender();
				});
			});
		});
		
		//点击价格
        oPrices.on('click',function(){
			forStr='';
			if(this.dataset.can=='false'){
				return;
			}
			dataPrices.forEach(function(item,index){
	        	forStr+=`<div data-id=${item.id} class="kind-banner-con-item">
	                <span>${item.name}</span>
	            </div>`;
	        });

	        $(oStyles).get(0).dataset.btn='false';
	        $(oMaterials).get(0).dataset.btn='false';

			if(this.dataset.btn=='false'){
				oParent2.addClass('active');
				$(this).find('em').addClass('active');//倒三角的动画
				$(oStyles).find('em').removeClass('active');
				$(oMaterials).find('em').removeClass('active');
				this.dataset.btn='true';
			}else{
				forStr='';
				oParent2.removeClass('active');
				$(this).find('em').removeClass('active');//倒三角的动画
				this.dataset.btn='false';
			}
			forCon2.removeClass('styles-con');
			forCon2.removeClass('materials-con');
			forCon2.addClass('prices-con');
			forCon2.html(forStr);

			var aBtn=$('.prices-con .kind-banner-con-item');

			aBtn.each(function(index,item){
				item.dataset.btn='true';
				if(pricesIndex==index){
					$(item).addClass('active');
					item.dataset.btn='false';
				}
				$(item).on('click',function(){

					if(item.dataset.btn=='true'){
						aBtn.each(function(index1,item1){
							$(item1).removeClass('active');
							item1.dataset.btn='true';
						});
						$(this).addClass('active');
						pricesIndex=index;
						item.dataset.btn='false';
						priceId[0]=parseInt(item.dataset.id);
						jsonData.priceIds=priceId;
					}else{
						$(this).removeClass('active');
						pricesIndex=-1;
						item.dataset.btn='true';
						jsonData.priceIds='';
					}
					getUrl=apiUrl+'/home/list/queryGoodsByParamAndPage';
					jsonData.pageNum=1;
					iBtn=true;//控制分页器只布局一次的关
					dataRender();
				});
			});
		});
    },
    error:function(err){
    	console.log(err);
    }
});

////////////////////////////////////初始化商品列表////////////////////////////////////
var numIndex=0;
var oCon=$('.guess-like-public ul');
dataRender();

function dataRender(arg){
	reSetICPLocation();
	var str='';
    $.ajax({
        type:'get',
        url:getUrl,
        data:jsonData,
        success:function(data){
            if(data.head.code){
                console.log(data.head.message);
            }
            
            var data=data.body;

            data.goodsVoList.forEach(function(item,index){
            	if(arg=='child'){
            		// if(index==0){
	            	// 	str+=`<li class="goods-gife-item-public kind-tab kind-child">
		            //         <a class="active nav-gift" href="javascript:;">礼物</a>
		            //         <a class="nav-goods" href="javascript:;">产品</a>
		            //         <a class="nav-child" href="javascript:;">亲子</a>
		            //         <a class="nav-custom" href="javascript:;">定制</a>
		            //     </li>`;
	            	// }else{
			            str+=`<li class="goods-children-item-public">
			                <div>`;
			                    if(item.goodsList[0]){
				                    str+=`<a href="product-details.html?id=${item.goodsList[0].goodsId}" target="_blank"><img src="" data-src=${item.firstPicture} alt=""></a>`;
				                }
				                if(item.goodsList[1]){
					              	str+=`<a href="product-details.html?id=${item.goodsList[1].goodsId}" target="_blank"><img src="" data-src=${item.secondPicture} alt=""></a>`;
					          	}
			                    str+=`<p>${item.title} ${item.subtitle}</p> 
			                </div>
			            </li>`;
	            	//}

            	}else{
	            	// if(index==0){
	            	// 	str+=`<li class="goods-gife-item-public kind-tab">
		            //         <a class="active nav-gift" href="javascript:;">礼物</a>
		            //         <a class="nav-goods" href="javascript:;">产品</a>
		            //         <a class="nav-child" href="javascript:;">亲子</a>
		            //         <a class="nav-custom" href="javascript:;">定制</a>
		            //     </li>`;
	            	// }else{
			            str+=`<li class="goods-gife-item-public">`;
			            str+=`<div><img src="" alt="" data-src=${item.goodsPicture}>
			                    <em>￥${item.salePrice}</em>
			                    <p>${item.shortName}</p>
			                </div>
			                <a href=product-details.html?id=${item.id} target="_blank"></a>`;
			            str+=`</li>`;
	            	//}
	            }
	        });


	        $(oCon).html(str);
	        
	        if(arg=='child'){

	        	$(oCon).prepend(`<li class="goods-gife-item-public kind-tab kind-child">
                    <a class="active nav-gift" href="javascript:;" target="_blank">礼物</a>
                    <a class="nav-goods" href="javascript:;" target="_blank">产品</a>
                    <a class="nav-child" href="javascript:;" target="_blank">亲子</a>
                    <a class="nav-custom" href="javascript:;" target="_blank">定制</a>
                </li>`);
		    }else{
		    	$(oCon).prepend(`<li class="goods-gife-item-public kind-tab">
	                    <a class="active nav-gift" href="javascript:;" target="_blank">礼物</a>
	                    <a class="nav-goods" href="javascript:;" target="_blank">产品</a>
	                    <a class="nav-child" href="javascript:;" target="_blank">亲子</a>
	                    <a class="nav-custom" href="javascript:;" target="_blank">定制</a>
	                </li>`);
		    }
	    setICPLocation();
	        //去掉分类的active
	        $('.kind-tab a').each(function(index,item){
	        	$(item).removeClass('active');
	        });
	        //添加分类的active
	        $('.kind-tab a').each(function(index,item){
	        	if(numIndex==index){
	        		$(item).addClass('active');
	        	}
	        });
	        //图片懒加载
	        (function(){
	            var aImg=$('.guess-like-public img');
	            imgLazy(aImg);
	        })();
	        console.log('data.page:',data.page/pageSize);
			var pageCount=Math.ceil(data.page/pageSize);
			// 分页器
			if(iBtn){
				pagingRenderDom(pageCount);
				iBtn=false;
			}
			
			$('.nav-gift').on('click',function(){
				// $(oParent).removeClass('active');
				// $(forCon).html('');
				// $(oParent2).removeClass('active');
				// $(forCon2).html('');
				// whoIndex=-1;
				// whatIndex=-1;
				// pricesIndex=-1;
				// materialsIndex=-1;
				// stylesIndex=-1;
				// $(oBtnWho).get(0).dataset.btn='false';
				// $(oBtnWhat).get(0).dataset.btn='false';
				// $(oBtnWhat).get(0).dataset.can='true';
				// $(oStyles).get(0).dataset.btn='false';
				// $(oPrices).get(0).dataset.btn='false';
				// $(oMaterials).get(0).dataset.btn='false';
				$('.kind-gift').css('display','block');
				$('.kind-goods').css('display','none');
				$('.kind-custom').css('display','none');

				getUrl=apiUrl+'/home/queryHomeGoodsByPage';
				jsonData.type=4;
				iBtn=true;//控制分页器只布局一次的关
				numIndex=0;
				dataRender();
			});
			$('.nav-goods').on('click',function(){
				
				$('.kind-gift').css('display','none');
				$('.kind-custom').css('display','none');
				$('.kind-goods').css('display','block');
				getUrl=apiUrl+'/home/queryHomeGoodsByPage';
				//getUrl=apiUrl+'/home/list/queryGoodsByParamAndPage';
				jsonData.type=5;
				iBtn=true;//控制分页器只布局一次的关
				numIndex=1;
				dataRender();
			});
			$('.nav-child').on('click',function(){
				$('.kind-gift').css('display','none');
				$('.kind-goods').css('display','none');
				$('.kind-custom').css('display','none');
				getUrl=apiUrl+'/home/list/queryParentChildByPage';
				iBtn=true;//控制分页器只布局一次的关
				numIndex=2;
				dataRender('child');
			});
			$('.nav-custom').on('click',function(){
				$('.kind-gift').css('display','none');
				$('.kind-goods').css('display','none');
				$('.kind-custom').css('display','block');
				getUrl=apiUrl+'/home/queryHomeGoodsByPage';
				jsonData.type=6;
				iBtn=true;//控制分页器只布局一次的关
				numIndex=3;
				dataRender();
			});
            
        },
        error:function(err){
        	console.log(err);
        }
    });
}

function pagingRenderDom(num){
	var pagingCon=$('.paging');
	var str='';
	var curIndex=0;//当前选中的index
	if(num==1){
		$('.paging').css('display','none');
	}else{
        $('.paging').css('display','block');
    }

	if(num<9){//如果小于9页

		//以下是布局
		str+=`<span class="to-prev"></span><ul class="page-wrap">`;
		for(var i=0; i<num; i++){
			if(i==curIndex){
				str+='<li class="active">'+(i+1)+'</li>';
			}else{
				str+='<li>'+(i+1)+'</li>';
			}
		}		
		str+=`</ul><span class="to-next"></span>`;
		pagingCon.html(str);

		//以下是点击效果及逻辑
		var oPrev=$('.to-prev');//左按键
		var oNext=$('.to-next');//右按键
		var aBtn=$('.page-wrap li');//每一项

		//点击每项
		for(var i=0; i<aBtn.length; i++){
			(function(index){
				$(aBtn[index]).on('click',function(){
					aBtn[curIndex].className='';
					curIndex=index;
					jsonData.pageNum=index+1;
					dataRender();
					$(this).get(0).className='active';
				});
			})(i);
		}

		//向前
		oPrev.on('click',function(){
			if(curIndex==0) return;//如果当前是第一页 则不往下继续
			aBtn[curIndex].className='';
			curIndex--;
			jsonData.pageNum=curIndex+1;
			dataRender();
			aBtn[curIndex].className='active';
		});

		//向后
		oNext.on('click',function(){
			if(curIndex==(num-1)) return;//如果当前是最后一页 则不往下继续
			aBtn[curIndex].className='';
			curIndex++;
			jsonData.pageNum=curIndex+1;
			dataRender();
			aBtn[curIndex].className='active';
		});
		
	}else{//如果大于等于9页
		renderPage('init',0);
	}

	//分页器布局
	function renderPage(isClass,Index){
		var str='';
		if(isClass=='init'){//初始显示
			str+=`<ul class="page-wrap">`;
			for(var i=0; i<num; i++){
				if(i<3){
					if(i==0){
						str+='<li class="active">'+(i+1)+'</li>';
					}else{
						str+='<li>'+(i+1)+'</li>';
					}
				}else if(i>=3&&i<=num-2){
					str+='<li class="dot">...</li>';
				}else{
					str+='<li>'+(i+1)+'</li>';
				}
			}		
			str+=`</ul><span class="to-next"></span>`;
			pagingCon.html(str);
			
		}else if(isClass=='second'){
			str+=`<span class="to-prev"></span><ul class="page-wrap">`;
			for(var i=0; i<num; i++){
				if(i<3){
					str+='<li>'+(i+1)+'</li>';
				}else if(i>=3&&i<=num-2){
					str+='<li class="dot">...</li>';
				}else{
					str+='<li>'+(i+1)+'</li>';
				}
			}		
			str+=`</ul><span class="to-next"></span>`;
			pagingCon.html(str);
			
		}else if(isClass=='third'){
			str+=`<span class="to-prev"></span><ul class="page-wrap">`;
			for(var i=0; i<num; i++){
				if(i<4){
					str+='<li>'+(i+1)+'</li>';
				}else if(i>=4&&i<=num-2){
					str+='<li class="dot">...</li>';
				}else{
					str+='<li>'+(i+1)+'</li>';
				}
			}		
			str+=`</ul><span class="to-next"></span>`;
			pagingCon.html(str);
			
		}else if(isClass=='fourth'){
			str+=`<span class="to-prev"></span><ul class="page-wrap">`;
			for(var i=0; i<num; i++){
				if(i<5){
					str+='<li>'+(i+1)+'</li>';
				}else if(i>=5&&i<=num-2){
					str+='<li class="dot">...</li>';
				}else{
					str+='<li>'+(i+1)+'</li>';
				}
			}		
			str+=`</ul><span class="to-next"></span>`;
			pagingCon.html(str);
			
		}else if(isClass=='middle'){
			var mid=Math.ceil((num/2));
			var n=Index-mid;
			n++;
			str+=`<span class="to-prev"></span><ul class="page-wrap">`;
			for(var i=0; i<num; i++){
				if(i<1){
					str+='<li>'+(i+1)+'</li>';
				}else if(i>=1&&i<mid-2+n){
					str+='<li class="dot">...</li>';
				}else if(i>=mid-2+n&&i<mid+1+n){
					str+='<li>'+(i+1)+'</li>';
				}else if(i>=mid+1+n&&i<num-1){
					str+='<li class="dot2">...</li>';
				}else{
					str+='<li>'+(i+1)+'</li>';
				}
			}		
			str+=`</ul><span class="to-next"></span>`;
			pagingCon.html(str);
			
		}else if(isClass=='last-4'){
			var mid=Math.ceil((num/2));
			str+=`<span class="to-prev"></span><ul class="page-wrap">`;
			for(var i=0; i<num; i++){
				if(i>=1&&i<num-5){
					str+='<li class="dot">...</li>';
				}else{
					str+='<li>'+(i+1)+'</li>';
				}
			}		
			str+=`</ul><span class="to-next"></span>`;
			pagingCon.html(str);
			
		}else if(isClass=='last-3'){
			var mid=Math.ceil((num/2));
			str+=`<span class="to-prev"></span><ul class="page-wrap">`;
			for(var i=0; i<num; i++){
				if(i>=1&&i<num-4){
					str+='<li class="dot">...</li>';
				}else{
					str+='<li>'+(i+1)+'</li>';
				}
			}		
			str+=`</ul><span class="to-next"></span>`;
			pagingCon.html(str);
			
		}else if(isClass=='last-2'){
			var mid=Math.ceil((num/2));
			str+=`<span class="to-prev"></span><ul class="page-wrap">`;
			for(var i=0; i<num; i++){
				if(i>=1&&i<num-3){
					str+='<li class="dot">...</li>';
				}else{
					str+='<li>'+(i+1)+'</li>';
				}
			}		
			str+=`</ul><span class="to-next"></span>`;
			pagingCon.html(str);
			
		}else if(isClass=='last-1'){
			var mid=Math.ceil((num/2));
			str+=`<span class="to-prev"></span><ul class="page-wrap">`;
			for(var i=0; i<num; i++){
				if(i>=1&&i<num-3){
					str+='<li class="dot">...</li>';
				}else{
					str+='<li>'+(i+1)+'</li>';
				}
			}		
			str+=`</ul>`;
			pagingCon.html(str);
			
		}
		var oPrev=$('.to-prev');//左按键
		var oNext=$('.to-next');//右按键
		var aBtn=$('.page-wrap li');//每一项
		var len=aBtn.length;

		//隐藏多余的...
		$('.dot').each(function(index,item){
			if(index>0){
				$(item).css('display','none');
			}
		});
		$('.dot2').each(function(index,item){
			if(index>0){
				$(item).css('display','none');
			}
		});

		//选中项的标识
		if(isClass!='init'){
			$(aBtn[curIndex]).removeClass('active');
		}
		$(aBtn[Index]).addClass('active');
		curIndex=Index;

		//点击每项的重新布局
		$(aBtn).each(function(index,item){
			$(item).on('click',function(){
				getNumToRender(index);
				jsonData.pageNum=index+1;
				dataRender();
			});
		});

		//向前
		oPrev.on('click',function(){
			curIndex--;
			getNumToRender(curIndex);
			jsonData.pageNum=curIndex+1;
			dataRender();
		});

		//向后
		oNext.on('click',function(){
			curIndex++;
			getNumToRender(curIndex);
			jsonData.pageNum=curIndex+1;
			dataRender(curIndex+1);
		});

		//获取当前页数重新布局
		function getNumToRender(num){
			if(num==0){
				renderPage('init',num);
			}else if(num==1){
				renderPage('second',num);
			}else if(num==2){
				renderPage('third',num);
			}else if(num==3){
				renderPage('fourth',num);
			}else if(num>3&&num<len-4){
				renderPage('middle',num);
			}else if(num==len-4){
				renderPage('last-4',num);
			}else if(num==len-3){
				renderPage('last-3',num);
			}else if(num==len-2){
				renderPage('last-2',num);
			}else if(num==len-1){
				renderPage('last-1',num);
			}
		}
	}
}
