var express = require("express");
var form = require('connect-form');
console.log(form);

var app = express.createServer();

app.configure(function() {
    app.use(express.bodyParser());
    app.use(form({ keepExtensions: true}))

    app.use(app.router);
    app.use(express.methodOverride());
    app.use(express.cookieParser());

    app.use(express.session({ secret: 'keyboard cat' }));
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


app.get("/respondJson", function(req, res) {
   res.send({response: "success", headers: req.headers}); 
});

app.put("/respondJson", function(req, res) {
   res.send({response: "success", headers: req.headers}); 
});

app.delete("/respondJson", function(req, res) {
   res.send({response: "success", headers: req.headers}); 
});

app.post("/respondJson", function(req, res) {
   res.send({response: "success", headers: req.headers}); 
});

app.post("/fileupload", function(req, res) {
   req.form.complete(function(err, fields, files) {
      res.send({response: "success"}); 
   });
});

app.listen(process.env.C9_PORT);