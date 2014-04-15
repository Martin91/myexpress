var http = require("http");

module.exports = function() {
  // Act as requestListener, a function which is automatically
  // added to the 'request' event. http://nodejs.org/api/http.html#http_event_request
  var myexpress = function(request, response) {
    response.statusCode = 404;
    response.end();
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
