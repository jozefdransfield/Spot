var url = require("url");
var http = require("http");
var _ = require("underscore")._;

module.exports = {
    get: function(target) {
        var builder = new Request();
        builder.target(target);
        builder.method("GET");
        return builder;
    },
    put: function(target) {
        var builder = new Request();
        builder.target(target);
        builder.method("PUT");
        return builder;
    },
    post: function(target) {
        var builder = new Request();
        builder.target(target);
        builder.method("POST");
        return builder;
    },
    delete: function(target) {
        var builder = new Request();
        builder.target(target);
        builder.method("DELETE");
        return builder;
    }
}

function Response() {
	this.status;
	this.data;
}

function Request() {
    var host;
    var path;
    var port;
    var method;
    var accept;
	var body;
    var headers = {};
    var agent = "Layabout"

    this.target = function(target) {
        var parsedUrl = url.parse(target);
        host = parsedUrl.hostname;
        path = parsedUrl.pathname;
        port = parsedUrl.port;
        return this;
    }

    this.header = function(name, value) {
        headers[name] = value;
        return this;
    }

    this.method = function(requestMethod) {
        method = requestMethod;
        return this;
    }

    this.accepts = function(requestAccepts) {
        accept = requestAccepts;
        return this;
    }

    this.body = function(requestBody) {
        body = requestBody;
        return this;
    }
    this.send = function(callback) {
        var req = http.request({
            host: host,
            path: path,
            port: port,
            method: method
        }, function (res) {
            res.setEncoding('utf-8');
            var data = "";
            res.on('data', function (chunk) {
                data += chunk.toString();
            });
            res.on("end", function() {
                var resp = {};
                try {
                    resp = JSON.parse(data)
                } catch (e) {
                    console.log("Failed to parse data:", data);
                }
				var retVal = new Response();
				retVal.status = res.statusCode;
				retVal.data = resp;
                callback(null,retVal);
            })
        });

        req.on('error', function(e) {
            callback(e);
        });

		if (body) {
        	var toSend = JSON.stringify(body);
        	req.setHeader("Content-Type", "application/json");
        	req.setHeader("Accept", "application/json")
        	req.setHeader("Content-Length", toSend.length)

        	req.write(toSend);
		}
		_(headers).each(function(value, key) {
            req.setHeader(key, value);
        });
        req.end();

    }
}



