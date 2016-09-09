# 斗鱼移动站Demo

### 安装运行

```
$ git clone git@gitlab.dz11.com:nanjing/m-douyu.git
$ npm install
$ npm run build  
$ npm run server
```

访问[http://localhost:8888/dist/pages/index](http://localhost:8888/dist/pages/index)访问首页

### 技术选型

> es6 + webpack + sass + eslint

之前斗鱼wap使用的是传统jquery来进行开发，这次以优化架构，性能为目的进行重构。由于目前模板的管理是由php完成，为了首屏渲染的体验以及斗鱼wap站业务的单一性，
暂时不适合vue或react来重构。

在js部分，由于目前一些依赖库还依赖于jquery的dom封装，所以使用zepto替换了jquery，同时使用zepto的tap事件。使用es6的class语法糖，promise，module等特性来
进行模块化开发，使用webpack+babel进行转义。

css部分，使用sass(scss语法)来进行模块化。

使用webpack作为构建工具，主要使用它的模块化，压缩，合并，自动补全css前缀，md5，base64，es6转义等特性。同时使用eslint作代码效验。

### 项目结构
> 以组件化开发结构为主，分而治之

在搭建项目结构时，无非是规划html，css，js，png等单元的排列组合，当我们单一将各自css，js，html分开时，
比如在处理scss目录时（js目录类同），会经常遇到一些变量的定义，共用方法的定义，页面的主题修改，layout布局更换等，所以我们使用的常见的目录大概是这样的：

```
sass
 -abstracts
 	-variables.scss 	// 变量的定义
 	-functions.scss 	// 共用function的定义
 -base
 	-reset.scss
 	-base.scss   		// 可参考bootstrap封装基础样式库
 -layout
	-header.scss
	-carousel.scss
 -pages
 	-home.scss
 -themes
 	-theme.scss
 	-admin.scss
 -vendors
 	-swiper.scss
 	-bootstrap.scss
```
	
一个页面是由组件构成的，这些组件也不一定只是单一的js，css，html，也不一定是其中某一个或者两个混合的，而是由一个组件的各个单元（html，css，js，png等）之间相互构成的。
当在你修改维护某个组件时，依赖的目录层级链过多，维护的地方往往也会比较多。所以将html，js，css，png混合单元组件化时，同时维护和开发时更加方便，就近维护，
迁移共用组件时任意整个目录删除或者替换，提高开发效率。所以将上面类似scss目录融入后，目录如下：

```
m-douyu
 -dist // 构建输出目录
 -mock // 模拟数据
 -src  // 开发目录
 	-components	// 组件
 		-base
 		-abstracts
 		-header
 			-header.js
 			-header.tmpl.js 	// 使用es6简单封装的html模版
 			-header.scss
 		-live
 		-load
 		-vendors
 	-images	// 图片资源
 	-views // 页面
package.json
README.md
webpack.config.js // webpack配置文件
```

### 核心功能

##### webpack全局引入zepto，swiper等第三方扩展

由于webpack是以模块化的格式来将多个javascript文件打包成一个文件，并且支持CommonJS和AMD格式。当我们使用第三方的扩展库不支持CommonJS和AMD的规范时，webpack是无法转义识别的。
在该项目中，引用第三方的swiper是支持的，可以直接使用：
```
import swiper from 'swiper';
```
zepto也有支持CommonJS规范的(可以去[npmjs](https://www.npmjs.com/)上查找)，推荐使用webpack-zepto：
```
$ npm install webpack-zepto --save-dev
```
然后在js中引用
```
import zepto from 'webpack-zepto';
```
但是往往你因为业务需求，不需要全量的zepto，需要自己组装zepto核心模块时，或者第三方库实在不支持CommonJS的情况下，
这个时候就需要使用到webpack的[shimming modules](http://webpack.github.io/docs/shimming-modules.html)。
在该项目中使用到的是exports-loader:
```
$ npm install exports-loader --save-dev
```
然后在index.js中引用
```
import $ from 'exports?$!zepto';	// 将zepto作为$全局导出，此时在js中即可以使用$。
```
上面`exports?$!zepto`中的zepto是webpack配置的别名，方面统一管理，在webpack.config.js中：
```
resolve: {
	// 别名，可以直接使用别名来代表设定的路径以及其他
    alias: {
        zepto: path.join(__dirname, './src/components/vendors/zepto.min.js'),
    }
}
```

##### scss、css和webpack

如下图：

![ddd](http://webpack.github.io/assets/what-is-webpack.png)

由于webpack是将多个javascript文件打包成一个文件，它的一切入口皆是js文件，所以所有的css文件应该在你页面所依赖的js中作为某一个模块导入。
例如在index.js中：
```
import './index.scss';
```
在webpack build的时候，会使用css-loader，postcss-loader，sass-loader进行预编译，使用postcss-loader作自动补充css前缀，在编译后，
js会将css stylesheets内联写入html head中，如下:
```
<head>
 	<title> Demo </title>
	<style type="text/css">
		html {}
		...
	</style>
 </head>
```

如果希望以外联引用文件的形式引入css，需要使用extract-text-webpack-plugin：
```
$ npm install extract-text-webpack-plugin --save-dev
```
然后在webpack.config.js中使用：
```
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module: {
	loaders: [
 		{ test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!postcss!sass') }
	]
},

plugins: [
 	new ExtractTextPlugin('[name].min.css')
]
```

##### 封装tap和click事件(event/tap.js)

移动端开发，点击事件使用zepto tap事件(比click少300ms延迟)，但是在PC上该事件是无效的，所以我们做一个简单的封装，在移动端使用tap，非移动端使用click事件。
```
const UA = window.navigator.userAgent;
let tap = 'click';

if (/ipad|iphone|android/i.test(UA)) {
	tap = 'tap';
}

export default tap;
```

##### webpack增加文件hash

使用HtmlWebpackPlugin编译输出html文件，可以增加hash配置。也可在output参数中配置(chunkhash或者hash)。

##### 列表页模版

为了避免在js中拼接字符串，引用了js模版的概念，在该项目中我们使用了es6的模版字符串做了一个简单模版。
用反引号标识(`)，将变量名写在${}中。

### 结语
在该项目中还使用到了ES6的module，class，promise等特性，后续会着重优化性能，比如webpack打包的大小，字体图标库，使用更轻量的轮播插件，以及试验webp在移动端的场景。

### Done