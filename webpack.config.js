const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

console.log('IS DEV:', isDev);

module.exports = {
  // Главная папка
  context: path.resolve(__dirname, 'src'),

  // Входные файлы
  entry: {
    main: './js/index.js'
  },

  // Выходной файл
  output: {
    filename: './js/[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  // Пути до блоков и элементов
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@scss': path.resolve(__dirname, 'src/scss'),
      '@blocks': path.resolve(__dirname, 'src/blocks'),
    }
  },

  // Source maps для удобства отладки
  devtool: "source-map",

  module: {
    rules: [
      // Транспилируем js с babel
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '/js'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          }
        }
      },

      // Подключаем css
      {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
      },

      // Компилируем SCSS в CSS
      {
        test: /\.scss$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: isDev,
            reloadAll: true,
            publicPath: '../'
          }
        },
        'css-loader', // translates CSS into CommonJS
        'postcss-loader', // parse CSS and add vendor prefixes to CSS rules
        'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ]
      },

      // Подключаем шрифты из css
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: './fonts/[name].[ext]'
        }
      },

      // Подключаем картинки из css
      {
        test: /\.(svg|png|jpg|jpeg|webp)$/,
        type: 'asset/resource',
        generator: {
          filename: './static/[name].[ext]'
        }
      },
    ],
  },

  // Оптимизайия
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },

  plugins: [
    // Подключаем файл html, стили и скрипты встроятся автоматически
    new HtmlWebpackPlugin({
      title: 'name_site',
      template: '/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: isProd,
      }
    }),

    // Кладем стили в отдельный файлик
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),

    // Копируем картинки
    new CopyWebpackPlugin([
      { from: './blocks/name_block/img/', to: 'static' }
    ]),

    // Очистка старых файлов
    new CleanWebpackPlugin()
  ]
};
