import path from 'path';

export default {
    entry: './src/map.js',
    output: {
        filename: 'map.bundle.js',
        path: path.resolve('public/js'),
        clean: true,
    },
    mode: 'development',
};
