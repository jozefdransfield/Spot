var vows = require("vows");
var assert = require("assert");

var spot = require("../lib/spot.js")

var suite = vows.describe('Spot')

suite.addBatch({
    'Get www.google.com': {
        topic: function() {
			spot.get("http://www.google.co.uk").send(this.callback)
        },
        "returns 200": function(error, data) {
			assert.equal(data.status, "200");
		}
    }
});

suite.export(module);