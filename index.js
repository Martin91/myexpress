var http = require("http");

module.exports = function() {
  // Act as requestListener, a function which is automatically
  // added to the 'request' event. http://nodejs.org/api/http.html#http_event_request
  var myexpress = function(request, response) {
    var currentMiddleware = 0,
        defaultMiddleware = function() {
          response.end('404 - Not Found');
        };

    if(myexpress.stack.length > 0) {
      if(currentMiddleware < myexpress.stack.length) {
        myexpress.stack[currentMiddleware](request, response, myexpress.stack[++currentMiddleware]);
      } else {
        myexpress.stack[currentMiddleware](request, response, defaultMiddleware);
      }
    }
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
