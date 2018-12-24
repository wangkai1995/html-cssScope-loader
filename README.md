# html-cssScope-loader

	这是一个参考vue-loader，为了解决CSS作用域实现的一个loader,为解决template添加css作用域的loader方案,支持sass,less,css三种解析

	参考vue-loader:data-v-xxxxx方案实现，而非css-loader的CSS module方案

	目前使用在一些 AngularJS 1.xx 版本 和一些需要innerHTML等动态解析html生产DOM的项目中

	采用vue-loader：data-v-xxxxx方案主要是为了解决ng-class等类似 动态渲染的class情况

	注意 loader返回的html内容是string类型的html->template,并不是真实的dom元素



## Installation

```
npm install html-css-scope-loader
```



## Examples

Webpack ->rules-> config:

```javascript

{
	test: /\.html$/,
	use: [{
		loader:'html-css-scope-loader',
		options: {
			minimize: true //  = css-loader minimize 
		}
	}]
},
```

Html tempalte

```html
<!-- 请注意-->
<!-- 由于参考vue-loader实现， 所以html：template !必须存在且只有一个根元素包裹-->
<!-- 并且相关自闭和元素，如img 必须按照<img xxx />方式闭合 不可以<img></img>方式   -->
<div class="watch-center-table fixed-height">
	<table class="account-ctrl-table">
		<tr>
			<th>品牌</th>
			<th>异常扣费</th>
			<th>被封账号</th>
		</tr>
		<tr>
			<!-- <td>自主账号</td> -->
			<td colspan="3" class="title-tr"><p><span>自主账号</span></p></td>
		</tr>
		<tr ng-repeat="item in selfAccountRiskControlData track by $index">
			<td>{{(item.type == 1 ? 21 : item.type) | bikeType}}</td>
			<td>{{item.exceptionCost}}</td>
			<td ng-class="{'redNotice': item.forbidden > 0}">{{item.forbidden}}</td>
		</tr>
		<tr>
			<td colspan="3" class="title-tr"><p><span>共享账号</span></p></td>
		</tr>
		<tr ng-repeat="item in shareAccountRiskControlData track by $index">
			<td>{{(item.type == 1 ? 21 : item.type) | bikeType}}</td>
			<td>{{item.exceptionCost}}</td>
			<td ng-class="{'redNotice': item.forbidden > 0}">{{item.forbidden}}</td>
		</tr>
	</table>
</div>


<!-- 支持@import 'xxxx' | require('xxx')两种方式-->
<!-- 支持scss,less,css 三种类型-->
<style>
	@import '../style/accountCtrl.scss';
	@import '../style/table.scss'
</style>
```

