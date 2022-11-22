from pymongo import MongoClient;
import pandas as pd;
bed = pd.read_csv('/Users/poojasreepasupuleti/Documents/BCM/polyAdev/Human_denovoAPAsites.bed', delimiter='\t');
bed.columns =['chromosome', 'startPosition', 'endPosition', 'geneId', 'feature', 'strand'];
print(bed.head(5));

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017')
db = client.polyAdb
# print('Connected successfully to server');
try: db.command("serverStatus")
except Exception as e: print(e)
else: print("You are connected!")

# Checking database exists:
print(client.list_database_names())
dblist = client.list_database_names()
if "polyAdb" in dblist:
  print("The database exists.")

collist = db.list_collection_names()
if "genes" in collist:
  print("The collection exists.")
  collection_name = db["genes"]
  bed.reset_index(inplace=True)
  data_dict = bed.to_dict("records")
else:
    collection_name = db["genes"]
    bed.reset_index(inplace=True)
    data_dict = bed.to_dict("records")

# Insert collection
collection_name.insert_many(data_dict)

#Query
myquery = { "geneId": "ENSG00000131724.11"};
mydoc = collection_name.find_one(myquery);
print(mydoc)
# for x in mydoc:
#   print(x);