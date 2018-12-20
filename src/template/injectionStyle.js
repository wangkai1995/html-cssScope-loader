
var styleLangReg = /\.([a-zA-Z]+)+$/;




var injectorStyle = function(stylePaths,options){
	var importPaths = []
	stylePaths.forEach(function(item){
		if(!styleLangReg.test(item)){
			return false;
		}
		var styleLang = item.match(styleLangReg)[1]
		var result = 'require("!style-loader'
		switch(styleLang){
			case "scss":
				result += `!css-loader?{\\'minimize\\':${options.minimize?true:false}}!`
				result += `${options.selfPath}?{\\'cssModel\\':true,\\'cssScopeId\\':'${options.uniqueID}'}`
				result += `!sass-loader?{\\'sourceMap\\':${options.sourceMap?true:false}}!${item}");`
				break
			case "less":
				result += `!css-loader?{\\'minimize\\':${options.minimize?true:false}}!`
				result += `${options.selfPath}?{\\'cssModel\\':true,\\'cssScopeId\\':'${options.uniqueID}'}`
				result += `!less-loader?{\\'sourceMap\\':${options.sourceMap?true:false}}!${item}");`
				break
			case 'css':
			default :
				result += `!css-loader?{\\'minimize\\':${options.minimize?true:false}}!`
				result += `${options.selfPath}?{\\'cssModel\\':true,\\'cssScopeId\\':'${options.uniqueID}'}`
				result += `!${item}");`
		}
		importPaths.push(result)
	})
	importPaths = importPaths.join('\n')
	return importPaths
}






module.exports = injectorStyle


