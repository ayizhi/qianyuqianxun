'use strict';
Z(function(){
	var actId = getValueFromSearch('actId');
	var actToken = getValueFromSearch('actToken');
	var uHead = getValueFromSearch('uHead');
	var uName = getValueFromSearch('uName');
	var uSex = getValueFromSearch('uSex');

	var $card = Z('#cardDom');
	replaceImgSrc($card);

	
	$card.find('#uName').html(uName);
	$card.find('.top .bgCon').each(function(){
		lazyLoadImg(uHead,this);
	});
	
	$card.find('.females .bgCon').each(function(){
		lazyLoadImg(window.imgUrl.femaleHead,this);
	});
	//lazyLoadImg(window.imgUrl.femaleHead,);
	$card.find('.males .bgCon').each(function(){
		lazyLoadImg(window.imgUrl.maleHead,this);
	});
	
	if(uSex == 1){
		lazyLoadImg(uHead,$card.find('#maleHead'));
	}
	else{
		lazyLoadImg(uHead,$card.find('#femaleHead'));
	}
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
			var creatorName = reply.creatorName;
			var actTitle = reply.title;
			var actNum = getDateFromTs(reply.createTime);
			$card.find('#creatorName').html(creatorName);
			$card.find('#actTitle').html(actTitle);
			$card.find('#actNum').html(actNum+'桌');
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