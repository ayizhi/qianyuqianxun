'use strict';
Z(function(){
	var actId = getValueFromSearch('actId');
	var actToken = getValueFromSearch('actToken');

	//return;

	function renderDetail(data){//根据活动详情渲染页面
		console.log('renderDetail',data);
		var i,j;
		var headSize = Math.ceil(2.2*window.fontSize);
		var imgParams = '?'+qnImg.base()+qnImg.and+qnImg.min(headSize*window.dpi,headSize*window.dpi);
		var statusFlagImgSrc;
		replaceImgSrc(Z('#actNav'));
		var coverWidth = Math.ceil($(document.body).width());
		var coverHeight = Math.ceil(3.3*window.fontSize);
		var coverParams = '?'+qnImg.base()+qnImg.and+qnImg.min(coverWidth,coverHeight)+qnImg.and+qnImg.blur(15,5);
		lazyLoadImg(data.cover+coverParams,Z('#actNav'));
		lazyLoadImg(data.creatorHead+imgParams,Z('#creatorHead'));
		Z('#creatorName').html(data.creatorName);
		Z('#actTitle').html(data.title);
		Z('#actNum').html(getDateFromTs(data.createTime)+'桌');
		Z('#actNav').on('click',function(){
			window.location.href = 'actDetail.html'+getCommonParams()+'&actId='+encodeURIComponent(actId)+'&actToken='+encodeURIComponent(actToken);
		});
		switch(data.status){
			case window.actConfig.registering:
			statusFlagImgSrc = window.imgUrl.registeringFlag;
			break;
			case window.actConfig.linking:
			statusFlagImgSrc = window.imgUrl.linkingFlag;
			break;
			case window.actConfig.dating:
			statusFlagImgSrc = window.imgUrl.datingFlag;
			break;
			default:
			alert('活动进度状态码异常:'+data.status);
			return;
		}

		var linkDataArray = data.linkData;
		console.log('linkDataArray',linkDataArray);
		var chartTemplate = [
			'<div class="chart">',
				'<div class="count">{count}</div>',
				'<div class="heads">',
					'<div class="bgCon{femaleHead}"></div>',
					'<div class="bgCon right{maleHead}"></div>',
				'</div>',
				'<div class="text">',
					'<div class="num">{femaleNum}</div>',
					'<div class="name textAutoHide">{femaleName}</div>',
				'</div>',
				'<div class="text right">',
					'<div class="num">{maleNum}</div>',
					'<div class="name textAutoHide">{maleName}</div>',
				'</div>',
				'<div class="data"><span>{percent}</span>支持</div>',
			'</div>',
		].join('');
		var femaleArray = [];
		var maleArray = [];
		for(i = 0; i < data.pairs; i++){
			for(j = 0; j < data.pairs; j++){
				if(data.females[j].guestNumber == i+1){
					femaleArray.push(data.females[j]);
					break;
				}
			}
		}
		for(i = 0; i < data.pairs; i++){
			for(j = 0; j < data.pairs; j++){
				if(data.males[j].guestNumber == i+1){
					maleArray.push(data.males[j]);
					break;
				}
			}
		}
		console.log('femaleArray',femaleArray);
		console.log('maleArray',maleArray);
		var tmpData = {};
		var chartHtml = '';
		var percentArray = [];
		var totalNum = 0;//投票总数
		for(i = 0; i < data.pairs; i++){
			totalNum += linkDataArray[0][i];
		}
		for(i = 0; i < data.pairs; i++){
			percentArray.push([]);
			for(j = 0; j < data.pairs; j++){
				percentArray[i].push((100*linkDataArray[i][j]/totalNum));
			}
		}
		var tmpPercent;
		for(i = 0; i < data.pairs; i++){
			for(j = 0; j < data.pairs; j++){
				tmpData.count = (i+1)+'-'+(j+1);
				tmpData.femaleHead = ' f'+(i+1);
				tmpData.maleHead = ' m'+(j+1);
				tmpData.femaleNum = '女'+(i+1);
				tmpData.maleNum = '男'+(j+1);
				tmpData.femaleName = femaleArray[i].nickname;
				tmpData.maleName = maleArray[j].nickname;
				tmpPercent = Math.floor((percentArray[i][j]+percentArray[j][i])/2);
				tmpData.percent = tmpPercent+'%';
				chartHtml += format(chartTemplate,tmpData);
			}
		}
		Z('#chartTab').html(chartHtml);
		var smallHeadSize = Math.ceil(2*window.fontSize);
		imgParams = '?'+qnImg.base()+qnImg.and+qnImg.min(smallHeadSize*window.dpi,smallHeadSize*window.dpi);
		for(i = 0; i < data.pairs; i++){
			lazyLoadImg(femaleArray[i].headImg+imgParams,Z('#chartTab').find('.f'+(i+1)));
			lazyLoadImg(maleArray[i].headImg+imgParams,Z('#chartTab').find('.m'+(i+1)));
		}
		highchartsReady(function(){
			var categoriesArray = [];
			var k;
			for(k = 0; k < data.pairs; k++){
				categoriesArray.push(femaleArray[k].nickname);
			}
			var seriesArray = [];
			for(k = 0; k < data.pairs; k++){
				seriesArray.push({
					name: maleArray[k].nickname,
					data: percentArray[k]
				});
			}
			jQuery('#graphTab').on('touchstart',function(e){
				e.preventDefault();
			}).highcharts({
				chart: {
					//renderTo: 'graphTab',
					type: 'column'
				},
				colors:[
					'#30BF78','#6E96AD','#9B73D0','#D6C81C','#ea4c89'
				],
				title: {
					text: '连线百分比统计(总连线数:'+totalNum+')'
				},
				credits:false,
				exporting:{
					enabled:false
				},
				legend:{
					itemMarginTop:10,
				},
				// subtitle: {
				// 	text: 'Source: WorldClimate.com'
				// },
				// scrollbar:{
				// 	enabled:true
				// },
				xAxis: {
					categories: categoriesArray,
					crosshair: true
				},
				yAxis: {
					min: 0,
					title: {
						text: null
					},
					labels: {
               			format: '{value}%'
            		}
				},
				tooltip: {
					shared: true,
					useHTML: true,
					formatter: function() {
           				var s = '<span style="font-size:10px">'+this.x+'</span><br/>';
           				//var sortedPoints = this.points;
           				//console.log('here',this,sortedPoints);
           				var sortedPoints = this.points.sort(function(a, b){
                 			return ((a.y < b.y) ? 1 : ((a.y > b.y) ? -1 : 0));
             			});
          				jQuery.each(sortedPoints , function(i, point) {
           					s += '<br/><span style="color:'+point.series.color+'">'+point.series.name
           					+'</span>: <b>'+point.y+'%</b>';
           				});
           				return s;
           			}
				},
				plotOptions: {
					series: {
                		events: {
                    		legendItemClick: function (event) {
                    			return !(window.isMobile && event.browserEvent instanceof MouseEvent);
                    		}
                		}
            		},
					column: {
						pointPadding: 0.2,
						borderWidth: 0
					}
				},
				series: seriesArray
			});

			$('.highcharts-container').each(function() {
				var dragHandle;
				dragHandle = $('<div class="chart-drag-handle">');
				$(this).append(dragHandle);
				dragHandle.on('touchstart', function(e) {
					e.stopPropagation();
				});
				dragHandle.on('touchmove', function(e) {
					e.stopPropagation();
				});
				dragHandle.on('touchend', function(e) {
					e.stopPropagation();
				});
				dragHandle.on('touchcancel', function(e) {
					e.stopPropagation();
				});
			});
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

	// Z('.footer button').on('click',function(){
	// 	window.location.href = 'actDetail.html'+getCommonParams()+'&actId='+encodeURIComponent(actId)+'&actToken='+encodeURIComponent(actToken);
	// });
});