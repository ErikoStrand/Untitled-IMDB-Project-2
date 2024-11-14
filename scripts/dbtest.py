import json
import pymysql
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.dev.local')

# Database connection parameters
db_host = os.getenv("DB_HOST")
db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')
db_name = os.getenv('DB_NAME')

# Timeout settings
timeout = 120

# Load the JSON file
with open('./static/data/facts.json', 'r') as file:
    facts_data = json.load(file)

# Establish connection
connection = pymysql.connect(
    charset="utf8mb4",
    connect_timeout=timeout,
    cursorclass=pymysql.cursors.DictCursor,
    db=db_name,
    host=db_host,
    password=db_password,
    read_timeout=timeout,
    port=20968,
    user=db_user,
    write_timeout=timeout,
)

try:
    # Create cursor
    cursor = connection.cursor()
    
    # Prepare the insert query
    insert_query = "INSERT INTO facts (category, description) VALUES (%s, %s)"
    
    # Extract facts from the JSON
    facts_list = facts_data['movie_facts']
    
    # Prepare data for bulk insert
    facts_to_insert = [(fact['category'], fact['description']) for fact in facts_list]
    
    # Execute bulk insert
    cursor.executemany(insert_query, facts_to_insert)
    
    # Commit the transaction
    connection.commit()
    
    # Print number of inserted rows
    print(f"Successfully inserted {cursor.rowcount} facts")

except pymysql.Error as e:
    # Handle any errors
    print(f"Error: {e}")
    connection.rollback()

finally:
    # Close the connection
    connection.close()