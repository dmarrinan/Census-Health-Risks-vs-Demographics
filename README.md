# Health Risks vs. Demographic Values

## Purpose
This plot looks at the relationship between various demographic measurements and health risk factors for each US state. This plot was built using d3.js.

app.py is a flask app that returns a jsonified object built using data from a csv file. The csv contains information gathered by the US Census Bureau in 2014 on a state by state basis on the following: the percentage of residents that with maximum education of a high school diploma or less, the median income of residents in US dollars, the median age of residents. It also contains data from a survey done by the  Behavioral Risk Factor Surveillance System in 2014 on a state by state basis for the following risk factors: percentage obesity rate of residents, percentage of residents lacking insurance, and the percentage of residents that have been diagnosed with depression at some point in their lives by a doctor. By clicking on the axis labels on this chart, one can look at the relationship between each of these demographic statistics and each of these health risk factors. 

## Requirements
This notebook requires python to be installed. Python 3.6.2 was used during development. SQLAlchemy was used to query the databases in python. Flask was used to host the app to return the data for the plots in json format. All required libraries can be found in requirements.txt and installed with the following command: 

pip install requirements.txt -r 


## Running the Code
To run the flask app type the following into the command line: 

python app.py 

Copy the local address listed into your browser and it will render the html page. Use the dropdown menu to switch between different subjects from the study.

## Link to App
https://gentle-mountain-43633.herokuapp.com/
