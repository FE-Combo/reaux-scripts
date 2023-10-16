const webpack = require("webpack");
const webpackConfig = require("./webpack.config.dev");
const DevServer = require("webpack-dev-server");

function devServer(compiler) {
  return new DevServer(
  {
    port: "auto",
    historyApiFallback: true,
    client: {},
    proxy: [
      {
          context: ["/api"],
          target: "http://192.168.1.1:8080",
          secure: false,
          pathRewrite:{"^/api": ""},
          changeOrigin: true,
      },
    ],
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  }, compiler);
}

function start() {
  const compiler = webpack(webpackConfig);
  const server = devServer(compiler);
  server.listen("auto", "0.0.0.0", error => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    return null;
  });

  ["SIGINT", "SIGTERM"].forEach(signal => {
    process.on(signal, () => {
      server.close();
      process.exit();
    });
  });
}

start();
