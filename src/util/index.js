
var md5 = require('md5');


function getUniqueID(resourcePath) {
    var id = md5(resourcePath).substring(0,10);
    return id;
}


var makeMap = function(key, valueString) {
    var map = {};
    var list = (typeof valueString === 'string') ? valueString.split(',') : valueString.toString().split(',');
    if (Array.isArray(list) && list.length > 0) {
        map[key] = list
    } else {
        warnError('set map error: valueString type error or value error')
        return false;
    }
    return function(value) {
        return map[key].indexOf(value) !== -1 ? true : false;
    }
}




//不能被分局的标签
 var isNonPhrasingTag = makeMap('NonPhrasing',
	'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,'+
	'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,'+
	'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,'+
	'title,tr,track'
);



//不可嵌套标签
var canBeleftOpenTag = makeMap('beleftOpenTag',
	'web,spinner,switch,video,textarea,canvas,'+
	'indicator,marquee,countdown'
);



//自闭和标签
var isUnaryTag = makeMap('unaryTag',
	'embed,img,image,input,link,meta,br,base'
);






module.exports = {
	getUniqueID,
	isNonPhrasingTag,
	canBeleftOpenTag,
	isUnaryTag
}


