#!/usr/bin/python

import io
import sys
from datetime import date, datetime
from icalendar import Calendar, Event, vDatetime
import json

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError ("Type %s not serializable" % type(obj))

file = open('winter.ics', 'rb')
cal = Calendar.from_ical(file.read())
data = {}
data['classes'] = []
data['event']=[]
for component in cal.walk():
	if component.name == "VEVENT":
		if component.get('categories') == "Study List":
			data['classes'].append({
				'summary': component.get('summary'),
				'location': component.get('location'),
				'dtstart': json_serial(component.get('dtstart').dt),
				'dtend': json_serial(component.get('dtend').dt),
				'dtstamp': json_serial(component.get('dtstamp').dt),
				'rrule': component.get('rrule')
				})
		else:
			data['event'].append({
				'summary': component.get('summary'),
				'location': component.get('location'),
				'dtstart': json_serial(component.get('dtstart').dt),
				'dtend': json_serial(component.get('dtend').dt),
				'dtstamp': json_serial(component.get('dtstamp').dt)
				})

with open('data.txt', 'w') as outfile:
	json.dump(data, outfile)



