async function tryPostCity() {
    const response = await fetch("http://localhost:8000/cities", {
        method: "POST",
        body: JSON.stringify({ name: "Dresden", country: "Germany" }),
        headers: { "content-type": "application/json" }
    });
    const resourceBody = await response.json();
    const resource = { status: response.status, body: resourceBody };
    console.log(resource);
};

async function tryPostOnlyCity() {
    const response = await fetch("http://localhost:8000/cities", {
        method: "POST",
        body: JSON.stringify({ name: "Ystad" }),
        headers: { "content-type": "application/json" }
    });
    const resourceBody = await response.json();
    const resource = { status: response.status, body: resourceBody };
    console.log(resource);
};

async function tryDeleteNonexistentCity() {
    const response = await fetch("http://localhost:8000/cities", {
        method: "DELETE",
        body: JSON.stringify({ id: 56 }),
        headers: { "content-type": "application/json" }
    });
    const resourceBody = await response.json();
    const resource = { status: response.status, body: resourceBody };
    console.log(resource);
};

async function tryDeleteCityWithoutId() {
    const response = await fetch("http://localhost:8000/cities", {
        method: "DELETE",
        body: JSON.stringify({}),
        headers: { "content-type": "application/json" }
    });
    const resourceBody = await response.json();
    const resource = { status: response.status, body: resourceBody };
    console.log(resource);
};

async function tryPostToMessages() {
    const response = await fetch("http://localhost:8000/messages", {
        method: "POST",
        body: JSON.stringify({ from: 2, to: 1, password: "pass" }),
        headers: { "content-type": "application/json" }
    });
    const resourceBody = await response.json();
    const resource = { status: response.status, body: resourceBody };
    console.log(resource);
};

async function tryGetFromSearch() {
    const response = await fetch("http://localhost:8000/cities/search");
    const resourceBody = await response.json();
    const resource = { status: response.status, body: resourceBody };
    console.log(resource);
};

async function tryDeleteToMordor() {
    const response = await fetch("http://localhost:8000/mordor", {
        method: "DELETE",
        headers: { "content-type": "application/json" }
    });
    const resourceBody = await response.json();
    const resource = { status: response.status, body: resourceBody };
    console.log(resource);
};

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

    await tryPostCity();
    await tryPostOnlyCity();
    await tryDeleteNonexistentCity();
    await tryDeleteCityWithoutId();
    await tryPostToMessages();
    await tryGetFromSearch();
    await tryDeleteToMordor();
};

textRequests();