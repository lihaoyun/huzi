import '../css/public.css';
import '../css/product-details.css';
import $ from 'jquery';
import apiUrl from '../js/config';
import {rand,signName,reTop,prevUrl,getSto,setSto,rmSto,url_search,imgLazy,cartCount,allSto,showImgLayer,cancelImgLayer} from '../js/config';
import md5 from 'md5';
var vipNo=getSto('vipNo');
var token=getSto('token');
var goodsID=url_search().id;
var tempPay=[];//存入商品信息的临时数据
var sGoodsId=goodsID;//商品id
var sAccessoryId='';//配件id
var iNumber=1;;//商品个数
var sComment='';//备注内容
//获取购物车数量
cartCount($('.func-public em'));


//alert('wqerewresrwqerewresrwqerewresrwqerewresrwqerewresrwqerewresrwqerewresrwqerewresrwqerewresrwqerewresrwqerewresrwqerewresrwqerewresrwqe45657'.length);

//展示商品详情
renderDetail(goodsID);
function renderDetail(ID){
    var goodsBigImg=$('.gallery-top .swiper-wrapper');//商品大图
    var sBigImg='';
    var goodsSmallImg=$('.gallery-thumbs .swiper-wrapper');//商品小图
    var sSmallImg='';
    var goodsName=$('.right-words .words-title h2');//商品名称
    var goodsSubName=$('.right-words .words-title p span');
    var oLabelWrap=$('.words-title ul');//商品标签
    var sLabel='';
    var goodsKind=$('.goods-kind');//品类
    var sGoodsKind='';
    var oAccessorys=$('.accessorys');
    var sAccessorys='';
    var salePrice=$('.sale-price');//销售价格
    var signPrice=$('.sign-price');//标签价格
    var oImgDetail=$('.img-detail');//图文详情
    var sImgDetail='';
    $.ajax({
        type:'get',
        url:apiUrl+'/goods/detail/queryGoodsById',
        data:{
            goodsId:ID,
        },
        success:function(data){
            if(data.head.code){
                if(data.head.code==30004){///////////////////////////////// 已售罄返回上一页面
                    $('.opacity4').css('opacity','1');
                    setTimeout(function(){
                           $('.opacity4').css('display','block');
                        },50);
                    //点击好按钮返回原来页
                    $('.btn').on('click',function(){
                        location.href=prevUrl();
                        // 弹窗消失
                        $('.opacity4').css('opacity','1');
                        $('.btn').css('display','none');
                        setTimeout(function(){
                               $('.opacity4').css('display','block');
                            },50);
                    })
                    return;
                }
                console.log(data.head.message);
                //alert(data.head.message);
                //location.href=prevUrl();
                return;
            }
            var data=data.body.goods;
            //console.log(data);
           

            //商品大图
            data.topPictures.forEach(function(item,index){
                sBigImg+=`<div class="swiper-slide"><img src=${item}></div>`;
                sSmallImg+=`<div class="swiper-slide"><img src=${item}></div>`;
            });
            $(goodsBigImg).html(sBigImg);
            $(goodsSmallImg).html(sSmallImg);
            var galleryTop = new Swiper('.gallery-top', {
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                spaceBetween: 10,
            });
            var galleryThumbs = new Swiper('.gallery-thumbs', {
                spaceBetween: 10,
                centeredSlides: true,
                slidesPerView: 'auto',
                touchRatio: 0.2,
                slideToClickedSlide: true,
                slidesOffsetBefore : -65,
            });
            galleryTop.params.control = galleryThumbs;
            galleryThumbs.params.control = galleryTop;

            
            //图片懒加载
            (function(){
                var aImg=$('.left-pic .gallery-top img');
                imgLazy(aImg);
            })();
            //商品名称
            $(goodsName).text(data.longName);
            $(goodsSubName).text(data.subtitle);

            //标签
            if(data.labels[0]){
                data.labels.forEach(function(item,index){
                    if(index<3){
                        switch(item.id){
                            case 10:
                                sLabel+=`<li class="blue">${item.labelContent}</li>`;
                            break;
                            case 6:
                                sLabel+=`<li class="pink">${item.labelContent}</li>`;
                            break;
                            case 7:
                                sLabel+=`<li class="sea">${item.labelContent}</li>`;
                            break;
                            case 5:
                                sLabel+=`<li class="sky">${item.labelContent}</li>`;
                            break;
                            case 9:
                                sLabel+=`<li class="deep-sea">${item.labelContent}</li>`;
                            break;
                            case 8:
                                sLabel+=`<li class="light-pink">${item.labelContent}</li>`;
                            break;
                            case 1:
                                sLabel+=`<li class="light-red">${item.labelContent}</li>`;
                            break;
                            case 2:
                                sLabel+=`<li class="light-yellow">${item.labelContent}</li>`;
                            break;
                            case 3:
                                sLabel+=`<li class="light-green">${item.labelContent}</li>`;
                            break;
                            case 4:
                                sLabel+=`<li class="deep-blue">${item.labelContent}</li>`;
                            break;
                            default:
                            sLabel+=`<li class="sea">${item.labelContent}</li>`;
                        }
                    }
                });
            }
            $(oLabelWrap).html(sLabel);

            //品类
            data.relationGoods.forEach(function(item,index){
                if(item.mark){
                    sGoodsKind+=`<li data-id=${item.id} class="active">${item.name}</li>`;
                }else{
                    sGoodsKind+=`<li data-id=${item.id}>${item.name}</li>`;
                }
            });
            $(goodsKind).html(sGoodsKind);

            $('.goods-kind li').each(function(index,item){
                $(item).on('click',function(){console.log(sGoodsId,sAccessoryId,iNumber,sComment);
                    if(sGoodsId==$(item).get(0).dataset.id){
                        return;
                    }
                    //每次要清空相关商品信息
                    tempPay=[];//存入商品信息的临时数据
                    sGoodsId=goodsID;//商品id
                    sAccessoryId='';//配件id
                    iNumber=1;;//商品个数
                    sComment='';//备注内容
                    //renderDetail($(item).get(0).dataset.id);
                    location.href='product-details.html?id='+$(item).get(0).dataset.id;
                    sGoodsId=$(item).get(0).dataset.id;
                });
            });
            //配件
            if(!data.accessorys.length){
                $(oAccessorys).parent().css('display','none');
            }else{
                $(oAccessorys).parent().css('display','block');
            }
            data.accessorys.forEach(function(item,index){
                sAccessorys+=`<li data-id=${item.id}>${item.length}</li>`;
            });
            $(oAccessorys).html(sAccessorys);
            var accessorysIndex=0;
            $('.accessorys li').each(function(index,item){
                $(item).on('click',function(){
                    $('.accessorys li').eq(accessorysIndex).removeClass('active');
                    $(item).addClass('active');
                    accessorysIndex=index;
                    sAccessoryId=$(item).get(0).dataset.id;console.log(sGoodsId,sAccessoryId,iNumber,sComment);
                });
            });
            //商品个数
            $('.goods-remain').on('click',function(){
                if(iNumber==1){
                    return;
                }
                iNumber--;
                $('.goods-count input').val(iNumber);
                console.log(sGoodsId,sAccessoryId,iNumber,sComment);
            });

            $('.goods-add').on('click',function(){
                if(iNumber==9){
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
                iNumber++;
                $('.goods-count input').val(iNumber);
                console.log(sGoodsId,sAccessoryId,iNumber,sComment);
            });
            if(!data.custom){
                $('.comments').css('display','none');
            }
            //商品diy需求
            var sVal='';
            $('.right-words .words-size .comments-ty').on('input',function(){
                if(sVal.length>=140){
                    sVal=sVal.slice(0,sVal.length-1);
                    $(this).val(sVal);
                }else{
                    sVal=$(this).val();
                }
                sComment=sVal;console.log(sGoodsId,sAccessoryId,iNumber,sComment);
            });
            //价格
            $(salePrice).text(data.salePrice);
            $(signPrice).text('￥'+data.labelPrice);
            //如果标签价为0则隐藏
            if(data.labelPrice == null || data.labelPrice == "0"){
                $('.right-words .words-buy p span i').css('display','none');
            }


            //图文详情
            data.detailPictures.forEach(function(item,index){
                sImgDetail+=`<img src=${item}>`;
            });
            $(oImgDetail).html(sImgDetail);

            //图片懒加载
            (function(){
                var aImg=$('.img-detail img');
                imgLazy(aImg);
            })();
 
            var commentIndex=0;
            $('.right-comment ul li').each(function(index,item){
                $(item).on('click',function(){
                    if(index==0){
                        $('.img-detail').css('display','block');
                        $('.discuss').css('display','none');
                    }else{
                        $('.img-detail').css('display','none');
                        $('.discuss').css('display','block');
                    }
                    $('.right-comment ul li').eq(commentIndex).removeClass('active');
                    $(this).addClass('active');
                    commentIndex=index;
                });
            });

            //立即购买
            $('.buy-now').on('click',function(){
                if(data.accessorys.length&&sAccessoryId==''){
                    alert('请选择商品配件');
                    return;
                }else if(data.custom&&sComment==''){
                    alert('请填写DIY备注信息');
                    return;
                }
                // if(sGoodsId==''||(data.accessorys.length&&sAccessoryId=='')||(data.custom&&sComment=='')){
                //     console.log(sGoodsId,sAccessoryId,iNumber,sComment);
                //     alert('有未选项');
                //     return;
                // }
                tempPay.push({
                    goodsId:sGoodsId,
                    accessoryId:sAccessoryId,
                    selected:false,
                    number:iNumber,
                    comment:sComment
                });
                setSto('tempOrderPay',JSON.stringify(tempPay));
                location.href='ok-order.html?from=buy';
            });
            
            //加入购物车
            var tempArr=JSON.parse(getSto('tempCart'))||[];//获取临时购物车数据
            $('.add-to').on('click',function(){
                if(data.accessorys.length&&sAccessoryId==''){
                    alert('请选择商品配件');
                    return;
                }else if(data.custom&&sComment==''){
                    alert('请填写DIY备注信息');
                    return;
                }
                // if(sGoodsId==''||(data.accessorys.length&&sAccessoryId=='')||(data.custom&&sComment=='')){
                //     alert('有未选项');
                //     return;
                // }

                if(!vipNo){//如果未登录
                    var tempJSON={};
                    var tempC=JSON.parse(getSto('tempCart'));//获取临时购物车
                    var nCartCount=0;//
                    var isM=false;//不合并状态
                    var isBtn=false;//判断如果临时购物车没有数据则不走第二个分的开关
                    //判断新选择的商品和购物车已有的是不是一件商品
                
                    if(!sAccessoryId){
                        sAccessoryId='null';
                    }

                    if(tempC){//如果临时购物车有数据
                        
                        tempC.forEach(function(item,index){
                            
                            if(item.goodsId==sGoodsId.toString()&&item.accessoryId==sAccessoryId.toString()&&item.comment==sComment){//如果商品id不同
                            
                                nCartCount=parseInt(item.number)+parseInt(iNumber);
                                if(nCartCount>9){
                                    item.number=parseInt(item.number);
                                     //添加购物车成功提示
                                    $('.opacity3').css('opacity',1);
                                    $('.opacity3').css('display','block');
                                    $('.opacity3 .buys').css('display','none');
                                    setTimeout(function(){
                                           $('.opacity3').css('display','block');
                                           $('.opacity3 .adds').css('display','none');
                                            $('.opacity3 .buys').css('display','block');
                                        },50);
                                    $('.cancel').on('click',function(){
                                        $('.opacity3').css('opacity',0);
                                        $('.opacity3 .buys').css('display','none');
                                        setTimeout(function(){
                                            $('.opacity3').css('display','none');
                                            },50);
                                    });
                                }else{
                                    item.number=nCartCount;
                                }
                                isM=true;
                                return;
                            }
                        });
                    }else{//如果临时购物车没有数据
                        
                        tempJSON={
                            goodsId:sGoodsId,
                            accessoryId:sAccessoryId,
                            selected:false,
                            number:iNumber,
                            comment:sComment
                        };
                        tempArr.push(tempJSON);
                        setSto('tempCart',JSON.stringify(tempArr));
                        
                        isBtn=true;

                    }
                    
                    if(isM){//如果商品id不同的个数和临时购物车相等则合
                        setSto('tempCart',JSON.stringify(tempC));
                    }else if(!isM&&!isBtn){
                        tempJSON={
                            goodsId:sGoodsId,
                            accessoryId:sAccessoryId,
                            selected:false,
                            number:iNumber,
                            comment:sComment
                        };
                        tempArr.push(tempJSON);
                        setSto('tempCart',JSON.stringify(tempArr));
                    }

                    if(nCartCount<10){
                        //添加购物车成功提示
                        $('.opacity3').css('opacity',1);
                        $('.opacity3').css('display','block');
                        $('.opacity3 .buys').css('display','none');
                        setTimeout(function(){
                               $('.opacity3').css('display','block');
                               $('.opacity3 .adds').css('display','block');
                            },50);
                        $('.cancel').on('click',function(){
                            $('.opacity3').css('opacity',0);
                            $('.opacity3 .buys').css('display','none');
                            setTimeout(function(){
                                $('.opacity3').css('display','none');
                                },50);
                        });
                    }

                    
                    //购物车数量
                    cartCount($('.func-public em'));
                    //location.href='product-details.html?id='+sGoodsId;
                }else{//如果登录
                    getData({
                        memberNo:vipNo,
                        goodsId:sGoodsId,
                        accessoryId:sAccessoryId,
                        number:iNumber,
                        comment:sComment
                    });
                }
                function getData(json){
                    showImgLayer('数据请求中...');
                    var token=getSto('token');
                    $.ajax({
                        type:'post',
                        headers:signName(md5,vipNo,token),
                        url: apiUrl+'/shoppingcart/addShoppingCart',
                        data:json,
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
                            }else{
                                 $('.opacity3').css('opacity',1);
                                $('.opacity3').css('display','block');
                                $('.opacity3 .buys').css('display','none');
                                setTimeout(function(){
                                       $('.opacity3').css('display','block');
                                       $('.opacity3 .adds').css('display','block');
                                    },50);
                                $('.cancel').on('click',function(){
                                    $('.opacity3').css('opacity',0);
                                    $('.opacity3 .buys').css('display','none');
                                    setTimeout(function(){
                                        $('.opacity3').css('display','none');
                                        },50);
                                }) 
                            }
                            
                            //购物车数量
                            cartCount($('.func-public em'));
                            console.log(cartCount);
                            //location.href='goods-detail.html?id='+json.goodsId;
                            
                        },
                        error:function(){}
                    });
                }
            });
        },
        error:function(err){
            console.log(err);
        }
    });
    
    //猜你喜欢
    var oGuess=$('.guess-like');
    var sGuess='';

    $.ajax({
        type:'get',
        url:apiUrl+'/home/queryHomeGoodsByPage',
        data:{
            type:3,
            pageNum:1,
            pageSize:3
        },
        success:function(data){
            if(data.head.code){
                console.log(data.head.message);
                //alert(data.head.message);
                //location.href=prevUrl();
                return;
            }

            var data=data.body;
            data.goodsVoList.forEach(function(item,index){
                    sGuess+=`<li class="goods-gife-item">
                      <div>
                          <img data-src=${item.goodsPicture}>
                          <em>￥${item.salePrice}</em>
                          <p>${item.longName}</p> 
                      </div>
                      <a href=product-details.html?id=${item.id} target="_blank"></a>
                    </li>`;
                });
            $(oGuess).html(sGuess);
            //图片懒加载
            (function(){
                var aImg=$('.guess-like img');
                imgLazy(aImg);
            })();
        },
        error:function(err){
            console.log(err);
        }
    });
}


