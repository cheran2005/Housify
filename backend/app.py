#venv\Scripts\activate
#python app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)  # allow React frontend to talk to backend

# load trained model
model_lr = joblib.load("models/linear_regression_model.pkl")

model_rf = joblib.load("models/random_forest_regressor_model.pkl")

@app.route("/")
def home():
    return jsonify({"message": "Backend is running!"})

@app.route("/submit_LR", methods=["POST"])
def predict_LR():
    data = request.get_json()
    print("📦 Incoming JSON:", data)
    # replace empty values with NaN
    for key, value in data.items():
        if value in ("", None):
            data[key] = np.nan

    df = pd.DataFrame([data])
    print("columns:", df.columns.tolist())

    prediction = model_lr.predict(df)[0]


    return jsonify({"prediction": float(prediction)})

@app.route("/submit_RF", methods=["POST"])
def predict_RF():
    data = request.get_json()
    print("📦 Incoming JSON:", data)
    # replace empty values with NaN
    for key, value in data.items():
        if value in ("", None):
            data[key] = np.nan

    df = pd.DataFrame([data])
    print("columns:", df.columns.tolist())

    prediction = model_rf.predict(df)[0]


    return jsonify({"prediction": float(prediction)})


if __name__ == "__main__":
    app.run(debug=True)
