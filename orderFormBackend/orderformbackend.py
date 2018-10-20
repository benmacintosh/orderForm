# pip install python-firebase, requests==1.1.0, (need python 3.6, conda activate py3.6 form e), flask
import datetime
from firebase import firebase




addresses = {}

firebase = firebase.FirebaseApplication('https://orderformdb.firebaseio.com', None)

# result = firebase.get('/22/data', None)
result = firebase.get('', None) #gets all
print(result)
for number in result:
	thisdata = result[number]['data']
	addresses[number]=[thisdata['latlng'],thisdata['time']]
print(addresses)







# sort











# backup/create file
# date
file = open(datetime.datetime.now().strftime("%Y%m%d%H%M%S")+".txt","w")
 
file.write("ass") 

file.close() 


# delelete all
# firebase.delete('', None)



















# front end, order forms

# telephone number (entering existing number order with be replaced)

# notes

# address (and be within km range of origin)

# time delver by
# and cant be closer in time than time to reach from nearest other point in time delivery	

# pay (minimum 33)

# pay on delivery or paypal button which wait and return "paid"

# submit button (not subimittable until all entered, and not above units in fireabse, submits array, and idsplay total dollars of 	arrangements available)

# and show instagram link/img



# add permissions to server




# https://stackoverflow.com/questions/5452576/k-means-algorithm-variation-with-equal-cluster-size



# backend, withdraw all entries, and clear
# with flask and google https requests
# https://www.youtube.com/watch?v=PtV-ZnwCjT0

# perform cluster,, clustering of equal(number of arrangmenets fit on bike)
# then save doc with, print orders with google maps markers and accounting
# do arrangments and go as early as can
# remaing flowers arranged and auctioned, higher and sooner wins, reply with amount and address


# later add vehicel routing optimisation,, and online aucitoning/instagrqm auctioning algortihm



