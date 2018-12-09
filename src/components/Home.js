import React, { Component } from "react";
import ShiftTime from "./AddNewShiftTime";
import LatestShift from "./LatestShift";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataAdded: false
    };
  }

  onDataAdded = () => {
    this.setState({ dataAdded: true });
  };

  switchStateToFalse = () => {
    this.setState({ dataAdded: false });
  };

  render() {
    return (
      <div>
        <div className="row bg-info py-1 text-white ">
          <div className="container">
          <i className="far fa-clock mr-2 heading-icon"></i>
        <span className="heading-span">Active Shift</span>
          </div>
        </div>
      <div className="container">
      
        <div className="mt-3">
        <ShiftTime user={this.props.user} onDataAdded={this.onDataAdded} userData={this.props.userData} />
        <hr />
        <LatestShift appState={this.props.appState} parentState={this.state.dataAdded} switchStateToFalse={this.switchStateToFalse} />
        </div>
      </div>
      </div>
    );
  }
}

export default Home;
