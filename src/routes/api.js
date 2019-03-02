const express = require("express");
const Race = require("../models/Race");

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/layouts/index.html");
});

router.get("/viewAll", (req, res) => {
  res.sendFile(__dirname + "/layouts/viewAllRaces.html");
});

router.get("/races/all", (req, res) => {
  Race.find({}).exec((err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

router.get("/races/last", (req, res) => {
  Race.findOne({ isLast_flag: true }, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("getting last race");
    res.send(result);
  });
});

router.post("/races", (req, res) => {
  Race.findOneAndUpdate(
    { isLast_flag: true },
    { isLast_flag: false },
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log("last race unflagged");
    }
  );
  var riderObjects = getRiderObj(req.body);
  var raceData = {
    title: req.body.title,
    numLaps: req.body.numLaps,
    riders: [],
    isLast_flag: true
  };
  var r = new Race(raceData);
  var promise = r.save();
  promise.then(function(doc) {
    for (var i = 0; i < riderObjects.length; i++) {
      var rider = riderObjects[i];
      console.log(rider);
      doc.riders.push(rider);
    }
    doc.save().then(function(doc) {
      res.sendFile(__dirname + "/layouts/runRace.html");
    });
  });
});

router.patch("/races/:raceId/:riderID/:riderLapTimes/:tt", (req, res) => {
  Race.findOneAndUpdate(
    { _id: req.params.raceId, "riders._id": req.params.riderID },
    {
      "riders.$.lapTimes": req.params.riderLapTimes.split(","),
      "riders.$.totalTime": req.params.tt
    },
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log("sucessfully updated race");
      res.send();
    }
  );
});

function getRiderObj(data) {
  var myRiders = [];
  var keys = Object.keys(data);
  for (var i = 0; i < keys.length; i += 2) {
    if (keys[i] !== "title") {
      var riderObj = {
        name: data[keys[i]],
        num: data[keys[i + 1]],
        lapTimes: [],
        totalTime: 0
      };
      myRiders.push(riderObj);
    }
  }
  return myRiders;
}

module.exports = router;
