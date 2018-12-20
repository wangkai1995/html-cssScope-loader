

var parse = require('./parse/index.js')
var { isFilterStyle,handleStyle  } = require('./parse/style.js')
var renderTemplate = require('./render.js')
var injectorStyle = require('./injectionStyle.js')

var fristSignReg = /^([\r\n\s\t]+)(?:<((?:[a-zA-Z_][\w\-\.]*\:)?[a-zA-Z_][\w\-\.]*))?/
var lastSignReg = /(?:(?:(?:[a-zA-Z_][\w\-\.]*\:)?[a-zA-Z_][\w\-\.]*)\/?>)?([\r\n\s\t]+)$/



var templateParse = function(template,options){
	var template = JSON.parse(template)
	var stylePaths = false
	var firstSign = false;
	var lastSign = false
	var importPaths = false;
	//去除style样式加载
	if(isFilterStyle(template)){
		var { content, stylePaths } = handleStyle(template,options.resourcePath)
		template = content
		stylePaths = stylePaths
	}
	//去除标签开头符号
	if(fristSignReg.test(template)){
		var codes = template.match(fristSignReg)
		if(codes && codes.length > 1){
			fristSign = codes[1]
			template = template.replace(fristSign,'')
		}
	}
 	//去除标签尾符号
 	if(lastSignReg.test(template)){
		var codes = template.match(lastSignReg)
		if(codes && codes.length > 1){
			lastSign = codes[1]
			template = template.replace(lastSign,'')
		}
	}
	//style
	if(stylePaths && stylePaths.length > 0){
		importPaths = injectorStyle(stylePaths,options)
	}else{
		options.uniqueID = false;
	}
	//tenmplate
	var AST = parse(template);
	var newTemplate = renderTemplate(AST,options)
	//done
	return {
		importPaths:importPaths,
		template: JSON.stringify(newTemplate)
	}
}







module.exports = templateParse 



