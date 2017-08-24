import '../css/public.css';
import '../css/find-search.css';
import $ from 'jquery';
import apiUrl from '../js/config';
import {rand,signName,reTop,tabBar,imgLazy,url_search,setSto,getSto,cartCount,rmSto,allSto,getLto,noRepeat,setLto,imgLazyForFind} from '../js/config';
import md5 from 'md5';
var vipNo=getSto('vipNo');
var token=getSto('token');
//获取购物车数量
cartCount($('.func-public em'));

var getUrl=apiUrl+'/article/recommended';
var sortId=[];
var styleId=[];
var materialId=[];
var priceId=[];
var targetId=[];
var labelId=[];
var keyVal='';//搜索关键字
var statusBtn=true;
var pageNum=1;
var pageSize=5;
var saleIndex;
var styleIndex;
var materialIndex;
var priceIndex;
var jsonData={
        type:4,
        labelId:0,
        pageNum:pageNum,
        pageSize:pageSize
    };

var iBtn=true;//控制分页器只布局一次的关
//搜索
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

	});
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
                    //cancelImgLayer();
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
							dataRender();

							
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
            var searchText=('.for-search input')
            
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
                    $(searchText).val(keyVal);
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

var oCon=$('.wrap-list-item ul');
dataRender();


function dataRender(){
    var getUrl=apiUrl+'/article/list';
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

            data.articles.forEach(function(item,index){
                str+=`<li class='list-item'>
                        <div class='item-pic'>
                            <a href="find-details.html?id=${item.id}" target="_blank"><img data-src=${item.cover}></a>
                        </div>
                        <div class="words">
                            <div class="item-title">
                                <h3>
                                    <img src=${item.avatar} alt="">
                                    <b>${item.nickName}</b>
                                    <em>${item.publishTime}</em>
                                </h3>
                                <div class="item-content">
                                    <h2>${item.title}</h2>
                                    <p>${item.content}</p>
                                </div>
                            </div>
                            <ol class="item-words">
                                <li>
                                    <span>留言</span>
                                    <em>${item.messageNum}</em>
                                    <i></i>
                                </li>
                                <li>
                                    <span>点赞</span>
                                    <em>${item.interestedNum}</em>
                                </li>
                                <li><span>${item.labels}</span></li>
                            </ol>
                        </div>
                     </li>`;
            });
            $(oCon).html(str);
            //图片懒加载
            (function(){
                var aImg=$('.item-pic img');
                imgLazyForFind(aImg);
                imgLazy($('.item-title h3 img'));
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

//热门标签
(function(){
    var oWrap=$('.hot>ul');
    var str='';
    $.ajax({
        url:apiUrl+'/article/label',
        success:function(data){
            var arr=data.body.labels;
            console.log(data)
            arr.forEach(function(item,index){
                str+='<li id='+item.id+'>'+item.labelContent+'</li>'
            });
            oWrap.html(str);


            //点击热门标签
            (function(){
                var aLi=$('.hot>ul>li');
                aLi.each(function(index,item){
                    $(item).on('click',function(){
                        keyVal=$(item).text();
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
                            labelId:item.id,
                            pageSize:pageSize,
                            keyWord:$(item).text()
                        };

                        iBtn=true;//控制分页器只布局一次的关
                        dataRender();//页面布局
                        //window.location.href=encodeURI(encodeURI('result.html?id='+$(item).get(0).id+'&name='+$(item).text()));
                    });
                });
            })();
        },
        error:function(err){
            console.log(err);
        }
    });
})();





