//
import "./x-item-preview.js";
import "./x-item.js";
import "./x-review.js";

//
const identifier = new URL(location.href).searchParams.get("item");

if (identifier === null || identifier.length === 0) {
    // id item param isnt found, show the home page
    document.getElementById("no_item").style.display = "block";
}
else {
    // if item param is found, create an item element and append it to page
    // dont use innerHTML += to prevent XSS injection
    const el = document.createElement("x-item");
    el.setAttribute("ident", identifier);
    const x = document.getElementById("show_item");
    x.appendChild(el);
    x.style.display = "block";
}
