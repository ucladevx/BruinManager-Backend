# BruinManager-Backend
Backend for BruinManager 2018

URL: https://arcane-cove-10079.herokuapp.com/

First, download the chrome extension and allow BruinManager to scrape your data.
Then go to the URL above to save your data to our database.

Routes:

POST:
post/user - post data stored in chrome to the database

GET:
/events - save 10 random mappening events to the database
/api/classes/:username - get class data for a user
/api/passes/:username - get pass data for a user
/api/events/:dateID - get 10 random events from mappening API
/api/hours/:diningHall - get hours for each dining hall/togo option for each meal period
