const express = require("express");
const Race = require("../models/Race");

const router = express.Router();

router.get("/api/races/all", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  Race.find({}).exec((err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("getting all races");
    res.send(result);
  });
});

router.get("/api/races/last", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  Race.findOne({ isLast_flag: true }, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("getting last race");
    res.send(result);
  });
});

router.get("/api/races/:id", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  Race.findOne({ _id: req.params.id }, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("getting race with id " + req.params.id);
    res.send(result);
  });
});

router.post("/api/races/new/:title/:numLaps/:riders", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

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
  var riderData = JSON.parse(req.params.riders);
  var riderObjects = [];
  for (var i = 0; i < riderData.length; i++) {
    var riderObj = {
      name: riderData[i].name,
      num: riderData[i].num
    };
    riderObjects.push(riderObj);
  }
  var raceData = {
    title: req.params.title,
    numLaps: req.params.numLaps,
    riders: riderObjects,
    isLast_flag: true
  };
  var r = new Race(raceData);
  var promise = r.save();
  promise.then(function(doc) {
    console.log("post request complete");
    res.send();
  });
});

// used POST instead of PATCH/PUT because of no-cors & access control allow origin errors
router.post("/api/races/:raceId/:riderID/:riderLapTimes/:tt", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
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

module.exports = router;
