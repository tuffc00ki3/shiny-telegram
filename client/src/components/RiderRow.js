import React, { Component } from "react";

function createMarkup(text) {
  return { __html: text };
}

function formatTotalTime(t) {
  var min = ("0" + parseInt(t / 60000).toString()).slice(-2);
  var sec = ("0" + parseInt((t % 60000) / 1000).toString()).slice(-2);
  var msec = ("00" + ((t % 60000) % 1000).toString()).slice(-3);
  return min + ":" + sec + "." + msec;
}

function isLapTimeValid(input) {
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

function convertLapTimeToNum(lapTime) {
  var t = 0;
  var lt = lapTime.replace(".", ":").split(":"); // [minutes, seconds, milliseconds]
  t += parseInt(lt[0]) * 60 * 1000 + parseInt(lt[1]) * 1000 + parseInt(lt[2]);
  return t;
}

function getSum(total, num) {
  return total + num;
}

class RiderRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lapTimes: this.props.rider.lapTimes,
      totalTime: this.props.rider.totalTime
    };
  }

  handleChange = event => {
    var cellID = event.target.id;
    var info = cellID.split(",");
    var lapIndex = info[1];
    var value = event.target.value;
    var lapTimeArray = this.state.lapTimes;

    if (isLapTimeValid(value) || value === "") {
      if (value === "") {
        lapTimeArray[lapIndex] = 0;
      } else {
        lapTimeArray[lapIndex] = convertLapTimeToNum(value);
      }

      var tt = lapTimeArray.reduce(getSum);

      this.setState({ totalTime: tt, lapTimes: lapTimeArray }, function() {
        this.update({
          raceID: this.props.raceID,
          riderID: this.props.rider._id,
          lapTimeArray: this.state.lapTimes,
          totalTime: this.state.totalTime
        });
        this.props.sendData({
          id: this.props.rider._id,
          lapCount: this.state.lapTimes.length,
          totalTime: this.state.totalTime
        });
      });
    }
  };

  update(data) {
    patchData("http://localhost:5000/api/races/", data)
      .then(console.log("patch call complete"))
      .catch(error => console.error(error));

    function patchData(url = "", data = {}) {
      url +=
        data.raceID +
        "/" +
        data.riderID +
        "/" +
        data.lapTimeArray +
        "/" +
        data.totalTime;

      return fetch(url, {
        method: "POST", // used POST instead of PATCH/PUT because of no-cors & access control allow origin errors
        mode: "no-cors",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        redirect: "follow",
        referrer: "no-referrer",
        body: JSON.stringify(data)
      });
    }
  }

  render() {
    var cells = [];
    cellID = "pos" + this.props.rider._id;
    console.log(cellID);
    cells.push(<td id={cellID} />);
    cells.push(
      <td
        id="riderNumCell"
        dangerouslySetInnerHTML={createMarkup(this.props.rider.num)}
      />
    );
    cells.push(
      <td
        id="riderNameCell"
        dangerouslySetInnerHTML={createMarkup(this.props.rider.name)}
      />
    );
    for (var i = 0; i < this.props.numLaps; i++) {
      var cellID = this.props.rider._id + "," + i;
      cells.push(
        <td>
          <input
            id={cellID}
            type="text"
            placeholder="00:00.000"
            onChange={this.handleChange}
          />
        </td>
      );
    }
    cells.push(
      <td
        dangerouslySetInnerHTML={createMarkup(
          formatTotalTime(this.state.totalTime)
        )}
      />
    );
    return cells;
  }
}

export default RiderRow;
