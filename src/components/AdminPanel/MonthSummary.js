import React, { Component } from "react";
import { getMonthSummary } from "../../config/Fire";
import { db } from "../../API Helper/firebase";

export default class MonthSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMonth: new Date().getMonth(),
      data: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  handleChange = e => {
    e.preventDefault();
    this.setState({
      selectedMonth: e.target.value
    });
  };

  getData2 = e => {
    e.preventDefault();
    this.getData();
  };

  getData = e => {
    e === undefined ? "" : e.preventDefault();
    const dataArr = [];
    getMonthSummary(this.state.selectedMonth).then(query => {
      query.forEach(doc => {
        doc.data().waiters.forEach(waiter => {
          const index = dataArr.findIndex(item => item.uid == waiter.uid);
          if (index != -1) {
            doc.data().shiftType == "Regular"
              ? (dataArr[index].regularTotalTime += waiter.totalHours)
              : (dataArr[index].weekendTotalTime += waiter.totalHours);
            dataArr[index].saleryAccepted += waiter.saleryAccepted;
            dataArr[index].makeupPay += waiter.makeupPay;
          } else {
            const entry = {};
            entry.regularTotalTime = 0;
            entry.weekendTotalTime = 0;
            doc.data().shiftType == "Regular"
              ? (entry.regularTotalTime = waiter.totalHours)
              : (entry.weekendTotalTime = waiter.totalHours);
            entry.saleryAccepted = waiter.saleryAccepted;
            entry.makeupPay = waiter.makeupPay;
            entry.uid = waiter.uid;
            entry.avatar = waiter.avatar;
            entry.name = waiter.name;
            dataArr.push(entry);
          }
        });
      });
      this.setState({ data: dataArr });
    });
  };

  render() {
    if (!this.state.data.length) {
    } else {
    }

    return (
      <div>
        <form className="mt-3">
          <div className="row">
            <div className="col-md-10">
              <select
                className="custom-select"
                value={this.state.selectedMonth}
                onChange={this.handleChange}
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
            <div className="col-md-2">
              <button className="btn btn-info" onClick={this.getData}>
                Search
              </button>
            </div>
          </div>
        </form>

        {this.state.data.length > 0 ? (
          <table className="table mt-3">
            <thead>
              <tr>
                <th />
                <th>Name</th>
                <th>Regular Hours</th>
                <th>Weekend Hours</th>
                <th>Total Hours</th>
                <th>Salery</th>
                <th>Makeup Pay</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map(waiter => {
                return (
                  <tr key={waiter.uid}>
                    <td>
                      <img src={waiter.avatar} className="avatar-big" />
                    </td>
                    <td>{waiter.name}</td>
                    <td>{waiter.regularTotalTime}</td>
                    <td>{waiter.weekendTotalTime}</td>
                    <td>{waiter.regularTotalTime + waiter.weekendTotalTime}</td>
                    <td>{waiter.saleryAccepted + waiter.makeupPay}</td>
                    <td>{waiter.makeupPay}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div class="alert alert-warning mt-3 col-md-10" role="alert">
            <i class="fas fa-exclamation-circle mr-2"></i>
            No data available for the selected month
          </div>
        )}
      </div>
    );
  }
}
