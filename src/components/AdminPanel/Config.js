import React, { Component } from "react";
import fire from '../../config/Fire';
import Alert from 'react-s-alert';
import { ClipLoader } from 'react-spinners';

export default class Config extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minSalery: 30,
      minSaleryBeforeAllowance: 31,
      allowance: 5,
      loading: false
    };
  }

  componentDidMount = ()=> {
    this.loadData();
  }

  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  saveData = (e) => {
    e.preventDefault();

    const db = fire.firestore();
    this.setState({loading: true});
    db.collection('config').doc('config').set({
      minSalery: this.state.minSalery,
      minSaleryBeforeAllowance: this.state.minSaleryBeforeAllowance,
      allowance: this.state.allowance
    }).then(()=>{
      this.setState({loading: false})

      Alert.success('Data Has Been Saved', {
        position: 'bottom-right',
        effect: 'scale',
        timeout: 3000
    });
    })
  }

  loadData = () => {
    const db = fire.firestore();

    db.collection('config').doc('config').get().then(doc=>{
      if(doc.exists) {
        this.setState({
          minSalery: doc.data().minSalery,
          minSaleryBeforeAllowance: doc.data().minSaleryBeforeAllowance,
          allowance: doc.data().allowance
        })
      }
    })
  }

  render() {
    let saveBtnContent;
    this.state.loading
      ? (saveBtnContent = <ClipLoader color={"#fff"} size={20} />)
      : (saveBtnContent = "Save");
      
    return (
      <div className="mt-3">
        <form>
          <div className="col px-0 mb-2">
            <label for="minSalery">Minimum Salery</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <i className="fas fa-shekel-sign" />
                </div>
              </div>
              <input
                type="number"
                className="form-control"
                id="minSalery"
                name="minSalery"
                value={this.state.minSalery}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="col px-0 mb-2">
            <label for="minSaleryBeforeAllowance">
              Minimum Salery Before Allowance
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <i className="fas fa-shekel-sign" />
                </div>
              </div>
              <input
                type="number"
                className="form-control"
                id="minSaleryBeforeAllowance"
                name="minSaleryBeforeAllowance"
                value={this.state.minSaleryBeforeAllowance}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="col px-0 mb-2">
            <label for="allowance">Allowance</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <i className="fas fa-percentage" />
                </div>
              </div>
              <input
                type="number"
                class="form-control"
                id="allowance"
                name="allowance"
                value={this.state.allowance}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <button type="button" className="btn btn-info" onClick={this.saveData}>
            {saveBtnContent}
          </button>
        </form>
      </div>
    );
  }
}
