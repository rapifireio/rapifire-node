var Rapifire  = require('./index.js');


var c1 = new Rapifire(
    '_Ip1yEc2bZcZtXJNy_vFqB323LQ=',
    'EQx5spqr7mIg',
    function() {
        console.log("c1: connected");
    },
    function(channel, message) {
        console.log("c1: channel " + channel + " received " + message);
    });


var c2 = new Rapifire(
    '_Ip1yEc2bZcZtXJNy_vFqB323LQ=',
    'EQx5spqr7mIg',
    function() {
        console.log("c2: connected");
    },
    function(channel, message, headers) {
        console.log("c2: channel " + channel + " received " + message + ", headers: " + headers);
    }
);

setTimeout(function() {
    c1.subscribe({channel:"/mRRRRRRRRmq/commands"});
    c2.publish("/mRRRRRRRRmq/commands", '{"e":[{"n":"asdf", "v":"fff"}]}');
    c2.publish("/mRRRRRRRRmq/data", '{"e":[{"n":"asdf", "v":"fff"}]}');
}, 3000);
