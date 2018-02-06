var express = require('express');
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");

var page = "https://mohfw.gov.in/documents/policy";

function getInfo(html) {
  var $ = cheerio.load(html, { normalizeWhitespace: true });
  var list = $("body");
  //var list = $(".views-table tr td");
 // console.log(list.html());
 var arr = {};
  loop(list["0"], arr);
  console.log(arr);
  return arr;
}


 
function loop(node,arr) {
    node.children.forEach(element => {
      if(element.data){
          let text = element.data;
            if (text.trim().toLowerCase().includes('mental')) 
             arr["mental"] = buildSearchTermArray("mental", element, arr);

            if (text.trim().toLowerCase().includes('health')) 
             arr["health"] = buildSearchTermArray("health", element, arr);
      }
     else if(element.children)
        loop(element,arr);
    }); 
   
}

/*Build Search Object*/
function buildSearchTermArray(term, element,arr) {
  let termArray = [];
  if (arr[term]) termArray = arr[term];
  termArray.push(element.data.trim());
  return termArray;
}


/* GET users listing. */
router.get('/', function(req, res, next) {
    request(page, function(error, response, html) {
      if (error) console.log(error)
      // Print out the status code. If a status code is 300 or above it means something went wrong.
      console.log("Status Code:", response.statusCode)
      // Finally, let's print out the HTML
    res.send(JSON.stringify(getInfo(html)));
    });
});



module.exports = router;
