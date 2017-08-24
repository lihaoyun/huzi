import '../css/public.css';
import '../css/index.css';
import $ from 'jquery';
import {rand,signName,reTop,tabBar,url_search,imgLazy,setSto,getSto,cartCount,rmSto,allSto} from '../js/config';
import apiUrl from '../js/config';
import md5 from 'md5';

var vipNo=getSto('vipNo');
//页面首次打开的唯一标识
(function(){
    var ID=getSto("deciveID");
    var rnd=rand(rand(1,100),rand(1,10000));
    if(!ID){
        var timestamp=Date.now()+new Date(rnd);//时间戳
        var md5_timestamp=md5(timestamp);

        setSto("deciveID",md5_timestamp);
        $.ajax({
            url:apiUrl+'/random?random='+md5_timestamp,
            success:function(data){

            },
            error:function(err){
                console.log(err);
            }
        });
    }else{
        $.ajax({
            url:apiUrl+'/random?random='+ID,
            success:function(data){

            },
            error:function(err){
                console.log(err);
            }
        });
    }

})();

//首页弹出大礼包开屏
(function(){
	if(!vipNo){
		return;
	}
	var firstlogin = document.URL.split('?')[1];
	if(firstlogin== 'userStatus=0'){
        var oTips=$('.opacity');
        var oBtn2=$('.open-btn');
        var oTips3=$('.close');
        var oTips2=$('.open');
        var oJump=$('.img-wrap span');
        var timer=null;
        var timer2=null;
        var timer3=null;
        var num=3;
        var ID=getSto("deciveID");
        timer=setTimeout(function(){
            $(oTips).css('display','block');
        },50);

        $(oTips).css('opacity',1);
	}



    //点击消失

    $(oBtn2).on('click',function(){

        $(oTips3).css('opacity',0);
    	timer3=setTimeout(function(){
            $(oTips3).css('display','none');
        },550);


        $(oTips2).css('display','block');
        timer2=setTimeout(function(){
        	$(oTips2).css('opacity',1);
        },50);


    });

    $('.look-btn').on('click',function(){
    	location.href='personal-orders.html?item=card';
    });
})();

//获取购物车数量
cartCount($('.func-public em'));
//页面首次打开的唯一标识
(function(){
    var ID=getSto("deciveID");
    var rnd=rand(rand(1,100),rand(1,10000));
    if(!ID){
        var timestamp=Date.now()+new Date(rnd);
        var md5_timestamp=md5(timestamp);

        setSto("deciveID",md5_timestamp);
        $.ajax({
            url:apiUrl+'/random?random='+md5_timestamp,
            success:function(data){

            },
            error:function(err){
                console.log(err);
            }
        });
    }else{
        $.ajax({
            url:apiUrl+'/random?random='+ID,
            success:function(data){

            },
            error:function(err){
                console.log(err);
            }
        });
    }

})();

