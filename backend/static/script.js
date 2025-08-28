async function submit_LR() {
  const lat = document.getElementById("lat").value;
  const lon = document.getElementById("lon").value;
  const bedrooms = document.getElementById("bedrooms").value;
  const sqft = document.getElementById("sqft").value;
  const bathrooms = document.getElementById("bathrooms").value;
  const city = document.getElementById("city").value;
  
  

  const submit_LR = await fetch("/submit_LR", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ lat: lat ,
                           lon: lon , 
                           bedrooms: bedrooms,
                           sqft: sqft , 
                           bathrooms: bathrooms,
                           city:city
     })
  });


  const price = await submit_LR.json();
  document.getElementById("result").textContent = `predict price: $${price.prediction}`;
}