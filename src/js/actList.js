'use strict';
Z(function(){
	var cardTemplate = [
	'<div class="card" id="card{actId}" token="{actToken}">',
		'<img psrc="{cover}" class="cover">',
		//'<img src="'+window.imgUrl.actMask+'" class="mask">',
		'<div class="mask"></div>',
		'<div class="content">',
			'<div class="title">{title}</div>',
			'<div class="info">',
				'<div class="head bgCon"></div>',
				'<span class="name">{creatorName}</span>',
				'<span class="gap">·</span>',
				'<span class="date">{date}</span>',
				'<button class="status">{statusText}</button>',
			'</div>',
		'</div>',
	'</div>'
	].join('');

	function renderList(list){
		//console.log('renderList',list);
		var $renderNode = Z('#list');
		var cardNum = list.length;
		if(cardNum<1){
			$renderNode.html('<div id="empty">当前内容为空</div>');
			return;
		}
		var cardHtml = '';
		var i,tmpCard;
		var headSize = Z('.card .head').width()*window.dpi;
		var coverWidth = Z('.card').width()*window.dpi;
		var coverHeight = Z('.card').height()*window.dpi;
		var headParams = '?'+qnImg.base()+qnImg.and+qnImg.min(headSize,headSize);
		var coverParams = '?'+qnImg.base()+qnImg.and+qnImg.format('jpg')+qnImg.and+qnImg.min(coverWidth,coverHeight)+qnImg.and+qnImg.interlace();
		for(i = 0; i < cardNum; i++){
			tmpCard = list[i];
			tmpCard.date = getDateFromTs(tmpCard.createTime);
			switch(tmpCard.status){
				case window.actConfig.registering:
				tmpCard.statusText = '报名中';
				break;
				case window.actConfig.linking:
				tmpCard.statusText = '牵线中';
				break;
				case window.actConfig.dating:
				tmpCard.statusText = '约会中';
				break;
				default:
				tmpCard.statusText = '异常状态';
				break;
			}
			tmpCard.cover += coverParams;
			cardHtml += format(cardTemplate,tmpCard);
		}
		$renderNode.html(cardHtml);
		
		for(i = 0; i < cardNum; i++){
			tmpCard = list[i];
			lazyLoadImg(tmpCard.creatorHead+headParams,Z('#card'+tmpCard.actId+' .head'));
		}

		function imgResize(imgNode){
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

		$renderNode.find('.cover').each(function(){
			var psrc = Z(this).attr('psrc');
			if(!psrc){return;}
			Z(this).removeAttr('psrc');
			this.onload = function(){
				Z(this).parent().find('.mask').show();
				Z(this).data('w',this.width).data('h',this.height);
				imgResize(this);
			}
			this.src = psrc;
		});

		Z(window).on('resize',function(){
			$renderNode.find('.cover').each(function(){
				imgResize(this);
			});
		});

		Z('#empty').show().find('button').on('click',function(){
			window.location.href = 'createAct.html'+getCommonParams();
		});
	}

	var refreshListIng = false;

	function refreshList(){
		if(refreshListIng){return;}
		refreshListIng = true;
		Z.ajax({
			url:window.actionUrl.getActList.url,
			type:window.actionUrl.getActList.type,
			data:getCommonReqData(),
			success:function(reply){
				reply = checkReply(reply);
				if(!reply){return;}
				renderList(reply.list);
			},
			error:function(err){
				noNetwork();
			},
			complete:function(){
				refreshListIng = false;
			}
		})
	}

	refreshList();

	Z('#list').on('click','.card',function(){
		var actId = parseInt(Z(this).attr('id').substring('card'.length));
		var actToken = Z(this).attr('token');
		window.location.href = 'actDetail.html'+getCommonParams()+'&actId='+encodeURIComponent(actId)
		+'&actToken='+encodeURIComponent(actToken);
	});
});