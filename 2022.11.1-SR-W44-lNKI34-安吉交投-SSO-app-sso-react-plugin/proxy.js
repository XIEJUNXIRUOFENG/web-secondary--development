module.exports = {
  "/api": {
    target: "http://10.15.111.9:12254/",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  },
};
