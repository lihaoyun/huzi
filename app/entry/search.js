import '../css/public.css';
import '../css/search.css';
import $ from 'jquery';
import apiUrl from '../js/config';
import {rand,signName,reTop,tabBar,imgLazy,setSto,getSto,cartCount,rmSto,allSto,getLto,noRepeat,setLto,rmLto,setICPLocation,reSetICPLocation} from '../js/config';
import md5 from 'md5';
var vipNo=getSto('vipNo');
var token=getSto('token');
//获取购物车数量
cartCount($('.func-public em'));

var getUrl=apiUrl+'/home/queryHomeGoodsByPage';
var sortId=[];
var styleId=[];
var materialId=[];
var priceId=[];
var targetId=[];
var labelId=[];
var keyVal='';//搜索关键字
var statusBtn=true;
var pageNum=1;
var pageSize=16;
var saleIndex;
var styleIndex;
var materialIndex;
var priceIndex;
var jsonData={
        type:4,
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
var labelCon=$('.search-classify');
var sLabel='';

//送给谁和为了庆祝什么
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
        $(labelCon).html(sLabel);

        //标签搜索
        var aLabel=$('.search-classify li');
        aLabel.each(function(index,item){
            $(item).on('click',function(){
                keyVal=$(item).text();
                targetId=[];
                labelId=[];
                sortId=[];
                styleId=[];
                materialId=[];
                priceId=[];
                jsonData={
                    type:1,
                    pageNum:pageNum,
                    pageSize:pageSize,
                    keyWord:keyVal
                };
                getUrl=apiUrl+'/search/result/queryGoodsBykeyWordAndPage';
                iBtn=true;//控制分页器只布局一次的关
                dataRender();

                saleIndex=9;
                styleIndex=9;
                materialIndex=9;
                priceIndex=9;
                $(item).addClass('active').siblings().removeClass('active');
                $('.tab-bar-con li').each(function(index,item){console.log(1111);
                    $(item).removeClass('active');
                });
                $(aOlLi[0]).find('span').html('人气');
                $(aOlLi[1]).find('span').html('款式');
                $(aOlLi[2]).find('span').html('材质');
                $(aOlLi[3]).find('span').html('价格范围');
            });
        });

        
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
        var aOlLi=$('.tab-bar-public li');//选项栏的tab项

        //确定按钮点击
        $('.search-finish').get(0).onclick=function(){
            $('.for-list-public').css('opacity',0);
            timer=setTimeout(function(){
                $('.for-list-public').css('display','none');
            },550);

            //console.log('targetId:',targetId,'-labelId:',labelId);
            keyVal='';
			sortId=[];
			styleId=[];
			materialId=[];
			priceId=[];
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
			saleIndex=9;
			styleIndex=9;
			materialIndex=9;
			priceIndex=9;
			$('.tab-bar-con li').each(function(index,item){console.log(1111);
				$(item).removeClass('active');
			});
			$(aOlLi[0]).find('span').html('人气');
			$(aOlLi[1]).find('span').html('款式');
			$(aOlLi[2]).find('span').html('材质');
			$(aOlLi[3]).find('span').html('价格范围');
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
        //console.log('x:',data);
        //为了保持前一个选项栏的选中状态而对数据进行加工(增加每项active的状态记录)
        // for(var name in data){
        //     data[name].forEach(function(item,index){
        //         if(index==0){
        //             //item.active=true;
        //         }else{
        //             item.active=false;
        //         }
        //     });
        // }
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
                                saleIndex=index1;
                            break;
                            case 'styles':
                                styleId[0]=parseInt(item1.dataset.id);
                                $(aOlLi[1]).find('span').text($(item1).find('span').text());
                                styleIndex=index1;
                            break;
                            case 'materials':
                                materialId[0]=parseInt(item1.dataset.id);
                                $(aOlLi[2]).find('span').text($(item1).find('span').text());
                                materialIndex=index1;
                            break;
                            case 'prices':
                                priceId[0]=parseInt(item1.dataset.id);
                                $(aOlLi[3]).find('span').text($(item1).find('span').text());
                                priceIndex=index1;
                            break;
                        }
                        statusBtn=true;
                        //保持前一个选项栏的选中状态

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
                       
                        getUrl=apiUrl+'/search/result/queryGoodsBykeyWordAndPage';
			           	jsonData={
					        pageNum:pageNum,
					        pageSize:pageSize,
					        targetIds:targetId,
			                labelIds:labelId,
			                sortIds:sortId,
			                styleIds:styleId,
			                materialIds:materialId,
			                priceIds:priceId,
			                keyWord:keyVal
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
            var sIndex=0;
            arr.forEach(function(item,index){
                sIndex++;
        	 	if(type=='sorts'){
        	 		if(saleIndex==index){
	        	 		str+=`<li class="active" data-id=${item.id} data-type=${type}>`;
	                        str+='<span>'+item.name+'</span>';
	                        str+=`<i></i>
	                    </li>`;
        	 		}else{
	        	 		str+=`<li class="" data-id=${item.id} data-type=${type}>`;
	                        str+='<span>'+item.name+'</span>';
	                        str+=`<i></i>
	                    </li>`;
        	 		}
        	 	}

        	 	if(type=='styles'){
                    //if(index<4){
                        if(styleIndex==index){
                            str+=`<li class="active" data-id=${item.id} data-type=${type}>`;
                                str+='<span>'+item.name+'</span>';
                                str+=`<i></i>
                            </li>`;
                        }else{
                            str+=`<li class="" data-id=${item.id} data-type=${type}>`;
                                str+='<span>'+item.name+'</span>';
                                str+=`<i></i>
                            </li>`;
                        }
                    //}else if(index>4){
                        //return;
                    //}
        	 		console.log(sIndex);
        	 	}

        	 	if(type=='materials'){
        	 		if(materialIndex==index){
	        	 		str+=`<li class="active" data-id=${item.id} data-type=${type}>`;
	                        str+='<span>'+item.name+'</span>';
	                        str+=`<i></i>
	                    </li>`;
        	 		}else{
	        	 		str+=`<li class="" data-id=${item.id} data-type=${type}>`;
	                        str+='<span>'+item.name+'</span>';
	                        str+=`<i></i>
	                    </li>`;
        	 		}
        	 	}

        	 	if(type=='prices'){
        	 		if(priceIndex==index){
	        	 		str+=`<li class="active" data-id=${item.id} data-type=${type}>`;
	                        str+='<span>'+item.name+'</span>';
	                        str+=`<i></i>
	                    </li>`;
        	 		}else{
	        	 		str+=`<li class="" data-id=${item.id} data-type=${type}>`;
	                        str+='<span>'+item.name+'</span>';
	                        str+=`<i></i>
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

//搜索//////////////////////////////////////////////////////////////////////////////////

var iLogin=true;//判断登录条件
var oInput=$('.for-search input');
var oUl=$('.goods-history ul');
var oSearchBtn=$('.btn-search');
//var vipNo=sessionStorage.getItem("vipNo");
//var token=sessionStorage.getItem("token");

$(document).on('click',function(){
    $('.goods-history').css('display','none');
    
});

oInput.on('click',function(ev){
    ev.stopPropagation();
});


var vipNo=getSto('vipNo');
if(vipNo){//登录
    //添加搜索记录
    
    $(oSearchBtn).on('click',function(ev){
        var val=oInput.val();
        var vipNo=getSto('vipNo');
        var token=getSto('token');
        if(val!=''){
        	//添加历史记录
            $.ajax({
                type:'get',
                headers:signName(md5,vipNo,token),
                url:apiUrl+'/user/search/add',
                data:{
                    memberNo:vipNo,
                    searchContent:val,
                    businessCase:2
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

        			keyVal=val;
        			targetId=[];
					labelId=[];
					sortId=[];
					styleId=[];
					materialId=[];
					priceId=[];
        			jsonData={
        				type:1,
				        pageNum:pageNum,
				        pageSize:pageSize,
				        keyWord:val
				    };
					iBtn=true;//控制分页器只布局一次的关
					dataRender();

					saleIndex=9;
					styleIndex=9;
					materialIndex=9;
					priceIndex=9;
					$('.tab-bar-con li').each(function(index,item){
						$(item).removeClass('active');
					});
					$(aOlLi[0]).find('span').html('人气');
					$(aOlLi[1]).find('span').html('款式');
					$(aOlLi[2]).find('span').html('材质');
					$(aOlLi[3]).find('span').html('价格范围');
                    //window.location.href=encodeURI(encodeURI('goods-search-result.html?keyword='+val));
                },
                error:function(err){
                    console.log(err);
                },
            });
            
        }else{
            alert('搜索内容不能为空');
        } 
    });

    oInput.on('focus',function(ev){
    	var vipNo=getSto('vipNo');
        var str='';
        $.ajax({
            type:'get',
            headers:signName(md5,vipNo,getSto('token')),
            url:apiUrl+'/user/search/get',
            data:{
                memberNo:vipNo,
                businessCase:2
            },
            success:function(data){
                if(data.head.code){
                    cancelImgLayer();
                    if(data.head.code==71982){
                        rmSto('nickname');
                        rmSto('timestamp');
                        rmSto('token');
                        rmSto('vipNo');
                        alert('出现错误，请重新登录！');
                        location.href='personal-orders.html';
                    }
                    alert(data.head.message);
                }

                var arr=data.body.searchs;
            
                arr.forEach(function(item,index){
                    str+='<li>';
                    str+='<i></i><span>'+item.searchContent+'</span><a id='+item.id+' href="javascript:;" target="_blank"></a>';
                    str+='</li>';
                });
                oUl.html(str);
              
                $('.goods-history').css('display','block');

                //点击搜索结果
                (function(){
                    var aLi=$('.goods-history>ul>li');
                    aLi.each(function(index,item){
                        $(item).on('click',function(ev){
                        	keyVal=$(item).find('span').text();
		        			targetId=[];
							labelId=[];
							sortId=[];
							styleId=[];
							materialId=[];
							priceId=[];
		        			jsonData={
		        				type:1,
						        pageNum:pageNum,
						        pageSize:pageSize,
						        keyWord:$(item).find('span').text()
						    };
						    getUrl=apiUrl+'/search/result/queryGoodsBykeyWordAndPage';
							iBtn=true;//控制分页器只布局一次的关
                            $('.for-search input').val(keyVal);
							dataRender();

							saleIndex=9;
							styleIndex=9;
							materialIndex=9;
							priceIndex=9;
							$('.tab-bar-con li').each(function(index,item){console.log(1111);
								$(item).removeClass('active');
							});
							$(aOlLi[0]).find('span').html('人气');
							$(aOlLi[1]).find('span').html('款式');
							$(aOlLi[2]).find('span').html('材质');
							$(aOlLi[3]).find('span').html('价格范围');
							$('.goods-history').css('display','none');
                            //window.location.href=encodeURI(encodeURI('goods-search-result.html?keyword='+$(item).find('span').text()));
                            ev.stopPropagation();
                        });
                    });
                })();

                //如果搜索记录为小于2条时不显示“展开全部”和“清除历史记录”
                if($('.goods-history ul>li').length<=2){
                    $('.show-all').css('display','none');
                }

                //如果搜索记录为0时不显示“展开全部”和“清除历史记录”
                if($('.goods-history ul>li').length==0){
                    $('.clear-record').css('display','none');
                }

                //如果搜索记录条数大于0，显示“清除历史记录”
                if($('.goods-history ul>li').length>0){
                    $('.clear-record').css('display','block');
                }

                //如果搜索记录条数大于2，显示“全部展示”
                if($('.goods-history ul>li').length>2){
                    oUl.height('72px');
                    $('.show-all').css('display','block');
                    $('.clear-record').css('display','none');
                }

                //展开全部
                $('.show-all').on('click',function(ev){
                    ev.stopPropagation();

                    var h=$('.goods-history ul>li').length*$('.goods-history ul>li').eq(0).height();
                    $(this).css('display','none');
                    oUl.css('height',h);
                    $('.clear-record').css('display','block');
                    setTimeout(function(){
                        oUl.css('height','auto');
                    },300);
                });
                
                //清除历史记录
                $('.clear-record').on('click',function(ev){
                    ev.stopPropagation();
                    var token=getSto('token');
                    $.ajax({
                        type:'get',
                        url:apiUrl+'/user/search/delete',
                        data:{
                            memberNo:vipNo,
                            searchId:0,
                            businessCase:2
                        },
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
                            if(data.body.status){
                                $('.goods-history ul>li').remove();//删除全部列表项
                                $('.show-all').css('display','none');
                                $('.clear-record').css('display','none');
                                oUl.height('auto');
                            }
                        },
                        error:function(err){
                            console.log(err);
                        }
                    });
                    
                });

                //删除项
                var aDel=$('.goods-history ul>li>a');
                aDel.each(function(index,item){
                    $(item).on('click',function(ev){
                        ev.stopPropagation();
                        var token=getSto('token');
                        $.ajax({
                            type:'get',
                            url:apiUrl+'/user/search/delete',
                            data:{
                                memberNo:vipNo,
                                searchId:item.id,
                                businessCase:2
                            },
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
                                if(data.body.status){
                                    $(item).parent().remove();//删除元素节点
                                    if($('.goods-history>ul>li').length<=2){
                                        $('.show-all').css('display','none');
                                        oUl.css('height','auto');
                                    }
                                    if($('.goods-history>ul>li').length==0){
                                        $('.clear-record').css('display','none');
                                    }
                                }
                            },
                            error:function(err){
                                console.log(err);
                            }
                        });
                    });
                });
            },
            error:function(){

            }
        });//获取搜索记录
        //showRecord();
        ev.stopPropagation();
    });

    //location.href='goods-search-result.html?';
}else{//未登录
    var aSearchRecord;
    //oInput.focus();
    //showRecord();
    oInput.on('focus',function(ev){
        
        aSearchRecord=JSON.parse(getLto('goodsSearchRecord'));//获取搜索记录
        showRecord();
        ev.stopPropagation();
    });

    $(oSearchBtn).on('click',function(){
        
        var val=oInput.val();
        if(!aSearchRecord){
            aSearchRecord=[];
        }
        if(val!=''){
            aSearchRecord.push(val);
            aSearchRecord=noRepeat(aSearchRecord);//去重
            
            setLto('goodsSearchRecord',JSON.stringify(aSearchRecord));//存储搜索记录
            
            if(val!=''){
                keyVal=val;
                targetId=[];
                labelId=[];
                sortId=[];
                styleId=[];
                materialId=[];
                priceId=[];
                pageNum=1;
                jsonData={
                    type:1,
                    pageNum:pageNum,
                    pageSize:pageSize,
                    keyWord:val
                };
                iBtn=true;//控制分页器只布局一次的关
                dataRender();

                saleIndex=9;
                styleIndex=9;
                materialIndex=9;
                priceIndex=9;
                $('.tab-bar-con li').each(function(index,item){console.log(1111);
                    $(item).removeClass('active');
                });
                $(aOlLi[0]).find('span').html('人气');
                $(aOlLi[1]).find('span').html('款式');
                $(aOlLi[2]).find('span').html('材质');
                $(aOlLi[3]).find('span').html('价格范围');
                
            }else{
                alert('搜索内容不能为空');
            }
            //window.location.href=encodeURI(encodeURI('goods-search-result.html?keyword='+val));
        }
    });

    //展示搜索记录列表
    function showRecord(){
        aSearchRecord=JSON.parse(getLto('goodsSearchRecord'));//获取搜索记录
        if(aSearchRecord){
            createRecordList(aSearchRecord);
        }
    }

    //生成搜索记录列表
    function createRecordList(arr){
        var str='';
        arr.forEach(function(item,index){
            str+='<li>';
            str+='<i></i><span>'+item+'</span><a href="javascript:;" target="_blank"></a>';
            str+='</li>';
        });
        oUl.html(str);
        $('.goods-history').css('display','block');
        //点击搜索结果
        (function(){
            var aLi=$('.goods-history>ul>li');
            var searchText=('.for-search input');  
            aLi.each(function(index,item){
                $(item).on('click',function(){
                    //window.location.href=encodeURI(encodeURI('goods-search-result.html?keyword='+$(item).find('span').text()));
                    keyVal=$(item).find('span').text();
                    targetId=[];
                    labelId=[];
                    sortId=[];
                    styleId=[];
                    materialId=[];
                    priceId=[];
                    pageNum=1;
                    jsonData={
                        type:1,
                        pageNum:pageNum,
                        pageSize:pageSize,
                        keyWord:$(item).find('span').text()
                    };
                    iBtn=true;//控制分页器只布局一次的关
                    dataRender();

                    saleIndex=9;
                    styleIndex=9;
                    materialIndex=9;
                    priceIndex=9;
                    $(searchText).val(keyVal);
                    $('.tab-bar-con li').each(function(index,item){
                        $(item).removeClass('active');
                    });
                    $(aOlLi[0]).find('span').html('人气');
                    $(aOlLi[1]).find('span').html('款式');
                    $(aOlLi[2]).find('span').html('材质');
                    $(aOlLi[3]).find('span').html('价格范围');
                });
            });
        })();

        //如果搜索记录条数大于0，显示“清除历史记录”
        if($('.goods-history ul>li').length>0){
            $('.clear-record').css('display','block');
        }
        //如果搜索记录条数大于2，显示“全部展示”
        if($('.goods-history ul>li').length>2){
            oUl.height('72px');
            $('.show-all').css('display','block');
            $('.clear-record').css('display','none');
        }
        del();
    }

    //删除搜索记录
    function del(){
        var aDel=$('.goods-history ul>li>a');
        aDel.each(function(index,item){
            $(item).on('click',function(ev){alert(1);
                $(this).parent().remove();//删除元素节点
                var val=$(this).parent().text();
                aSearchRecord.splice($.inArray(val,aSearchRecord),1);//从数组中删除搜索记录
                if(aSearchRecord.length<=2){
                    $('.show-all').css('display','none');
                    oUl.css('height','auto');
                }
                if(aSearchRecord.length==0){
                    $('.clear-record').css('display','none');
                }
                rmLto('goodsSearchRecord');//删除localStorage的全部搜索记录
                setLto('goodsSearchRecord',JSON.stringify(aSearchRecord));//重新添加删除后剩余的搜索记录到localStorage
                ev.stopPropagation();
            });
        });
    }

    //如果搜索记录为小于2条时不显示“展开全部”和“清除历史记录”
    if($('.goods-history ul>li').length<=2){
        $('.show-all').css('display','none');
    }

    //如果搜索记录为0时不显示“展开全部”和“清除历史记录”
    if($('.goods-history ul>li').length==0){
        $('.clear-record').css('display','none');
    }

    //展开全部
    $('.show-all').on('click',function(ev){
        ev.stopPropagation();
        var h=$('.goods-history ul>li').length*$('.goods-history ul>li').eq(0).height();
        $(this).css('display','none');
        oUl.css('height',h);
        $('.clear-record').css('display','block');
        setTimeout(function(){
            oUl.css('height','auto');
        },300);
    });
    
    //清除历史记录
    $('.clear-record').on('click',function(){
        aSearchRecord=[];//搜索数组清空
        $('.goods-history ul>li').remove();//删除全部列表项
        localStorage.removeItem('goodsSearchRecord');//删除localStorage的全部搜索记录
        $('.show-all').css('display','none');
        $(this).css('display','none');
        oUl.height('auto');
    });
}
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
             // 如果没数据显示图片
            if(data.goodsVoList.length == 0){
               $('.guess-like-public h4').css('display','none');
               $('.search-none').css('display','block');
            }else{
                 $('.search-none').css('display','none');
            }

            data.goodsVoList.forEach(function(item,index){
	            str+=`<li class="goods-gife-item-public">`;
	            str+=`<div><img src="" alt="" data-src=${item.goodsPicture}>
	                    <em>￥${item.salePrice}</em>
                        <p>${item.shortName}</p>
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