const path = require('path');

module.exports = {
    entry: './src/client/components/index.jsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
        //libraryTarget: 'var',
        //library: 'EntryPoint'
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devServer: {
        contentBase: './public'
    }
};
