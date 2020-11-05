//
import "./x-item-preview.js";
import "./x-item.js";
import "./x-review.js";

//
const identifier = new URL(location.href).searchParams.get("item");

if (identifier === null || identifier.length === 0) {
    document.getElementById("no_item").style.display = "block";
}
else {
    const el = document.createElement("x-item");
    el.setAttribute("ident", identifier);
    const x = document.getElementById("show_item");
    x.appendChild(el);
    x.style.display = "block";
}
