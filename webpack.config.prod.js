const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');//编译完自动打开浏览器
const ExtractTextPlugin = require("extract-text-webpack-plugin");//分离css
const HtmlWebpackPlugin = require('html-webpack-plugin');//引用html模板
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');//自动生成html
const fs=require('fs');
const config = {
  entry: getEntry('app/entry',{
    commons:['n-zepto']
  }),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/[name].bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.js|jsx$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel']
      },
      {
        test: /\.(css|less)$/,
        loader: ExtractTextPlugin.extract("style", "css!less")
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
      'process.env.NODE_ENV': JSON.stringify('production'),
      __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
    }),
    new ExtractTextPlugin('css/[name].css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      filename: "js/[name].js"
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      minimize: true
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
      chunks: ['commons','topic-list'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/topic-list.html'),
      filename: 'topic-list.html',
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
      new HtmlWebpackPlugin({
      chunks: ['commons','kind-gift'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/kind-gift.html'),
      filename: 'kind-gift.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
      new HtmlWebpackPlugin({
      chunks: ['commons','find-details'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/find-details.html'),
      filename: 'find-details.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
      new HtmlWebpackPlugin({
      chunks: ['commons','personal-process'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/personal-process.html'),
      filename: 'personal-process.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
      new HtmlWebpackPlugin({
      chunks: ['commons','personal-orders'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/personal-orders.html'),
      filename: 'personal-orders.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    //    new HtmlWebpackPlugin({
    //   chunks: ['commons','brand-story'],//只加载项
    //   alwaysWriteToDisk: true,
    //   template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/brand-story.html'),
    //   filename: 'brand-story.html',
    //   inject: true,
    //   cache:false,
    //   alwaysWriteToDisk: true
    // }),
       new HtmlWebpackPlugin({
      chunks: ['commons','custom-details'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/custom-details.html'),
      filename: 'custom-details.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
       new HtmlWebpackPlugin({
      chunks: ['commons','cart'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/cart.html'),
      filename: 'cart.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
       new HtmlWebpackPlugin({
      chunks: ['commons','ok-order'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/ok-order.html'),
      filename: 'ok-order.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
       new HtmlWebpackPlugin({
      chunks: ['commons','product-details'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/product-details.html'),
      filename: 'product-details.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
       new HtmlWebpackPlugin({
      chunks: ['commons','protocol'],//只加载项
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/protocol.html'),
      filename: 'protocol.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin()
  ]
};

module.exports = config;

function getEntry(srcDir,jsonCommons) {
  var jsPath = path.resolve(srcDir);
  var dirs = fs.readdirSync(jsPath);
  var matchs = [], files = {};
  dirs.forEach(function (item) {
    matchs = item.match(/(.+)\.js$/);
    if (matchs) {
      files[matchs[1]] = [
        path.resolve(srcDir, item)
      ];
    }
  });
  for(var name in jsonCommons){
    files[name]=jsonCommons[name];
  }
  return files;
}