import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super();
    this.state = {  searchTerms: [] ,tags:[],time:0};
  }
  
fetchData = function(){

      let tagString = document.getElementById("tags").value;
      if (tagString == null || tagString === "") {
        alert("Please fill out he tags field");
        return;
      }
      //removing empty fields
      let tags = tagString.split(",").filter(v=>v.trim()!=='');
      this.setState({searchTerms: []});
      //load screen
      document.getElementById("loading").style.display="block";

     let start = new Date();
            //fetch data from api
        fetch("/scraper", {
          method: "POST",
          headers: {"content-type": "application/json"},
          body: JSON.stringify({ tags: tags})
        })
        .then(res => res.json())
        .then(returnedSearchTerms => {
          document.getElementById("loading").style.display = "none";
          let end = new Date();
          let time = (end.getTime() - start.getTime()) / 1000;
          this.setState({ searchTerms: returnedSearchTerms ,tags:tags,time:time});
        }); 
}
 
  render() {
    var loadStyle = {
      display:'none'
    };

    const Loader = ()=>{ 
          return <div className="loader">
                          <svg className="circular" viewBox="25 25 50 50">
                            <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10"/>
                          </svg>
                 </div>
    }

    //search field
    const Input = ()=>{
      return <div className="mt-2 mb-2">
                <input type="text"  id="tags" placeholder="Enter CSV Tags" required/>
                <button className="btn-primary" onClick={this.fetchData.bind(this)}>Fetch</button>
                <small className="form-text text-muted">Please insert your search tags in CSV format</small> 
            </div>
    }

    //keyword list in a webpage
    const KeyWordList = (props) =>{
     return Object.keys(props.keyWordList).map(key => {
          if (key !== "link") {
            return <li className="list-group-item p-0 text-left ">
                        <p className="pl-2 my-0 text-success">{key} ({props.keyWordList[key].length})</p>
                        <ul className="list-group text-secondary">
                            {props.keyWordList[key].map((term,i) => <li key={i} className="list-group-item py-0">{term}</li>)}
                        </ul>
                  </li>;
          } else return "";
        });
    }

    //webpage
      const LinkComponent = (props) => {
       return <ul className="list-group p-0">
           <p className=" text-primary lead my-0 text-left ml-2">{props.linkObject["link"]}</p>
           <KeyWordList key={props.i} keyWordList={props.linkObject} />
         </ul>;
     };
    
     let timeComponenet;
     if(this.state.time!== 0)
        timeComponenet = <p class="lead my-1"><span>Fetched in {this.state.time} seconds</span></p>
      // else
      ///timeComponenet

    return <div className="App">
        <header className="App-header">
          <h1 className="App-title">Node-React Web Scraper</h1>
        </header>
        <Input />
        {this.state.tags.map((tag, i) => (
          <span key={i} className="badge badge-pill badge-info mx-1 p-2">
            {tag}
          </span>
        ))}
        {timeComponenet}
      
        <div className="showbox" id="loading" style={loadStyle}>
          <Loader />
        </div>
        <table className="table w-100 mx-auto mt-2">
          <tbody>
            {this.state.searchTerms.map((searchTermObject, i) => (
              <tr key={i}>
                <td className="p-0">
                  <LinkComponent linkObject={searchTermObject} i={i} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>;
  }
}

export default App;
