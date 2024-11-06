import pymysql

timeout = 10
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
  
try:
    cursor = connection.cursor()
    cursor.execute("INSERT INTO data (id) VALUES ('t383229')")
    cursor.execute("INSERT INTO data (id) VALUES ('tt2939192')")
    connection.commit()

finally:
  connection.close()