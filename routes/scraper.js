var express = require('express');
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var translate = require("translate-api");
var fs = require("fs");


var webPages = [
   "https://mohfw.gov.in/documents/policy"
 /*   "http://www.ms.ro/noutati/" */
];

let searchTerms = [
  "mental health",
  "medical imaging",
  "diagnostic",
  "medical technologies",
  "ovidius",
  "health"
];

function scrapeDataForPage(html) {

      var $ = cheerio.load(html, { normalizeWhitespace: true });
      let body = $("body");
      let returnObject = {};
      iterateDOM(body["0"], returnObject);

  return returnObject;
}


 
function iterateDOM(node,returnObject) {
    //loop through each node
    node.children.forEach(element => {
      //check if element has any text in it
      if(element.data){
          let text = element.data;
          searchTerms.forEach(searchTerm=>{
                        //if the element text includes required searchItem push to the array
                        if (text.trim().toLowerCase().includes(searchTerm)) 
                          returnObject[searchTerm] = buildSearchTermArray(searchTerm, element, returnObject);
           })
           /* let transText = text;
           translate.getText(transText, { to: "en" })
             .then(function(text) {
                  console.log(text);
                  //search all the required terms in this element
                  
             })
             .catch(function(err){
                  console.log(err);
             }); 
          
  */          
      }
      //else loop through its child elemet
     else if(element.children)
        iterateDOM(element, returnObject);
    }); 
   
}

/*Build Search Object*/
function buildSearchTermArray(term, element, returnObject) {
 let termArray = [];
 if (returnObject[term])
    termArray = returnObject[term];
 termArray.push(element.data.trim());
  return termArray;
}

//Merge SearchTerms for multiple pages, to retain only single object.
function mergeObjectValues(obj, returnObject) {
  for (var property in obj) {
    if (returnObject[property]) {
      obj[property].forEach(item => {
        returnObject[property].push(item);
      });
    } else returnObject[property] = obj[property];
  }
}

//loop through given webpages. Used recursion as async request gets called inside the loop
function runScraper(i, returnObject,callback) {

  if (i < webPages.length) {

    //make request to webPage and retrieve html asynchronous
    request(webPages[i], function(error, response, html) {
      if (error) console.log("error: " + error);
      else {
        console.log("Status Code:", response.statusCode);
        var obj = scrapeDataForPage(html);
        mergeObjectValues(obj, returnObject);
        console.log(returnObject);
        runScraper(i + 1, returnObject, callback);
      }
    });
  }
  else
    callback(returnObject);

}
 function scrapeData(){
  return new Promise(function(resolve, reject) {
    // Do async job
    let returnObject = {};

     runScraper(0, returnObject, function(returnObject) {
       resolve(returnObject);
     });
     
  });
 
} 


/* scrape data */
router.get('/', function(req, res, next) {

  let callBack = scrapeData();
     callBack.then(function(result){
      let json = JSON.stringify(result);
      //writing the output to json
      fs.writeFile("output.json", json, "utf8");
      res.send(json);
    },function(err){
      console.log(err);
    }); 

   
});

module.exports = router;
