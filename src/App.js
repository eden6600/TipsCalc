import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/NavBar';
import Landing from './components/Landing';
import Login from './components/Login';
import Home from './components/Home';
import History from './components/History';
import AdminPanel from './components/AdminPanel';
import CalculatedShift from './components/CalculatedShift';
import RegisterWaiter from './components/RegisterWaiter';
import LastShift from './components/LastShift';
import ActiveShift from './components/ActiveShift';
import fire from './config/Fire';
import { PropagateLoader } from 'react-spinners';
import { SyncLoader } from 'react-spinners';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/scale.css';
import 'react-s-alert/dist/s-alert-css-effects/flip.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';
import 'react-s-alert/dist/s-alert-css-effects/genie.css';
import 'react-s-alert/dist/s-alert-css-effects/bouncyflip.css';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false,
      user: {},
      userData: {},
      loading: true
    };
  }

  componentWillMount = () => {
    this.authListener();
  };

  authListener = () => {
    const db = fire.firestore();
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        db.collection('Users')
          .doc(user.uid)
          .get()
          .then(doc => {
            if (doc.exists) {
              this.setState({
                userData: doc.data(),
                user: user,
                isAdmin: doc.data().is_admin,
                loading: false
              });
            }
          });
      } else {
        this.setState({ user: null, loading: false });
      }
    });
  };

  render() {
    if (this.state.loading) {
      return (
        <div className="text-center page-loader">
          <div>
            <h3 className="pulsate">Tips Calc</h3>
          </div>
          <div className="mt-4">
            <SyncLoader color={'#18A2B8'} />
          </div>
        </div>
      );
    }

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div>
          <Router>
            <div className="App">
              <Navbar
                isAdmin={this.state.isAdmin}
                user={this.state.user}
                userData={this.state.userData}
                test={this.state.test}
              />
              {/* <Home /> */}
              <Route
                exact
                path="/TipsCalc"
                render={props => (
                  <Landing
                    {...props}
                    isAuth={this.state.isAuth}
                    user={this.state.user}
                    userData={this.state.userData}
                  />
                )}
              />
              <Route
                exact
                path="/login"
                render={props => <Login {...props} />}
              />
              <Route
                exact
                path="/home"
                render={props => (
                  <Home
                    {...props}
                    user={this.state.user}
                    appState={this.state}
                    userData={this.state.userData}
                  />
                )}
              />
              <Route
                exact
                path="/history"
                render={props => (
                  <History {...props} loggedUser={this.state.user} />
                )}
              />
              <Route
                exact
                path="/management"
                render={props => (
                  <AdminPanel {...props} loggedUser={this.state.user} />
                )}
              />
              <Route
                exact
                path="/register_waiter"
                render={props => <RegisterWaiter {...props} />}
              />
              <Route
                exact
                path="/calculated_shift"
                render={props => <CalculatedShift {...props} />}
              />
              <Route
                exact
                path="/last_shift"
                render={props => <LastShift {...props} />}
              />
              <Route
                exact
                path="/active_shift"
                render={props => (
                  <ActiveShift
                    {...props}
                    user={this.state.user}
                    userData={this.state.userData}
                  />
                )}
              />
            </div>
          </Router>

          <Alert stack={{ limit: 3 }} />
        </div>
      </MuiPickersUtilsProvider>
    );
  }
}

export default App;
