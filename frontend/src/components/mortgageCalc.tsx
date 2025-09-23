//import react hooks
import { useState,useRef ,useEffect} from "react";

//Mortgage calculator component
export default function MortgageCalc() {
    const [principal,setprincipal] = useState<number | null>(null);
    const [Annual_Intrest_Rate,setAnnual_Intrest_Rate] = useState<number | null>(null);
    const [Loan_term,setLoan_term] = useState<number | null>(null);
    const [Payment_freq,setPayment_freq] = useState<number | null>(null);

   

    const [Payment,setPayment] = useState<number | null>(null);
    const [TotalPayment,setTotalPayment] = useState<number | null>(null);
    const [TotalInterest,setTotalInterestPayment] = useState<number | null>(null);

    const principalRef = useRef<HTMLDivElement | null>(null);
    const Annual_Intrest_RateRef = useRef<HTMLDivElement | null>(null);
    const Loan_termRef = useRef<HTMLDivElement | null>(null);
    const Payment_freqRef = useRef<HTMLDivElement | null>(null);
    const PaymentRef = useRef<HTMLDivElement | null>(null);

    const [Errors,setErrors] = useState<{
        principal ?: string,Annual_Intrest_Rate ?: string,
        Loan_term ?:string,Payment_freq ?: string
    }>({});

    const fieldRefs: Record<string, React.RefObject<HTMLElement | null>> = {
        principal: principalRef,
        Annual_Intrest_Rate: Annual_Intrest_RateRef,
        Loan_term: Loan_termRef,
        Payment_freq: Payment_freqRef
    };

    const validate = () => {

        const errorcheck:typeof Errors = {};

        if (principal == null  ){errorcheck.principal ="Please fill";}
        else if (principal<0){errorcheck.principal ="Enter a value above 0";}
        if (Annual_Intrest_Rate == null ){errorcheck.Annual_Intrest_Rate ="Please fill";}
        else if (Annual_Intrest_Rate<0){errorcheck.Annual_Intrest_Rate ="Enter a value greater or equal to 0";}
        if (Loan_term == null ){errorcheck.Loan_term ="Please fill";}
        else if (Loan_term<=0){errorcheck.Loan_term ="Enter a value greater than 0";}
        if (Payment_freq == null ){errorcheck.Payment_freq="Please Choose a Payment frequency";}
        
        setErrors(errorcheck);

        return errorcheck;    
    }

    //Calculate period payment, total payment, and Tota interest
    const calc_payment = (e: React.FormEvent) =>{

        //Stop default reload when submit button clicked
        e.preventDefault(); 

        //Check for any errors
        const errorcheck = validate();
        setErrors(errorcheck);

        //Smoothly scroll to first error div container
        if (Object.keys(errorcheck).length){
            const firstErrorKey = Object.keys(Errors)[0] as keyof typeof fieldRefs;
            const ref = fieldRefs[firstErrorKey];
            ref?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            ref?.current?.focus();
            return;
        }
        

        if (principal == null || Annual_Intrest_Rate == null || Loan_term == null || Payment_freq == null){return;}

        //Calculations
        const r = (Annual_Intrest_Rate/100)/Payment_freq;
        const n = Loan_term * Payment_freq;

        if (r >0){
            const payment = principal *((r*(1+r)**n)/((1+r)**n-1));
            setPayment(payment);
            setTotalPayment(payment * n);
            setTotalInterestPayment(payment * n - principal);
        }

        else if (r == 0 ){
            const payment = principal/n;
            setPayment(payment);
            setTotalPayment(payment * n);
            setTotalInterestPayment(payment * n - principal);
        }

        return;
    }

    //Scroll effect when mortgage info gets mounted or updated
    useEffect(() =>{
        if (Payment != null && PaymentRef.current){
            PaymentRef.current.scrollIntoView({behavior: "smooth"});
        }
    },[Payment]);

    return(
        <>
            <div className =" pb-16 w-full flex flex-col items-center justify-center ">
                <form onSubmit={calc_payment} className="flex flex-col items-center justify-center gap-5">

                {/* Form title */}
                <h1 className="text-5xl font-raleway font-[550] pb-6">Mortgage Calculator</h1>



                {/* Form inputs*/}
                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Principal Amount:</h1>
                    <div className="flex flex-col items-center ">
                        <input type="number" step="1" min="0" value={principal ?? ""} onChange={(e) => setprincipal(e.target.value === "" ? null: Number(e.target.value))} placeholder="Enter Value" className="border border-[rgba(0, 0, 0, 1)] focus:outline-none px-2"/>
                        {Errors.principal !== null && <p ref={principalRef} className="flex text-red-500 font-[550] text-xs  items-center justify-center px-3 py-1"> {Errors.principal}</p>}
                    </div>
                </div>

                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Annual Interest Rate:</h1>
                    <div className="flex flex-col items-center ">
                        <input type="number" step="1" min="0" value={Annual_Intrest_Rate ?? ""} onChange={(e) => setAnnual_Intrest_Rate(e.target.value === "" ? null: Number(e.target.value))} placeholder="Enter Value" className="border border-[rgba(0, 0, 0, 1)] focus:outline-none px-2"/>
                        {Errors.Annual_Intrest_Rate !== null && <p ref={Annual_Intrest_RateRef} className="flex text-red-500 font-[550] text-xs  items-center justify-center px-3 py-1"> {Errors.Annual_Intrest_Rate}</p>}
                    </div>
                </div>

                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Loan Term:</h1>
                    <div className="flex flex-col items-center ">
                        <input type="number" step="1" min="0" value={Loan_term ?? ""} onChange={(e) => setLoan_term(e.target.value === "" ? null: Number(e.target.value))} placeholder="Enter Value" className="border border-[rgba(0, 0, 0, 1)] focus:outline-none px-2"/>
                        {Errors.Loan_term !== null && <p ref={Loan_termRef} className="flex text-red-500 font-[550] text-xs  items-center justify-center px-3 py-1"> {Errors.Loan_term}</p>}
                    </div>
                </div>
                

                <div className="flex gap-3">
                    <h1 className="text-2xl font-raleway font-[550]">Choose Payment Frequency:</h1>
                    <div className="flex flex-col items-center ">
                        <select
                            value={Payment_freq ?? ""}
                            onChange={(e) => setPayment_freq(e.target.value === "" ? null:Number(e.target.value))}
                            className="px-4 py-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                            <option value="" disabled>
                            -- Select Frequency --
                            </option>
                            <option value="12">Monthly</option>
                            <option value="26">Bi-weekly</option>
                            <option value="52">weekly</option>
                            
                        </select>
                        {Errors.Payment_freq !== null && <p className="flex text-red-500 font-[550] text-xs  items-center justify-center px-3 py-1"> {Errors.Payment_freq}</p>}
                    </div>
                </div>


                {/* Submit button*/}
                <button type="submit" name="calcMortgage" className="font-raleway  shadow-2xl shadow-black/60 text-4xl  
                rounded-full px-2 py-1 bg-[rgba(255, 217, 182, 1)] hover:bg-[rgb(255,195,139)] duration-700 transform-gpu 
                transition-transform ease-out hover:-translate-y-2 w-auto mx-auto inline-flex">Find Out Your Mortgage!</button>

                </form>

                {/*Mortgage detail display*/}
                {Payment !== null && <p ref={PaymentRef} className="flex font-raleway font-[550] text-2xl border border-[rgba(0, 0, 0, 1)] shadow-2xl shadow-black/60 items-center justify-center my-10 px-3 py-3">
                Periodic Payment: ${Payment.toFixed(2)}<br />
                Total Paid: ${TotalPayment?.toFixed(2)} <br />
                Total Interest: ${TotalInterest?.toFixed(2)} </p>}
                
         
            </div>
        </>
    );


}