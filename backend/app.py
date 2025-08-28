from flask import Flask, request,jsonify ,render_template

import joblib
import pandas as pd
import numpy as np


app = Flask(__name__)

model_linear_regression = joblib.load("models/linear_regression_model.pkl")

@app.route('/')
def home():
    return render_template("index.html")


@app.route('/submit_LR', methods=['POST'])

def predict_LR():
    data = request.get_json()

    for a,b in data.items():
        if b in ("",None):
            data[a] = np.nan
    df = pd.DataFrame([data])   
    prediction_price = model_linear_regression.predict(df)[0]

    return jsonify({"prediction": float(prediction_price)})

if __name__ == '__main__':
    app.run(debug=True)