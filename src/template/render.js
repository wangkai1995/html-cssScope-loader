

var {
	queryNode,
	createElement,
	createTextNode,
	repalceNode,
	setText,
	setAttribute,
	setElementValue,
	cloneElement,
	removeAttribute,
	removeChild,
	getParent,
	appendChild,
	insertBefore
} = require('../util/dom.js')



var renderTemplate  = function(AST,options){
	if(!AST || AST.length === 0){
		return false;
	}
	var root = handleRender(AST,options)
	return root.outerHTML
}



var  handleRender = function(AST,options){
	var astEl = AST;
	var moudelId = options.uniqueID
	var el
	switch(astEl.type){
		//dom 元素
		case 1:
			el = renderElement(astEl,moudelId)
			if(astEl.children.length >0){
				astEl.children.forEach(function(item){
					var child = handleRender(item,options)
					appendChild(el,child)
				})
			}
			break;
		//自定义组件
		case 2:
			break;
		//文本元素
		case 3:
			el = createTextNode(astEl.text);
			break;
	}

	return el;
}




var renderElement = function(astEl,moudelId){
	var el = createElement(astEl.tagName)
	if(astEl.attrs.length > 0){
		astEl.attrs.forEach(function(item){
			var key = item.name
			var value = item.value
			el.setAttribute(key,value)
		})
	}
	if(astEl.className){
		el.className = astEl.className
	}
	if(moudelId){
		el.setAttribute('data-cssID-'+moudelId,'')
	}
	return el;
}



module.exports = renderTemplate  


