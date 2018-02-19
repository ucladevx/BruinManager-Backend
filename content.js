// if we are on the bruinmanager page
if(window.location.href.indexOf("herokuapp.com") > -1 ) {
	// Get the data that was stored
	chrome.storage.sync.get('data', function(items){
	   	
	   	console.log(items);

		// var url = "https://arcane-cove-10079.herokuapp.com/user";
		// // var url = "http://localhost:3000/user";
		// xhr.open("POST", url, true);
		// xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
		// xhr.send(JSON.stringify(items));
	
	    $.ajax({
	        type: "POST",
	        //the url where you want to sent the userName and password to
	        url: 'https://arcane-cove-10079.herokuapp.com/user',
	        dataType: 'json',
	        //json object to sent to the authentication url
	        data: JSON.stringify(items),
	        success: function () {
	       		console.log("sent")
        	}
    	});	
	});
	
}
