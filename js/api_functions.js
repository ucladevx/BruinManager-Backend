// input is an array of two strings, ["open_time","close_time"]
// returns -1 if the current time is outside the input range,
// otherwise returns the closing time(string) for the current period that the dining hall is open
function status(times){

	if(times == "CLOSED"){
		return -1;
	}

	//Get the date and current time
	var d = new Date();
	var hour = d.getHours();
	var min = d.getMinutes();

	var t1 = times[0];		// opening time
	var t2 = times[1];		// closing time

	// get minutes and hours in 24 hr format
	var open = timeArr(t1, 0, 0);
	var close = timeArr(t2, 1, t1);

	if(hour >= open[0] && hour <= close[0]){
		if(hour == close[0] && min >= close[1]){		// if same hr as closing hr, check the minutes
			return -1;
		}
		else{
			return t2;										// return closing time
		}
	}

	return -1;											// means not open
}

// returns array of two ints
// [current hr (24 format), current minutes]
function timeArr(str, check, time){

	// get whether str is am or pm
	var ap = str.substring(str.length - 2, str.length - 1);

	// get whether time is am or pm
	var l1 = "";

	// only get l1 if check is specified
	if(check == 1){
		l1 = time.substring(time.length - 2, time.length - 1);
	}

	// find the hr substring
	var i;
	for(i = 0; i < str.length; i++){
	  	if(str[i] == ':'){
	  		break;
	  	}
	}

	// break into hr and minutes
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

module.exports = {status, timeArr}
