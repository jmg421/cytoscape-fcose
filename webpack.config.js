const path = require('path');

const fcoseConfig = {
  // Entry for the FCose plugin (UMD bundle)
  entry: './src/index.js',
  output: {
    filename: 'cytoscape-fcose.bundle.js',
    path: path.resolve(__dirname, 'static/js'),
    // Expose the registration function globally under the variable "fcose"
    library: 'fcose',
    libraryTarget: 'umd',
    // Ensure that the default export is assigned directly to "fcose"
    libraryExport: 'default',
    // This ensures compatibility in Node, AMD, and browser globals
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { 
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  mode: 'development' // Change to "production" when deploying
};

const demoConfig = {
  // Entry for the demo application code
  entry: './demo/main.js',
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, 'static/js')
  },
  externals: {
    // This tells Webpack that "cytoscape" should be available as a global variable at runtime
    cytoscape: 'cytoscape'
  },
  // Add a resolve alias so that imports for 'cytoscape-fcose' use our local source file.
  resolve: {
    alias: {
      'cytoscape-fcose': path.resolve(__dirname, 'src/index.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { 
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  mode: 'development'
};

module.exports = [fcoseConfig, demoConfig]; 