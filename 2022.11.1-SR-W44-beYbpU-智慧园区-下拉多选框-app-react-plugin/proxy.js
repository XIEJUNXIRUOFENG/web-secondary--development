module.exports = {
  "/api": {
    target: "http://10.15.110.24:18080/",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  },
};
