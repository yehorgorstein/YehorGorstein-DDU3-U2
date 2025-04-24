async function textRequests() {
    await fetch("http://localhost:8000/cities")
        .then(response => response.json().then(resourceBody => { return { status: response.status, body: resourceBody }; }))
        .then(resource => console.log(resource)
    );

    await fetch("http://localhost:8000/cities", {
        method: "POST", 
        body: JSON.stringify({ name: "Malmö", country: "Sweden" }),
        headers: { "content-type": "application/json" }
    })
        .then(response => response.json().then(resourceBody => { return { status: response.status, body: resourceBody }; }))
        .then(resource => console.log(resource)
    );

    await fetch("http://localhost:8000/cities", {
        method: "DELETE", 
        body: JSON.stringify({ id: 1 }),
        headers: { "content-type": "application/json" }
    })
        .then(response => response.json().then(resourceBody => { return { status: response.status, body: resourceBody }; }))
        .then(resource => console.log(resource)
    );

    await fetch("http://localhost:8000/cities")
        .then(response => response.json().then(resourceBody => { return { status: response.status, body: resourceBody }; }))
        .then(resource => console.log(resource)
    );

    await fetch("http://localhost:8000/cities/7")
        .then(response => response.json().then(resourceBody => { return { status: response.status, body: resourceBody }; }))
        .then(resource => console.log(resource)
    );

    const url1 = new URL("http://localhost:8000/cities/search");
    url1.searchParams.set("text", "en");
    await fetch(url1)
        .then(response => response.json().then(resourceBody => { return { status: response.status, body: resourceBody }; }))
        .then(resource => console.log(resource)
    );

    const url2 = new URL("http://localhost:8000/cities/search");
    url2.searchParams.set("text", "en");
    url2.searchParams.set("country", "Sweden");
    await fetch(url2)
        .then(response => response.json().then(resourceBody => { return { status: response.status, body: resourceBody }; }))
        .then(resource => console.log(resource)
    );
};

textRequests();