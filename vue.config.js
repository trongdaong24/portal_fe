// vue.config.js
const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  //publicPath: process.env.NODE_ENV === "production" ? "/" : "/",

  devServer: {
    proxy: "http://tracking-dev.night-wolf.io",
    public: "http://0.0.0.0",
    disableHostCheck: true
  },

  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
      //new BundleAnalyzerPlugin({ analyzerMode: 'static' })
    ]
  },

  pluginOptions: {
    quasar: {
      importStrategy: "manual",
      rtlSupport: false,
      treeShake: true
    }
  },

  transpileDependencies: ["quasar"],
  runtimeCompiler: true
};
