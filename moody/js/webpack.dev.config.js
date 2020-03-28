const config = require("./webpack.config");
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
let plugins = [
  // new BundleAnalyzerPlugin(),
  new HtmlWebpackPlugin({
    template: "./index.html"
  })
];

module.exports = Object.assign(config, {
  entry: ['babel-polyfill', `${__dirname}/src/index.js`],
  plugins,
  node: {
    fs: "empty"
  },
  devServer: {
    hot: true,
    inline: true,
    clientLogLevel: "error",
    stats: {
      colors: true
    },
    contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'assets')],
    host: "0.0.0.0",
    port: 4500
  }
});

console.log(path.join(__dirname, 'assets'));
