var express = require('express');
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var translate = require("translate-api");
var fs = require("fs");


    let webPages = ["https://mohfw.gov.in/documents/policy", "http://www.ema.europa.eu/ema/", "http://www.who.int/hospitals/en/",
  "https://mohfw.gov.in/documents/policy", "http://www.ema.europa.eu/ema/", "http://www.who.int/hospitals/en/"];

let searchTerms = [];

function scrapeDataForPage(html, returnObject) {
  var $ = cheerio.load(html, { normalizeWhitespace: true });
  let body = $("body");
  //let returnObject = {};
  iterateDOM(body["0"], returnObject);
  //return returnObject;
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
function requestPage(webPage, resolve, reject) {
  
        request(webPage.page, function(error, response, html) {
          if (error) console.log("error: " + error);
          else {
            console.log("Status Code:", response.statusCode);
           scrapeDataForPage(html, webPage.data);
           // mergeObjectValues(obj, webPage.data);
            webPage.data["link"] = webPage.page;
            resolve(webPage.data);
          }
        });

}

function scrapeData(){
 // Create an array of promises
     var promises = [];
     for (var i = 0; i < webPages.length; i++) {
           // Fill the array with promises which initiate some async work
           promises.push(new Promise(function(resolve, reject) {
               requestPage({ page: webPages[i], data: {} }, function(object) {
                   console.log(object);
                   resolve(object);
                 }, reject);
             }));
     }
  
  // Return a Promise.all promise of the array
  return Promise.all(promises);
 
} 

/* scrape data */
router.post('/', function(req, res, next) {
searchTerms = req.body.tags;
  let callBack = scrapeData();
     callBack.then(function(results){
       // console.log(results);
      let json = JSON.stringify(results);
    
      //writing the output to json
      fs.writeFile("output.json", json, "utf8");
      res.send(json);
    },function(err){
      console.log(err);
    }); 

   
});

module.exports = router;
