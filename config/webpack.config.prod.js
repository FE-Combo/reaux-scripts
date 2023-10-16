const path = require("path");
const webpack = require("webpack");
const HTMLPlugin = require("html-webpack-plugin");
const ForkTSCheckerPlugin = require("fork-ts-checker-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { appDirectory, appEntry, appDist, appUtils, appComponents, appModules, appHtml } = require("./paths");

const config = [
  {
    mode: "production",
    bail: true,
    entry: {
      index: appEntry,
    },
    output: {
      path: appDist,
      filename: "js/[name].[chunkhash:8].js",
      publicPath: "/",
      chunkFilename: "js/[name].[chunkhash:8].bundle.js",
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
    optimization: {
      splitChunks: {
        cacheGroups: {
          reactVendor: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|reaux|reaux-dom|redux|react-redux)[\\/]/,
            name: "vendor-react",
            chunks: "all",
          },
          corejsVendor: {
            test: /[\\/]node_modules[\\/](core-js)[\\/]/,
            name: "vendor-corejs",
            chunks: "all",
          },
          antdVendor: {
            test: /[\\/]node_modules[\\/](antd)[\\/]/,
            name: "vendor-antd",
            chunks: "all",
          },
          rcVendor: {
            test: /[\\/]node_modules[\\/](rc-(.*))[\\/]/,
            name: "vendor-rc",
            chunks: "all",
          },
          antDesignVendor: {
            test: /[\\/]node_modules[\\/](\@ant-design)[\\/]/,
            name: "vendor-ant-design",
            chunks: "all",
          },
          babelVendor: {
            test: /[\\/]node_modules[\\/](\@babel)[\\/]/,
            name: "vendor-babel",
            chunks: "all",
          },
        },
      },
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    performance: {
      maxAssetSize: 2200 * 1000,
      maxEntrypointSize: 7164 * 1000,
    },
    module: {
      rules: [
        {
          test: /(\.js|\.jsx|\.ts|\.tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [["postcss-preset-env", {}]],
                },
              },
            },
          ],
        },
        {
          test: /\.less$/i,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [["postcss-preset-env", {}]],
                },
              },
            },
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
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: "[path][name]__[local]__[sha256:hash:base64:5]",
                },
              },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [["postcss-preset-env", {}]],
                },
              },
            },
            "sass-loader",
          ],
        },
        {
          test: /\.(png|jpg|jpeg|svg|webp|gif|ttf|woff)$/i,
          type: "asset/resource",
          generator: {
            filename: "static/[path][name].[contenthash].[ext]",
          },
        },
        {
          test: /\.(png|jpg|jpeg|svg|webp|gif|ttf|woff)$/i,
          dependency: { not: ["url"] },
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 1024,
                name: "static/[path][name].[contenthash].[ext]",
              },
            },
          ],
          type: "javascript/auto",
        },
        {
          test: /\.(mp3|mp4)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[path][name].[contenthash].[ext]",
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HTMLPlugin({
        template: appHtml,
      }),
      new webpack.ProgressPlugin(),
      new MiniCssExtractPlugin({
        filename: "css/[name].[chunkhash:8].css",
        chunkFilename: "css/[name].[chunkhash:8].bundle.css",
      }),
      new webpack.DefinePlugin({
        API_PREFIX: JSON.stringify("/api"),
      }),
      new ForkTSCheckerPlugin(),
      process.env.ANALYZE === "true" ? new BundleAnalyzerPlugin() : null,
    ].filter((_) => _),
  },
];

module.exports = config;
