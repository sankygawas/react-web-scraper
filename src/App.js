import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/* const API = "https://allorigins.me/get?method=raw&url="; */

class App extends Component {
  constructor(props) {
    super();
    this.state = { searchTerms: [] };
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

 
  render() {
    return <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <table className="table w-100 mx-auto ">
          <tbody>
            {this.state.searchTerms.map(searchTerm => <tr>
                <td className="text-left p-0">
                <span className="ml-2"><strong>{searchTerm.key}</strong> ({searchTerm.values.length})</span>
                  <ul className="list-group my-0">
                    {searchTerm.values.map(item => (
                      <li className="text-left py-0 list-group-item">
                        {item}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>;
  }
}

export default App;
