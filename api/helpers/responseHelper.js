const boom = require('boom');
const logger = require('./logHelper');
const internalHelper = {};

internalHelper.HttpCodeMessage = {
  200: 'OK',
  201: 'Created',
  204: 'OK'
};

internalHelper.HTTP_GET_CODE = 200;
internalHelper.HTTP_POST_CODE = 201;
internalHelper.HTTP_PUT_DELETE_CODE = 204;

internalHelper.generateResponse = ({ status, data = {} }) => {
  return {
    statusCode: status,
    message: internalHelper.HttpCodeMessage[status],
    data: data
  };
};

/**
 * Success Handler for API
 * @param h
 * @param data
 *
 * { data, status: 200/201/204, message: '' }
 *
 * */
internalHelper.successHandler = (h, data) => h.response(data);

/**
 * Error Handler for API
 * @param h
 * @param message
 * @param error
 * */
internalHelper.errorHandler = (h, message, error) => {
  logger.info('\n\n**************************************************** Emergency *********************************\n');
  logger.info(message);
  logger.error(error);
  logger.info('\n\n**************************************************** Emergency *********************************\n');
  return h.response(boom.notAcceptable(message, error));
};


/**
 * Generic GET response
 * @param h
 * @param data
 *
 * { data, status: 200, message: '' }
 *
 * */
const get = (h, data) => {
  const genericGetResponse = internalHelper.generateResponse({ status: internalHelper.HTTP_GET_CODE, data });
  
  return internalHelper.successHandler(h, genericGetResponse);
};


/**
 * Generic POST response
 *
 * { data, status: 201, message: '' }
 *
 * */
const post = (h, data) => {
  const genericPostResponse = internalHelper.generateResponse({ status: internalHelper.HTTP_POST_CODE, data });
  
  return internalHelper.successHandler(h, genericPostResponse);
};


/**
 * Generic PUT or DELETE response
 *
 * { data, status: 204, message: '' }
 *
 * */
internalHelper.putOrRemove = (h, data) => {
  const genericPutDeleteResponse = internalHelper.generateResponse(
    { status: internalHelper.HTTP_PUT_DELETE_CODE, data });
  
  return internalHelper.successHandler(h, genericPutDeleteResponse);
};


module.exports = {
  /**
   * Get
   */
  get,
  post,
  put: internalHelper.putOrRemove,
  remove: internalHelper.putOrRemove,
  onError: internalHelper.errorHandler
};
