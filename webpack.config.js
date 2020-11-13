'use strict';
/* eslint-env node */

const path = require('path');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

module.exports = {
    devtool: 'source-map',
    performance: { hints: false },
    stats: { children: false },

    entry: path.resolve(__dirname, 'src', 'app.js'),

    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'app.[hash:8].js',
        chunkFilename: '[name].[hash:8].js',
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
            title: 'Courselib',
            filename: 'index.html',
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            }
        }),
        new HtmlWebpackTagsPlugin({
            tags: [
                {
                    path: 'https://fonts.googleapis.com/css2?family=Barlow&display=swap',
                    type: 'css',
                    publicPath: false,
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'app.[hash:8].css',
            chunkFilename: '[name].[hash:8].css',
            ignoreOrder: false,
        }),
        // new CKEditorWebpackPlugin({
        //     language: 'fr',
        //     translationsOutputFile: /^ckeditor\.[0-9a-f]{8}\.js$/,
        // }),
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
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
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
            // {
            //     test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
            //     use: [
            //         {
            //             loader: MiniCssExtractPlugin.loader,
            //         },
            //         {
            //             loader: 'css-loader'
            //         },
            //         {
            //             loader: 'postcss-loader',
            //             options: {
            //                 postcssOptions: styles.getPostCssConfig({
            //                     themeImporter: {
            //                         themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
            //                     },
            //                     minify: true
            //                 })
            //             }
            //         },
            //     ]
            // }
        ]
    },

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 8000,
        overlay: true,
        historyApiFallback: true
    }
};
