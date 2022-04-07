const path = require('path');
const webpack = require('webpack');

const srcPath = {
  ts: './src/assets/js/',
};

/**
 * 共通設定
 */
const common = (env) => {
  return {
    entry: {
      async: `${srcPath.ts}async.ts`,
      defer: `${srcPath.ts}defer.ts`,
    },
    output: {
      path: `${path.resolve(__dirname, './')}/public/htdocs/assets/js/`,
      filename: '[name].js',
    },
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        Promise: 'es6-promise',
      }),
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    target: ['web', 'es5'],
  };
};

/**
 * 開発用設定
 */
const development = (env) => {
  return {
    ...common(env),
    mode: 'development',
    watchOptions: {
      ignored: ['node_modules'],
    },
  };
};

/**
 * 本番用設定
 */
const production = (env) => {
  return {
    ...common(env),
    mode: 'production',
  };
};

module.exports = (env) => (env.NODE_ENV !== 'production' ? development(env) : production(env));
