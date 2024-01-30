from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os
import csv
from collections import defaultdict

# Replace placeholders with your actual password and database name
password = "TtL3EaYzGSgaTT6q"

# Construct the connection URI
uri = f"mongodb+srv://UntitledProject:{password}@untitledproject.lj87vfy.mongodb.net/?retryWrites=true&w=majority"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print("Error:", e)

try:
    script_dir = os.path.dirname(os.path.realpath(__file__))

    # Path to the TSV file
    tsv_file = "data/episodeData.tsv"

    # Dictionary to store counts of unique IDs
    id_counts = defaultdict(int)

    # Read the TSV file
    with open(tsv_file, mode='r') as file:
        reader = csv.reader(file, delimiter='\t')
        # Skip header if exists
        next(reader, None)
        
        # Iterate over each row in the TSV file
        for row in reader:
            id_counts[row[1]] += 1 

    # Convert defaultdict to a regular dictionary and sort by values
    sorted_id_counts = dict(sorted(id_counts.items(), key=lambda item: item[1], reverse=True))

    # MongoDB connection parameters
    db_name = "Untitled_Project"
    collection_name = "episode_count"

    # Get the database and collection
    db = client[db_name]
    collection = db[collection_name]

    # Check if a document already exists in the collection
    existing_document = collection.find_one()

    if existing_document:
        # Update the existing document with the new data
        collection.replace_one({}, sorted_id_counts)
        print("Existing document updated in MongoDB.")
    else:
        # Insert the new document
        collection.insert_one(sorted_id_counts)
        print("New document inserted into MongoDB.")

finally:
    # Close the MongoDB connection
    client.close()
    print("MongoDB connection closed.")
