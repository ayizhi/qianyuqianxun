'use strict';
Z(function(){
	var actId = getValueFromSearch('actId');
	var actToken = getValueFromSearch('actToken');
	var uHead = getValueFromSearch('uHead');
	var uName = getValueFromSearch('uName');
	var resultMap = getValueFromSearch('map');
	var egMap = {
		1:2,
		2:3,
		3:4,
		4:5,
		5:1
	}
	if(resultMap){
		try{
			resultMap = JSON.parse(resultMap);
		}
		catch(err){
			resultMap = egMap;
		}
	}
	else{
		resultMap = egMap;
	}
	//console.log('resultMap',resultMap);
	var linkMap;

	var $card = Z('#cardDom');
	replaceImgSrc($card);

	
	$card.find('#uName').html(uName);
	$card.find('.top .bgCon').each(function(){
		lazyLoadImg(uHead,this);
	});

	function showPersonDetail(person){
		//console.log('showPersonDetail',person);
		window.location.href = 'guestInfo.html'+getCommonParams()
		+'&actId='+encodeURIComponent(actId)+'&actToken='+actToken
		+'&sex='+encodeURIComponent(person.sex)+'&num='+encodeURIComponent(person.guestNumber);
	}

	var linkInited = false;
	function linkInit(data){
		if(linkInited){return;}
		linkInited = true;
		//console.log('linkInit',data);
		var headSize = Math.ceil(1.75*window.fontSize);
		var pairNum = data.pairs||data.females.length;
		var i;
		var imgParams = '?'+qnImg.base()+qnImg.and+qnImg.min(headSize*window.dpi,headSize*window.dpi);
		for(i = 0; i < pairNum; i++){
			data.females[i].headImg += imgParams;
			data.males[i].headImg += imgParams;
		}
		var compare = function(a,b){
			return a.guestNumber-b.guestNumber;
		}
		data.females.sort(compare);
		data.males.sort(compare);
		//console.log('detailFlag',detailFlag);
		linkMap = new LinkMap(Z('#desk')[0],{
			deltaY:-30,//显示移动线条的竖直偏移量
			pairs:pairNum,//嘉宾数
			defaultFemaleHead:window.imgUrl.femaleHead,
			defaultMaleHead:window.imgUrl.maleHead,
			topPadding:Math.ceil(0.3*window.fontSize),//头部和底部的padding
			headSize:headSize,//整个头像占用的大小
			thickness:Math.ceil(0.1*window.fontSize),//头像环的厚度
			neckDefaultColor:'#fff',//头像环的默认颜色
			deskHeight:Math.ceil(5.4*window.fontSize),//桌子的高度
			deskMarginTop:Math.ceil(0.2*window.fontSize),//头像距离桌子的竖直距离
			dotSize:Math.ceil(0.2*window.fontSize),//用于连线的点的大小
			dotGapDesk:Math.ceil(0.2*window.fontSize),//点与桌子的竖直距离
			deskRadius:Math.ceil(0.25*window.fontSize),//桌子的圆角
			deskColor:'#F0EFF5',//桌子的背景颜色
			dotDefaultColor:'#E2D0C4',//点的默认颜色
			linkColor:'#EA4C89',//连线时的颜色
			lineWidth:1,//连线的宽度
			topIs:'f',//上面是F还是M
			disorder:false,
			females:data.females,//女嘉宾列表
			males:data.males,//男嘉宾列表
			showGuest:true,//是否展示嘉宾资料
			textSize:Math.floor(0.3*window.fontSize),
			femaleTextColor:'#fff',
			femaleTextBg:'#F641BF',
			maleTextColor:'#fff',
			maleTextBg:'#0092F4',
			canLink:function(){
				return false;
			},
			onClick:function(data){//头像被点击
				//console.log('onClick',data[0]);
				showPersonDetail(data[0]);
			}
		});
		var key;
		for(i = 0; i < data.pairs; i++){
			for(key in resultMap){
				if(data.males[i].guestNumber == key){
					linkMap.link(key,resultMap[key]);
				}
			}
		}
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
			//console.log('getActDetail reply',reply);
			var linkInitData = reply;
			linkMapReady(function(){
				linkInit(linkInitData);
			});
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