const path = require('path')
//我们在package.json中设置的环境变量（可多个），都存放在process.env中
const isDev=process.env.NODE_ENV==='development'
const VueLoaderPlugin=require('vue-loader/lib/plugin')
const HTMLPlugin=require('html-webpack-plugin')
const webpack=require('webpack')

const config={
    target:'web',  //webpack编译目标为web平台
    //production和development，开发环境与产品环境
    mode:'development',
    //打包的入口文件，值是一个路径
    //_dirname指当前文件在硬盘中的绝对路径
    entry:path.join(__dirname,'src/index.js'),
    //打包的输出配置项
    output : {
        //publicPath规定所有已经解析的文件目录，url相对于index.html
        //publicPath对于打包路径不会有任何影响，如果不设置，则有可能会导致静态资源，如图片找不到的情况
        // publicPath:'',
        //输出的js文件名
        filename:'bundle.js',
        //输出文件的目标目录，必须是绝对路径。
        //很多资料是path:path.resolve(__dirname,'dist')，resolve表示绝对路径，join表示可多个参数合成一个目录
        path:path.join(__dirname,'dist'),
        
    },
    //module的配置如何处理模块
    module:{
        //rules 配置模块的读取和解析规则， 通常用来配置loader， 其类型是一个数组， 数组里每一项都描述了如何去处理部分文件。
        //配置一项rules大致通过以下方式：
        //1. 条件匹配： 通过test、include、exclude三个配置来命中Loader要应用的规则文件。优先级exclude > include > test
        //2. 应用规则： 对选中后的文件通过use配置项来应用loader，可以应用一个loader或者按照从后往前的顺序应用一组loader。同时还可以分别给loader传入参数。
        //3. 重置顺序： 一组loader的执行顺序默认是从有道左执行，通过exforce选项可以让其中一个loader的执行顺序放到最前或者是最后。
        rules:[
            {
                test:/\.vue$/,
                loader:'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },
            {
                test:/\.styl(us)?$/,       //css预处理器
                use:[
                    'style-loader',
                    'css-loader',
                    {
                        loader:'postcss-loader',
                        options:{
                            sourceMap:true,
                        }
                    },
                    'stylus-loader'   //处理styl文件，处理成css文件
                ]
            },
            {
                test:/\.(jpg|png|jpeg)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:1024,
                            name:'img/[name]-aaa.[ext]'   //输出的图片名
                        }

                }
            ]
            },
        ]
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV: isDev ? '"development"':'"production"'
            }
        }),
        // new VueLoaderPlugin(),
        new HTMLPlugin(),
        new VueLoaderPlugin()

    ]

}

if(isDev){
    //调试配置
    config.devtool='#cheap-module-eval-source-map'
    //webpack2.0之后的版本使用
  config.devServer={
      port:8000,
      host:'0.0.0.0',
      //如果有错误可直接显示在网页上
      overlay:{
          errors:true
      },
      //热加载：只更新改动部分，不用更新全网页
      hot:true
  }
  config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
  )
}

module.exports=config