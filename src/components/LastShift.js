import React, { Component } from 'react';
import fire from '../config/Fire';
import Shift from './Shift';

export default class LastShift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shift: {}
    };
  }

  componentDidMount = () => {
    const db = fire.firestore();
    db.collection('Shifts')
      .orderBy('date', 'desc')
      .limit(1)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({ shift: doc.data() });
        });
      });
  };

  render() {
    return (
      <div>
        <div className="row bg-info py-1 text-white">
          <div className="container">
            <i className="far fa-bookmark mr-2 heading-icon" />
            <span className="heading-span">Last Shift</span>
          </div>
        </div>

        <div className="container">
          <div className="mt-3">
            <Shift shift={this.state.shift} />
          </div>
        </div>
      </div>
    );
  }
}
