const array = [];
let nextId = 1;

async function handler(request) {
    const url = new URL(request.url);

    const headersCORS = new Headers();
    headersCORS.set("Access-Control-Allow-Origin", "*"); 
    headersCORS.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    headersCORS.set("Access-Control-Allow-Headers", "Content-Type");
    if (request.method === "OPTIONS") {
        return new Response(null, { headers: headersCORS });
    }

    if (url.pathname == "/cities") {
        if (request.method == "GET") {
            return new Response(JSON.stringify(array), { headers: headersCORS, status: 200 });
        }
        if (request.method == "POST") {
            const contentType = request.headers.get("content-type");
            if (contentType == "application/json") {
                const requestData = await request.json();
                if (requestData.name == "" || requestData.country == "") {
                    return new Response(JSON.stringify(
                        { error: "Both inputs need to be filled in" }), 
                        { headers: headersCORS, status: 400 }
                    );
                }
                if (array.find(city => city.name == requestData.name)) {
                    return new Response(JSON.stringify(
                        { error: "The city already exists" }), 
                        { headers: headersCORS, status: 409 }
                    );
                } else {
                    const newData = { id: nextId++, name: requestData.name, country: requestData.country };
                    array.push(newData);
                    return new Response(JSON.stringify(newData), { headers: headersCORS, status: 200 });
                }
            }
        }
        if (request.method == "DELETE") {
            const contentType = request.headers.get("content-type");
            if (contentType == "application/json") {
                const requestData = await request.json();
                if (requestData.id == undefined) {
                    return new Response(JSON.stringify("There needs to be an id"), 
                        { headers: headersCORS, status: 400 }
                    )
                }
                const index = array.findIndex(city => city.id == requestData.id);
                if (index !== -1) {
                    array.splice(index, 1);
                    return new Response(JSON.stringify({ id: requestData.id, message:"Delete OK" }), 
                        { headers: headersCORS, status: 200 }
                    )
                } else {
                    return new Response(JSON.stringify("There is no city with this id"), 
                        { headers: headersCORS, status: 404 }
                    )
                }
            }
        }
    }

    return new Response(null, { headers: headersCORS, status: 400 })
}

Deno.serve(handler);