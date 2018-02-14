import React, { Component } from 'react';
import './App.css';
import KeyWord from "./KeyWord";

class App extends Component {
  constructor(props) {
    super();
    this.state = { searchTerms: [] };
  }

  componentDidMount() {
   
  }

fetchData = function(){
      let tagString = document.getElementById("tags").value;
      if (tagString == null || tagString === "") {
        alert("Please fill out he tags field");
        return;
      }
      let tags = tagString.split(",");
      this.setState({ searchTerms: [] });
      console.log(tags)
      fetch("/scraper", {
            method: "POST",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify({ tags: tags })
       })
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
      
       }); 
}
 
  render() {
    return <div className="App">
        <header className="App-header">
          <h1 className="App-title">Node-React Web Scraper</h1>
        </header>
         <div className="mt-2">
            <input type="text"  id="tags" aria-describedby="emailHelp" placeholder="Enter CSV Tags" required/>
            <button className="btn-primary" onClick={this.fetchData.bind(this)}>Fetch</button>
            <small id="emailHelp" className="form-text text-muted">Please insert your search tags in CSV format</small> 
         </div>
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
