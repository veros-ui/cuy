const serverless = require('serverless-http');

let cachedHandler;

exports.handler = async (event, context) => {
  if (!cachedHandler) {
    const app = require('../../server');
    cachedHandler = serverless(app);
  }
  return cachedHandler(event, context);
};
