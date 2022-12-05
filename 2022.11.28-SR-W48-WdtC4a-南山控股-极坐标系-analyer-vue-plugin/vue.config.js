module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: {
      "/api": {
        //此处填写调试的地址
        target: "http://10.15.111.9:12245",
        logLevel: "debug",
        changeOrigin: true,
        pathRewrite: {
          "/api": ""
        }
      }
    }
  },
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === "production", config => {
      config.optimization.splitChunks(false);
      config.plugins.delete("extract-css");

      ["postcss", "scss", "css", "sass", "less", "stylus"].forEach(element => {
        ["vue-modules", "vue", "normal-modules", "normal"].forEach(m => {
          config.module
                .rule(element)
                .oneOf(m)
                .uses.delete("extract-css-loader")
                .end()
                .use("vue-style-loader")
                .loader("vue-style-loader")
                .options({
                  sourceMap: false,
                  shadowMode: false
                })
                .before("css-loader");
        });
      });
    });
    //用来打包vue项目，element-ui的字体文件
    config.module
          .rule("fonts")
          .use("url-loader")
          .loader("url-loader")
          .tap(options => Object.assign(options, { limit: 2 * 100 * 1024 * 1024 }));
    //用来打包图片文件
    config.module
          .rule("images")
          .use("url-loader")
          .loader("url-loader")
          .tap(options => Object.assign(options, { limit: 2 * 100 * 1024 * 1024 }));
  }
};
