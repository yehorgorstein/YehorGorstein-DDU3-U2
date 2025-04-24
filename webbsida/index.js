const cityAddInput = document.querySelector("#cityAddInput");
const countryAddInput = document.querySelector("#countryAddInput");
const citiesList = document.querySelector("#citiesList");
const cityAddButton = document.querySelector("#cityAddButton");

const citySearchInput = document.querySelector("#citySearchInput");
const countrySearchInput = document.querySelector("#countrySearchInput");
const citiesListSearched = document.querySelector("#citiesListSearched");
const citySearchButton = document.querySelector("#citySearchButton");

const popUp = document.querySelector("#popUp");
let popUpTimeout;

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
    function firstUpperCase(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };
    popUp.classList.add("hidden");
    async function postCity() {
        const request = new Request("http://localhost:8000/cities", {
            method: "POST", 
            body: JSON.stringify({ name: firstUpperCase(cityAddInput.value.trim()), country: firstUpperCase(countryAddInput.value.trim()) }),
            headers: { "content-type": "application/json" }
        });
        const response = await fetch(request);
        const resource = await response.json();
        return resource;
    };
    postCity().then((resource) => {
        if (resource.name && resource.country) {
            renderCity(resource);
        } else {
            popUp.classList.remove("hidden");
            popUp.textContent = resource.error;
            clearTimeout(popUpTimeout);
            popUpTimeout = setTimeout(() => {
                popUp.classList.add("hidden"); 
            }, 4000);
        }
    });
    cityAddInput.value = "";
    countryAddInput.value = "";
});

citySearchButton.addEventListener("click", () => {
    citiesListSearched.textContent = "";
    const url = new URL("http://localhost:8000/cities/search");
    url.searchParams.set("text", citySearchInput.value);
    url.searchParams.set("country", countrySearchInput.value);
    async function searchCities() {
        const response = await fetch(url);
        const resourceBody = await response.json();
        return { status: response.status, body: resourceBody };
    };
    searchCities().then(handleCities);

    function handleCities(resource) {
        if (!Array.isArray(resource.body) || resource.body.length === 0){
            citiesListSearched.textContent = "No cities found";
            if (resource.status === 400) {
                popUp.classList.remove("hidden");
                popUp.textContent = resource.body.error;
                clearTimeout(popUpTimeout);
                popUpTimeout = setTimeout(() => {
                    popUp.classList.add("hidden"); 
                }, 4000);
            }
            return;
        };
        for (let city of resource.body) {
            const cityDiv = document.createElement("div");
            cityDiv.classList.add("cityBox");
            cityDiv.textContent = `${city.name}, ${city.country}`;
            citiesListSearched.append(cityDiv);
        };
    };
    
    citySearchInput.value = "";
    countrySearchInput.value = "";
});