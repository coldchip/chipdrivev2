const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: false,
  performance: {
    hints: false
  },
  devtool: false,
  entry: ["@babel/polyfill", './public/js/index.jsx'],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
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
        use: [MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          options: {
            modules: {
              getLocalIdent: (context, localIdentName, localName, options) => {
                var exclude = ["popup-overlay", "popup-content", "popup-arrow"];

                if(!exclude.includes(localName)) {

                  var seed = 0;
                  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
                  for (let i = 0, ch; i < localName.length; i++) {
                      ch = localName.charCodeAt(i);
                      h1 = Math.imul(h1 ^ ch, 2654435761);
                      h2 = Math.imul(h2 ^ ch, 1597334677);
                  }
                  h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
                  h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
                  var hash = 4294967296 * (2097151 & h2) + (h1>>>0);

                  return "css-" + Buffer
                  .from(hash.toString())
                  .toString('base64')
                  .replace(/\W/g, '')
                  .toLowerCase();

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