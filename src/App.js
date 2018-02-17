import React, { Component } from 'react';
import './App.css';
import KeyWord from "./KeyWord";

class App extends Component {
  constructor(props) {
    super();
    this.state = { searchTerms: [] ,tags:[]};
  }

  componentDidMount() {
   
  }

 
fetchData = function(){

      let tagString = document.getElementById("tags").value;
      if (tagString == null || tagString === "") {
        alert("Please fill out he tags field");
        return;
      }
      //removing empty fields
      let tags = tagString.split(",").filter(v=>v.trim()!=='');
      this.setState({ searchTerms: []});
      console.log(tags);

      //load screen
      document.getElementById("loading").style.display="block";


     console.log(new Date());
            //fetch data from api
        fetch("/scraper", {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({ tags: tags})
        })
        .then(res => res.json())
        .then(returnedSearchTerms => {
          let arr = [];
          document.getElementById("loading").style.display = "none";
          console.log(returnedSearchTerms);
          console.log(new Date());
           this.setState({ searchTerms: returnedSearchTerms });
        /*   Object.keys(returnedSearchTerms).forEach(key => {
            let obj = {};
            obj.key = key;
            obj.values = returnedSearchTerms[key];
            arr.push(obj);
          });
          console.log("before")
          console.log(arr);
          this.state.searchTerms.forEach(term=>{
            arr.push(term);
          })
           console.log("after");
          console.log(arr);
          //arr.push(this.state.searchTerms);
          this.setState({ searchTerms: arr });
          //setting tags badges
          this.setState({ tags: tags });
          document.getElementById("tags").value = tagString; */
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

        <div className="showbox" id="loading" style={loadStyle}>
          <Loader />
        </div>
        <table className="table w-100 mx-auto mt-2">
          <tbody>
            {this.state.searchTerms.map((searchTermObject, i) =>
              /*     {/* <KeyWord key={i} keyWord={searchTermObject} /> } */
              /*   Object.keys(searchTermObject).forEach(key => {
              let obj = {};
              obj.key = key;
              obj.values = searchTermObject[key];
              arr.push(obj);
            }); */
           // console.log(searchTermObject["link"] )
            <tr><td>  { searchTermObject["link"] }</td></tr>
            )}
          </tbody>
        </table>
      </div>;
  }
}

export default App;
