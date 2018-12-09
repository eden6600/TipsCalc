import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Landing extends Component {
  render() {
    let content;

    if (this.props.user) {
      content = <h1 className="display-4">Hello {this.props.userData.name}</h1>;
    } else {
      content = (
        <div>
          <h1 className="display-3 mb-4">Tips Calc</h1>
          <p className="lead">
            A modern way to calculate and manage waiters salerys
          </p>
          <Link
            to="/login"
            className="btn btn-lg btn-primary animated flipInX mr-3"
          >
            Login
          </Link>
          <Link
            to="/register_waiter"
            className="btn btn-lg btn-secondary animated flipInX"
          >
            Register
          </Link>
        </div>
      );
    }

    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">{content}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
