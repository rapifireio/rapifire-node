"use strict";
var WebSocket = require('ws');

function buildInitPacket(config) {
  return {
    "operation": "init",
    "data": {
      "authId" : config.authId,
      "authKey" : config.authKey
    }
  };
};

function buildSubscribePacket(channel) {
  return {
    "operation": "subscribe",
    "data": {
      "channel": channel
    }
  };
};

function buildPublishPacket(channel, message) {
  return {
    "operation": "publish",
    "data": {
      "channel": channel,
      "message": JSON.parse(message)
    }
  };
};

/**
 * RAPIFIRE Client Constructor
 * 
 * @constructor 
 * 
 * @param {string} authId - client authentication id, thing id, user
 * id or developer auth id
 * 
 * @param {string} authToken - client authentication token,
 * @param {function} onConnect - callback invoked on connect event
 * @param {function} onMessage - callback invoked on each received message
 * @param {function} onError - callback invoked in case of error
 *
 */
var Rapifire = function(authId, authToken, onConnect, onMessage, onError) {
  var debug = false;
  var config = {
    url: 'ws://ws.rapifire.com/pubsub',
    authId: authId,
    authKey: authToken
  };

  if (onConnect === undefined || onConnect === null) {
    onConnect = function() {
      console.log("(default onConnect handler) connected");
    };
  }
  if (onMessage === undefined || onMessage === null) {
    onMessage = function(channel, message, headers) {
      console.log("(default onMessage handler) channel: %s, message: %s, headers: %s", channel, message, headers);
    };
  }

  if (onError === undefined || onError === null) {
    onError = function(message) {
      console.log("(default onError handler) ERROR: " + message);
    };
  }

  if (debug) {
    console.log(config);
  }

  var self = this;
  var ws = new WebSocket(config.url);

  ws.on('open', function() {
    if (debug) {
      console.log("connected: %s", config.url);
    }
    ws.send(JSON.stringify(buildInitPacket(config)));
    onConnect.apply(self);
  });

  ws.on('message', function(message) {
    if (debug) {
      console.log("received: %s", message);
    }
    var msg = JSON.parse(message);
    if (msg.code !== undefined) {
      onError.apply(self, [message]);
      return;
    }
    onMessage.apply(self, [msg.channel, msg.message, msg.headers]);
  });

  this.subscribe = function (channel) {
    var asJson = JSON.stringify(buildSubscribePacket(channel));
    if (debug) {
      console.log("subscribe: %s", asJson);
    }
    ws.send(asJson);
    return this;
  };

  this.publish = function(channel, message) {
    var asJson = JSON.stringify(buildPublishPacket(channel, JSON.stringify(message)));
    if (debug) {
      console.log("publish: %s", asJson);
    }
    ws.send(asJson);
    return this;
  };

  this.disconnect = function() {
    ws.disconnect();
  };

};

module.exports = Rapifire;
