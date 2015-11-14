var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: __dirname + '/src/main.js',

  output: {
    path: __dirname + '/build',
    filename: 'stegit-chat.min.js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('shared.js'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],

  devtool: 'inline-source-map',

  stats: { colors: true, reasons: true },

  resolve: {
    extensions: ['', '.js']
  },

  modulesDirectories: ["node_modules"],

  module: {
    loaders: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules|temp|media|build)/,
        loader: 'babel-loader'
      }
    ]
  }
};