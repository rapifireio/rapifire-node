var Rapifire  = require('./index.js');

// sending messages to rapifire (senml required)
var dataChannel = "/mRRRRRRRRme/data";

// reading commands from office (any format)
var commandsChannel = "/mRRRRRRRRme/commands";

// senml formatted message
function machineStatus(status) {
    return {
        "bn":"/coffeeMachine/",
        "e":[{"n":"status", "sv": status}]
    };
}

// senml formatted message
function orderReady(coffeeType) {
    return {
        "bn":"/coffeeMachine/",
        "e":[{"n":"order", "sv": coffeeType}]};
}

// is coffee machine working or in maintenance mode?
var operational = true;

// coffee machine behaviour when connected to rapifire
function onConnect() {
    console.log("coffee machine operational.");
    this.subscribe(commandsChannel);
    this.publish(dataChannel, machineStatus("on"));
}

// coffee machine behaviour when message is read from rapifire (from subscribed commands channel)
function onMessage(channel, message, headers) {
    if (operational) {
        console.log("preparing " + message);
        // brew it here!
        console.log("order ready!");
        this.publish(dataChannel, orderReady(message));
    } else {
        console.log("cannot prepare " + message + " due to ongoing maintenance");
    }
}

// connect to rapifire with your thing's auth id and auth token, pass proper handlers
var coffeeMachine = new Rapifire('pkU6b-Tc420qFKPdwHJn8L2rWFA=','qFQhkjetZArC', onConnect, onMessage);

// after connection do maintenance from time to time informing rapifire and all subscribers about that
setInterval(function() {
    // check if maintenance status needs change
    if (!operational || Math.random() > 0.8) {
        operational = !operational;
        coffeeMachine.publish(dataChannel, machineStatus(operational ? "on" : "off"));
    }
}, 1000);
