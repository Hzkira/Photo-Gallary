const form = document.querySelector("#photo-note");
const filenameInput = document.querySelector("#filename");
const altInput = document.querySelector("#alt");
const statusMessage = document.querySelector("#note-status");

filenameInput.addEventListener("input", () => filenameInput.setCustomValidity(""));
altInput.addEventListener("input", () => altInput.setCustomValidity(""));

form.addEventListener("submit", event => {
    event.preventDefault();
    statusMessage.textContent = "";
    const data = new FormData(form);
    const filename = data.get("filename").trim();
    const alt = data.get("alt").trim();

    if (!/^[^/\\]+\.(jpe?g|png|webp|avif|gif)$/i.test(filename) || filename.startsWith(".")) {
        filenameInput.setCustomValidity("Enter the photo filename, including its extension, without a folder path.");
        filenameInput.reportValidity();
        return;
    }

    if (!alt) {
        altInput.setCustomValidity("Write a short description of what is visible.");
        altInput.reportValidity();
        return;
    }

    const note = {
        title: data.get("title").trim(),
        caption: data.get("caption").trim(),
        alt: alt,
        date: data.get("date"),
        favorite: data.has("favorite")
    };
    const file = new Blob([JSON.stringify(note, null, 2) + "\n"], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename + ".json";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    statusMessage.textContent = "Download requested for " + filename + ".json. Save it beside the photo, then commit both files.";
});
