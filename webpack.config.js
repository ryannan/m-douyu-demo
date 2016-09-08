var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 入口文件地址
    entry: {
        index: './src/views/index/index',
        list: './src/views/list/list'
    },

    // 输出文件
    output: {
        // 文件地址，使用绝对路径形式
        path: path.join(__dirname, './dist'),
        // [name]根据webpack提供的根据路口文件自动生成的名字
        // filename: '[name].[chunkhash:8].min.js',
        filename: '[name].min.js',
        // 公共文件生成的地址
        publicPath: '/dist/'
    },

    // loader加载器
    module: {
        loaders: [
            // 转化ES6语法
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
            // 编译css并自动添加css前缀
            { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css!postcss') },
            // less文件编译
            { test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css!postcss!less') },
            // scss文件编译
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!postcss!sass') },
            // 图片转化，小于8k自动转化成base64编码
            { test: /\.(png|jpg|gif)$/, loader: 'url?limit=81920&name=images/[name].[ext]'},
            // 图标字体
            { test: /\.(ttf|eot|svg|woff)$/, loader: 'file?limit=10000&name=iconfont/[name].[ext]'}
    ]},

    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },

    postcss: [autoprefixer, precss],

    resolve: {
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['', '.js', '.vue'],

        // 别名，可以直接使用别名来代表设定的路径以及其他
        alias: {
            components: path.join(__dirname, './src/components'),
            zepto: path.join(__dirname, './src/components/vendors/zepto.min.js'),
            swiper: path.join(__dirname, './src/components/vendors/swiper.min.js'),
        }
    },

    // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
    plugins: [
        new ExtractTextPlugin('[name].min.css'),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            except: ['$super', '$', 'exports', 'require']
        }),

        // 根据模板插入css/js等生成最终HTML
        new HtmlWebpackPlugin({                        
            // favicon:'./src/images/favicon.ico',
            // 生成的html存放路径，相对于 path
            filename: './pages/index.html', 
            // html模板路径
            template: './src/views/index/index.html',
            // 告诉插件要引用entry里面的哪几个入口
            chunks: ['index'],
            // 允许插件修改哪些内容，包括head与body 
            inject: 'body',
            // 为静态资源生成hash值
            hash: true,
            // 压缩HTML文件
            minify: {
                // 移除HTML中的注释
                removeComments: true,    
                // 删除空白符与换行符
                collapseWhitespace: false
            },
        }),

        new HtmlWebpackPlugin({                        
            // favicon:'./src/images/favicon.ico',
            filename: './pages/list.html', 
            template: './src/views/list/list.html',
            chunks: ['list'],
            inject: 'body',
            hash: true,
            minify: {
                removeComments: true,    
                collapseWhitespace: false
            },
        }),
    ],

    devtool: '#source-map'
}
