const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/weatherforecast",
    "/location",
    "/menu",
    "/minimap",
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'http://localhost:7048',
        secure: false,
        changeOrigin: true,
        logLevel: 'debug',
    });

    app.use(appProxy);
}; 