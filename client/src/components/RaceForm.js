import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { reduxForm, Field, FieldArray } from "redux-form";
import RiderFormField from "./RiderFormField";
import "../css/RaceForm.css";

class RaceForm extends React.Component {
  state = {
    riders: [{ name: "", num: "" }],
    title: "",
    numLaps: "",
    redirect: false
  };

  addRider = e => {
    this.setState(prevState => ({
      riders: [...prevState.riders, { name: "", num: "" }]
    }));
  };

  setRedirect = () => {
    this.setState(() => ({ redirect: true }));
  };

  handleChange = e => {
    if (["name", "num"].includes(e.target.className)) {
      let riders = [...this.state.riders];
      riders[e.target.dataset.id][e.target.className] = e.target.value;
      this.setState({ riders }, () => console.log(this.state.riders));
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  handleSubmit = e => {
    e.preventDefault();

    var data = {
      title: this.state.title,
      numLaps: this.state.numLaps,
      riders: this.state.riders
    };

    postData("http://localhost:5000/api/races/new", data)
      .then(response => {
        console.log(response);
        console.log("post call complete");
      })
      .then(this.setRedirect())
      .catch(error => console.error(error));

    function postData(url = "", data = {}) {
      url +=
        "/" +
        data.title +
        "/" +
        data.numLaps +
        "/" +
        JSON.stringify(data.riders);

      return fetch(url, {
        method: "POST",
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
  };

  render() {
    let { title, numLaps, riders, redirect } = this.state;
    if (this.state.redirect) {
      return <Redirect to="/races/run" />;
    }
    return (
      <form id="form" onSubmit={this.handleSubmit} onChange={this.handleChange}>
        <div id="field1">
          <label htmlFor="name">Race Title</label>
          <input type="text" name="title" id="title" value={title} />
        </div>
        <div id="field2">
          <label htmlFor="numLaps">Number of Laps</label>
          <input type="text" name="numLaps" id="numLaps" value={numLaps} />
        </div>
        <div id="riderList">
          <RiderFormField riders={riders} />
        </div>
        <button id="addRiderButton" type="button" onClick={this.addRider}>
          + add rider
        </button>
        <div>
          <input id="submitButton" type="submit" value="Submit" />
        </div>
      </form>
    );
  }
}
export default RaceForm;
