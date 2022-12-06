module.exports = {
   "/api": {
      target: "http://60.208.60.245:18868/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
   },
};
