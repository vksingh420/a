var express = require('express');
var app = express();
var things = require('./things')
var cookieParser = require('cookie-parser');

// app.get('/', function(req, res){
//    res.send("Poojg :)");
// });

app.use('/things', things)
app.use(cookieParser())
app.listen(40111);



// function myFirst() {
//     myDisplayer("Hello");
//   }
  
//   function mySecond() {
//     myDisplayer("Goodbye");
//   }
  
//   myFirst();
//   mySecond();