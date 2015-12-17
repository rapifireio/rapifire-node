var Rapifire = require('../index.js');

// Data and Commands channels can be found in top right corner of your
// thing details page in 'API Access Keys and Channel Names' section.
// User's Auth ID and Auth Token can be found in top left corener of
// your user details page.

// IMPORTANT: Please don't confuse Thing Auth ID and Auth Token with
// User Auth ID and Token. Difference is User can WRITE to commands
// channel as opposite to Thing, which can only READ commands and
// WRITE to data channel.

// Reading messages from Rapifire (SenML formatted).
var dataChannel = "/mRRRRRRRRme/data";

// Sending commands to coffee machine (any format).
var commandsChannel = "/mRRRRRRRRme/commands";

// Subscribing to data channel on connect, to be informed about new
// deliveries as well as coffee machine status.
function onConnect() {
  this.subscribe(dataChannel);
}

// Data from coffee machine will be analyzed here.
function onMessage(channel, message, headers) {
  if (message.e[0].n == "order") {
    console.log("ordered " + message.e[0].sv + " arrived!");
  }
  if (message.e[0].n == "status") {
    console.log("coffee machine is " + message.e[0].sv);
  }
}

// Connect to Rapifire with your User's Auth ID and Auth Token, pass
// proper handlers. Replace Auth ID and Auth Token with data from your
// user profile.
var office = new Rapifire('-E8nbr_3sC12sEkLnCkaR-wRRiA=', '4AjZ5E8YzfAd', onConnect, onMessage);

// Possible coffees to order.
var coffees = ["ristretto", "doppio", "espresso", "lungo", "macchiato", "affogato", "mocha", "flat white", "latte"];

// After connecting, we place order here.
setInterval(function() {
  var coffee = coffees[Math.floor(Math.random() * coffees.length)];
  console.log("ordering " + coffee);
  office.publish(commandsChannel, coffee);
}, 1000);
