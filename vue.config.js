module.exports = {
  outputDir: 'dist',
  configureWebpack: (webPackConfig) => {
        webPackConfig.resolve= {
            fallback: {
              fs: false
            }
          }
    }
}