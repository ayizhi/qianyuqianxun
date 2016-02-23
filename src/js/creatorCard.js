'use strict';
Z(function(){
	var actId = getValueFromSearch('actId');
	var actToken = getValueFromSearch('actToken');
	Z.ajax({
		url:window.actionUrl.getActDetail.url,
		type:window.actionUrl.getActDetail.type,
		data:Z.extend({
			actId:actId,
			actToken:actToken
		},getCommonReqData()),
		success:function(reply){
			reply = checkReply(reply);
			if(!reply){return;}
			var $card = Z('#cardDom');
			replaceImgSrc($card);
			var creatorHead = reply.creatorHead;
			var creatorName = reply.creatorName;
			var actTitle = reply.title;
			var actNum = getDateFromTs(reply.createTime);
			$card.find('#creatorName').html(creatorName);
			$card.find('#actTitle').html(actTitle);
			$card.find('#actNum').html(actNum+'桌');
			lazyLoadImg(creatorHead,$card.find('.top .bgCon'));
			lazyLoadImg(window.imgUrl.femaleHead,$card.find('.females .bgCon'));
			lazyLoadImg(window.imgUrl.maleHead,$card.find('.males .bgCon'));
			$card.find('.middle .name').html(creatorName);
		},
		error:function(err){
			noNetwork();
		}
	});

	var qrAddress = 'actDetail.html'+getCommonParams()
	+'&actId='+encodeURIComponent(actId)
	+'&actToken='+encodeURIComponent(actToken);
	makeqr(Z('#qrCon')[0],qrAddress,window.imgUrl.logo);


	Z('.share').on('click',function(){
		shareGuide('邀请好友挑战');
	});
	
	Z('.footer').on('click','.back',function(){
		window.location.href = 'actDetail.html'+getCommonParams()
		+'&actId='+encodeURIComponent(actId)
		+'&actToken='+encodeURIComponent(actToken);
	}).on('click','.invite',function(){
		shareGuide('邀请好友挑战');
	});
});