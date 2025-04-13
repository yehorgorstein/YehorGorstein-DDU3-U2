const cityAddInput = document.querySelector("#cityAddInput");
const countryAddInput = document.querySelector("#countryAddInput");

const cityAddButton = document.querySelector("#cityAddButton").addEventListener("click", async () => {
    const request = new Request("http://localhost:8000/cities", {
        method: "POST", 
        body: JSON.stringify({ name: cityAddInput.value, country: countryAddInput.value }),
        headers: { "content-type": "application/json" }
    });
    const response = await fetch(request);
    const resource = await response.json();
    console.log(resource);
})