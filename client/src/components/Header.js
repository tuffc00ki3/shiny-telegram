import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/Header.css";

class Header extends Component {
  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <a href="/" className="brand-logo">
            RaceTracker
          </a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>
              <Link to="/">create new +</Link>
            </li>
            <li>
              <Link to="/races">view all</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Header;
