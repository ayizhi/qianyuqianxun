/**
 * Created by Administrator on 2015/10/29.
 */
Z(function(){
    var $ = Z;
    var headId = 'imgHead';
    var imgTemplate = [
        '<div class="imgBlock bgCon ing{isHead}" fid="{fid}" psrc="{psrc}" osrc="{osrc}">',
        '<div class="text">{text}</div>',
        '<img class="delete" src="'+window.imgUrl.close+'">',
        '<div class="progress"></div>',
        '</div>'
    ].join('');
    var qnUploader = [];
    var headClass = 'head';
    var baseImgParams = '?'+qnImg.base();
//window.qnUploader = [];

    Z('#sexInput').mySelect(function(val){
        switch(parseInt(val)){
            case 0:
                return '女';
                break;
            case 1:
                return '男';
                break;
            default:
                alert('性别选择异常'+val);
        }
    });

    function locationInit(callback){
        locationReady(function(){
            console.log('province',myProvince);
            console.log('city',myCity);
            var provinceHtml = '';
            var key;
            for(key in myProvince){
                provinceHtml += '<option value="'+key+'">'+myProvince[key]+'</option>';
            }
            $('#provinceInput').html(provinceHtml).mySelect(function(val){
                return myProvince[val];
            }).on('change',function(){
                var curProvince = this.value;
                var cityData = myCity[curProvince];
                var cityHtml = '';
                var key;
                for(key in cityData){
                    cityHtml += '<option value="'+key+'">'+cityData[key]+'</option>';
                }
                $('#cityInput').html(cityHtml).trigger('change');
            }).trigger('change');
            $('#cityInput').mySelect(function(val){
                var curProvince = $('#provinceInput').val();
                return myCity[curProvince][val];
            });
            callback&&callback();
        });
    }

    getUserInfo();


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

                if(reply.sex == 0){
                    Z("#sex").html('<img src="../img/common/women.png" alt=""/>')
                }else{
                    Z("#sex").html('<img src="../img/common/men.png" alt=""/>')

                }
                var age = getAgeFromDate(reply.birthday);
                var xingzuo = getXingZuoFromDate(reply.birthday);

                Z("#age").html(age);
                Z("#xingZuo").html(xingzuo);


                Z('#nicknameInput').val(reply.nickname);
                Z('#birthdayInput').val(reply.birthday);
                Z('#wxInput').val(reply.wx);
                Z('#sexInput').val(reply.sex).trigger('change');
                Z('#mobileInput').val(reply.mobile);
                Z('#selfIntroInput').val(reply.selfIntro);
                Z('#expectationInput').val(reply.expectation);
                Z('#submit').html('提交修改');


                replaceImgSrc(Z('#actNav'));
                var headSize = Math.ceil(2.2*window.fontSize);
                var imgParams = '?'+qnImg.base()+qnImg.and+qnImg.min(headSize*window.dpi,headSize*window.dpi);
                lazyLoadImg(reply.headImg+imgParams,Z('#creatorHead'));
                var coverWidth = Math.ceil($(document.body).width());
                var coverHeight = Math.ceil(3.3*window.fontSize);
                var coverParams = '?'+qnImg.base()+qnImg.and+qnImg.min(coverWidth,coverHeight)+qnImg.and+qnImg.blur(15,5);
                //lazyLoadImg(reply.cover+coverParams,Z('#actNav'));



                locationInit(function(){
                    var provinceId,cityId,key;
                    for(key in myProvince){
                        if(myProvince[key] == reply.province){
                            provinceId = key;
                            break;
                        }
                    }
                    var cityData = myCity[provinceId];
                    for(key in cityData){
                        if(cityData[key] == reply.city){
                            cityId = key;
                            break;
                        }
                    }
                    console.log('province',provinceId,reply.province);
                    console.log('city',cityData,cityId,reply.city);
                    if(provinceId&&cityId){
                        Z('#provinceInput').val(provinceId).trigger('change');
                        Z('#cityInput').val(cityId).trigger('change');
                    }
                });
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
                    Z(imgHtml).insertBefore(Z('#qnPicker'));

                    var photos = reply.photos||[];
                    var photoLen = photos.length>6?6:photos.length;
                    for(var i = 0; i < photoLen; i++){
                        fileData.fid = '';
                        fileData.text = '';
                        fileData.isHead = '';
                        fileData.osrc = photos[i]+baseImgParams;
                        fileData.psrc = photos[i]+imgParams;
                        imgHtml = format(imgTemplate,fileData);
                        Z(imgHtml).insertBefore(Z('#qnPicker'));
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

                qnUploader[i].destroy();
                qnUploader.splice(i,1);
                len--;
                i--;
            }
        }
    }

    Z(window).on('resize',uploaderRefresh);

    qiNiuReady(function(){
        var uploader = myUp({
            bb:'qnPicker',
            con:'qnCon'
        });
        qnUploader.push(uploader);
        uploader.bind('FileUploaded',function(up,file,info){
            console.log('FileUploaded',file.id);
            var domain = up.getOption('domain');
            info = JSON.parse(info.response);
            var smallSize = Math.ceil(4*window.fontSize);
            var smallImgParams = '?'+qnImg.base()+qnImg.and+qnImg.min(smallSize*window.dpi,smallSize*window.dpi);
            var osrc = domain+info.key;
            var src = osrc+smallImgParams;
            $('.imgBlock').each(function(){
                var $t = $(this);
                if($t.attr('fid')!=file.id){
                    return;
                }
                $t.removeClass('ing').find('.progress').css('top',(100-file.percent)+'%');
                lazyLoadImg(src,$t.attr('osrc',osrc+baseImgParams));
                if($t.hasClass(headClass)){
                    $t.find('.text').html('头像');
                }
            });
        });
        uploader.bind('BeforeUpload',function(up, file){
            console.log('BeforeUpload',file.id);
            var isHead = ' '+headClass;
            if($('.imgBlock.'+headClass).length){
                isHead = '';
            }
            var fileData = {
                isHead:isHead,
                fid:file.id,
                text:'上传中',
                psrc:'',
                osrc:''
            }
            var imgHtml = format(imgTemplate,fileData);
            Z(imgHtml).insertBefore(Z('#qnPicker'));
        });
        uploader.bind('UploadProgress',function(up,file){
            console.log('UploadProgress',file.id,file.percent);
            $('.imgBlock').each(function(){
                if($(this).attr('fid')==file.id){
                    Z(this).find('.progress').css('top',(100-file.percent)+'%');
                }
            });
        });
    });



    Z('#qnCon').on('click','.delete',function(){
        if(confirm('确认要删除这张头像吗')){
            var $p = Z(this).parent();
            var next;
            var isHead = $p.hasClass(headClass);
            $p.addClass('empty').remove();
            if(isHead){
                next = Z('#qnCon').find('.imgBlock')[0];
                if(!$(next).hasClass('empty')){
                    $(next).addClass(headClass).find('.text').html('头像');
                }
            }
            uploaderRefresh();
        }
    }).on('click','.imgBlock',function(){
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

    function checkInput(id){
        var value = Z('#'+id).val();
        if(!value||!value.length){
            Z('#'+id).addClass('warning').focus();
            return false;
        }
        return value;
    }

    var submitIng = false;




    Z('#submit').on('click',function(){
        if(submitIng||!myProvince){return;}
        var nicknameInput = checkInput('nicknameInput');
        if(!nicknameInput){
            return;
        }
        var mobileInput = checkInput('mobileInput');
        if(!mobileInput){
            return;
        }
        var wxInput = checkInput('wxInput');
        if(!wxInput){
            return;
        }

        var $imgBlocks = Z('#qnCon').find('.imgBlock');
        var len = $imgBlocks.length;
        var i,imgNum = 0;
        for(i = 0; i < len; i++){
            if(!Z($imgBlocks[i]).hasClass('empty')){
                imgNum++;
            }
        }
        console.log('imgNum',imgNum);
        if(imgNum<2){
            alert('请上传至少两张照片');
            return;
        }
        var imgHead = Z('.'+headClass).data('src');
        var photos = [];
        $imgBlocks.each(function(){
            if(!Z(this).hasClass('empty')&&!Z(this).hasClass(headClass)){
                photos.push(Z(this).data('src'));
            }
        });

        var selfIntroInput = checkInput('selfIntroInput');
        if(!selfIntroInput){
            return;
        }
        var expectationInput = checkInput('expectationInput');
        if(!expectationInput){
            return;
        }

        var birthdayInput = Z('#birthdayInput').val();
        var sexInput = Z('#sexInput').val();
        var provinceId = Z('#provinceInput').val();
        var provinceInput = myProvince[provinceId];
        var cityId = Z('#cityInput').val();
        var cityInput = myCity[provinceId][cityId];

        submitIng = true;




        Z('#submit').html('加入中...');

        var reqData = {

            nickname:nicknameInput,
            mobile:mobileInput,
            wx:wxInput,
            province:provinceInput,
            city:cityInput,
            selfIntro:selfIntroInput,
            expectation:expectationInput,
            birthday:birthdayInput,
            sex:sexInput,
            headImg:imgHead,
            photos:photos
        }
        console.log('reqData',reqData);


        Z.ajax({
            url:window.actionUrl.editInfo.url,
            type:window.actionUrl.editInfo.type,
            data:Z.extend(getCommonReqData(),reqData),
            success:function(reply){
                console.log('submit reply',reply);
                reply = checkReply(reply);
                if(!reply){return;}
                if(reply.status == 0){
                    console.log("修改成功")
                    window.history.go(-1);
                }
                else{
                    alert('修改失败，请重试');
                    pageReload();
                }
            },
            error:function(err){
                console.log('submit error',err);
                noNetwork();
            },
            complete:function(){
                console.log('submit complete');
                submitIng = false;
                Z('#submit').html('修改成功');
            }
        });
    });

    Z('.footer').on('click','.back',function(){
        window.history.go(-1);
    });
});