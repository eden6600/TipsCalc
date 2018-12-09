import React, { Component } from "react";
import fire from "../config/Fire";
import { Link } from "react-router-dom";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { getDoc } from "../config/Fire";
import { PropagateLoader } from "react-spinners";
import { TimePicker } from "material-ui-pickers";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';


class LatestShift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waitersInShift: [],
      editModal: false,
      calculateModal: false,
      loading: true,
      waiterToEdit: {},
      shift: {
        shiftTime: "Morning",
        shiftType: "Regular",
        totalHours: "",
        totalTips: "",
        saleryPerHour: ""
      }
    };
  }

  toggleEditModal = waiter => {
    this.setState({
      editModal: !this.state.editModal,
      waiterToEdit: waiter
    });
  };

  toggleCalculateModal = () => {
    this.setState({
      calculateModal: !this.state.calculateModal
    });
  };

  onChange = (e) => {
    let waiterToEdit = {...this.state.waiterToEdit};
    waiterToEdit[e.target.name] = e.target.value;
    this.setState({waiterToEdit});
  }

  saveWaiterChanges = (e) => {
    e.preventDefault();
    const waitersInShift = this.state.waitersInShift;
    console.log(waitersInShift);
    waitersInShift.forEach((waiter, i) => {
      if(waiter.uid == this.state.waiterToEdit.uid) {
        waitersInShift[i] = this.state.waiterToEdit;
        this.setState({waitersInShift});
      }
    })
  }

  onChange2 = e => {
    let shift = { ...this.state.shift };
    shift[e.target.name] = e.target.value;
    this.setState({ shift });
  };

  componentDidMount() {
    this.fetchShiftData();
  }

  fetchShiftData = () => {
    const db = fire.firestore();
    const arr = [];

    db.collection("ActiveShift")
      .get()
      .then(query => {
        this.setState({loading: false})
        query.forEach(doc => {
          const waiter = {};
          waiter.startTime = doc.data().startTime;
          waiter.endTime = doc.data().endTime;
          waiter.totalTime = doc.data().totalTime;
          getDoc("Users", doc.data().uid).then(user => {
            waiter.uid = user.data().uid;
            waiter.name = user.data().name;
            waiter.avatar = user.data().avatar;
            arr.push(waiter);
            this.setState({ waitersInShift: arr });
          });
        });
      });
  };

  deleteWaiter = waiter => {
    const arr = this.state.waitersInShift;
    const index = arr.indexOf(waiter);
    arr.splice(index, 1);
    this.setState({ waitersInShift: arr });
  };

  render() {
    if(this.state.loading)
    {
      return (
        <div className="d-flex justify-content-center">
          <PropagateLoader color={"#18A2B8"} />
        </div>
      );
    }
   
    //Auto add new shift time to table
    if (this.props.parentState) {
      this.fetchShiftData();
      this.props.switchStateToFalse();
    }

    let tableContent;
    tableContent = this.state.waitersInShift.map(waiter => {
      return (
        <tr className="animated bounceIn" key={waiter.uid}>
          <td>
            <img src={waiter.avatar} className="avatar-big" />
          </td>
          <td>{waiter.name}</td>
          <td>{waiter.startTime}</td>
          <td>{waiter.endTime}</td>
          <td>{waiter.totalTime}</td>
          {this.props.appState.isAdmin ||
          this.props.appState.user.uid === waiter.uid ? (
            <td>
              <i
                className="far fa-edit mr-3"
                id="edit"
                onClick={() => this.toggleEditModal(waiter)}
              />
              <i
                className="far fa-trash-alt"
                onClick={() => this.deleteWaiter(waiter)}
              />
            </td>
          ) : null}
        </tr>
      );
    });

    return (
      <div>
        <div className="card">
          <div className="card-header bg-info text-white">
            Currently Active Shift - {new Date().getDate()}/{new Date().getMonth()}/{new Date().getFullYear()},
            Morning
          </div>

          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th />
                  <th>Waiter Name</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Total Time</th>
                  <th />
                </tr>
              </thead>
              <tbody>{tableContent}</tbody>
            </table>

            {this.props.appState.isAdmin ? (
              <button
                className="btn btn-info float-right"
                onClick={this.toggleCalculateModal}
              >
                Calculate Shift
              </button>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* EDIT WAITER TIME MODAL */}
        <Modal
          isOpen={this.state.editModal}
          toggle={this.toggleEditModal}
          className={this.props.className}
        >
          <ModalHeader
            toggle={this.toggleEditModal}
            className="bg-secondary text-white"
          >
            
            Edit 
          </ModalHeader>
          <ModalBody>
            <form className="form">
              {/* <div className="form-group mx-sm-3">
                <label htmlFor="start-time">Start Time</label>
                <input
                  type="time"
                  className="form-control"
                  id="start-time"
                  name="startTime"
                  //  value={this.state.waiterToEdit.startTime}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group mx-sm-3">
                <label htmlFor="end-time">End Time</label>
                <input
                  type="time"
                  className="form-control"
                  id="end-time"
                  name="endTime"
                  //value={this.state.waiterToEdit.endTime}
                  onChange={this.onChange}
                />
              </div> */}

              <MuiThemeProvider theme={materialTheme}>
                <div className="picker form-group mx-3">
                <TimePicker
                  name="startTime"
                  ampm={false}
                  label="Start Time"
                  value={this.state.startTime}
                  onChange={this.handleStartTimeChange}
                />
                </div>

                <div className="picker form-group mx-3">
                <TimePicker
                  name="endTime"
                  ampm={false}
                  label="End Time"
                  value={this.state.endTime}
                  onChange= {this.handleEndTimeChange}
                />
                </div>
                </MuiThemeProvider>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick= {(e)=> {
              this.toggleEditModal();
              this.saveWaiterChanges(e);
            }}>
              Save
            </Button>
            <Button color="secondary" onClick={this.toggleEditModal}>
              Exit
            </Button>
          </ModalFooter>
        </Modal>

        {/* CALCULATE SHIFT MODAL */}
        <Modal
          isOpen={this.state.calculateModal}
          toggle={this.toggleCalculateModal}
          className={this.props.className}
        >
          <ModalHeader
            toggle={this.toggleCalculateModal}
            className="bg-info text-white"
          >
            Calculate Shift
          </ModalHeader>
          <ModalBody>
            <form className="form">
              <div className="form-group">
                <label htmlFor="shift-time">Shift Time</label>
                <select
                  class="form-control"
                  id="shift-time"
                  value={this.state.shift.shiftTime}
                  onChange={this.onChange2}
                  name="shiftTime"
                >
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="shift-type">Shift Type</label>
                <select
                  className="form-control"
                  id="shift-type"
                  value={this.state.shift.shiftType}
                  onChange={this.onChange2}
                  name="shiftType"
                >
                  <option value="Regular">Regular</option>
                  <option value="Weekend">Weekend</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="total-tips">Total Tips</label>
                <input
                  type="text"
                  value={this.state.shift.totalTips}
                  className="form-control"
                  id="total-tips"
                  name="totalTips"
                  onChange={this.onChange2}
                />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Link
              to={{
                pathname: "/calculated_shift",
                state: {
                  shift: this.state.shift,
                  waiters: this.state.waitersInShift
                }
              }}
            >
              <Button color="success" onClick={this.toggleCalculateModal}>
                Continue
              </Button>
            </Link>
            <Button color="secondary" onClick={this.toggleCalculateModal}>
              Exit
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default LatestShift;

const infoColor = '#17A2B8';
const materialTheme = createMuiTheme({
  overrides: { 
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: infoColor,
      },
    },
    MuiPickersModal: {
      dialogAction: {
        color: infoColor
      },
    },
  },
});
