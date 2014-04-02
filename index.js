module.exports = function() {
  // Act as requestListener, a function which is automatically
  // added to the 'request' event. http://nodejs.org/api/http.html#http_event_request
  return function(request, response) {
    response.statusCode = 404;
    response.end();
  };
};
