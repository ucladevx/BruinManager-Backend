//***** Functions that scrape data from various sources *****//

// Run python scripts with PythonShell var
var PythonShell = require('python-shell');

// TODO: format output in JSON
function scrape_food(){
  var food_shell = new PythonShell('/python/food.py', { mode: 'text'});

  // received a message sent from the Python script (a simple "print" statement)
  food_shell.on('message', function (message) {
    console.log(message);
  });
}

function scrape_libraries(){
	  var lib_shell = new PythonShell('/python/lib.py', { mode: 'text'});

  // received a message sent from the Python script (a simple "print" statement)
  lib_shell.on('message', function (message) {
    console.log(message);
  });
}

function scrape_diningHalls(){

}

module.exports = {scrape_food, scrape_food, scrape_diningHalls}