//从服务器获取数据
(function(){
    var oLoop=$('.swiper-wrapper');//轮播图
    var sLoop='';
    var aSign=$('.wrap-nav dl');//标签
    var oKind=$('.wrap-kinds');
    var sKind='';

    $.ajax({
        type:'get',
        url:apiUrl+'/home/queryTopicAndLabel',
        success:function(data){
            if(data.head.code){
                console.log(data.head.message);
            }

            var data=data.body;

            //展示轮播图
            data.carousels.forEach(function(item,index){
                sLoop+=`<div class="swiper-slide" data-id=${item.id}><img data-src=${item.mainPicture} alt=""><a href="topic-list.html?id=${item.id}" target="_blank"></a></div>`;
            });

            oLoop.html(sLoop);

			//首页内容里的轮播
            (function(){
                var mySwiper = new Swiper('.swiper-container',{
					direction:"horizontal",/*横向滑动*/
				    loop:true,
				    prevButton:".swiper-button-prev",/*前进按钮*/
					nextButton:".swiper-button-next",/*后退按钮*/

				});
                //图片懒加载
                (function(){
                    var aImg=$('.swiper-slide img');
                    imgLazy(aImg);
                })();
            })();

            //展示标签
            data.labels.forEach(function(item,index){
                $(aSign[index]).attr('data-id',item.id);
                $(aSign[index]).find('dd').text(item.labelContent);
            });

            //专题列表展示
            data.topicBody.forEach(function(item0,index){
                if(index==0){
                    $('.new-goods a:first-child').attr('href','topic-list.html?id='+item0.topic.id);
                    $('.new-goods a:nth-of-type(2)').attr('href','personal-process.html');
                }else if(index>=1){
                    sKind+=`<div class="gife-born">`;
                    sKind+='<h2><img src="" data-src="'+require('../imgs/pic-title'+index+'.png')+'" alt=""></h2>';
                    sKind+=`<div class="pic-baby1"><img src="" data-src=${item0.topic.mainPicture} alt=""><a href="topic-list.html?id=${item0.topic.id}" target="_blank"></a></div><ul>`;
                            if(item0.item){
                                item0.item.forEach(function(item1,index1){
                                sKind+=`<li>
                                        <img src="" data-src=${item1.mainPicture} alt="">
                                        <h4>${item1.title}</h4>
                                        <p>${item1.subTitle}</p>
                                        <a href="product-details.html?id=${item1.goodsId}" target="_blank"></a>
                                    </li>`;
                                });

                            }

                    sKind+=`</ul></div>`;
                }

            });
            $(oKind).html(sKind);

            //图片懒加载
            (function(){
                var aImg=$('.wrap-kinds img');
                imgLazy(aImg);
            })();
        },
        error:function(err){
            console.log(err);
        }
    });
})();

//商品列表
(function(){
    var oCon=$('.guess-like-public ul');
    var iBtn=true;//控制分页器只布局一次的关

    dataRender(1);
	function dataRender(pageNum){
    	var str='';
    	var pageSize=16;
	    $.ajax({
	        type:'get',
	        url:apiUrl+'/home/queryHomeGoodsByPage',
	        data:{
		        type:1,
		        pageNum:pageNum,
		        pageSize:pageSize
		    },
	        success:function(data){
	            if(data.head.code){
	                console.log(data.head.message);
	            }

	            var data=data.body;
	            // 新品推荐
	            var newGoods=$('.new-goods a:nth-of-type(3)');
	            $(newGoods).attr('href','product-details.html?id='+'3');

	            data.goodsVoList.forEach(function(item,index){
		            str+=`<li class="goods-gife-item-public">`;
		            str+=`<div><img src="" alt="" data-src=${item.goodsPicture}>
		                    <p>${item.shortName}</p>
		                    <em>￥${item.salePrice}</em>
		                </div>
		                <a href=product-details.html?id=${item.id} target="_blank"></a>`;
		            str+=`</li>`;
		        });
		        $(oCon).html(str);
		        //图片懒加载
		        (function(){
		            var aImg=$('.guess-like-public img');
		            imgLazy(aImg);
		        })();

				var pageCount=Math.ceil(data.page/pageSize);
				// 分页器
				if(iBtn){
					pagingRenderDom(pageCount);
					iBtn=false;
				}

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
						dataRender(curIndex+1);
						$(this).get(0).className='active';
					});
				})(i);
			}

			//向前
			oPrev.on('click',function(){
				if(curIndex==0) return;//如果当前是第一页 则不往下继续
				aBtn[curIndex].className='';
				curIndex--;
				dataRender(curIndex+1);
				aBtn[curIndex].className='active';
			});

			//向后
			oNext.on('click',function(){
				if(curIndex==(num-1)) return;//如果当前是最后一页 则不往下继续
				aBtn[curIndex].className='';
				curIndex++;
				dataRender(curIndex+1);
				aBtn[curIndex].className='active';
			});

		}else{//如果大于等于9页
			renderPage('init',0);
		}

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
					dataRender(index+1);
				});
			});

			//向前
			oPrev.on('click',function(){
				curIndex--;
				getNumToRender(curIndex);
				dataRender(curIndex+1);
			});

			//向后
			oNext.on('click',function(){
				curIndex++;
				getNumToRender(curIndex);
				dataRender(curIndex+1);
			});

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

})();





