const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      production:false,
      TURN_DOMAIN: JSON.stringify(env.DEV_TURN_DOMAIN),
      TURN_PORT: JSON.stringify(env.DEV_TURN_PORT),
      TURN_USERNAME: JSON.stringify(env.DEV_TURN_USERNAME),
      TURN_PASSWORD: JSON.stringify(env.DEV_TURN_PASSWORD),
      WEBSOCKET_DOMAIN: JSON.stringify(env.DEV_WEBSOCKET_DOMAIN)
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist'),
  },
  mode: "development"
};