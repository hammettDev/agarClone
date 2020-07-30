const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));
const PORT = 8080;
const socketio = require("socket.io");

const expressServer = app.listen(PORT);

const io = socketio(expressServer);
const helmet = require("helmet");
app.use(helmet());

console.log(`server listening on port ${PORT}`);


module.exports = {
    app,
    io
}