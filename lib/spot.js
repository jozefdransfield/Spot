var url = require("url");
var http = require("http");
var _ = require("underscore")._;
var util = require("util");
var fs = require("fs");
var nodePath = require('path');

var SpotContentTypes = require("./SpotContentTypes.js");

module.exports = {
    get: function(target) {
        var builder = this.defaults(target);     
        builder.method("GET");        
        return builder;
    },
    put: function(target) {
        var builder = this.defaults(target);     
        builder.method("PUT");    
        return builder;
    },
    post: function(target) {
        var builder = this.defaults(target);
        builder.method("POST");
        return builder;
    },
    delete: function(target) {
        var builder = this.defaults(target);
        builder.method("DELETE");              
        return builder;
    },
    defaults: function(target) {
        var builder = new Request(new SpotContentTypes());     
        builder.target(target);
        builder.header("content-type", "application/json");
        builder.header("Accept", "application/json");
        return builder;
    }
};

function Response(status, data) {
    this.status = status;
    this.data = data;
}

function Request(contentTypes) {
    var host, path, port, method;
    var body, file;
    var headers = {};
    var agent = "Spot";
    
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
    this.file = function(requestFile) {
        file = requestFile;
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
        }, function(res) {
            res.setEncoding('utf-8');
            var data = "";
            res.on('data', function(chunk) {
                data += chunk.toString();
            });
            res.on("end", function() {
                var resp = {};                
                var key = contentTypeFromHeader(res.headers["content-type"]);
                var retVal = new Response(res.statusCode, contentTypes.fromString(key, data));
                callback(null, retVal);
            })
        });
        req.on('error', function(e) {
            callback(e);
        });
        
        
        if (body) {
            var toSend = contentTypes.toString(contentTypeFromHeader(headers["content-type"]), body);
           
            req.setHeader("Content-Length", toSend.length);

            _(headers).each(function(value, key) {
                req.setHeader(key, value);
            });
            req.write(toSend);
            req.end();
        } else if (file) {
            headers["Content-Type"] = "multipart/form-data; boundary=----WebKitFormBoundarydfANBz6kTaOQhilX";
            _(headers).each(function(value, key) {
                req.setHeader(key, value);
            });
            req.write("------WebKitFormBoundarydfANBz6kTaOQhilX\r\n");
            req.write("Content-Disposition: form-data; name=\"upfile\"; filename=\""+fileName(file)+"\"\r\n");
            req.write("Content-Type: application/octet-stream\r\n");
            req.write("\r\n");
            var readStream = fs.createReadStream(file);
            readStream.on('data', function(data) {
                var flushed = req.write(data);
                if (!flushed) readStream.pause();
            });
            req.on('drain', function() {
                readStream.resume();
            });
            readStream.on('end', function() {
                req.write("\r\n");
                req.write("------WebKitFormBoundarydfANBz6kTaOQhilX--\r\n");
                req.end();
            });
        }
        else {
            _(headers).each(function(value, key) {
                req.setHeader(key, value);
            });
            req.end();
        }
    };
}

function fileName(path) {
    var parts = path.split(/\/|\\/);
    return parts[parts.length - 1];
}

function contentTypeFromHeader(headerValue) {
    if (headerValue.indexOf(";") != -1 ) {
        return headerValue.substring(0, headerValue.indexOf(";"));   
    } else {
        return headerValue;   
    }
}