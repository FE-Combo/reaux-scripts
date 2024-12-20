const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const HTMLPlugin = require("html-webpack-plugin");
const ForkTSCheckerPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { appDirectory, appEntry, appUtils, appComponents, appModules, appHtml } = require("./paths");

const useTypeScript = fs.existsSync(path.join("tsconfig.json"));

const config = {
  target: "web",
  mode: "development",
  entry: [appEntry],
  output: {
    publicPath: process.env.ASSET_PREFIX || "/",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".less", ".scss", ".sass"],
    modules: [path.join(appDirectory, "/"), "node_modules"],
    alias: {
      utils: appUtils,
      components: appComponents,
      modules: appModules,
    },
  },
  devtool: "eval-cheap-module-source-map",
  module: {
    rules: [
      {
        test: /(\.js|\.jsx|\.ts|\.tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react", useTypeScript && "@babel/preset-typescript"].filter(_ => _),
            plugins: [
              require.resolve("react-refresh/babel"),
              "@babel/plugin-transform-runtime",
              "@babel/plugin-transform-react-jsx",
              useTypeScript && "@babel/plugin-transform-typescript",
              [
                "@babel/plugin-proposal-decorators",
                {
                  legacy: true,
                },
              ],
            ].filter(_ => _),
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/i,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(scss|sass)$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[path][name]__[local]__[sha256:hash:base64:5]",
              },
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpg|jpeg|webp|gif|ttf|woff)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/media/[name].[contenthash].[ext]",
        },
      },
      {
        test: /\.(png|jpg|jpeg|webp|gif|ttf|woff)$/i,
        dependency: { not: ["url"] },
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1024,
              name: "static/media/[name].[contenthash].[ext]",
            },
          },
        ],
        type: "javascript/auto",
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: require.resolve("@svgr/webpack"),
            options: {
              prettier: false,
              svgo: false,
              svgoConfig: {
                plugins: [{ removeViewBox: false }],
              },
              titleProp: true,
              ref: true,
            },
          },
          {
            loader: require.resolve("file-loader"),
            options: {
              name: "static/media/[name].[contenthash].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(mp3|mp4)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "static/media/[name].[contenthash].[ext]",
            },
          },
        ],
      },
      { test: /\.m?js/, resolve: { fullySpecified: false } },
    ],
  },
  plugins: [
    new HTMLPlugin({
      template: appHtml,
    }),
    new webpack.ProgressPlugin(),
    new ReactRefreshWebpackPlugin(),
    useTypeScript ? new ForkTSCheckerPlugin() : null,
    new webpack.DefinePlugin({
      API_PREFIX: JSON.stringify("/api"),
      ENV: JSON.stringify(process.env),
    }),
  ],
};

module.exports = config;
