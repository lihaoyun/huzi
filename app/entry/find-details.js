import '../css/public.css';
import '../css/find-details.css';
import $ from 'jquery';
import apiUrl from '../js/config';
import {rand,signName,reTop,tabBar,url_search,imgLazy,setSto,getSto,cartCount,rmSto,allSto,getLto,noRepeat,setLto,imgLazyForFind} from '../js/config';
import md5 from 'md5';
var token=getSto('token');
var vipNo=getSto('vipNo');
//获取购物车数量
cartCount($('.func-public em'));
//故事详情
(function(){
    var oPic=$('.top-pic');
    var oWrap=$('.detail-con');
    var oT=$('.wrap-title h2');
    var oImg=$('.item-title h3 img');
    var oName=$('.item-title h3 b');
    var oTime=$('.item-title h3 em');
    var oSign=$('.item-title h3 a');
    var oUl=$('.right-recommend ul');
    var oArticleCon=$('.item-content');
    var str='';

    $.ajax({
        url:apiUrl+'/article/detail?articleId='+url_search().id,
        success:function(data){
            var con=data.body.content;
            if(con.picture){
                $(oPic).attr('src',con.picture);
            }
            
            $(oImg).attr('src',con.avatar);
            $(oName).html(con.nickName);
            $(oT).html(con.articleName);
            $(oTime).html(con.created);
            $(oSign).html(con.articleLabel);
            $(oWrap).html(con.articleInfo);
            $(oWrap).find('img').attr({
                'width':'auto',
                'height':'auto'
            });
            var aArticleArray=data.body.content.articles;
            
            if(aArticleArray&&aArticleArray.length!=0){
                $('.right-recommend').css('display','block');
                aArticleArray.forEach(function(item,index){
                    str+=`<li class="item-recommend">
                              <p><img src=${item.cover}></p>
                              <h6>${item.title}</h6>
                              <p><span>${item.publishTime}</span><em>${item.labelName}</em></p>
                              <a href="find-details.html?id=${item.id}" target="_blank"></a>
                          </li>`;
                });
                $(oUl).html(str);
            }
            $(oArticleCon).html(data.body.content.articleInfo);
        },
        error:function(err){
            console.log(err);
        }
    });
})();

//收藏评论数
(function(){
    var oLogin=$('.opacity-log');//登录弹层
    var oCollectBtn=$('.collect-count')//点赞按钮
    var oWordCount=$('.message-title h4 i');
    var oCollectCount=$('.collect-count i');
    var oCollect=$('.collect-count em');
    var token=sessionStorage.getItem("token");
    $.ajax({
        url:apiUrl+'/article/count?articleId='+url_search().id+'&memberNo='+vipNo,
        
        success:function(data){
            var body=data.body;
            oWordCount.html(body.messageCount);
            oCollectCount.html(body.collectionCount);
            if(!body.isRecord){
                $(oCollect).css('background','url('+require('../imgs/heart.png')+') 0 0/contain no-repeat');
            }else{
                $(oCollect).css('background','url('+require('../imgs/heart-copy.png')+') 0 0/contain no-repeat');
            }
        },
        error:function(err){
            console.log(err);
        }
    });

    $(oCollectBtn).on('click',function(){
        token=getSto('token');
        vipNo=getSto('vipNo');
        if(vipNo){
            $.ajax({
                type:'post',
                url:apiUrl+'/collection/add',
                headers:signName(md5,vipNo,token),
                data:{
                    memberNo:vipNo,
                    articleId:url_search().id
                },
                success:function(data){
                    var body=data.body;
                    if(!body.isRecord){
                        $(oCollect).css('background','url('+require('../imgs/heart.png')+') 0 0/contain no-repeat');
                    }else{
                        $(oCollect).css('background','url('+require('../imgs/heart-copy.png')+') 0 0/contain no-repeat');
                    }
                    $(oCollectCount).text(body.signCount);
                },      
                error:function(err){
                    console.log(err);
                }
            });
        }else{//未登录
            $('.login>li>img').get(0).src=apiUrl+'/pic?t='+Date.now()+'&random='+ID;
            $(oLogin).css('display','block');
            setTimeout(function(){
                $(oLogin).css('opacity',1);
            },50);
        }
    });
})();

