


//捕获attribute的正则
// key = /^\s*([^\s"'<>\/=]+)/
// assing = /?:\s*((?:=))/
// value = /\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+))/
var attributeReg = /^\s*([^\s"'<>\/=]+)(?:\s*((?:=))\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/


//标签名
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = '((?:'+ ncname +'\\:)?'+ ncname +')';

//开始标签开头
var startTagOpen = new RegExp('^<'+qnameCapture);
//开始标签结束
var startTagClose = /^\s*(\/?)>/;
//结束标签
var endTag = new RegExp('^<\\/'+qnameCapture+'[^>]*>');

//doctype
var doctype = /^<!DOCTYPE [^>]+>/i;
//comment
var comment = /^<!--/;
//conditional
var conditionalComment = /^<!\[/
//sign
var signReg = /^[\r\n\s\t]+$/;

//为了解决某些版本 编译转化的问题
var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n'
}
//不编译换行
var encodedAttr = /&(?:lt|gt|quot|amp);/g
//编译换行
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g


//火狐正则bug
var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g,function(m,g){
	IS_REGEX_CAPTURING_BROKEN = g === ''
});



//解析html
var parseHTML = function(html, option){
	var stack = [];
	//是否不可嵌套节点
	var canBeleftOpenTag = option.canBeleftOpenTag;
	//是否自闭和节点
	var isUnaryTag = option.isUnaryTag;
	//不可包裹节点
	var isNonPhrasingTag = option.isNonPhrasingTag;
	//是否是IE
	var isIE = option.isIE;
	//解析下标
	var index = 0;
	var last , lastTag;
	//解析开始
	while(html){
		last = html;
		//找到标签开始
		var textEnd = html.indexOf('<');
		//开始标签
		if(textEnd === 0){
			//判断是否是注释
			if( comment.test(html) ){
				var commentEnd = html.indexOf('-->');
				if(commentEnd >= 0){
					advance(commentEnd + 3);
					continue;
				}
			}
			//判断条件标签
			if( conditionalComment.test(html) ){
				var conditionalEnd = html.indexOf(']>');
				if( conditionalEnd >=0 ){
					advance(conditionalEnd + 2);
					continue;
				}
			}
			//DOCTYPE
			var doctypeMatch = html.match(doctype);
			if( doctypeMatch ){
				advance( doctypeMatch[0].length );
				continue;
			}
			//结束标签
			var endTagMatch = html.match(endTag);
			if( endTagMatch ){
				var curIndex = index;
				advance( endTagMatch[0].length );
				parseEndTag(endTagMatch[1]);
				continue;
			}						
			//开始标签
			var startTagMatch = parseStartTag();
			if(startTagMatch){
				handleStartTag(startTagMatch);
				continue;
			}
		}

		//文本内容
		var text, rest , next;
		if(textEnd >= 0){
			//文本内容
			rest = html.slice(textEnd);
			//推进到下阶段字符串
			while(
				!endTag.test(rest)&&
				!startTagOpen.test(rest)&&
				!comment.test(rest)&&
				!conditionalComment.test(rest)
			){
				next = rest.indexOf('<',1)
				if(next < 0) break;
				textEnd += next;
				rest = html.slice(textEnd);
			}

			text = html.substring(0,textEnd);
			advance(textEnd);
		}

		if(textEnd < 0){
			text = html;
			html = '';
		}

		if(option.chars && text && !signReg.test(text)){
			option.chars(text)
		}
	}

	//向前推进
	function advance(n){
		index += n;
		html = html.substring(n);
	}


	//解析开头标签
	function parseStartTag(){
		var tagMatch = html.match(startTagOpen)
		var end , attr ;
		if( tagMatch ){
			var match = {
				tagName:tagMatch[1].toLowerCase(),
				attrs:[],
				start:index,
			}
			advance(tagMatch[0].length)
			while( !(end = html.match(startTagClose)) && (attr = html.match(attributeReg)) ){
				if(attr){
					advance(attr[0].length);
					match.attrs.push(attr);
				}
			}
			if(end){
				match.unarySlash = end[1];
				match.end = index;
				advance(end[0].length)
			}
			return match;
		}
	}
	

	//解析结束标签
	function parseEndTag(tagName){
		var tagName = tagName.toLowerCase();
		var index = -1;
		for(var i=0; i<stack.length ;i++){
			if(tagName = stack[i].tagName){
				index = i;
				break;
			}
		}
		if(index >= 0){
			//结束标签
			if(option.end){
				option.end(stack[i].tagName);
			}
			//解析stack弹出
			lastTag = stack.pop();
		}else{
			throw('标签解析出错 '+tagName+'未找到结束标签')
			return false;
		}
	}


	//处理标签内容
	function handleStartTag(match){
		var tagName = match.tagName;
		var unarySlash = match.unarySlash;
		//P标签并且当前标签不可包裹
		if( lastTag === 'p' && isNonPhrasingTag(tagName) ){
			parseEndTag(lastTag);
		}
		//不可嵌套标签
		if( lastTag === tagName && canBeleftOpenTag(tagName) ){
			parseEndTag(tagName);
		}

		var isUnary = isUnaryTag(tagName) || !!unarySlash;

		var attrs = [];
		for(var i=0 ;i<match.attrs.length ;i++){
			if( IS_REGEX_CAPTURING_BROKEN && match.attrs[i] ){
				if(!match.attrs[i][3]){ delete match.attrs[i][3] }
				if(!match.attrs[i][4]){ delete match.attrs[i][4] }
				if(!match.attrs[i][5]){ delete match.attrs[i][5] }
			}
			var value = match.attrs[i][3] || match.attrs[i][4] || match.attrs[i][5] || ''
			var re = encodedAttr;
			attrs.push({
				name: match.attrs[i][1],
				value: value.replace(re, function(match){ return decodingMap[match] }),
			})
		}
		if(option.start){
			stack.push(match);
			lastTag  = tagName
			option.start(tagName,attrs,isUnary);
		}
	}


}


module.exports = parseHTML



