const http = require("http");
const app = require("./app");
const dotEnv = require("dotenv").config();

app.set("port", process.env.PORT);
const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});

// !!!!!!!!!!!!condition test port
