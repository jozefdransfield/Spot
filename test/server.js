var express = require("express");
var form = require('connect-form');
var _ = require("underscore")._;

var app = express.createServer();

app.configure(function() {
    app.use(express.bodyParser());
    app.use(form({ keepExtensions: true}))
    app.use(app.router);
    app.use(express.cookieParser());
});

app.get("/echo", function(req, res) {
  echoRequest(req, res);
});

app.put("/echo", function(req, res) {
  echoRequest(req, res);
});

app.delete("/echo", function(req, res) {
    echoRequest(req, res);
});

app.post("/echo", function(req, res) {
   echoRequest(req, res);
});

app.post("/fileupload", function(req, res) {
   req.form.complete(function(err, fields, files) {
      var fileNames = _(files).map(function(file) {
          return file.name;
      });
      res.send({response: "success", files: fileNames}); 
   });
});

app.listen(process.env.C9_PORT);

function echoRequest(req, res) {
    if (req.headers["accept"] == "application/json") {
        res.send({response: "success", headers: req.headers, body: req.body});
    } else {
        res.send("Unknown Accept type");
    }
}