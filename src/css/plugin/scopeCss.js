
var postcss = require('postcss')
var selectorParser = require('postcss-selector-parser')



module.exports = postcss.plugin('css-scope', function (opts) {
  	return function (root,options) {
 		var opts = options.opts;
  		root.each(function rewriteSelector (node) {
	      	if (!node.selector) {
	        	// handle media queries
	        	if (node.type === 'atrule') {
		          	if (node.name === 'media') {
		            	node.each(rewriteSelector)
		          	}
	        	}
	        	return
	      	}
	      	node.selector = selectorParser(function (selectors) {
		        selectors.each(function (selector) {
		          	var node = null
		          	selector.each(function (n) {
		            	if (n.type === 'combinator' && n.value === '>>>') {
		              		n.value = ' '
		              		n.spaces.before = n.spaces.after = ''
		              		return false
		            	}
		            	if (n.type === 'tag' && n.value === '/deep/') {
		             		 var next = n.next()
		              		if (next.type === 'combinator' && next.value === ' ') {
		                		next.remove()
		              		}
		              		n.remove()
		              		return false
		            	}
		            	if (n.type !== 'pseudo' && n.type !== 'combinator') {
		              		node = n
		            	}
		         	})
			        selector.insertAfter(node, selectorParser.attribute({
			            attribute: `data-cssid-${opts.uniqueID}`
			        }))
		        })
      		}).process(node.selector).result
	    })
  	}
})



