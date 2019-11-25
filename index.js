"use strict";
const lambda = require("./src/lambda");

const supportedCashBehaviorPaths = {
  combineJs: "/combine/js/",
  combineCss: "/combine/css/",
  default: "/"
};

exports.handler = async (event, context, callback) => {
  const combineJsParams = {
    path: supportedCashBehaviorPaths.default,
    shoudlFallback: "false",
    fallbackBaseUrl: "https://s.autoscout24.net"
  };
  return lambda.run(combineJsParams, event, context, callback);
};
