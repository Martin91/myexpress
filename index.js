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

    if(myexpress.stack.length > 0) {
      var next = function() {
        if(arguments.length > 0 && arguments[0] instanceof Error) {
          response.statusCode = 500;
          response.end("Internal Server Error!");
        }

        try {
          if((currentMiddlewareIndex + 1) === myexpress.stack.length) {
            myexpress.stack[currentMiddlewareIndex](request, response, defaultMiddleware);
          } else {
            while(myexpress.stack[++currentMiddlewareIndex].length == 3) {
              myexpress.stack[currentMiddlewareIndex](request, response, next);
            }
          }
        } catch(err) {
          response.statusCode = 500;
          response.end("Internal Server Error!");
        }
      };
    } else {
      var next = defaultMiddleware;
    }

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
