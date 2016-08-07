var express = require("express");
var mongodb = require("mongodb");

mongodb.MongoClient.connect("mongodb://localhost:27017/fruits", function(err, db) {
  if (err) {
    console.err(err);
    process.exit(1);
  }


  var app = express();

  app.use(express.static("public"));

  app.set("views", "views");
  app.set("view engine", "pug");
  app.use(function(req, res, next) {
    if (req.path == "/") {
      res.render("index");
    } else {
      var template = req.path.match(/^\/templates\/(.*)/);
      if (template) {
        res.render(template[1]);
      } else {
        next();
      }
    }
  });

  app.post("/fruits/:name", function(req, res, next) {
    db.collection("fruits").insert({ name: req.params.name }, function(err) {
      if (err) return next(err);
      res.send("");
    });
  });

  app.get("/fruits", function(req, res, next) {
    db.collection("fruits").find({}, { sort: "name" }).toArray(function(err, fruits) {
      if (err) return next(err);
      res.send(fruits);
    });
  });

  app.delete("/fruits/:name", function(req, res, next) {
    db.collection("fruits").deleteMany({ name: req.params.name }, function(err) {
      if (err) return next(err);
      res.send("");
    });
  });

  app.listen(3030);

});
