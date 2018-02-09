import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import KeyWord from "./KeyWord";

/* const API = "https://allorigins.me/get?method=raw&url="; */

class App extends Component {
  constructor(props) {
    super();
    this.state = { searchTerms: [] };
  }

  componentDidMount() {
     fetch("/scraper")
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
        /*  console.log(arr[0].values); */
       }); 
  }

 
  render() {
    return <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Web Scraper</h1>
        </header>

        <table className="table w-100 mx-auto ">
          <tbody>
            {this.state.searchTerms.map((searchTerm,i) => 
              <KeyWord key={i} keyWord={searchTerm}/>
            )}
          </tbody>
        </table>
      </div>;
  }
}

export default App;
