#Import libraries
import urllib2
import traceback
import json
from bs4 import BeautifulSoup

#Create dictionary structure that will later be JSON object
data = {}


#even: Arts Library, Biomedical Library, East Asian Library, Law Library,
#even: Rosenfeld Management Library, Music Library, Powell Library,
#even: Research Library (Charles E. Young), SEL/Boelter, SRLF

#odd: Night Powell, SEL/Geology

#List of valid libraries
libraries = ['Arts Library', 'Biomedical Library', 'East Asian Library', 'Law Library', 'Rosenfeld Management Library',
             'Music Library', 'Powell Library', 'Research Library (Charles E. Young)', 'SEL/Boelter', 'SRLF', 'Night Powell', 'SEL/Geology']

#Get the URL
uri = "https://www.library.ucla.edu/hours"

#Query the website and return the html
page = urllib2.urlopen(uri)

#Parse the html using beautiful soup
soup = BeautifulSoup(page, 'html.parser')

#box = soup.find('tr', attrs={'class': 'even'})

#Function to add data to dictionary 
def addData(obj):
    obj2 = obj.find_all('td')
    title = obj2[0].text.strip()

    #Create empty array to hold times; indices starting from Sunday - Saturday
    days = []
        
    #Iterate through indices 1 - 7 to obtain times
    try:
        for i in range(1,7):
            days.append(obj2[i].text.strip())
    except Exception as e:
        print("Error in scraping: " + str(e))

    #Add to the library to the dictionary
    data[title] = days

#Scrape librariees by class labeled odd
for box2 in soup.find_all('tr', attrs={'class': 'even'}):
    t = box2.find_all('td')

    try:
        title = t[0].text.strip()
        if title in libraries:
            addData(box2)

    except Exception as e:
        print("Error in scraping: " + str(e))
 
#Scrape libraries by class labeled even
for box1 in soup.find_all('tr', attrs={'class': 'even'}):
    t = box2.find_all('td')

    try:
        title = t[0].text.strip()
        if title in libraries:
            addData(box1)

    except Exception as e:
        print("Error in scraping: " + str(e))

    

json_data = json.dumps(data)

print(json_data)
