const path = require('path');
const webpack = require('webpack');
module.exports = (env) => {
  return {
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
        production: true,
        TURN_DOMAIN: JSON.stringify(env.TURN_DOMAIN.toString().replace(/\\r/g, "")), //direplace karena perbedaan OS membaca file pada .env file, 
        TURN_PORT: JSON.stringify(env.TURN_PORT.toString().replace(/\\r/g, "")),
        TURN_PORT_TLS: JSON.stringify(env.TURN_PORT_TLS.toString().replace(/\\r/g, "")),
        TURN_USERNAME: JSON.stringify(env.TURN_USERNAME.toString().replace(/\\r/g, "")),
        TURN_PASSWORD: JSON.stringify(env.TURN_PASSWORD.toString().replace(/\\r/g, "")),
        WS_DOMAIN: JSON.stringify(env.WEBSOCKET_DOMAIN.toString().replace(/\\r/g, "")),
        WS_PORT: JSON.stringify(env.WEBSOCKET_PORT.toString().replace(/\\r/g, "")),
      })
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'public/dist'),
    },
    mode: "development" // sementara development karena production tidak mau compile bila typescript ada yg error
  };
}