var http = require("http");

module.exports = function() {
  // Act as requestListener, a function which is automatically
  // added to the 'request' event. http://nodejs.org/api/http.html#http_event_request
  var myexpress = function(request, response) {
    var currentMiddlewareIndex = -1,
        defaultMiddleware = function() {
          response.statusCode = 404;
          response.end('404 - Not Found');
        };

    var next = function() {
      if((currentMiddlewareIndex + 1) === myexpress.stack.length) {
        myexpress.stack[currentMiddlewareIndex](request, response, defaultMiddleware);
      } else {
        myexpress.stack[++currentMiddlewareIndex](request, response, next);
      }
    };

    next();
  };

  myexpress.stack = [];

  myexpress.listen = function(port, callback) {
    var server = http.createServer(this);
    server.listen(port, callback);

    return server;
  };

  myexpress.use = function(middleware) {
    if(middleware && (typeof middleware) === 'function') {
      myexpress.stack.push(middleware);
    }
  };

  return myexpress;
};
