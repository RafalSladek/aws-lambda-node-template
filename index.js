"use strict";
const lambda = require('./lambda');

exports.handler = async (event, context, callback) => {
    const combineJsParams = ({
        'path': 'combine',
        'fileType': "js",
        'shoudlFallback': 'false',
        'fallbackBaseUrl': 'https://s.autoscout24.net'
    });
    return lambda.run(combineJsParams, event, context, callback);
};