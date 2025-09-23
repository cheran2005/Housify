//import react hooks
import { useState,useEffect,useRef} from "react";

//predict page component
export default function Predict() {
    //Import api url from vite environmental variables
    const API_URL = import.meta.env.VITE_API_URL as string;

    //initializing states that keep track of form input
    const [bedroom, setbedroom] = useState<number | null>(null);
    const [latitude, setlatitude] = useState<number | null>(null);
    const [longitude, setlongitude] = useState<number | null>(null);
    const [sqft, setsqft] = useState<number | null>(null);
    const [bathroom, setbathroom] = useState<number | null>(null);
    const [city, setcity] = useState("");
    const [prediction, setPrediction] = useState<number | null>(null);
    const [SelectedModel, setSelectedModel] = useState("");

    //initalize reference for html div element for each form input
    const Resultref = useRef<HTMLDivElement | null>(null);
    const bedroomRef = useRef<HTMLDivElement | null>(null);
    const latitudeRef = useRef<HTMLDivElement | null>(null);
    const longitudeRef = useRef<HTMLDivElement | null>(null);
    const sqftRef= useRef<HTMLDivElement | null>(null);
    const bathroomRef = useRef<HTMLDivElement | null>(null);
    const cityRef = useRef<HTMLDivElement | null>(null);
    const modelRef = useRef<HTMLDivElement | null>(null);
    

    //List of strings in a state to track which form has an error that can either be null or have a error message string
    const [Errors,setErrors] = useState<{
        bedroom ?: string,latitude ?: string,
        longitude ?:string,sqft ?: string,
        bathroom ?: string,city ?: string,
        SelectedModel ?: string,
    }>({});

    //A list of strings connected to specific form input div container
    const fieldRefs: Record<string, React.RefObject<HTMLElement | null>> = {
        bedroom: bedroomRef,
        latitude: latitudeRef,
        longitude: longitudeRef,
        sqft: sqftRef,
        bathroom: bathroomRef,
        city: cityRef,
        SelectedModel: modelRef,
    };

    //List of states to be sent to backend to receive prediction
    const payload = {
        bedrooms: bedroom,
        latitude:latitude,
        longitude:longitude,
        sqft:sqft,
        bathrooms:bathroom,
        city:city,
    };
    
    //Effect for every change in prediction price value, smoothly scroll to price div container
    useEffect(() => {
        if (prediction != null && Resultref.current){
            Resultref.current.scrollIntoView({behavior: "smooth"});
        }
    }, [prediction]);

    //Check for any errors
    const validate = () => {
        //An array to track errors
        const errorcheck : typeof Errors = {};

        //Check each state for any invalid inputs
        if (bedroom == null){errorcheck.bedroom = "Please enter at least 1 bedroom";}
        if (latitude != null && (latitude <-90 || latitude > 90)){errorcheck.latitude = "Latitude must be between -90 to 90";}
        if (longitude != null && (longitude <-180 || longitude > 180)){errorcheck.longitude ="longitude must be between -180 to 180";}
        if (sqft == null){errorcheck.sqft = "Please enter a valid sqaure footage greater than 0";}
        if (bathroom == null){errorcheck.bathroom = "Please Enter at least 1 bathroom";}
        if (city === ""){errorcheck.city = "Please select a city";}
        if (SelectedModel === ""){errorcheck.SelectedModel = "Please select a Model";}

        //update error state
        setErrors(errorcheck);
        
        //return a boolean value if there are not any errors stored in errorcheck state
        return errorcheck;
    }

    //Aysnc submit function
    const onSubmit = async (e: React.FormEvent) => {

        //Stop default reload when submit button clicked
        e.preventDefault(); 
        const errorcheck = validate();
        setErrors(errorcheck);
        //Check if input is valid
        if (Object.keys(errorcheck).length){
            //Find the first input error and smoothly scroll to the specific input div container
            const firstErrorKey = Object.keys(errorcheck)[0] as keyof typeof fieldRefs;
            const ref = fieldRefs[firstErrorKey];
            ref?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            ref?.current?.focus();
            return;
        }

        //Track chosen model 
        const chosen_model= SelectedModel;

        //Check which model was chosen and send a backend POST request to specific backend url connected to specific model
        try {
            
            if (chosen_model === "Linear Regression"){
                console.log("LINEAR REGRESSION");
                const res = await fetch(`${API_URL}/submit_LR`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify( payload ), 
                });
                
                const data = await res.json();
                setPrediction(data.prediction);
            }

            else if (chosen_model === "Random Forest Regression"){
                const res = await fetch(`${API_URL}/submit_RF`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify( payload ), 
                });
                
                const data = await res.json();
                setPrediction(data.prediction);
            }
        } 

        //Catch any errors when making POST request  
        catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        
        <div className =" pb-16 w-full flex flex-col items-center justify-center ">
            <form onSubmit={onSubmit} className="flex flex-col items-center justify-center gap-5">
                {/* Form title */}
                <h1 className="text-5xl font-raleway font-[550] pb-6">Housing Details</h1>



                {/* Form inputs*/}
                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Number Of Bedrooms:</h1>
                    <div className="flex flex-col items-center ">
                        <input type="number" step="1" min="0" value={bedroom ?? ""} onChange={(e) => setbedroom(e.target.value === "" ? null: Number(e.target.value))} placeholder="Enter Value" className="border border-[rgba(0, 0, 0, 1)] focus:outline-none px-2"/>
                        {Errors.bedroom !== null && <p ref={bedroomRef} className="flex text-red-500 font-[550] text-xs  items-center justify-center px-3 py-1"> {Errors.bedroom}</p>}
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Number Of Bathrooms:</h1>
                    <div className="flex flex-col items-center ">
                        <input type="number" step="1" min="0" value={bathroom ?? ""} onChange={(e) => setbathroom(e.target.value === "" ? null: Number(e.target.value))} placeholder="Enter Value" className="border border-[rgba(0, 0, 0, 1)] focus:outline-none px-2"/>
                        {Errors.bathroom !== null && <p className="flex text-red-500 font-[550] text-xs  items-center justify-center px-3 py-1"> {Errors.bathroom}</p>}
                    </div>
                </div>


                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Enter Sqft:</h1>
                    <div className="flex flex-col items-center ">
                        <input type="number" step="1" min="0" value={sqft ?? ""} onChange={(e) => setsqft(e.target.value === "" ? null: Number(e.target.value))} placeholder="Enter Value" className="border border-[rgba(0, 0, 0, 1)] focus:outline-none px-2"/>
                        {Errors.sqft !== null && <p className="flex text-red-500 font-[550] text-xs  items-center justify-center px-3 py-1"> {Errors.sqft}</p>}
                    </div>
                </div>

                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Enter Latitude (optional):</h1>
                    <div className="flex flex-col items-center ">
                        <input type="number"  value={latitude ?? ""} onChange={(e) => setlatitude(e.target.value === ""? null: Number(e.target.value))} placeholder="Enter Value" className="border border-[rgba(0, 0, 0, 1)] focus:outline-none px-2"/>
                        {Errors.latitude !== null && <p className="flex text-red-500 font-[550] text-xs  items-center justify-center px-3 py-1"> {Errors.latitude}</p>}
                    </div>
                </div>

                
                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Enter Longitude (optional):</h1>
                    <div className="flex flex-col items-center ">
                        <input type="number" value={longitude ?? ""} onChange={(e) => setlongitude(e.target.value === "" ? null: Number(e.target.value))} placeholder="Enter Value" className="border border-[rgba(0, 0, 0, 1)] focus:outline-none px-2"/>
                        {Errors.longitude !== null && <p className="flex text-red-500 font-[550] text-xs  items-center justify-center px-3 py-1"> {Errors.longitude}</p>}
                    </div>
                </div>

                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Choose City:</h1>
                    <div className="flex flex-col items-center ">
                        <select
                            value={city}
                            onChange={(e) => setcity(e.target.value)}
                            className="px-4 py-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                            <option value="" disabled>
                            -- Select city --
                            </option>
                            <option value="ajax">Ajax</option>
                            <option value="aurora">Aurora</option>
                            <option value="brampton">Brampton</option>
                            <option value="burlington">Burlington</option>
                            <option value="markham">Markham</option>
                            <option value="mississauga">Mississauga</option>
                            <option value="newmarket">Newmarket</option>
                            <option value="oakville">Oakville</option>
                            <option value="oshawa">Oshawa</option>
                            <option value="pickering">Pickering</option>
                            <option value="richmond hill">Richmond Hill</option>
                            <option value="toronto">Toronto</option>
                            <option value="vaughan">Vaughan</option>
                            <option value="whitby">Whitby</option>
                            <option value="rosemount">Rosemount</option>
                        </select>
                        {Errors.city !== null && <p className="flex text-red-500 font-[550] text-xs  items-center justify-center px-3 py-1"> {Errors.city}</p>}
                    </div>
                </div>

                

                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Choose Prediction Model:</h1>
                    <div className="flex flex-col items-center ">
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
                        {Errors.SelectedModel !== null && <p className="flex text-red-500 font-[550] text-xs  items-center justify-center px-3 py-1"> {Errors.SelectedModel}</p>}
                    </div>
                </div>

                
                {/* Submit button*/}
                <button type="submit" name="predictLR" className="font-raleway  shadow-2xl shadow-black/60 text-4xl  
                rounded-full px-2 py-1 bg-[rgba(255, 217, 182, 1)] hover:bg-[rgb(255,195,139)] duration-700 transform-gpu 
                transition-transform ease-out hover:-translate-y-2 w-auto mx-auto inline-flex">Predict!</button>

            </form>

            {/*Price prediction*/}
            {prediction !== null && <p ref={Resultref} className="flex font-raleway font-[550] text-2xl border border-[rgba(0, 0, 0, 1)] shadow-2xl shadow-black/60 items-center justify-center my-10 px-3 py-3">Predicted Price: ${prediction.toFixed(0)}</p>}
        </div>
  );
}


