//

//
const identifier = new URL(location.href).searchParams.get("item");

if (identifier === null || identifier.length === 0) {
    document.getElementById("no_item").style.display = "block";
}
