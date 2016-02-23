'use strict';
Z(function(){
	var actId = getValueFromSearch('actId');
	var actToken = getValueFromSearch('actToken');
	var guestSex = getValueFromSearch('sex');
	var guestNum = getValueFromSearch('num');
	var picsId = 'pics';

	function getPicWidth(){
		return Z(document.body).width();
	}
	function getPicHeight(){
		return Math.ceil(20*window.fontSize);
	}
	function sendRecommend(text){
		text = text||'';
		var reqData = {
			actId:actId,
			actToken:actToken,
			sex:guestSex,
			num:guestNum
		}
		if(text){
			reqData.recommends = text;
		}
		userReady(function(){
			var headNode = document.createElement('div');
			headNode.className = 'bgCon';
			Z('#uKaoPuErs').append(headNode);
			lazyLoadImg(window.userInfo.headImg,headNode);
		});
		
		Z.ajax({
			url:window.actionUrl.recommendGuest.url,
			type:window.actionUrl.recommendGuest.type,
			data:Z.extend(reqData,getCommonReqData()),
			success:function(reply){
				reply = checkReply(reply);
				if(!reply||!text){return;}
				userReady(function(){
					window.location.href = 'friendCard.html'+getCommonParams()
					+'&actId='+encodeURIComponent(actId)
					+'&actToken='+encodeURIComponent(actToken)
					+'&gsex='+encodeURIComponent(guestSex)
					+'&gnum='+encodeURIComponent(guestNum)
					+'&uHead='+encodeURIComponent(window.userInfo.headImg)
					+'&uName='+encodeURIComponent(window.userInfo.nickname)
					+'&text='+encodeURIComponent(text);
				});
			},
			error:function(reply){
				noNetwork();
			},
			complete:function(){
				hideRecommendInput();
			}
		});
	}

	Z.ajax({
		url:window.actionUrl.getActGuestInfo.url,
		type:window.actionUrl.getActGuestInfo.type,
		data:Z.extend({
			actId:actId,
			actToken:actToken,
			sex:guestSex,
			num:guestNum
		},getCommonReqData()),
		success:function(reply){
			console.log('getActGuestInfo reply',reply);
			reply = checkReply(reply);
			if(!reply){return;}

			swiperReady(function(){
				var list = [];
				var picNum = reply.photos.length;
				var i;
				var picWidth = window.dpi*getPicWidth();
				var picHeight = window.dpi*getPicHeight();
				var tmpUrl,picHtml = '';
				var osrc;
				var allImgs = [];
				for(i = 0; i < picNum; i++){
					osrc = reply.photos[i]+'?'+qnImg.base();
					allImgs.push(osrc);
					tmpUrl = osrc+qnImg.and+qnImg.min(picWidth,picHeight)+qnImg.and+qnImg.interlace();
					picHtml += '<div class="swiper-slide"><img class="photos" psrc="'+tmpUrl+'" osrc="'+osrc+'"></div>';
				}

				Z('#'+picsId).find('.swiper-wrapper').html(picHtml).on('click','.photos',function(){
					var osrc = $(this).attr('osrc');
					wxPreviewImg(osrc,allImgs);
				});

				var mySwiper = new Swiper(Z('#'+picsId)[0],{
					loop: true,
					pagination : '.swiper-pagination',
					autoplay:5000,
					autoplayDisableOnInteraction:false
				});
				function resizeImg(imgNode){
					var pWidth = Z(imgNode).parent().width();
					var pHeight = Z(imgNode).parent().height();
					var iWidth = Z(imgNode).data('w');
					var iHeight = Z(imgNode).data('h');
					//console.log(iWidth,iHeight,pWidth,pHeight);
					var scale,scaleWidth,scaleHeight,toLeft,toTop;
					if(iWidth*pHeight<iHeight*pWidth){
						scale = pWidth/iWidth;
					}
					else{
						scale = pHeight/iHeight;
					}
					scaleWidth = iWidth * scale;
					scaleHeight = iHeight * scale;
					toLeft = (pWidth - scaleWidth)/2;
					toTop = (pHeight - scaleHeight)/2;
					Z(imgNode).css({
						'top':toTop,
						'left':toLeft,
						'width':scaleWidth,
						'height':scaleHeight
					});
				}
				Z(window).on('resize',function(){
					Z('#'+picsId).find('img').each(function(){
						var psrc = Z(this).attr('psrc');
						if(psrc){
							this.onload = function(){
								Z(this).data('w',this.width).data('h',this.height);
								resizeImg(this);
							}
							this.src = psrc;
							Z(this).removeAttr('psrc');
						}
						else{
							resizeImg(this);
						}
						
					});
				}).trigger('resize');
			});
			
			Z('#uname').html(reply.nickname);
			var sexFlagClass = 'female';
			var sexName = '女';
			var sexIt = '她';
			var uHeadUrl = window.imgUrl.femaleHead;
			if(reply.sex == 1){
				sexFlagClass = 'male';
				sexName = '男';
				sexIt = '他';
				uHeadUrl = window.imgUrl.maleHead;
			}
			Z('#recommendInput').attr('placeholder','写下你对'+sexIt+'的推荐语吧~');
			Z('.sexIt').html(sexIt);
			Z('#uSex').addClass(sexFlagClass);
			Z('#uAge').html(getAgeFromDate(reply.birthday));
			Z('#uXingZuo').html(getXingZuoFromDate(reply.birthday));
			Z('#uPlace').html(reply.province+reply.city);

			if(reply.recommended){
				Z('#kaoPuAct').addClass('fill');
			}
			else{
				Z('#kaoPuAct').addClass('empty').on('click',function(){
					Z(this).removeClass('empty').addClass('fill');
					sendRecommend();
				});
			}

			//var uHeadSize = window.dpi*2.5*window.fontSize;
			//var uHeadUrl = reply.headImg+'?'+qnImg.base()+qnImg.and+qnImg.min(uHeadSize,uHeadSize)
			lazyLoadImg(uHeadUrl,Z('#uHead .bgCon'));

			Z('#uNum').html(reply.guestNumber+'号'+sexName+'嘉宾');
			Z('#uSelfIntro').html(reply.selfIntro);
			Z('#uExpectation').html(reply.expectation);

			var recommendsArray = reply.recommends||[];
			var recommendsNum = recommendsArray.length;
			var i;
			var recommendsHeadHtml = '';
			var tmpHead;
			var rHeadSize = Math.ceil(window.dpi*2.5*window.fontSize);
			for(i = 0; i < recommendsNum; i++){
				tmpHead = recommendsArray[i].headImg+'?'+qnImg.base()+qnImg.and+qnImg.min(rHeadSize,rHeadSize);
				recommendsHeadHtml += '<div class="bgCon" psrc="'+tmpHead+'"></div>'
			}
			Z('#uKaoPuErs').html(recommendsHeadHtml).find('.bgCon').each(function(){
				var psrc = Z(this).attr('psrc');
				if(psrc){
					lazyLoadImg(psrc,this);
					Z(this).removeAttr('psrc');
				}
			});
			console.log('recommends',reply.recommends);

			var recommendsTemplate = [
				'<div class="recommends">',
					'<img class="quote" src="'+window.imgUrl.quote+'">',
					'<div class="text">{text}</div>',
					'<div class="author">',
						'<div class="name">——{nickname}</div>',
						'<div class="bgCon" psrc="{headImg}"></div>',
					'</div>',
				'</div>'
			].join('');
			var recommendsHtml = '';
			for(i = 0; i < recommendsNum; i++){
				if(!recommendsArray[i].text){continue;}
				tmpHead = recommendsArray[i].headImg+'?'+qnImg.base()+qnImg.and+qnImg.min(rHeadSize,rHeadSize);
				recommendsHtml += format(recommendsTemplate,{
					text:recommendsArray[i].text||'',
					nickname:recommendsArray[i].nickname||'',
					headImg:tmpHead
				});
			}
			Z('#uRecommendations').html(recommendsHtml).find('.bgCon').each(function(){
				var psrc = Z(this).attr('psrc');
				if(psrc){
					lazyLoadImg(psrc,this);
					Z(this).removeAttr('psrc');
				}
			});

			replaceImgSrc(Z('#info')[0]);
			replaceImgSrc(Z('#sendRecommend')[0]);
		},
		error:function(err){
			noNetwork();
		}
	});

	userReady(function(){
		console.log('userReady',window.userInfo);
		Z('#sendRecommend .author .name').html('——'+window.userInfo.nickname);
		lazyLoadImg(window.userInfo.headImg,Z('#sendRecommend .author .bgCon'));
	});

	// var recommendInputTop = function(){
	// 	return Math.ceil(-16*window.fontSize);
	// }

	var recommendAnimateTime = 300;

	function showRecommendInput(){
		Z(document.body).scrollTop(0);
		Z('#sendRecommend').show();
		setTimeout(function(){
			Z('#sendRecommend').css('background-color','rgba(0,0,0,0.7)').find('.main').css('transform','translateY(0)');
		},10);
	}
	function hideRecommendInput(){
		Z('#sendRecommend').css('background-color','rgba(0,0,0,0)').find('.main').css('transform','translateY(-100%)');
		setTimeout(function(){
			Z('#sendRecommend').hide();
		},recommendAnimateTime);
	}

	Z('.footer').on('click','.back',function(){
		window.location.href = 'actDetail.html'+getCommonParams()
		+'&actId='+encodeURIComponent(actId)
		+'&actToken='+encodeURIComponent(actToken);
	}).on('click','.recommend',showRecommendInput);

	Z('#sendRecommend').on('click','.submit',function(e){
		var inputText = Z('#recommendInput').val();
		if(!inputText){
			Z('#recommendInput').addClass('warning').focus();
			return;
		}
		Z('#recommendInput').val('').removeClass('warning');
		sendRecommend(inputText);
	}).on('click','.mask',hideRecommendInput);
	Z('#recommendInput').on('focus',function(){
		Z('#sendRecommend').removeClass('noScroll');
	}).on('blur',function(){
		Z('#sendRecommend').addClass('noScroll');
	});
});