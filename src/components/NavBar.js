import React, { Component } from "react";
import { Link } from "react-router-dom";
import fire from "../config/Fire";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state={
      userContent: [],
      adminContent: [],
    }
  }
  logout = () => {
    fire
      .auth()
      .signOut()
      .then(() => {})
      .catch(() => {});
  };

  componentWillUpdate = () => {
  }

  render() {
    let userContent, adminContent, contents;
    if (this.props.user) {
      userContent = [
        <li className="nav-item" key="1">
          <Link className="nav-link" to="/active_shift">
            Active Shift
          </Link>
        </li>,
        <li className="nav-item" key="4">
        <Link className="nav-link" to="/last_shift">
          Last Shift
        </Link>
      </li>,
        <li className="nav-item" key="2">
          <Link className="nav-link" to="/history">
            History
          </Link>
        </li>,
        <li className="nav-item" key="3">
          <Link className="nav-link" to="/" onClick={this.logout}>
            <img src={this.props.userData.avatar} className="profilePic" />
            Logout
          </Link>
        </li>, 
      ];
    } else {
      userContent = (
        <li className="nav-item"  key="5"> 
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      );
    }

    if (this.props.userData.is_admin) {
      adminContent = (
        <li className="nav-item" key="4">
          <Link className="nav-link" to="/management">
            Management
          </Link>
        </li>
      );
    }

    contents = [adminContent, userContent];

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            TipsCalc
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mobile-nav">
            <ul className="navbar-nav ml-auto">{contents}</ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
