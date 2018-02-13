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
    states = []
    state_abreviations = []
    age = []
    income = []
    high_school_or_less = []
    suffered_depression = []
    obese = []
    lacks_insurance = []

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
                states.append(row[0])
                state_abreviations.append(row[1])
                age.append(row[2])
                income.append(row[3])
                high_school_or_less.append(row[4])
                suffered_depression.append(row[5])
                obese.append(row[6])
                lacks_insurance.append(row[7])

    data_object = {
        'states': states,
        'state_abreviations': state_abreviations,
        'age': age,
        'income': income,
        'high_school_or_less': high_school_or_less,
        'suffered_depression': suffered_depression,
        'obese': obese,
        'lacks_insurance': lacks_insurance
    }
    print(data_object)
    return jsonify(data_object)

# create route that renders index.html template


@app.route("/")
def home():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
