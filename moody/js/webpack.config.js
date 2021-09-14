/* global __dirname, require, module*/

const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2
const pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let plugins = [
  new HtmlWebpackPlugin({
    template: './index.html',
  }),
];
let libraryName = pkg.name;

let outputFile, mode;

if (env === 'build') {
  mode = 'production';
  outputFile = `${libraryName}.min.js`;
} else {
  mode = 'development';
  outputFile = `${libraryName}.js`;
}

const config = {
  mode: mode,
  entry: ['babel-polyfill', `${__dirname}/src/index.js`],
  devtool: 'inline-source-map',
  output: {
    path: `${__dirname}/dist`,
    filename: outputFile,
    // library: libraryName,
    // libraryTarget: 'umd',
    // umdNamedDefine: true,
    // globalObject: "typeof self !== 'undefined' ? self : this"
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
      },
      // ,
      // {
      //   test: /(\.jsx|\.js)$/,
      //   loader: 'eslint-loader',
      //   exclude: /node_modules/
      // }
    ],
  },
  plugins,
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js'],
  },
};

module.exports = config;
