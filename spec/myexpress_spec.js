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

    request(app).get('/').expect('Hello, Node!', done);
  });

  it('should call multiple middlewares', function(done){
    var middleware1 = function(req, res, next) {
      next();
    };
    var middleware2 = function(req, res, next) {
      res.end('Hello, Node!');
    }

    app.use(middleware1);
    app.use(middleware2);

    request(app).get('/').expect('Hello, Node!', done);
  });

  it('should be 404 at the end of middleware chain', function(done) {
    var middleware1 = function(req, res, next) {
      next();
    };
    var middleware2 = function(req, res, next) {
      next();
    }

    app.use(middleware1);
    app.use(middleware2);

    request(app).get('/').expect(404, done);
  });

  it('should be 404 if no any middleware', function(done){
    request(app).get('/').expect(404, done);
  });
});

describe('error handling', function(){
  var app;
  beforeEach(function() {
    app = new express();
  });

  it('should return 500 for unhandled error', function(done){
    var m1 = function(req,res,next) {
      next(new Error("boom!"));
    }
    app.use(m1);

    request(app).get('/').expect(500, done);
  });

  it('should return 500 for uncaught error', function(done){
    var m1 = function(req,res,next) {
      throw new Error("boom!");
    };
    app.use(m1)

    request(app).get('/').expect(500, done);
  });

  it('should skip error handlers when next is called without an error', function(done) {
    var m1 = function(req,res,next) {
      next();
    }

    var e1 = function(err,req,res,next) {
      // timeout
    }

    var m2 = function(req,res,next) {
      res.end("m2");
    }
    app.use(m1);
    app.use(e1); // should skip this. will timeout if called.
    app.use(m2);

    request(app).get('/').expect('m2', done);
  });

  it('should skip normal middlewares if next is called with an error', function(done) {
    var m1 = function(req,res,next) {
      next(new Error("boom!"));
    }

    var m2 = function(req,res,next) {
      // timeout
    }

    var e1 = function(err,req,res,next) {
      res.end("e1");
    }

    app.use(m1);
    app.use(m2); // should skip this. will timeout if called.
    app.use(e1);

    request(app).get('/').expect('e1', done);
  });
});

describe('Implement App Embedding As Middleware', function(){
  var app, subApp;
  beforeEach(function(){
    app = express();
    subApp = express();
  });

  it('should pass unhandled request to parent', function(done){
    function m2(req,res,next) {
      res.end("m2");
    }

    app.use(subApp);
    app.use(m2);

    request(app).get('/').expect('m2', done);
  });

  it('should pass unhandled error to parent', function(done){
    function m1(req,res,next) {
      next("m1 error");
    }

    function e1(err,req,res,next) {
      res.end(err);
    }

    subApp.use(m1);

    app.use(subApp);
    app.use(e1);

    request(app).get('/').expect('m1 error', done);
  });
});
