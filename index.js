"use strict";
var WebSocket = require('ws');

function buildInitPacket(config) {
    return {
        "operation": "init",
        "data": {
            "appId" : config.appId,
            "authId" : config.authId,
            "authKey" : config.authKey
        }
    };
};

function buildSubscribePacket(channel) {
    return {
        "operation": "subscribe",
        "data": {
            "channel": channel,
            "interactive": false
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

var Rapifire = function(thingId, thingToken, onConnect, onMessage) {
    var config = {
        url: 'ws://ws.rapifire.com/pubsub',
        appId: '36799b71-c79f-405e-b345-cc5827d0e401',
        authId: thingId,
        authKey: thingToken,
    };

    if (typeof onConnect === 'undefined') {
        throw new Error("onConnect cannot be undefined");
    }
    if (typeof onMessage === 'undefined') {
        throw new Error("onMessage cannot be undefined");
    }

    console.log(config);


    var connect = function(c) {
        var self = this;
        var ws = new WebSocket(c.url);

        ws.onopen = function() {
            console.log("Connected to %s", c.url);
            ws.send(JSON.stringify(buildInitPacket(c)));
            onConnect.apply(self);
        };

        ws.onmessage = function(message) {
            var msg;
            try {
                msg = JSON.parse(message.data);
            } catch(e) {
                console.error("Received %s but cannot parse it to JSON %s", message.data, e);
                throw e;
            }
            console.log("Received message: %O", msg);
            onMessage.apply(self, [msg.channel, msg.message, msg.headers]);
        };

        return ws;
    };

    var ws = connect.apply(this, [config]);

    this.subscribe = function(channel) {
        var asJson = JSON.stringify(buildSubscribePacket(channel));
        console.log(asJson);
        ws.send(asJson);
        return this;
    };

    this.publish = function(channel, message) {
        var asJson = JSON.stringify(buildPublishPacket(channel, message));
        console.log(asJson);
        ws.send(asJson);
        return this;
    };

    this.disconnect = function() {
        ws.disconnect();
    };

};

module.exports = Rapifire;
