// Import React Router's Link for client-side navigation
import { Link } from "react-router-dom";

// Import custom carousel component for an horizontal scrollbar display of images
import CenterSnapCarousel from "../components/side_scroll_bar";

// Import static assets (logo & images)

import img1 from "../assets/Pickering-house.jpg";
import img2 from "../assets/Ajax-house.jpg";
import img3 from "../assets/Whitby-house.jpg";
import img4 from "../assets/Toronto_House.jpg";

// Home page component
export default function Home() {
  // Array of images passed into carousel component
  const images = [img1, img2,img3,img4];
  return (
    <div className ="w-full flex flex-col space-y-20 items-center justify-center ">
      {/* Hero title with brand messaging */}
        <h1 className="text-5xl font-raleway font-[550]">Price For Every Moment</h1>

          {/* Call-to-action button linking to the prediction form */}
          <Link to="/predict" className="font-raleway border border-[rgb(255,166,83)] shadow-2xl shadow-black/60 text-4xl  
          rounded-full px-2 py-1 hover:bg-[rgb(255,195,139)] duration-700 transform-gpu 
          transition-transform ease-out hover:-translate-y-2 ">Get Your Prediction Now!</Link>

          {/* Carousel to showcase images */}
          <CenterSnapCarousel images={images}/>
    </div>
  );
}