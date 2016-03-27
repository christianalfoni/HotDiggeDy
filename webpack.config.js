var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',
  resolve: {
    alias: {
      'HotDiggeDy': path.resolve('src', 'index.js')
    }
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        "presets": ["es2015", "stage-0"],
        "plugins": [
          ["transform-react-jsx", { "pragma": "HotDiggeDy.DOM" }]
        ]
      }
    }]
  }
};
