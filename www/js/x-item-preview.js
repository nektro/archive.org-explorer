// x-item-preview
//
import { LitElement, html, css } from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

customElements.define("x-item-preview", class extends LitElement {
    constructor() {
        super();
    }
    async connectedCallback() {
        super.connectedCallback();
        await fetch(`https://archive.org/metadata/${this.ident}`)
        .then((x) => x.json())
        .then((x) => {
            // dont need to check if this is valid because it is only instantiated with valid IDs
            this.title = x.metadata.title;
            this.description = x.metadata.description;
        });
    }
    static get properties() {
        return {
            ident: { type: String },
            title: { type: String },
            description: { type: String },
            vertical: { type: Boolean },
        };
    }
    static get styles() {
        return css`
            :root {
                --x-item-preview-direction: row;
            }
            main {
                display: flex;
                flex-direction: var(--x-item-preview-direction);
                align-items: center;
                border: 1px solid rgba(0, 0, 0, .2);
                height: 100%;
            }
            main >* {
                padding: .5em;
                display: block;
            }
            main >div {
                max-width: 75%;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            main div h2 {
                margin-bottom: .2em;
            }
            main code {
                background-color: rgb(27 31 35 / 5%);
                border-radius: 6px;
                font-size: 85%;
                padding: 0.2em 0.4em;
                white-space: nowrap;
            }
        `;
    }
    render() {
        return html`
            <main>
                <img src="https://archive.org/services/img/${this.ident}">
                <div>
                    <h2>${this.title}</h2>
                    <div><a href="./?item=${this.ident}" title="${this.ident}"><code>${this.ident}</code></a></div>
                    <hr>
                    <p>${html([this.description])}</h2>
                </div>
            </main>
        `;
    }
});
