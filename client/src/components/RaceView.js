import React, { Component } from "react";
import "../css/RaceView.css";

class RaceView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      race: []
    };
  }

  componentDidMount() {
    var url = window.location.href;
    var urlparsed = url.split("/");
    var raceID = urlparsed[urlparsed.length - 1];
    console.log(raceID);
    fetch("http://localhost:5000/api/races/" + raceID)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            race: result
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  render() {
    const { error, isLoaded, race } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      console.log(this.state);
      return (
        <div className="container" id="race">
          <p id="raceTitle">{race.title}</p>
          <p id="numLaps">number of laps: {race.numLaps}</p>
          <div>
            {race.riders.map(function(rider, index) {
              return (
                <div id="riderRow">
                  <p id="riderInfo">
                    {rider.num} | {rider.name}
                  </p>
                  <p id="times">[{rider.lapTimes.toString()}]</p>
                  <p id="total">{rider.totalTime}</p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  }
}

export default RaceView;
