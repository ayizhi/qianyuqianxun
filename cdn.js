var fs = require('fs');
var newVersion = '0.0.1';
var baseJs = fs.readFileSync('src/js/base.js','utf8');
var firstLine = baseJs.substring(0,baseJs.indexOf(';'));
newVersion = firstLine.split('=')[1].replace(/'/g,'').replace(/\s/g,'');
// console.log('newVersion',newVersion);
var cdnhttp = 'http://qiniucdn.com/';
var versionReg = /\?v=[^"]*"/ig;
var versionStr = '?v='+newVersion+'"';
var cdnReg = /\.\.\//ig;
var path = 'dist/html';
fs.readdir(path,function(err,files){
	if(err){
		throw err;
	}
	else{
		var len = files.length;
		var htmlStr;
		var fileName;
		for(var i = 0; i < len; i++){
			fileName = path+'/'+files[i];
			htmlStr = fs.readFileSync(fileName,'utf8');
			htmlStr = htmlStr.replace(cdnReg,cdnhttp);
			htmlStr = htmlStr.replace(versionReg,versionStr);
			fs.writeFileSync(fileName,htmlStr,'utf8');
		}
	}
});