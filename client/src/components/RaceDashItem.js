import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../css/RaceDashItem.css";

class RaceDashItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  redirect(id) {
    let path = "races/view/" + id;
    this.props.history.push(path);
  }

  render() {
    return (
      <div id="item">
        <p id="title">{this.props.title}</p>
        <p id="numLaps">Number of Laps: {this.props.numLaps}</p>
        <div>
          <button
            id="viewResults"
            type="button"
            onClick={() => this.redirect(this.props.raceID)}
          >
            view results
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(RaceDashItem);
