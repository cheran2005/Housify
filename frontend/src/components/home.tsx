import { Link } from "react-router-dom";
import CenterSnapCarousel from "../components/side_scroll_bar";

import logo from "../assets/housify-logo.png";
import img1 from "../assets/2e36211745334e49c88f65bd33ef77b4.jpg";
import img2 from "../assets/artworks-NJlBdWlgSd3XwDY7-nBBbww-t500x500.jpg";

export default function Home() {
  const images = [logo, img1, img2];
  return (
    <div className ="w-full flex flex-col space-y-20 items-center justify-center ">
        <h1 className="text-5xl font-raleway font-[550]">Price For Every Moment</h1>
        
          <Link to="/predict" className="font-raleway border border-[rgb(255,166,83)] shadow-2xl shadow-black/60 text-4xl  
          rounded-full px-2 py-1 hover:bg-[rgb(255,195,139)] duration-700 transform-gpu 
          transition-transform ease-out hover:-translate-y-2 ">Get Your Prediction Now!</Link>

          <CenterSnapCarousel images={images}/>
    </div>
  );
}