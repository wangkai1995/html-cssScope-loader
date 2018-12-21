
var fs = require('fs');
var path = require('path');
var loaderUtils = require("loader-utils");

var { getUniqueID } = require('./util/index.js')
var templateParse = require('./template/index.js')
var styleParse = require('./css/index.js')



module.exports = function(content) {
	var outResult = '';
	var options = loaderUtils.getOptions(this) || {};
	var resourcePath = this.resourcePath.replace(/\\/g,"/");
	options.resourcePath = resourcePath;
	options.uniqueID = options.cssScopeId?options.cssScopeId: getUniqueID(resourcePath)
	options.selfPath = path.resolve(__dirname,'./loader.js');
	options.selfPath = options.selfPath.replace(/\\/g,"\\\\")

	console.log(options.selfPath)
	//去除引入信息
	if(/module\.exports\s?=/.test(content)) {
		content = content.replace(/module\.exports\s?=\s?/, '');
	}else content = JSON.stringify(content);
	//是否传入的是css
	if(options.cssModel){
		outResult= styleParse.call(this,content,options)
	}else{
		var{ template,importPaths } = templateParse(content,options)
		if(importPaths){
			outResult += importPaths+'\n';
		}
		outResult += 'module.exports = '+ template
	}
	return outResult
};










