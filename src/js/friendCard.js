'use strict';
Z(function(){
	var actId = getValueFromSearch('actId');
	var actToken = getValueFromSearch('actToken');
	var uHead = getValueFromSearch('uHead');
	var uName = getValueFromSearch('uName');
	var gSex = getValueFromSearch('gsex');
	var gNum = getValueFromSearch('gnum');
	var recommendText = getValueFromSearch('text');

	console.log(uHead,uName,gSex,gNum,recommendText);

	var $card = Z('#cardDom');
	replaceImgSrc($card);

	
	$card.find('#uName').html('——'+uName);
	$card.find('#uText').html(recommendText);
	var sexFlagClass = 'female';
	if(gSex == 1){
		sexFlagClass = 'male';
	}
	Z('#gSex').addClass(sexFlagClass);
	Z('#title').addClass(sexFlagClass);

	lazyLoadImg(uHead,$('#uHead')[0]);

	Z.ajax({
		url:window.actionUrl.getActGuestInfo.url,
		type:window.actionUrl.getActGuestInfo.type,
		data:Z.extend({
			actId:actId,
			actToken:actToken,
			sex:gSex,
			num:gNum
		},getCommonReqData()),
		success:function(reply){
			console.log('getActGuestInfo reply',reply);
			reply = checkReply(reply);
			if(!reply){return;}
			var headSize = 4*window.fontSize;
			var headParams = '?'+qnImg.base()+qnImg.and+qnImg.min(headSize*window.dpi,headSize*window.dpi);
			lazyLoadImg(reply.headImg+headParams,$('#gHead'));
			Z('#gName').html(reply.nickname);
			Z('#gAge').html(getAgeFromDate(reply.birthday));
			Z('#gXingZuo').html(getXingZuoFromDate(reply.birthday));
			Z('#gPlace').html(reply.province+reply.city);
		},
		error:function(err){
			noNetwork();
		}
	});
	
	var qrAddress = 'guestInfo.html'+getCommonParams()
	+'&actId='+encodeURIComponent(actId)
	+'&actToken='+encodeURIComponent(actToken)
	+'&sex='+encodeURIComponent(gSex)
	+'&num='+encodeURIComponent(gNum);
	makeqr(Z('#qrCon')[0],qrAddress,window.imgUrl.logo);

	Z('.share').on('click',function(){
		shareGuide('邀请好友挑战');
	});

	Z('.footer').on('click','.detail',function(){
		window.location.href = 'guestInfo.html'+getCommonParams()
		+'&actId='+encodeURIComponent(actId)
		+'&actToken='+encodeURIComponent(actToken)
		+'&sex='+encodeURIComponent(gSex)
		+'&num='+encodeURIComponent(gNum);
	}).on('click','.invite',function(){
		shareGuide('邀请好友挑战');
	});
});