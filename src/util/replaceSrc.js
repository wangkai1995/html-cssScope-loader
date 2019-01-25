function replaceSrc(fileContent, exclude) {
    fileContent = fileContent.replace(/((\<img[^\<\>]*? src)|(\<link[^\<\>]*? href))=\\?[\"\']?[^\'\"\<\>\+]+?\\?[\'\"][^\<\>]*?\>/ig, function(str){
        var reg = /((src)|(href))=\\?[\'\"][^\"\']+\\?[\'\"]/i;
        var regResult = reg.exec(str);
        if(!regResult) return str;
        var attrName = /\w+=/.exec(regResult[0])[0].replace('=', '');
        var imgUrl = regResult[0].replace(attrName+'=', '').replace(/[\\\'\"]/g, '');
        if(!imgUrl) return str; // 避免空src引起编译失败
        if(/^(http(s?):)?\/\//.test(imgUrl)) return str; // 绝对路径的图片不处理
        if(!/\.(jpg|jpeg|png|gif|svg|webp)/i.test(imgUrl)) return str; // 非静态图片不处理
        if(exclude && imgUrl.indexOf(exclude) != -1) return str; // 不处理被排除的
        if(!(/^[\.\/]/).test(imgUrl)) {
            imgUrl = './' + imgUrl;
        }
        return str.replace(reg, attrName+"=\"+JSON.stringify(require("+JSON.stringify(imgUrl)+"))+\"");
    });
    return fileContent;
}



module.exports = replaceSrc