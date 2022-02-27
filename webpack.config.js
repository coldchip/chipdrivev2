const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

var cssLookup = [];

module.exports = {
  mode: 'development',
  devtool: false,
  performance: {
    hints: false
  },
  entry: ['./public/js/index.jsx'],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ["@babel/plugin-transform-runtime"]
          }
        }
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          options: {
            modules: {
              getLocalIdent: (context, localIdentName, localName, options) => {
                var exclude = ["popup-overlay", "popup-content", "popup-arrow"];

                if(!exclude.includes(localName)) {

                  if(!cssLookup.includes(localName)) {
                    cssLookup.push(localName);
                  }

                  var index = cssLookup.indexOf(localName);

                  let prefix = ''
                  while(index >= 0) {
                    prefix = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[index % 62] + prefix
                    index = Math.floor(index / 62) - 1
                  }

                  return "cd-" + prefix;
                } else {
                  return localName;
                }
              }
            },
          }
        }, "sass-loader"]
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
        test: /\.(woff2|woff|ttf|otf|eot)$/i,
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
    ]
  },
  output: {
    path: __dirname + '/bin/',
    filename: 'chipdrive.[contenthash:16].js',
    chunkFilename: 'chipdrive.[contenthash:16].js',
    publicPath: "/"
  },
  plugins: [
    new ESLintPlugin({
      files: 'public/js/**/*.jsx'
    }),
    new MiniCssExtractPlugin({
      filename: 'chipdrive.[contenthash:16].css',
      chunkFilename: 'chipdrive.[contenthash:16].css'
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/img/favicon.ico'
    })
  ]
}