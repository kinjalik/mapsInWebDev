const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

console.log('Webpack Started');
module.exports = {
  devServer: {
    stats: 'errors-only',

  },
  mode: 'production',
  entry: {
    vendor: './src/js/vendor.js',
    ufa: ['./src/js/ufa.js', './src/scss/ufa.scss'],
    styles: [
      './src/js/fa.js',
      './src/scss/vendor.scss',
    ],
  },
  output: {
    path: path.resolve(__dirname, '../docs'),
    filename: 'js/[name].js',
    sourceMapFilename: '[file].map',
    library: 'bundle_[name]',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
            publicPath: '../',
          },
        }],
      },
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, 'src/scss'),
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true,
              minimize: true,
              url: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
          ],
        }),
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: { minimize: true },
        }],
      },
    ],
  },
  optimization: {
    minimize: false,
    runtimeChunk: {
      name: 'tools',
    },
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /\.js$/,
          chunks: 'all',
          minChunks: 2,
          name: 'tools',
          enforce: true,
        },
      },
    },
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(['../docs'], {
      allowExternal: true,
    }),
    new ExtractTextPlugin({
      filename: './css/[name].css',
      allChunks: true,
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
      inject: false,
    }),
    new HtmlWebPackPlugin({
      template: './src/ufa.html',
      filename: './ufa.html',
      chunks: ['tools','vendor', 'styles', 'ufa'],
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'src/img/'),
      to: path.resolve(__dirname, '../docs/img/'),
      toType: 'dir'
    }]),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      optipng: {
        optimizationLevel: 9,
      },
    }),
    new CopyWebpackPlugin([
      {
        from: './src/maps/',
        to: './maps/',
        force: true,
      },
      {
        from: './src/json/',
        to: './json/',
        force: true,
      },
    ]),
  ],
};