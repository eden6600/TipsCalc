import React, { Component } from "react";
import fire from "../config/Fire";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      uid: "",
      avatar: "",
      name: "",
    };
  }

  onSubmit = e => {
    e.preventDefault();
    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.props.history.push('/')
      })
      .catch(error => {
        console.log(error);
      });
  };

  onFacebookLogin = (e) => {
    e.preventDefault();
    const provider = new fire.firebase_.auth.FacebookAuthProvider();
    const db = fire.firestore();

    fire.firebase_
      .auth()
      .signInWithPopup(provider)
      .then(response => {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const token = response.credential.accessToken;
        // The signed-in user info.
        const user = response.user;
        this.setState({
          uid: user.uid,
          avatar: user.photoURL,
          name: user.displayName,
          email: user.email
        });

        db.collection("Users").where("uid", "==", this.state.uid).get().then(result=>{
          if(!result.docs.length)
            this.saveUserData();
        })
        this.props.history.push('/')
        // ...
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }

  saveUserData = () => {
    const db = fire.firestore();
    db.collection("Users").doc(this.state.uid)
      .set({
        name: this.state.name,
        email: this.state.email,
        uid: this.state.uid,
        avatar: this.state.avatar
      })
      .then(docRef => {
      })
      .catch(error => {
        console.log(error);
      });
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <div className="login animated fadeIn">
        <div className="container mt-3">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">
                Sign in to your TipsCalc account
              </p>
              <form>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <button
                      type="submit"
                      className="btn btn-info btn-block login-btn"
                      onClick={this.onSubmit}
                    >
                      Log in
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      type="submit"
                      className="btn btn-block text-white facebook-btn float-right"
                      onClick={this.onFacebookLogin}
                    >
                      <i class="fab fa-facebook-square mr-2" />
                      Log in With Facebook
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
