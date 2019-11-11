const uuidv4 = require("uuid/v4");
const express = require("express");
const http = require("http");
const Websocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new Websocket.Server({ server });

const logger = require("morgan");
const userScript = require("./libs/modules/userScript");
const repl = require("./libs/modules/repl");

app.use(express.static("."));
app.use(logger("dev"));

const sendDelimiterToClient = (ws, uuid) => {
  ws.send(JSON.stringify({ type: "delimiter", data: uuid }));
};

wss.on("connection", ws => {
  ws.on("message", msg => {
    const codeStrArr = JSON.parse(msg);
    const codeString = codeStrArr.join("");
    const delimiter = uuidv4();
    sendDelimiterToClient(ws, delimiter);

    const scriptString = codeStrArr.join(`console.log("${delimiter}")\n`);
    userScript.writeFile(scriptString, "JAVASCRIPT").then(() => {
      userScript
        .execute(ws)
        .then(() => repl.execute(codeString, "JAVASCRIPT"))
        .then(returnData => repl.parseOutput(returnData, "JAVASCRIPT"))
        .then(returnValue => {
          ws.send(JSON.stringify({ type: "return", data: returnValue }));
        })
        .catch(data => {
          debugger;
          ws.send(data);
        });
    });
  });
});

server.listen(3000, () => {
  console.log("App started");
});
