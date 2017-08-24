const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const fs=require('fs');

const config = {
  //devtool: "source-map", // or "inline-source-map"
  entry: getEntry('app/entry',{
    commons:['n-zepto']
  }),
  output: {                                       // 定义出口目录
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
    publicPath: 'http://localhost:8081/' // html引用路径
  },
  resolve: {                                      // resolve 指定可以被 import 的文件后缀
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.js|jsx$/, // 检测哪些文件需要此loader，是一个正则表达式，用正则来匹配文件路径，这段意思是匹配 js 或者 jsx
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel']  // 加载模块 "babel" 是 "babel-loader" 的缩写
      },
      {
        test: /\.(css|less)$/,
        loader: ExtractTextPlugin.extract("style", "css?sourceMap", "less?sourceMap")
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url?limit=10000&name=imgs/[hash:8].[name].[ext]',
          'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
    }),
    new ExtractTextPlugin('css/[name].css'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      chunks: ['commons','index'],//只加载项
      //excludeChunks: ['index'],//排队项
      alwaysWriteToDisk: true,
      chunks:['commons','app','index'],
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/index.html'),
      filename: 'index.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','index'],//只加载项
      //excludeChunks: ['index'],//排队项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/index.html'),
      filename: 'index.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','list'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/list.html'),
      filename: 'list.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
     new HtmlWebpackPlugin({
      chunks: ['commons','gift-list'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/gift-list.html'),
      filename: 'gift-list.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
     new HtmlWebpackPlugin({
      chunks: ['commons','search'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/search.html'),
      filename: 'search.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
     new HtmlWebpackPlugin({
      chunks: ['commons','product-list'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/product-list.html'),
      filename: 'product-list.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
     new HtmlWebpackPlugin({
      chunks: ['commons','children-list'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/children-list.html'),
      filename: 'children-list.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
     new HtmlWebpackPlugin({
      chunks: ['commons','custom-list'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/custom-list.html'),
      filename: 'custom-list.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
     new HtmlWebpackPlugin({
      chunks: ['commons','find-index'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/find-index.html'),
      filename: 'find-index.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
      new HtmlWebpackPlugin({
      chunks: ['commons','find-search'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/find-search.html'),
      filename: 'find-search.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
      new HtmlWebpackPlugin({
      chunks: ['commons','personal-center'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/personal-center.html'),
      filename: 'personal-center.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new OpenBrowserPlugin({ url: 'http://localhost:8081/' }),
    new DashboardPlugin()
  ]
};

module.exports = config;

//此为遍历入口文件，节省手动添加
function getEntry(srcDir,jsonCommons) {
  var jsPath = path.resolve(srcDir);
  var dirs = fs.readdirSync(jsPath);
  var matchs = [], files = {};
  dirs.forEach(function (item) {
    matchs = item.match(/(.+)\.js$/);
    if (matchs) {
      files[matchs[1]] = [
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:8081',
        path.resolve(srcDir, item)];
    }
  });
  for(var name in jsonCommons){
    files[name]=jsonCommons[name];
  }
  return files;
}