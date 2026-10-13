import pandas as pd
import mysql.connector

# CSV read
df = pd.read_csv("../dashboard.csv")

# MySQL connect
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Nothing@12",
    database="business_db"
)

cursor = db.cursor()

query = """
INSERT INTO listing_master
(business_name, category, city, address, phone, source)
VALUES (%s, %s, %s, %s, %s, %s)
"""

for index, row in df.iterrows():

    values = (
        row["business_name"],
        row["category"],
        row["city"],
        row["address"],
        row["phone"],
        row["source"]
    )

    cursor.execute(query, values)

db.commit()

print("Data Inserted Successfully")