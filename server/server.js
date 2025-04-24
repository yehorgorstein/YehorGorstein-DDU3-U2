const array = [{id: 1, name: "Lille", country: "France"}, {id: 2, name: "Nantes", country: "France"}, {id: 3, name: "Bremen", country: "Germany"}, {id: 4, name: "Dresden", country: "Germany"}, {id: 5, name: "Heidelberg", country: "Germany"}, {id: 6, name: "Venice", country: "Italy"}];

async function handler(request) {
    const url = new URL(request.url);

    const headersCORS = new Headers();
    headersCORS.set("Access-Control-Allow-Origin", "*"); 
    headersCORS.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    headersCORS.set("Access-Control-Allow-Headers", "Content-Type");
    if (request.method === "OPTIONS") {
        return new Response(null, { headers: headersCORS });
    };

    if (url.pathname === "/cities") {
        if (request.method === "POST") {
            const contentType = request.headers.get("content-type");
            if (contentType === "application/json") {
                try {
                    const requestData = await request.json();
                    if (!requestData.name || !requestData.country) {
                        return new Response(JSON.stringify(
                            { error: "Both inputs need to exist and be filled in" }), 
                            { headers: headersCORS, status: 400 }
                        );
                    };
                    if (array.find(city => city.name.toLowerCase() === requestData.name.toLowerCase())) {
                        return new Response(JSON.stringify(
                            { error: "The city already exists" }), 
                            { headers: headersCORS, status: 409 }
                        );
                    } else {
                        let highestId = 0;
                        if (array.length > 0) {
                            for (let i = 0; i < array.length; i++) {
                                if (array[i].id > highestId) {
                                    highestId = array[i].id;
                                };
                            };
                        };
                        const newId = highestId + 1;
                        const newData = { id: newId, name: requestData.name, country: requestData.country };
                        array.push(newData);
                        return new Response(JSON.stringify(newData), { headers: headersCORS, status: 200 });
                    };
                } catch {
                    return new Response(JSON.stringify({ error: "Both inputs need to be filled in"}), {
                        headers: headersCORS,
                        status: 400,
                    });
                };
            };
        };

        if (request.method === "DELETE") {
            const contentType = request.headers.get("content-type");
            if (contentType === "application/json") {
                try {
                    const requestData = await request.json();
                    if (!requestData || !requestData.id) {
                        return new Response(JSON.stringify({ error: "An id needs to be written here" }), 
                            { headers: headersCORS, status: 400 }
                        );
                    };
                    const index = array.findIndex(city => city.id === requestData.id);
                    if (index !== -1) {
                        array.splice(index, 1);
                        return new Response(JSON.stringify({ id: requestData.id, message:"Delete OK" }), 
                            { headers: headersCORS, status: 200 }
                        );
                    } else {
                        return new Response(JSON.stringify({ error: "There is no city with this id" }), 
                            { headers: headersCORS, status: 404 }
                        );
                    };
                } catch {
                    return new Response(JSON.stringify({ error: "There needs to be an id" }), {
                        headers: headersCORS,
                        status: 400,
                    });
                };
            };
        };

        return new Response(JSON.stringify(array), { headers: headersCORS, status: 200 });
    };

    if (url.pathname === "/cities/search") {
        const text = url.searchParams.get("text");
        const country = url.searchParams.get("country");

        if (!text) {
            return new Response(JSON.stringify({ error: "Text needs to be filled in" }), 
                { headers: headersCORS, status: 400 }
            );
        };

        const filteredCities = array.filter(city => {
            const nameMatch = city.name.toLowerCase().includes(text.toLowerCase());
            const countryMatch = country ? city.country.toLowerCase().includes(country.toLowerCase()) : true;
            return nameMatch && countryMatch;
        });

        return new Response(JSON.stringify(filteredCities), { headers: headersCORS, status: 200 });
    };

    const route = new URLPattern({ pathname: "/cities/:id" });
    const matchId = route.exec(request.url);
    if (matchId) {
        const id = matchId.pathname.groups.id;
        const correctCity = array.find(city => city.id == id);
        if (correctCity) {
            return new Response(JSON.stringify(correctCity), { headers: headersCORS, status: 200 });
        };
        return new Response(JSON.stringify({ error: "There is no city with this id"}), 
            { headers: headersCORS, status: 404 }
        );
    };

    return new Response(null, { headers: headersCORS, status: 400 });
};

Deno.serve(handler);