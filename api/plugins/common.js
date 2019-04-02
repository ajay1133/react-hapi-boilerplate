'use strict';
exports.plugin = {
    name: 'AppCommons',
    register: (server, options) => {
        var env = process.env.NODE_ENV || 'development';
        if (env === 'production' || env == 'staging') {
            server.ext('onRequest', function (request, h) {
                if (request.path === '/heart-beat') {
                    return h.continue;
                }
                return h.continue;
            });
        }
    }
};
