var url = require("url");
var http = require("http");
var _ = require("underscore")._;
var util = require("util");
var fs = require("fs");
var nodePath = require('path');

module.exports = {
    get: function(target) {
        var builder = new Request(new SpotContentTypes());
        builder.target(target);
        builder.method("GET");
        builder.header("content-type", "application/json");
        builder.header("Accept", "application/json");
        return builder;
    },
    put: function(target) {
        var builder = new Request(new SpotContentTypes());
        builder.target(target);
        builder.method("PUT");
        builder.header("content-type", "application/json");
        builder.header("Accept", "application/json");
        return builder;
    },
    post: function(target) {
        var builder = new Request(new SpotContentTypes());
        builder.target(target);
        builder.method("POST");
        builder.header("content-type", "application/json");
        builder.header("Accept", "application/json");
        return builder;
    },
    delete: function(target) {
        var builder = new Request(new SpotContentTypes());
        builder.target(target);
        builder.method("DELETE");
        builder.header("content-type", "application/json");
        builder.header("Accept", "application/json");
        return builder;
    }
};


function SpotContentTypes() {
    this["application/json"] = {
        fromString: function(str) {
            return JSON.parse(str);    
        },
        toString: function(obj) {
            return JSON.stringify(obj);   
        }
    };
    this.default = {
        fromString: function(str) {
            return str;        
        },
        toString: function(obj) {
            return obj;    
        }
    };
    
    this.fromString = function(contentType, str) {
        if (this[contentType] && this[contentType].fromString) {
            return this[contentType].fromString(str);
        } else {
            return this.default.fromString(str);
        }  
    }
    
    this.toString = function(contentType, obj) {
        if (this[contentType] && this[contentType].toString) {
            return this[contentType].toString(obj);
        } else {
            return this.default.toString(obj);
        }
    }
        
}

function Response() {
    this.status;
    this.data;
}

function Request(contentTypes) {
    var host;
    var path;
    var port;
    var method;
    var accept;
    var body;
    var file;
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
    this.accepts = function(requestAccepts) {
        accept = requestAccepts;
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
                //try {
                    var key = contentTypeFromHeader(res.headers["content-type"]);
                    console.log(key);
                    resp = contentTypes.fromString(key, data);
                //}
            //    catch (e) {
              //      console.log("Failed to parse data:", data);
                //}
                var retVal = new Response();
                retVal.status = res.statusCode;
                retVal.data = resp;
                callback(null, retVal);
            })
        });
        req.on('error', function(e) {
            callback(e);
        });
        
        
        if (body) {//TODO use the header param
            var toSend = contentTypes.toString(contentTypeFromHeader(headers["content-type"]), body);
            console.log(toSend);
           
            req.setHeader("Content-Length", toSend.length);
            console.log("I went in here");

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
            req.write("Content-Disposition: form-data; name=\"upfile\"; filename=\""+fileName(file)+"\"\r\n")
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
    }
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