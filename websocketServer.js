#!/usr/bin/env node
var WebSocketServer = require("websocket").server;
var http = require("http");
var grip = require("grip"); //pushpin grip handler

var server = http.createServer(function(request, response) {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(8081, function() {
  console.log(new Date() + " Server is listening on port 8081");
});

wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  // perfect code from https://www.npmjs.com/package/websocket
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on("request", function(request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log(
      new Date() + " Connection from origin " + request.origin + " rejected."
    );
    return;
  }

  var connection = request.accept(null, request.origin); // null can be replaced with your own protocol
  console.log(new Date() + " Connection accepted.");
  connection.on("message", function(message) {
    // console.log(message);
    var pub = new grip.GripPubControl({
      control_uri: "http://my-pushpin-url.com"
    });
    pub.publishHttpStream("myVlogs", message.binaryData);
    if (message.type === "binary") {
      console.log(
        "Received Binary Message of " + message.binaryData.length + " bytes"
      );
      //push binary buffer data to pushpin
      connection.sendBytes(message.binaryData);
    }
  });
  connection.on("close", function(reasonCode, description) {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );
  });
});
