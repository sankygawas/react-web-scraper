import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/* const API = "https://allorigins.me/get?method=raw&url="; */

class App extends Component {
  constructor(props) {
    super();
    this.state = { searchTerms: [1] };
  }

  componentDidMount() {
    fetch("/users")
      .then(res => res.json())
      .then(returnedSearchTerms => {
        let arr = [];
        Object.keys(returnedSearchTerms).forEach(key => {
          let obj = {};
          obj.key = key;
          obj.values = returnedSearchTerms[key];
          arr.push(obj);
          this.setState({ searchTerms: arr });
        });
        console.log(arr[0].values);
      });
  }

  mapObject = function(object, callback) {
    return Object.keys(object).map(function(key) {
      return callback(key, object[key]);
    });
  };
  searchTerm = function() {
   return  this.state.searchTerms.map((searchTerm, i) =>{
        return <tr key={i}>
            <td>{searchTerm.key}</td>
            </tr>
          });
  };

  renderEachItem = function(element) {
    return element.map(item => <li>{item}</li>);
  };

  render() {
    return <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div>
          <table>
            <tbody>
              {this.searchTerm()} {this.renderEachItem(this.state.searchTerms['mental'].values)}
            </tbody>
          </table>
        </div>
      </div>;
  }
}

export default App;
