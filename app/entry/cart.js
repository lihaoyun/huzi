import '../css/public.css';
import '../css/cart.css';
import $ from 'jquery';
import apiUrl from '../js/config';
import {rand,signName,reTop,url_search,setSto,cartCount,getSto,imgLazy,classof,rmSto,cartPayCount,allSto,showImgLayer,cancelImgLayer} from '../js/config';
import md5 from 'md5';
var vipNo=getSto('vipNo');
var token=getSto('token');
//获取购物车数量


function setICPLocation(){
    var oFooter=$('.footer');
    var nFooterHeight=$('.footer').height();
    var nFooterTop=$(oFooter).get(0).getBoundingClientRect().top;
    var nScreenHeight=window.innerHeight;

        if(nFooterTop<(nScreenHeight-nFooterHeight)){
            $(oFooter).css({
                position:'fixed',
                left:'0',
                bottom:'80px'
            });
        }else{
            $(oFooter).css({
                position:'static'
            });
        }
    }

    setICPLocation();
cartCount($('.func-public em'));
//购物车列表
(function(){
    var oUl=$('.cart-list>ul');
    var str='';
    var oBtn=$('.pay-money');//结算按钮
    var oPrice=$('.account>.pay-money span');//商品价格展示

    if(vipNo){//登录
        var cartList=JSON.parse(getSto('tempCart'));
        var token=getSto('token');
        if(cartList){//有临时购物车
            $.ajax({
                type:'post',
                headers:signName(md5,vipNo,token),
                url:apiUrl+'/shoppingcart/merge',
                contentType:'application/json',
                data:JSON.stringify({
                    memberNo:vipNo,
                    goodsList:cartList
                }),
                //data:JSON.stringify(cartList),
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
                    rmSto('tempCart');
                    renderDom();

                },
                error:function(err){
                	console.log('err:',err);
                }
            });
        }else{//没有临时购物车
            renderDom();
        }

        function renderDom(){
            function reSetICPLocation(){
                        $('.footer').css({
                            position:'static'
                        });
                    }
            reSetICPLocation();
            var iPrice=0;//存储被选商品价格
            showImgLayer('数据请求中...');
            $.ajax({
                type:'post',
                headers:signName(md5,vipNo,token),
                url:apiUrl+'/shoppingcart/goods',
                data:{
                    memberNo:vipNo
                },
                success:function(data){
                    if(data.head.code){
                        console.log(data.head.message);
                        cancelImgLayer();
                        if(data.head.code==71982){
                            rmSto('nickname');
                            rmSto('timestamp');
                            rmSto('token');
                            rmSto('vipNo');
                            alert('出现错误，请重新登录！');
                            location.href='personal-orders.html';
                        }
                    }

                    var data=data.body;
                    console.log('xyz:',data);
                    if(!data.goodsList.length){
                        $('.cart-nothing').css('display','block');
                        cancelImgLayer();
                        return;
                    }
                    cartPayCount(data.goodsList);
                    data.goodsList.forEach(function(item,index){
                        str+=`<li class="cart-item" data-goodsid=${item.goodsId} data-id=${item.id} data-suit=${item.accessoryId} data-btn=${item.selected} data-comment=${item.comment}>
                            <div class="cart-item-detail">
                                <div class="cart-item-l">`;

                                    if(item.soldout){
                                        str+=`<span data-soldout="true" class="select-box grey"></span>`;
                                        str+=`<div class="goods-pic">
                                        <img src="" data-src=${item.picture} alt="">
                                        <a href="product-details.html?id=${item.goodsId}" target="_blank"></a>`;
                                        str+='<span style="display:block"></span>';

                                    }else{
                                        if(item.selected){
                                            str+=`<span data-soldout="false" class="select-box active"></span>`;
                                        }else{
                                            str+=`<span data-soldout="false" class="select-box"></span>`;
                                        }
                                        str+=`<div class="goods-pic">
                                        <img src="" data-src=${item.picture} alt="">
                                        <a href="product-details.html?id=${item.goodsId}" target="_blank"></a>`;
                                        str+='<span style="display:none"></span>';
                                    }
                                    str+=`</div>
                                </div>
                                <div class="cart-item-r">
                                    <h3 class="goods-name">`;
                                    if(item.lowStock&&!item.soldout){
	                                    str+=`<p>购买数量超出当前库存量</p>`;
	                                }
                                    str+=`<a href="product-details.html?id=${item.goodsId}" target="_blank">${item.longName}</a></h3>`;
                                    if(item.accessoryLength){
                                        str+=`<p class="goods-material">配件：<em>${item.accessoryLength}</em></p>`;
                                    }else{
                                    	str+=`<p class="goods-material"></p>`;
                                    }
                                    str+=`<div class="goods-price">`;
                                        str+='<span>￥'+parseInt(item.salePrice)+'</span>';
                                        str+=`<div class="goods-count">
                                            <span class="goods-minus">-</span>
                                            <input type="text" value=${item.number} name="" disabled="disabled">
                                            <span class="goods-add">+</span>
                                        </div>
                                    </div>`;
                                    str+=`<div class="cart-item-remove"><em>删除</em><i></i></div>`;
                                str+=`</div>
                            </div></li>`;

                        if(item.selected){
                            iPrice+=parseFloat(item.salePrice)*item.number;
                        }
                        $(oPrice).text('￥'+iPrice);
                            
                    });

                    oUl.get(0).innerHTML=str;
                   
                   
                    setICPLocation();
                   

                    rmSto('tempOrderCart');
                    //获取购物车数量
					cartCount($('.func-public em'));
                    //cancelImgLayer();
                    //calcPrice();
                    //图片懒加载
                    (function(){
                        var aImg=$('.cart-item .goods-pic img');
                        imgLazy(aImg);
                    })();

                    
                    function calcPrice(){
                        var num=0;
                        //showImgLayer();
                        $.ajax({
                            type:'post',
                            headers:signName(md5,vipNo,token),
                            url:apiUrl+'/shoppingcart/goods',
                            data:{
                                memberNo:vipNo
                            },
                            success:function(data){
                                if(data.head.code){
                                    console.log(data.head.message);
                                    cancelImgLayer();
                                    if(data.head.code==71982){
                                        rmSto('nickname');
                                        rmSto('timestamp');
                                        rmSto('token');
                                        rmSto('vipNo');
                                        alert('出现错误，请重新登录！');
                                        location.href='personal-orders.html';
                                    }
                                    return;
                                }
                                
                                var data=data.body;

                                if(!data.goodsList.length){
                                    $('.cart-nothing').css('display','block');
                                    //cancelImgLayer();
                                    return;
                                }
                                data.goodsList.forEach(function(item,index){
                                    if(item.selected){
                                        num+=parseFloat(item.salePrice)*item.number;
                                    }
                                });
                                $(oPrice).text('￥'+num);
                                //结算数量
                                cartPayCount(data.goodsList);
                            },
                            error:function(err){
                                console.log(err);
                                cancelImgLayer();
                            }
                        });
                    }

                    //删除
                    removeItem();
                    function removeItem(){
                        var aItem=$('.wrap-cart>.cart-list li.cart-item');
                        var oWrap=$('.opacity');
                        var oBtn=$('.opacity .con li:last-of-type');
                        var oCancel=$('.opacity .con li:first-of-type');

                        aItem.each(function(index,item){
                            $(item).find('.cart-item-remove em').on('click',function(){
                                //console.log(item.dataset.goodsid);
                                alertC(index);
                            });
                        });

                        //点击取消窗口消失
                        oCancel.on('click',function(){
                            cancel();
                        });

                        //窗口的确认
                        oBtn.on('click',function(){
                            showImgLayer('数据请求中...');
                            $.ajax({
                                type:'post',
                                headers:signName(md5,vipNo,token),
                                url:apiUrl+'/shoppingcart/delete',
                                data:{
                                    memberNo:vipNo,
                                    id:aItem[$(oBtn).get(0).dataset.index].dataset.id
                                },
                                success:function(data){
                                    if(data.head.code){
                                        console.log(data.head.message);
                                        cancelImgLayer();
                                        if(data.head.code==71982){
                                            rmSto('nickname');
                                            rmSto('timestamp');
                                            rmSto('token');
                                            rmSto('vipNo');
                                            alert('出现错误，请重新登录！');
                                            location.href='personal-orders.html';
                                        }
                                    }else{
                                        calcPrice();
                                        cancel();
                                        aItem[$(oBtn).get(0).dataset.index].remove();
                                        //cancelImgLayer();
                                        cartCount($('.func-public em'));
                                    }


                                    

                                },
                                error:function(err){
                                    console.log(err);
                                    cancelImgLayer();
                                }
                            });
                        });

                        //弹出窗口函数
                        function alertC(index){
                            oBtn.attr('data-index',index);
                            oWrap.css('display','block');
                            setTimeout(function(){
                                oWrap.css('opacity',1);
                            },50);
                        }

                        //窗口消失函数
                        function cancel(){
                            oWrap.css('opacity',0);
                            setTimeout(function(){
                                oWrap.css('display','none');
                            },500);
                        }
                    }

                    //改变数量
                    changeNum();
                    function changeNum(){
                        var aItem=$('.wrap-cart>.cart-list li.cart-item');
                        var oCountWrap=$('.count-tips');

                        aItem.each(function(index,item){
                            var iCount=$(item).find('.goods-count input').val();
                            //加
                            $(item).find('.goods-add').on('click',function(){
                                if(iCount>=9){
                                    $('.opacity3').css('opacity',1);
                                    $('.opacity3').css('display','block');
                                    $('.opacity3 .adds').css('display','none');
                                    $('.opacity3 .buys').css('display','block');
                                    setTimeout(function(){
                                           $('.opacity3').css('display','block');
                                        },50);
                                    $('.cancel').on('click',function(){
                                        $('.opacity3').css('opacity',0);
                                        $('.opacity3 .adds').css('display','none');
                                        setTimeout(function(){
                                            $('.opacity3').css('display','none');
                                            },50);
                                    })
                                    return;
                                }
                                iCount++;
                                showImgLayer('数据请求中...');
                                $.ajax({
                                    type:'post',
                                    headers:signName(md5,vipNo,token),
                                    url:apiUrl+'/shoppingcart/goods/edit',
                                    data:{
                                        memberNo:vipNo,
                                        id:item.dataset.id,
                                        goodsId:item.dataset.goodsid,
                                        number:iCount
                                    },
                                    success:function(data){console.log(data);
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
                                            return;
                                        }else{
                                            if(data.body.lowStock){//库存紧张提示
                                                $('.count-tips').css('display','block');
                                                setTimeout(function(){
                                                    $('.count-tips').css('opacity',1);
                                                },50);

                                                setTimeout(function(){
                                                    $('.count-tips').css('opacity',0);
                                                    setTimeout(function(){
                                                        $('.count-tips').css('display','none');
                                                    },500);
                                                },2000);
                                                iCount--;
                                                cancelImgLayer();
                                                return;
                                            }

                                            $(item).find('.goods-count input').val(iCount);
                                            if(item.dataset.btn=='true'){
                                                calcPrice()
                                            }
                                			cartCount($('.func-public em'));
                                        }
                                        cancelImgLayer();
                                    },
                                    error:function(err){
                                        console.log(err);
                                        cancelImgLayer();
                                    }
                                });

                            });
                            //减
                            $(item).find('.goods-minus').on('click',function(){
                                if(iCount<=1){
                                    return;
                                }
                                iCount--;

                                //console.log('iCount:',iCount);
                                showImgLayer('数据请求中...');
                                $.ajax({
                                    type:'post',
                                    headers:signName(md5,vipNo,token),
                                    url:apiUrl+'/shoppingcart/goods/edit',
                                    data:{
                                        memberNo:vipNo,
                                        id:item.dataset.id,
                                        goodsId:item.dataset.goodsid,
                                        number:iCount
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
                                            return;
                                        }else{
                                            if(data.body.lowStock){//库存紧张提示
                                                $('.count-tips').css('display','block');
                                                setTimeout(function(){
                                                    $('.count-tips').css('opacity',1);
                                                },50);

                                                setTimeout(function(){
                                                    $('.count-tips').css('opacity',0);
                                                    setTimeout(function(){
                                                        $('.count-tips').css('display','none');
                                                    },500);
                                                },2000);
                                                //iCount++;
                                                //return;
                                            }

                                            $(item).find('.goods-count input').val(iCount);//console.log('x:',item.dataset.btn);
                                            if(item.dataset.btn=='true'){
                                                calcPrice()
                                            }
                                            cartCount($('.func-public em'));
                                        }
                                        //cancelImgLayer();
                                    },
                                    error:function(err){
                                        console.log(err);
                                        cancelImgLayer();
                                    }
                                });
                                
                            });
                        });
                    }

                    //选中未选中函数
                    changeStatus();
                    function changeStatus(){
                        var aItem=$('.wrap-cart>.cart-list li.cart-item');
                        var oAllBtn=$('.account>.pay-price span');
                        var iLen=aItem.length;
                        var iNum=0;//存储被选中的初始数量
                        var n=0;//存储可以被选中的初始数量
                        aItem.each(function(index,item){

                            if($(item).find('.select-box').get(0).dataset.soldout=='false'){//存储可以被选中的初始数量
                                n++;
                            }

                            if(item.dataset.btn=='true'){//存储被选中的初始数量
                                iNum++;
                            }
                            $(item).find('.select-box').on('click',function(){
                                var _this=this;
                                if($(this).get(0).dataset.soldout=='true'){//如果售罄
                                    return;
                                }

                                if(item.dataset.btn=='false'){
                                    showImgLayer('数据请求中...');
                                    $.ajax({
                                        type:'post',
                                        headers:signName(md5,vipNo,token),
                                        url:apiUrl+'/shoppingcart/goods/select',
                                        data:{
                                            memberNo:vipNo,
                                            id:item.dataset.id,
                                            selected:true
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
                                                return;
                                            }else{
                                                item.dataset.btn='true';
                                                $(_this).addClass('active');
                                            }
                                            iNum++;
                                            if(iNum==n){
                                                oAllBtn.get(0).dataset.btn='true';
                                                $(oAllBtn).addClass('active');
                                            }else{
                                                oAllBtn.get(0).dataset.btn='false';
                                                $(oAllBtn).removeClass('active');
                                            }
                                            calcPrice();
                                            cancelImgLayer();
                                            
                                        },
                                        error:function(err){
                                            console.log(err);
                                        }
                                    });
                                }else{
                                    showImgLayer('数据请求中...');
                                    $.ajax({
                                        type:'post',
                                        headers:signName(md5,vipNo,token),
                                        url:apiUrl+'/shoppingcart/goods/select',
                                        data:{
                                            memberNo:vipNo,
                                            id:item.dataset.id,
                                            selected:false
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
                                                return;
                                            }else{
                                                item.dataset.btn='false';
                                                $(_this).removeClass('active');
                                            }
                                            iNum--;
                                            if(iNum==iLen&&iNum!=0){
                                                oAllBtn.get(0).dataset.btn='true';
                                                $(oAllBtn).addClass('active');
                                            }else{
                                                oAllBtn.get(0).dataset.btn='false';
                                                $(oAllBtn).removeClass('active');
                                            }
                                            calcPrice();
                                            cancelImgLayer();
                                        },
                                        error:function(err){
                                            console.log(err);
                                        }
                                    });
                                }
                            });
                        });
                        
                        if(iNum==n&&iNum!=0){
                            oAllBtn.get(0).dataset.btn='true';
                            $(oAllBtn).addClass('active');
                        }else{
                            oAllBtn.get(0).dataset.btn='false';
                            $(oAllBtn).removeClass('active');
                        }

                        //全选和全未选择
                        $(oAllBtn).on('click',function(){
                            var _this=this;
                            var soldoutNum=0;

                            //判断是不是能够点击全选按钮
                            var iSolidOutNum=0;
                            var aLi=$('.wrap-cart>.cart-list li.cart-item');
                            var iSolidOutLen=aLi.length;
                            aLi.each(function(index,item){
                                if($(item).find('.select-box').get(0).dataset.soldout=='true'){
                                    iSolidOutNum++;
                                }
                            });
                            if(iSolidOutNum==iSolidOutLen){
                                return;
                            }

                            if(oAllBtn.get(0).dataset.btn=='false'){//全选
                                showImgLayer('数据请求中...');
                                $.ajax({
                                    type:'post',
                                    headers:signName(md5,vipNo,token),
                                    url:apiUrl+'/shoppingcart/goods/select',
                                    data:{
                                        memberNo:vipNo,
                                        id:'',
                                        selected:true
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
                                            return;
                                        }
                                        $(_this).addClass('active');
                                        oAllBtn.get(0).dataset.btn='true';

                                        aItem.each(function(index,item){
                                            if($(item).find('.select-box').get(0).dataset.soldout=='false'){
                                                $(item).find('.select-box').addClass('active');
                                                item.dataset.btn='true';
                                            }else{
                                                soldoutNum++;
                                            }
                                        });
                                        iNum=aItem.length-soldoutNum;

                                        calcPrice();
                                        
                                        cancelImgLayer();
                                    },
                                    error:function(err){
                                        console.log(err);
                                        cancelImgLayer();
                                    }
                                });
                            }else{//全未选
                                showImgLayer('数据请求中...');
                                $.ajax({
                                    type:'post',
                                    headers:signName(md5,vipNo,token),
                                    url:apiUrl+'/shoppingcart/goods/select',
                                    data:{
                                        memberNo:vipNo,
                                        id:'',
                                        selected:false
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
                                            return;
                                        }

                                        $(_this).removeClass('active');
                                        oAllBtn.get(0).dataset.btn='false';

                                        aItem.each(function(index,item){
                                            $(item).find('.select-box').removeClass('active');
                                            item.dataset.btn='false';
                                        });
                                        iNum=0;
                                        calcPrice();
                                        
                                        cancelImgLayer();
                                    },
                                    error:function(err){
                                        console.log(err);
                                        cancelImgLayer();
                                    }
                                });
                            }
                        });
                    }
                },
                error:function(err){
                    console.log(err);
                    cancelImgLayer();
                }
            });
        }
    }else{//未登录
        var cartList=JSON.parse(getSto('tempCart'));
        
        if(!cartList){//如果没有临时购物车
            //console.log(cartList);
            $('.cart-nothing').css('display','block');
            return;
        }

        console.log(cartList);

        renderDom();

        function renderDom(){
            function reSetICPLocation(){
                        $('.footer').css({
                            position:'static'
                        });
                    }
            reSetICPLocation();
            var iPrice=0;//存储被选商品价格
            showImgLayer('数据请求中...');
            $.ajax({
                type:'post',
                url:apiUrl+'/shoppingcart/goods/list',
                contentType:'application/json',
                data:JSON.stringify({
                    goodsList:cartList
                }),
                success:function(data){
                    if(data.head.code){
                        console.log(data.head.message);
                        cancelImgLayer();
                        return;
                    }
                    var data=data.body;

                    data.goodsList.forEach(function(item,index){
                        // str+=`<li class="cart-item" data-goodsid=${item.goodsId} data-id=${item.id} data-suit=${item.accessoryId} data-btn=${item.selected} data-comment=${item.comment}>
                        //         <div class="cart-item-detail">
                        //             <div class="cart-item-l">`;
                                    
                        //             if(item.soldout){
                        //                 str+=`<span data-soldout="true" class="select-box grey"></span>`;
                        //                 str+=`<div class="goods-pic">
                        //                 <img src="" data-src=${item.picture} alt="">
                        //                 <a href="goods-detail.html?id=${item.goodsId}"></a>`;
                        //                 str+='<span style="display:block"></span>';

                        //             }else{
                        //                 if(item.selected){
                        //                     str+=`<span data-soldout="false" class="select-box active"></span>`;
                        //                 }else{
                        //                     str+=`<span data-soldout="false" class="select-box"></span>`;
                        //                 }
                        //                 str+=`<div class="goods-pic">
                        //                 <img src="" data-src=${item.picture} alt="">
                        //                 <a href="goods-detail.html?id=${item.goodsId}"></a>`;
                        //                 str+='<span style="display:none"></span>';
                        //             }
                        //                 str+=`</div> 
                        //             </div>
                        //             <div class="cart-item-r">
                        //                 <h3 class="goods-name"><a href="goods-detail.html?id=${item.goodsId}">${item.longName}</a></h3>`;
                        //                 if(item.accessoryLength){
                        //                     str+=`<p class="goods-material">配件：<em>${item.accessoryLength}</em></p>`;
                        //                 }
                        //                 str+=`<div class="goods-price">`;
                        //                     str+='<span>￥'+parseInt(item.salePrice)+'</span>';
                        //                     str+=`<div class="goods-count">
                        //                         <span class="goods-minus">-</span>
                        //                         <input type="number" value=${item.number} name="" disabled="disabled">
                        //                         <span class="goods-add">+</span>
                        //                     </div>
                        //                 </div>
                        //             </div>
                        //         </div>
                        //         <div class="cart-item-remove"><em>删除</em><i></i></div>
                        //     </li>`;
                            str+=`<li class="cart-item" data-goodsid=${item.goodsId} data-id=${item.id} data-suit=${item.accessoryId} data-btn=${item.selected} data-comment=${item.comment}>
                            <div class="cart-item-detail">
                                <div class="cart-item-l">`;

                                    if(item.soldout){
                                        str+=`<span data-soldout="true" class="select-box grey"></span>`;
                                        str+=`<div class="goods-pic">
                                        <img src="" data-src=${item.picture} alt="">
                                        <a href="product-details.html?id=${item.goodsId}" target="_blank"></a>`;
                                        str+='<span style="display:block"></span>';

                                    }else{
                                        if(item.selected){
                                            str+=`<span data-soldout="false" class="select-box active"></span>`;
                                        }else{
                                            str+=`<span data-soldout="false" class="select-box"></span>`;
                                        }
                                        str+=`<div class="goods-pic">
                                        <img src="" data-src=${item.picture} alt="">
                                        <a href="product-details.html?id=${item.goodsId}" target="_blank"></a>`;
                                        str+='<span style="display:none"></span>';
                                    }
                                    str+=`</div>
                                </div>
                                <div class="cart-item-r">
                                    <h3 class="goods-name">`;
                                    if(item.lowStock&&!item.soldout){
	                                    str+=`<p>购买数量超出当前库存量</p>`;
	                                }
                                    str+=`<a href="product-details.html?id=${item.goodsId}" target="_blank">${item.longName}</a></h3>`;
                                    if(item.accessoryLength){
                                        str+=`<p class="goods-material">配件：<em>${item.accessoryLength}</em></p>`;
                                    }else{
                                    	str+=`<p class="goods-material"></p>`;
                                    }
                                    str+=`<div class="goods-price">`;
                                        str+='<span>￥'+parseInt(item.salePrice)+'</span>';
                                        str+=`<div class="goods-count">
                                            <span class="goods-minus">-</span>
                                            <input type="text" value=${item.number} name="" disabled="disabled">
                                            <span class="goods-add">+</span>
                                        </div>
                                    </div>`;
                                    str+=`<div class="cart-item-remove"><em>删除</em><i></i></div>`;
                                str+=`</div>
                            </div></li>`;

                            if(item.selected){
                                iPrice+=parseFloat(item.salePrice)*item.number;
                            }
                            $(oPrice).text('￥'+iPrice);   
                    });

                    oUl.get(0).innerHTML=str;
                    function setICPLocation(){
                    var oFooter=$('.footer');
                    var nFooterHeight=$('.footer').height();
                    var nFooterTop=$(oFooter).get(0).getBoundingClientRect().top;
                    var nScreenHeight=window.innerHeight;

                        if(nFooterTop<(nScreenHeight-nFooterHeight)){
                            $(oFooter).css({
                                position:'fixed',
                                left:'0',
                                bottom:'80px'
                            });
                        }else{
                            $(oFooter).css({
                                position:'static'
                            });
                        }
                    }
                     setICPLocation();
                    //cancelImgLayer();
                    //图片懒加载
                    (function(){
                        var aImg=$('.cart-item .goods-pic img');
                        imgLazy(aImg);
                    })();

                    

                    changeStatus();
                    removeItem();
                    changeNum();
                    calcPrice();
                },
                error:function(err){
                    console.log(err);
                    //cancelImgLayer();
                }
            });
        }


        //总价计算
        function calcPrice(){
            var num=0;
            showImgLayer('数据请求中...');
            $.ajax({
                type:'post',
                url:apiUrl+'/shoppingcart/goods/list',
                contentType:'application/json',
                data:JSON.stringify({
                    goodsList:JSON.parse(getSto('tempCart'))
                }),
                success:function(data){
                    if(data.head.code){
                        console.log(data.head.message);
                        cancelImgLayer();
                        return;
                    }
                    
                    var data=data.body;
                    //提示购物车异常页面
                    if(!data.goodsList.length){
                        $('.cart-nothing').css('display','block');
                        cancelImgLayer();
                        return;
                    }

                    data.goodsList.forEach(function(item,index){
                        if(item.selected){
                            num+=parseFloat(item.salePrice)*item.number;
                        }
                    });
                    $(oPrice).text('￥'+num);
                    //结算数量
                    cartPayCount(data.goodsList);
                    cancelImgLayer();

                },
                error:function(err){
                    console.log(err);
                    cancelImgLayer();
                }
            });
        }

        //删除项
        function removeItem(){
            var aItem=$('.wrap-cart>.cart-list li.cart-item');
            var oWrap=$('.opacity');
            var oBtn=$('.opacity .con li:last-of-type');
            var oCancel=$('.opacity .con li:first-of-type');

            aItem.each(function(index,item){
                $(item).find('.cart-item-remove em').on('click',function(){
                    
                    alertC(index);
                });
            });

            //点击取消窗口消失
            oCancel.on('click',function(){
                cancel();
            });

            //窗口的确认
            oBtn.on('click',function(){
                
                $(aItem[$(this).get(0).dataset.index]).remove();

                var aItem1=$('.wrap-cart>.cart-list li.cart-item');
                updateData(aItem1);
                calcPrice();
                cancel();
            });

            //弹出窗口函数
            function alertC(index){
                oBtn.attr('data-index',index);
                oWrap.css('display','block');
                setTimeout(function(){
                    oWrap.css('opacity',1);
                },50);
            }

            //窗口消失函数
            function cancel(){
                oWrap.css('opacity',0);
                setTimeout(function(){
                    oWrap.css('display','none');
                },500);
            }
        }

        //选中未选中函数
        function changeStatus(){
            var aItem=$('.wrap-cart>.cart-list li.cart-item');
            var oAllBtn=$('.account>.pay-price span');
            //var iLen=aItem.length;
            var iNum=0;
            var n=0;//存储可以被选中的数量

            aItem.each(function(index,item){

                if($(item).find('.select-box').get(0).dataset.soldout=='false'){//存储可以被选中的初始数量
                    n++;
                }

                if(item.dataset.btn=='true'){//存储被选中的初始数量
                    iNum++;
                }

                $(item).find('.select-box').on('click',function(){
                    if(item.dataset.btn=='true'){
                        item.dataset.btn='false';
                        $(this).removeClass('active');
                        iNum--;
                    }else{
                        item.dataset.btn='true';
                        $(this).addClass('active');
                        iNum++;
                    }
                    var aItem1=$('.wrap-cart>.cart-list li.cart-item');
                    updateData(aItem1);

                    if(iNum==n&&iNum!=0){
                    oAllBtn.get(0).dataset.btn='true';
                        $(oAllBtn).addClass('active');
                    }else{
                        oAllBtn.get(0).dataset.btn='false';
                        $(oAllBtn).removeClass('active');
                    }
                    calcPrice();
                });
                
                
            });

            if(iNum==n&&iNum!=0){
                oAllBtn.get(0).dataset.btn='true';
                $(oAllBtn).addClass('active');
            }else{
                oAllBtn.get(0).dataset.btn='false';
                $(oAllBtn).removeClass('active');
            }

            //全选和全未选择
            $(oAllBtn).on('click',function(){
                var _this=this;
                var soldoutNum=0;

                //判断是不是能够点击全选按钮
                var iSolidOutNum=0;
                var aLi=$('.wrap-cart>.cart-list li.cart-item');
                var iSolidOutLen=aLi.length;
                aLi.each(function(index,item){
                    if($(item).find('.select-box').get(0).dataset.soldout=='true'){
                        iSolidOutNum++;
                    }
                });
                if(iSolidOutNum==iSolidOutLen){
                    return;
                }

                if(oAllBtn.get(0).dataset.btn=='false'){
                    $(_this).addClass('active');
                    oAllBtn.get(0).dataset.btn='true';

                    // aItem.forEach(function(item,index){
                    //     $(item).find('.select-box').addClass('active');
                    //     item.dataset.btn='true';
                    // });
                    // iNum=aItem.length;

                    aItem.each(function(index,item){
                        if($(item).find('.select-box').get(0).dataset.soldout=='false'){
                            $(item).find('.select-box').addClass('active');
                            item.dataset.btn='true';
                        }else{
                            soldoutNum++;
                        }
                    });
                    iNum=aItem.length-soldoutNum;
                }else{
                    $(_this).removeClass('active');
                    oAllBtn.get(0).dataset.btn='false';

                    aItem.each(function(index,item){
                        $(item).find('.select-box').removeClass('active');
                        item.dataset.btn='false';
                    });
                    iNum=0;
                }

                var aItem1=$('.wrap-cart>.cart-list li.cart-item');
                updateData(aItem1);
                calcPrice();
            });
        }

        //改变数量
        function changeNum(){
            var aItem=$('.wrap-cart>.cart-list li.cart-item');

            aItem.each(function(index,item){
                var iCount=$(item).find('.goods-count input').val();
                //加
                $(item).find('.goods-add').on('click',function(){
                    if(iCount>=9){
                        $('.opacity3').css('opacity',1);
                        $('.opacity3').css('display','block');
                        $('.opacity3 .adds').css('display','none');
                        $('.opacity3 .buys').css('display','block');
                        setTimeout(function(){
                               $('.opacity3').css('display','block');
                            },50);
                        $('.cancel').on('click',function(){
                            $('.opacity3').css('opacity',0);
                            $('.opacity3 .adds').css('display','none');
                            setTimeout(function(){
                                $('.opacity3').css('display','none');
                                },50);
                        })
                        return;
                    }
                    iCount++;
                    $(item).find('.goods-count input').val(iCount);

                    var aItem1=$('.wrap-cart>.cart-list li.cart-item');
                    updateData(aItem1);
                    calcPrice();
                });
                //减
                $(item).find('.goods-minus').on('click',function(){
                    if(iCount<=1){
                        return;
                    }
                    iCount--;
                    $(item).find('.goods-count input').val(iCount);

                    var aItem1=$('.wrap-cart>.cart-list li.cart-item');
                    updateData(aItem1);
                    calcPrice();
                });
            });
        }

        //更新数据
        function updateData(aItem){

            var arr=[];
            aItem.each(function(index,item){
                //console.log(typeof $(item).get(0).dataset.btn.valueOf());
                arr.push({
                    goodsId:item.dataset.goodsid,
                    accessoryId:item.dataset.suit,
                    comment:item.dataset.comment,
                    number:$(item).find('.goods-count input').val(),
                    selected:$(item).get(0).dataset.btn
                });
            });

            setSto('tempCart',JSON.stringify(arr));
        }
    }

    //点击结算
    $(oBtn).on('click',function(){
        var aItem=$('.wrap-cart>.cart-list li.cart-item');
        var arr=[];

        aItem.each(function(index,item){
            //console.log(typeof $(item).get(0).dataset.btn.valueOf());
            if($(item).get(0).dataset.btn=='true'){
                arr.push({
                    goodsId:item.dataset.goodsid,
                    accessoryId:item.dataset.suit,
                    comment:item.dataset.comment,
                    number:$(item).find('.goods-count input').val(),
                    selected:$(item).get(0).dataset.btn,
                    id:item.dataset.id
                });
            }
        });

        if(!arr.length){
            alert('请勾选商品~');
            return;
        }

        setSto('tempOrderCart',JSON.stringify(arr));

        location.href='ok-order.html?from=cart';
    });
})();