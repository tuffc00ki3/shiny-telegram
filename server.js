const express = require("express");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
const proxy = require("http-proxy-middleware");
const MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(proxy("/api/*", { target: "http://localhost:3000" }));
app.use(express.static(__dirname + "/src"));

var db;
MongoClient.connect(keys.mongoURI, (err, client) => {
  if (err) {
    return console.log(err);
  }
  db = client.db("serverDB");
  app.listen(3000);
});

// API CALLS
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/layouts/index.html");
});

app.get("/viewAll", (req, res) => {
  res.sendFile(__dirname + "/layouts/viewAllRaces.html");
});

app.get("/allRaces", (req, res) => {
  db.collection("races")
    .find()
    .toArray(function(err, results) {
      if (err) {
        console.log(err);
      }
      res.send(results);
    });
});

app.get("/lastRace", (req, res) => {
  db.collection("races").findOne({ isLast_flag: true }, function(err, results) {
    if (err) {
      console.log(err);
    }
    res.send(results);
  });
});

app.post("/create", (req, res) => {
  var race = createRaceObject(req.body);
  db.collection("races").save(race, (err, result) => {
    if (err) {
      return console.log(err);
    }
    res.sendFile(__dirname + "/layouts/runRace.html");
  });
});

app.patch("/update/:id/:laps/:tt", (req, res) => {
  var id = req.params.id;
  var temp = req.params.laps;
  var newLapTimes = temp.split(",");
  var newTotalTime = req.params.tt;
  db.collection("riders").findOneAndUpdate(
    { _id: ObjectId(id) },
    { $set: { lapTimes: newLapTimes, totalTime: newTotalTime } },
    function(err, results) {
      if (err) {
        console.log(err);
      }
      res.send(results);
    }
  );
});

// TODO: patch race object

// HELPER FUNCTIONS
function unflagLastRace() {
  db.collection("races").findOneAndUpdate(
    { isLast_flag: true },
    { $set: { isLast_flag: false } },
    function(err, results) {
      if (err) {
        console.log(err);
      }
    }
  );
}

function createRaceObject(formValues) {
  var riderObjList = [];
  var keys = Object.keys(formValues);
  for (var i = 0; i < keys.length; i += 2) {
    if (keys[i] !== "title") {
      var riderObj = {
        name: formValues[keys[i]],
        num: formValues[keys[i + 1]],
        lapTimes: [],
        totalTime: 0
      };
      createRiderObject(riderObj); // delete this if you don't want to have a riders collection
      riderObjList.push(riderObj);
    } else {
      unflagLastRace();
      var raceObj = {
        title: formValues.title,
        numLaps: formValues.numLaps,
        riderList: riderObjList,
        isLast_flag: true
      };
      return raceObj;
    }
  }
}

function createRiderObject(obj) {
  db.collection("riders").save(obj, (err, result) => {
    if (err) {
      return console.log(err);
    }
    return result.ops;
  });
}
