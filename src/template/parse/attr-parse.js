



//设置attribute映射
function setAttributeMap(attrs){
    var attribute = {};
    for(var i=0 ;i<attrs.length ;i++){
        attribute[attrs[i].name] = attrs[i].value; 
    }
    return attribute;
}




//提取attribute
function getAttributeMap(attrMap,attrKey){
    var keys = Object.keys(attrMap);
    if(keys.indexOf(attrKey) !== -1){
        var attrValue = attrMap[attrKey];
        delete attrMap[attrKey];
        return attrValue;
    }
}


//处理className
function processClassName(elm,key,attrMap){
    if(key !== 'class'){
        return false
    }
    elm.className = getAttributeMap(attrMap,key)
}

//处理剩余attr
function processSurplus(elm,attrMap){
    for(var key in attrMap){
        var attr = {};
        attr.name = key;
        attr.value = getAttributeMap(attrMap,key)
        elm.attrs.push(attr);
    }
}





//编译节点属性
module.exports =  function parseAttrs(astElm ,attrs){
    var attrsMap = setAttributeMap(attrs)
    var elm = astElm;
    for(var i=0; i<attrs.length; i++){
        var key = attrs[i].name;
        //处理className
        processClassName(elm,key,attrsMap)
    }
    processSurplus(elm,attrsMap)
}


