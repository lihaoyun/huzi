import '../css/public.css';
import '../css/ok-order.css';
import $ from 'jquery';
import apiUrl from '../js/config';
import {
    rand,
    signName,
    reTop,
    tabBar,
    findArrIndex,
    imgLazy,
    setSto,
    getSto,
    cartCount,
    rmSto,
    allSto,
    url_search,
    prevUrl
} from '../js/config';
import md5 from 'md5';

var vipNo = getSto('vipNo');
var token = getSto('token');
var iTotalPrice = 0;
var isExitAdress=0;
var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    slidesPerView: 3,
    paginationClickable: true,
    spaceBetween: 30,
    freeMode: true
});
//获取购物车数量
cartCount($('.func-public em'));

var table = $('.table-address');
//默认收货地址隐藏
$('.default-address').on('click', function () {
    $(table).toggle();
});
var goodsListParam=null;
//一期定制过来的页面
if (url_search().from == 'custom') {
    myCard();
    oInvoiceMethod();
    adressList();
    showDefaultAddress(vipNo);
    showAddressList(vipNo);
    newAdress();
    //$('.words').css('display','none');
    //展示定制商品详情
    var oCustom = $('.wrap-cart-info');
    var sCustom = '';

    sCustom += `<ul class="custom-top">
			<li>宝贝</li>
			<li>款式</li>
			<li>材质</li>
			<li>尺寸</li>
			<li>刻字</li>
			<li>备注</li>
		</ul>
		<div class="info-item clear">
          <div class="item-pic"><img src=${getSto('picUrl')}></div>
          <div class="item-details item-custom" style="border-top:none">
              <div class="item-name">${getSto('goods-style')}</div>
              <div class="item-size">${getSto('goods-material')}</div>
              <div class="item-price">${getSto('goods-size')}</div>
              <div class="item-num">${getSto('letter-words')}</div>
              <div class="item-remark">${getSto('comment')}</div>
          </div>
        </div>`;
    $(oCustom).html(sCustom);
    $('.pay-detail p em').text(getSto('order-money'));

    //$('.goods-price em').text(getSto('order-money'));

    (function () {
        //优惠券
        iTotalPrice = getSto('order-money').slice(1);
        var oPacity = $('.opacity');
        var oText = $('.coupon input');
        var oCouponPrice1 = $('.coupon em');
        var oCouponPrice2 = $('.coupon-price em');
        var oGoosPrice = $('li.goods-price>em');
        var oLastPrice = $('.pay-detail p em');
        var text = '';
        $(oGoosPrice).text(iTotalPrice);
        oText.on('input', function () {
            var val = $(this).val();
            if (val.length < 9) {
                text = val;
                $(oCouponPrice1).text('-￥00');
                $(oCouponPrice2).text('-￥00');
                $(oLastPrice).text('支付金额：￥' + parseInt(iTotalPrice) - iNumPrice);
            } else {
                $(oText).val(text);
            }
            if (val.length == 8) {
                $(oText).blur();
                $.ajax({
                    type: 'get',
                    headers: signName(md5, vipNo, token),
                    url: apiUrl + '/order/coupons?coupon=' + val,
                    success: function (data) {
                        if (data.head.code) {

                            if (data.head.code == 71982) {
                                rmSto('nickname');
                                rmSto('timestamp');
                                rmSto('token');
                                rmSto('vipNo');
                                alert('出现错误，请重新登录！');
                                location.href = 'personal-orders.html';
                            }
                            alert(data.head.message);
                            return;
                        }
                        if (!data.body.status) {
                            $(oPacity).css('display', 'block');
                            setTimeout(function () {
                                $(oPacity).css('opacity', 1);
                            }, 50);

                            setTimeout(function () {
                                $(oPacity).css('opacity', 0);
                            }, 1100);

                            setTimeout(function () {
                                $(oPacity).css('display', 'none');
                            }, 1650);

                            $(oCouponPrice1).text('-￥00');
                            $(oCouponPrice2).text('-￥00');
                            $(oLastPrice).text('支付金额：￥' + iTotalPrice);

                            return;
                        }
                        var item = data.body.coupons[0];
                        $(oCouponPrice1).text('-￥' + item.couponPrice);
                        $(oCouponPrice2).text('-￥' + item.couponPrice);
                        $(oLastPrice).text('支付金额：￥' + (iTotalPrice - item.couponPrice));
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            }
        });
        //结算
        var oBtn = $('.pay-detail .submit-btn');
        var vipNo = sessionStorage.getItem("vipNo");
        var token = sessionStorage.getItem("token");
        oBtn.on('click', function () {
            var aID = sessionStorage.getItem("addressID");

            if (aID.toString() == 'null') {
                alert('请添加收货地址！');
                return;
            }
            $.ajax({
                type: 'post',
                headers: signName(md5, vipNo, token),
                url: apiUrl + '/order',
                data: {
                    memberNo: getSto("vipNo"),
                    addressId: getSto("addressID"),
                    payType: 1,
                    orderComment: $.trim($('#comment').val()),//订单评论
                    cover: getSto("picUrl"),
                    styleCode: getSto("style"),
                    materialCode: getSto("material"),
                    sizeCode: getSto("size"),
                    style: getSto("goods-style"),
                    material: getSto("goods-material"),
                    size: getSto("goods-size"),
                    lettering: getSto("letter-words"),
                    coupon: $('.coupon input').val(),
                    invoiceContent: $.trim($('#sInvoice').val()),
                    couponNew:JSON.parse(getSto('coupon-card')).id,
                    comment:getSto('comment')//商品评论
                },
                success: function (data) {
                    if (data.head.code) {

                        if (data.head.code == 71982) {
                            rmSto('nickname');
                            rmSto('timestamp');
                            rmSto('token');
                            rmSto('vipNo');
                            alert('出现错误，请重新登录！');
                            location.href = 'personal-orders.html';
                        }
                        alert(data.head.message);
                        return;
                    }

                    $.ajax({
                        type: 'post',
                        headers: signName(md5, vipNo, token),
                        url: apiUrl + '/customization/order/pay',
                        data: {
                            orderNo: data.body.orderNo
                        },
                        success: function (data) {
                            if (data.head.code) {

                                if (data.head.code == 71982) {
                                    rmSto('nickname');
                                    rmSto('timestamp');
                                    rmSto('token');
                                    rmSto('vipNo');
                                    alert('出现错误，请重新登录！');
                                    location.href = 'personal-orders.html';
                                }
                                alert(data.head.message);
                                return;
                            }
                            var form = data.body.form;
                            _AP.pay(form);
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });
                },
                error: function (err) {
                    console.log(err);
                }
            });

        });
    })();
    
} else {//如果是非一期定制来的
    goodsListParam=url_search().type=='2'?JSON.parse(getSto('tempOrderCart')):JSON.parse(getSto('tempOrderPay'))//判断数据是从购物车来还是从立即购买来
    oInvoiceMethod();
    adressList();
    showDefaultAddress(vipNo);
    showAddressList(vipNo);
    newAdress();
    var sGoodsInfo = '';
    var aGoodsInfo;

    switch (url_search().from) {
        case 'buy'://立即购买
            aGoodsInfo = JSON.parse(getSto('tempOrderPay'));
            myCard();
            break;
        case 'cart'://购物车
            aGoodsInfo = JSON.parse(getSto('tempOrderCart'));
            myCard();
            break;
    }

    if (vipNo) {//如果登录了
        showGoodsList(vipNo);
    } else {//如果未登录
        //获取图片验证码
        var oImg = $('.login>li>img');
        var ID = getSto("deciveID");

        //弹出登录层
        var oPacity = $('.opacity2');
        var oCancel = ('.user h3 span')
        $(oPacity).css('display', 'block');
        setTimeout(function () {
            $(oImg).get(0).src = apiUrl + '/pic?t=' + Date.now() + '&random=' + ID;
            $(oPacity).css('opacity', 1);
        }, 50);
        // 点击取消登录层
        $(oCancel).on('click', function () {
            location.href = prevUrl();
            $(oPacity).css('opacity', 0);
            setTimeout(function () {
                $(oPacity).css('display', 'none');
            }, 50);
        })

        //点击更换验证码
        $(oImg).on('click', function () {
            $(this).get(0).src = apiUrl + '/pic?t=' + Date.now() + '&random=' + ID;
        });

        var reg = /^((1[0-9]{1})+\d{9})$/;
        //验证手机号获取验证码
        (function () {
            var oBtn = $('.login>li>button');
            var num = 60;
            var timer = null;
            var iBtn = true;

            oBtn.on('click', function () {
                if (!iBtn) {
                    return
                }

                var val = $('.login>li>input.tel').val();

                if (!reg.test(val)) {
                    alert('请输入有效的手机号码');
                    return;
                }
                iBtn = false;
                timer = setInterval(function () {
                    num--;
                    oBtn.html(num + 's');
                    oBtn.css({
                        'color': '#999',
                        'border': '1px solid #999'
                    });
                    if (num < 0) {
                        clearInterval(timer);
                        oBtn.html('重新获取');
                        iBtn = true;
                        num = 60;
                        oBtn.css({
                            'color': '#666',
                            'border': '1px solid #666'
                        });
                    }
                }, 1000);


                $.ajax({
                    type: 'post',
                    url: apiUrl + '/user/captcha',
                    data: {
                        mobile: val
                    },
                    success: function (data) {

                        if (data.head.code) {
                            alert(data.head.message);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            });
        })();

        //登录
        (function () {
            var oLogin = $('.login-btn');
            var oImg = $('.login>li>img');
            var oBtn = $('.logout');

            oLogin.on('click', function () {
                var iSign = $('.sign').val();
                var iTel = $('.tel').val();
                var iCode = $('.code').val();
                var oP = $('.opacity2');
                var iBtn = false;//控制刚登录时头像显示开关

                if (iTel == '' || iCode == '') {
                    alert('手机号或验证码不能为空！');
                } else {
                    $.ajax({
                        type: 'post',
                        url: apiUrl + '/login',
                        data: {
                            mobile: iTel,
                            captcha: iCode,
                            captchaNo: iSign,
                            random: ID
                        },
                        success: function (data) {
                            if (data.head.code) {
                                alert(data.head.message);
                                $(oImg).get(0).src = apiUrl + '/pic?t=' + Date.now() + '&random=' + ID;
                                return;
                            }
                            var vipNo = data.body.memberNo;
                            token = data.body.token;
                            setSto("token", data.body.token);
                            setSto("vipNo", vipNo);
                            setSto("nickname", data.body.nickName);
                            iBtn = true;

                            //alert(data.head.message);
                            showDefaultAddress(vipNo);
                            showAddressList(vipNo);
                            showGoodsList(vipNo)
                            //获取购物车数量
                            cartCount($('.func-public em'));

                            $('.user-info .quit-btn').css('display', 'block');
                            //$('.user-center-detail>a').css('display','block');

                            $(oPacity).css('opacity', 0);
                            setTimeout(function () {
                                $(oPacity).css('display', 'none');
                            }, 510);
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });
                }
            });
        })();
    }
    (function () {
        var oBtn = $('.pay-detail .submit-btn');//提交订单按钮
        var token = getSto('token');
        $(oBtn).on('click', function () {
            console.log('memberNo:', vipNo, '-addressId:', getSto('addressID'), '-coupon:', $('.coupon input').val(), '-comment:', $('.pay-detail>ul>li.words>textarea').val(), '-source:', url_search().type + '-goodsList:', JSON.parse(getSto('tempOrderCart')));
            $.ajax({
                type: 'post',
                headers: signName(md5, vipNo, token),
                url: apiUrl + '/shoppingcart/order',
                contentType: 'application/json',
                data: JSON.stringify({
                    memberNo: getSto('vipNo'),
                    addressId: getSto('addressID'),
                    payType: 1,
                    coupon: $('.coupon input').val() || JSON.parse(getSto('coupon-card'))==null?'':JSON.parse(getSto('coupon-card')).id,
                    comment:$.trim($('#comment').val()),//订单评论
                    invoiceContent: $.trim($('#sInvoice').val()),
                    source: url_search().from == 'cart' ? 2 : 1,
                    //goodsList:JSON.parse(getSto('tempOrderCart'))
                    goodsList: url_search().from == 'cart' ? JSON.parse(getSto('tempOrderCart')) : JSON.parse(getSto('tempOrderPay'))
                }),
                success: function (data) {
                    if (data.head.code) {

                        if (data.head.code == 71982) {
                            rmSto('nickname');
                            rmSto('timestamp');
                            rmSto('token');
                            rmSto('vipNo');
                            alert('出现错误，请重新登录！');
                            location.href = 'personal-orders.html';
                        }
                        alert(data.head.message);
                        return;
                    }
                    // return;
                    //调用支付宝
                    $.ajax({
                        type: 'post',
                        headers: signName(md5, vipNo, token),
                        url: apiUrl + '/shoporder/pay',
                        data: {
                            memberNo: getSto('vipNo'),
                            orderNo: data.body.orderNo
                        },
                        success: function (data) {
                            console.log('c:', data);
                            if (data.head.code) {

                                if (data.head.code == 71982) {
                                    rmSto('nickname');
                                    rmSto('timestamp');
                                    rmSto('token');
                                    rmSto('vipNo');
                                    alert('出现错误，请重新登录！');
                                    location.href = 'personal-orders.html';
                                }
                                console.log(data.head.message);
                                return;
                            }
                            var form = data.body.form;
                            _AP.pay(form);
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });
                },
                error: function () {

                }
            });
        });
    })();
}
// 我的优惠券
function myCard() {
    var cardNum=$('.yhq>p>span>em');
    $.ajax({
        type:'post',
        headers:signName(md5,vipNo,token),
        url:apiUrl+'/address/detail/mycount',
        contentType:'application/json',
        async:false,
        data:JSON.stringify({
            memberNo:vipNo,
            styleCode:sessionStorage.getItem("style"),
            materialCode:sessionStorage.getItem("material"),
            sizeCode:sessionStorage.getItem("size"),
            goodsList:goodsListParam //判断数据是从购物车来还是从立即购买来
        }),
        success:function(data){
            if(data.head.code){

                if(data.head.code==71982){
                    rmSto('nickname');
                    rmSto('timestamp');
                    rmSto('token');
                    rmSto('vipNo');
                    alert('出现错误，请重新登录！');
                    location.href='user-center.html';
                }
            }
            $(cardNum).text(data.body.count);//显示可用优惠券的张数
        },
        error:function(err){
            console.log(err);
        }
    });
    if(cardNum==0){
        return;
    }
    $.ajax({
        url: apiUrl + '/member/gift/querypart',
        headers: signName(md5, vipNo, token),
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
            memberNo:vipNo,
            styleCode:sessionStorage.getItem("style"),
            materialCode:sessionStorage.getItem("material"),
            sizeCode:sessionStorage.getItem("size"),
            goodsList:goodsListParam //判断数据是从购物车来还是从立即购买来
        }),
        success: function (data) {
            if (data.head.code) {
                alert('数据返回错误！');
                return;
            }
            var data = data.body.list;
            var cardI = $('.swiper-wrapper');
            var str = "";

            data.forEach(function (item, index) {
                str += `<div class="swiper-slide" id=${item.id} name=${item.enable} data-price=${item.coupon_price}>
                         <dl class='cardInfo'>
                            <dt><img src=${item.pic_url}></dt>
                            <dd>
                              <h2><span>${item.name}</span><b>X${item.number}</b></h2>
                              <em>有效期<i>${item.end_time}</i></em>
                              <h6>${item.description}</h6>
                            </dd>
                          </dl>
                      </div>`;
            });
            $(cardI).html(str);
            var activeIndex = 0;
            var cardList = $('.cardInfo').parent();
            cardList.each(function (index, item) {
                $(item).bind('click', function () {
                    $(cardList[activeIndex]).parent().removeClass('active');
                    $(item).parent().addClass('active');
                    activeIndex = index;

                    // 请求用户信息，判断是否完善
                    // (function () {
                        $.ajax({
                            type: 'get',
                            headers: signName(md5, vipNo, token),
                            url: apiUrl + '/member',
                            data: {
                                memberNo: vipNo
                            },
                            success: function (data) {
                                if (data.head.code) {
                                    if (data.head.code == 71982) {
                                        rmSto('nickname');
                                        rmSto('timestamp');
                                        rmSto('token');
                                        rmSto('vipNo');
                                        alert('出现错误，请重新登录！');
                                        location.href = 'personal-orders.html';
                                    }
                                    console.log(data.head.message);
                                    return;
                                }

                                var data = data.body.user;
                                if (data.nickname != '' && data.birthday != '' && data.gender != '' && data.mobile != '') {
                                    console.log("您的用户信息已经完善");
                                        //var iTotalPrice=iTotalPrice;
                                    if ($(item).attr('name') == "-1") {
                                        alert("您选择的优惠券不在适用范围内");
                                    } else {
                                        // location.href='ok-order.html?id='+item.id;
                                        setSto('coupon-card', JSON.stringify({id: item.id, name: $(item).find('h2 span').text()}));
                                        setSto('coupon-price', item.dataset.price);

                                    }
                                        var oPacity = $('.opacity');
                                        var oText = $('.coupon input');
                                        var oCouponPrice1 = $('.coupon em');
                                        var oCouponPrice2 = $('.coupon-price em');
                                        var oGoosPrice = $('li.goods-price>em');
                                        var oLastPrice = $('.pay-detail p em');
                                        var iCouponPrice = parseFloat((getSto('coupon-price')));
                                        var text = '';
                                        var iNumPrice = 0;
                                        //var iPrice=sessionStorage.getItem("order-money").slice(1);

                                        if (iCouponPrice && iCouponPrice > 1) {
                                            iNumPrice = iCouponPrice;
                                        } else if (iCouponPrice) {
                                            iNumPrice = parseInt(iTotalPrice * (1 - iCouponPrice));
                                        } else {
                                            iNumPrice = 0;
                                        }

                                        $(oGoosPrice).text('￥' + iTotalPrice);
                                        $(oLastPrice).text('￥' + (iTotalPrice - iNumPrice));
                                        $(oCouponPrice2).text('-￥' + iNumPrice);

                                } else {
                                        $('.opacity4').css("display", 'block');
                                        setTimeout(function () {
                                            $('.opacity4').css('opacity', 1);
                                        }, 50);
                                        var btnCancel = $('.opacity4 .con li:first-child');
                                        var btnSure = $('.opacity4 .con li:last-child');
                                        $(btnCancel).on('click', function () {
                                            cancel();
                                        });

                                        $(btnSure).on('click', function () {
                                            // 提示完善弹出层取消
                                            $('.opacity4').css("display", 'none');
                                            setTimeout(function () {
                                                $('.opacity4').css('opacity', 0);
                                            }, 50);

                                            //个人信息 点击编辑按钮
                                            (function () {
                                                var oWrap = $('.opacity5');
                                                var oBtn = $('.edit-btn');
                                                var oBtnCancel = $('.opacity5 .wrap-list-personal-info2>i')

                                                //打开个人信息弹层
                                                oWrap.css('display', 'block');
                                                setTimeout(function () {
                                                    oWrap.css('opacity', 1);
                                                }, 50);
                                                oBtnCancel.on('click', function () {
                                                    cancel();
                                                })

                                                var oAvatar = $('.opacity5 .edit-img1');//头像
                                                var oName = $('.opacity5 .edit-name1');//名字
                                                var oTel = $('.opacity5 .edit-tel1');//手机号
                                                var oDate1 = $('.opacity5 .edit-date1');//生日
                                                var oSex = $('.opacity5 .sex-item1 b');
                                                $.ajax({
                                                    type: 'get',
                                                    headers: signName(md5, vipNo, token),
                                                    url: apiUrl + '/member',
                                                    data: {
                                                        memberNo: vipNo
                                                    },
                                                    success: function (data) {
                                                        if (data.head.code) {
                                                            if (data.head.code == 71982) {
                                                                rmSto('nickname');
                                                                rmSto('timestamp');
                                                                rmSto('token');
                                                                rmSto('vipNo');
                                                                alert('出现错误，请重新登录！');
                                                                location.href = 'personal-orders.html';
                                                            }
                                                            console.log(data.head.message);
                                                            return;
                                                        }

                                                        var data = data.body.user;
                                                        console.log('ggg:', data);
                                                        $(oAvatar).attr('src', data.avatar);
                                                        $(oName).val(data.nickname);
                                                        $(oTel).val(data.mobile);
                                                        $(oDate1).val(data.birthday);//编辑生日
                                                        $(oSex).text(data.gender);
                                                    },
                                                    error: function (err) {
                                                        console.log(err);
                                                    }
                                                });
                                            })();

                                        });
                                        var oBthCancel = $('.opacity5 .wrap-list-personal-info2>i');
                                        oBthCancel.on('click', function () {
                                            $('.opacity5').css('opacity', 0);
                                            setTimeout(function () {
                                                $('.opacity5').css('display', 'none');
                                            }, 500);
                                        });
                                }
                                //保存修改个人资料
                                (function () {
                                    var oBtn = document.querySelector('.opacity5 .save');
                                    var oCircle = $('.circle');
                                    var oWrap = $('.opacity5');
                                    var token = sessionStorage.getItem("token");
                                    oBtn.addEventListener('click', function () {

                                        var oName = $('.opacity5 .edit-name1').val();
                                        var oTel = $('.opacity5 .edit-tel').val();
                                        var oSex = $('.opacity5 .sex-item1>i>b').text();
                                        var oDate = $('.opacity5 .edit-date1').val();
                                        var vipNo = sessionStorage.getItem("vipNo");

                                        $(oCircle).css('display', 'block');
                                        setTimeout(function () {
                                            $(oCircle).css('opacity', 1);
                                        }, 50);

                                        $.ajax({
                                            type: 'post',
                                            url: apiUrl + '/member/edit',
                                            headers: signName(md5, vipNo, token),
                                            data: {
                                                nickname: oName,
                                                gender: oSex,
                                                memberNo: vipNo,
                                                birthday: oDate,
                                                avatar: window.oAvatar
                                            },
                                            success: function (data) {

                                                if (data) {
                                                    //图片上传成功后隐藏提示层
                                                    $(oCircle).find('p').text('保存成功');
                                                    setTimeout(function () {
                                                        $(oCircle).css('opacity', 0);
                                                    }, 500);

                                                    setTimeout(function () {
                                                        $(oCircle).css('display', 'none');
                                                    }, 1000);

                                                    $(oWrap).css('display', 'none');
                                                    setTimeout(function () {
                                                        $(oWrap).css('opacity', 0);
                                                    }, 500);
                                                    showInfo(vipNo);
                                                    showPersonalInfo();
                                                }
                                            },
                                            error: function (err) {
                                                console.log(err);
                                            }
                                        });
                                    }, false);

                                })();

                                //窗口消失函数
                                function cancel() {
                                    $('.opacity4').css('opacity', 0);
                                    setTimeout(function () {
                                        $('.opacity4').css('display', 'none');
                                    }, 500);
                                }
                            },
                            error: function (err) {
                                console.log(err);
                            }
                        });
                    // })();
                    //console.log($(item.name));
                });
            });
        },
        error: function (err) {
            console.log(err);
        }
    });

}

//展示默认收货地址
function showDefaultAddress(vipNo) {

    if (!vipNo) {
        return;
    }

    var oGeter = $('.geter-name');
    var oTel = $('.geter-tel');
    var oAddress = $('.geter-detail');
    var addressID = getSto('addressID') || '0';

    //$('.jump').attr('href','manage-address.html?jump=true&vipId='+addressID);

    var token = sessionStorage.getItem("token");
    $.ajax({
        type: 'get',
        url: apiUrl + '/address/detail/my?memberNo=' + vipNo + '&addressId=' + addressID,
        async:false,
        headers: signName(md5, vipNo, token),
        success: function (data) {
            if (data.head.code) {

                if (data.head.code == 71982) {
                    rmSto('nickname');
                    rmSto('timestamp');
                    rmSto('token');
                    rmSto('vipNo');
                    alert('出现错误，请重新登录！');
                    location.href = 'personal-orders.html';
                }
                alert(data.head.message);
                return;
            }
            if(data.body.address!=null){
                var data = data.body.address;
                setSto("addressID", data.id);
                oGeter.html(data.consignee);
                oTel.html(data.mobile);
                oAddress.html(data.zone + data.detail);
                isExitAdress=1;
            }


        },
        error: function (err) {
            console.log(err);
        }
    });

}

//展示地址列表
function showAddressList(vipNo) {
    if (!vipNo) {
        return;
    }
    var token = getSto('token');
    var sAddress = '';
    $.ajax({
        type: 'get',
        headers: signName(md5, vipNo, token),
        url: apiUrl + '/address',
        data: {
            memberNo: vipNo
        },
        success: function (data) {

            sAddress += `<tr style="height:35px;line-height:35px;">
	                        <th>收件人</th>
	                        <th>详细地址</th>
	                        <th>电话</th>
	                        <th>操作</th>
	                        <th></th>
	                    </tr>`;
            data.forEach(function (item, index) {
                sAddress += `<tr class="table-list" data-id=${item.id}>
	                <td class="add-name">${item.consignee}</td>
	                <td class="add-address" data-zone=${item.zone} data-detail=${item.detail}>详细地址：${item.zone}${item.detail}</td>
	                <td class="add-tel">${item.mobile}</td>
	                <td class="add-operate"><a href="javascript:" class="edit-address" target="_blank">编辑</a> <i></i> <a href="javascript:" class="delete-address" target="_blank">删除</a></td>`;
                if (item.defaultAddr) {//如果是默认地址
                    sAddress += '<td class="add-default"><span class="checkbox active"></span><em>默认地址</em></td>';
                } else {
                    sAddress += '<td class="add-default"><span class="checkbox"></span><em>默认地址</em></td>';
                }

                sAddress += `</tr>`;
            });

            $('.table-address').html(sAddress);

            var aItem = $('.table-list');
            var aDefault = $('.table-list .add-default');
            var aEdit = $('.add-operate .edit-address');
            var oWrap = $('.opacity1');
            var oBtn = $('.opacity1 .con li:last-of-type');
            var oCancel = $('.opacity1 .con li:first-of-type');
            var tempObj = null;//点击删除的那项

            //编辑地址
            aEdit.each(function (index, item) {
                $(item).on('click', function () {
                    var temp = $(aItem).get(index);
                    if (!temp) {
                        return
                    }

                    $('.edit-address-wrap').css('display', 'block');
                    setTimeout(function () {
                        $('.edit-address-wrap').css('opacity', 1);
                    }, 50);

                    $('.add-new-address.edit1 li input.geter').val($(aItem[index]).find('.add-name').text());
                    $('.add-new-address.edit1 li input.geter-tel').val($(aItem[index]).find('.add-tel').text());
                    $('.add-new-address.edit1 li .geter-zone i').text($(aItem[index]).find('.add-address').get(0).dataset.zone);
                    $('.add-new-address.edit1 li .geter-zone-local').val($(aItem[index]).find('.add-address').get(0).dataset.detail);

                    $('.add-new-address.edit1 .keep').get(0).dataset.id = $(aItem).get(index).dataset.id;

                    $('.add-new-address.add').css('display', 'none');
                    $('.add-new-address.edit1').css('display', 'block');
                });
            });
            //设置默认地址
            aDefault.each(function (index, item) {

                $(item).on('click', function () {
                    var temp = $(aItem).get(index);
                    if (!temp) {
                        return
                    }
                    var id = $(aItem).get(index).dataset.id;

                    $.ajax({
                        type: 'post',
                        url: apiUrl + '/address/default',
                        headers: signName(md5, vipNo, token),
                        data: {
                            memberNo: vipNo,
                            id: id
                        },
                        success: function (data) {
                            if (data) {
                                aDefault.each(function (index1, item1) {
                                    $(item1).find('span').removeClass('active');
                                });
                                $(item).find('span').addClass('active');
                                //$(aEdit).eq(index).get(0).dataset.default='true';
                                setSto('addressID', id);
                                showDefaultAddress(vipNo);

                            }
                        },
                        error: function (err) {
                            console.log(err);
                            alert('设置默认地址失败！');
                        }
                    });

                    $(".table-address").toggle();

                });
            });

            //删除地址
            var aDelAddressBtn = $('.delete-address');

            aDelAddressBtn.each(function (index, item) {
                $(item).on('click', function () {
                    tempObj = $(item);
                    alertC(index);
                });
            });

            //窗口的确认
            oBtn.on('click', function () {
                var temp = $(tempObj).parent().parent().get(0);
                if (!temp) {
                    return
                }
                $.ajax({
                    type: 'post',
                    url: apiUrl + '/address/' + $(tempObj).parent().parent().get(0).dataset.id + '/delete',
                    headers: signName(md5, vipNo, token),
                    success: function (data) {

                        if (data) {
                            cancel();
                            $(tempObj).parent().parent().remove();
                            //sessionStorage.setItem("addressID",0);
                            //window.location.reload();
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            });

            //点击取消窗口消失
            oCancel.on('click', function () {
                cancel();
            });

            //弹出窗口函数
            function alertC(index, item) {
                oBtn.attr('data-index', index);
                oWrap.css('display', 'block');
                setTimeout(function () {
                    oWrap.css('opacity', 1);
                }, 50);
            }

            //窗口消失函数
            function cancel() {
                oWrap.css('opacity', 0);
                setTimeout(function () {
                    oWrap.css('display', 'none');
                }, 500);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

//展示商品列表
function showGoodsList(vipNo) {
    var oGoodsWrap = $('.wrap-cart-info');//商品列表外层
    var sGoods = '';
    //var iTotalPrice=0;

    $.ajax({
        type: 'post',
        url: apiUrl + '/shoppingcart/settlement',
        contentType: 'application/json',
        data: JSON.stringify({
            memberNo: vipNo,
            //goodsList:url_search().type=='2'?JSON.parse(getSto('tempOrderCart')):JSON.parse(getSto('tempOrderPay'))
            goodsList: aGoodsInfo
        }),
        success: function (data) {
            if (data.head.code) {
                alert(data.head.message);
                location.href = prevUrl();
                return;
            }
            console.log('ss:', data);
            var data = data.body;
            var len = data.goodsList.length;

            if (!data.coupon) {
                $('.coupon').css('display', 'none');
            }

            data.goodsList.forEach(function (item, index) {

                sGoods += `<div class="info-item clear">
		          <div class="item-pic"><img src=${item.picture}></div>
		          <div class="item-details" style="border-top:none">
		              <div class="item-name">
		                <h3>${item.shortName}</h3>`;
                if (item.comment != '') {
                    sGoods += `<p> 备注：${item.comment}</p>`;
                }

                sGoods += `</div>`;

                if (item.accessoryLength) {
                    sGoods += `<div class="item-size"><span>配件：</span><em>${item.accessoryLength}</em></div>`;
                } else {
                    sGoods += `<div class="item-size"></div>`;
                }
                sGoods += '<div class="item-price">￥' + parseInt(item.salePrice) + '</div>';
                sGoods += `<div class="item-num">x${item.number}</div>
		          </div>
		        </div>`;
                iTotalPrice += parseFloat(item.salePrice) * item.number;
            });

            $(oGoodsWrap).html(sGoods);
            //rmSto('tempOrderCart');
            console.log('iTotalPrice:', iTotalPrice);
            //$('.pay-detail p em').text('￥'+iTotalPrice);
            //$('.goods-price em').text('￥'+iTotalPrice);
            //优惠券
            (function () {
                //var iTotalPrice=iTotalPrice;
                var oPacity = $('.opacity');
                var oText = $('.coupon input');
                var oCouponPrice1 = $('.coupon em');
                var oCouponPrice2 = $('.coupon-price em');
                var oGoosPrice = $('li.goods-price>em');
                var oLastPrice = $('.pay-detail p em');
                var iCouponPrice = parseInt(getSto('coupon-price'));
                var text = '';
                var iNumPrice = 0;
                //var iPrice=sessionStorage.getItem("order-money").slice(1);
                //
                if (iCouponPrice && iCouponPrice > 1) {
                    iNumPrice = iCouponPrice;
                } else if (iCouponPrice) {
                    iNumPrice = iTotalPrice * (1 - iCouponPrice);
                } else {
                    iNumPrice = 0;
                }


                $(oGoosPrice).text('￥' + iTotalPrice);
                $(oLastPrice).text('￥' + (iTotalPrice - iNumPrice));
                $(oCouponPrice2).text('-￥' + iNumPrice);
                oText.on('input', function () {
                    var val = $.trim($(this).val());
                    $(oText).val(val);
                   if (val.length==0) {
                        $(oCouponPrice1).text('-￥00');
                        $(oCouponPrice2).text('-￥00');
                        $(oLastPrice).text('￥' + iTotalPrice);
                    } else {
                       $(oText).blur();
                       $.ajax({
                           type: 'get',
                           headers: signName(md5, vipNo, token),
                           url: apiUrl + '/order/coupons?coupon=' + val,
                           success: function (data) {
                               if (data.head.code) {

                                   if (data.head.code == 71982) {
                                       rmSto('nickname');
                                       rmSto('timestamp');
                                       rmSto('token');
                                       rmSto('vipNo');
                                       alert('出现错误，请重新登录！');
                                       location.href = 'personal-orders.html';
                                   }
                                   alert(data.head.message);
                                   return;
                               }
                               if (!data.body.status) {
                                   $(oPacity).css('display', 'block');
                                   setTimeout(function () {
                                       $(oPacity).css('opacity', 1);
                                   }, 50);

                                   setTimeout(function () {
                                       $(oPacity).css('opacity', 0);
                                   }, 1100);

                                   setTimeout(function () {
                                       $(oPacity).css('display', 'none');
                                   }, 1650);

                                   $(oCouponPrice1).text('-￥00');
                                   $(oCouponPrice2).text('-￥00');
                                   $(oLastPrice).text('￥' + iTotalPrice);

                                   return;
                               }
                               var item = data.body.coupons[0];
                               $(oCouponPrice1).text('-￥' + item.couponPrice);
                               $(oCouponPrice2).text('-￥' + item.couponPrice);
                               $(oLastPrice).text('￥' + (iTotalPrice - item.couponPrice));
                           },
                           error: function (err) {
                               console.log(err);
                           }
                       });
                    }
                });

            })();
        },
        error: function () {
        }
    });
}

//选择地区
function adressList() {
        const provinceArray = new Array("北京市", "上海市", "天津市", "重庆市", "河北省", "山西省", "内蒙古自治区", "辽宁省", "吉林省", "黑龙江省", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省", "河南省", "湖北省", "湖南省", "广东省", "广西壮族自治区", "海南省", "四川省", "贵州省", "云南省", "西藏自治区", "陕西省", "甘肃省", "宁夏回族自治区", "青海省", "新疆维吾尔族自治区", "香港特别行政区", "澳门特别行政区", "台湾省");
        const cityArray = new Array();
        cityArray[0] = new Array("北京市", "东城区|西城区|崇文区|宣武区|朝阳区|丰台区|石景山区|海淀区|门头沟区|房山区|通州区|顺义区|昌平区|大兴区|平谷区|怀柔区|密云区|延庆区");
        cityArray[1] = new Array("上海市", "黄浦区|卢湾区|徐汇区|长宁区|静安区|普陀区|闸北区|虹口区|杨浦区|闵行区|宝山区|嘉定区|浦东区|金山区|松江区|青浦区|南汇区|奉贤区|崇明区");
        cityArray[2] = new Array("天津市", "和平区|东丽区|河东区|西青区|河西区|津南区|南开区|北辰区|河北区|武清区|红挢区|塘沽区|汉沽区|大港区|宁河区|静海区|宝坻区|蓟县");
        cityArray[3] = new Array("重庆市", "万州区|涪陵区|渝中区|大渡口区|江北区|沙坪坝区|九龙坡区|南岸区|北碚区|万盛区|双挢区|渝北区|巴南区|黔江区|长寿区|綦江区|潼南区|铜梁 区|大足区|荣昌区|壁山区|梁平区|城口区|丰都区|垫江区|武隆区|忠县区|开县区|云阳区|奉节区|巫山区|巫溪区|石柱区|秀山区|酉阳区|彭水区|江津区|合川区|永川区|南川区");
        cityArray[4] = new Array("河北省", "石家庄市|邯郸市|邢台市|保定市|张家口市|承德市|廊坊市|唐山市|秦皇岛市|沧州市|衡水市");
        cityArray[5] = new Array("山西省", "太原市|大同市|阳泉市|长治市|晋城市|朔州市|吕梁市|忻州市|晋中市|临汾市|运城市");
        cityArray[6] = new Array("内蒙古自治区", "呼和浩特市|包头市|乌海市|赤峰市|呼伦贝尔盟市|阿拉善盟市|哲里木盟市|兴安盟市|乌兰察布盟市|锡林郭勒盟市|巴彦淖尔盟市|伊克昭盟市");
        cityArray[7] = new Array("辽宁省", "沈阳市|大连市|鞍山市|抚顺市|本溪市|丹东市|锦州市|营口市|阜新市|辽阳市|盘锦市|铁岭市|朝阳市|葫芦岛市");
        cityArray[8] = new Array("吉林省", "长春市|吉林市|四平市|辽源市|通化市|白山市|松原市|白城市|延边市");
        cityArray[9] = new Array("黑龙江省", "哈尔滨市|齐齐哈尔市|牡丹江市|佳木斯市|大庆市|绥化市|鹤岗市|鸡西市|黑河市|双鸭山市|伊春市|七台河市|大兴安岭市");
        cityArray[10] = new Array("江苏省", "南京市|镇江市|苏州市|南通市|扬州市|盐城市|徐州市|连云港市|常州市|无锡市|宿迁市|泰州市|淮安市");
        cityArray[11] = new Array("浙江省", "杭州市|宁波市|温州市|嘉兴市|湖州市|绍兴市|金华市|衢州市|舟山市|台州市|丽水市");
        cityArray[12] = new Array("安徽省", "合肥市|芜湖市|蚌埠市|马鞍山市|淮北市|铜陵市|安庆市|黄山市|滁州市|宿州市|池州市|淮南市|巢湖市|阜阳市|六安市|宣城市|亳州市");
        cityArray[13] = new Array("福建省", "福州市|厦门市|莆田市|三明市|泉州市|漳州市|南平市|龙岩市|宁德市");
        cityArray[14] = new Array("江西省", "南昌市|景德镇市|九江市|鹰潭市|萍乡市|新馀市|赣州市|吉安市|宜春市|抚州市|上饶市");
        cityArray[15] = new Array("山东省", "济南市|青岛市|淄博市|枣庄市|东营市|烟台市|潍坊市|济宁市|泰安市|威海市|日照市|莱芜市|临沂市|德州市|聊城市|滨州市|菏泽市");
        cityArray[16] = new Array("河南省", "郑州市|开封市|洛阳市|平顶山市|安阳市|鹤壁市|新乡市|焦作市|濮阳市|许昌市|漯河市|三门峡市|南阳市|商丘市|信阳市|周口市|驻马店市|济源市");
        cityArray[17] = new Array("湖北省", "武汉市|宜昌市|荆州市|襄樊市|黄石市|荆门市|黄冈市|十堰市|恩施市|潜江市|天门市|仙桃市|随州市|咸宁市|孝感市|鄂州市");
        cityArray[18] = new Array("湖南省", "长沙市|常德市|株洲市|湘潭市|衡阳市|岳阳市|邵阳市|益阳市|娄底市|怀化市|郴州市|永州市|湘西市|张家界市");
        cityArray[19] = new Array("广东省", "广州市|深圳市|珠海市|汕头市|东莞市|中山市|佛山市|韶关市|江门市|湛江市|茂名市|肇庆市|惠州市|梅州市|汕尾市|河源市|阳江市|清远市|潮州市|揭阳市|云浮市");
        cityArray[20] = new Array("广西壮族自治区", "南宁市|柳州市|桂林市|梧州市|北海市|防城港市|钦州市|贵港市|玉林市|南宁地区市|柳州地区市|贺州市|百色市|河池市");
        cityArray[21] = new Array("海南省", "海口市|三亚市|三沙市|儋州市|五指山市|文昌市|琼海市|万宁市|东方市");
        cityArray[22] = new Array("四川省", "成都市|绵阳市|德阳市|自贡市|攀枝花市|广元市|内江市|乐山市|南充市|宜宾市|广安市|达川市|雅安市|眉山市|甘孜市|凉山市|泸州市");
        cityArray[23] = new Array("贵州省", "贵阳市|六盘水市|遵义市|安顺市|铜仁市|黔西南市|毕节市|黔东南市|黔南市");
        cityArray[24] = new Array("云南省", "昆明市|大理市|曲靖市|玉溪市|昭通市|楚雄市|红河市|文山市|思茅市|西双版纳市|保山市|德宏市|丽江市|怒江市|迪庆市|临沧市");
        cityArray[25] = new Array("西藏自治区", "拉萨市|日喀则市|山南市|林芝市|昌都市|阿里市|那曲市");
        cityArray[26] = new Array("陕西省", "西安市|宝鸡市|咸阳市|铜川市|渭南市|延安市|榆林市|汉中市|安康市|商洛市");
        cityArray[27] = new Array("甘肃省", "兰州市|嘉峪关市|金昌市|白银市|天水市|酒泉市|张掖市|武威市|定西市|陇南市|平凉市|庆阳市|临夏市|甘南市");
        cityArray[28] = new Array("宁夏回族自治区", "银川市|石嘴山市|吴忠市|固原市");
        cityArray[29] = new Array("青海省", "西宁市|海东市|海南市|海北市|黄南市|玉树市|果洛市|海西市");
        cityArray[30] = new Array("新疆维吾尔族自治区", "乌鲁木齐市|石河子市|克拉玛依市|伊犁市|巴音郭勒市|昌吉市|克孜勒苏柯尔克孜市|博尔塔拉市|吐鲁番市|哈密市|喀什市|和田市|阿克苏市");
        cityArray[31] = new Array("香港特别行政区", "香港特别行政区");
        cityArray[32] = new Array("澳门特别行政区", "澳门特别行政区");
        cityArray[33] = new Array("台湾省", "台北市|高雄市|台中市|台南市|屏东市|南投市|云林市|新竹市|彰化市|苗栗市|嘉义市|花莲市|桃园市|宜兰市|基隆市|台东市|金门市|马祖市|澎湖市");

        var oProvWrap = $('.province ul');
        var oCityWrap = $('.city ul');
        var sProv = '';
        var sCity = '';
        //省份布局
        provinceArray.forEach(function (item, index) {
            sProv += '<li>' + item + '</li>';
        });
        oProvWrap.html(sProv);

        //城市布局
        var aProv = $('.province ul li');
        var valProv = '北京市';
        var valCity = '';
        var oI = $('.add-new-address ul li p i');
        //默认显示北京区的
        cityArray[0][1].split('|').forEach(function (item, index) {
            sCity += '<li>' + item + '</li>'
        });
        oCityWrap.html(sCity);
        select();
        //点击省份显示对应的城市布局
        aProv.each(function (index, item) {
            $(item).on('click', function () {
                var text = $(this).text();
                sCity = '';
                cityArray.forEach(function (item1, index1) {
                    if (text == item1[0]) {
                        valProv = item1[0];
                        var arrCity = item1[1].split('|');
                        arrCity.forEach(function (item2, index2) {
                            sCity += '<li>' + item2 + '</li>'
                        });
                        oCityWrap.html(sCity);
                    }
                });
                select();
            });
        });

        //点击城市选中值
        function select() {
            var aCity = $('.city li');
            aCity.each(function (index, item) {
                $(item).on('click', function () {

                    aCity.each(function (index1, item1) {
                        $(item1).removeClass('active');
                    });
                    $(this).addClass('active');

                    $(oI).text(valProv + '/' + $(this).text());

                    oSelect.css('opacity', 0);
                    timer = setTimeout(function () {
                        oSelect.css('display', 'none');
                    }, 500);
                });
            });
        }

        //弹层
        var oClose = $('.select-top>span.close');
        var oBtn = $('.add-new-address ul li p');
        var oSelect = $('.select');
        var timer = null;
        var timer1 = null;

        //弹出层
        oBtn.on('click', function () {
            oSelect.css('display', 'block');
            timer = setTimeout(function () {
                oSelect.css('opacity', 1);
            }, 50);
        });

        //弹层消失
        oClose.on('click', function () {
            oSelect.css('opacity', 0);
            timer = setTimeout(function () {
                oSelect.css('display', 'none');
            }, 500);
        });
    };

//新增收货地址的按钮
function newAdress() {
    $('.add-new').on('click', function () {
        $('.add-new-address.edit1').css('display', 'none');
        $('.add-new-address.add').css('display', 'block');

        $('.edit-address-wrap').css('display', 'block');
        setTimeout(function () {
            $('.edit-address-wrap').css('opacity', 1);
        }, 50)
    });
    //点击删除按钮弹出层消失
    var oCancel = $('.add-new-address ul li a');
    $(oCancel).on('click', function () {
        $('.edit-address-wrap').css('opacity', 0);
        setTimeout(function () {
            $('.edit-address-wrap').css('display', 'none');
        }, 500);
    });
    //添加地址
    var reg = /^((1[0-9]{1})+\d{9})$/;
    var oAddBtn = $('.add-new-address.add .keep');
    var oEditBtn = $('.add-new-address.edit1 .keep');
    var token = getSto("token");
    oAddBtn.on('click', function () {
        var name = $('.add-new-address.add li input.geter').val();
        var tel = $('.add-new-address.add li input.geter-tel').val();
        var zone = $('.add-new-address.add li .geter-zone i').text();
        var address = $('.add-new-address.add li .geter-zone-local').val();
        var vipNo = getSto("vipNo");

        if ((name && tel && zone && address) != '') {
            //判断手机号
            if (!reg.test(tel)) {
                alert('请输入有效的手机号码');
                return false;
            }
            ;
            if (zone == "请选择省市") {
                alert("所在地区不能为空");
                return false;
            }
            ;

            $.ajax({
                type: 'post',
                url: apiUrl + '/address/save',
                headers: signName(md5, vipNo, token),
                data: {
                    consignee: name,
                    mobile: tel,
                    zone: zone.replace(/\//, ""),
                    detail: address,
                    memberNo: vipNo,
                },
                success: function (data) {

                    //setSto("addressID",data.body.addressId);
                    $('.edit-address-wrap').css('opacity', 0);
                    setTimeout(function () {
                        $('.edit-address-wrap').css('display', 'none');
                    }, 500)

                    //清空已填项
                    $('.add-new-address.add li input.geter').val('');
                    $('.add-new-address.add li input.geter-tel').val('');
                    $('.add-new-address.add li .geter-zone i').text('请选择省市');
                    $('.add-new-address.add li .geter-zone-local').val('');
                    $('.keep').get(0).dataset.id = '';
                    //重新获取地址列表
                    var sAddress = '';
                    $.ajax({
                        type: 'get',
                        headers: signName(md5, vipNo, token),
                        url: apiUrl + '/address',
                        data: {
                            memberNo: vipNo
                        },
                        success: function (data) {
                            if(isExitAdress==0){
                                setSto("addressID", data[0].id);
                                $('.geter-name').html(data[0].consignee);
                                $('.geter-tel').html(data[0].mobile);
                                $('.geter-detail').html(data[0].zone+data[0].detail);
                            }
                            sAddress += `<tr style="height:35px;line-height:35px;">
				                        <th>收件人</th>
				                        <th>详细地址</th>
				                        <th>电话</th>
				                        <th>操作</th>
				                        <th></th>
				                    </tr>`;
                            data.forEach(function (item, index) {
                                sAddress += `<tr class="table-list" data-id=${item.id}>
		                        <td class="add-name">${item.consignee}</td>
		                        <td class="add-address" data-zone=${item.zone} data-detail=${item.detail}>详细地址：${item.zone}${item.detail}</td>
		                        <td class="add-tel">${item.mobile}</td>
		                        <td class="add-operate"><a href="javascript:" class="edit-address">编辑</a> <i></i> <a href="javascript:" class="delete-address">删除</a></td>`;
                                if (item.defaultAddr) {//如果是默认地址
                                    sAddress += '<td class="add-default"><span class="checkbox active"></span><em>默认地址</em></td>';
                                } else {
                                    sAddress += '<td class="add-default"><span class="checkbox"></span><em>默认地址</em></td>';
                                }

                                sAddress += `</tr>`;
                            });
                            $('.table-address').html(sAddress);


                            var aItem = $('.table-list');
                            var aDefault = $('.table-list .add-default');
                            var aEdit = $('.add-operate .edit-address');
                            var oWrap = $('.opacity1');
                            var oBtn = $('.opacity1 .con li:last-of-type');
                            var oCancel = $('.opacity1 .con li:first-of-type');
                            var tempObj = null;//点击删除的那项

                            //编辑地址
                            aEdit.each(function (index, item) {
                                $(item).on('click', function () {
                                    var temp = $(aItem).get(index);
                                    if (!temp) {
                                        return
                                    }

                                    $('.edit-address-wrap').css('display', 'block');
                                    setTimeout(function () {
                                        $('.edit-address-wrap').css('opacity', 1);
                                    }, 50);

                                    $('.add-new-address.edit1 li input.geter').val($(aItem[index]).find('.add-name').text());
                                    $('.add-new-address.edit1 li input.geter-tel').val($(aItem[index]).find('.add-tel').text());
                                    $('.add-new-address.edit1 li .geter-zone i').text($(aItem[index]).find('.add-address').get(0).dataset.zone);
                                    $('.add-new-address.edit1 li .geter-zone-local').val($(aItem[index]).find('.add-address').get(0).dataset.detail);

                                    $('.add-new-address.edit1 .keep').get(0).dataset.id = $(aItem).get(index).dataset.id;

                                    $('.add-new-address.add').css('display', 'none');
                                    $('.add-new-address.edit1').css('display', 'block');
                                });

                            });

                            //设置默认地址
                            aDefault.each(function (index, item) {
                                $(item).on('click', function () {

                                    var temp = $(aItem).get(index);
                                    if (!temp) {
                                        return
                                    }
                                    var id = $(aItem).get(index).dataset.id;
                                    $.ajax({
                                        type: 'post',
                                        url: apiUrl + '/address/default',
                                        headers: signName(md5, vipNo, token),
                                        data: {
                                            memberNo: vipNo,
                                            id: id
                                        },
                                        success: function (data) {

                                            if (data) {
                                                aDefault.each(function (index1, item1) {
                                                    $(item1).find('span').removeClass('active');
                                                });
                                                $(item).find('span').addClass('active');
                                                //$(aEdit).eq(index).get(0).dataset.default='true';

                                                setSto('addressID', id);
                                                showDefaultAddress(vipNo);
                                                $(".table-address").toggle();
                                            }
                                        },
                                        error: function (err) {
                                            console.log(err);
                                            alert('设置默认地址失败！');
                                        }
                                    });

                                });
                            });

                            //删除地址
                            var aDelAddressBtn = $('.delete-address');

                            aDelAddressBtn.each(function (index, item) {
                                $(item).on('click', function () {
                                    tempObj = $(item);
                                    alertC(index);
                                });
                            });

                            //窗口的确认
                            oBtn.on('click', function () {
                                var temp1 = $(tempObj).parent().parent().get(0);
                                if (!temp1) {
                                    return
                                }
                                $.ajax({
                                    type: 'post',
                                    url: apiUrl + '/address/' + $(tempObj).parent().parent().get(0).dataset.id + '/delete',
                                    headers: signName(md5, vipNo, token),
                                    success: function (data) {

                                        if (data) {
                                            cancel();
                                            $(tempObj).parent().parent().remove();
                                            //sessionStorage.setItem("addressID",0);
                                            //window.location.reload();
                                        }
                                    },
                                    error: function (err) {
                                        console.log(err);
                                    }
                                });
                            });

                            //点击取消窗口消失
                            oCancel.on('click', function () {
                                cancel();
                            });

                            //弹出窗口函数
                            function alertC(index, item) {
                                oBtn.attr('data-index', index);
                                oWrap.css('display', 'block');
                                setTimeout(function () {
                                    oWrap.css('opacity', 1);
                                }, 50);
                            }

                            //窗口消失函数
                            function cancel() {
                                oWrap.css('opacity', 0);
                                setTimeout(function () {
                                    oWrap.css('display', 'none');
                                }, 500);
                            }
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });
                },
                error: function (err) {
                    alert('添加失败！');
                    console.log(err);
                }
            })
        } else {
            alert('不能有留空项~');
        }
    });

    oEditBtn.on('click', function () {
        var name = $('.add-new-address.edit1 li input.geter').val();
        var tel = $('.add-new-address.edit1 li input.geter-tel').val();
        var zone = $('.add-new-address.edit1 li .geter-zone i').text();
        var address = $('.add-new-address.edit1 li .geter-zone-local').val();
        var vipNo = getSto("vipNo");

        if ((name && tel && zone && address) != '') {
            //判断手机号
            if (!reg.test(tel)) {
                alert('请输入有效的手机号码');
                return false;
            }

            $.ajax({
                type: 'post',
                url: apiUrl + '/address/edit',
                headers: signName(md5, vipNo, token),
                data: {
                    consignee: name,
                    mobile: tel,
                    zone: zone.replace(/\//, ""),
                    detail: address,
                    defaultAddr: false,
                    memberNo: vipNo,
                    id: $(oEditBtn).get(0).dataset.id
                },
                success: function (data) {

                    //setSto("addressID",data.body.addressId);

                    $('.edit-address-wrap').css('opacity', 0);
                    setTimeout(function () {
                        $('.edit-address-wrap').css('display', 'none');
                    }, 500)

                    //清空已填项
                    $('.add-new-address.edit1 li input.geter').val('');
                    $('.add-new-address.edit1 li input.geter-tel').val('');
                    $('.add-new-address.edit1 li .geter-zone i').text('请选择省市');
                    $('.add-new-address.edit1 li .geter-zone-local').val('');
                    $('.keep').get(0).dataset.id = '';
                    //重新获取地址列表
                    var sAddress = '';
                    $.ajax({
                        type: 'get',
                        headers: signName(md5, vipNo, token),
                        url: apiUrl + '/address',
                        data: {
                            memberNo: vipNo
                        },
                        success: function (data) {

                            sAddress += `<tr style="height:35px;line-height:35px;">
				                        <th>收件人</th>
				                        <th>详细地址</th>
				                        <th>电话</th>
				                        <th>操作</th>
				                        <th></th>
				                    </tr>`;
                            data.forEach(function (item, index) {
                                sAddress += `<tr class="table-list" data-id=${item.id}>
		                        <td class="add-name">${item.consignee}</td>
		                        <td class="add-address" data-zone=${item.zone} data-detail=${item.detail}>详细地址：${item.zone}${item.detail}</td>
		                        <td class="add-tel">${item.mobile}</td>
		                        <td class="add-operate"><a href="javascript:" class="edit-address">编辑</a> <i></i> <a href="javascript:" class="delete-address">删除</a></td>`;
                                if (item.defaultAddr) {//如果是默认地址
                                    sAddress += '<td class="add-default"><span class="checkbox active"></span><em>默认地址</em></td>';
                                } else {
                                    sAddress += '<td class="add-default"><span class="checkbox"></span><em>默认地址</em></td>';
                                }

                                sAddress += `</tr>`;
                            });

                            $('.table-address').html(sAddress);

                            //$('.add-new-address.edit1').css('display','none');
                            //$('.add-new-address.add').css('display','none');

                            var aItem = $('.table-list');
                            var aDefault = $('.table-list .add-default');
                            var aEdit = $('.add-operate .edit-address');
                            var oWrap = $('.opacity1');
                            var oBtn = $('.opacity1 .con li:last-of-type');
                            var oCancel = $('.opacity1 .con li:first-of-type');
                            var tempObj = null;//点击删除的那项

                            //编辑地址
                            aEdit.each(function (index, item) {
                                $(item).on('click', function () {
                                    var temp = $(aItem).get(index);
                                    if (!temp) {
                                        return
                                    }

                                    $('.edit-address-wrap').css('display', 'block');
                                    setTimeout(function () {
                                        $('.edit-address-wrap').css('opacity', 1);
                                    }, 50);

                                    $('.add-new-address.edit1 li input.geter').val($(aItem[index]).find('.add-name').text());
                                    $('.add-new-address.edit1 li input.geter-tel').val($(aItem[index]).find('.add-tel').text());
                                    $('.add-new-address.edit1 li .geter-zone i').text($(aItem[index]).find('.add-address').get(0).dataset.zone);
                                    $('.add-new-address.edit1 li .geter-zone-local').val($(aItem[index]).find('.add-address').get(0).dataset.detail);

                                    $('.add-new-address.edit1 .keep').get(0).dataset.id = $(aItem).get(index).dataset.id;

                                    $('.add-new-address.add').css('display', 'none');
                                    $('.add-new-address.edit1').css('display', 'block');
                                });

                            });

                            //设置默认地址
                            aDefault.each(function (index, item) {
                                $(item).on('click', function () {

                                    var temp = $(aItem).get(index);
                                    if (!temp) {
                                        return
                                    }
                                    var id = $(aItem).get(index).dataset.id;

                                    // aEdit.forEach(function(item1,index1){
                                    // 	$(item1).get(0).dataset.default='false';
                                    // });

                                    $.ajax({
                                        type: 'post',
                                        url: apiUrl + '/address/default',
                                        headers: signName(md5, vipNo, token),
                                        data: {
                                            memberNo: vipNo,
                                            id: id
                                        },
                                        success: function (data) {

                                            if (data) {
                                                aDefault.each(function (index1, item1) {
                                                    $(item1).find('span').removeClass('active');
                                                });
                                                $(item).find('span').addClass('active');
                                                setSto('addressID', id);
                                                showDefaultAddress(vipNo);
                                                //$(aEdit).eq(index).get(0).dataset.default='true';
                                            }
                                        },
                                        error: function (err) {
                                            console.log(err);
                                            alert('设置默认地址失败！');
                                        }
                                    });

                                });
                            });

                            //删除地址
                            var aDelAddressBtn = $('.delete-address');

                            aDelAddressBtn.each(function (index, item) {
                                $(item).on('click', function () {
                                    tempObj = $(item);
                                    alertC(index);
                                });
                            });

                            //窗口的确认
                            oBtn.on('click', function () {
                                var temp1 = $(tempObj).parent().parent().get(0);
                                if (!temp1) {
                                    return
                                }
                                $.ajax({
                                    type: 'post',
                                    url: apiUrl + '/address/' + $(tempObj).parent().parent().get(0).dataset.id + '/delete',
                                    headers: signName(md5, vipNo, token),
                                    success: function (data) {

                                        if (data) {
                                            cancel();
                                            $(tempObj).parent().parent().remove();
                                            //sessionStorage.setItem("addressID",0);
                                            //window.location.reload();
                                        }
                                    },
                                    error: function (err) {
                                        console.log(err);
                                    }
                                });
                            });

                            //点击取消窗口消失
                            oCancel.on('click', function () {
                                cancel();
                            });

                            //弹出窗口函数
                            function alertC(index, item) {
                                oBtn.attr('data-index', index);
                                oWrap.css('display', 'block');
                                setTimeout(function () {
                                    oWrap.css('opacity', 1);
                                }, 50);
                            }

                            //窗口消失函数
                            function cancel() {
                                oWrap.css('opacity', 0);
                                setTimeout(function () {
                                    oWrap.css('display', 'none');
                                }, 500);
                            }
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });
                },
                error: function (err) {
                    alert('添加失败！');
                    console.log(err);
                }
            })
        } else {
            alert('不能有留空项~');
        }
    });

}

//开具发票
function oInvoiceMethod() {
        //点击发票的按钮
    var oInvoiceBtn = $('.ticket>span');//发票按钮
    var oInvoiceWrap = $('.invoice');//发票弹层外层
    var aInvoiceWrapBtn = $('.invoice .con li')//弹层的按钮
    var sInvoice = $('.remarks .ticket div textarea');

        $(oInvoiceBtn).on('click', function () {
            if (this.dataset.btn == 'false') {
                $(this).addClass('active');
                this.dataset.btn = 'true';
                $('.remarks .ticket div textarea').css('display', 'block');
                //$(oInvoiceWrap).css('display','block');
                // setTimeout(function(){
                //     $(oInvoiceWrap).css('opacity',1);
                // },50);
            } else {
                $(this).removeClass('active');
                $('.remarks .ticket div textarea').css('display', 'none');
                this.dataset.btn = 'false';
                // $('.pay-detail .ticket>div>h2').css('color','#666');
                // $('.pay-detail .ticket ol').css('display','none');
                // $('.pay-detail .ticket>div>p').css('display','block');
            }
        });

        //点击取消的按钮
        // $(aInvoiceWrapBtn).eq(0).on('click',function(){
        //     $(oInvoiceWrap).css('opacity',0);
        //     setTimeout(function(){
        //         $(oInvoiceWrap).css('display','none');
        //     },550);
        // });
        //点击确认的按钮
        // $(aInvoiceWrapBtn).eq(1).on('click',function(){

        //     $(oInvoiceBtn).addClass('active');
        //     $(oInvoiceBtn).get(0).dataset.btn='true';
        //     sName=$('.invoice .reason input').val();//获取发票抬头信息
        //     $('.pay-detail .ticket ol li.invoice-header em').text(sName);
        //     $('.pay-detail .ticket>div>h2').css('color','#333');
        //     $('.pay-detail .ticket ol').css('display','block');
        //     $('.pay-detail .ticket>div>p').css('display','none');
        //     $(oInvoiceWrap).css('opacity',0);
        //     setTimeout(function(){
        //         $(oInvoiceWrap).css('display','none');
        //     },550);

        //     console.log(sName);
        // });
    }

