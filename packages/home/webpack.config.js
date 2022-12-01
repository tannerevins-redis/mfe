const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("./package.json").dependencies;
module.exports = {
  entry: "./src/index",
  cache: false,
  mode: "development",
  devtool: "source-map",
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },
  output: {
    publicPath: "http://localhost:3001/",
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.jsx?$/,
        loader: require.resolve("babel-loader"),
        options: {
          presets: [require.resolve("@babel/preset-react")],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "home",
      filename: "remoteEntry.js",
      remotes: {
        header: "nav@http://localhost:3002/remoteEntry.js",
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
