from io import StringIO
import os
import subprocess
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import mysql.connector

app = FastAPI()

origins = [
    "http://localhost:3000",  # Allow the domain where your frontend runs
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

# Retrieve database credentials from environment variables
load_dotenv()
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_DATABASE = os.getenv("DB_DATABASE")

mydb = mysql.connector.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_DATABASE
)

def add_to_db(code: str, output: str):
    mycursor = mydb.cursor()
    mycursor.execute("INSERT INTO codeoutputs (code, output) VALUES (%s, %s)", (code, output))
    mydb.commit()
    mycursor.close()

class Code(BaseModel):
    code: str

def install_dependencies():
    # Install pandas and scipy using pip
    subprocess.run(['pip', 'install', 'pandas', 'scipy'])
    
def run_code(code: str):
    #TODO: Implement code execution logic
    old_stdout = sys.stdout
    redirected_output = sys.stdout = StringIO()
    try:
        exec(code)
        return redirected_output.getvalue(), "success"
    except Exception as e:
        return str(e), "error"
    finally:
        sys.stdout = old_stdout
    

@app.post("/test_code")
async def execute_code(code: Code):
    install_dependencies()
    output, status = run_code(code.code)
    return {"output": output, "status": status}


@app.post("/submit_code")
async def submit_code(code: Code):
    install_dependencies()
    output, status = run_code(code.code)
    if status == "success":
        add_to_db(code.code, output)
    return {"output": output, "status": status}
