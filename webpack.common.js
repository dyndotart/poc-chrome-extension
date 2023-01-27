const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

/** @type { import('webpack').Configuration } */
module.exports = {
  // Entry Points of Chunks (Chunks are separate areas of a Chrome Extension)
  entry: {
    popup: path.resolve('./src/app/pages/popup/index.tsx'),
    options: path.resolve('./src/app/pages/options/index.tsx'),
    newTab: path.resolve('./src/app/pages/tabs/index.tsx'),
    background: path.resolve('./src/app/core/background/index.ts'),
    contentScript: path.resolve('./src/app/core/contentScript/index.ts'),
  },
  module: {
    rules: [
      // Typescript Loader
      {
        use: 'ts-loader',
        test: /\.tsx$/,
        exclude: /node_modules/,
      },
      // PostCSS & Tailwind Loader
      {
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [tailwindcss, autoprefixer],
              },
            },
          },
        ],
        test: /\.css$/i,
      },
      // Assets Loader
      {
        type: 'assets/resource',
        use: 'asset/resource',
        test: /\.(png|jpg|jpeg|gif|woff|woff2|tff|eot|svg)$/,
      },
    ],
  },
  plugins: [
    // Copy static files into 'dist' bundle
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('./src/assets/manifest.json'),
          to: path.resolve('./dist'),
        },
        {
          from: path.resolve('./src/assets'),
          to: path.resolve('./dist/assets'),
          globOptions: {
            dot: true,
            // Ignore manifest as it already was copied to the root
            ignore: ['**/manifest.json'],
          },
        },
      ],
    }),
    // Loader Html of of Chunks (from React Component)
    ...getHtmlPlugins(['popup', 'options', 'newTab']),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    // Creates and names bundles based on 'chunk' names
    filename: '[name].js',
  },
  optimization: {
    // So that ReactJs is split between the chunks
    // and not embedded into each chunk separately
    splitChunks: {
      chunks: 'all',
    },
  },
};

// ==============================================================================
// Helper
// ==============================================================================

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HtmlPlugin({
        title: 'Chrome Extension',
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}
