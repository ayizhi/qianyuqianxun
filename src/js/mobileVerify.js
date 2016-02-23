'use strict';
$(function(){
    var backUrl = getValueFromSearch('back');
    var $ = Z;
    var mobileReg = /^1\d{10}$/;
    var captchaReg = /^\d{6}$/;
    var $mobileInput = $('#mobileInput');
    var $captchaInput = $('#captchaInput');
    var $getCaptcha = $('#getCaptcha');
    var $submit = $('#submit');

    function checkMobile(str){
        return mobileReg.test(str);
    }
    function checkCaptcha(str){
        return captchaReg.test(str);
    }

    var captchaCounting = false;
    $getCaptcha.on("click",function(){
        if(captchaCounting){return}
        var mobileInput = trim($mobileInput.val());
        if(!checkMobile(mobileInput)){
            $mobileInput.addClass('warning').focus();
            return;
        }
        captchaCounting = true;
        //发送手机验证码
        $.ajax({
            url:window.actionUrl.getCaptcha.url,
            type:window.actionUrl.getCaptcha.type,
            data:$.extend(getCommonReqData(),{
                mobile:mobileInput
            }),
            success:function(reply){
                reply = checkReply(reply);
                if(!reply){return;}
                if(reply.status == 0){
                    var theCount = 60;
                    var timer;
                    function count(){
                        if(theCount==0){
                            $getCaptcha.removeClass('counting').addClass('normal').html("获取验证码");
                            captchaCounting = false;
                            clearInterval(timer);
                        }
                        else{
                            $getCaptcha.html(theCount+"s后重试");
                            theCount--;
                        }
                    }
                    $getCaptcha.removeClass('normal').addClass('counting');
                    count();
                    timer = setInterval(count,1000);
                }
                else{
                    alert('验证码发送失败，请重试');
                    captchaCounting = false;
                }
            },
            error:function(err){
                alert('验证码发送失败，请重试');
                captchaCounting = false;
            }
        });
    });

    var submiting = false;
    $submit.on("click",function(){
        if(submiting){return;}
        var mobileInput = trim($mobileInput.val());
        if(!checkMobile(mobileInput)){
            $mobileInput.val('').addClass('warning').focus();
            return;
        }
        $mobileInput.removeClass('warning');
        var captchaInput = trim($captchaInput.val());
        if(!checkCaptcha(captchaInput)){
            $captchaInput.val('').addClass('warning').focus();
            return;
        }
        // if(!captchaInput){
        //     $captchaInput.val('').addClass('warning').focus();
        //     return;
        // }
        $captchaInput.removeClass('warning');
        //console.log('mobileInput',mobileInput,'captchaInput',captchaInput);

        submiting = true;
        $submit.html('验证中..');

        $.ajax({
            url:window.actionUrl.verifyMobile.url,
            type:window.actionUrl.verifyMobile.type,
            data:$.extend(getCommonReqData(),{
                moblie:mobileInput,
                captcha:captchaInput
            }),
            success:function(reply){
                //console.log('verifyMobile reply',reply);
                reply = checkReply(reply);
                if(!reply){
                    $captchaInput.val('');
                    return;
                }
                if(reply.status == 0){
                    alert('手机号:'+mobileInput+'验证成功');
                    if(backUrl){
                        window.location.href = backUrl;
                    }
                    else{
                        if(window.history.length){
                            window.history.go(-1);
                        }
                        else{
                            window.location.href = 'myPage.html'+getCommonParams();
                        }
                    }
                }
                else{
                    alert('验证失败，请重试');
                }
            },
            error:function(err){
                alert('网络异常，请重试');
            },
            complete:function(){
                $submit.html('验证手机');
                submiting = false;
            }
        });
    });
});