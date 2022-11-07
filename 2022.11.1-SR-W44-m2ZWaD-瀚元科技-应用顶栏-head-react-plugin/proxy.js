module.exports = {
  "/api": {
    // target: "http://10.15.112.12:48080/",
    target: "http://10.15.111.6:8088/",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  },
};
