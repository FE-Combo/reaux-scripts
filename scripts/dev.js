const path = require("path");
const webpack = require("webpack");
const webpackConfig = require("../config/webpack.config.dev");
const DevServer = require("webpack-dev-server");
const {currentWorkingDirectory, } = require("node-wiz");
const packageJson = require(path.join(currentWorkingDirectory, "package.json"));
const Config = require('webpack-chain');
const config = new Config();

const defaultDevServerOptions = {
  port: "auto",
  historyApiFallback: true,
  client: {},
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  onListening: function (devServer) {
    if(! process.env.ASSET_PREFIX) {
      // 根据端口号动态设置 publicPath
      const port = devServer.server.address().port;
      const updatedPublicPath = `http://localhost:${port}/`;
      const output = config.output;
      output.publicPath(updatedPublicPath);
    }
  },
}
const devServerOptions = packageJson.devServerOptions || {};

function devServer(compiler) {
  return new DevServer(
    {
      ...defaultDevServerOptions,
      ...devServerOptions
    },
    compiler
  );
}

function start() {
  const compiler = webpack(webpackConfig);
  const server = devServer(compiler);
  server.startCallback((error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
  });

  ["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, () => {
      server.close();
      process.exit();
    });
  });
}

start();
