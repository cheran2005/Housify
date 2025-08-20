# Technical Architecture – Houseify

## Architecture Diagram
Frontend (React) → Backend (Flask API) → ML Model (scikit-learn)  
Database (optional for storing historical inputs)  
External APIs: Google Maps API  

## Tech Stack Choice
- **Frontend:** React (clean UI, dropdown model selection, responsive)  
- **Backend:** Flask (simple, lightweight Python backend)  
- **ML Model:** scikit-learn (Random Forest, Linear Regression, etc.)  
- **Hosting:** Render / Vercel / Heroku  
- **Database (Optional):** PostgreSQL / MongoDB for logging predictions  

## Data Flow
1. User enters details in form.  
2. Form data sent to Flask backend via `/predict`.  
3. Backend loads ML model, runs prediction.  
4. Response returned as JSON.  
5. Frontend displays predicted price + chart.  

## Deployment Plan
- Initial deployment on **Render** (free tier).  
- Later migrate to **AWS / GCP** for scaling.  
- CI/CD with GitHub Actions.  
