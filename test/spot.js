var vows = require("vows");
var assert = require("assert");
var spot = require("../lib/spot.js");

require("./server.js");

var suite = vows.describe('Spot');

suite.addBatch({
    'Getting a url that returns JSON': {
        topic: function() {
			spot.get(resource("/respondJson")).send(this.callback);
        },
        "returns successfully": successfulResponse
    },
    'Posting a url that returns JSON': {
        topic: function() {
            spot.post(resource("/respondJson")).send(this.callback);
        },
        "returns successfully": successfulResponse
    },
    'Deleting a url that returns JSON': {
        topic: function() {
            spot.delete(resource("/respondJson")).send(this.callback);
        },
        "returns successfully": successfulResponse
    },
    'Putting a url that returns JSON': {
        topic: function() {
            spot.put(resource("/respondJson")).send(this.callback);
        },
        "returns successfully": successfulResponse
    },
    'Getting a url with headers that returns JSON ': {
        topic: function() {
            spot.get(resource("/respondJson")).header("jack", "jill").header("bill", "ben").send(this.callback);
        },
        "returns successfully": successfulResponse,
        "has headers": function(error, response) {
            assert.equal(response.data.headers.jack, "jill");    
            assert.equal(response.data.headers.bill, "ben");
        }
    },
    'Putting a url with headers that returns JSON ': {
        topic: function() {
            spot.put(resource("/respondJson")).header("jack", "jill").header("bill", "ben").send(this.callback);
        },
        "returns successfully": successfulResponse,
        "has headers": function(error, response) {
            assert.equal(response.data.headers.jack, "jill");    
            assert.equal(response.data.headers.bill, "ben");
        }
    },
    'Deleting a url with headers that returns JSON ': {
        topic: function() {
            spot.delete(resource("/respondJson")).header("jack", "jill").header("bill", "ben").send(this.callback);
        },
        "returns successfully": successfulResponse,
        "has headers": function(error, response) {
            assert.equal(response.data.headers.jack, "jill");    
            assert.equal(response.data.headers.bill, "ben");
        }
    },
    'Posting a url with headers that returns JSON ': {
        topic: function() {
            spot.post(resource("/respondJson")).header("jack", "jill").header("bill", "ben").send(this.callback);
        },
        "returns successfully": successfulResponse,
        "has headers": function(error, response) {
            assert.equal(response.data.headers.jack, "jill");    
            assert.equal(response.data.headers.bill, "ben");
        }
    }
});

// Havnt got tests for sending content

suite.addBatch({
    'Post with file': {
        topic: function() {
            spot.post("http://cgi-lib.berkeley.edu/ex/fup.cgi").file("./server.js").send(this.callback);
        },
        "returns successfully": successfulResponse,
        "meh": function(err, response) {
               console.log(response);
        }
    }
});

suite.export(module);

function resource(path) {
    return "http://0.0.0.0:"+process.env.C9_PORT+path;
}

function successfulResponse(error, response) {
  assert.equal(response.status, "200");
  assert.equal(response.data.response, "success" );
}