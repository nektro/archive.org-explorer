// x-item
//
import { LitElement, html, css } from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

customElements.define("x-item", class extends LitElement {
    constructor() {
        super();
    }
    async connectedCallback() {
        super.connectedCallback();
        await fetch(`https://be-api.us.archive.org/mds/v1/get_related/all/${this.ident}`)
        .then((x) => x.json())
        .then((x) => {
            this.r = x;
        });
        await fetch(`https://archive.org/metadata/${this.ident}`)
        .then((x) => x.json())
        .then((x) => {
            // - checking if x == {} since metadata api doesnt return 404 for non-items
            // - response time on this api is also very slow (~2s) so there's unfortunately
            //     white space while we wait
            if (Object.entries(x).length === 0) {
                this.d = null;
                return;
            }
            this.d = x;
        });
    }
    static get properties() {
        return {
            ident: { type: String },
            d: { attribute: false },
            r: { attribute: false },
        };
    }
    static get styles() {
        return css`
            main {
                display: flex;
                flex-direction: column;
            }
            main >.video {
                width: 100%;
                background-color: black;
                display: flex;
                justify-content: center;
            }
            main hr {
                width: 100%;
                margin: 0;
            }
            main h3 {
                margin-bottom: 0;
            }
            main >.meta {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }
            main >.meta div:nth-child(1) {
                max-width: 80%;
                overflow-x: hidden;
            }
            main >.meta div:nth-child(2) {
                box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.75);
                border-radius: .5em;
                padding: 1em .5em;
                margin: 1em;
                height: max-content;
                background-color: #efefef;
            }
            main .related {
                display: flex;
                flex-direction: row;
                overflow-x: scroll;
                align-items: stretch;
            }
            main x-item-preview {
                display: block;
                margin: 1em 0;
                max-width: 15em;
                --x-item-preview-direction: column;
                max-height: 30em;
            }
        `;
    }
    render() {
        if (this.d === undefined) {
            // metadata api fetch hasnt finished yet
            return html``;
        }
        if (this.d === null) {
            // item was not found
            return html`
                <main>
                    <h2>Unfortunately, an item with the identifier "${this.ident}" could not be found.</h2>
                    <p>Here's a nice link to <a href="./">go back home</a>.</p>
                </main>
            `;
        }
        return html`
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.7/components/icon.min.css" integrity="sha512-I7/aUklkRw/Q5C9/7X2EH1jsng7oBb2P29tXv15+83/hu8qE0BZJyXmCX2u230RZlcf0oylQqmStJGCPxQpUQw==" crossorigin="anonymous" />
            <main>
                <div class="video">
                    <iframe src="https://archive.org/embed/${this.ident}" width="640" height="480" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen></iframe>
                </div>
                <div>
                <h2>${this.d.metadata.title}</h2>
                <p>${html([this.d.metadata.description])}</p>
                <hr>
                </div>
                <div class="meta">
                    <div>
                        <dl>${html([get_metadata(this.d.metadata)])}</dl>
                    </div>
                    <div>
                        <p>Created on:  ${new Date(this.d.created*1000).toDateString()}</p>
                        <p>Last Updated:  ${new Date(this.d.item_last_updated*1000).toDateString()}</p>
                        <p>Total Size: ${btos(this.d.item_size)}</p>
                        <p>File Count: ${this.d.files.length}</p>
                        <p>Files: <a target="_blank" href="https://archive.org/download/${this.ident}">Show all <i class="external alternate icon"></i></a>
                        <p>Reviews: ${this.d.reviews?.length | 0}</p>
                        <p>Average Rating: ${this.reviews === undefined ? 0 : this.d.reviews.reduce((p,c)=>p+parseInt(c.stars,10),0)/this.d.reviews.length} <i class="star icon"></i></p>
                    </div>
                </div>
                <hr>
                <h3>Reviews</h3>
                <div class="reviews">${html([get_reviews(this.d.reviews)])}</div>
                <hr>
                <h3>Related Items</h3>
                <div class="related">${html([get_related(this.r.hits.hits)])}</div>
            </main>
        `;
    }
});

function get_metadata(metad) {
    return Object.keys(metad).reduce((p,c) => {
        switch (c) {
            case "identifier":
            case "title":
            case "description":
            case "ia_orig__runtime":
            case "backup_location":
                return p;
            default:
                const k = `<dt>${get_metadata_key_name(c)}</dt>`;
                const v = get_metadata_value(metad[c]);
                return p + k + v;
        }
    }, "");
}

/**
 * @param {string} key
 */
function get_metadata_key_name(key) {
    key = key[0].toUpperCase() + key.substring(1);
    if (key.endsWith("date")) { key = key.replace(new RegExp("date$"), " Date"); }
    switch (key) {
        case "Mediatype": return "Media Type";
        default:
            return key;
    }
}

/**
 * @param {String|Array<String>} val
 */
function get_metadata_value(val) {
    if (typeof val === "string") {
        return `<dd>${val}</dd>`;
    }
    return [...new Set(val).values()].reduce((p,c) => {
        return p + `<dd>${c}</dd>`;
    }, "")
}

function btos(bytes) {
    const convert = (input, unit, base, prefixes) => {
        if (input < unit) {
            return `${unit} ${base}`;
        }
        let div = unit;
        let exp = 0;
        for (let n = input / unit; n >= unit; n /= unit) {
            div *= unit
            exp++
        }
        return (input/div).toFixed(1) + " " + prefixes[exp] + base;
    };
    return convert(bytes, 1024, "B", "KMGTPEZY")
}

function get_reviews(list) {
    if (list === undefined) {
        return "<p>None.</p>";
    }
    return list.reduce((p,c) => {
        return p + `
            <x-review
                date="${c.reviewdate}"
                user="${c.reviewer}"
                stars="${c.stars}"
                title="${c.reviewtitle}"
                descr="${c.reviewbody}"
            ></x-review>
        `;
    }, "")
}

function get_related(list) {
    return list.reduce((p,c) => {
        return p + `<x-item-preview ident="${c._id}" vertical="true"></x-item-preview>`;
    }, "")
}
