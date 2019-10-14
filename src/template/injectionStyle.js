
var styleLangReg = /\.([a-zA-Z]+)+$/;


var extendsLoader = function(options){
	const { extendsLoader } = options
	if(!Array.isArray(extendsLoader) || extendsLoader.length === 0){
		return ''
	}
	return extendsLoader.map(item =>{
		const { loader="",options={} } = item
		const exportConfig = (options)=>{
			var keys = Object.keys(options)
			return "{"+keys.map( key=>{
				return `\\'${key}\\':${options[key]}`
			}).join()+"}"
		}
		return `!${loader}?${exportConfig(options)}`
	}).join('')
}


var injectorStyle = function(stylePaths,options){
	var importPaths = []
	stylePaths.forEach(function(item){
		if(!styleLangReg.test(item)){
			return false;
		}
		var styleLang = item.match(styleLangReg)[1]
		item = item.replace(/\\/g,"\\\\")
		var result = 'require("!style-loader'
		switch(styleLang){
			case "scss":
				result += `!css-loader?{\\'minimize\\':${options.minimize?true:false}}!`
				result += `${options.selfPath}?{\\'cssModel\\':true,\\'cssScopeId\\':\\'${options.uniqueID}\\'}`
				result += extendsLoader(options)
				result += `!sass-loader?{\\'sourceMap\\':${options.sourceMap?true:false}}!${item}");`
				break
			case "less":
				result += `!css-loader?{\\'minimize\\':${options.minimize?true:false}}!`
				result += `${options.selfPath}?{\\'cssModel\\':true,\\'cssScopeId\\':\\'${options.uniqueID}\\'}`
				result += extendsLoader(options)
				result += `!less-loader?{\\'sourceMap\\':${options.sourceMap?true:false}}!${item}");`
				break
			case 'css':
			default :
				result += `!css-loader?{\\'minimize\\':${options.minimize?true:false}}!`
				result += `${options.selfPath}?{\\'cssModel\\':true,\\'cssScopeId\\':\\'${options.uniqueID}\\'}`
				result += extendsLoader(options)
				result += `!${item}");`
		}
		importPaths.push(result)
	})
	importPaths = importPaths.join('\n')
	return importPaths
}






module.exports = injectorStyle


