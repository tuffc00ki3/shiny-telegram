import React, { Component } from "react";
import RiderRow from "./RiderRow";
import "../css/RunTable.css";

class RunTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rankings: {},
      positions: {}
    };
  }

  createMarkup(id) {
    if (this.props.rankings == undefined || this.props.rankings == null) {
      return { __html: "" };
    } else {
      Object.keys(this.props.rankings).forEach(function(key) {
        if (id == key) {
          return { __html: this.props.rankings[id] };
        }
      });
      return { __html: "" };
    }
  }

  update() {
    var sortArray = [];
    var rankings = this.state.rankings;
    Object.keys(rankings).forEach(function(key) {
      var rider = rankings[key];
      var data = { id: key, lc: rider.lc, tt: rider.tt };
      sortArray.push(data);
    });
    // sort the array first by decreasing lapCount (highest lapCount first), then by increasing totalTime(lowest totalTime first)
    sortArray.sort(function(a, b) {
      return b.lc - a.lc || a.tt - b.tt;
    });
    return sortArray;
  }

  handleRankings = riderData => {
    var rankMap = this.state.rankings;
    var riderID = riderData.id;
    rankMap[riderID] = { lc: riderData.lapCount, tt: riderData.totalTime };
    this.setState({ rankings: rankMap }, function() {
      var riderRankings = this.update();
      for (var i = 0; i < riderRankings.length; i++) {
        var cellID = "pos" + riderRankings[i].id;
        var rowID = "row" + riderRankings[i].id;
        var cell = document.getElementById(cellID);
        var row = document.getElementById(rowID);
        cell.innerHTML = i + 1;
        if (i === 0) {
          row.style.backgroundColor = "#d5ff80";
        } else {
          row.style.backgroundColor = "#35d3d2";
        }
      }
    });
  };

  lapHeaderCells() {
    var cells = [];
    for (var i = 0; i < this.props.numLaps; i++) {
      cells.push(<th>Lap {i + 1}</th>);
    }
    return cells;
  }

  riderRows() {
    var rows = [];
    for (var r = 0; r < this.props.riders.length; r++) {
      var rider = this.props.riders[r];
      var rowID = "row" + rider._id;
      rows.push(
        <tr id={rowID}>
          <RiderRow
            sendData={this.handleRankings}
            raceID={this.props.raceID}
            rider={rider}
            numLaps={this.props.numLaps}
          />
        </tr>
      );
    }
    return rows;
  }

  render() {
    return (
      <div>
        <table id="m">
          <thead id="mth">
            <tr id="mhr">
              <th>Position</th>
              <th>Racing Number</th>
              <th>Rider</th>
              {this.lapHeaderCells()}
              <th>Total Time</th>
            </tr>
          </thead>
          <tbody id="mtb">{this.riderRows()}</tbody>
        </table>
      </div>
    );
  }
}

export default RunTable;
