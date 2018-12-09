import React, { Component } from "react";
import fire from "../config/Fire";
import { ClipLoader } from "react-spinners";
import { SyncLoader } from "react-spinners";


export default class Shift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shiftLoaded: false
    };
  }

  componentWillReceiveProps = props => {
    this.setState({ shiftLoaded: true });
  };

  render() {
    if (!this.state.shiftLoaded) {
      return null
    }
    
    const shift = this.props.shift;
    let tbody = shift.waiters.map(waiter => {
      return (
        <tr>
          <td><img src={waiter.avatar} className="avatar-big" /></td>
          <td>{waiter.name}</td>
          <td>{waiter.startHour}</td>
          <td>{waiter.endHour}</td>
          <td>{waiter.totalHours}</td>
          <td>{waiter.salery}</td>
          <td>{waiter.saleryAccepted}</td>
          <td>{waiter.makeupPay}</td>
        </tr>
      );
    });

    return (
      <div className="">
        <div className="card">
          <div className="card-header bg-info text-white">
          <span className="mr-1">
            {shift.date.getDate()}/{shift.date.getMonth() + 1}/{shift.date.getFullYear()}
          </span>
          <span>
            {shift.shiftTime}
          </span>
          
          </div>
          <div className="card-body">
            <table className="table">
              <thead className="">
                <tr>
                  <th />
                  <th>Waiter Name</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Total Time</th>
                  <th>Total Salery</th>
                  <th>Salery Accepted</th>
                  <th>Makeup Pay</th>
                </tr>
              </thead>
              <tbody>{tbody}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
