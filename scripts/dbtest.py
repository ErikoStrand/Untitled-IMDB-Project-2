import pymysql
import os
from dotenv import load_dotenv

load_dotenv('.env.dev.local')

db_host = os.getenv("DB_HOST")
db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')
db_name = os.getenv('DB_NAME')

timeout = 120
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
    cursor = connection.cursor()
    cursor.execute("INSERT INTO basic (id) VALUES ('t383229')")
    cursor.execute("INSERT INTO basic (id) VALUES ('tt2939192')")
    connection.commit()

finally:
  connection.close()