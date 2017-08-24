import '../css/public.css';
import '../css/find-index.css';
import $ from 'jquery';
import apiUrl from '../js/config';
import {rand,signName,reTop,tabBar,findArrIndex,imgLazyForFind,imgLazy,imgPos,setSto,getSto,cartCount,rmSto,allSto} from '../js/config';

//获取购物车数量
cartCount($('.func-public em'));

////////////////////////////////////展示轮播专题////////////////////////////////////
(function(){
    var oWrap=$('.swiper-wrapper');
    var str='';

    $.ajax({
        url:apiUrl+'/subject/get',
        success:function(data){
            data.body.subjects.forEach(function(item,index){
                // str+='<li class="spec">';
                // str+='<img src="'+item.cover+'" alt=""><span>'+item.title+'</span><a href="'+item.link+'"></a>';
                // str+='</li>';
                str+=`<div class="swiper-slide" style="background-image:url(${item.cover})"><p>${item.title}</p><a href="${item.link}" target="_blank"></a></div>`;
            });
            oWrap.html(str);


            var swiper = new Swiper('.swiper-container', {
                pagination:'.swiper-pagination',
                effect:'coverflow',
                grabCursor:true,
                centeredSlides: true,
                slidesPerView:'auto',
                speed:500,
                loop:true,
                // autoplay:1000,
                prevButton:".swiper-button-prev",/*前进按钮*/
                nextButton:".swiper-button-next",/*后退按钮*/
                coverflow:{
                    rotate:50,
                    stretch:0,
                    depth:100,
                    modifier:1,
                    slideShadows :true
                }
            });
        },
        error:function(err){
            console.log(log);
        }
    });

})();

////////////////////////////////////标签获取以及点击标签展示列表////////////////////////////////////
var pageNum=1;
var pageSize=9;
var jsonData={
        pageNum:pageNum,
        pageSize:pageSize,
        labelId:0
    };
var iBtn=true;//控制分页器只布局一次的关
var getUrl=apiUrl+'/article/list';

(function(){
    var oDiscoveryBtn=$('.discovery');
    var oWrap=document.querySelector('.wrap-nav ul');
    var sLabel='';

    $.ajax({
        url:apiUrl+'/article/label',

        success:function(data){
            var aLabel=data.body.labels;
            aLabel.forEach(function(item,index){
                if(index==0){
                    sLabel+='<li id="'+item.id+'" class="swiper-slide" data-kind="story"><a href="javascript:;" target="_blank">'+item.labelContent+'</a></li>';
                }else if(index==1){
                    sLabel+='<li id="'+item.id+'" class="swiper-slide" data-kind="fashion"><a href="javascript:;" target="_blank">'+item.labelContent+'</a></li>';
                }else if(index==2){
                    sLabel+='<li id="'+item.id+'" class="swiper-slide" data-kind="beauty"><a href="javascript:;" target="_blank">'+item.labelContent+'</a></li>';
                }
                
            });
            $(oWrap).append(sLabel);
            ////////////////////////////////////点击标签后列表的展示////////////////////////////////////
            var aLiLabel=$('.wrap-nav ul li');
            var activeIndex=0;
            aLiLabel.each(function(index,item){
                $(item).on('click',function(){
                    $(aLiLabel[activeIndex]).removeClass('active');
                    $(item).addClass('active');
                    activeIndex=index;
                    jsonData.pageNum=1;
                    jsonData.labelId=item.id;

                    if(index){
                        getUrl=apiUrl+'/article/list/label';
                        console.log(data);
                    }else{//推荐
                        getUrl=apiUrl+'/article/list';
                    }
                    iBtn=true;
                    dataRender();
                });
            });
        },
        error:function(err){
            console.log(err);
        }
    });
})();

// function(labels){

// }

var oCon=$('.wrap-list-item ul');
dataRender();

function dataRender(){

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
                        <div class="item-title">
                            <h3>
                                <img data-src=${item.avatar} alt="">
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
                            <li>`;
                                if(item.labels){
                                    item.labels.split(',').forEach(function(item1,index1){
                                        str+='<span class="kind">'+item1+'</span>';
                                    });
                                }
                            str+=`</li>
                        </ol>
                    </li>`;
            });
            $(oCon).html(str);

            //图片懒加载
            (function(){
                var aImg=$('.item-pic img');
                imgLazyForFind(aImg);
                imgLazy($('.item-title h3 img'));
            })();
            var pageCount=Math.ceil(data.page/pageSize);
            console.log('page:',pageCount);
            console.log('data.page:',data.page);
            console.log('pageSize:',pageSize);
            
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

