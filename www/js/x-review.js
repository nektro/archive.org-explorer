// x-review
//
import { LitElement, html, css } from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

customElements.define("x-review", class extends LitElement {
    constructor() {
        super();
    }
    static get properties() {
        return {
            date: { type: String },
            user: { type: String },
            stars: { type: Number },
            title: { type: String },
            descr: { type: String },
        };
    }
    static get styles() {
        return css`
            main {
                display: grid;
                box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.75);
                border-radius: .5em;
                padding: 1em;
                margin: 1em;
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: 1em 1em 1fr;
                grid-row-gap: .5em;
            }
            main div:nth-child(1) {
                grid-column: 1 / 2;
                grid-row: 1 / 2;
            }
            main div:nth-child(2) {
                grid-column: 2 / 3;
                grid-row: 1 / 2;
            }
            main div:nth-child(3) {
                grid-column: 3 / 4;
                grid-row: 1 / 2;
            }
            main div:nth-child(4) {
                grid-column: 1 / 4;
                grid-row: 2 / 3;
            }
            main div:nth-child(5) {
                grid-column: 1 / 4;
                grid-row: 3 / 4;
            }
        `;
    }
    render() {
        return html`
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.7/components/icon.min.css" integrity="sha512-I7/aUklkRw/Q5C9/7X2EH1jsng7oBb2P29tXv15+83/hu8qE0BZJyXmCX2u230RZlcf0oylQqmStJGCPxQpUQw==" crossorigin="anonymous" />
            <main>
                <div>${this.date}</div>
                <div><a href="https://archive.org/details/%40${this.user.toLowerCase().replace(" ", "_")}">@${this.user}</a></div>
                <div>${html([`<i class="star icon"></i>`.repeat(this.stars)])}</div>
                <div><strong>Subject:</strong> ${this.title}</div>
                <div>${this.descr}</div>
            </main>
        `;
    }
});
