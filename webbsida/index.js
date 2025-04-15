const cityAddInput = document.querySelector("#cityAddInput");
const countryAddInput = document.querySelector("#countryAddInput");
const citiesList = document.querySelector("#citiesList");
const cityAddButton = document.querySelector("#cityAddButton");

const citySearchInput = document.querySelector("#citySearchInput");
const countrySearchInput = document.querySelector("#countrySearchInput");
const citiesListSearched = document.querySelector("#citiesListSearched");
const citySearchButton = document.querySelector("#citySearchButton");

async function getCitiesArray() {
    const request = new Request("http://localhost:8000/cities");
    const response = await fetch(request);
    const resource = await response.json();
    return resource;
};

getCitiesArray().then((resource) => {
    for (let city of resource) {
        renderCity(city);
    };
});

function renderCity(cityData) {
    const cityDiv = document.createElement("div");
    cityDiv.classList.add("cityBox");
    cityDiv.textContent = `${cityData.name}, ${cityData.country}`;

    const deleteButton = document.createElement("div");
    deleteButton.classList.add("deleteButton");
    deleteButton.textContent = "delete";
    citiesList.append(cityDiv);
    cityDiv.append(deleteButton);

    deleteButton.addEventListener("click", () => {  
        async function deleteCity() {
            const deleteRequest = new Request("http://localhost:8000/cities", {
                method: "DELETE",
                body: JSON.stringify({ id: cityData.id }),
                headers: { "content-type": "application/json" }
            });
            const response = await fetch(deleteRequest);
            const resource = await response.json();
            return resource;
        };
        deleteCity().then((resource) => {
            if (resource.id === cityData.id) {
                cityDiv.remove(); 
            };
        });
    });
};

cityAddButton.addEventListener("click", () => {
    async function postCity() {
        const request = new Request("http://localhost:8000/cities", {
            method: "POST", 
            body: JSON.stringify({ name: cityAddInput.value.trim(), country: countryAddInput.value.trim() }),
            headers: { "content-type": "application/json" }
        });
        const response = await fetch(request);
        const resource = await response.json();
        return resource;
    };

    postCity().then((resource) => {
        if (resource.name !== undefined || resource.country !== undefined) {
            renderCity(resource);
        };
    });
    cityAddInput.value = "";
    countryAddInput.value = "";
});

citySearchButton.addEventListener("click", () => {
    citiesListSearched.textContent = "";
    const url = new URL("http://localhost:8000/cities/search")
    url.searchParams.set("text", citySearchInput.value.trim());
    url.searchParams.set("country", countrySearchInput.value.trim());
    async function searchCities() {
        const response = await fetch(url);
        const resource = await response.json();
        return resource;
    };

    searchCities().then(handleCities);

    function handleCities(resource) {
        if (!Array.isArray(resource) || resource.length == 0){
            citiesListSearched.textContent = "No cities found";
            return;
        };
        for (let city of resource) {
            const cityDiv = document.createElement("div");
            cityDiv.classList.add("cityBox");
            cityDiv.textContent = `${city.name}, ${city.country}`;
            citiesListSearched.append(cityDiv);
        };
    };
    citySearchInput.value = "";
    countrySearchInput.value = "";
});