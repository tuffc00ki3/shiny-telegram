var raceId;
var raceTitle;
var raceNumLap;
var raceRider;

var table;

function setUpUI() {
  table = document.getElementById("myTable");

  getApi("/lastRace", function(data) {
    var processedData = JSON.parse(data);

    raceId = processedData._id;
    raceTitle = processedData.title;
    raceNumLap = processedData.numLaps;
    raceRider = processedData.riderList;

    makeTable();
  });
}

function makeTable() {
  var titleHeader = document.getElementById("myTitle");
  titleHeader.textContent += raceTitle;

  var tblHead = document.getElementById("myTableHeader");
  var headerCell2 = document.createElement("th");
  headerCell2.innerHTML = "Pos.";
  tblHead.rows[0].appendChild(headerCell2);
  var headerCell3 = document.createElement("th");
  headerCell3.innerHTML = "Rider";
  tblHead.rows[0].appendChild(headerCell3);

  for (var c = 0; c < raceNumLap; c++) {
    var headerCell = document.createElement("th");
    headerCell.innerHTML = "Lap " + (c + 1);
    tblHead.rows[0].appendChild(headerCell);
  }

  var tHeaderCell = document.createElement("th");
  tHeaderCell.innerHTML = "Total Time";
  tblHead.rows[0].appendChild(tHeaderCell);

  var riderKeys = Object.keys(raceRider);

  for (var r = 0; r < riderKeys.length; r++) {
    var key = riderKeys[r];
    var rider = raceRider[key];
    var row = table.insertRow(r + 1); // +1 row offset to account for header
    var rNumCell = row.insertCell(0);
    var rPosCell = row.insertCell(1);
    var rNameCell = row.insertCell(2);
    rNumCell.innerHTML = rider.num;
    rNumCell.id = r + 1 + ",0";
    rNameCell.innerHTML = rider.name;
    for (c = 0; c < raceNumLap; c++) {
      var cell = row.insertCell(c + 3); // +3 column offset
      cell.id = r + 1 + "," + (c + 3); // rowIndex , columnIndex (with offsets)
      cell.innerHTML =
        "<input type='text' placeholder='00:00.000' value='' onchange='update(this.parentElement.id, this.value)'/>";
    }
    var totalCell = row.insertCell(parseInt(raceNumLap) + 3); // +3 column offset
    totalCell.id = r + 1 + "," + (raceNumLap + 3); // rowIndex , columnIndex (with offsets)
    totalCell.innerHTML = "00:00.000";
  }
}

// takes total time t (milliseconds) and converts it to 00:00.000 format
function formatTotalTime(t) {
  var min = ("0" + parseInt(t / 60000).toString()).slice(-2);
  var sec = ("0" + parseInt((t % 60000) / 1000).toString()).slice(-2);
  var msec = ("00" + ((t % 60000) % 1000).toString()).slice(-3);
  return min + ":" + sec + "." + msec;
}

function isLapTimeValid(input) {
  if (typeof input == "undefined") {
    return false;
  }
  if (input.length === 9 && input.charAt(2) == ":" && input.charAt(5) == ".") {
    input = input.replace(":", "");
    input = input.replace(".", "");
    for (var i = 0; i < input.length; i++) {
      if (!"0123456789".includes(input.charAt(i))) {
        return false;
      }
    }
    return true;
  }
  return false;
}

function isArrayValid(lapTimes) {
  for (var i = 0; i < lapTimes.length; i++) {
    if (typeof lapTimes[i] !== "number") {
      return false;
    }
  }
  return true;
}

function showRankings(rankings) {
  var rankingsMap = {};
  var riderID;
  var positionCell;
  var position;
  for (var i = 0; i < rankings.length; i++) {
    riderID = rankings[i].id;
    rankingsMap[riderID] = i + 1;
  }
  for (r = 1; r < table.rows.length - 1; r++) {
    positionCell = table.rows[r].cells[1];
    var id = table.rows[r].cells[0].innerHTML;
    position = rankingsMap[id];
    positionCell.innerHTML = position;
    if (position === 1) {
      table.rows[r].style.backgroundColor = "#d5ff80";
    } else {
      table.rows[r].style.backgroundColor = "#f2f2f2";
    }
  }
}

