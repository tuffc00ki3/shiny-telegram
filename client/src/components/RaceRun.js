import React, { Component } from "react";
import RunTable from "./RunTable";
import "../css/RaceRun.css";

class RaceRun extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      race: []
    };
  }

  componentDidMount() {
    fetch("http://localhost:5000/api/races/last")
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
        <div className="container">
          <p id="raceTitle">{race.title}</p>
          <RunTable
            raceID={race._id}
            riders={race.riders}
            numLaps={race.numLaps}
          />
        </div>
      );
    }
  }
}

export default RaceRun;
