var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'polyAdb'
    },
    port: 3005
  },

  production: {
    root: rootPath,
    app: {
      name: 'polyAdb'
    },
    port: 3001
  }
};

config[env].mongo = require('./db/' + env + '.json');
config[env].mongo.url = 'mongodb://localhost:27017';
module.exports = config[env];
