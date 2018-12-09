import React, { Component } from "react";
import { TimePicker } from "material-ui-pickers";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";


export default class ActiveShiftWaiters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editModal: false,
      waiterEdit: {},
      calculateModal: false,
      shift: {
        shiftTime: "Morning",
        shiftType: "Regular",
        totalHours: "",
        totalTips: "",
        saleryPerHour: ""
      }
    }
  }
  componentDidMount = () => {
    this.props.activeShiftWaitersFetchWaiters();
  }

  toggleEditModal = waiter => {
    this.setState({
      editModal: !this.state.editModal,
    });
    this.props.handleActiveShiftWaitersWaiterEditSelect(waiter);
  };

  toggleCalculateModal = () => {
    this.setState({calculateModal: !this.state.calculateModal});
  }

  handleShiftDataChange = e => {
    let shift = { ...this.state.shift };
    shift[e.target.name] = e.target.value;
    this.setState({ shift });
  };

  handleAddNewShiftTimeStartHourChange = date => {
    console.log('test')
    //this.props.handleAddNewShiftTimeStartHourChange(date)
  }

  handleAddNewShiftTimeEndHourChange = date => {
    console.log(this.props.handleAddNewShiftTimeStartHourChange)
    this.props.handleAddNewShiftTimeEndHourChange(date)
  }


  render() {
     //Auto add new shift time to table
     if (this.props.parentState2) {
      this.props.activeShiftWaitersFetchWaiters();
      this.props.switchStateToFalse();
    }

    if(this.props.parentState.waiters.length == 0) {
      return <ClipLoader color={"#fff"} size={20} />
    }
    
    let tableBody = this.props.parentState.waiters.map(waiter => {
      return (
        <tr key={waiter.uid}>
          <td><img src={waiter.avatar} className="avatar-big" /></td>
          <td>{waiter.name}</td>
          <td>{waiter.startHour}</td>
          <td>{waiter.endHour}</td>
          <td>{waiter.totalHours}</td>
          {this.props.userData.is_admin ||
          this.props.userData.uid === waiter.uid ? (
            <td>
              <i
                className="far fa-edit mr-3"
                id="edit"
                onClick={() => this.toggleEditModal(waiter)}
              />
              <i
                className="far fa-trash-alt"
                onClick={() => this.props.activeShiftWaitersDeleteWaiter(waiter)}
              />
            </td>
          ) : null}
        </tr>
      )
    });
    
    return (
      <div className="card animated fadeIn">
        <div className="card-header bg-info text-white">
          Currently Active Shift - {new Date().getDate()}/{new Date().getMonth()}/{new Date().getFullYear()}
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
            <tbody>
              {tableBody}
            </tbody>
          </table>

          {this.props.userData.is_admin ? (
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

        <Modal
          isOpen={this.state.editModal}
          toggle={this.toggleEditModal}
          className={this.props.className}
        >
          <ModalHeader
            toggle={this.toggleEditModal}
            className="bg-secondary text-white"
          >
            Edit {this.props.parentState.waiterEdit.name}
          </ModalHeader>
          <ModalBody>
            <form className="form">

              <MuiThemeProvider theme={materialTheme}>
                <div className="picker form-group mx-3">
                <TimePicker
                  name="startTime"
                  ampm={false}
                  label="Start Time"
                  value={this.props.addNewShiftTimeState.startHour}
                  onChange={this.handleAddNewShiftTimeStartHourChange}
                />
                </div>

                <div className="picker form-group mx-3">
                <TimePicker
                  name="endTime"
                  ampm={false}
                  label="End Time"
                  value={this.props.addNewShiftTimeState.endHour}
                  onChange= {this.handleAddNewShiftTimeEndHourChange}
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
                  onChange={this.handleShiftDataChange}
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
                  onChange={this.handleShiftDataChange}
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
                  onChange={this.handleShiftDataChange}
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
                  waiters: this.props.parentState.waiters
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
