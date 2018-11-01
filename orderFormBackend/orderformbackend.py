# pip install python-firebase, requests==1.1.0, (need python 3.6, conda activate py3.6 form e), flask
from firebase import firebase
from key import key
import googlemaps
from datetime import datetime


addresses = []

firebase = firebase.FirebaseApplication('https://orderformdb.firebaseio.com', None)

result = firebase.get('', None) #gets all
for number in result:
	thisdata = result[number]['data']
	addresses.append([thisdata['latlng'],thisdata['time'],number])

print('ADDRESSES')
print(addresses)







gmaps = googlemaps.Client(key=key)
adjmatrix = []
i=0
j=0

def hr24timesecsdifferent(t1,t2):
	return 60*60*abs(int(t1[:2])-int(t2[:2]))+60*abs(int(t1[3:])-int(t2[3:]))

# make adjacency matrix, 
for numberi in range(len(addresses)):
	thisrow = []
	j=0
	for numberj in range(len(addresses)):
		if(j>i):
			# ever negative time to arrive?? and always assuming leaving now
			gmaps_res = gmaps.distance_matrix(addresses[numberj],addresses[numberi],"bicycling","english",units="metric",departure_time=datetime.now())
			timeduediff = hr24timesecsdifferent(addresses[numberi][1], addresses[numberj][1])
			thisdistance = int(gmaps_res['rows'][0]['elements'][0]['duration']['value']) + timeduediff
			thisrow.append(thisdistance)

			print(i,j)
			print(int(gmaps_res['rows'][0]['elements'][0]['duration']['value']))
			print(timeduediff)
		if(i>j):
			gmaps_res = gmaps.distance_matrix(addresses[numberi],addresses[numberj],"bicycling","english",units="metric",departure_time=datetime.now())
			timeduediff = hr24timesecsdifferent(addresses[numberj][1], addresses[numberi][1])
			thisdistance = int(gmaps_res['rows'][0]['elements'][0]['duration']['value']) + timeduediff
			thisrow.append(thisdistance)

			print(i,j)
			print(int(gmaps_res['rows'][0]['elements'][0]['duration']['value']))
			print(timeduediff)
		if(i==j):
			thisrow.append(0)
		j=j+1
	adjmatrix.append(thisrow)
	i=i+1








#get set partitions of at ost size
k=2

# too partition n, from n-1, just add nth element into an existing subset or add it as new subset
print(adjmatrix)

# def partition(set):
# 	if(len(set)==1):
# 		return [set]
# 	else:
# 		first = set[0]
# 		smaller_partitions = partition(set[1:])
# 		print(smaller_partitions)
# 		#into every different spot..
# 		for smaller_partition in smaller_partitions:
# 			for n, subset in enumerate(smaller_partition):
# 				return smaller_partition[:n]+[[first]+[subset]]+smaller_partition[n+1:]
# 			return smaller_partition+[[first]]


def partition(set):
    if len(set) == 1:
        yield [ set ]
        return

    first = set[0]
    for smaller_partition in partition(set[1:]):
        # insert `first` in each of the subpartition's subsets
        for n, subset in enumerate(smaller_partition):
            yield smaller_partition[:n] + [[ first ] + subset]  + smaller_partition[n+1:]
        # put `first` in its own subset 
        yield [ [ first ] ] + smaller_partition

adjindices = []
[adjindices.append(i) for i in range(len(adjmatrix))]


# remove if contains a subset of great than that size
partitions = []
for partition in partition(adjindices):
	this_partition_check=1
	partition_count_smaller=0
	for subset in partition:
		if(len(subset)>k):
			this_partition_check=0
		elif(len(subset))<k:
			partition_count_smaller=partition_count_smaller+1
	if(this_partition_check and partition_count_smaller<2):
		partitions.append(partition)

# AND IGNORE IF HAVE MORE THAN 1 SUBSET LOGNER THAN K







#sum of distances between all pairs in subset, single subsets vertices ignored?

# through thorgh eahc parittion,, thiscount,, through eachsubset and add total times
# checking min parition index
min_count = 10000
mindex = 0
for partition_index, partition in enumerate(partitions):
	print(partition)
	thiscount = 0
	for subset in partition:
		for i in subset:
			for j in subset:
				thiscount = thiscount+adjmatrix[i][j]
	print(thiscount)
	if(thiscount<min_count):
		min_count=thiscount
		mindex=partition_index


print(partitions[mindex])


# ALSO ORDER IN TIME





# backup/create file
# date
file = open(datetime.now().strftime("%Y%m%d%H%M%S")+".html","w")
 

# then go throug htat partition and write correcpsonding file,, and google maps grouped markers
for subset in partitions[mindex]:
	thisstr="https://www.google.com/maps/dir/"
	for index in subset:
		thisresult = result[addresses[index][2]]
		thisstr = thisstr+str(thisresult['data']['latlng']['lat'])+","+str(thisresult['data']['latlng']['lng'])+"/"
		file.write(str(thisresult))
		file.write("<div></div>")
	file.write("next cluster") 
	file.write("<a href="+thisstr+">points</a>}")
	file.write("<p></p>")

# STUCK AS DIRECTIONS
# https://www.google.com/maps/dir/33.93729,-106.85761/33.91629,-106.866761/33.98729,-106.85861


file.close() 


# delelete all
# firebase.delete('', None)
# leave if note says permanent then leave


















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
# floydm arshall
# netwrokx pariwise
# https://stackoverflow.com/questions/32243572/clustering-with-max-cluster-size


# pre processing, matrix of all pairwise times (assyemtric) wit hadded time difference due
# then nchoosek quadruples, and the poitns not reached, as a set (ie delivery day),,, or just as set prtitions, with a maximum size https://stackoverflow.com/questions/19368375/set-partitions-in-python
# then networkx each set in delivery day, total time travel between (shortest cycle).. pick min for day



# backend, withdraw all entries, and clear
# with flask and google https requests
# https://www.youtube.com/watch?v=PtV-ZnwCjT0

# perform cluster,, clustering of equal(number of arrangmenets fit on bike)
# then save doc with, print orders with google maps markers and accounting
# do arrangments and go as early as can
# remaing flowers arranged and auctioned, higher and sooner wins, reply with amount and address


# later add vehicel routing optimisation,, and online aucitoning/instagrqm auctioning algortihm