//我要留言
(function(){
    var oLogin=$('.opacity-log');//登录弹层
    var oCollectBtn=$('.word-count1')//点赞按钮
    var token=sessionStorage.getItem("token");
    var oOk=$('.ok');
    var oCancel=$('.cancel');
    var oBg=$('.words-box-bg');
    $(oCollectBtn).on('click',function(){
        vipNo=getSto('vipNo');
        if(vipNo){
            $(oBg).css('display','block');
            $(oBg).find('textarea').val('');
            setTimeout(function(){
                $(oBg).css('opacity',1);
                $(oBg).find('textarea').get(0).focus();
            },50);
        }else{//未登录
            $('.login>li>img').get(0).src=apiUrl+'/pic?t='+Date.now()+'&random='+ID;
            $(oLogin).css('display','block');
            setTimeout(function(){
                $(oLogin).css('opacity',1);
            },50);
        }
    });

    //发送留言
    oOk.on('click',function(){
        var val=$(oBg).find('textarea').val();
        var vipNo=sessionStorage.getItem("vipNo");
        if(val.length>140){
            alert('输入内容不应大于140字符~');
            return;
        }
        $.ajax({
            type:'post',
            url:apiUrl+'/message/add',
            headers:signName(md5,vipNo,token),
            data:{
                memberNo:vipNo,
                articleId:url_search().id,
                content:val
            },
            success:function(data){
                if(data.head.code){
                    console.log('数据返回错误！');
                    return;
                }
                if(data.body.addStatus){
                    iBtn=true;
                    dataRender();
                }

                $('.message-title h4 i').text(data.body.messageCount);
                $(oBg).css('opacity',0);
                setTimeout(function(){
                    $(oBg).css('display','none');
                    $(oBg).find('textarea').get(0).blur();
                },500);
                
            },
            error:function(err){
                console.log(err);
            }
        });
    });

    //取消留言框
    oCancel.on('click',function(){
        $(oBg).css('opacity',0);
        setTimeout(function(){
            $(oBg).css('display','none');
            $(oBg).find('textarea').get(0).blur();
        },500);
    });
})();

