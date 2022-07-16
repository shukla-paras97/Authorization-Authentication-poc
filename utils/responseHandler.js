const logger = require('../utils/loggingEngine');
const messages = require('../constants/successResponseMessages.json');
 
module.exports = (request, response, next, status, messageCode, data) => {
  logger.info({ status: status, message: messages[messageCode], data: data });
  response.status(200).json({
    status: status,
    code: messageCode,
    message: messages[messageCode],
    data: data
  });
};