function getSum(total, num) {
  return total + num;
}

function updateTotalTime(rider, input, totalCell, flag) {
  var t = 0; // time in milliseconds
  if (flag) {
    // there is invalid input, total time is 0
    totalCell.innerHTML = t;
    rider.totalTime = t;
    return;
  }
  var lapArray = rider.lapTimes;
  t = lapArray.reduce(getSum);
  totalCell.innerHTML = formatTotalTime(t);
  rider.totalTime = t;
  return;
}

// takes input of the form 00:00.000 and converts to milliseconds
function convertStringToNum(lapTime) {
  var t = 0;
  var charArray = lapTime.replace(".", ":").split(":"); // [minutes, seconds, milliseconds]
  t +=
    parseInt(charArray[0]) * 60 * 1000 +
    parseInt(charArray[1]) * 1000 +
    parseInt(charArray[2]);
  return t;
}

function getRiderfromNum(num) {
  keys = Object.keys(raceRider);
  for (var i = 0; i < keys.length; i++) {
    var rider = raceRider[keys[i]];
    if (rider.num == num) {
      return rider;
    }
  }
}

function getRankings() {
  // create an array of sets- one set per rider, containing riderID, lapCount, and totalTime
  var sortArray = [];
  Object.keys(raceRider).forEach(function(key) {
    var riderData = {};
    var rider = raceRider[key];
    var lapCount = 0;
    var totalTime = rider.totalTime;
    for (var l = 0; l < rider.lapTimes.length; l++) {
      if (typeof rider.lapTimes[l] === "number") {
        lapCount += 1;
      }
    }
    riderData = { id: rider.num, lc: lapCount, tt: totalTime };
    sortArray.push(riderData);
  });
  // sort the array first by decreasing lapCount (highest lapCount first), then by increasing totalTime(lowest totalTime first)
  sortArray.sort(function(a, b) {
    return b.lc - a.lc || a.tt - b.tt;
  });
  return sortArray;
}

// checks if user input 'newValue' in cell 'id' is valid and updates total time / race rankings accordingly
function update(id, newValue) {
  var cell = document.getElementById(id);
  var cellID = id.split(",");
  var row = cellID[0];
  var lapcolumn = cellID[1];
  var numLaps = parseInt(raceNumLap);
  var totalCell = table.rows[row].cells[numLaps + 3]; // +3 column offset
  var riderNum = table.rows[row].cells[0].innerHTML;

  rider = getRiderfromNum(riderNum);
  var riderID = rider.num;
  var riderLapTimes = rider.lapTimes;

  if (isLapTimeValid(newValue)) {
    cell.value = newValue;
    var time = convertStringToNum(newValue); // take lap time input and convert to milliseconds
    riderLapTimes[lapcolumn - 3] = time; // -3 column offset
    if (isArrayValid(riderLapTimes)) {
      updateTotalTime(rider, time, totalCell, 0);
      // TODO: update rider data in MongoDB -- both laptimes and totalTime
      // todo: make this api
      var id = rider._id;
      patchApi(
        "/update/" + id + "/" + rider.lapTimes + "/" + rider.totalTime,
        function(data) {}
      );
    } else {
      updateTotalTime(rider, time, totalCell, 1);
    }
  } else {
    cell.value = NaN;
    riderLapTimes[lapcolumn - 3] = NaN; // -3 column offset
    updateTotalTime(rider, 0, totalCell, 1);
    alert(
      "Invalid input. Please enter minutes, seconds, and milliseconds in the format 00:00.000"
    );
  }
  var rankings = getRankings();
  showRankings(rankings);
}
