import pandas as pd
import csv
import os
from flask import(
    Flask,
    render_template,
    jsonify
)

app = Flask(__name__)

# create route to return object containing data


@app.route("/data")
def data():
    # set empty arrays
    object_list = []

    # set path for data.csv
    csvpath = os.path.join("data", "data.csv")

    # set flag for headers
    headers_flag = 0

    #read in data
    with open(csvpath, newline="") as csvfile:
        csvreader = csv.reader(csvfile, delimiter=",")

        for row in csvreader:
            if headers_flag == 0:
                headers_flag = 1
            else:
                obj = {'states':row[0],
                    'state_abreviations':row[1],
                    'age':row[2],
                    'income':row[3],
                    'high_school_or_less':row[4],
                    'suffered_depression':row[5],
                    'obese':row[6],
                    'lacks_insurance':row[7]}
                object_list.append(obj)
    print(object_list)
    return jsonify(object_list)

# create route that renders index.html template


@app.route("/")
def home():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
