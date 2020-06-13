var should = require("should");
var helper = require("node-red-node-test-helper");
var lowerNode = require("../thingspeakget.js");

helper.init(require.resolve("node-red"));

describe("thingspeakget Node", function () {
  beforeEach(function (done) {
    helper.startServer(done);
  });

  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);
  });

  // test 1: Update name module
  it("Update module name", function (done) {
    var flow = [{ id: "n1", type: "thingspeakget", name: "change the name" }];
    helper.load(lowerNode, flow, function () {
      var n1 = helper.getNode("n1");
      n1.should.have.property("name", "change the name");
      done();
    });
  });

  // test 2: verify default
  it("Check default properties", function (done) {
    var flow = [
      {
        id: "n1",
        type: "thingspeakget",
        name: "test",
      },
    ];
    helper.load(lowerNode, flow, function () {
      var n1 = helper.getNode("n1");
      n1.should.have.property("name", "test");
      n1.should.have.property("length");
      n1.should.have.property("channel");
      n1.should.have.property("endpoint");
      done();
    });
  });

  // test 2: verify loading data
  it("Check data", function (done) {
    var flow = [
      {
        id: "n1",
        type: "thingspeakget",
        name: "test",
        length: 5,
        channel: 123456,
        endpoint: "www.google.com",
      },
    ];
    helper.load(lowerNode, flow, function () {
      var n1 = helper.getNode("n1");
      n1.should.have.property("name", "test");
      n1.should.have.property("length", 5);
      n1.should.have.property("channel", 123456);
      n1.should.have.property("endpoint", "www.google.com");
      done();
    });
  });

  // validate output
  // Need to test with live network.
  // Not in unit test scope
});
