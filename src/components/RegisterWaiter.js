import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import fire from '../config/Fire';

class RegisterWaiter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      uid: '',
      avatar: ''
    };
  }

  saveUserData = () => {
    const db = fire.firestore();
    db.collection('Users')
      .doc(this.state.uid)
      .set({
        name: this.state.name,
        email: this.state.email,
        uid: this.state.uid,
        avatar: this.state.avatar
      })
      .then(docRef => {})
      .catch(error => {
        console.log(error);
      });
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();
    this.setState({
      avatar:
        'https://use.fontawesome.com/releases/v5.0.13/svgs/solid/user-circle.svg'
    });
    fire
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(response => {
        const user = response.user;
        this.setState({
          uid: user.uid
        });
        this.saveUserData();
        this.props.history.push('/TipsCalc');
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="container mt-3">
        <div className="col-md-8 m-auto">
          <h1 className="display-4 text-center mb-3">Register New User</h1>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <input
                name="email"
                type="email"
                className="form-control"
                id="emailInput"
                placeholder="Enter email"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                name="name"
                type="text"
                className="form-control"
                id="nameInput"
                placeholder="Enter Full Name"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                name="password"
                type="password"
                className="form-control"
                id="passwordInput"
                placeholder="Password"
                onChange={this.onChange}
              />
            </div>

            <div className="row">
              <div className="col-md-12">
                <button
                  type="submit"
                  className="btn btn-info btn-block"
                  onClock={this.onSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default RegisterWaiter;
