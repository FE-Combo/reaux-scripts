const path = require("path");
const webpack = require("webpack");
const webpackConfig = require("../config/webpack.config.dev");
const DevServer = require("webpack-dev-server");
const {currentWorkingDirectory, } = require("node-wiz");
const packageJson = require(path.join(currentWorkingDirectory, "package.json"));
const defaultDevServerOptions = {
  port: "auto",
  historyApiFallback: true,
  client: {},
  headers: {
    "Access-Control-Allow-Origin": "*",
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
