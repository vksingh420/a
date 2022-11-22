from pymongo import MongoClient;
import pandas as pd;
biomartGenes = pd.read_csv('/Users/poojasreepasupuleti/Downloads/venkata_bw/Human/biomart_EnsembleGeneID_GeneSymbol.txt', delimiter='\t')
print(biomartGenes.head(5))

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
if "biomartGenes" in collist:
  print("The collection exists.")
  collection_name = db["biomartGenes"]
  biomartGenes.reset_index(inplace=True)
  data_dict = biomartGenes.to_dict("records")
else:
    collection_name = db["biomartGenes"]
    biomartGenes.reset_index(inplace=True)
    data_dict = biomartGenes.to_dict("records")
    

# Insert collection
collection_name.insert_many(data_dict)

