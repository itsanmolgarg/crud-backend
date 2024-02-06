"use strict";

const express = require("express");
const { connectToDatabase } = require("./db/connection");
const app = express();
const port = process.env.PORT || 9000;
const routes = require("./routes");

app.use(express.json());
app.use(routes);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, async () => {
    await connectToDatabase();
  });
  console.log("Express started. Listening on %s", port);
}

module.exports = app;
