export default function Predict() {
  
  return (
    
      <div className ="w-full flex flex-col space-y-20 items-center justify-center ">
            <form className="flex flex-col items-center justify-center gap-3">
                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Number Of Bedrooms:</h1>
                    <input type="text" placeholder="Enter text here" className="border border-[rgba(0, 0, 0, 1)]"/>
                </div>
                
                <button type="submit" className="font-raleway border border-[rgb(255,166,83)] shadow-2xl shadow-black/60 text-4xl  
                rounded-full px-2 py-1 hover:bg-[rgb(255,195,139)] duration-700 transform-gpu 
                transition-transform ease-out hover:-translate-y-2 ">Submit</button>
            </form>
        </div>
  )
}


