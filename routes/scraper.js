var express = require('express');
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var translate = require("translate-api");

var webPages = [
   "https://mohfw.gov.in/documents/policy"
 /*   "http://www.ms.ro/noutati/" */
];

let searchTerms = [
  "mental health",
  "medical imaging",
  "diagnostic",
  "medical technologies",
  "ovidius"
];

function scrapeDataForPage(html) {

      var $ = cheerio.load(html, { normalizeWhitespace: true });
      let body = $("body");
      let returnArray = {};
      iterateDOM(body["0"], returnArray);

  return returnArray;
}


 
function iterateDOM(node,returnArray) {
    //loop through each node
    node.children.forEach(element => {
      //check if element has any text in it
      if(element.data){
          let text = element.data;
          searchTerms.forEach(searchTerm=>{
                        //if the element text includes required searchItem push to the array
                        if (text.trim().toLowerCase().includes(searchTerm)) 
                          returnArray[searchTerm] = buildSearchTermArray(searchTerm, element, returnArray);
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
        iterateDOM(element, returnArray);
    }); 
   
}

/*Build Search Object*/
function buildSearchTermArray(term, element, returnArray) {
 let termArray = [];
 if (returnArray[term])
    termArray = returnArray[term];
 termArray.push(element.data.trim());
  return termArray;
}

//Merge SearchTerms for multiple pages, to retain only single object.
function mergeObjectValues(obj, returnA) {
  for (var property in obj) {
    if (returnA[property]) {
      obj[property].forEach(item => {
        returnA[property].push(item);
      });
    } else returnA[property] = obj[property];
  }
}

//loop through given webpages. Used recursion as async request gets called inside the loop
function runScraper(i, returnA,callback) {

  if (i < webPages.length) {

    //make request to webPage and retrieve html asynchronous
    request(webPages[i], function(error, response, html) {
      if (error) console.log("error: " + error);
      else {
        console.log("Status Code:", response.statusCode);
        var obj = scrapeDataForPage(html);
        mergeObjectValues(obj, returnA);
        console.log(returnA);
        runScraper(i + 1, returnA, callback);
      }
    });
  }
  else
    callback(returnA);

}
 function scrapeData(){
  return new Promise(function(resolve, reject) {
    // Do async job
    let returnA = {};

     runScraper(0, returnA, function(returnA) {
        console.log("returnA is");
       console.log(returnA);
       resolve(returnA);
     });
     
  });
 
} 


/* scrape data */
router.get('/', function(req, res, next) {

  let callBack = scrapeData();
     callBack.then(function(result){
       console.log('Returbn array is');
       console.log(result);
       let transUrl = "http://www.ms.ro/noutati/";
       translate.getPage(transUrl).then(function(htmlStr) {
         console.log(htmlStr);
       });
      res.send(JSON.stringify(result));
    },function(err){
      console.log(err);
    }); 

   
});

module.exports = router;
