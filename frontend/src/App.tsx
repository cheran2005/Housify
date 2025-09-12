
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import Home from "./components/home";
import Predict from "./components/predict"


function App() {
  
  return (

    <Router>
      <Navbar />   
      <div className="pt-40  h-screen font-raleway ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predict />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
