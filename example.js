var Rapifire  = require('./index.js');


function orderDelivery(coffee) {
    return JSON.parse('{"bn":"/coffeeMachine/", "e":[{"n":"order", "sv":"'+ coffee +'"}]}')c;
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
    console.log("preparing " + message);
    // do the job here!
    console.log("order ready!");
    this.publish(dataChannel, message);
}

var coffeeMachine = new Rapifire('pkU6b-Tc420qFKPdwHJn8L2rWFA=','qFQhkjetZArC', coffeeMachineOnConnect, coffeeMachineOnMessage);


// office chap
function officeChapOnConnect() {
    console.log("let me order coffee pls!");
    this.subscribe(dataChannel);
}

function officeChapOnMessage(channel, message, headers) {
    if (typeof message ===  'string') {
        console.log("here is my " + message);
    } else if (message.e[0].n == "status") {
        console.log("coffee machine is " + message.e[0].sv);
    }
}

var officeChap = new Rapifire('-E8nbr_3sC12sEkLnCkaR-wRRiA=', '4AjZ5E8YzfAd', officeChapOnConnect, officeChapOnMessage);



setTimeout(function() {
    officeChap.publish(commandsChannel, "latte");
}, 1000);
