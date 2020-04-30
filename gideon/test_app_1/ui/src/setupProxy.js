const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        proxy(['/v1'], {
            target: 'http://localhost:3000',
            secure: false,
            changeOrigin: true,
            followRedirects: true,
            logLevel: 'debug',
        }),
    );

    // app.use(
    //     proxy(['/s3'], {
    //         target: 'https://my-bucket.s3.amazonaws.com',
    //         secure: false,
    //         changeOrigin: true,
    //         followRedirects: true,
    //         logLevel: 'debug',
    //         pathRewrite: {
    //             '^/s3': '/',
    //         },
    //     }),
    // );
};
