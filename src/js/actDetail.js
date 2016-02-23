'use strict';
Z(function(){
	var $ = Z;
	var actId = getValueFromSearch('actId');
	var actToken = getValueFromSearch('actToken');
	var linkMap;
	var linkFlag = false;//是否可以连线
	var detailFlag = false;//是否可以查看嘉宾资料
	var $leftButton = Z('#footer .left');
	var $rightButton = Z('#footer .right');
	var leftButtonClicked;
	var rightButtonClicked;

	function showLinkResult(data){
		console.log('showLinkResult',data);
		var $r = $('#result').show();
		var resultTemplate = [
		'<div class="pair p{fNum}" fNum={fNum}>',
			'<div class="flag">{fNum}</div>',
			'<div class="title">共同完成{taskNum}个约会任务</div>',
			'<div class="main">',
				'<div class="box female">',
					'<div class="bgCon" psrc="{fHead}"></div>',
					'<div class="info">',
						'<div class="num">女{fNum}</div>',
						'<div class="name">{fName}</div>',
					'</div>',
				'</div>',
				'<img class="fire" src="'+window.imgUrl.whiteFire+'">',
				'<div class="box male">',
					'<div class="bgCon" psrc="{mHead}"></div>',
					'<div class="info">',
						'<div class="num">男{mNum}</div>',
						'<div class="name">{mName}</div>',
					'</div>',
				'</div>',
				'<div class="tips">查看约会进度</div>',
			'</div>',
		'</div>'
		].join('');
		var pairHtml = '<img id="datingTitle" src="'+window.imgUrl.datingTitle+'">';
		var i,j,k;
		var pairs = data.pairs||window.actConfig.pairs;
		var tmpData = {};
		var tmpFemale,tmpMale;
		var headSize = 2*window.fontSize;
		var headParams = '?'+qnImg.base()+qnImg.and+qnImg.min(headSize*window.dpi,headSize*window.dpi);
		for(i = 0; i < pairs; i++){
			for(j = 0; j < pairs; j++){
				tmpFemale = data.females[j];
				if(tmpFemale.guestNumber == i+1){
					break;
				}
			}
			for(j = 0; j < pairs; j++){
				tmpMale = data.males[j];
				if(tmpMale.guestNumber == tmpFemale.linkedNumber){
					break;
				}
			}
			tmpData.taskNum = tmpFemale.taskNum;
			tmpData.fNum = i+1;
			tmpData.fHead = tmpFemale.headImg+headParams;
			tmpData.fName = tmpFemale.nickname;
			tmpData.mNum = tmpMale.guestNumber;
			tmpData.mHead = tmpMale.headImg+headParams;
			tmpData.mName = tmpMale.nickname;
			pairHtml += format(resultTemplate,tmpData);
		}
		pairHtml += '<img id="resultTitle" src="'+window.imgUrl.resultTitle+'">';
		$r.html(pairHtml).find('.bgCon').each(function(){
			var psrc = $(this).attr('psrc');
			lazyLoadImg(psrc,this);
		});
		$r.on('click','.pair',function(){
			var fNum = $(this).attr('fNum');
			window.location.href = 'dating.html'+getCommonParams()
			+'&actId='+encodeURIComponent(actId)+'&actToken='+actToken
			+'&fNum='+encodeURIComponent(fNum);
		});
	}

	function showShare(){
		shareGuide('邀请好友挑战');
	}

	function showPersonDetail(person){
		console.log('showPersonDetail',person);
		window.location.href = 'guestInfo.html'+getCommonParams()
		+'&actId='+encodeURIComponent(actId)+'&actToken='+actToken
		+'&sex='+encodeURIComponent(person.sex)+'&num='+encodeURIComponent(person.guestNumber);
	}

	var linkInited = false;
	function linkInit(data,callback){
		if(linkInited){return;}
		linkInited = true;
		console.log('linkInit',data);
		var headSize = Math.ceil(2*window.fontSize);
		var pairNum = data.pairs||data.females.length;
		var i;
		var imgParams = '?'+qnImg.base()+qnImg.and+qnImg.min(headSize*window.dpi,headSize*window.dpi);
		for(i = 0; i < pairNum; i++){
			data.females[i].headImg += imgParams;
			data.males[i].headImg += imgParams;
		}
		console.log('detailFlag',detailFlag);
		linkMap = new LinkMap(Z('#card .middle canvas')[0],{
			deltaY:-30,//显示移动线条的竖直偏移量
			pairs:pairNum,//7对嘉宾
			defaultFemaleHead:window.imgUrl.femaleHead,
			defaultMaleHead:window.imgUrl.maleHead,
			topPadding:Math.ceil(0.4*window.fontSize),//头部和底部的padding
			headSize:headSize,//整个头像占用的大小
			thickness:Math.ceil(0.1*window.fontSize),//头像环的厚度
			neckDefaultColor:'#fff',//头像环的默认颜色
			deskHeight:Math.ceil(7*window.fontSize),//桌子的高度
			deskMarginTop:Math.ceil(0.4*window.fontSize),//头像距离桌子的竖直距离
			dotSize:Math.ceil(0.3*window.fontSize),//用于连线的点的大小
			dotGapDesk:Math.ceil(0.2*window.fontSize),//点与桌子的竖直距离
			deskRadius:Math.ceil(0.25*window.fontSize),//桌子的圆角
			deskColor:'#F0EFF5',//桌子的背景颜色
			dotDefaultColor:'#E2D0C4',//点的默认颜色
			linkColor:'#EA4C89',//连线时的颜色
			lineWidth:1,//连线的宽度
			topIs:'f',//上面是F还是M
			disorder:data.disorder,
			females:data.females,//女嘉宾列表
			males:data.males,//男嘉宾列表
			showGuest:detailFlag,//是否展示嘉宾资料
			textSize:Math.floor(0.4*window.fontSize),
			femaleTextColor:'#fff',
			femaleTextBg:'#F641BF',
			maleTextColor:'#fff',
			maleTextBg:'#0092F4',
			canLink:function(){
				return linkFlag;
				//return !linkAnimating;
			},
			onClick:function(data){//头像被点击
				//console.log('onClick',data[0]);
				if(detailFlag){
					showPersonDetail(data[0]);
				}
			},
			onLink:function(data){//一对头像被连接
				//console.log('onLink',data[0],data[1]);
				//personOnLink();
			},
			onBreak:function(data){//一对头像被断开连接
				//console.log('onBreak',data[0],data[1]);
			},
			onChoose:function(data){//选择单方头像的时候
				//console.log('onChoose',data[0]);
				//personOnChoose(data[0]);
			},
			onCancel:function(data){//放弃单方头像的时候
				//console.log('onCancel',data[0]);
				//personOnCancel(data[0]);
			}
		});
		if(typeof(callback)=='function'){
			callback(data);
		}
		window.lm = linkMap;
	}

	var linkSubmitIng = false;
	function linkSubmit(){
		if(linkSubmitIng){return;}
		var resultMap = linkMap.getLinkResult();
		if(!resultMap){
			alert('请给每一位嘉宾连线之后再提交喔');
			return;
		}
		console.log('resultMap',resultMap);
		linkSubmitIng = true;
		Z.ajax({
			url:window.actionUrl.submitLink.url,
			type:window.actionUrl.submitLink.type,
			data:Z.extend({
				actId:actId,
				actToken:actToken,
				map:resultMap
			},getCommonReqData()),
			success:function(reply){
				console.log('submitLink reply',reply);
				reply = checkReply(reply);
				if(!reply){return;}
				if(reply.status == 0){
					alert('谢谢，连线提交成功');
					userReady(function(){
						window.location.href = 'linkerCard.html'+getCommonParams()
						+'&actId='+encodeURIComponent(actId)
						+'&actToken='+encodeURIComponent(actToken)
						+'&map='+encodeURIComponent(JSON.stringify(resultMap))
						+'&uHead='+encodeURIComponent(window.userInfo.headImg)
						+'&uName='+encodeURIComponent(window.userInfo.nickname)
					});
				}
				else{
					alert('噫，提交失败了，再试试吧');
				}
			},
			error:function(err){
				noNetwork();
			},
			complete:function(){
				linkSubmitIng = false;
			}
		});
	}

	function renderDetail(data){//根据活动详情渲染页面
		console.log('renderDetail',data);
		var $card = Z('#card'),i,femaleExampleArray,maleExampleArray;
		$card.find('.top .title').html(data.title);
		$card.find('.top .info').html(data.creatorName+' · '+getDateFromTs(data.createTime));
		var headSize = Math.ceil(4*window.fontSize);
		var imgParams = '?'+qnImg.base()+qnImg.and+qnImg.min(headSize*window.dpi,headSize*window.dpi);
		lazyLoadImg(data.creatorHead,$card.find('.top .head .bgCon'));
		var $top = $card.find('.top');
		var coverWidth = $top.width();
		var coverHeight = $top.height();
		var coverParams = '?'+qnImg.base()+qnImg.and+qnImg.min(coverWidth,coverHeight)+qnImg.and+qnImg.blur(15,5);
		lazyLoadImg(data.cover+coverParams,$card.find('.top'));
		$card.find('.bottom .buttons').hide();
		replaceImgSrc(Z('#card'));
		var linkInitData,linkInitCallback;
		var statusFlagImgSrc,$actsNode;
		switch(data.status){
			case window.actConfig.registering:
			statusFlagImgSrc = window.imgUrl.registeringFlag;
			femaleExampleArray = [];
			maleExampleArray = [];
			for(i = 0; i < window.actConfig.pairs; i++){
				femaleExampleArray.push({
					headImg:window.imgUrl.femaleHead
				});
				maleExampleArray.push({
					headImg:window.imgUrl.maleHead
				});
			}
			linkFlag = false;
			detailFlag = false;
			linkInitData = {
				females:femaleExampleArray,
				males:maleExampleArray
			}
			//$actsNode = $card.find('.bottom .register').show();
			if(data.creatorId == window.uid){
				$leftButton.html('选择嘉宾');
				leftButtonClicked = function(){
					console.log('selectGuest');
					window.location.href = 'selectGuest.html'+getCommonParams()+'&actId='+encodeURIComponent(actId)+'&actToken='+encodeURIComponent(actToken);
				}
			}
			else{
				if(data.registered == 0){
					$leftButton.html('查看报名资料');
				}
				else{
					$leftButton.html('报名挑战');
				}
				leftButtonClicked = function(){
					window.location.href = 'registerAct.html'+getCommonParams()+'&actId='+encodeURIComponent(actId)+'&actToken='+encodeURIComponent(actToken);
				}
			}
			$rightButton.html('邀请好友');
			rightButtonClicked = showShare;
			break; 
			case window.actConfig.linking:
			statusFlagImgSrc = window.imgUrl.linkingFlag;
			linkFlag = true;
			detailFlag = true;
			//data.disorder = true;//打乱嘉宾的排列顺序
			linkInitData = data;
			//$actsNode = $card.find('.bottom .link').show();
			$leftButton.html('查看连线数据');
			leftButtonClicked = function(){
				window.location.href = 'actLinkData.html'+getCommonParams()+'&actId='+encodeURIComponent(actId)+'&actToken='+encodeURIComponent(actToken);
			}
			$rightButton.html('提交连线方案');
			rightButtonClicked = linkSubmit;
			// $actsNode.find('.linkDataNav').on('click',function(){
			// 	window.location.href = 'actLinkData.html'+getCommonParams()+'&actId='+encodeURIComponent(actId)+'&actToken='+encodeURIComponent(actToken);
			// });
			//$actsNode.find('.submitLink').on('click',linkSubmit);
			break;
			case window.actConfig.dating:
			statusFlagImgSrc = window.imgUrl.datingFlag;
			linkFlag = false;
			detailFlag = true;
			linkInitData = data;
			linkInitCallback = function(obj){
				for(var i = 0; i < obj.pairs; i++){
					linkMap.link(obj.males[i].guestNumber,obj.males[i].linkedNumber);
				}
				//linkMap.draw();
			}
			//$actsNode = $card.find('.bottom .dating').show();
			// $actsNode.find('.linkDataNav').on('click',function(){
			// 	window.location.href = 'actLinkData.html'+getCommonParams()+'&actId='+encodeURIComponent(actId)+'&actToken='+encodeURIComponent(actToken);
			// });
			$leftButton.html('查看连线数据');
			leftButtonClicked = function(){
				window.location.href = 'actLinkData.html'+getCommonParams()+'&actId='+encodeURIComponent(actId)+'&actToken='+encodeURIComponent(actToken);
			}
			$rightButton.html('分享');
			rightButtonClicked = showShare;
			showLinkResult(data);
			break;
			default:
			alert('活动进度状态码异常:'+data.status);
			return;
		}
		$top.find('.sf').attr('src',statusFlagImgSrc);
		linkMapReady(function(){
			linkInit(linkInitData,linkInitCallback);
		});
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
			renderDetail(reply);
		},
		error:function(err){
			noNetwork();
		}
	});

	Z('#footer').on('click','.back',function(){
		window.location.href = 'actList.html'+getCommonParams();
	}).on('click','.left',function(){
		leftButtonClicked&&leftButtonClicked();
	}).on('click','.right',function(){
		rightButtonClicked&&rightButtonClicked()
	});
});