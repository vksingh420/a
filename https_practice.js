const http = require('http');

const server = http.createServer((req, res) => {
  console.log(req.url, req.method)

  res.setHeader('Content-Type', 'text/plain');
  res.write('poojaaaaa');
  res.end();

});

server.listen(3000, 'localhost', () => {
    console.log("listening for requests")
});