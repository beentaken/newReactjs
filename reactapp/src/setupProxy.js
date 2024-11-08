const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/weatherforecast",
    "/location",
    "/menu",
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'http://localhost:7048',
        secure: false, // Disable SSL verification for local development
        changeOrigin: true,
        logLevel: 'debug', // Add this for detailed logging
    });

    console.log(JSON.stringify(appProxy));

    app.use(appProxy);
};
