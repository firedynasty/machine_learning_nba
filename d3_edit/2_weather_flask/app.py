# import necessary libraries
from flask import Flask, request, jsonify, render_template, redirect
from flask_pymongo import PyMongo
import pandas as pd
import json
from datetime import datetime
import requests
from pandas.io.json import json_normalize



# create instance of Flask app
app = Flask(__name__)

mongo = PyMongo(app, uri="mongodb://localhost:27017/new_york_weather")



value_list = []
key_list = []

# create route that renders index.html template
@app.route("/")
def home():

    new_york_info = mongo.db.collection.find_one()

    return render_template("index.html", news_info=new_york_info)




@app.route('/call')
def search_city():
    # API_KEY = "201c28e77ed12306e4f20f08db82aa7a"  # initialize your key here
    # call API and convert response into Python dictionary
    # url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&APPID={API_KEY}'
    query_url = "http://api.openweathermap.org/data/2.5/forecast?id=" + "5128581" + "&units=imperial"+"&appid=" + "201c28e77ed12306e4f20f08db82aa7a"

    weather_response = requests.get(query_url)
    weather_json = weather_response.json()
    #https://openweathermap.org/city/5128581

    # return f" Ny Temp Current Temp: {weather_response['list'][0]['main']['temp']}"

    df = pd.io.json.json_normalize(weather_json, 'list')

    # df = pd.json_normalize(weather_json, 'list')
    df['date'] = pd.to_datetime(df['dt'],unit='s')
    df['day'] = 0
   
    for index, row in df.iterrows():
      df['day'][index] = df['date'][index].strftime('%d')

    df['description'] = "0"

    for index, row in df.iterrows():
      df['description'] = df['weather'][index][0]['description']

    list_of_descriptions = df['description'].tolist()

    check_for_snow_list = [s for s in list_of_descriptions if "snow" in s]
    check_for_rain_list = [s for s in list_of_descriptions if "rain" in s]

    if len(check_for_snow_list) > 0:
      snow_variable = 'Yes'
    else:
      snow_variable = 'No'

    if len(check_for_rain_list) > 0:
      rain_variable = 'Yes'
    else:
      rain_variable = 'No'

    now = datetime.now()
    todays_day = int(now.strftime('%d'))
    tomorrows_day = todays_day + 1
    
    filtered_df = df.loc[df['day'] == tomorrows_day, :]

    new_york_max_temp = round(filtered_df['main.temp'].max())

    new_york_min_temp = round(filtered_df['main.temp'].min())

    tomorrows_date = filtered_df['date'].tolist()[0].strftime('%Y-%m-%d')

    new_york_weather_data = {
      "snow_variable": snow_variable,
      "rain_variable": rain_variable,
      "date": tomorrows_date,
      "min_temp": new_york_min_temp,
      "max_temp": new_york_max_temp
    }
    
    mongo.db.collection.update({}, new_york_weather_data, upsert=True)

    return redirect("/")



    # # error like unknown city name, inavalid api key
    # if response.get('cod') != 200:
    #     message = response.get('message', '')
    #     return f'Error getting temperature for {city.title()}. Error message = {message}'

    # # get current temperature and convert it into Celsius
    # current_temperature = response.get('main', {}).get('temp')
    # if current_temperature:
    #     current_temperature_celsius = round(current_temperature - 273.15, 2)
    #     return f'Current temperature of {city.title()} is {current_temperature_celsius} &#8451;'
    # else:
    #     return f'Error getting temperature for {city.title()}'




if __name__ == "__main__":
    app.run(debug=True)
