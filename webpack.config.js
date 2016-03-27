var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        "presets": ["es2015", "stage-0"],
        "plugins": [
          ["transform-react-jsx", { "pragma": "Lib.DOM" }]
        ]
      }
    }]
  }
};
