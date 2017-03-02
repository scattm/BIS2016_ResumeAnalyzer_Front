var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var path = require('path');

var app = express();
var db;

app.use(express.static('static'));

app.get('/api/persons', function (req, res) {
    var filter = {
        resume_content: {$ne: ""},
        resume_language: 'en',
        personality_profile: {$exists: true}
    };
    if (req.query.searchText) {
        filter.resume_content = {
            $regex: new RegExp('.*' + req.query.searchText.toLowerCase() + '.*', "i"),
            $ne: ""
        };
    }

    db.collection("persons").find(filter).toArray(function (errs, docs) {
        res.json(docs);
    })
});

app.get('/api/person/:pid', function (req, res) {
    db.collection("persons").findOne({"_id": ObjectId(req.params.pid)}, function (errs, docs) {
        res.json(docs);
    });
});

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'static/index.html'))
});

MongoClient.connect('mongodb://localhost/resume_analyzer', function (err, dbConn) {
    db = dbConn;
    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log("Resume Analyzer Web start at port", port);
    });
});
