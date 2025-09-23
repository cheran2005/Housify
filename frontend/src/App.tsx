//import react router for client-side navigation
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//import components 
import Navbar from "./components/navbar";
import Home from "./components/home";
import Predict from "./components/predict"
import MortgageCalc from "./components/mortgageCalc"

//Entire web page
function App() {
  
  return (
    
    <Router>
      {/*Navbar stays consistent, different component for different route paths below Navbar*/}
      <Navbar />   
      <div className="pt-15  h-screen ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/mortgageCalc" element={<MortgageCalc/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
