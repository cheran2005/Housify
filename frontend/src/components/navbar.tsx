import myLogo from '../assets/housify-logo.png';

import { FaGithub, FaLinkedin,FaUser } from "react-icons/fa";

import { Link } from "react-router-dom";

export default function Navbar() {
  
  return (
    <>
      <nav className="flex items-center justify-between w-full px-6 py-4  bg-transparent font-raleway ">

            
        <div className="justify-start border border-transparent rounded-full py-2 px-2 shadow-lg bg-[rgb(250,201,126)]">
          <a  className="flex gap-5" title="Start Of Web Page"><img src={myLogo} alt="My Logo" className="w-10 h-10 " /><p className="text-4xl font-[450]">Housify</p></a>
        </div>

       
       
        <div className="flex absolute left-1/2 transform -translate-x-1/2  border border-[rgb(255,166,83)] rounded-full py-1.2 shadow-lg font-[400]">
          <Link to="/" className="text-2xl border border-transparent bg-transparent rounded-full py-1 px-3 hover:bg-[rgb(250,213,178)]  transition-all duration-800 hover:shadow-lg" title="Home">Home</Link>
          <Link to="/predict" className="text-2xl border border-transparent bg-transparent rounded-full py-1 px-3 hover:bg-[rgb(255,195,139)]  transition-all duration-800 hover:shadow-lg " title="Predict">Predict</Link>
          <Link to="/mortgage" className="text-2xl border border-transparent bg-transparent rounded-full py-1 px-3 hover:bg-[rgb(255,195,139)]  transition-all duration-800 hover:shadow-lg " title="Mortgage calculator">Mortgage calculator</Link>
        </div>
            
        <div className="flex gap-5 ">
          <a href="https://cheran2005.github.io/Cheran-Portfolio/" target="_blank" className="bg-transparent  px-2 border-1 border-black rounded-full p-2 hover:bg-[rgb(255,200,155)] transition-all duration-800 shadow-[5px_5px_5px_rgba(0,0,0,0.5)]" title="Cheran's Portfolio"><FaUser className=" text-3xl" /></a>
          <a href="https://github.com/cheran2005"   target="_blank" title="Cheran GitHub" className="border-1 border-black rounded-full p-2 hover:bg-[rgb(255,200,155)] transition-all duration-800 shadow-[5px_5px_5px_rgba(0,0,0,0.5)]"><FaGithub className="text-3xl" /></a> 
          <a href="https://www.linkedin.com/in/cheran-balakrishnan-a2b8ab2b1/"   target="_blank" title="Cheran GitHub" className=" border-1 border-black rounded-full p-2 hover:bg-[rgb(255,200,155)] transition-all duration-800 shadow-[5px_5px_5px_rgba(0,0,0,0.5)]"><FaLinkedin className="text-3xl" /></a> 
        </div>


         
      </nav>

       
        
    </>
  );
}


