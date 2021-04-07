from flask import Flask, request, render_template, url_for, redirect, session
import json


app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/get-ingredients")
def ingredientList():
    with open('ingredientNames.json') as json_file:
        data = json.load(json_file)
    return data

