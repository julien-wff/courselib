'use strict';
/* eslint-env node */

const path = require('path');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const hash = process.env.NODE_ENV === 'production'
    ? '[contenthash:8]'
    : '[hash:8]';

module.exports = {
    devtool: 'source-map',
    performance: { hints: false },
    stats: { children: false },

    entry: path.resolve(__dirname, 'src', 'app.js'),

    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: `app.${hash}.js`,
        chunkFilename: `[name].${hash}.js`,
    },

    optimization: {
        minimizer: [
            new TerserWebpackPlugin({
                sourceMap: true,
                extractComments: false,
            })
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.ejs',
            scriptLoading: 'defer',
        }),
        new MiniCssExtractPlugin({
            filename: `app.${hash}.css`,
            chunkFilename: `[name].${hash}.css`,
            ignoreOrder: false,
        }),
        new CKEditorWebpackPlugin({
            language: 'fr',
            translationsOutputFile: /^ckeditor\.[0-9a-f]{8}\.js$/,
        }),
    ],

    module: {
        rules: [
            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        emitCss: true,
                        hotReload: true,
                        dev: process.env.NODE_ENV !== 'production',
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                exclude: path.resolve(__dirname, 'src'),
                use: ['raw-loader']
            },
            {
                test: /\.css$/,
                exclude: [/ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/],
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                ident: 'postcss',
                                plugins: [
                                    require('tailwindcss'),
                                    ...process.env.NODE_ENV === 'production'
                                        ? [
                                            require('autoprefixer'),
                                            require('cssnano')({
                                                preset: 'default',
                                            }),
                                        ]
                                        : []
                                ],
                            },
                        }
                    },
                ]
            },
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: styles.getPostCssConfig({
                                themeImporter: {
                                    themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                                },
                                minify: true
                            })
                        }
                    },
                ]
            }
        ]
    },

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 8000,
        overlay: true,
        historyApiFallback: true,
        host: '0.0.0.0',
    }
};
