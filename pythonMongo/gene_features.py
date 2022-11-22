from pymongo import MongoClient;
import pandas as pd;
gene_features = pd.read_csv('/Users/poojasreepasupuleti/Downloads/venkata_bw/Human/Gene_Features.bed', delimiter='\t', header=None)
gene_features.columns =['chromosome', 'startPosition', 'endPosition', 'geneId', 'feature', 'strand']
print(gene_features.head(5))

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
if "gene_features" in collist:
  print("The collection exists.")
  collection_name = db["gene_features"]
  gene_features.reset_index(inplace=True)
  data_dict = gene_features.to_dict("records")
else:
    collection_name = db["gene_features"]
    gene_features.reset_index(inplace=True)
    data_dict = gene_features.to_dict("records")

# Insert collection
collection_name.insert_many(data_dict)

