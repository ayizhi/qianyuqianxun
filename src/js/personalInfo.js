'use strict';
var $ = window.Z;
$(function(){
    var headClass = 'head';
    var baseImgParams = '?'+qnImg.base();
    var imgTemplate = [
        '<div class="imgBlock bgCon ing{isHead}" fid="{fid}" psrc="{psrc}" osrc="{osrc}">',
        '<div class="text">{text}</div>',
        '<div class="progress"></div>',
        '</div>'
    ].join('');
    var qnUploader = [];

    getUserInfo()


    var getRegisterInfoIng = false;
    function getUserInfo(){
        if(getRegisterInfoIng){return;}
        getRegisterInfoIng = true;
        Z.ajax({
            url:window.actionUrl.getUserInfo.url,
            type:window.actionUrl.getUserInfo.type,
            data:getCommonReqData(),
            success:function(reply){
                console.log('getRegisterInfo reply',reply);
                reply = checkReply(reply);
                if(!reply){return;}
                Z('#userName').html(reply.nickname);
                if(reply.sex == 0){
                    Z("#sex").html('<img src="../img/common/women.png" alt=""/>')
                }else{
                    Z("#sex").html('<img src="../img/common/men.png" alt=""/>')

                }
                var age = getAgeFromDate(reply.birthday);
                var xingzuo = getXingZuoFromDate(reply.birthday);

                Z("#age").html(age);
                Z("#xingZuo").html(xingzuo);
                Z("#provinceInput").html(reply.province);
                Z("#cityInput").html(reply.city);
                Z("#selfIntroInput").html("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + reply.selfIntro)
                Z("#expectationInput").html("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + reply.expectation)

                replaceImgSrc(Z('#actNav'));
                var headSize = Math.ceil(2.2*window.fontSize);
                var imgParams = '?'+qnImg.base()+qnImg.and+qnImg.min(headSize*window.dpi,headSize*window.dpi);
                lazyLoadImg(reply.headImg+imgParams,Z('#creatorHead'));
                var coverWidth = Math.ceil($(document.body).width());
                var coverHeight = Math.ceil(3.3*window.fontSize);
                var coverParams = '?'+qnImg.base()+qnImg.and+qnImg.min(coverWidth,coverHeight)+qnImg.and+qnImg.blur(15,5);
                //lazyLoadImg(reply.cover+coverParams,Z('#actNav'));



                qiNiuReady(function(){
                    var osrc = reply.headImg;
                    var headSize = Math.ceil(4*window.fontSize);
                    var imgParams = '?'+qnImg.base()+qnImg.and+qnImg.min(headSize*window.dpi,headSize*window.dpi);
                    var psrc = osrc+imgParams;
                    var fileData = {
                        fid:'',
                        isHead:' '+headClass,
                        text:'头像',
                        osrc:osrc+baseImgParams,
                        psrc:psrc
                    }
                    var imgHtml = format(imgTemplate,fileData);



                    var photos = reply.photos||[];
                    var photoLen = photos.length >= 8 ? 8: photos.length;
                    for(var i = 0; i < photoLen; i++){
                        fileData.fid = '';
                        fileData.text = '';
                        fileData.isHead = '';
                        fileData.osrc = photos[i]+baseImgParams;
                        fileData.psrc = photos[i]+imgParams;
                        imgHtml = format(imgTemplate,fileData);
                        $("#qnCon").append(Z(imgHtml))

                    }
                    $('#qnCon .imgBlock').each(function(){
                        var psrc = $(this).attr('psrc');
                        if(!psrc){return;}
                        lazyLoadImg(psrc,this);
                    });
                    uploaderRefresh();
                });
            },
            error:function(err){
                noNetwork();
            },
            complete:function(){
                getRegisterInfoIng = false;
            }
        });
    }

    function uploaderRefresh(){
        var picker,i,len = qnUploader.length;
        for(i = 0; i < len; i++){
            qnUploader[i].refresh();
            picker = qnUploader[i].getOption('browse_button')[0];
            if(Z(picker).width()<1){
                //console.log('destroy',picker);
                qnUploader[i].destroy();
                qnUploader.splice(i,1);
                len--;
                i--;
            }
        }
    }

    Z('#qnCon').on('click','.imgBlock',function(){
        if($(this).hasClass('empty')){return;}
        var osrc = $(this).attr('osrc');
        if(!osrc){return;}
        var list = [];
        $('#qnCon .imgBlock').each(function(){
            if($(this).hasClass('empty')){return;}
            var _osrc = $(this).attr('osrc');
            if(!_osrc){return;}
            list.push(_osrc);
        });
        wxPreviewImg(osrc,list);
    });

    Z("#actNav .back").on("click",function(){
        window.history.go(-1)
    })

})