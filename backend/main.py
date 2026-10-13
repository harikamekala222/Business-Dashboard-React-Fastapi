import os
import mysql.connector

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mysql.connector import Error

app = FastAPI()

# CORS: configure your actual frontend origin if needed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv(
        "CORS_ORIGINS", "http://13.229.87.119:5173"
    ).split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "database"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER", "appuser"),
        password=os.environ["DB_PASSWORD"],
        database=os.getenv("DB_NAME", "business_db"),
    )


def fetch_data(query, key):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(query)

        return [
            {key: row[0], "total": int(row[1])}
            for row in cursor.fetchall()
        ]

    except Error:
        raise HTTPException(
            status_code=503,
            detail="Database query failed",
        )

    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None and connection.is_connected():
            connection.close()


@app.get("/city-wise")
def city_wise():
    query = """
        SELECT city, COUNT(*) AS total
        FROM listing_master
        GROUP BY city
    """
    return fetch_data(query, "city")


@app.get("/category-wise")
def category_wise():
    query = """
        SELECT category, COUNT(*) AS total
        FROM listing_master
        GROUP BY category
    """
    return fetch_data(query, "category")


@app.get("/source-wise")
def source_wise():
    query = """
        SELECT source, COUNT(*) AS total
        FROM listing_master
        GROUP BY source
    """
    return fetch_data(query, "source")


@app.get("/health")
def health():
    connection = None
    try:
        connection = get_db_connection()
        connection.ping(reconnect=False)
        return {"status": "healthy", "database": "connected"}
    except Error:
        raise HTTPException(status_code=503, detail="Database unavailable")
    finally:
        if connection is not None and connection.is_connected():
            connection.close()

