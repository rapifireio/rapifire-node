var Rapifire = require('../index.js');

// Data and Commands channels as well as Auth ID and Auth Token can be
// found in top right corner of your thing details page in 'API Access
// Keys and Channel Names' section.

// Sending messages to Rapifire (SenML required). For details about
// SenML see our blog post here:
// http://blog.rapifire.com/introduction-to-senml/
var dataChannel = "/mRRRRRRRRme/data";

// Reading commands from office (any format).
var commandsChannel = "/mRRRRRRRRme/commands";

// SenML formatted message.
function machineStatus(status) {
  return {
    "bn":"/coffeeMachine/",
    "e":[{"n":"status", "sv": status}]
  };
}

// SenML formatted message.
function orderReady(coffeeType) {
  return {
    "bn":"/coffeeMachine/",
    "e":[{"n":"order", "sv": coffeeType}]};
}

// Is coffee machine working or in maintenance mode?
var operational = true;

// Coffee machine behaviour when connected to Rapifire.
function onConnect() {
  console.log("coffee machine operational.");
  this.subscribe(commandsChannel);
  this.publish(dataChannel, machineStatus("on"));
}

// Coffee machine behaviour when message is read from Rapifire (from
// commands channel, that we subscribed to in onConnect).
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

// Connect to Rapifire with your Thing's Auth ID and Auth Token, pass
// proper handlers. Replace Auth ID and Auth Token with data from your
// thing details page.
var coffeeMachine = new Rapifire('pkU6b-Tc420qFKPdwHJn8L2rWFA=','qFQhkjetZArC', onConnect, onMessage);

// After connecting, we do inform Rapifire and all subscribers about
// maintenance of our machine by sending proper status message.
setInterval(function() {
  // check if maintenance status needs change
  if (!operational || Math.random() > 0.8) {
    operational = !operational;
    coffeeMachine.publish(dataChannel, machineStatus(operational ? "on" : "off"));
  }
}, 1000);
