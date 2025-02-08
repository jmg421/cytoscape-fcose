const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: './src/index.js', // fcose layout entry file
  output: {
    path: path.resolve(__dirname, 'static/js'),
    filename: 'cytoscape-fcose.bundle.js',
    library: 'cytoscapeFcose',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'this',
  },
  // Bundle all dependencies by leaving externals empty
  externals: {},
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader', // Ensure babel-loader is correctly installed
      },
    ],
  },
}; 