const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.png$/,
        loader: 'file-loader',
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
  performance: {
      hints: false,
      maxEntrypointSize: 51200,
      maxAssetSize: 51200
  }
};