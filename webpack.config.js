const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: false,
  performance: {
    hints: false
  },
  entry: ["@babel/polyfill", './public/js/index.jsx'],
  module: {
    rules: [
      {
        test: /\.jsx$/i,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|tiff)$/i,
        use: [{
          loader: "file-loader?name=img.[contenthash].[ext]"
        }]
      },
      {
        test: /\.(woff|ttf|otf|eot|woff2|svg)$/i,
        use: [{
          loader: "file-loader?name=font.[contenthash].[ext]"
        }]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      minSize: 350000,
      maxSize: 350000,
    },
  },
  output: {
    path: __dirname + '/bin/',
    filename: 'chipdrive.[contenthash:16].js',
    chunkFilename: 'chipdrive.[contenthash:16].js',
    publicPath: "/"
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'chipdrive.[contenthash:16].css',
      chunkFilename: 'chipdrive.[contenthash:16].css'
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
}