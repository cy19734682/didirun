module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'hack': `true; @import "${require('path').resolve(process.cwd(),'./src').replace(/\\/g,'\\\\')}/uni.less";`
        }
      }
    }
  }
}