var webpack = require('webpack')
  , path = require('path')
  , nib = require('nib')
  , HtmlWebpackPlugin = require('html-webpack-plugin')
  , production = (process.env.NODE_ENV === 'production')
  ;

module.exports = {
  entry: {
    app: path.join(__dirname, 'src', 'App.jsx'),
    vendor: [ 'react'
            , 'react-dom'
            ]
  },

  output: {
    path: outputPath(),
    filename: 'js/bundle.js'
  },

  resolve: {
    extensions: [ ''
                , '.webpack.js'
                , '.web.js'
                , '.js'
                , '.jsx'
                ]
  },

  module: {
    loaders: [
      {
        loader: 'babel',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        query: {
          presets: [ 'react'
                   , 'es2015'
                   ]
        }
      }, {
        loader: 'style-loader!css-loader!stylus-loader',
        test: /\.styl?$/,
        exclude: /node_modules/
      }, {
        test: /\.glsl$/,
        loader: 'webpack-glsl'
      }, {
        test: /\.svg$/,
        loader: 'svg-sprite?' + JSON.stringify({
          name: '[name]_[hash]',
          prefixize: true
        })
      }
    ]
  },

  plugins: pluginDefinitions(),

  stylus: {
    use: [require('nib')()],
    import: ['~nib/index.styl']
  }
};

function outputPath() {
  if (production) {
    return path.join(__dirname, 'dist');
  } else {
    return path.join(__dirname, 'dev');
  }
}

function pluginDefinitions() {
  var plugins = [];

  plugins.push(
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      filename: 'index.html',
      inject: 'body'
    })
  );

  plugins.push(
    new webpack.optimize.CommonsChunkPlugin(
      'vendor', 'js/vendor.bundle.js'
    )
  );

  if (production) {
    plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      })
    );

    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        output: { comments: false },
        warnings: false
      })
    );
  } else {
    plugins.push(
      new webpack.SourceMapDevToolPlugin({
        test: /\.jsx?$/
      })
    );
  }

  return plugins;
}
