import React, { Component } from "react";
import CountUp from "react-countup";
import Config from './AdminPanel/Config';
import { Row, Col, Button } from "reactstrap";
import {
  Nav,
  NavItem,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  NavLink
} from "reactstrap";
import { TabContent, TabPane, Card, CardTitle, CardText } from "reactstrap";
import classnames from "classnames";
import MonthSummary from "./AdminPanel/MonthSummary";
import ClipLoader from 'react-spinners';

class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "1"
    };
  }

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  render() {
    return (
      <div>
        <div className="bg-info text-white py-1">
          <div className="container">
            <i className="fas fa-cogs mr-2 heading-icon text-white" />
            <span className="heading-span">Management</span>
          </div>
        </div>
        <div className="container">
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "1" })}
                onClick={() => {
                  this.toggle("1");
                }}
              >
                <i className="fas fa-chart-line mr-1" /> Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "2" })}
                onClick={() => {
                  this.toggle("2");
                }}
              >
                <i className="fas fa-keyboard mr-1" />Config
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "3" })}
                onClick={() => {
                  this.toggle("3");
                }}
              >
                <i className="fas fa-calendar-alt mr-1" />Month Summary
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <div className="row mt-3">
                <div className="col-xs-12 col-sm-6 col-md-3">
                  <div className="card text-white bg-primary mb-3 manage-card">
                    <div className="card-header">
                      Morning - Average Salery/Hour
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">
                        <i className="fas fa-shekel-sign" />{" "}
                        <CountUp start={0} end={42.3} />
                      </h5>
                      <p className="card-text" />
                    </div>
                  </div>
                </div>

                <div className="col-xs-12 col-sm-6 col-md-3">
                  <div className="card text-white bg-success mb-3 manage-card">
                    <div className="card-header">
                      Evening - Average Salery/Hour
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">
                        <i className="fas fa-shekel-sign" />{" "}
                        <CountUp start={0} end={32.4} />
                      </h5>
                      <p className="card-text" />
                    </div>
                  </div>
                </div>

                <div className="col-xs-12 col-sm-6 col-md-3">
                  <div className="card text-white bg-danger mb-3 manage-card">
                    <div className="card-header">Average Salery/Hour</div>
                    <div className="card-body">
                      <h5 className="card-title">
                        <i className="fas fa-shekel-sign" />{" "}
                        <CountUp start={0} end={49.8} />
                      </h5>
                      <p className="card-text" />
                    </div>
                  </div>
                </div>

                <div className="col-xs-12 col-sm-6 col-md-3 manage-card">
                  <div className="card bg-warning mb-3">
                    <div className="card-header ">Total Makeup Payments</div>
                    <div className="card-body">
                      <h5 className="card-title">
                        <i className="fas fa-shekel-sign" />{" "}
                        <CountUp start={0} end={1454.2} separator={","} />
                      </h5>
                      <p className="card-text" />
                    </div>
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane tabId="2">
              <Config />
            </TabPane>
            <TabPane tabId="3">
              <MonthSummary />
            </TabPane>
          </TabContent>
        </div>
      </div>
    );
  }
}

export default AdminPanel;
