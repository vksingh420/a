const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const mongoose = require("mongoose");
const glob = require("glob");

const morgan = require("morgan");

const config = require("./config");

app.use(morgan("tiny")); // HTTP request logger

app.use(express.static('dist'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// require('./config/s3stream')(app);    // Middleware for S3 streaming

// Routes
// const routes = glob.sync(config.root + '/routers/*.js');

let routes_dir = config.root + "/routers/*.js";
const routes = glob.sync(routes_dir.replace(/\\/g, "/"));

routes.forEach((router) => {
  app.use("/", require(router));
});

app.all("*", (req, res) => {
  //   res.status(200).sendFile(config.root + '/dist/mecp2/index.html');
  res.status(200).sendFile(config.root);
});

// Mongoose
// mongoose.connect('mongodb://localhost:27017?authSource="polyAdb"')
//   .then(() => {
//     console.log('Connected to Mongo DB');
//     console.log(mongoose.connection.readyState)

//     server.listen(config.port, () => {
//       console.log('Listening ' + config.port);
//     });
//   }).catch((err) => {
//     console.log('Error connecting Mongo DB');
//     console.error(err);
//   });

mongoose
  .connect(config.mongo.url + "?authSource=" + config.mongo.database, {
    dbName: config.mongo.database,
    user: config.mongo.username,
    pass: config.mongo.password,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to Mongo DB");
    const db = mongoose.connection;

    server.listen(config.port, () => {
      console.log(`Server Running on http://localhost:${config.port}/`);
    });
  })
  .catch((err) => {
    console.log("Error connecting Mongo DB");
    console.error(err);
  });
