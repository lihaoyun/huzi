import '../css/public.css';
import '../css/gift-list.css';
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
        type:2,
        pageNum:pageNum,
        pageSize:pageSize
    };
var iBtn=true;//控制分页器只布局一次的关
////////////////////////////////////弹出送给谁及为了庆祝什么的弹层////////////////////////////////////
var timer=null;

$('.kind-gife .for-who').get(0).onclick=$('.kind-gife .for-what').get(0).onclick=function(){
	$('.for-list-public').css('display','block');
	timer=setTimeout(function(){
		$('.for-list-public').css('opacity',1);
	},50);
};

var forWhoUl=$('.for-who-list-public');
var forWhatUl=$('.for-what-list-public');
var forWhoLi=$('.for-who-list-public li');
var forWhatLi=$('.for-what-list-public li');
var sLabel='';

$.ajax({
    type:'get',
    url:apiUrl+'/home/queryLabels',
    data:{},
    success:function(data){
        
        if(data.head.code){
            console.log(data.head.message);
            return;
        }
        var data=data.body;

        data.labels.forEach(function(item,index){
            sLabel+=`<li data-id=${item.id}>${item.labelContent}<i></i></li>`;
        });
        $(forWhatUl).html(sLabel);

        var forWhatLi=$('.for-what-list-public li');

        //送给谁的点击选择
        forWhoLi.each(function(index,item){
            $(item).attr('data-btn','true');

            $(item).on('click',function(){
                if($(this).hasClass('active')){//连续点击未选中单个按钮
                    $(item).attr('data-btn','true');
                    $(item).removeClass('active');
                    targetId[0]='';
                    $('.for-who p').text('送给谁？');
                }else{//选中单个按钮
                    forWhoLi.each(function(index1,item1){
                        $(item1).attr('data-btn','true');
                        $(item1).removeClass('active');
                    });
                    $(this).attr('data-btn','false');
                    $(this).addClass('active');
                    targetId[0]=parseInt(item.dataset.id);
                    $('.for-who p').text($(this).text());
                }

                //选择宝爸宝妈时“为了庆祝什么”的显示和隐藏
                forWhoLi.each(function(index1,item1){
                    if($(item1).hasClass('parents')){
                        forWhatLi.each(function(index,item){
                            $(item).attr('data-btn','true');
                            $(item).removeClass('active');
                            $('.for-what p').text('为了庆祝什么？');
                        });

                        if($(item1).attr('data-btn')=='false'){
                            forWhatUl.css('display','none');
                        }else if($(item1).attr('data-btn')=='true'){
                            forWhatUl.css('display','block');
                        }

                        labelId[0]='';
                    }

                });
            });
        });

        //为了庆祝什么的点击选择
        forWhatLi.each(function(index,item){
            $(item).attr('data-btn','true');

            $(item).on('click',function(){
                if($(this).hasClass('active')){//连续点击未选中单个按钮
                    $(item).attr('data-btn','true');
                    $(item).removeClass('active');
                    labelId[0]='';
                    $('.for-what p').text('为了庆祝什么？');
                }else{//选中单个按钮
                    forWhatLi.each(function(index,item){
                        $(item).attr('data-btn','true');
                        $(item).removeClass('active');
                    });
                    $(this).attr('data-btn','false');
                    $(this).addClass('active');
                    labelId[0]=parseInt(item.dataset.id);
                    $('.for-what p').text($(this).text());
                }
            });
        });


        //确定按钮点击
        $('.for-btn').get(0).onclick=function(){
            $('.for-list-public').css('opacity',0);
            timer=setTimeout(function(){
                $('.for-list-public').css('display','none');
            },550);

            //console.log('targetId:',targetId,'-labelId:',labelId);

            getUrl=apiUrl+'/home/list/queryGoodsByParamAndPage';
           	jsonData={
		        pageNum:pageNum,
		        pageSize:pageSize,
		        targetIds:targetId,
                labelIds:labelId,
                sortIds:sortId,
                styleIds:styleId,
                materialIds:materialId,
                priceIds:priceId
		    };

			iBtn=true;//控制分页器只布局一次的关
			dataRender();
        };
    },
    error:function(err){
        console.log(err);
        return;
    }
});


////////////////////////////////////获取选项栏及列表数据////////////////////////////////////
//选项栏的展开和收缩
(function(){
 var aTab=$('.tab-bar-public>li');
 var oCon=$('.tab-bar-con');

 aTab.each(function(index,item){
     item.dataset.btn='false';

     $(item).on('click',function(){
         if(item.dataset.btn=='false'){
            aTab.each(function(index1,item1){
                item1.dataset.btn='false';
            });
            item.dataset.btn='true';
            $('.tab-bar-con').css('display','block');
            setTimeout(function(){
                $('.tab-bar-con').css('opacity',1);
            },50);
         }else{
            item.dataset.btn='false';
            $('.tab-bar-con').css('opacity',0);
            setTimeout(function(){
                $('.tab-bar-con').css('display','none');
            },500);
         }
     });
 });
})();

var oOl=$('.tab-bar-public');//选项栏外层
var aOlLi=$('.tab-bar-public li');//选项栏的tab项
var itemCon=$('.tab-bar-con ul');
var str='';

