var express   = require("../")
    , expect  = require("chai").expect
    , http    = require("http")
    , request = require("supertest")
    , express = require("myexpress");

var app       = express()
    , server  = http.createServer(app);

server.listen(4000);

describe('app', function(){
  describe("create http server", function() {
    it("should render 404 for empty app", function(done) {
      request(server).get('/').expect(404, done);
    });
  });

  describe('create listen method', function() {
    server = app.listen(4000);
    it("should return http.Server", function() {
      expect(server).to.be.instanceof(http.Server);
    });

    it("should render 404", function(done) {
      request(server).get('/').expect(404, done);
    });
  });
});
