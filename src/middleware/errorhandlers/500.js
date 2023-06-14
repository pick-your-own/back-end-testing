'use strict';


const errorHandler = (error, request, response, next) => {
  const errorMessage = typeof(error) === 'string' ? error : error.message;
  response.status(500).send ({
    error: 500,
    route: request.path,
    query: request.query,
    path: request.params,
    body: request.body,
    message: `Server Error: ${errorMessage}`,
  });
};

module.exports = errorHandler;