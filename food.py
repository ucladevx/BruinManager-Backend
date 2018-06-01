import requests
from bs4 import BeautifulSoup
import json

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError ("Type %s not serializable" % type(obj))

page = requests.get('http://asucla.ucla.edu/hours/')
soup = BeautifulSoup(page.content, 'html.parser')
data = []

for n in range(1, 5):
	name = 'table_' + str(n)
	table = soup.find('table', {'id':name})
	table_body = table.find('tbody')
	rows = table_body.find_all('tr')
	for row in rows:
		cols = row.find_all('td')
		cols = [ele.text.strip() for ele in cols]
		data.append([ele for ele in cols if ele])

print(data)

with open('data.txt', 'w') as outfile:
	json.dump(data, outfile)