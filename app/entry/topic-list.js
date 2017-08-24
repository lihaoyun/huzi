import '../css/public.css';
import '../css/topic-list.css';
import $ from 'jquery';
import apiUrl from '../js/config';
import {rand,signName,reTop,tabBar,imgLazy,setSto,getSto,cartCount,rmSto,allSto,url_search,setICPLocation,reSetICPLocation} from '../js/config';


//商品列表
(function(){
    var oCon=$('.guess-like-public ul');
    var iBtn=true;//控制分页器只布局一次的关

    dataRender(1);

	function dataRender(pageNum){
		reSetICPLocation();
    	var str='';
    	var pageSize=16;
	    $.ajax({
	        type:'get',
	        url:apiUrl+'/home/topic/queryTopicById',
	        data:{
	            topicId:url_search().id,
	            pageNum:pageNum,
	            pageSize:pageSize
	        },
	        success:function(data){
	            if(data.head.code){
	                console.log(data.head.message);
	            }
	            
	            var data=data.body;
				console.log(data);
				$('.banner img').attr('src',data.topic.mainPicture);
	            data.topicGoodsVo.forEach(function(item,index){
		            str+=`<li class="goods-gife-item-public">`;
		            str+=`<div><img src="" alt="" data-src=${item.goodsPicture}>
		                    <p>${item.name}</p>`;
		                    str+='<em>￥'+parseInt(item.salePrice)+'</em>';
		                str+=`</div>
		                <a href=product-details.html?id=${item.id} target="_blank"></a>`;
		            str+=`</li>`;
		        });

		        $(oCon).html(str);
		        setICPLocation();
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
						dataRender(curIndex);
						$(this).get(0).className='active';
					});
				})(i);
			}

			//向前
			oPrev.on('click',function(){
				if(curIndex==0) return;//如果当前是第一页 则不往下继续
				aBtn[curIndex].className='';
				curIndex--;
				dataRender(curIndex);
				aBtn[curIndex].className='active';
			});

			//向后
			oNext.on('click',function(){
				if(curIndex==(num-1)) return;//如果当前是最后一页 则不往下继续
				aBtn[curIndex].className='';
				curIndex++;
				dataRender(curIndex);
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