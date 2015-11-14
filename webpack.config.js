var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: './src/main.js',
  output: {
    path: path.join(__dirname, 'build'),
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