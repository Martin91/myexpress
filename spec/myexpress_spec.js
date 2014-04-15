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

  describe('Implement .use', function() {
    it("should be able to add a new stack to the app", function(){
      function stack1() {};
      function stack2() {};
      app.use(stack1);
      app.use(stack2);

      expect(app.stack.length).to.eql(2);
      expect(app.stack[0]).to.eql(stack1);
      expect(app.stack[1]).to.eql(stack2);
    });
  });
});

describe('calling middleware stack', function() {
  var app, port = 4000;
  beforeEach(function() {
    app = new express();
  });

  it('should call single middleware', function(done){
    var middleware = function(req, res, next) {
      res.end('Hello, Node!');
    };

    app.use(middleware);

    app.listen(port, done);

    request('http://localhost:' + port).get('/').expect('Hello, Node!', done);
  });
});
