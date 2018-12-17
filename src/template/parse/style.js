var path = require('path');
var styleStartReg = /(?:(?:<style){1}(?:(?:\s)+(?:lang[\=|\=\=])['"]([a-zA-Z])+['"])?>)/
var styleEndReg = /(?:(?:<\/style>))/
var styleImportReg = /(?:@import){1}(?:\s*)?(?:'|"){1}([\/\.\w-_]+){1}(?:'|"){1}/
var styleRequireReg = /(?:require){1}(?:\(){1}(?:'|"){1}([\/\.\w-_]+){1}(?:'|"){1}(?:\)){1}/



var handleStyle = function(content,resourcePath){
	var stylePaths = [];
	var styleStart = content.match(styleStartReg)
	var styleEnd = content.match(styleEndReg)
	var startIndex = styleStart.index + styleStart[0].length;
	var endIndex = styleEnd.index
	var styleConent = content.substring(startIndex, endIndex)
	content = content.replace(styleStart[0]+styleConent+styleEnd[0],'')
	stylePaths  = getStyleUrl(styleConent,resourcePath)

	return {
		content,
		stylePaths
	}
}



//获取样式路径
var getStyleUrl = function(conent,resourcePath){
	var stylePath = [];
	var errorMax = 1000;
	var count = 1;
	while( (styleImportReg.test(conent) || styleRequireReg.test(conent)) && errorMax>count){
		count++;
		var result = conent.match(styleImportReg)
		result = result?result:conent.match(styleRequireReg)
		if(result && result.length > 1){
			var mikdr = path.dirname(resourcePath)
			var filePath = result[1];
			filePath = path.resolve(mikdr,filePath)
			stylePath.push(filePath)
		}else{
			break;
		}
		conent = conent.replace(result[0],'')
	}
	return stylePath
}



var isFilterStyle = function(conent){
	return styleStartReg.test(conent) && styleEndReg.test(conent)
}



module.exports = {
	isFilterStyle,
	handleStyle 
}

