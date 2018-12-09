import React, { Component } from "react";
import fire from "../config/Fire";
import { PropagateLoader } from "react-spinners";

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMonth: new Date().getMonth(),
      isEmpty: true,
      data: [],
      sumData: {
        totalHours: 0,
        totalSalary: 0,
        totalSalaryAccepted: 0,
        totalMakeup: 0
      },
    };
  }
  componentDidMount = (e) => {
    this.fetchData(e, this.state.selectedMonth);
  }
  onChange = e => {
    e.preventDefault();
    this.setState({ selectedMonth: e.target.value });
  };

  fetchData = (e, month) => {
    if(e != undefined)
      e.preventDefault();
    const db = fire.firestore();
    const startDate = new Date(
      new Date().getFullYear(),
      this.state.selectedMonth,
      1
    );
    const endDate = new Date(
      new Date().getFullYear(),
      this.state.selectedMonth,
      30
    );
    const data = [];

    db.collection("Shifts")
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .get()
      .then(query => {
        query.forEach(doc => {
          doc.data().waiters.forEach(waiter => {
            if (waiter.uid === this.props.loggedUser.uid) {
              const entity = {
                date:
                  doc.data().date.getDate() +
                  "/" +
                  doc.data().date.getMonth() +
                  "/" +
                  doc.data().date.getFullYear(),
                startTime: waiter.startHour,
                endTime: waiter.endHour,
                totalHours: waiter.totalHours,
                salary: waiter.salery,
                salaryAccepted: waiter.saleryAccepted,
                makeupPay: waiter.makeupPay
              };
              this.state.sumData.totalHours += waiter.totalHours;
              this.state.sumData.totalSalary += waiter.salery;
              this.state.sumData.totalSalaryAccepted += waiter.saleryAccepted;
              this.state.sumData.totalMakeup += waiter.makeupPay;

              data.push(entity);
            }
          });
        });
        this.setState({ data: data });
      });
  };

  render() {
    let tableContent = null;
    if (!this.state.data.length) {
      tableContent = <tbody />;
    }

    const table = (
      <table className="table mt-2">
        <thead>
          <th>Date</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Total Hours</th>
          <th>Salery</th>
          <th>Salery Accepted</th>
          <th>Makeup Pay</th>
        </thead>
      </table>
    );

    return (
      <div>
        <div className="bg-info py-1 text-white">
          <div className="container">
            <i className="fas fa-history mr-2 heading-icon" />
            <span className="heading-span">History</span>
          </div>
        </div>

        <div className="container animated fadeIn">
          <form className="mt-3">
            <div className="row">
              <div className="col-md-10 sm-12">
                <select
                  className="custom-select"
                  value={this.state.selectedMonth}
                  onChange={this.onChange}
                >
                  <option value="0">January</option>
                  <option value="1">February</option>
                  <option value="2">March</option>
                  <option value="3">April</option>
                  <option value="4">May</option>
                  <option value="5">June</option>
                  <option value="6">July</option>
                  <option value="7">August</option>
                  <option value="8">September</option>
                  <option value="9">October</option>
                  <option value="10">November</option>
                  <option value="11">December</option>
                </select>
              </div>
              <div className="col-md-2 sm-12">
                <button className="btn btn-info" onClick={this.fetchData}>
                  Search
                </button>
              </div>
            </div>
          </form>

          <div className="row">
            <div className="col-md-12">
              {!this.state.data.length ? (
                <div class="alert alert-warning mt-3 col-md-10 animated pulse" role="alert">
                  <i class="fas fa-exclamation-circle mr-2" />
                  No data available for the selected month
                </div>
              ) : (
                <table className="table mt-2 animated zoomIn">
                  <thead>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Total Hours</th>
                    <th>Salery</th>
                    <th>Salery Accepted</th>
                    <th>Makeup Pay</th>
                  </thead>
                  <tbody>
                    {this.state.data.map(entity => {
                      return (
                        <tr key={entity.date}>
                          <td>{entity.date}</td>
                          <td>{entity.startTime}</td>
                          <td>{entity.endTime}</td>
                          <td>{entity.totalHours}</td>
                          <td>{entity.salary}</td>
                          <td>{entity.salaryAccepted}</td>
                          <td>{entity.makeupPay}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td />
                      <td />
                      <td />
                      <th>{this.state.sumData.totalHours}</th>
                      <th>{this.state.sumData.totalSalary}</th>
                      <th>{this.state.sumData.totalSalaryAccepted}</th>
                      <th>{this.state.sumData.totalMakeup}</th>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default History;
