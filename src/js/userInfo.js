'use strict';
$(function(){
    var $ = window.Z;
    var baseImgParams = '?'+qnImg.base();
    var imgTemplate = [
        '<div class="imgBlock bgCon" psrc="{psrc}" osrc="{osrc}"></div>'
    ].join('');

    $.ajax({
        url:window.actionUrl.getUserInfo.url,
        type:window.actionUrl.getUserInfo.type,
        data:getCommonReqData(),
        success:function(reply){
            console.log('getUserInfo reply',reply);
            reply = checkReply(reply);
            if(!reply){return;}
            Z('#uName').html(reply.nickname);
            document.title = reply.nickname+'的信息';
            if(reply.sex == 0){
                Z("#uSex").addClass('female');
            }else{
                Z("#uSex").addClass('male');
            }
            var age = getAgeFromDate(reply.birthday);
            var xingzuo = getXingZuoFromDate(reply.birthday);

            Z("#uAge").html(age);
            Z("#uXingZuo").html(xingzuo);
            Z("#uPlace").html(reply.province+reply.city);
            Z("#selfIntro").html(reply.selfIntro);
            Z("#expectation").html(reply.expectation);

            var headSize = Math.ceil(2.2*window.fontSize);
            var imgParams = baseImgParams+qnImg.and+qnImg.min(headSize*window.dpi,headSize*window.dpi);
            lazyLoadImg(reply.headImg+imgParams,Z('#uHead'));

            var photoSize = Math.ceil(4*window.fontSize);
            var photoParams = qnImg.and+qnImg.min(photoSize*window.dpi,photoSize*window.dpi);

            var fileData = {};
            var imgHtml = '';
            var photos = reply.photos||[];
            var photoLen = photos.length;
            var i;
            for(i = 0; i < photoLen; i++){
                photos[i] += baseImgParams;
                fileData.osrc = photos[i];
                fileData.psrc = photos[i]+photoParams;
                imgHtml += format(imgTemplate,fileData);
            }
            $("#photos").html(imgHtml).on('click','.imgBlock',function(){
                var osrc = $(this).attr('osrc');
                wxPreviewImg(osrc,photos);
            }).find('.imgBlock').each(function(){
                var psrc = $(this).attr('psrc');
                if(!psrc){return;}
                lazyLoadImg(psrc,this);
            });
        },
        error:function(err){
            noNetwork();
        }
    });

    Z("#footer").on("click",'.back',function(){
        window.history.go(-1);
    });
})