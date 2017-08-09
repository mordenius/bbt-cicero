/*	eslint import/no-extraneous-dependencies:0	*/
const fs = require("fs");
const BabiliPlugin = require("babili-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const nodeModules = {};
fs
	.readdirSync("node_modules")
	.filter(x => [".bin"].indexOf(x) === -1)
	.forEach(mod => {nodeModules[mod] = `commonjs ${mod}`});

module.exports = {
	context: `${__dirname}/source/`,
	target: "node",
	externals: nodeModules,
	entry: [`${__dirname}/source/js/index.js`],
	output: {
		path: `${__dirname}/build/`,
		filename: "cicero.min.js"
	},
	module: {
		rules: [
			{
				test: /\.js?/,
				use: "babel-loader"
			},
			{
				test: /\.json$/,
				use: "json-loader"
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin([`${__dirname}/build/`]),
		new BabiliPlugin(null, {comments: false})
	]
};