//留言列表
var oCon=$('.list');
var oBtn=$('.comments>button');
var oRe=$('.refresh');
var pageNum=window.NUM;
var pageSize=5;
var str='';
var timer=null;
var timer1=null;
var timer2=null;
var iNum=0;//记录第一次到最后一条数据时的页数
var iBtnNum=0;
var iBtn=true;//控制分页器只布局一次的关
var jsonData={
    memberNo:getSto('vipNo'),
    articleId:url_search().id,
    pageNum:1,
    pageSize:pageSize
};
dataRender();
function dataRender(){
    var str='';
    $.ajax({
        type:'get',
        url:apiUrl+'/message/query',
        data:jsonData,
        success:function(data){
            var arr=data.body.messageList;
            //window.iLength=arr.length;
            if(arr.length==0){
                $('.no-words').css('display','block');
                $('.comments>button').css('display','none');
                return;
            }
            arr.forEach(function(item,index){
                
                if(item.isOwnMessage){
                    str+=`<li class="message-list own" id=${item.id}>
                          <p class="user-info clear">
                               <img src=${item.avatar} alt="">
                               <b>${item.nickname}</b>
                               <em>${item.createTime}</em>
                          </p>
                          <p class="user-cont">${item.content}</p>
                      </li>`;
                }else{
                    str+=`<li class="message-list" id=${item.id}>
                          <p class="user-info clear">
                               <img src=${item.avatar} alt="">
                               <b>${item.nickname}</b>
                               <em>${item.createTime}</em>
                          </p>
                          <p class="user-cont">${item.content}</p>
                      </li>`;
                }
                
            });

            $(oCon).html(str);
            
            removeWord();

            console.log('data.page:',data.body.pages);
            var pageCount=Math.ceil(data.body.pages);
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

function removeWord(){
    var oW=$('.list');
    var oContent=$('.opacity2');
    var oOwn=$('.own');
    var oBtn11=$('.ook');
    var oCancel11=$('.ccancel');
    var token=sessionStorage.getItem("token");
    oOwn.on('click',function(){
        $(oBtn11).attr('data-id',$(this).get(0).id);
        oContent.css('display','block');
        setTimeout(function(){
            oContent.css('opacity',1);
        },50);
    });
    
    //窗口的确认
    oBtn11.on('click',function(){
        var vipNo=sessionStorage.getItem("vipNo");
        var dataId=$(oBtn11).get(0).dataset.id;
        $.ajax({
            type:'post',
            headers:signName(md5,vipNo,token),
            url:apiUrl+'/message/delete?memberNo='+vipNo+'&messageId='+dataId,
            success:function(data){
                if(data.body.status){
                    if(window.iLength==1){
                        $('.no-words').css('display','block');
                    }
                    iBtn=true;
                    dataRender();
                    oContent.css('opacity',0);
                    setTimeout(function(){
                        oContent.css('display','none');
                    },500);
                }
            },
            error:function(err){
                console.log(err);
            }
        });
    });
    //点击取消窗口消失
    oCancel11.on('click',function(){
        oContent.css('opacity',0);
        setTimeout(function(){
            oContent.css('display','none');
        },500);
    });

}


//获取图片验证码
var oImg=$('.login>li>img');
var ID=getSto("deciveID");

//点击更换验证码
$(oImg).on('click',function(){
    $(oImg).get(0).src=apiUrl+'/pic?t='+Date.now()+'&random='+ID;
});

var reg = /^((1[0-9]{1})+\d{9})$/; 
//验证手机号获取验证码
(function(){
    var oBtn=$('.login>li>button');
    var num=60;
    var timer=null;
    var iBtn=true;

    oBtn.on('click',function(){
        if(!iBtn){return}

        var val=$('.login>li>input.tel').val();
    
        if(!reg.test(val)){ 
            alert('请输入有效的手机号码'); 
            return;
        }
        iBtn=false;
        timer=setInterval(function(){
            num--;
            oBtn.html(num+'s');
            oBtn.css({
                'color':'#999',
                'border':'1px solid #999'
            });
            if(num<0){
                clearInterval(timer);
                oBtn.html('重新获取');
                iBtn=true;
                num=60;
                oBtn.css({
                    'color':'#666',
                    'border':'1px solid #666'
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

//登录
(function(){
    var oLogin=$('.login-btn');
    var oImg=$('.login>li>img');
    var oBtn=$('.logout');
    var oLoginCon=$('.opacity-log');//登录弹
    var oCancel=('.user h3 span')
        // 点击取消
        $(oCancel).on('click',function(){
            $('.opacity-log').css('opacity',0);
            setTimeout(function(){
                $('.opacity-log').css('display','none');
            },50);
        })
    oLogin.on('click',function(){
        var iSign=$('.sign').val();
        var iTel=$('.tel').val();
        var iCode=$('.code').val();
        var oP=$('.opacity-log');
        //var iBtn=false;//控制刚登录时头像显示开关

        if(iTel==''||iCode==''){
            alert('手机号或验证码不能为空！');
        }else{
            $.ajax({
                type:'post',
                url:apiUrl+'/login',
                data:{
                    mobile:iTel,
                    captcha:iCode,
                    captchaNo:iSign,
                    random:ID
                },
                success:function(data){
                    if(data.head.code){
                        alert(data.head.message);
                        $(oImg).get(0).src=apiUrl+'/pic?t='+Date.now()+'&random='+ID;
                        return;
                    }
                    var vipNo=data.body.memberNo;
                    console.log(13);
                    
                    sessionStorage.setItem("token",data.body.token);
                    sessionStorage.setItem("vipNo",vipNo);
                    sessionStorage.setItem("nickname",data.body.nickName);
                    

                    $(oLoginCon).css('opacity',0);
                    setTimeout(function(){
                        $(oLoginCon).css('display','none');
                    },510);
                },
                error:function(err){
                    console.log(err);
                }
            });
        }
    });
})();


















