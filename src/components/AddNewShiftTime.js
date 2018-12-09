import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import fire from "../config/Fire";
import { ClipLoader } from "react-spinners";
import { TimePicker } from "material-ui-pickers";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';

class ShiftTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: new Date(),
      endTime: new Date(),
      totalTime: "",
      modal: false,
      loader: false
    };
  }

  handleAddNewShiftTimeStartHourChange = date => {
    this.props.handleAddNewShiftTimeStartHourChange(date);
  }

  handleAddNewShiftTimeEndtHourChange = date => {
    this.props.handleAddNewShiftTimeEndtHourChange(date)
  }

  handleStartTimeChange = (date) => {
    this.setState({startTime: date})
    console.log('test')
  }
  
  handleEndTimeChange = (date) => {
    this.setState({endTime: date})
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  waiterTotalTime = () => {
    const hours = Math.abs(
      this.state.endTime.getHours() - this.state.startTime.getHours()
    );
    const minutes =
      Math.abs(
        this.state.endTime.getMinutes() - this.state.startTime.getMinutes()
      ) / 60;
    const totalTime = parseFloat((hours + minutes).toFixed(2));
    this.setState({ totalTime });
  };

  onSubmit = e => {
    this.props.handleAddNewShiftTimeSubmit(e);
    /* e.preventDefault();
    this.waiterTotalTime();
    this.setState({ loader: true });
    const db = fire.firestore();

    db.collection("ActiveShift")
      .where("uid", "==", this.props.user.uid)
      .get()
      .then(() => {
        db.collection("ActiveShift")
          .doc(this.props.user.uid)
          .set({
            uid: this.props.userData.uid,
            name: this.props.userData.name,
            startTime: this.state.startTime.getHours() + ":" + this.state.startTime.getMinutes(),
            endTime: this.state.endTime.getHours() + ":" + this.state.endTime.getMinutes(),
            totalTime: this.state.totalTime
          })
          .then(() => {
            this.props.onDataAdded();
            //this.toggle();
            this.setState({ loader: false });
          })
          .catch(error => {
            this.setState({ loader: false });
            console.log(error);
          });
      }); */
  };

  render() {
    const defaultTimeValue = new Date();
    let addButtonContent;
    this.props.loading
      ? (addButtonContent = <ClipLoader color={"#fff"} size={20} />)
      : (addButtonContent = "ADD");

    return (
      <div>
        <div className="card">
          <div className="card-header bg-info text-white">
            Add New Shift Time
          </div>

          <div className="card-body">
            <form className="form-inline">
              <MuiThemeProvider theme={materialTheme}>
                <div className="picker form-group mx-3">
                <TimePicker
                  name="startTime"
                  ampm={false}
                  label="Start Time"
                  value={this.props.parentState.startHour}
                  onChange={this.handleAddNewShiftTimeStartHourChange}
                />
                </div>

                <div className="picker form-group mx-3">
                <TimePicker
                  name="endTime"
                  ampm={false}
                  label="End Time"
                  value={this.props.parentState.endHour}
                  onChange= {this.handleAddNewShiftTimeEndtHourChange}
                />
                </div>
                </MuiThemeProvider>

              <button
                type="submit"
                className="btn btn-info mx-3 btn-block"
                onClick={this.onSubmit}
              >
                {addButtonContent}
              </button>
            </form>
          </div>
        </div>

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalBody>Shift time added successfully!</ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.toggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ShiftTime;

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