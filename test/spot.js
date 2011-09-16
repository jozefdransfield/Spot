var vows = require("vows");
var assert = require("assert");
var spot = require("../lib/spot.js");
var path = require("path");

require("./server.js");

var suite = vows.describe('Spot');

suite.addBatch({
    'Getting a url that returns JSON': {
        topic: function() {
			spot.get(resource("/echo")).send(this.callback);
        },
        "returns successfully": successfulResponse
    },
    'Posting a url that returns JSON': {
        topic: function() {
            spot.post(resource("/echo")).send(this.callback);
        },
        "returns successfully": successfulResponse
    },
    'Deleting a url that returns JSON': {
        topic: function() {
            spot.delete(resource("/echo")).send(this.callback);
        },
        "returns successfully": successfulResponse
    },
    'Putting a url that returns JSON': {
        topic: function() {
            spot.put(resource("/echo")).send(this.callback);
        },
        "returns successfully": successfulResponse
    },
    'Getting a url with headers that returns JSON ': {
        topic: function() {
            spot.get(resource("/echo")).header("jack", "jill").header("bill", "ben").send(this.callback);
        },
        "returns successfully": successfulResponse,
        "has headers": function(error, response) {
            assert.equal(response.data.headers.jack, "jill");    
            assert.equal(response.data.headers.bill, "ben");
        }
    },
    'Putting a url with headers that returns JSON ': {
        topic: function() {
            spot.put(resource("/echo")).header("jack", "jill").header("bill", "ben").send(this.callback);
        },
        "returns successfully": successfulResponse,
        "has headers": function(error, response) {
            assert.equal(response.data.headers.jack, "jill");    
            assert.equal(response.data.headers.bill, "ben");
        }
    },
    'Deleting a url with headers that returns JSON ': {
        topic: function() {
            spot.delete(resource("/echo")).header("jack", "jill").header("bill", "ben").send(this.callback);
        },
        "returns successfully": successfulResponse,
        "has headers": function(error, response) {
            assert.equal(response.data.headers.jack, "jill");    
            assert.equal(response.data.headers.bill, "ben");
        }
    },
    'Posting a url with headers that returns JSON ': {
        topic: function() {
            spot.post(resource("/echo")).
                header("jack", "jill").
                header("bill", "ben").
                send(this.callback);
        },
        "returns successfully": successfulResponse,
        "has headers": function(error, response) {
            assert.equal(response.data.headers.jack, "jill");    
            assert.equal(response.data.headers.bill, "ben");
        }
    }
});

suite.addBatch({
   "Post with json body": {
        topic: function() {
            spot.post(resource("/echo")).
                body({json: "awesome"}).
                send(this.callback);
        },
        "returns successfully": successfulResponse,
        "has body": function(error, response) {
            assert.deepEqual(response.data.body, {json: "awesome"});   
        }        
    }
});


suite.addBatch({
    'Post with file': {
        topic: function() {
            spot.post(resource("/fileupload")).file(path.join(__dirname, "uploadfile.txt")).send(this.callback);
        },
        "has file with correct name": function(err, response) {
               assert.equal(response.data.files[0], "uploadfile.txt")
        },
        "returns successfully": successfulResponse
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