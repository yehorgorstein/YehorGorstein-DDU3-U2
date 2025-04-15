const cityAddInput = document.querySelector("#cityAddInput");
const countryAddInput = document.querySelector("#countryAddInput");
const citiesList = document.querySelector("#citiesList");
const cityAddButton = document.querySelector("#cityAddButton");

async function getCitiesArray() {
    const request = new Request("http://localhost:8000/cities");
    const response = await fetch(request);
    const resource = await response.json();
    console.log(resource);
};
//getCitiesArray();

cityAddButton.addEventListener("click", () => {
    async function postCity() {
        const request = new Request("http://localhost:8000/cities", {
            method: "POST", 
            body: JSON.stringify({ name: cityAddInput.value, country: countryAddInput.value }),
            headers: { "content-type": "application/json" }
        });
        const response = await fetch(request);
        const resource = await response.json();
        console.log(resource);
        return resource;
    };

    postCity().then(handleCity);

    function handleCity(resource) {
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
                };
                deleteCity().then((result) => {
                    if (result.id === resource.id) {
                        city.remove(); 
                    };
                });
            });
        };
    };
});

const citySearchInput = document.querySelector("#citySearchInput");
const countrySearchInput = document.querySelector("#countrySearchInput");
const citiesListSearched = document.querySelector("#citiesListSearched");
const citySearchButton = document.querySelector("#citySearchButton");

citySearchButton.addEventListener("click", () => {
    const url = new URL("http://localhost:8000/cities/search")
    url.searchParams.set("text", citySearchInput.value);
    url.searchParams.set("country", countrySearchInput.value);
    async function searchCities() {
        const response = await fetch(url);
        const resource = await response.json();
        console.log(resource);
        return resource;
    };

    searchCities().then(handleCities);

    function handleCities(resource) {
        for (let city of resource) {
            console.log(city);
            cityDiv = document.createElement("div");
            cityDiv.classList.add("cityBox");
            cityDiv.textContent = `${city.name}, ${city.country}`;
            citiesListSearched.append(cityDiv);
        };
    };
});