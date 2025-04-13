const array = [];

async function handler(request) {
    const url = new URL(request.url);

    const headersCORS = new Headers();
    headersCORS.set("Access-Control-Allow-Origin", "*"); 
    headersCORS.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
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
                    const newData = { id: array.length + 1, name: requestData.name, country: requestData.country };
                    array.push(newData);
                    return new Response(JSON.stringify(newData), { headers: headersCORS, status: 200 });
                }
            }
        }
    }

    return new Response(null, { headers: headersCORS, status: 400 })
}

Deno.serve(handler);