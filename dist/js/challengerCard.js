"use strict";Z(function(){var a=getValueFromSearch("actId"),b=getValueFromSearch("actToken"),c=getValueFromSearch("uHead"),d=getValueFromSearch("uName"),e=getValueFromSearch("uSex"),f=Z("#cardDom");replaceImgSrc(f),f.find("#uName").html(d),f.find(".top .bgCon").each(function(){lazyLoadImg(c,this)}),f.find(".females .bgCon").each(function(){lazyLoadImg(window.imgUrl.femaleHead,this)}),f.find(".males .bgCon").each(function(){lazyLoadImg(window.imgUrl.maleHead,this)}),1==e?lazyLoadImg(c,f.find("#maleHead")):lazyLoadImg(c,f.find("#femaleHead")),Z.ajax({url:window.actionUrl.getActDetail.url,type:window.actionUrl.getActDetail.type,data:Z.extend({actId:a,actToken:b},getCommonReqData()),success:function(a){if(a=checkReply(a)){var b=a.creatorName,c=a.title,d=getDateFromTs(a.createTime);f.find("#creatorName").html(b),f.find("#actTitle").html(c),f.find("#actNum").html(d+"桌")}},error:function(a){noNetwork()}});var g="actDetail.html"+getCommonParams()+"&actId="+encodeURIComponent(a)+"&actToken="+encodeURIComponent(b);makeqr(Z("#qrCon")[0],g,window.imgUrl.logo),Z(".share").on("click",function(){shareGuide("邀请好友挑战")}),Z(".footer").on("click",".back",function(){window.location.href="actDetail.html"+getCommonParams()+"&actId="+encodeURIComponent(a)+"&actToken="+encodeURIComponent(b)}).on("click",".invite",function(){shareGuide("邀请好友挑战")})});
//# sourceMappingURL=challengerCard.js.map