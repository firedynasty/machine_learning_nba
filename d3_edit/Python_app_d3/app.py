import json

from flask import Flask, render_template, jsonify
import pandas as pd

app = Flask(__name__)

@app.route("/")
def index():
  
    # data = {'chart_data': chart_data}
    return render_template("index.html")


@app.route("/api/pals")
def pals():
    df = pd.read_csv('data.csv')
    chart_data = df.to_dict(orient='records')

    
    return jsonify(chart_data)




if __name__ == "__main__":
    app.run(debug=True)
