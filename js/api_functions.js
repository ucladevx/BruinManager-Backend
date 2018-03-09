// returns -1 if the dining hall is closed, 
// or the closing time(string) for the current meal period if the dining hall is open
function status(times){

	if(times == "CLOSED"){
		return -1;
	}

	var d = new Date();			//Get the date
	var hour = d.getHours();
	var min = d.getMinutes();

	// testing
	// var hour = 20;
	// var min = 0;

	// debugging
	console.log(hour);
	console.log(min);

	var t1 = times[0];		// opening time
	var t2 = times[1];		// closing time

	var open = timeArr(t1, 0, 0);
	var close = timeArr(t2, 1, t1);

	// debugging
	console.log("open");	
	console.log(open[0]);
	console.log(open[1]);

	console.log("close");
	console.log(close[0]);
	console.log(close[1]);

	if(hour >= open[0] && hour <= close[0]){
		if(hour == close[0] && min >= close[1]){		// if same hr as closing hr, check the minutes
			console.log("here1");
			return -1;
		}
		else{
			return t2;										// return closing time
		}
	}
	console.log("here2");
	return -1;											// means not open
}

// returns array of two ints
// [current hr (24 format), current minutes]
function timeArr(str, check, time){

	var l1;
	var ap;

	if(check == 1){
		ap = str.substring(str.length - 2, str.length - 1);
		l1 = time.substring(time.length - 2, time.length - 1);
	}
	
	// console.log(ap);
	var i;
	for(i = 0; i < str.length; i++){
	  	if(str[i] == ':'){
	  		break;
	  	}
	}

	var hr = parseInt(str.substring(0, i));
	var min = parseInt(str.substring(i + 1, i + 3));

	if(ap == 'p' && hr != 12){			// convert to 24 hr format
		hr = hr + 12;
	}

	if(ap == 'a' && l1 == 'p'){			// if study period opens at 9 pm and closes at 2 am
		console.log("oh no");
		hr = hr + 24;
	}

	var result = [hr, min];
	return result;
}

module.exports = {status}