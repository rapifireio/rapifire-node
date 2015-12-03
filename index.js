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

var Rapifire = function(thingId, thingToken, onConnect, onMessage, onError) {
    var debug = true;
    var config = {
        url: 'ws://ws.rapifire.com/pubsub',
        appId: '36799b71-c79f-405e-b345-cc5827d0e401',
        authId: thingId,
        authKey: thingToken
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

    var connect = function(config) {
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

        return ws;
    };

    var ws = connect.apply(this, [config]);

    this.subscribe = function(channel) {
        var asJson = JSON.stringify(buildSubscribePacket(channel));
        if (debug) {
            console.log("subscribe: %s", asJson);
        }
        ws.send(asJson);
        return this;
    };

    this.publish = function(channel, message) {
        var asJson = JSON.stringify(buildPublishPacket(channel, message));
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
