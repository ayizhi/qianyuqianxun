'use strict';
Z(function(){
	var $ = Z;
	var actId = getValueFromSearch('actId');
	var actToken = getValueFromSearch('actToken');
	var curChoose = 'female';

	function backToDetail(){
		window.location.href = 'actDetail.html'+getCommonParams()+'&actId='+encodeURIComponent(actId)+'&actToken='+encodeURIComponent(actToken);
	}
	function toInvitePage(){
		if(!confirm('没有更多嘉宾了，去邀请好友吧！')){return;}
		window.location.href = 'creatorCard.html'+getCommonParams()+'&actId='+encodeURIComponent(actId)+'&actToken='+encodeURIComponent(actToken);
	}
	function switchChoose(sex){
		var resultId = 'femaleResult';
		var navId = 'femaleNav';
		var targetId = 'femaleTab';
		curChoose = sex;
		if(curChoose == 'male'){
			resultId = 'maleResult';
			navId = 'maleNav';
			targetId = 'maleTab';
		}
		Z('.tabPage').hide();
		Z('#'+targetId).show();
		Z('#tabNav').find('.nav').removeClass('current');
		Z('#'+navId).addClass('current');
		Z('.resultBox').removeClass('current');
		Z('#'+resultId).addClass('current');
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
			replaceImgSrc(Z('#actNav'));
			var headSize = Math.ceil(2.2*window.fontSize);
			var imgParams = '?'+qnImg.base()+qnImg.and+qnImg.min(headSize*window.dpi,headSize*window.dpi);
			lazyLoadImg(reply.creatorHead+imgParams,Z('#creatorHead'));
			var coverWidth = Math.ceil(Z(document.body).width());
			var coverHeight = Math.ceil(3.3*window.fontSize);
			var coverParams = '?'+qnImg.base()+qnImg.and+qnImg.min(coverWidth,coverHeight)+qnImg.and+qnImg.blur(15,5);
			lazyLoadImg(reply.cover+coverParams,Z('#actNav'));
			Z('#creatorName').html(reply.creatorName);
			Z('#actTitle').html(reply.title);
			Z('#actNum').html(getDateFromTs(reply.createTime)+'桌');
			Z('#actNav').on('click',backToDetail);
		},
		error:function(err){
			noNetwork();
		}
	});

	Z.ajax({
		url:window.actionUrl.getRegList.url,
		type:window.actionUrl.getRegList.type,
		data:Z.extend({
			actId:actId,
			actToken:actToken
		},getCommonReqData()),
		success:function(reply){
			reply = checkReply(reply);
			if(!reply){return;}
			console.log('getRegList reply',reply);
			var personTemplate = [
			'<div class="head" uid={id}>',
				'<img src="'+window.imgUrl.choosedFlag+'" class="flag">',
				'<div class="bgCon" psrc="{img}"></div>',
				'<div class="text textAutoHide">{nn}</div>',
			'</div>'
			].join('');
			var totalArray = reply.list||[];
			var totalNum = totalArray.length;
			var femaleNum = 0;
			var maleNum = 0;
			var i,tmpObj = {};
			var bigHeadSize = Math.ceil(3*window.fontSize);
			var bigHeadParams = '?'+qnImg.base()+qnImg.and+qnImg.min(bigHeadSize*window.dpi,bigHeadSize*window.dpi);
			var femaleHtml = '';
			var maleHtml = '';
			var detailMap = {};
			for(i = 0; i < totalNum; i++){
				tmpObj.id = totalArray[i].uid;
				tmpObj.img = totalArray[i].headImg;
				tmpObj.nn = totalArray[i].nickname;
				//tmpObj.age = getAgeFromDate(totalArray[i].birthday);
				if(totalArray[i].sex == 0){
					femaleNum++;
					femaleHtml += format(personTemplate,tmpObj);
				}
				else{
					maleNum++;
					maleHtml += format(personTemplate,tmpObj);
				}
				detailMap[tmpObj.id] = totalArray[i];
			}
			var inviteHtml = '<div class="invite"></div>';
			femaleHtml += inviteHtml;
			maleHtml += inviteHtml;

			function loadHead(node){
				var psrc = Z(node).attr('psrc');
				if(!psrc){return;}
				Z(node).removeAttr('psrc');
				lazyLoadImg(psrc+bigHeadParams,node);
			}
			Z('#maleTab').html(maleHtml).find('.bgCon').each(function(){
				loadHead(this);
			});
			Z('#femaleTab').html(femaleHtml).find('.bgCon').each(function(){
				loadHead(this);
			});

			function showDetail(){
				var uid = Z(this).attr('uid')||Z(this).data('uid');
				var detail = detailMap[uid];
				console.log('showDetail',uid,detail);
				var $d = Z('#detail');
				$d.show();
				var sexFlagClass = 'female';
				var choosed = false;
				if(detail.sex == 1){
					sexFlagClass = 'male';
					choosed = isMaleChoosed(uid);
				}
				else{
					choosed = isFemaleChoosed(uid);
				}
				console.log('choosed',choosed);
				if(choosed){
					Z('#uChoose').html('取消选择').addClass('cancel');
					Z('#uHead').addClass('select');
				}
				else{
					Z('#uChoose').html('选择').removeClass('cancel');
					Z('#uHead').removeClass('select');
				}
				$d.find('.main .scrollArea').scrollTop(0);
				setTimeout(function(){
					$d.css('background-color','rgba(0,0,0,0.7)').find('.main').css('transform','translateY(0)');
				},10);

				if($d.data('uid') == uid){return;}
				$d.data('uid',uid);
				
				Z('#uNickname').html(detail.nickname);
				Z('#uSelfIntro').html(detail.selfIntro);
				Z('#uExpectation').html(detail.expectation);
				Z('#uSex').removeClass('male').removeClass('female').addClass(sexFlagClass);
				Z('#uAge').html(getAgeFromDate(detail.birthday));
				Z('#uXingZuo').html(getXingZuoFromDate(detail.birthday));
				Z('#uPlace').html(detail.province+detail.city);
				lazyLoadImg(detail.headImg,Z('#uHead'));

				var photos = detail.photos||[];
				var photoNum = photos.length;
				var photoHtml = '';
				var i;
				var fullPhotos = [];
				var fullImgParams = '?'+qnImg.base();
				var osrc;
				for(i = 0; i < photoNum; i++){
					osrc = photos[i]+fullImgParams;
					fullPhotos.push(osrc);
					photoHtml += '<div class="bgCon" psrc="'+photos[i]+'" osrc="'+osrc+'"></div>';
				}

				$('#uPhotos').html(photoHtml).find('.bgCon').each(function(){
					loadHead(this);
					$(this).on('click',function(){
						wxPreviewImg($(this).attr('osrc'),fullPhotos);
					});
				});

				judgeScroll($d.find('.main .scrollArea')[0]);
			}
			function hideDetail(){
				Z('#detail').css('background-color','rgba(0,0,0,0)').find('.main').css('transform','translateY(100%)');
				setTimeout(function(){
					Z('#detail').hide()
				},300);
			}
			Z('#maleTab').on('click','.head',showDetail).on('click','.invite',toInvitePage);
			Z('#femaleTab').on('click','.head',showDetail).on('click','.invite',toInvitePage);
			Z('#femaleResult').on('click','.select',showDetail);
			Z('#maleResult').on('click','.select',showDetail);
			Z('#detail .footer .back').on('click',hideDetail);
			Z('#detail').on('click','.mask',hideDetail);
			//Z('#dClose').on('click',hideDetail);

			var choosedFemaleArray = [];//已选择的女性数组
			var choosedMaleArray = [];//已选择的男性数组
			function isFemaleReady(){
				return choosedFemaleArray.length==window.actConfig.pairs;
			}
			function isMaleReady(){
				return choosedMaleArray.length==window.actConfig.pairs;
			}
			function chooseFemale(uid){
				Z('#femaleTab').find('.head').each(function(){
					if(Z(this).attr('uid') == uid){
						Z(this).addClass('select');
					}
				});
				var femaleTotal = choosedFemaleArray.length;
				choosedFemaleArray.push(uid);
				var detail = detailMap[uid];
				lazyLoadImg(detail.headImg+bigHeadParams,Z('#f'+femaleTotal).data('uid',uid).addClass('select'));
			}
			function cancelChooseFemale(uid){
				Z('#femaleTab').find('.select').each(function(){
					if(Z(this).attr('uid') == uid){
						Z(this).removeClass('select');
					}
				});
				var i,femaleTotal = choosedFemaleArray.length;
				var j,tmpDetail;
				for(i = 0; i < femaleTotal; i++){
					if(choosedFemaleArray[i] == uid){
						choosedFemaleArray.splice(i,1);
						femaleTotal--;
						for(j = i; j < femaleTotal; j++){
							tmpDetail = detailMap[choosedFemaleArray[j]];
							lazyLoadImg(tmpDetail.headImg+bigHeadParams,Z('#f'+j).data('uid',tmpDetail.uid));
						}
						lazyLoadImg(window.imgUrl.femaleHead,Z('#f'+femaleTotal).removeClass('select'));
						break;
					}
				}
			}
			function chooseMale(uid){
				Z('#maleTab').find('.head').each(function(){
					if(Z(this).attr('uid') == uid){
						Z(this).addClass('select');
					}
				});
				var maleTotal = choosedMaleArray.length;
				choosedMaleArray.push(uid);
				var detail = detailMap[uid];
				lazyLoadImg(detail.headImg+bigHeadParams,Z('#m'+maleTotal).data('uid',uid).addClass('select'));
			}
			function cancelChooseMale(uid){
				Z('#maleTab').find('.select').each(function(){
					if(Z(this).attr('uid') == uid){
						Z(this).removeClass('select');
					}
				});
				var i,maleTotal = choosedMaleArray.length;
				var j,tmpDetail;
				for(i = 0; i < maleTotal; i++){
					if(choosedMaleArray[i] == uid){
						choosedMaleArray.splice(i,1);
						maleTotal--;
						for(j = i; j < maleTotal; j++){
							tmpDetail = detailMap[choosedMaleArray[j]];
							lazyLoadImg(tmpDetail.headImg+bigHeadParams,Z('#m'+j).data('uid',tmpDetail.uid));
						}
						lazyLoadImg(window.imgUrl.maleHead,Z('#m'+maleTotal).removeClass('select'));
						break;
					}
				}
			}
			function isFemaleChoosed(uid){
				var i,femaleTotal = choosedFemaleArray.length;
				for(i = 0; i < femaleTotal; i++){
					if(choosedFemaleArray[i] == uid){
						return true;
					}
				}
				return false;
			}
			function isMaleChoosed(uid){
				var i,maleTotal = choosedMaleArray.length;
				for(i = 0; i < maleTotal; i++){
					if(choosedMaleArray[i] == uid){
						return true;
					}
				}
				return false;
			}
			function choosePerson(){
				var $d = Z('#detail');
				var $button = Z('#uChoose');
				var uid = $d.data('uid');
				if(!uid){return;}
				var detail = detailMap[uid];
				if(detail.sex == 0){
					if(isFemaleChoosed(uid)){
						$button.html('选择').removeClass('cancel');
						cancelChooseFemale(uid);
					}
					else{
						if(isFemaleReady()){
							alert('女嘉宾已经选满了!');
							return;
						}
						else{
							chooseFemale(uid);
						}
					}
				}
				else{
					if(isMaleChoosed(uid)){
						$button.html('选择').removeClass('cancel');
						cancelChooseMale(uid);
					}
					else{
						if(isMaleReady()){
							alert('男嘉宾已经选满了!');
							return;
						}
						else{
							chooseMale(uid);
						}
					}
				}
				hideDetail();
			}
			Z('#uChoose').on('click',choosePerson);
			Z('#rChoose').on('click',function(){
				var sexName = '男';
				var readyFunc = isMaleReady;
				var choosedFunc = isMaleChoosed;
				var chooseFunc = chooseMale;
				var targetSex = 1;
				var emptyFunc = function(){
					choosedMaleArray = [];
					$('#maleTab .head').removeClass('select');
					$('#maleResult .bgCon').removeClass('select');
				}
				if(curChoose == 'female'){
					targetSex = 0;
					sexName = '女';
					readyFunc = isFemaleReady;
					choosedFunc = isFemaleChoosed;
					chooseFunc = chooseFemale;
					emptyFunc = function(){
						choosedFemaleArray = [];
						$('#femaleTab .head').removeClass('select');
						$('#femaleResult .bgCon').removeClass('select');
					}
				}
				if(readyFunc()){
					if(!confirm(sexName+'嘉宾已经选满了,确认要完全替换吗?')){
						return;
					}
					else{
						emptyFunc();
					}
				}
				var rand,uid,obj;
				while(!readyFunc()){
					rand = Math.floor(Math.random()*totalNum);
					obj = totalArray[rand];
					uid = obj.uid;
					//alert('rand:'+rand+',uid:'+uid+',sex:'+obj.sex);
					if(obj.sex == targetSex&&!choosedFunc(uid)){
						chooseFunc(uid);
					}
				}
			});
			Z('#cChoose').on('click',function(){
				if($(this).hasClass('ing')){return;}
				if(!isMaleReady()){
					alert('男嘉宾还没有选满!');
					switchChoose('male');
					return;
				}
				if(!isFemaleReady()){
					alert('女嘉宾还没有选满!');
					switchChoose('female');
					return;
				}
				if(confirm('确认要选择这些嘉宾并进入投票阶段吗?')){
					var originText = $(this).html();
					$(this).addClass('ing').html('提交中...');
					Z.ajax({
						url:window.actionUrl.chooseGuest.url,
						type:window.actionUrl.chooseGuest.type,
						data:Z.extend({
							actId:actId,
							actToken:actToken,
							males:choosedMaleArray,
							females:choosedFemaleArray
						},getCommonReqData()),
						success:function(reply){
							reply = checkReply(reply);
							if(!reply){return;}
							console.log('chooseGuest reply',reply);
							if(reply.status == 0){
								alert('选择嘉宾成功，活动进入投票阶段');
								backToDetail();
							}
							else{
								alert('噫，选择嘉宾失败了，重试一次试试吧');
							}
						},
						error:function(){
							noNetwork();
						},
						complete:function(){
							Z('#cChoose').removeClass('ing').html(originText);
						}
					})
				}
			});
			Z('#footer').on('click','.back',function(){
				if(choosedFemaleArray.length||choosedMaleArray.length){
					if(confirm('确认要放弃这次的嘉宾选择吗?')){
						backToDetail();
					}
				}
				else{
					backToDetail();
				}
			});
		},
		error:function(err){
			noNetwork();
		}
	});

	lazyLoadImg(window.imgUrl.maleHead,Z('#maleResult .bgCon'));//加载默认头像
	lazyLoadImg(window.imgUrl.femaleHead,Z('#femaleResult .bgCon'));

	switchChoose('female');

	Z('#tabNav').on('click','.nav',function(){//切换选择结果的选项卡
		var targetId = Z(this).attr('targetId');
		curChoose = 'female';
		if(targetId == 'maleTab'){
			curChoose = 'male';
		}
		switchChoose(curChoose);
	});
});