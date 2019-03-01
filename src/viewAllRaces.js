function setUpUI() {
  getApi("/allRaces", function(data) {
    var processedData = getRaceData(JSON.parse(data));

    var raceIds = processedData.ids;
    var raceTitles = processedData.titles;
    var raceNumLaps = processedData.numLaps;
    var raceRider = processedData.riders;

    var container = document.getElementById("raceContainer");

    for (var i = 0; i < raceIds.length; i++) {
      var p2 = document.createElement("h2");
      var n2 = document.createTextNode(raceTitles[i]);
      p2.appendChild(n2);

      var p3 = document.createElement("h3");
      var n3 = document.createTextNode("number of Laps: " + raceNumLaps[i]);
      p3.appendChild(n3);

      var p4 = document.createElement("p");
      var n4 = document.createTextNode("--RIDERS-- ");
      var riders = raceRider[i];
      p4.appendChild(n4);

      container.appendChild(p2);
      container.appendChild(p3);
      container.appendChild(p4);

      for (var j = 0; j < riders.length; j++) {
        var rider = riders[j];

        var name = rider.name;
        var num = rider.num;
        //var lapTimes = rider.lapTimes;
        //var totalTime = rider.totalTime;

        var p = document.createElement("p");
        var n = document.createTextNode(name + " (" + num + ")");
        p.appendChild(n);
        //var p2 = document.createElement("p");
        //var n2 = document.createTextNode(
        //    "Lap Times: " + lapTimes + "  Total Time: " + totalTime
        //  );
        //    p2.appendChild(n2);

        container.appendChild(p);
        //    container.appendChild(p2);
      }
    }
  });
}

function getRaceData(data) {
  var map = {};

  var idArray = [];
  var titleArray = [];
  var numLapsArray = [];
  var riderArray = [];

  for (var i = 0; i < data.length; i++) {
    var raceData = data[i];

    var id = raceData._id;
    var title = raceData.title;
    var numLaps = raceData.numLaps;
    var riderList = raceData.riderList;

    idArray.push(id);
    titleArray.push(title);
    numLapsArray.push(numLaps);
    riderArray.push(riderList);
  }

  map["ids"] = idArray;
  map["titles"] = titleArray;
  map["numLaps"] = numLapsArray;
  map["riders"] = riderArray;

  return map;
}
