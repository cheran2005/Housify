import { useState,useEffect,useRef } from "react";

export default function Predict() {
    const API_URL = import.meta.env.VITE_API_URL as string;
    const [bedroom, setbedroom] = useState<number | null>(null);
    const [latitude, setlatitude] = useState<number | null>(null);
    const [longitude, setlongitude] = useState<number | null>(null);
    const [sqft, setsqft] = useState<number | null>(null);
    const [bathroom, setbathroom] = useState<number | null>(null);
    const [city, setcity] = useState("");
    const [prediction, setPrediction] = useState<number | null>(null);

    const [SelectedModel, setSelectedModel] = useState("");

    const Resultref = useRef<HTMLDivElement | null>(null);

    const payload = {
        bedrooms: bedroom,
        latitude:latitude,
        longitude:longitude,
        sqft:sqft,
        bathrooms:bathroom,
        city:city,
    };
    

     useEffect(() => {
        if (prediction != null && Resultref.current){
            Resultref.current.scrollIntoView({behavior: "smooth"});
        }
    }, [prediction]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        const button = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
        const which = SelectedModel;

        try {
            
            if (which === "Linear Regression"){
                console.log("LINEAR REGRESSION");
                const res = await fetch(`${API_URL}/submit_LR`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify( payload ), 
                });
                

                const data = await res.json();
                setPrediction(data.prediction);
            }

            else if (which === "Random Forest Regression"){
                
                const res = await fetch(`${API_URL}/submit_RF`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify( payload ), 
                });
                

                const data = await res.json();
                setPrediction(data.prediction);
            }
        } catch (err) {
        console.error("Error:", err);
        }
    };

  return (
    
        <div className =" pb-16 w-full flex flex-col items-center justify-center ">
            <form onSubmit={onSubmit} className="flex flex-col items-center justify-center gap-10">

                <h1 className="text-5xl font-raleway font-[550]">Housing Details</h1>
                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Number Of Bedrooms:</h1>
                    <input type="number" step="1" min="0" value={bedroom ?? ""} onChange={(e) => setbedroom(e.target.value === "" ? null: Number(e.target.value))} placeholder="Enter Value" className="border border-[rgba(0, 0, 0, 1)] focus:outline-none px-2"/>
                </div>
                
                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Number Of Bathrooms:</h1>
                    <input type="number" step="1" min="0" value={bathroom ?? ""} onChange={(e) => setbathroom(e.target.value === "" ? null: Number(e.target.value))} placeholder="Enter Value" className="border border-[rgba(0, 0, 0, 1)] focus:outline-none px-2"/>
                </div>

                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Enter Latitude:</h1>
                    <input type="number"  value={latitude ?? ""} onChange={(e) => setlatitude(e.target.value === ""? null: Number(e.target.value))} placeholder="Enter Value" className="border border-[rgba(0, 0, 0, 1)] focus:outline-none px-2"/>
                </div>

                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Enter Longitude:</h1>
                    <input type="number" value={longitude ?? ""} onChange={(e) => setlongitude(e.target.value === "" ? null: Number(e.target.value))} placeholder="Enter Value" className="border border-[rgba(0, 0, 0, 1)] focus:outline-none px-2"/>
                </div>


                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Enter Sqft:</h1>
                    <input type="number" step="1" min="0" value={sqft ?? ""} onChange={(e) => setsqft(e.target.value === "" ? null: Number(e.target.value))} placeholder="Enter Value" className="border border-[rgba(0, 0, 0, 1)] focus:outline-none px-2"/>
                </div>


                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Enter city:</h1>
                    <input type="text" value={city ?? ""} onChange={(e) => setcity(e.target.value)} placeholder="Enter City Name" className="border border-[rgba(0, 0, 0, 1)] focus:outline-none px-2"/>
                </div>

                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Choose Prediction Model:</h1>
                    <select
                        value={SelectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="px-4 py-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                        <option value="" disabled>
                        -- Select one --
                        </option>
                        <option value="Linear Regression">Linear Regression</option>
                        <option value="Random Forest Regression">Random Forest Regression</option>
                    </select>
                </div>
                
                <button type="submit" name="predictLR" className="font-raleway  shadow-2xl shadow-black/60 text-4xl  
                rounded-full px-2 py-1 bg-[rgba(255, 217, 182, 1)] hover:bg-[rgb(255,195,139)] duration-700 transform-gpu 
                transition-transform ease-out hover:-translate-y-2 w-auto mx-auto inline-flex">Predict!</button>

            </form>

            {prediction !== null && <p ref={Resultref} className="flex font-raleway font-[550] text-2xl border border-[rgba(0, 0, 0, 1)] shadow-2xl shadow-black/60 items-center justify-center my-10 px-3 py-3">Predicted Price: ${prediction.toFixed(2)}</p>}
        </div>
  );
}