//选项栏
$.ajax({
    type:'get',
    url:apiUrl+'/search/result/queryConfig',
    data:{
    },
    success:function(data){
        //console.log(data);
        if(data.head.code){
            console.log(data.head.message);
            return;
        }
        var data=data.body;
        //为了保持前一个选项栏的选中状态而对数据进行加工(增加每项active的状态记录)
        for(var name in data){
            data[name].forEach(function(item,index){
                if(index==0){
                    //item.active=true;
                }else{
                    item.active=false;
                }
            });
        }
        //切换选项栏数据
        aOlLi.each(function(index,item){
            $(item).on('click',function(){
                var strItem='';
                
                switch(index){
                    case 0:
                        renderTab(data.sorts,strItem,'sorts');
                    break;
                    case 1:
                        renderTab(data.styles,strItem,'styles');
                    break;
                    case 2:
                        renderTab(data.materials,strItem,'materials');
                    break;
                    case 3:
                        renderTab(data.prices,strItem,'prices');
                    break;
                }

                //点击选项
                var aItem=$('.tab-bar-con li');//选项栏的内容项
                
                //点击选项栏获取不同排序的数据
                aItem.each(function(index1,item1){
                    $(item1).on('click',function(){
                        switch(item1.dataset.type){
                            case 'sorts':
                                sortId[0]=parseInt(item1.dataset.id);
                                var sText=$(item1).find('span').text();
                                $(aOlLi[0]).find('span').html(sText);
                            break;
                            case 'styles':
                                styleId[0]=parseInt(item1.dataset.id);
                                $(aOlLi[1]).find('span').text($(item1).find('span').text());
                            break;
                            case 'materials':
                                materialId[0]=parseInt(item1.dataset.id);
                                $(aOlLi[2]).find('span').text($(item1).find('span').text());
                            break;
                            case 'prices':
                                priceId[0]=parseInt(item1.dataset.id);
                                $(aOlLi[3]).find('span').text($(item1).find('span').text());
                            break;
                        }

                        //保持前一个选项栏的选中状态
                        data[item1.dataset.type].forEach(function(item2,index2){
                            item2.active=false;
                        });
                        data[item1.dataset.type][index1].active=true;

                        //选中项后折回
                        $('.tab-bar-con').css('opacity',0);
			            setTimeout(function(){
			            	$('.tab-bar-con').css('display','none');
			            },500);
                        $(aOlLi).each(function(index1,item1){
                            item1.dataset.btn='false';
                        });

                        //console.log('sortId:',sortId,'-styleId:',styleId,'-materialId:',materialId,'-priceId:',priceId);
                        //console.log(classof(sortId));
                       

                        getUrl=apiUrl+'/home/list/queryGoodsByParamAndPage';
			           	jsonData={
					        pageNum:pageNum,
					        pageSize:pageSize,
					        targetIds:targetId,
			                labelIds:labelId,
			                sortIds:sortId,
			                styleIds:styleId,
			                materialIds:materialId,
			                priceIds:priceId
					    };

						iBtn=true;//控制分页器只布局一次的关
						dataRender();

                        aItem.each(function(index2,item2){
                            $(item2).removeClass('active');
                        });
                        $(item1).addClass('active');
                    });
                });
            });
        });

        function renderTab(arr,str,type){
            arr.forEach(function(item,index){
                if(item.active){
                    if(type=='sorts'&&item.id==3){
                        str+=`<li class="active" data-id=${item.id} data-type=${type}>`;
                            str+='<span>'+item.name+'</span>';
                            str+=`<i></i>
                        </li>`;
                    }else if(type=='sorts'&&item.id==4){
                        str+=`<li class="active" data-id=${item.id} data-type=${type}>`;
                            str+='<span>'+item.name+'</span>';
                            str+=`<i></i>
                        </li>`;
                    }else{
                        str+=`<li class="active" data-id=${item.id} data-type=${type}>
                            <span>${item.name}</span>
                            <i></i>
                        </li>`;
                    }
                }else{ 
                    if(type=='sorts'&&item.id==3){
                        str+=`<li class="" data-id=${item.id} data-type=${type}>`;
                            str+='<span>'+item.name+'</span>';
                            str+=`<i></i>
                        </li>`;
                    }else if(type=='sorts'&&item.id==4){
                        str+=`<li class="" data-id=${item.id} data-type=${type}>`;
                            str+='<span>'+item.name+'</span>';
                            str+=`<i></i>
                        </li>`;
                    }else{
                        str+=`<li class="" data-id=${item.id} data-type=${type}>
                            <span>${item.name}</span>
                            <i></i>
                        </li>`;
                    }
                }
            });
            $(itemCon).html(str);
            // $('.tab-bar-con').css('display','block');
            // setTimeout(function(){
            // 	$('.tab-bar-con').css('opacity',1);
            // },50);
        }
    },
    error:function(err){
        console.log(err);
        return;
    }
});
////////////////////////////////////初始化商品列表////////////////////////////////////

var oCon=$('.guess-like-public ul');

dataRender();

function dataRender(){
    // 设置页尾的位置
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
	            str+=`<li class="goods-gife-item-public">`;
	            str+=`<div><img src="" alt="" data-src=${item.goodsPicture}>
	                    <p>${item.shortName}</p>
	                    <em>￥${item.salePrice}</em>
	                </div>
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
	        console.log('data.page:',data.page/pageSize);
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
