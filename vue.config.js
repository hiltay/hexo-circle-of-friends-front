// vue.config.js
const name = "fcircle";
module.exports = {
  // 选项
  publicPath: './',
  outputDir: 'dist',
  runtimeCompiler:true,
  productionSourceMap:false,
  css:{
    extract:false
  },
  configureWebpack: {
    name: name,
    output: {
      // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
      filename: `[name].min.js`,
      chunkFilename: 'bundle.js', // bundle.js
    }
  },
  // devServer: {
  //   overlay: {
  //     warnings: false, //不显示警告
  //     errors: false //不显示错误
  //   }
  // },
  // lintOnSave: false //关闭eslint检查
}
