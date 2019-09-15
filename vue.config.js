// 导入两个webpack插件，负责生成服务端和客户端bundle
const VueSSRServerPlugin=require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin=require('vue-server-renderer/client-plugin')
// 优化策略
const nodeExternals=require('webpack-node-externals')
const merge=require('lodash.merge')
// 根据环境变量WEBPACK_TARGET做出响应输出
const TARGET_NODE=process.env.WEBPACK_TARGET==='node'
const target=TARGET_NODE ? 'server' : 'client'

module.exports={
  css:{
    extract:false
  },
  outputDir:'./dist/'+target,
  configureWebpack:()=>({
    // 将entry指向应用的server、client
    entry:`./src/entry-${target}.js`,
    // 对bundle renderer 提供 source map 支持
    devtool:'source-map',
    // 这里允许webpack 以 node 使用方式处理动态导入（dynamic import）
    // 并且还会在编译vue组件时告知 vue-loader 输送面向服务器代码（server-oriented code）
    target:TARGET_NODE ? 'node' : 'web',
    // mock node中一些全局变量
    node:TARGET_NODE ? undefined : false,
    output:{
      // 此处告知server bundle使用node风格导出模块
      libraryTarget:TARGET_NODE ? 'commonjs2' : undefined
    },
    // 外置应用程序依赖模块。可以使服务器构建速度更快，生成较小的bundle文件
    externals:TARGET_NODE
      ? nodeExternals({
        // 不要外置化 webpack 需要处理的模块
        // 可以在这里添加更多的文件类型。例如，未处理的 *.vue原始文件
        // 你还应该将修改 global （例如polyfill）的依赖模块列入白名单
        whitelist:[/\.css$/]
      })
      : undefined,
    optimization:{
      splitChunks:undefined
    },
    // 这是将服务器的整个输出构建为单个json文件的插件
    // 服务器端默认文件名为 vue-ssr-server-bundle.json
    plugins:[TARGET_NODE ? new VueSSRServerPlugin : new VueSSRClientPlugin]
  }),
  chainWebpack:config=>{
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options=>{
        merge(options,{
          optimizeSSR:false
        })
      })
  }
}