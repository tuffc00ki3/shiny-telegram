import React, { Component } from "react";
import "../css/RiderFormField.css";

export default ({ riders }) => {
  return riders.map((val, i) => {
    let riderName = `name-${i}`,
      racingNum = `num-${i}`;
    return (
      <div key={i}>
        <p id="riderIndex"> {`rider #${i + 1}`}</p>
        <div id="riderName">
          <label htmlFor={riderName}>Rider Name</label>
          <input
            type="text"
            name={riderName}
            data-id={i}
            id={riderName}
            value={riders[i].name}
            className="name"
          />
        </div>
        <div id="riderNum">
          <label htmlFor={racingNum}>Racing Number</label>
          <input
            type="text"
            name={racingNum}
            data-id={i}
            id={racingNum}
            value={riders[i].num}
            className="num"
          />
        </div>
      </div>
    );
  });
};
