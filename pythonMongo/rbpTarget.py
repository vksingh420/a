from pymongo import MongoClient;
import pandas as pd;
rbp_df = pd.read_csv('/Users/poojasreepasupuleti/Downloads/venkata_bw/Human/RBP_targets.txt', delimiter='\t', header=None)
rbp_df.columns =['chromosome', 'startPosition', 'endPosition', 'description1', 'strand', 'description2','description3','description4', 'sampleIds']
print(rbp_df.head(5))

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
if "rbpTargets" in collist:
  print("The collection exists.")
  collection_name = db["rbpTargets"]
  rbp_df.reset_index(inplace=True)
  print(rbp_df)
  data_dict = rbp_df.to_dict("records")
else:
    collection_name = db["rbpTargets"]
    rbp_df.reset_index(inplace=True)
    print(rbp_df)
    data_dict = rbp_df.to_dict("records")

for i in range(30000000, 38361545):
    collection_name.insert_one(data_dict[i])
print("Inserted")
