import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "../css/App.css";

import Header from "./Header";
import RaceForm from "./RaceForm";
import RaceRun from "./RaceRun";
import RaceDash from "./RaceDash";
import RaceView from "./RaceView";

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div id="appBody">
            <Header />
            <Route exact path="/" render={() => <RaceForm />} />
            <Route exact path="/races" component={RaceDash} />
            <Route path="/races/run" component={RaceRun} />
            <Route path="/races/view" component={RaceView} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
