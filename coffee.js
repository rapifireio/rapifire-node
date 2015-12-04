var Rapifire  = require('./index.js');

var dataChannel = "/mRRRRRRRRme/data";
var commandsChannel = "/mRRRRRRRRme/commands";

// senml formatted message
function machineStatus(status) {
    return {
        "bn":"/coffeeMachine/",
        "e":[{"n":"status", "sv": status}]
    };
}

// coffee machine
function onConnect() {
    console.log("coffee machine operational.");
    this.subscribe(commandsChannel);
    this.publish(dataChannel, machineStatus("on"));
}

function onMessage(channel, message, headers) {
    console.log("preparing " + message);
    // do the job here!
    console.log("order ready!");
    this.publish(dataChannel, message);
}

var coffeeMachine = new Rapifire('pkU6b-Tc420qFKPdwHJn8L2rWFA=','qFQhkjetZArC', onConnect, onMessage);
