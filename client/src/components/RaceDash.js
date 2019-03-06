import React, { Component } from "react";
import RaceDashItem from "./RaceDashItem";
import "../css/RaceDash.css";

class RaceDash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      races: []
    };
  }

  componentDidMount() {
    fetch("http://localhost:5000/api/races/all")
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            races: result
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
    const { error, isLoaded, races } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div id="container" className="container">
          {races.map(function(race, index) {
            return (
              <div>
                <RaceDashItem
                  title={race.title}
                  numLaps={race.numLaps}
                  riders={race.riders}
                  raceID={race._id}
                />
              </div>
            );
          })}
        </div>
      );
    }
  }
}

export default RaceDash;
