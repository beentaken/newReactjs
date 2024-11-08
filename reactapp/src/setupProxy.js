const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/weatherforecast",
    "/location",
    "/menu",
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'http://host.docker.internal:7048', // Or 'http://api:7048' if using docker-compose network
        secure: false,
        changeOrigin: true,
        logLevel: 'debug',
    });

    app.use(appProxy);
};