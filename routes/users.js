var express = require('express');
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");

var webPages = [
  "https://mohfw.gov.in/documents/policy"
];

function getScrapedData(html) {
   /*  webPages.forEach(page => { */
      var $ = cheerio.load(html, { normalizeWhitespace: true });
      let list = $("body");
       let returnArray = {};
      iterateDOM(list["0"], returnArray);
/* 
    }); */
  return returnArray;
}


 
function iterateDOM(node,returnArray) {
    //loop through each node
    node.children.forEach(element => {
      //check if element has any text in it
      if(element.data){
          let text = element.data;
          let searchTerms = ["mental health", "medical imaging", "diagnostic", "medical technologies", "ovidius"];
          //search all the required terms in this element
          searchTerms.forEach(searchTerm=>{
                //if the element text includes required searchItem push to the array
                if (text.trim().toLowerCase().includes(searchTerm)) 
                  returnArray[searchTerm] = buildSearchTermArray(searchTerm, element, returnArray);
          })
           
      }
      //else loop through its child elemet
     else if(element.children)
        iterateDOM(element, returnArray);
    }); 
   
}

/*Build Search Object*/
function buildSearchTermArray(term, element, returnArray) {
  let termArray = [];
 if (returnArray[term])termArray = returnArray[term];
  termArray.push(element.data.trim());
  return termArray;
}


/* scrape data */
router.get('/', function(req, res, next) {
let returnA = {};
  webPages.forEach(page => {

    request(page, function(error, response, html) {
      if (error) console.log(error);
      console.log("Status Code:", response.statusCode);
      var obj = getScrapedData(html);
      for (var property in obj) {
        if (returnA[property]) {
          obj[property].forEach(item => {
            returnA[property].push(item);
          });
        } else returnA[property] = obj[property];
      }
      console.log(returnA);
    
    });
    
  });
   res.send(JSON.stringify(returnArray));

    

});

module.exports = router;
