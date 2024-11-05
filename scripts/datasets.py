import json
import os
import csv
import gzip
import shutil
import requests
from collections import defaultdict

#combines these 3 into 1 master file.
episodeLink = "https://datasets.imdbws.com/title.episode.tsv.gz"
titleBasics = "https://datasets.imdbws.com/title.basics.tsv.gz"
titleRatings = "https://datasets.imdbws.com/title.ratings.tsv.gz"
# Function to download and extract the file
def download_and_extract(url, destination_folder):
    # Download the file
    file_path = os.path.join(destination_folder, "title.episode.tsv.gz")
    with open(file_path, "wb") as f:
        response = requests.get(url)
        f.write(response.content)

    # Extract the file
    with gzip.open(file_path, 'rb') as f_in, open(os.path.join(destination_folder, "data.tsv"), 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)

    # Delete the compressed file
    os.remove(file_path)


try:
    # Root directory
    root_dir = os.path.dirname(os.path.abspath(__file__))
    data_folder = os.path.join(root_dir, "../static/data")

    # Download and extract the file
    download_and_extract(episodeLink, data_folder)

    # Path to the TSV file
    tsv_file = os.path.join(data_folder, "data.tsv")

    # Dictionary to store counts of unique IDs
    id_counts = defaultdict(int)
    parentData = {}

    # Read the TSV file
    with open(tsv_file, mode='r', encoding='utf-8') as file:
        reader = csv.reader(file, delimiter='\t')
        # Skip header if exists
        next(reader, None)
        
        # Iterate over each row in the TSV file
        for row in reader:
            id_counts[row[1]] += 1
            parentData[row[0]] = row[1]
            

    # Convert defaultdict to a regular dictionary and sort by values
    sorted_id_counts = dict(sorted(id_counts.items(), key=lambda item: item[1], reverse=True))
    json_data = json.dumps(sorted_id_counts)
    parentData = json.dumps(parentData)
    
    # Save json_data to a JSON file named 'episodes_data.json' in the data folder
    json_file_path = os.path.join(data_folder, "episodes_data.json")
    parentData_path = os.path.join(data_folder, "parent_data.json")
    with open(json_file_path, 'w') as json_file:
        json_file.write(json_data)
    with open(parentData_path, "w") as parent_file:
        parent_file.write(parentData)


finally:
    # Delete the extracted files
    extracted_files = os.listdir(data_folder)
    for file_name in extracted_files:
        if file_name.endswith(".tsv"):
            file_path = os.path.join(data_folder, file_name)
            os.remove(file_path)
    print("Extracted files deleted.")
