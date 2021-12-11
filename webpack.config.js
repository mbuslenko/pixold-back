const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
	target: 'node',
  mode: 'production',
  entry: './src/main.ts',
  devtool: 'inline-source-map',  
	externals: [webpackNodeExternals()],
	optimization: {
		minimize: false,
	},
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
