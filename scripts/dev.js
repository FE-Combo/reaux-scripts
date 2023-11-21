const path = require("path");
const webpack = require("webpack");
const webpackConfig = require("../config/webpack.config.dev");
const DevServer = require("webpack-dev-server");
const {currentWorkingDirectory, } = require("node-wiz");
const packageJson = require(path.join(currentWorkingDirectory, "package.json"));
const portfinder = require("portfinder");
const chalk = require("chalk");

const basePort = 8080;
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : basePort
portfinder.basePort = port;

try {
  portfinder.getPort(function (error, nextPort) {
    if (error) {
      console.error(error);
      return;
    }
    if (port !== nextPort) {
      process.env.PORT = nextPort + "";
      if(!process.env.ASSET_PREFIX) {
        webpackConfig.output.publicPath = webpackConfig.output.publicPath.replace("{port}", nextPort)
      }
      defaultDevServerOptions.port = nextPort;
      console.info(
        `${chalk.yellow(
          "warn"
        )} - Port ${port} is in use, trying ${nextPort} instead.`
      );
    }
    start();
  });
} catch (error) {
  console.error(error)
}

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
