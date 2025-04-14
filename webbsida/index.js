const cityAddInput = document.querySelector("#cityAddInput");
const countryAddInput = document.querySelector("#countryAddInput");
const citiesList = document.querySelector("#citiesList");
const cityAddButton = document.querySelector("#cityAddButton");

cityAddButton.addEventListener("click", () => {
    async function getResponse() {
        const request = new Request("http://localhost:8000/cities", {
            method: "POST", 
            body: JSON.stringify({ name: cityAddInput.value, country: countryAddInput.value }),
            headers: { "content-type": "application/json" }
        });
        const response = await fetch(request);
        const resource = await response.json();
        console.log(resource);
        return resource;
    }

    getResponse().then(handleResource);

    function handleResource(resource) {
        if (resource.name !== undefined || resource.country !== undefined) {
            const city = document.createElement("div");
            city.classList.add("cityBox");
            city.textContent = `${resource.name}, ${resource.country}`;

            const deleteButton = document.createElement("div");
            deleteButton.classList.add("deleteButton");
            deleteButton.textContent = "delete";
            citiesList.append(city);
            city.append(deleteButton);

            deleteButton.addEventListener("click", () => {  
                async function deleteCity() {
                    const deleteRequest = new Request("http://localhost:8000/cities", {
                        method: "DELETE",
                        body: JSON.stringify({ id: resource.id }),
                        headers: { "content-type": "application/json" }
                    });
                    const response = await fetch(deleteRequest);
                    const result = await response.json();
                    return result;
                }
            
                deleteCity().then((result) => {
                    if (result.id === resource.id) {
                        city.remove(); 
                    }
                });
            });
        }
    }
});