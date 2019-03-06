const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const proxy = require("http-proxy-middleware");
const routes = require("./src/routes/api");
const keys = require("./config/keys");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.static(__dirname + "/src"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", routes);

mongoose.connect(keys.mongoURI);

app.listen(PORT);
