const photoRoot = new URL("../", document.currentScript.src);
const categoryNames = {
    trips: "Trips",
    celebrations: "Celebrations",
    gatherings: "Gatherings"
};

function photoUrl(path) {
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    return new URL("photos/" + encodedPath, photoRoot);
}

function formatDate(date) {
    if (date === "") {
        return "";
    }
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeZone: "UTC"
    }).format(new Date(date + "T00:00:00Z"));
}

function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
}

function createPhotoCard(photo, view) {
    const card = element("figure", "", "photo-card");
    const button = element("button", "", "photo-open");
    button.type = "button";
    button.setAttribute("aria-label", "View photo: " + photo.title);

    const image = element("img");
    image.src = photoUrl(photo.path);
    image.alt = photo.alt;
    image.loading = "lazy";
    button.append(image);
    button.addEventListener("click", () => openPhoto(photo));
    card.append(button);

    const description = element("figcaption");
    description.append(element("h3", photo.title));
    if (photo.caption) description.append(element("p", photo.caption));
    if (photo.date) {
        const date = element("time", formatDate(photo.date));
        date.dateTime = photo.date;
        description.append(date);
    }
    if (view === "favorites" || view === "home") {
        const link = element("a", "More from " + categoryNames[photo.category]);
        link.href = new URL("galleries/" + photo.category + ".html", photoRoot);
        description.append(link);
    }
    card.append(description);
    return card;
}

function openPhoto(photo) {
    const dialog = document.querySelector("#photo-viewer");
    const image = dialog.querySelector("img");
    image.src = photoUrl(photo.path);
    image.alt = photo.alt || photo.title;
    dialog.querySelector("h2").textContent = photo.title;
    dialog.querySelector("p").textContent = photo.caption;
    dialog.showModal();
}

function renderGallery(container, catalog) {
    const view = container.dataset.gallery;
    let photos;
    if (view === "home") {
        photos = catalog.slice(0, 3);
    } else if (view === "favorites") {
        photos = catalog.filter(photo => photo.favorite);
    } else {
        photos = catalog.filter(photo => photo.category === view);
    }

    if (!photos.length) {
        container.replaceChildren(element("p", container.dataset.empty, "empty"));
        return;
    }

    if (view === "home" || view === "favorites") {
        container.replaceChildren(makeGrid(photos, view));
        return;
    }

    const events = new Map();
    for (const photo of photos) {
        if (!events.has(photo.eventKey)) events.set(photo.eventKey, []);
        events.get(photo.eventKey).push(photo);
    }
    container.replaceChildren();
    for (const eventPhotos of events.values()) {
        const section = element("section", "", "event");
        section.append(element("h2", eventPhotos[0].event), makeGrid(eventPhotos, view));
        container.append(section);
    }
}

function makeGrid(photos, view) {
    const grid = element("div", "", "photo-grid");
    for (const photo of photos) grid.append(createPhotoCard(photo, view));
    return grid;
}

function updateHero(catalog) {
    const hero = document.querySelector("#hero-photo");
    if (!hero || !catalog.length) return;

    const cover = catalog[0];
    const image = element("img");
    image.src = photoUrl(cover.path);
    image.alt = cover.alt || cover.title;
    hero.prepend(image);
}

function updateTable(catalog) {
    for (const category of Object.keys(categoryNames)) {
        const photos = catalog.filter(photo => photo.category === category);
        const events = new Set(photos.map(photo => photo.eventKey));
        const row = document.querySelector('[data-category="' + category + '"]');
        row.querySelector(".photo-count").textContent = photos.length;
        row.querySelector(".event-count").textContent = events.size;
    }
}

async function loadPhotos() {
    const gallery = document.querySelector("[data-gallery]");
    const table = document.querySelector("#gallery-table");
    try {
        const response = await fetch(new URL("photos.json", photoRoot));
        if (!response.ok) throw new Error("Photo index unavailable");
        const catalog = await response.json();
        if (gallery) renderGallery(gallery, catalog);
        updateHero(catalog);
        if (table) updateTable(catalog);
    } catch {
        const message = "Photos could not load. Open the published site or use the local preview steps in the README.";
        if (gallery) gallery.replaceChildren(element("p", message, "empty"));
        if (table) document.querySelector("#table-status").textContent = message;
    }
}

loadPhotos();
