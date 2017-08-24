import '../css/public.css';
import '../css/product-list.css';
import $ from 'jquery';
import apiUrl from '../js/config';
import {rand,signName,reTop,tabBar,findArrIndex,imgLazy,setSto,getSto,cartCount,rmSto,allSto,setICPLocation,reSetICPLocation} from '../js/config';
//获取购物车数量
cartCount($('.func-public em'));


var getUrl=apiUrl+'/home/queryHomeGoodsByPage';
var sortId=[1];
var styleId=[];
var materialId=[];
var priceId=[];
var targetId=[];
var labelId=[];
var pageNum=1;
var pageSize=16;
var jsonData={
        type:5,
        pageNum:pageNum,
        pageSize:pageSize
    };
var iBtn=true;//控制分页器只布局一次的关
////////////////////////////////////获取选项栏及列表数据////////////////////////////////////
var oOl=$('.tab-bar');//选项栏外层
var aOlLi=$('.tab-bar li');//选项栏的tab项

var oUl=$('.goods-gife-list');//列表外层
var oUl1=$('.goods-gife-list1');//列表外层
var str='';


// if(getSto('goods-list')){
//     var jsonGoodsList=JSON.parse(getSto('goods-list'));
//     getUrl=apiUrl+'/home/list/queryGoodsByParamAndPage';
//     jsonData={
//         pageNum:1,
//         pageSize:10,
//         sortIds:1,
//         styleIds:jsonGoodsList.styleIds,
//         materialIds:jsonGoodsList.materialIds,
//         priceIds:jsonGoodsList.priceIds
//     };
// }

var iBtnNum=0;

//选项栏
$.ajax({
    type:'get',
    url:apiUrl+'/search/result/queryConfig',
    data:{
    },
    success:function(data){
        if(data.head.code){
            console.log(data.head.message);
            return;
        }
        var data=data.body;
        
        //为了保持前一个选项栏的选中状态而对数据进行加工(增加每项active的状态记录)
        for(var name in data){
            data[name].forEach(function(item,index){
                if(index==0){
                    item.active=true;
                }else{
                    item.active=false;
                }
            });
        }

        if(getSto('goods-list')){
            var jsonGoodsList=JSON.parse(getSto('goods-list'));
            sortId=[1];
            styleId=jsonGoodsList.styleIds||[];
            materialId=jsonGoodsList.materialIds||[];
            priceId=jsonGoodsList.priceIds||[];
        }
        console.log('-styleId:',styleId,'-materialId:',materialId,'-priceId:',priceId);
        for(var name in data){
        	if(name=='sorts'){
        		continue;
        	}
        	renderTab(data[name],name);
        }

        //类型、材质、范围
		(function(){
			var aCon=$('.tab-bar-item ul');
			var aI=$('.tab-bar-item i');
			
			var aTypeLi=$('.styles li');
			var aMaterialLi=$('.materials li');
			var aPriceLi=$('.prices li');
			var oTypeP=$('.styles p');
			var oMaterialP=$('.materials p');
			var oPriceP=$('.prices p');
			

			toggleBtn(aTypeLi,oTypeP,'styles');
			toggleBtn(aMaterialLi,oMaterialP,'materials');
			toggleBtn(aPriceLi,oPriceP,'prices');
			

            if(getSto('goods-list')){
                var jsonGoodsList=JSON.parse(getSto('goods-list'));
                console.log('d:',jsonGoodsList);
                for(var name in jsonGoodsList){
                    if(name=='styleIds'){
                        selectStatus($('.styles li'),'styleIds');
                    }
                    if(name=='materialIds'){
                        selectStatus($('.materials li'),'materialIds');
                    }
                    if(name=='priceIds'){
                        selectStatus($('.prices li'),'priceIds');
                    }

                }

                function selectStatus(arr,name){//console.log('name:',name);
                    arr.forEach(function(item,index){//console.log('item:',item);
                        jsonGoodsList[name].forEach(function(item1,index1){//console.log('item1:',item1);
                            if(item1){
                                if(index==(item1-1)){
                                    $(item).addClass('active');
                                    item.iBtn=false;
                                }
                            }
                        });
                    });
                }
            }

			//切换选中和未选中状态
			function toggleBtn(aLi,p,type){
				var arr=[];

				aLi.each(function(index,item){
					item.iBtn=true;
					$(item).on('click',function(){

						switch(type){
							case 'styles':
								if(item.iBtn){
									$(item).addClass('active');
									p.addClass('active');
									arr.push($(this).text());
									styleId[index]=parseInt(item.dataset.id);
									p.text(arr.join('，'));
								}else{
									$(item).removeClass('active');
									arr.splice(findArrIndex(arr,$(this).text()),1);
									styleId[index]='';
									p.text(arr.join('，'));
									if(arr.length==0){
										p.removeClass('active');
										p.text('全部');
									}
								}
							break;
							case 'materials':
								if(item.iBtn){
									$(item).addClass('active');
									p.addClass('active');
									arr.push($(this).text());
									materialId[index]=parseInt(item.dataset.id);
									p.text(arr.join('，'));
								}else{
									$(item).removeClass('active');
									arr.splice(findArrIndex(arr,$(this).text()),1);
									materialId[index]='';
									p.text(arr.join('，'));
									if(arr.length==0){
										p.removeClass('active');
										p.text('全部');
									}
								}
							break;
							case 'prices':
								if(item.iBtn){
									$(item).addClass('active');
									p.addClass('active');
									arr.push($(this).text());
									priceId[index]=parseInt(item.dataset.id);
									p.text(arr.join('，'));
								}else{
									$(item).removeClass('active');
									arr.splice(findArrIndex(arr,$(this).text()),1);
									priceId[index]='';
									p.text(arr.join('，'));
									if(arr.length==0){
										p.removeClass('active');
										p.text('全部');
									}
								}
							break;
						}
                        // setSto('goods-list',JSON.stringify({
                        //     //sortIds:sortId,
                        //     styleIds:styleId,
                        //     materialIds:materialId,
                        //     priceIds:priceId
                        // }));

						console.log('-styleId:',styleId,'-materialId:',materialId,'-priceId:',priceId);
						item.iBtn=!item.iBtn;

	                    iBtnNum=0;
	                  	iBtn=true;
	                    getUrl=apiUrl+'/home/list/queryGoodsByParamAndPage';
			           	jsonData={
					        pageNum:pageNum,
					        pageSize:pageSize,
			                sortIds:sortId,
			                styleIds:styleId,
			                materialIds:materialId,
			                priceIds:priceId
					    };
	                    dataRender();
					});
				});
			}
		})();


        function renderTab(arr,type){
        	var str='';
        	var itemCon=$('.'+type);
            arr.forEach(function(item,index1){
                if(item.active){
                    str+=`<li class="" data-id=${item.id} data-type=${type}>
                        ${item.name}
                        <b></b>
                    </li>`;
                }else{ 
                    str+=`<li data-id=${item.id} data-type=${type}>
                        ${item.name}
                        <b></b>
                    </li>`;
                }
            });
            $(itemCon).html(str); 
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

function pagingRenderDom(num){console.log('num:',num);
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
