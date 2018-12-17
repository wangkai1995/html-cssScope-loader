var  { JSDOM } = require("jsdom");
var dom = new JSDOM();
var $window = dom.window
var $document = $window.document;



//查询节点
 var queryNode = function(el){
	var elm = document.querySelector(el);
	return elm;
}


//创建元素节点
 var createElement = function(el){
	return $document.createElement(el);
}

//创建文本节点
 var createTextNode = function(text){
	return $document.createTextNode(text);
}


//替换节点
 var repalceNode = function(el,newNode,oldNode){
	el.replaceChild(newNode,oldNode)
}

//设置节点文本内容
 var setText = function(el,text){
	return el.textContent = text;
}


//设置节点属性
 var setAttribute = function(el,attrKey,attrValue){
	el.setAttribute(attrKey,attrValue)
}


//设置节点值
 var setElementValue = function(el,valueKey,value){
	if(!el[valueKey]){
		return false;
	}
	el[valueKey] = value;
	return true;
}

//复制节点
 var cloneElement = function(el,flag){
	return el.cloneElement(flag?true:false);
}


//删除属性
 var removeAttribute = function(el,attrKey){
	el.removeAttribute(attrKey);
}


//删除子节点
 var removeChild = function(el,child){
	el.removeChild(child);
}


//获取父节点
 var getParent = function(el){
	return el.parentNode? el.parentNode : false;
}


//加入子节点
 var appendChild = function(el,child){
	el.appendChild(child);
}



//插入新节点
 var insertBefore = function(el,newChild,child){
	el.insertBefore(newChild,child);
}



module.exports = {
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
}