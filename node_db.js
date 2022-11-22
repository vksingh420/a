var express = require('express');
var app = express();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/polyAdb');
var personSchema = mongoose.Schema({
    name: String,
    age: Number,
    nationality: String
 });
 
 var Person = mongoose.model("Person", personSchema);

 app.get('/person', function(req, res){
    res.render('person');
 });

 app.listen(3000);