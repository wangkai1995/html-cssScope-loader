var postcss = require('postcss')
var loaderUtils = require('loader-utils')
var scopeCssPlugin = require('./plugin/scopeCss.js')


var styleParse = function(css,options){
	// debugger;
	css = JSON.parse(css);
	// console.log(css,options)
	var cb = this.async()
	var options = {
      	map: false,
      	uniqueID:options.uniqueID
  	}
	var plugins = []
	plugins.push(require('autoprefixer')({
			browsers: ['> 1%', 'last 5 versions', 'not ie <= 9'],
	}));
	plugins.push(scopeCssPlugin)


	return postcss(plugins)
		.process(css, options)
      	.then(result => {
	        var map = result.map && result.map.toJSON();
	        cb(null, result.css, map)
		    return null
		})
		.catch(e => {
		    console.error(e)
		    cb(e)
		})
}










module.exports = styleParse



