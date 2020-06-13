const request = require("request");

module.exports = function (RED) {
  function ThingSpeakGetNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    // node variables
    node.endpoint = config.endpoint;
    node.channel = config.channel;
    node.length = config.length;

    // functions
    function buildGetThingSpeakURL() {
      var url =
        node.endpoint +
        "/channels/" +
        node.channel +
        "/feeds.json?api_key=" +
        node.credentials.readApiKey +
        "&results=" +
        node.length;
      return url;
    }

    function getThingSpeakData(callback) {
      node.status({ fill: "blue", shape: "dot", text: "requesting..." });
      var url = buildGetThingSpeakURL();
      node.log(
        "Get data from ThingSpeak: " +
          url.replace(node.credentials.readApiKey, "XXXXXXXXXX")
      );

      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          result = JSON.parse(body);
          return callback(result, false);
        } else {
          return callback(null, error);
        }
      });
    }

    // ON input
    this.on("input", function (msg) {
      getThingSpeakData(function (data, err) {
        node.status({ fill: "green", shape: "dot", text: "ready" });
        node.log("Body: " + data);
        // if (err) node.error(err);
        if (!err) {
          node.log(data);
          msg.topic = "Thingspeak Response";
          msg.payload = data["feeds"];

          node.send(msg);
        }
      });
    });

    this.on("close", function () {});
  }

  RED.nodes.registerType("thingspeakget", ThingSpeakGetNode, {
    credentials: {
      readApiKey: { type: "password" },
    },
  });
};
