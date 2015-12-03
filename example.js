var Rapifire  = require('./index.js');

// packet builder helpers, senml
function orderCommand(type) {
    return '{"bn":"/officeChap/", "e":[{"n":"order", "sv":"' + type + '"}]}';
}

function machineStatus(status) {
    return '{"bn":"/coffeeMachine/", "e":[{"n":"status", "sv":"' + status + '"}]}';
}


var dataChannel = "/mRRRRRRRRme/data";
var commandsChannel = "/mRRRRRRRRme/commands";

// coffee machine
function coffeeMachineOnConnect() {
    console.log("coffee machine operational.");
    this.subscribe(commandsChannel);
    this.publish(dataChannel, machineStatus("on"));
}

function coffeeMachineOnMessage(channel, message, headers) {
    console.log("coffee machine received " + message + " on channel " + channel + " with headers " + headers);
}

var coffeeMachine = new Rapifire('pkU6b-Tc420qFKPdwHJn8L2rWFA=','qFQhkjetZArC', coffeeMachineOnConnect, coffeeMachineOnMessage);


// office chap
function officeChapOnConnect() {
    console.log("let me order coffee pls!");
    this.subscribe(dataChannel);
}

function officeChapOnMessage(channel, message, headers) {
    console.log("order ready!");
}

var officeChap = new Rapifire('-E8nbr_3sC12sEkLnCkaR-wRRiA=', '4AjZ5E8YzfAd', officeChapOnConnect, officeChapOnConnect);

setTimeout(function() {
    console.log("quitting!");
}, 1000);
