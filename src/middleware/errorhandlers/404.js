'use strict';


module.exports = (request, response, next) => {
  response.status(404).json({
    error: 404,
    route: request.baseUrl,
    message: 'Error Not Found',
  });
};