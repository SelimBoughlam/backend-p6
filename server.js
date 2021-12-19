const http = require("http");

const server = http.createServer((req, res) => {
  res.end("voila la réponseeeee");
});

server.listen(process.env.PORT || 3000);
