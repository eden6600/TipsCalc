import React, { Component } from "react";
import AddNewShiftTime from "./AddNewShiftTime";
import ActiveShiftWaiters from "./ActiveShiftWaiters";
import fire from "../config/Fire";
import Alert from "react-s-alert";
import LatestShift from "./LatestShift";

export default class ActiveShift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      addNewShiftTime: {
        startHour: new Date(),
        endHour: new Date(),
        totalHours: 0
      },
      activeShiftWaiters: {
        waiters: [],
        shift: {},
        waiterEdit: {},
      },
      dataAdded: false
    };
  }

  handleAddNewShiftTimeStartHourChange = date => {
    const addNewShiftTime = { ...this.state.addNewShiftTime };
    addNewShiftTime.startHour = date;
    this.setState({ addNewShiftTime });
  };

  handleAddNewShiftTimeEndtHourChange = date => {
    const addNewShiftTime = { ...this.state.addNewShiftTime };
    addNewShiftTime.endHour = date;
    this.setState({ addNewShiftTime });
  };

  totalHours = e => {
    e.preventDefault();
    const addNewShiftTime = { ...this.state.addNewShiftTime };
    const startHour = addNewShiftTime.startHour;
    const endHour = addNewShiftTime.endHour;

    const hours = Math.abs(endHour.getHours() - startHour.getHours());
    const minutes =
      Math.abs(endHour.getMinutes() - startHour.getMinutes()) / 60;
    const totalHours = parseFloat((hours + minutes).toFixed(2));

    addNewShiftTime.totalHours = totalHours;
    this.setState({ addNewShiftTime }, () =>
      this.handleAddNewShiftTimeSubmit()
    );
  };

  handleAddNewShiftTimeSubmit = () => {
    this.setState({ loading: true });
    const db = fire.firestore();
    db.collection("ActiveShift")
      .doc(this.props.userData.uid)
      .set({
        uid: this.props.userData.uid,
        avatar: this.props.userData.avatar,
        name: this.props.userData.name,
        startHour:
          this.state.addNewShiftTime.startHour.getHours() +
          ":" +
          this.state.addNewShiftTime.startHour.getMinutes(),
        endHour:
          this.state.addNewShiftTime.endHour.getHours() +
          ":" +
          this.state.addNewShiftTime.endHour.getMinutes(),
        totalHours: this.state.addNewShiftTime.totalHours
      })
      .then(() => {
        this.onDataAdded();
        this.setState({ loading: false });
        Alert.success("Data Has Been Saved", {
          position: "bottom-right",
          effect: "scale",
          timeout: 3000
        });
      })
      .catch(err => {
        Alert.error("Error, Data Has Not Been Saved!", {
          position: "top-right",
          offset: "90px",
          effect: "scale",
          timeout: 3000
        });
      });
  };

  activeShiftWaitersFetchWaiters = () => {
    const activeShiftWaiters = { ...this.state.activeShiftWaiters };
    activeShiftWaiters.waiters = [];
    const db = fire.firestore();

    db.collection("ActiveShift")
      .get()
      .then(query => {
        query.forEach(doc => {
          const waiter = {};
          waiter.uid = doc.data().uid;
          waiter.avatar = doc.data().avatar;
          waiter.name = doc.data().name;
          waiter.startHour = doc.data().startHour;
          waiter.endHour = doc.data().endHour;
          waiter.totalHours = doc.data().totalHours;
          activeShiftWaiters.waiters.push(waiter);
          this.setState({ activeShiftWaiters });
        });
      });
  };

  activeShiftWaitersDeleteWaiter = waiter => {
    const db = fire.firestore();
    const activeShiftWaiters = { ...this.state.activeShiftWaiters };
    const index = activeShiftWaiters.waiters.indexOf(waiter);
    activeShiftWaiters.waiters.splice(index, 1);
    db.collection('ActiveShift').doc(waiter.uid).delete().then(() => {
      this.forceUpdate();
      Alert.success("Waiter Deleted Successfuly", {
        position: "bottom-right",
        effect: "scale",
        timeout: 3000
      });
    })

  };

  handleActiveShiftWaitersWaiterEditSelect = waiter => {
    const activeShiftWaiters = {...this.state.activeShiftWaiters};
    activeShiftWaiters.waiterEdit = waiter;
    this.setState({activeShiftWaiters});
  }

  handleActiveShiftWaitersWaiterEditSaveData = () => {

  }

  onDataAdded = () => {
    this.setState({ dataAdded: true });
  };

  switchStateToFalse = () => {
    this.setState({ dataAdded: false });
  };

  render() {
    return (
      <div>
        <div className="row bg-info py-1 text-white ">
          <div className="container">
            <i className="far fa-clock mr-2 heading-icon" />
            <span className="heading-span">Active Shift</span>
          </div>
        </div>

        <div className="container mt-3">
          <AddNewShiftTime
            user={this.props.user}
            userData={this.props.userData}
            parentState={this.state.addNewShiftTime}
            handleAddNewShiftTimeStartHourChange={
              this.handleAddNewShiftTimeStartHourChange
            }
            handleAddNewShiftTimeEndtHourChange={
              this.handleAddNewShiftTimeEndtHourChange
            }
            handleAddNewShiftTimeSubmit={this.totalHours}
            onDataAdded={this.onDataAdded}
            loading={this.state.loading}
          />
        </div>

        <div className="container mt-3">
          <ActiveShiftWaiters
            parentState={this.state.activeShiftWaiters}
            addNewShiftTimeState = {this.state.addNewShiftTime}
            userData={this.props.userData}
            activeShiftWaitersFetchWaiters={this.activeShiftWaitersFetchWaiters}
            activeShiftWaitersDeleteWaiter={this.activeShiftWaitersDeleteWaiter}
            handleActiveShiftWaitersWaiterEditSelect={this.handleActiveShiftWaitersWaiterEditSelect}
            handleAddNewShiftTimeStartHourChange={
              this.handleAddNewShiftTimeStartHourChange
            }
            handleAddNewShiftTimeEndtHourChange={
              this.handleAddNewShiftTimeEndtHourChange
            }
            switchStateToFalse={this.switchStateToFalse}
            parentState2={this.state.dataAdded}
          />
        </div>
      </div>
    );
  }
}
