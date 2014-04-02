var express   = require("../")
    , expect  = require("chai").expect
    , http    = require("http")
    , request = require("supertest")
    , express = require("myexpress");

describe('app', function(){
  var app = express();

  describe("create http server", function() {
    it("should render 404 for empty app", function(done) {
      var server = http.createServer(app);
      request(server).get('/').expect(404, done);
    });
  });

  describe('create listen method', function() {
    var port = 8888;
    var server;

    before(function(done) {
      server = app.listen(port, done);
    });

    it("should return http.Server", function() {
      expect(server).to.be.instanceof(http.Server);
    });

    it("should render 404", function(done) {
      request('http://localhost:'+port).get('/something-not-found').expect(404, done);
    });
  });
});
