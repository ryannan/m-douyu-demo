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

