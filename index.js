var http = require("http");

module.exports = function() {
  // Act as requestListener, a function which is automatically
  // added to the 'request' event. http://nodejs.org/api/http.html#http_event_request
  var myexpress = function(request, response) {
    response.statusCode = 404;
    response.end();
  };

  myexpress.listen = function(port) {
    var server = http.createServer(this);
    server.listen(port);

    return server;
  }

  return myexpress;
};
