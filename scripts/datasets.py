import json
import os
import csv
import gzip
import shutil
import requests
from collections import defaultdict
import pymysql
import time

#combines these 3 into 1 master file.
episodeLink = "https://datasets.imdbws.com/title.episode.tsv.gz"
titleBasics = "https://datasets.imdbws.com/title.basics.tsv.gz"
titleRatings = "https://datasets.imdbws.com/title.ratings.tsv.gz"



timeout = 120
connection = pymysql.connect(
  charset="utf8mb4",
  connect_timeout=timeout,
  cursorclass=pymysql.cursors.DictCursor,
  db="defaultdb",
  host="",
  password="",
  read_timeout=timeout,
  port=20968,
  user="avnadmin",
  write_timeout=timeout,
)

# Function to download and extract the file
def download_and_extract(url, destination_folder):
    # Download the file
    file_path = os.path.join(destination_folder, "data.tsv.gz")
    with open(file_path, "wb") as f:
        response = requests.get(url)
        f.write(response.content)

    # Extract the file
    with gzip.open(file_path, 'rb') as f_in, open(os.path.join(destination_folder, "data.tsv"), 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)

    # Delete the compressed file
    os.remove(file_path)

def deleteOld():
    # Delete the extracted files
    extracted_files = os.listdir(data_folder)
    for file_name in extracted_files:
        if file_name.endswith(".tsv"):
            file_path = os.path.join(data_folder, file_name)
            os.remove(file_path)
    print("Extracted files deleted.")


def processTSV(which):
    tsv_file = os.path.join(data_folder, "data.tsv")
    with open(tsv_file, mode='r', encoding='utf-8') as file:
        print("Opened file")
        # Count rows without consuming the iterator
        file.seek(0)  # Reset file pointer to beginning
        count = sum(1 for _ in file) - 1  # Subtract 1 for header
        
        # Reset file pointer again
        file.seek(0)
        reader = csv.reader(file, delimiter='\t')
        
        # Skip header
        next(reader, None)
        
        # Iterate over each row in the TSV file
        if (which == "basic"):
            for index, row in enumerate(reader, 1):
                if index % max(1, count // 1000) == 0:
                    print(f"Processing Basics: {index}/{count} ({index/count*100:.2f}%)")

                if row[0] not in data:
                    data[row[0]] = {}

                data[row[0]]["type"] = row[1]
                data[row[0]]["title"] = row[2]
                data[row[0]]["isAdult"] = row[4]
                data[row[0]]["release"] = row[5]
                data[row[0]]["ended"] = row[6]
                data[row[0]]["runtime"] = int(float(row[7])) if row[7] and row[7] != '\\N' and isinstance(row[7], (str, int, float)) and str(row[7]).replace('.','',1).isdigit() else 0
                
                if len(row) == 9:
                    genres = row[8].split(",")
                    data[row[0]]["genres"] = ','.join(genres) if len(row) == 9 else None

        elif (which == "episode"):
            for index, row in enumerate(reader, 1):
                if index % max(1, count // 1000) == 0:
                    print(f"Processing Episode: {index}/{count} ({index/count*100:.2f}%)")

                if (row[0] in data):
                    data[row[0]]["parent"] = row[1]
                    data[row[0]]["season"] = row[2] if row[2] != '\\N' else 0
                    data[row[0]]["episode"] = row[3] if row[3] != '\\N' else 0
                    if ("episodeCount" not in data[row[1]]):
                        data[row[1]]["episodeCount"] = 0
                    data[row[1]]["episodeCount"] += 1

        elif (which == "rating"):
            for index, row in enumerate(reader, 1):
                if index % max(1, count // 1000) == 0:
                    print(f"Processing Ratings: {index}/{count} ({index/count*100:.2f}%)")

                if (row[0] in data):
                    data[row[0]]["rating"] = row[1]
                    data[row[0]]["votes"] = row[2]

            

def processJSON():
    batchSize = 5000
    count = len(data)
        

    cursor = connection.cursor()
    # Iterate over each row in the TSV file
    sql = """
    INSERT INTO data 
    (id, parent, title, type, release, ended, genres, rating, votes, runtime, season, episode, episodeCount, isAdult) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    for index, (key, value) in enumerate(data.items()):

        ## continute changing making db upload with finished json. you know dont forget please.
        if index % max(1, count // 1000) == 0:
            print(f"Processing Basics: {index}/{count} ({index/count*100:.2f}%)")
        for index, row in enumerate(reader, 1):
            if index % max(1, count // 1000) == 0:
                print(f"Processing Basics: {index}/{count} ({index/count*100:.2f}%)")

            # Handling genres separately
            if len(row) == 9:
                genres = row[8].split(",")
            runtime = int(float(row[7])) if row[7] and row[7] != '\\N' and isinstance(row[7], (str, int, float)) and str(row[7]).replace('.','',1).isdigit() else 0
            genres_str = ','.join(genres) if len(row) == 9 else None

            values = (
                row[0],        # id
                row[1],        # type
                row[2],        # title
                row[4],        # isAdult
                row[5],        # release
                row[6],        # ended
                runtime,       # runtime
                genres_str     # genres
            )
            batchValues.append(values)

            if (len(batchValues) >= batchSize):
                cursor.executemany(sql, batchValues)
                connection.commit()
                batchValues = []

        if batchValues:
            cursor.executemany(sql, batchValues)
            connection.commit()
            batchValues = []
        
    elif (which == "episode"):
        sql = """
            INSERT INTO data 
            (id, parent, season, episode) 
            VALUES (%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                parent = VALUES(parent),
                season = VALUES(season),
                episode = VALUES(episode)
            """
        for index, row in enumerate(reader, 1):
            if index % max(1, count // 1000) == 0:
                print(f"Processing Episode: {index}/{count} ({index/count*100:.2f}%)")

            season = row[2] if row[2] != '\\N' else 0
            episode = row[3] if row[3] != '\\N' else 0
            values = (
                row[0], #id
                row[1], #parent
                season, #season
                episode, #episode
            )
            batchValues.append(values)

            if (len(batchValues) >= batchSize):
                cursor.executemany(sql, batchValues)
                connection.commit()
                batchValues = []

        if batchValues:
            cursor.executemany(sql, batchValues)
            connection.commit()
            batchValues = []

            
#                if ("episodeCount" not in data[row[1]]):
#                    data[row[1]]["episodeCount"] = 0
#                    data[row[1]]["episodeCount"] += 1

    elif (which == "rating"):
        for index, row in enumerate(reader, 1):
            if index % max(1, count // 1000) == 0:
                print(f"Processing Ratings: {index}/{count} ({index/count*100:.2f}%)")

            if (row[0] in data):
                data[row[0]]["rating"] = row[1]
                data[row[0]]["votes"] = row[2]

            
try:
    data = {}
    # Root directory
    root_dir = os.path.dirname(os.path.abspath(__file__))
    data_folder = os.path.join(root_dir, "../static/data")

    #Download and extract the file
    download_and_extract(titleBasics, data_folder)
    processTSV("basic")
    deleteOld()
    download_and_extract(episodeLink, data_folder)
    processTSV("episode")
    deleteOld()
    download_and_extract(titleRatings, data_folder)
    processTSV("rating")
    deleteOld()

finally:
    #fix so it uploads to database.
    processJSON(data)

#    data = json.dumps(data)
#    
#    # Save json_data to a JSON file named 'episodes_data.json' in the data folder
#    json_file_path = os.path.join(data_folder, "data.json")
#    with open(json_file_path, 'w') as json_file:
#        json_file.write(data)
#    print("Finished Making JSON", data)
    deleteOld()

