'use strict';
Z(function(){
	var actId = getValueFromSearch('actId');
	var actToken = getValueFromSearch('actToken');
	var fNum = getValueFromSearch('fNum');
	var $ = Z;
	var curFemale,curMale;
	var taskTemplate = [
	'<div class="task{status}" uniId="{uniId}" taskId="{taskId}">',
		'<div class="title">',
			'<div class="content">',
				'<span>{taskName}：</span>',
				'<span>{title}</span>',
				'<img src="{titleImg}" class="{titleImgClass}">',
			'</div>',
		'</div>',
		'<div class="middle">',
			'<div class="text{textClass}">',
				'<span class="author">{author}</span>',
				'<span class="content">: {texts}</span>',
			'</div>',
			'<div class="showMore{showMore}">全文</div>',
			'<div class="photos">{photos}</div>',
			'<button class="doAct{doClass}">{doText}</button>',
			'<div class="tips">',
				'<span class="date">{date}</span>',
				'<div class="cmd">',
					'<img class="act" src="'+window.imgUrl.more+'">',
					'<div class="tools">',
						'<div class="btns">',
							'<button class="donate">',
								'<img src="'+window.imgUrl.whiteDonate+'">',
								'赞助',
							'</button>',
							'<button class="{praised}">',
								'<img src="'+window.imgUrl.whiteLike+'">',
								'<span>{praiseText}</span>',
							'</button>',
							'<button class="comment">',
								'<img src="'+window.imgUrl.whiteComment+'">',
								'评论',
							'</button>',
							'<div class="gap left"></div>',
							'<div class="gap right"></div>',
						'</div>',
					'</div>',
				'</div>',
			'</div>',
		'</div>',
		'<div class="praises{praiseClass}">',
			'<div class="liked"></div>',
			'<div class="list">{praises}</div>',
		'</div>',
		'<div class="donates{donateClass}">{donates}</div>',
		'<div class="comments{commentClass}">{comments}</div>',
		'<div class="replyBox">',
			'<div class="head bgCon" psrc="{userHead}" uid="{userId}"></div>',
			'<textarea class="replyInput"></textarea>',
			'<button class="replySubmit">确定</button>',
		'</div>',
	'</div>'
	].join('');
	var donateTemplate = [
	'<div class="rItem">',
		'<div class="head bgCon" psrc="{psrc}" uid="{ownerId}">',
			'<img class="mark" src="'+window.imgUrl.redDonate+'">',
		'</div>',
		'<div class="commentText">',
			'<span class="name" uid="{ownerId}">{nickname}</span>',
			'赞助了',
			'<span class="sum">{sum}</span>',
			'元',
		'</div>',
	'</div>'
	].join('');
	var commentTemplate = [
	'<div class="rItem" uniId="{uniId}">',
		'<div class="head bgCon" psrc="{psrc}" uid="{ownerId}"></div>',
		'<div class="commentText">',
			'<span class="name" uid="{ownerId}">{nickname}</span>',
			'<span class="reply{showTarget}">回复</span>',
			'<span class="target{showTarget}" uid="{targetId}">{targetName}</span>',
			'<span class="content">: {text}</span>',
		'</div>',
	'</div>'
	].join('');

	function toPersonPage(uid){
		if(!uid){return;}
		console.log('toPersonPage',uid);
		window.location.href = 'userInfo.html'+getCommonParams()+'&targetId='+encodeURIComponent(uid);
	}
	
	$('#top').addClass('p'+fNum);
	$('.fNum').html(fNum);

	$.ajax({
		url:window.actionUrl.getActDetail.url,
		type:window.actionUrl.getActDetail.type,
		data:$.extend({
			actId:actId,
			actToken:actToken
		},getCommonReqData()),
		success:function(reply){
			reply = checkReply(reply);
			if(!reply){return;}
			var females = reply.females;
			var males = reply.males;
			var len = females.length;
			var i;
			for(i = 0; i < len; i++){
				if(females[i].guestNumber == fNum){
					curFemale = females[i];
					break;
				}
			}
			for(i = 0; i < len; i++){
				if(males[i].guestNumber == curFemale.linkedNumber){
					curMale = males[i];
					break;
				}
			}
			var $t = $('#top');
			$t.find('.taskNum').html(curFemale.taskNum);
			$t.find('.female .num').html('女'+fNum);
			$t.find('.female .name').html(curFemale.nickname);
			$t.find('.male .num').html('男'+curMale.guestNumber);
			$t.find('.male .name').html(curMale.nickname);
			var headSize = 4*window.fontSize;
			var headParams = '?'+qnImg.base()+qnImg.and+qnImg.min(headSize*window.dpi,headSize*window.dpi);
			lazyLoadImg(curFemale.headImg+headParams,$t.find('.female .bgCon'));
			lazyLoadImg(curMale.headImg+headParams,$t.find('.male .bgCon'));
			var $d = $('#donateBox');
			lazyLoadImg(curFemale.headImg+headParams,$d.find('.female'));
			lazyLoadImg(curMale.headImg+headParams,$d.find('.male'));

			$t.find('.female').on('click',function(){
				window.location.href = 'guestInfo.html'+getCommonParams()
				+'&actId='+encodeURIComponent(actId)+'&actToken='+actToken
				+'&sex=0&num='+encodeURIComponent(curFemale.guestNumber);
			});
			$t.find('.male').on('click',function(){
				window.location.href = 'guestInfo.html'+getCommonParams()
				+'&actId='+encodeURIComponent(actId)+'&actToken='+actToken
				+'&sex=1&num='+encodeURIComponent(curMale.guestNumber);
			});

			userReady(getTaskList);
		},
		error:function(err){
			noNetwork();
		}
	});

	var getTaskListIng = false;
	function getTaskList(){
		if(getTaskListIng){
			return;
		}
		getTaskListIng = true;
		$.ajax({
			url:window.actionUrl.getDatingTasks.url,
			type:window.actionUrl.getDatingTasks.type,
			data:$.extend({
				actId:actId,
				actToken:actToken,
				fNum:fNum
			},getCommonReqData()),
			success:function(reply){
				reply = checkReply(reply);
				if(!reply){return;}
				console.log('getDatingTasks reply',reply);
				var taskArray = reply.tasks||[];
				var len = taskArray.length;
				var i,j;
				var taskHtml = '';
				var tmpObj = {
					author:curFemale.nickname+'&'+curMale.nickname
				};
				var tmpTask;
				var photoNum,praiseNum,donateNum,commentNum,tmpData;
				var headSize = Math.ceil(1.25*window.fontSize);
				var headParams = '?'+qnImg.base()+qnImg.and+qnImg.min(headSize*window.dpi,headSize*window.dpi);
				var photoSize = 4*window.fontSize;
				var photoParams = '?'+qnImg.base()+qnImg.and+qnImg.min(photoSize*window.dpi,photoSize*window.dpi);
				var hasTarget,tmpIndex;
				for(i = 0; i < len; i++){
					tmpTask = taskArray[i];
					tmpObj.uniId = tmpTask.uniId;
					tmpObj.title = tmpTask.title;
					tmpObj.date = tmpTask.date;
					tmpObj.taskName = '新挑战';
					tmpObj.status = ' new';
					tmpObj.praiseClass = ' empty';
					tmpObj.donateClass = ' empty';
					tmpObj.commentClass = ' empty';
					tmpObj.praised = 'praise';
					tmpObj.praiseText = '点赞';
					tmpObj.doClass = '';
					tmpObj.doText = '';
					tmpObj.taskId = tmpTask.taskId;
					tmpObj.userHead = window.userInfo.headImg+headParams;
					tmpObj.userId = window.userInfo.uid;
					tmpObj.titleImgClass = '';
					if(tmpTask.flag == 0){
						tmpObj.taskName = '挑战'+tmpObj.taskId;
						tmpObj.status = '';
						tmpObj.titleImg = window.imgUrl.taskFinished;
						if(window.uid == curFemale.guestId||window.uid == curMale.guestId){
							tmpObj.titleImg = window.imgUrl.taskEdit;
							tmpObj.titleImgClass = 'taskEdit';
						}
					}
					else{
						tmpObj.doClass = ' encourage';
						tmpObj.doText = '加油';
						tmpObj.titleImg = '';
						if(window.uid == curFemale.guestId||window.uid == curMale.guestId){
							tmpObj.doClass = ' publish';
							tmpObj.doText = '提交任务';
						}
					}
					if(tmpTask.praised == 0){
						tmpObj.praised = 'cancelPraise';
						tmpObj.praiseText = '取消';
					}
					tmpObj.texts = tmpTask.reply;
					tmpObj.textClass = '';
					tmpObj.showMore = '';
					if(tmpObj.texts&&tmpObj.texts.length>200){
						tmpObj.textClass = ' tooLong';
						tmpObj.showMore = ' show';
					}
					tmpObj.photos = '';
					photoNum = tmpTask.photos.length;
					for(j = 0; j < photoNum; j++){
						tmpObj.photos += '<div class="bgCon" psrc="'+tmpTask.photos[j]+photoParams+'" osrc="'+tmpTask.photos[j]+'"></div>';
					}
					tmpObj.praises = '';
					praiseNum = tmpTask.praiseList&&tmpTask.praiseList.length;
					if(praiseNum){
						tmpObj.praiseClass = '';
						tmpObj.praises += '<span class="name" uid="'+tmpTask.praiseList[0].ownerId+'">'+tmpTask.praiseList[0].nickname+'</span>';
					}
					for(j = 1; j < praiseNum; j++){
						tmpObj.praises += '<span class="dot">, </span><span class="name" uid="'+tmpTask.praiseList[j].ownerId+'">'+tmpTask.praiseList[j].nickname+'</span>';
					}
					tmpObj.donates = '';
					donateNum = tmpTask.donateList&&tmpTask.donateList.length;
					if(donateNum){
						tmpObj.donateClass = '';
					}
					for(j = 0; j < donateNum; j++){
						tmpIndex = tmpTask.donateList[j];
						tmpData = {
							psrc:tmpIndex.headImg+headParams,
							nickname:tmpIndex.nickname,
							ownerId:tmpIndex.ownerId,
							sum:tmpIndex.sum
						}
						tmpObj.donates += format(donateTemplate,tmpData);
					}
					tmpObj.comments = '';
					commentNum = tmpTask.commentList&&tmpTask.commentList.length;
					if(commentNum){
						tmpObj.commentClass = '';
					}
					for(j = 0; j < commentNum; j++){
						hasTarget = ('targetName' in tmpTask.commentList[j]);
						tmpIndex = tmpTask.commentList[j];
						tmpData = {
							uniId:tmpIndex.uniId,
							psrc:tmpIndex.headImg+headParams,
							nickname:tmpIndex.nickname,
							ownerId:tmpIndex.ownerId,
							text:tmpIndex.text,
							showTarget:hasTarget?'':' hide',
							targetName:hasTarget?tmpIndex.targetName:'',
							targetId:hasTarget?tmpIndex.targetId:''
						}
						tmpObj.comments += format(commentTemplate,tmpData);
					}
					taskHtml += format(taskTemplate,tmpObj);
				}
				var $t = $('#taskList');
				$t.html(taskHtml).find('.bgCon').each(function(){
					var psrc = $(this).attr('psrc');
					if(!psrc){return;}
					$(this).removeAttr('psrc')
					lazyLoadImg(psrc,this);
				});
				$t.find('.photos').on('click','.bgCon',function(){
					var osrc = $(this).attr('osrc');
					if(!osrc){return;}
					var $p = $(this).parent();
					var imgList = $p.data('list');
					wxPreviewImg(osrc,imgList);
				}).each(function(){
					var imgList = [];
					$(this).find('.bgCon').each(function(){
						var osrc = $(this).attr('osrc');
						if(!osrc){return;}
						imgList.push(osrc);
					});
					$(this).data('list',JSON.stringify(imgList));
				});
				var actTime = 200;//点赞和评论的入口弹出的动画时间
				var hoverTime = 100;
				function hoverNameStart(){
					var $t = $(this);
					$t.data('ts',1);
					if($t.hasClass('hover')){return;}
					setTimeout(function(){
						if(!$t.data('ts')){return;}
						$t.data('ts',0).addClass('hover');
					},hoverTime);
				}
				function hoverNameEnd(){
					var $t = $(this);
					$t.data('ts',0);
					$t.removeClass('hover');
				}
				function hoverTextStart(e){
					//console.log('hoverTextStart',e.target);
					var t = e.target;
					while(!$(t).hasClass('commentText')){
						if($(t).hasClass('name')||$(t).hasClass('target')){
							return;
						}
						t = t.parentNode;
					}
					var $t = $(this);
					$t.data('ts',1);
					if($t.hasClass('hover')){return;}
					setTimeout(function(){
						if(!$t.data('ts')){return;}
						$t.data('ts',0).addClass('hover');
					},hoverTime);
				}
				function hoverTextEnd(e){
					//console.log('hoverTextEnd',e.target);
					var $t = $(this);
					$t.data('ts',0);
					$t.removeClass('hover');
				}
				function getParent(node,className){
					while(node != document.body){
						if($(node).hasClass(className)){
							break;
						}
						node = node.parentNode;
					}
					return node;
				}
				var inputTemplate = [
					'<div class="replyBox">',
						'<textarea placeholder="{holder}"></textarea>',
						'<button class="replySubmit">确定</button>',
					'</div>'
				].join('');
				function showInput(parentNode,config,holder){
					$(parentNode).find('.replyBox')
					.data('config',JSON.stringify(config)).addClass('show').addClass('first')
					.find('textarea').attr('placeholder',holder).focus();
				}
				var $curDonateTask;
				function showDonate(donateTaskNode){
					$curDonateTask = $(donateTaskNode);
					var $d = $('#donateBox').addClass('show');
					var rand = parseFloat((0.1+Math.random()*9.9).toFixed(2));
					$d.find('.sum .num').html(rand);
					$(window).trigger('resize');
					setTimeout(function(){
						// $d.css('background-color','rgba(0,0,0,0.8)')
						// .find('.main').css('opacity',1);
						$d.css('opacity',1);
					},1);
				}
				function hideDonate(){
					//console.log('hideDonate here');
					// var $d = $('#donateBox').css('background-color','rgba(0,0,0,0)');
					// $d.find('.main').css('opacity',0);
					var $d = $('#donateBox').css('opacity',0);
					setTimeout(function(){
						$d.removeClass('show').find('.input').removeClass('show').find('input').val('');
						$d.find('.random').addClass('show');
					},300);
				}
				$('#donateBox').off('click').on('click',function(e){
					var t = e.target;
					while(t != this){
						if($(t).hasClass('content')){
							return;
						}
						t = t.parentNode;
					}
					hideDonate();
				}).on('click','.close',hideDonate)
				.on('click','.switch',function(){
					var $p = $(this).parent().parent();
					$p.find('.random').removeClass('show');
					$p.find('.input').addClass('show');
					$p.find('.input input').focus();
				}).on('click','.submit',function(){
					console.log('submit on click');
					var $p = $(this).parent();
					var targetSum = 0;
					var $inputNode;
					if($p.find('.random').hasClass('show')){
						targetSum = $p.find('.sum .num').html();
					}
					else{
						$inputNode = $p.find('.input input');
						targetSum = $inputNode.val();
						if(!targetSum){
							$inputNode.addClass('warning').focus();
							return;
						}
					}
					try{
						targetSum = parseFloat(targetSum);
					}
					catch(err){
						alert('捐赠金额异常,请重试');
						hideDonate();
						return;
					}
					if(targetSum<0.1){
						alert('捐赠金额最少为0.1元');
						return;
					}
					if(!targetSum){
						alert('捐赠金额异常,请重试');
						hideDonate();
						return;
					}
					targetSum = Math.min(targetSum,200);
					donate({
						uniId:$curDonateTask.attr('uniId'),
						sum:targetSum,
						callback:function(){
							var headSize = Math.ceil(1.25*window.fontSize);
							var headParams = '?'+qnImg.base()+qnImg.and+qnImg.min(headSize*window.dpi,headSize*window.dpi);
							var tmpData = {
								psrc:window.userInfo.headImg+headParams,
								nickname:window.userInfo.nickname,
								ownerId:window.userInfo.uid,
								sum:targetSum
							}
							var donateHtml = format(donateTemplate,tmpData);
							$curDonateTask.find('.donates').append(donateHtml).removeClass('empty').find('.bgCon').each(function(){
								var psrc = $(this).attr('psrc');
								if(!psrc){return;}
								$(this).removeAttr('psrc');
								lazyLoadImg(psrc,this);
							});
						}
					});
					hideDonate();
				}).on('touchmove',function(e){
					e.preventDefault();
				});
				var $curDelete;
				function showDelete($rItem){
					console.log('showDelete',$rItem);
					$curDelete = $rItem;
					var $r = $('#rDelete').show();
					setTimeout(function(){
						$r.css('background-color','rgba(0,0,0,0.4)')
						.find('.btns').css('bottom',0);
					},1);
				}
				$('#rDelete').off('click').on('click',function(){
					var $t = $(this);
					$t.css('background-color','rgba(0,0,0,0)').find('.btns').css('bottom',-6*window.fontSize);
					setTimeout(function(){
						$t.hide();
					},300);
				}).on('click','.delete',function(){
					if($curDelete&&$curDelete.length){
						deleteComment({
							uniId:$curDelete.attr('uniId')
						});
						$curDelete.remove();
						$curDelete = null;
					}
				}).on('touchmove',function(e){
					e.preventDefault();
				});
				$(window).on('resize',function(){
					var $d = $('#donateBox');
					if(!$d.hasClass('show')){return;}
					var $m = $d.find('.main');
					var pHeight = $d.height();
					var mHeight = $m.height();
					var toTop = Math.max(0,(pHeight-mHeight)/3);
					$m.css('top',toTop);
				});
				function toPublishPage(){
					var p = getParent(this,'task');
					window.location.href = 'taskPublish.html'+getCommonParams()
					+'&actId='+encodeURIComponent(actId)+'&actToken='+actToken
					+'&fNum='+encodeURIComponent(fNum)+'&taskId='+encodeURIComponent($(p).attr('taskId'));
				}
				$t.on('click','.publish',toPublishPage)
				.on('click','.taskEdit',toPublishPage)
				.on('click','.showMore',function(){
					var $t = $(this).parent().find('.text');
					if($t.hasClass('tooLong')){
						$t.removeClass('tooLong');
						$(this).html('收起');
					}
					else{
						$t.addClass('tooLong');
						$(this).html('全文');
					}
				}).on('click','.act',function(){
					var $t = $(this);
					var $p = $t.parent();
					console.log('act onclick');
					if($t.hasClass('show')){
						$t.removeClass('show');
						$p.find('.btns').css('left','100%');
						setTimeout(function(){
							$p.find('.tools').hide();
						},actTime);
					}
					else{
						$t.addClass('show');
						$p.find('.tools').show();
						setTimeout(function(){
							$p.find('.btns').css('left','0');
						},0);
					}
				}).on('click','.btns',function(){
					var $t = $(this);
					var $p = $t.parent();
					$p.parent().find('.act').removeClass('show');
					$t.css('left','100%');
					console.log('btns onclick');
					setTimeout(function(){
						$p.hide();
					},actTime);
				}).on('click','.btns .comment',function(e){
					console.log('wanna comment');
					var taskParent = getParent(this,'task');
					//var middleParent = getParent(this,'middle');
					var taskUniId = $(taskParent).attr('uniId');
					showInput(taskParent,{
						uniId:taskUniId
					},'评论:');
				}).on('click','.encourage',function(e){
					console.log('wanna comment');
					var taskParent = getParent(this,'task');
					//var middleParent = getParent(this,'middle');
					var taskUniId = $(taskParent).attr('uniId');
					showInput(taskParent,{
						uniId:taskUniId
					},'为他&她加油:');
				}).on('click','.rItem',function(e){
					var t = e.target;
					while(t != this){
						if($(t).hasClass('name')||$(t).hasClass('target')){
							return;
						}
						t = t.parentNode;
					}
					console.log('rItem click');
					var $t = $(this);
					var tNode = this;
					var taskParent = getParent(this,'task');
					var $target = $t.find('.name');
					var targetName = $target.html();
					var targetId = $target.attr('uid');
					var taskUniId = $(taskParent).attr('uniId');
					userReady(function(){
						var $p = $t.parent();
						var findSelf = false;
						if(window.userInfo.uid != targetId){
							if($p.hasClass('comments')){
								$p.find('.rItem').each(function(){
									if(findSelf){
										$(this).addClass('tmpHide');
									}
									if(this == tNode){
										findSelf = true;
									}
								});
							}
							else if($p.hasClass('donates')){
								$(taskParent).find('.comments').addClass('tmpHide');
							}
							showInput(taskParent,{
								uniId:taskUniId,
								targetId:targetId,
								targetName:targetName
							},'回复'+targetName+':');
						}
						else{
							if($p.hasClass('comments')){
								showDelete($t);
							}
						}
					});
				}).on('change','.replyInput',function(){
					console.log('replyInput change');
					var text = $(this).val();
					if(text){
						$(this).removeClass('warning');
					}
				}).on('click','.replySubmit',function(){
					console.log('wanna submit reply');
					var $t = $(this);
					var $input = $t.parent().find('.replyInput');
					var replyText = $input.val();
					if(!replyText){
						$input.addClass('warning').focus();
						return;
					}
					$input.removeClass('warning').val('');
					var config = $t.parent().removeClass('show').data('config');
					var taskParent = getParent(this,'task');
					var reqData = $.extend(config,{
						text:replyText
					});
					comment(reqData);
					$(taskParent).find('.tmpHide').removeClass('tmpHide');
					userReady(function(){
						var hasTarget = ('targetName' in reqData);
						var headSize = Math.ceil(1.25*window.fontSize);
						var headParams = '?'+qnImg.base()+qnImg.and+qnImg.min(headSize*window.dpi,headSize*window.dpi);
						var tmpData = {
							psrc:window.userInfo.headImg+headParams,
							nickname:window.userInfo.nickname,
							ownerId:window.userInfo.uid,
							text:reqData.text,
							showTarget:hasTarget?'':' hide',
							targetName:hasTarget?reqData.targetName:'',
							targetId:hasTarget?reqData.targetId:''
						}
						var commentHtml = format(commentTemplate,tmpData);
						$(taskParent).find('.comments').append(commentHtml).removeClass('empty').find('.bgCon').each(function(){
							var psrc = $(this).attr('psrc');
							if(!psrc){return;}
							$(this).removeAttr('psrc');
							lazyLoadImg(psrc,this);
						});
					});
				}).on('click','.btns .praise',function(){
					console.log('wanna praise');
					var $t = $(this);
					var p = getParent(this,'task');
					var taskUniId = $(p).attr('uniId');
					userReady(function(){
						var $praises = $(p).find('.praises');
						var praiseHtml = '';
						if(!$praises.hasClass('empty')){
							praiseHtml += '<span class="dot">, </span>';
						}
						praiseHtml += '<span class="name" uid="'+window.uid+'">'+window.userInfo.nickname+'</span>';
						$praises.removeClass('empty').find('.list').append(praiseHtml);
						$t.removeClass('praise').find('span').html('取消');
						setTimeout(function(){
							$t.addClass('cancelPraise')
						},actTime);
					});
					praise({
						uniId:taskUniId
					});
				}).on('click','.btns .cancelPraise',function(){
					console.log('wanna cancelPraise');
					var $t = $(this);
					var p = getParent(this,'task');
					var taskUniId = $(p).attr('uniId');
					var praiseArray = [];
					var $praises = $(p).find('.praises');
					var praiseHtml = '';
					$praises.find('.name').each(function(){
						var curUid = $(this).attr('uid');
						if(curUid != window.uid){
							praiseArray.push({
								name:$(this).html(),
								uid:curUid
							});
						}
					});
					var len = praiseArray.length;
					var i;
					if(len>0){
						praiseHtml += '<span class="name" uid="'+praiseArray[0].uid+'">'+praiseArray[0].name+'</span>';
						for(i = 1; i < len; i++){
							praiseHtml += '<span class="dot">, </span><span class="name" uid="'+praiseArray[i].uid+'">'+praiseArray[i].name+'</span>';
						}
					}
					else{
						$praises.addClass('empty');
					}
					$praises.find('.list').html(praiseHtml);
					$t.removeClass('cancelPraise').find('span').html('点赞');
					setTimeout(function(){
						$t.addClass('praise');
					},actTime);
					cancelPraise({
						uniId:taskUniId
					});
				}).on('click','.btns .donate',function(){
					//console.log('wanna donate');
					var p = getParent(this,'task');
					var taskUniId = $(p).attr('uniId');
					var taskParent = getParent(this,'task');
					showDonate(taskParent);
				}).on('click','.head',function(){
					toPersonPage($(this).attr('uid'));
				}).on('click','.name',function(){
					toPersonPage($(this).attr('uid'));
				}).on('click','.target',function(){
					toPersonPage($(this).attr('uid'));
				}).on('touchstart','.name',hoverNameStart)
				.on('touchend','.name',hoverNameEnd)
				.on('touchstart','.target',hoverNameStart)
				.on('touchend','.target',hoverNameEnd)
				.on('touchstart','.commentText',hoverTextStart)
				.on('touchend','.commentText',hoverTextEnd);
				$(document.body).on('touchstart',function(e){
					var t = e.target;
					while(t != document.body){
						if($(t).hasClass('cmd')){
							return;
						}
						t = t.parentNode;
					}
					$('.cmd').each(function(){
						var $t = $(this);
						var $a = $t.find('.act');
						if($a.hasClass('show')){
							$a.removeClass('show');
							$t.find('.btns').css('left','100%');
							setTimeout(function(){
								$t.find('.tools').hide();
							},actTime);
						}
					});
				}).on('click',function(e){
					var t = e.target;
					//console.log('body onclick',t);
					while(t != this){
						if($(t).hasClass('replyBox')){
							return;
						}
						//console.log('body onclick',t);
						t = t.parentNode;
					}
					$('.replyBox').each(function(){
						var $t = $(this);
						var firstShow = $t.hasClass('first');
						$t.removeClass('first');
						if(!$t.hasClass('show')||firstShow){return;}
						var $input = $t.find('.replyInput');
						if($input.hasClass('warning')){return;}
						var text = $input.val();
						var taskParent;
						if(!text){
							$t.removeClass('show');
							taskParent = getParent(this,'task');
							$(taskParent).find('.tmpHide').removeClass('tmpHide');
						}

					});
				});
			},
			error:function(err){
				noNetwork();
			},
			complete:function(){
				getTaskListIng = false;
			}
		});
	}
});