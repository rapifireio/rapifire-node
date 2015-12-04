var Rapifire  = require('./index.js');

// reading messages from rapifire (senml formatted)
var dataChannel = "/mRRRRRRRRme/data";

// sending commands to coffee machine
var commandsChannel = "/mRRRRRRRRme/commands";

// subscribing after connect to be informed about new deliveries as well as coffee machine status
function onConnect() {
    this.subscribe(dataChannel);
}

// those messages will be read and act upon here
function onMessage(channel, message, headers) {
    if (message.e[0].n == "order") {
        console.log("ordered " + message.e[0].sv + " arrived!");
    }
    if (message.e[0].n == "status") {
        console.log("coffee machine is " + message.e[0].sv);
    }
}

// connect to rapifire with your user's auth id and auth token, pass proper handlers
var office = new Rapifire('-E8nbr_3sC12sEkLnCkaR-wRRiA=', '4AjZ5E8YzfAd', onConnect, onMessage);


var coffees = ["ristretto", "doppio", "espresso", "lungo", "macchiato", "affogato", "mocha", "flat white", "latte"];
setInterval(function() {
    var coffee = coffees[Math.floor(Math.random() * coffees.length)];
    console.log("ordering " + coffee);
    office.publish(commandsChannel, coffee);
}, 1000);
