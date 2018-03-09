# BruinManager-Backend
Backend for BruinManager 2018

URL: https://arcane-cove-10079.herokuapp.com/

First, download the chrome extension and allow BruinManager to scrape your data.
Then go to the URL above to save your data to our database.

### Endpoints:

###### POST:
* /post/user - post data stored in chrome to the database to create a userSchema instance
* /post/notes/:userName - post JSON in the form {"note": "NOTE_TO_SAVE"} to save to a user's account
* /post/notes/update/:userName/:noteNumber - post JSON in the form {"note": "UPDATED_NOTE_STRING"} to update the note at the specified index

###### GET:
* /events - save 10 random mappening events to the database
* /api/classes/:username - get class data for a user
* /api/passes/:username - get pass data for a user
* /api/events/:dateID - get 10 random events from mappening API
* /api/hours/:diningHall - get hours for each dining hall/togo option for each meal period
* /api/notes/:userName - return array of user's saved notes
* /api/notes/delete/:userName/:noteNumber - delete note at specified index of specified user's notes array

