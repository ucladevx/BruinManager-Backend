var request = require('request');
var cheerio = require('cheerio');

var url = "http://menu.dining.ucla.edu/Hours";

request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

    if(!error){
        // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

        var $ = cheerio.load(html);

        // Finally, we'll define the variables we're going to capture

        // var title, release, rating;
        // var json = { title : "", release : "", rating : ""};
        
    }
})