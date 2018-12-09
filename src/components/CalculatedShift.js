import React, { Component } from "react";
import { Link } from "react-router-dom";
import fire from "../config/Fire";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";

class CalculatedShift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shift: {
        date: new Date(),
        waiters: this.props.location.state.waiters,
        shiftTime: this.props.location.state.shift.shiftTime,
        shiftType: this.props.location.state.shift.shiftType,
        totalTips: parseInt(this.props.location.state.shift.totalTips),
        totalTime: 0,
        saleryPerHour: 0
      },
      modal: false
    };
  }

  componentDidMount = () => {
    this.shiftTotalTime();

    axios
      .get("http://api.icndb.com/jokes/random?firstName=Nir&lastName=Hen")
      .then(res => {
        this.setState({ joke: res.data.value.joke });
      });
  };

  shiftTotalTime = () => {
    let shift = Object.assign({}, this.state.shift);
    shift.totalTime = 0;
    this.state.shift.waiters.forEach(
      waiter => {
        shift.totalTime += waiter.totalHours; 
      },
      this.setState({ shift }, () => {
        shift.saleryPerHour = this.state.shift.totalTips / shift.totalTime;
        this.setState({ shift }, this.waiterSalery);
      })
    );
  };

  waiterSalery = () => {
    console.log('state',this.state)
    let saleryPerHour = 30;
    const waitersStateArr = this.state.shift.waiters;
    this.state.shift.shiftType === "Weekend"
      ? (saleryPerHour *= 1.5)
      : (saleryPerHour = saleryPerHour);
    saleryPerHour < this.state.shift.saleryPerHour
      ? (saleryPerHour = this.state.shift.saleryPerHour)
      : (saleryPerHour = saleryPerHour);
    waitersStateArr.forEach(
      waiter => {
        console.log('waiter', parseFloat(waiter.totalHours * saleryPerHour));
        waiter.salery = parseFloat((waiter.totalHours * saleryPerHour).toFixed(2));
        console.log(waiter.salery)
        waiter.saleryAccepted = parseFloat((
          waiter.totalHours * this.state.shift.saleryPerHour
        ).toFixed(2));
        waiter.makeupPay = parseFloat((waiter.salery - waiter.saleryAccepted).toFixed(2));
      },
      this.setState({
        waiters: waitersStateArr
      })
    );
  };

  saveShift = () => {
    const db = fire.firestore();
    const d = new Date();
    const shiftState = this.state.shift;
    shiftState.date = d;

    const docName = `${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}_${
      this.state.shift.shiftTime
    }_${this.state.shift.shiftType}`;
    this.setState({shift: shiftState});
    db.collection("Shifts")
      .doc(docName)
      .set(this.state.shift)
      .then(() => {
        this.toggle();
      });
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    }, ()=>{
      if(!this.state.modal) {
        const db = fire.firestore();
        db.collection('ActiveShift').get().then(query=>{
          var batch = db.batch();
          query.forEach(doc=>{
            batch.delete(doc.ref);
          })
          batch.commit().then(()=>{
          })
        })
        this.props.history.push('/')
      }
        
    });
  };

  render() {
    console.log(this.state.shift)
    let tbody = null;
    let joke = "";

    this.state.shift.shiftTime === "Evening"
      ? (joke = (
          <ModalBody>
            <p className="lead">A little joke before you go:</p>
            {this.state.joke}
          </ModalBody>
        ))
      : (joke = "");

    if (this.state.shift.waiters) {
      tbody = this.state.shift.waiters.map(waiter => {
        console.log('test waiter', waiter)
        return (
          <tr>
            <td>
              <img src={waiter.avatar} className="avatar-big" />
            </td>
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
    }

    return (
      <div>
        <div className="bg-info py-1 text-white">
          <div className="container">
            <i className="far fa-clock mr-2 heading-icon"></i>
            <span className="heading-span">Active Shift</span>
          </div>
        </div>
      <div className="container mt-3">
        <Link to="home">
          <button className="btn btn-info">Back</button>
        </Link>

        <div className="alert alert-info mt-3" role="alert">
          <h5 className="">
            {this.state.shift.shiftTime}, {this.state.shift.shiftType},{" "}
            {this.state.shift.totalTips}
          </h5>
        </div>

        <table className="table mt-3">
          <thead className="">
            <tr>
              <th />
              <th>Waiter Name</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Total Time</th>
              <th>Total Salary</th>
              <th>Salary Accepted</th>
              <th>Makeup Pay</th>
            </tr>
          </thead>
          <tbody>{tbody}</tbody>
        </table>
        <button
          className="btn btn-success float-right"
          onClick={this.saveShift}
        >
          Save Shift
        </button>

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>
            <i className="far fa-check-circle mr-2 text-success" />
            Shift Has Been Saved!
          </ModalHeader>
          {joke}
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      </div>
    );
  }
}

export default CalculatedShift;
